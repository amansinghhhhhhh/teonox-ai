import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, RotateCcw, Sparkles, ArrowRight, ShieldAlert, Lightbulb, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ChatThread, ChatBubble, TypingBubble } from './ChatPrimitives';
import { JobRiskDial } from './JobRiskDial';
import { JOBRISK } from '@/constants/testIds';
import { jobRiskMessage, jobRiskReset } from '@/lib/api';
import { toast } from 'sonner';
import { SEVERITY_COLORS } from '@/lib/courses';
import { useMasterclass } from './MasterclassProvider';

const SAMPLE_ROLES = [
    'Social media manager',
    'SEO content writer',
    'Graphic designer',
    'Customer support agent',
    'Accounts executive',
];

export const JobRiskChat = ({ courses = [] }) => {
    const [step, setStep] = useState('role'); // 'role' | 'chat'
    const [role, setRole] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [risk, setRisk] = useState(null); // {probability, severity, headline, reasons[], safe_zones[], recommended_courses[]}
    const [confidence, setConfidence] = useState(0);
    const [input, setInput] = useState('');
    const [busy, setBusy] = useState(false);
    const inputRef = useRef(null);
    const { open: openMasterclass } = useMasterclass();

    const courseById = (id) => courses.find((c) => c.id === id);

    const sendTurn = async (text) => {
        const t = text.trim();
        if (!t || busy) return;
        setMessages((m) => [...m, { role: 'user', text: t }]);
        setInput('');
        setBusy(true);
        try {
            const isFirst = messages.length === 0;
            const res = await jobRiskMessage({
                session_id: sessionId,
                role,
                message: t,
                is_first_turn: isFirst,
            });
            setSessionId(res.session_id);
            setMessages((m) => [...m, { role: 'assistant', text: res.assistant_message }]);
            setRisk(res.risk || null);
            setConfidence(res.confidence || 0);
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
        if (!role.trim()) return;
        setStep('chat');
        setMessages([]);
        setRisk(null);
        setConfidence(0);
    };

    const resetSession = async () => {
        try {
            if (sessionId) await jobRiskReset(sessionId);
        } catch {
            /* swallow */
        }
        setSessionId(null);
        setMessages([]);
        setRisk(null);
        setConfidence(0);
        setStep('role');
        setRole('');
    };

    const sev = risk ? SEVERITY_COLORS[risk.severity] || SEVERITY_COLORS.low : SEVERITY_COLORS.low;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chat pane */}
            <section className="lg:col-span-7">
                <div className="rounded-2xl bg-white border border-slate-200 shadow-[0_10px_30px_rgba(2,6,23,0.05)] overflow-hidden flex flex-col min-h-[520px]">
                    <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-200 bg-white">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#FF6A00]/12 text-[#FF6A00] grid place-items-center">
                                <Sparkles className="w-3.5 h-3.5" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-900">AI aapki Job legi?</div>
                                <div className="text-xs text-slate-500">Honest risk read, with a way forward.</div>
                            </div>
                        </div>
                        {step === 'chat' && (
                            <button
                                type="button"
                                data-testid={JOBRISK.resetButton}
                                onClick={resetSession}
                                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-50"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Restart
                            </button>
                        )}
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 'role' ? (
                            <motion.div
                                key="role"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="p-5 sm:p-6"
                            >
                                <h3 className="font-display text-xl sm:text-2xl font-semibold text-slate-900">
                                    Tell us your role. We&apos;ll be honest.
                                </h3>
                                <p className="text-slate-600 mt-1">
                                    No alarmist drama. Just a clear, kind risk read — plus a path forward.
                                </p>
                                <input
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="e.g. Social media manager at a small agency"
                                    className="mt-4 w-full h-12 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/40"
                                />
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {SAMPLE_ROLES.map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setRole(r)}
                                            className="text-xs rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-slate-700"
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                                <Button
                                    onClick={startChat}
                                    disabled={!role.trim()}
                                    className="mt-5 w-full sm:w-auto bg-[#FF6A00] hover:bg-[#E85F00] text-white rounded-xl px-5 h-12"
                                >
                                    Begin honest assessment
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
                                <ChatThread testId={JOBRISK.chatThread} className="min-h-[360px] max-h-[440px]">
                                    {messages.length === 0 && (
                                        <div className="text-sm text-slate-500">
                                            <p>
                                                Start by sharing 2-3 tasks you do most days. Be specific (“I write 5 LinkedIn
                                                posts and reply to DMs” works great).
                                            </p>
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
                                            data-testid={JOBRISK.chatInput}
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    sendTurn(input);
                                                }
                                            }}
                                            placeholder="Describe your daily tasks, tools, and seniority…"
                                            rows={1}
                                            className="min-h-[44px] max-h-[140px] rounded-xl resize-none"
                                        />
                                        <Button
                                            data-testid={JOBRISK.chatSend}
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

            {/* Infographic pane */}
            <aside className="lg:col-span-5">
                <div
                    className="rounded-2xl bg-white border border-slate-200 p-5 shadow-[0_10px_30px_rgba(2,6,23,0.05)]"
                    style={{ borderTop: `4px solid ${sev.stroke}` }}
                >
                    <div className="flex flex-col items-center">
                        <JobRiskDial
                            probability={risk?.probability || 0}
                            severity={risk?.severity || 'low'}
                            headline={risk?.headline || 'Start the chat to assess your risk.'}
                            confidence={confidence}
                        />
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-4">
                        <div data-testid={JOBRISK.reasons}>
                            <div className="text-xs uppercase tracking-[0.16em] text-slate-500 mb-2 flex items-center gap-1.5">
                                <ShieldAlert className="w-3.5 h-3.5" />
                                Reasons
                            </div>
                            <ul className="space-y-2">
                                {(risk?.reasons || []).map((r, i) => (
                                    <li key={i} className="text-sm text-slate-700 flex gap-2">
                                        <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: sev.stroke }} />
                                        {r}
                                    </li>
                                ))}
                                {!risk && (
                                    <li className="text-sm text-slate-400">Will appear after first message…</li>
                                )}
                            </ul>
                        </div>

                        <div data-testid={JOBRISK.safeZones}>
                            <div className="text-xs uppercase tracking-[0.16em] text-slate-500 mb-2 flex items-center gap-1.5">
                                <Lightbulb className="w-3.5 h-3.5" />
                                Safe zones / leverage
                            </div>
                            <ul className="space-y-2">
                                {(risk?.safe_zones || []).map((s, i) => (
                                    <li key={i} className="text-sm text-slate-700 flex gap-2">
                                        <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-2 bg-emerald-500" />
                                        {s}
                                    </li>
                                ))}
                                {!risk?.safe_zones?.length && (
                                    <li className="text-sm text-slate-400">Coming up as we chat…</li>
                                )}
                            </ul>
                        </div>

                        <div data-testid={JOBRISK.recommendations}>
                            <div className="text-xs uppercase tracking-[0.16em] text-slate-500 mb-2 flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5" />
                                Courses that move you forward
                            </div>
                            <div className="space-y-2">
                                {(risk?.recommended_courses || []).map((r, i) => {
                                    const c = courseById(r.course_id);
                                    if (!c) return null;
                                    return (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => openMasterclass('jobrisk_rec_' + r.course_id)}
                                            className="text-left w-full rounded-xl border border-slate-200 hover:border-[#FF6A00]/50 bg-white p-3 transition-colors"
                                        >
                                            <div className="text-sm font-semibold text-slate-900">{c.title}</div>
                                            <div className="text-xs text-slate-600 mt-1">{r.why}</div>
                                        </button>
                                    );
                                })}
                                {!risk?.recommended_courses?.length && (
                                    <div className="text-sm text-slate-400">Will appear after first message…</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default JobRiskChat;
