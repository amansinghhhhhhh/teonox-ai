import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    AlertOctagon,
    CheckCircle2,
    XCircle,
    GraduationCap,
    Briefcase,
    Building2,
    Users,
    Sparkles,
    Layers,
    Workflow,
    BookOpenCheck,
    ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMasterclass } from '@/components/MasterclassProvider';
import { GAP } from '@/constants/testIds';

const FAILURE_MODES = [
    {
        title: 'Too technical',
        body: 'Half the courses drown you in transformers, embeddings, and python. Great if you’re becoming an ML engineer. Not useful if you just want to do your job better.',
        icon: XCircle,
        color: '#EF4444',
    },
    {
        title: 'Too shallow',
        body: 'The other half show you ChatGPT screenshots and call it a day. You finish, feel inspired — but still can’t do real work with it on Monday.',
        icon: AlertOctagon,
        color: '#F59E0B',
    },
];

const TEONOX_DOES = [
    { title: 'We use the industry cookbook', body: 'We map the prompts, agents and workflows companies are actively using in 2026 — then teach you those.', icon: BookOpenCheck },
    { title: 'Outcomes, not screenshots', body: 'Every module ends with a real artefact: a working workflow you can ship the next day.', icon: Workflow },
    { title: 'Tools come and go', body: 'We teach the durable thinking behind tools so you outlast every model upgrade.', icon: Layers },
];

const AUDIENCES = [
    {
        key: 'students',
        icon: GraduationCap,
        title: 'Students',
        line: 'Stand out for internships and the first job.',
        body: 'You’re not behind — you’re early. Use AI to do projects that look like 3 years of experience.',
        bullets: [
            'Portfolio capstones in every course',
            'Internship-ready workflows',
            'Hinglish, friendly, low-jargon',
        ],
    },
    {
        key: 'professionals',
        icon: Briefcase,
        title: 'Working professionals',
        line: 'Don’t get replaced. Get promoted.',
        body: 'Your role won’t be killed by AI — it’ll be killed by someone using AI. Become that someone.',
        bullets: [
            'Function-specific AI playbooks',
            'Save 10+ hrs/week with agents',
            'Lead AI projects at your company',
        ],
    },
    {
        key: 'business_owners',
        icon: Building2,
        title: 'Business owners',
        line: 'Run leaner. Ship more. Hire smarter.',
        body: 'Don’t outsource what AI can do for ₹zero. Learn the systems your competitors won’t.',
        bullets: [
            'Marketing + ops automations',
            'D2C-tested workflows',
            'Hire “AI-native” teammates with confidence',
        ],
    },
    {
        key: 'parents',
        icon: Users,
        title: 'Parents',
        line: 'Give your child a real head-start.',
        body: 'Most school AI classes are theory. Teonox teaches the same skills creators and entrepreneurs use.',
        bullets: [
            'Safe, parent-friendly curriculum',
            'Project-led: kids build real things',
            'Mentor support + parent updates',
        ],
    },
];

export default function GapPage() {
    const { open } = useMasterclass();
    return (
        <div data-testid={GAP.page}>
            {/* HERO */}
            <section className="relative section-paper pt-16 sm:pt-20 pb-12 sm:pb-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
                    <div className="lg:col-span-8">
                        <Badge className="bg-[#FFEDD5] text-[#9A3412] hover:bg-[#FFEDD5]">The Gap</Badge>
                        <h1 className="font-display mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-slate-900">
                            Most AI courses are <span className="gradient-orange-text">half-complete.</span>
                        </h1>
                        <p className="mt-5 text-slate-600 text-base sm:text-lg max-w-2xl">
                            Either they drown you in tools, or they skip the workflows real companies use. We know how the
                            industry works — we only teach what people who&apos;ve adapted to AI are actually doing.
                        </p>
                    </div>
                    <div className="lg:col-span-4 text-sm text-slate-500 italic">
                        “You don’t need more tools. You need a workflow.”
                    </div>
                </div>
            </section>

            {/* FAILURE MODES */}
            <section className="section-mist py-12 sm:py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {FAILURE_MODES.map((f) => {
                            const Icon = f.icon;
                            return (
                                <motion.div
                                    key={f.title}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="rounded-2xl bg-white border border-slate-200 p-6 shadow-[0_10px_30px_rgba(2,6,23,0.05)]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-xl grid place-items-center"
                                            style={{ background: f.color + '14', color: f.color }}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-display text-xl font-semibold text-slate-900">{f.title}</h3>
                                    </div>
                                    <p className="mt-3 text-slate-600">{f.body}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* What Teonox does */}
                    <div className="mt-12">
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                            What Teonox does differently.
                        </h2>
                        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                            {TEONOX_DOES.map((d) => {
                                const Icon = d.icon;
                                return (
                                    <div
                                        key={d.title}
                                        className="rounded-2xl bg-white border border-slate-200 p-5 shadow-[0_10px_30px_rgba(2,6,23,0.05)]"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 grid place-items-center">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h4 className="font-display text-lg font-semibold text-slate-900 mt-3">{d.title}</h4>
                                        <p className="text-sm text-slate-600 mt-1">{d.body}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* AUDIENCE BENTO */}
            <section data-testid={GAP.audienceCards} className="section-paper py-16 sm:py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-500">Built for you</span>
                    <h2 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
                        Whoever you are — we have a path.
                    </h2>
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {AUDIENCES.map((a) => {
                            const Icon = a.icon;
                            return (
                                <motion.div
                                    key={a.key}
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.5 }}
                                    className="rounded-2xl bg-white border border-slate-200 p-6 shadow-[0_10px_30px_rgba(2,6,23,0.05)] tilt"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-xl bg-[#FFF1E2] text-[#FF6A00] grid place-items-center">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-display text-xl font-semibold text-slate-900">{a.title}</h3>
                                            <p className="text-sm text-[#FF6A00] font-medium">{a.line}</p>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-slate-600">{a.body}</p>
                                    <ul className="mt-3 space-y-1.5">
                                        {a.bullets.map((b, i) => (
                                            <li key={i} className="text-sm text-slate-700 flex gap-2">
                                                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600" />
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA strip */}
            <section className="section-mist py-12 sm:py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl bg-[#0B0F14] text-white p-8 sm:p-10 relative overflow-hidden noise-overlay">
                        <div className="orb orb-orange" style={{ width: 320, height: 320, top: -120, right: -100 }} />
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                            <div className="lg:col-span-8">
                                <h3 className="font-display text-2xl sm:text-3xl font-bold">
                                    Tell us your goal. We&apos;ll build you a path.
                                </h3>
                                <p className="text-white/70 mt-2 max-w-xl">
                                    Chat with our AI Course Consultant — it asks 3-4 questions and ranks our 7 courses for
                                    your exact situation.
                                </p>
                            </div>
                            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                                <Link to="/courses" className="sm:flex-1 lg:flex-none">
                                    <Button className="w-full h-12 bg-[#FF6A00] hover:bg-[#E85F00] text-white rounded-xl">
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Start AI Consultant
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => open('gap_cta')}
                                    variant="secondary"
                                    className="w-full h-12 bg-white/10 hover:bg-white/15 border border-white/15 text-white rounded-xl"
                                >
                                    Join Free Masterclass
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
