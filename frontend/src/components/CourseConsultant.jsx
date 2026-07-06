import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader2,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Clock,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { ChatThread, ChatBubble, TypingBubble } from "./ChatPrimitives";
import { MatchBadge } from "./MatchBadge";
import { AUDIENCE_OPTIONS } from "@/lib/courses";
import { COURSES } from "@/constants/testIds";
import { consultantMessage, consultantReset } from "@/lib/api";
import { toast } from "sonner";
import { useMasterclass } from "./MasterclassProvider";

const QUICK_PROMPTS = [
  "I want to save time on Instagram",
  "I want to land an AI-related internship",
  "Help me grow my D2C brand",
  "I want to learn AI from scratch",
];

const VAGUE_MESSAGES = new Set([
  "hi",
  "hello",
  "hey",
  "help",
  "yes",
  "yeah",
  "ok",
  "okay",
  "idk",
  "i don't know",
  "not sure",
  "ai",
]);

const wordCount = (text) => (text.match(/[A-Za-z0-9]+/g) || []).length;

const isUnderqualifiedCourseMessage = (text) => {
  const value = text.trim().toLowerCase();
  if (VAGUE_MESSAGES.has(value)) return true;
  if (value.length < 18 || wordCount(value) < 4) return true;
  const signals = [
    "want",
    "need",
    "learn",
    "save",
    "grow",
    "job",
    "career",
    "business",
    "brand",
    "marketing",
    "design",
    "seo",
    "internship",
    "course",
    "skill",
    "ai",
    "work",
    "content",
    "sales",
    "instagram",
    "linkedin",
  ];
  return !signals.some((signal) => value.includes(signal));
};

const aiErrorDetail = (err) => err?.response?.data?.detail;

