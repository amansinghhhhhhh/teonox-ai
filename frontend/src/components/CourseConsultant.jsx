import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Sparkles, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ChatThread, ChatBubble, TypingBubble } from './ChatPrimitives';
import { MatchBadge } from './MatchBadge';
import { AUDIENCE_OPTIONS } from '@/lib/courses';
import { COURSES } from '@/constants/testIds';
import { consultantMessage, consultantReset } from '@/lib/api';
import { toast } from 'sonner';
import { useMasterclass } from './MasterclassProvider';
import { Clock, BarChart3, ChevronRight } from 'lucide-react';

const QUICK_PROMPTS = [
    'I want to save time on Instagram',
    'I want to land an AI-related internship',
    'Help me grow my D2C brand',
    'I want to learn AI from scratch',
];

export const CourseConsultant = ({ courses = [] }) => {
    const [step, setStep] = useState('audience'); // 'audience' | 'chat'
    const [audience, setAudience] = useState('professional');
    const [specialization, setSpecialization] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [messages, setMessages] = useState([]); // { role, text }
    const [ranking, setRanking] = useState([]); // [{course_id, match_percentage, label, reason}]
    const [input, setInput] = useState('');
    const [busy, setBusy] = useState(false);
    const inputRef = useRef(null);
    const { open: openMasterclass } = useMasterclass();

    // Sort courses by ranking when present, else by id order.
    const orderedCourses = useMemo(() => {
        if (!courses.length) return [];
        if (!ranking.length) return courses;
        const byId = new Map(courses.map((c) => [c.id, c]));
        const ranked = ranking.map((r) => ({ ...byId.get(r.course_id), match: r }));
        return ranked.filter(Boolean);
    }, [courses, ranking]);

    const sendTurn = async (text) => {
        const userText = text.trim();
        if (!userText || busy) return;
        setMessages((m) => [...m, { role: 'user', text: userText }]);
        setInput('');
        setBusy(true);
        try {
            const isFirst = messages.length === 0;
            const res = await consultantMessage({
                session_id: sessionId,
                audience_type: audience,
                specialization,
                message: userText,
                is_first_turn: isFirst,
            });
            setSessionId(res.session_id);
            setMessages((m) => [...m, { role: 'assistant', text: res.assistant_message }]);
            if (Array.isArray(res.course_ranking)) setRanking(res.course_ranking);
        } catch (err) {
            console.error(err);
            toast.error('AI is taking a breath. Try again.');
            setMessages((m) => [...m, { role: 'assistant', text: 'Sorry, my brain hiccupped. Try once more?' }]);
        } finally {
            setBusy(false);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    };

    const startChat = () => {
        if (!audience) return;
        setStep('chat');
        // No initial AI message until the user sends their first specialization/goal.
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
        setStep('audience');
        setSpecialization('');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chat pane */}
            <section className="lg:col-span-7 xl:col-span-7">
                <div className="rounded-2xl bg-white border border-slate-200 shadow-[0_10px_30px_rgba(2,6,23,0.05)] overflow-hidden flex flex-col min-h-[520px]">
                    <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-200 bg-white">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#FF6A00]/12 text-[#FF6A00] grid place-items-center">
                                <Sparkles className="w-3.5 h-3.5" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-900">AI Course Consultant</div>
                                <div className="text-xs text-slate-500">Powered by Claude Sonnet 4.5</div>
                            </div>
                        </div>
                        {step === 'chat' && (
                            <button
                                type="button"
                                onClick={resetSession}
                                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-50"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Restart
                            </button>
                        )}
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 'audience' ? (
                            <motion.div
                                key="audience"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="p-5 sm:p-6 flex-1"
                                data-testid={COURSES.audienceSelector}
                            >
                                <h3 className="font-display text-xl sm:text-2xl font-semibold text-slate-900">
                                    Pehle batao — aap kaun ho?
                                </h3>
                                <p className="text-slate-600 mt-1">
                                    We&apos;ll personalise course recommendations to your exact situation.
                                </p>
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {AUDIENCE_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setAudience(opt.value)}
                                            className={`text-left rounded-xl border px-4 py-3 transition-colors ${
                                                audience === opt.value
                                                    ? 'border-[#FF6A00] bg-[#FFF7EE] text-slate-900'
                                                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="text-sm font-semibold">{opt.label}</div>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-5">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Your specialization / field (optional)
                                    </label>
                                    <input
                                        value={specialization}
                                        onChange={(e) => setSpecialization(e.target.value)}
                                        placeholder="e.g. digital marketing, BCom 2nd year, D2C brand owner"
                                        className="w-full h-12 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/40"
                                    />
                                </div>

                                <Button
                                    data-testid={COURSES.audienceContinue}
                                    onClick={startChat}
                                    className="mt-5 w-full sm:w-auto bg-[#FF6A00] hover:bg-[#E85F00] text-white rounded-xl px-5 h-12"
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
                                <ChatThread testId={COURSES.chatThread} className="min-h-[360px] max-h-[440px]">
                                    {messages.length === 0 && (
                                        <div className="text-sm text-slate-500">
                                            <p className="mb-3">
                                                Hi! Tell me about your goal. Try one of these or type your own:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {QUICK_PROMPTS.map((p) => (
                                                    <button
                                                        key={p}
                                                        type="button"
                                                        onClick={() => sendTurn(p)}
                                                        className="text-xs rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-slate-700"
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {messages.map((m, i) => (
                                        <ChatBubble key={i} role={m.role}>{m.text}</ChatBubble>
                                    ))}
                                    {busy && <TypingBubble />}
                                </ChatThread>

                                <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-200 p-3">
                                    <div className="flex items-end gap-2">
                                        <Textarea
                                            ref={inputRef}
                                            data-testid={COURSES.chatInput}
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    sendTurn(input);
                                                }
                                            }}
                                            placeholder="Tell me your goal or paste a job description…"
                                            rows={1}
                                            className="min-h-[44px] max-h-[140px] rounded-xl resize-none"
                                        />
                                        <Button
                                            data-testid={COURSES.chatSend}
                                            disabled={busy || !input.trim()}
                                            onClick={() => sendTurn(input)}
                                            className="h-11 px-4 bg-[#FF6A00] hover:bg-[#E85F00] text-white rounded-xl"
                                        >
                                            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Course shelf */}
            <aside className="lg:col-span-5 xl:col-span-5">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-lg font-semibold text-slate-900">Recommended courses</h3>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">
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
                                    transition={{ layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
                                    className="rounded-2xl bg-white border border-slate-200 p-4 shadow-[0_6px_20px_rgba(2,6,23,0.05)]"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="text-base sm:text-lg font-display font-semibold text-slate-900 leading-snug">
                                                {c.title}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-0.5">{c.subtitle}</div>
                                        </div>
                                        {match && (
                                            <MatchBadge percentage={match.match_percentage} label={match.label} />
                                        )}
                                    </div>

                                    <div className="mt-3 flex items-center gap-3 text-xs text-slate-600">
                                        <span className="inline-flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {c.duration}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <BarChart3 className="w-3.5 h-3.5" />
                                            {c.level}
                                        </span>
                                        <span className="ml-auto inline-flex items-center gap-2">
                                            <span className="text-slate-900 font-semibold">₹{c.price_inr.toLocaleString('en-IN')}</span>
                                            <span className="line-through text-slate-400">₹{c.original_price_inr.toLocaleString('en-IN')}</span>
                                        </span>
                                    </div>

                                    {match?.reason && (
                                        <p className="mt-3 text-xs text-slate-600 bg-slate-50 rounded-lg p-2.5">
                                            <span className="font-semibold text-slate-700">Why:</span> {match.reason}
                                        </p>
                                    )}

                                    <div className="mt-3 flex items-center justify-end">
                                        <button
                                            type="button"
                                            onClick={() => openMasterclass('consultant_card_' + c.id)}
                                            className="text-xs font-semibold text-[#FF6A00] hover:text-[#E85F00] inline-flex items-center gap-1"
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