export const CourseConsultant = ({ courses = [] }) => {
  const [step, setStep] = useState("audience");
  const [audience, setAudience] = useState("professional");
  const [specialization, setSpecialization] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);
  const { open: openMasterclass } = useMasterclass();

  const orderedCourses = useMemo(() => {
    if (!courses.length) return [];
    if (!ranking.length) return courses;
    const byId = new Map(courses.map((c) => [c.id, c]));
    return ranking
      .map((r) => ({ ...byId.get(r.course_id), match: r }))
      .filter(Boolean);
  }, [courses, ranking]);

  const sendTurn = async (text) => {
    const userText = text.trim();
    if (!userText || busy) return;
    const isFirst = messages.length === 0;
    setMessages((m) => [...m, { role: "user", text: userText }]);
    setInput("");
    if (isFirst && isUnderqualifiedCourseMessage(userText)) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Tell me one goal or pain point first, like saving time on Instagram, getting an internship, or growing your business. Then I can recommend properly.",
        },
      ]);
      return;
    }
    setBusy(true);
    try {
      const res = await consultantMessage({
        session_id: sessionId,
        audience_type: audience,
        specialization,
        message: userText,
        is_first_turn: isFirst,
      });
      setSessionId(res.session_id);
      setMessages((m) => [
        ...m,
        { role: "assistant", text: res.assistant_message },
      ]);
      if (Array.isArray(res.course_ranking)) setRanking(res.course_ranking);
    } catch (err) {
      console.error(err);
      const detail = aiErrorDetail(err);
      if (
        detail?.code === "feature_daily_limit" &&
        detail?.usage?.lead_required
      ) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            text: "I can keep refining this after you reserve your free seat.",
          },
        ]);
        openMasterclass("course_consultant_ai_limit");
        return;
      }
      if (detail?.code) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            text: detail.message || "Please wait a little before continuing.",
          },
        ]);
        return;
      }
      toast.error("AI is taking a breath. Try again.");
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Sorry, my brain hiccupped. Try once more?",
        },
      ]);
    } finally {
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const startChat = () => {
    if (!audience) return;
    setStep("chat");
    setMessages([]);
    setRanking([]);
  };

  const resetSession = async () => {
    try {
      if (sessionId) await consultantReset(sessionId);
    } catch {
      /* swallow */
    }
    setSessionId(null);
    setMessages([]);
    setRanking([]);
    setStep("audience");
    setSpecialization("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Chat pane */}
      <section className="lg:col-span-7">
        <div className="rounded-3xl card-elev overflow-hidden flex flex-col min-h-[540px]">
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/8 bg-[#0B1334]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#E85F00]/15 text-[#FF7A1A] grid place-items-center border border-[#E85F00]/30">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  AI Course Consultant
                </div>
                <div className="text-xs text-ink-3">
                  Personalized course guidance
                </div>
              </div>
            </div>
            {step === "chat" && (
              <button
                type="button"
                onClick={resetSession}
                className="inline-flex items-center gap-1.5 text-xs text-ink-3 hover:text-white px-2 py-1 rounded-md hover:bg-white/8"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restart
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {step === "audience" ? (
              <motion.div
                key="audience"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-5 sm:p-6 flex-1"
                data-testid={COURSES.audienceSelector}
              >
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-white">
                  Tell us about yourself
                </h3>
                <p className="text-ink-2 mt-1">
                  We&apos;ll personalise course recommendations to your exact
                  situation.
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AUDIENCE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAudience(opt.value)}
                      className={`text-left rounded-xl border px-4 py-3 transition-colors ${
                        audience === opt.value
                          ? "border-[#E85F00] bg-[#E85F00]/10 text-white"
                          : "border-white/10 bg-white/3 text-ink-1 hover:bg-white/8"
                      }`}
                    >
                      <div className="text-sm font-semibold">{opt.label}</div>
                    </button>
                  ))}
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-medium text-ink-2 mb-1">
                    Your specialization / field (optional)
                  </label>
                  <input
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. digital marketing, BCom 2nd year, D2C brand owner"
                    className="w-full h-12 rounded-xl border border-white/12 bg-white/5 text-white placeholder:text-ink-3 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85F00]/40"
                  />
                </div>

                <Button
                  data-testid={COURSES.audienceContinue}
                  onClick={startChat}
                  className="mt-5 w-full sm:w-auto bg-[#E85F00] hover:bg-[#FF7A1A] text-white rounded-xl px-5 h-12 btn-orange-glow"
                >
                  Start chat
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col"
              >
                <ChatThread
                  testId={COURSES.chatThread}
                  className="min-h-[380px] max-h-[460px]"
                >
                  {messages.length === 0 && (
                    <div className="text-sm text-ink-3">
                      <p className="mb-3">
                        Hi! Tell me about your goal. Try one of these or type
                        your own:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {QUICK_PROMPTS.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => sendTurn(p)}
                            className="text-xs rounded-full border border-white/12 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-ink-2 hover:text-white"
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {messages.map((m, i) => (
                    <ChatBubble key={i} role={m.role}>
                      {m.text}
                    </ChatBubble>
                  ))}
                  {busy && <TypingBubble />}
                </ChatThread>

                <div className="sticky bottom-0 bg-[#0B1334]/95 backdrop-blur border-t border-white/8 p-3">
                  <div className="flex items-end gap-2">
                    <Textarea
                      ref={inputRef}
                      data-testid={COURSES.chatInput}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendTurn(input);
                        }
                      }}
                      placeholder="Tell me your goal or paste a job description…"
                      rows={1}
                      className="min-h-[44px] max-h-[140px] rounded-xl resize-none bg-white/5 border-white/12 text-white placeholder:text-ink-3"
                    />
                    <Button
                      data-testid={COURSES.chatSend}
                      disabled={busy || !input.trim()}
                      onClick={() => sendTurn(input)}
                      className="h-11 px-4 bg-[#E85F00] hover:bg-[#FF7A1A] text-white rounded-xl btn-orange-glow"
                    >
                      {busy ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Course shelf */}
      <aside className="lg:col-span-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg font-semibold text-white">
            Recommended courses
          </h3>
          <Badge className="bg-white/5 text-ink-2 border border-white/10 hover:bg-white/5">
            Live re-ranks
          </Badge>
        </div>
        <div data-testid={COURSES.shelf} className="space-y-3">
          <AnimatePresence initial={false}>
            {orderedCourses.map((c) => {
              const match = c.match;
              return (
                <motion.div
                  layout
                  key={c.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    layout: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                  }}
                  className="rounded-2xl card-elev p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-base sm:text-lg font-display font-semibold text-white leading-snug">
                        {c.title}
                      </div>
                      <div className="text-xs text-ink-3 mt-0.5">
                        {c.subtitle}
                      </div>
                    </div>
                    {match && (
                      <MatchBadge
                        percentage={match.match_percentage}
                        label={match.label}
                      />
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-xs text-ink-2">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {c.duration}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <BarChart3 className="w-3.5 h-3.5" />
                      {c.level}
                    </span>
                    <span className="ml-auto inline-flex items-center gap-2">
                      <span className="text-white font-semibold">
                        ₹{c.price_inr.toLocaleString("en-IN")}
                      </span>
                      <span className="line-through text-ink-4">
                        ₹{c.original_price_inr.toLocaleString("en-IN")}
                      </span>
                    </span>
                  </div>

                  {match?.reason && (
                    <p className="mt-3 text-xs text-ink-2 bg-white/4 rounded-lg p-2.5 border border-white/8">
                      <span className="font-semibold text-white">Why:</span>{" "}
                      {match.reason}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => openMasterclass("consultant_card_" + c.id)}
                      className="text-xs font-semibold text-[#FF7A1A] hover:text-[#FFA362] inline-flex items-center gap-1"
                    >
                      Reserve seat
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </aside>
    </div>
  );
};

export default CourseConsultant;
