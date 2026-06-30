import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Sparkles,
    ArrowRight,
    GraduationCap,
    Briefcase,
    Building2,
    Users,
    Gift,
    PlayCircle,
    Bot,
    Wand2,
    Workflow,
    ShieldCheck,
    Star,
    CheckCircle2,
    TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HeroOrbBackground } from '@/components/HeroOrbBackground';
import { useMasterclass } from '@/components/MasterclassProvider';
import { HOME } from '@/constants/testIds';

const AUDIENCE_CHIPS = [
    { icon: GraduationCap, label: 'Students' },
    { icon: Briefcase, label: 'Professionals' },
    { icon: Building2, label: 'Business owners' },
    { icon: Users, label: 'Parents' },
];

const CHAPTERS = [
    {
        kicker: 'Chapter 01',
        title: 'AI is in every job already.',
        body: 'From WhatsApp replies to ad campaigns, the people who use AI are quietly leaving others behind.',
        icon: TrendingUp,
    },
    {
        kicker: 'Chapter 02',
        title: 'Most courses are half-complete.',
        body: 'Some drown you in tools. Others stay too shallow. You finish them and still can’t do real work.',
        icon: Wand2,
    },
    {
        kicker: 'Chapter 03',
        title: 'Teonox teaches the workflows.',
        body: 'We pick the exact prompts, agents and systems companies actually use — then make you fluent in them.',
        icon: Workflow,
    },
    {
        kicker: 'Chapter 04',
        title: 'You leave with leverage.',
        body: 'A library of templates, an AI co-pilot for your role, and the confidence to lead AI projects.',
        icon: ShieldCheck,
    },
];

export default function HomePage() {
    const { open: openMasterclass } = useMasterclass();
    const { scrollYProgress } = useScroll();
    const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -40]);

    return (
        <>
            {/* HERO */}
            <section data-testid={HOME.hero} className="relative overflow-hidden">
                <HeroOrbBackground />
                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-28 pb-20 sm:pb-24">
                    <motion.div style={{ y: heroParallax }} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-7 text-white">
                            <motion.span
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/85"
                            >
                                <Sparkles className="w-3.5 h-3.5 text-[#FF8A3D]" />
                                AI seekho. Kaam pe lagao.
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.1 }}
                                className="font-display mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight"
                            >
                                Job-ready AI skills — <span className="gradient-orange-text">without the confusion.</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="mt-5 text-base sm:text-lg text-white/75 max-w-xl"
                            >
                                Students, professionals, business owners, parents — Teonox.ai gives you a clear path from
                                AI-illiterate to AI-literate, using the workflows real companies use.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                                className="mt-7 flex flex-col sm:flex-row gap-3"
                            >
                                <Button
                                    data-testid={HOME.heroPrimaryCta}
                                    onClick={() => openMasterclass('home_hero_primary')}
                                    className="h-12 bg-[#FF6A00] hover:bg-[#E85F00] active:bg-[#D45500] text-white rounded-xl text-base font-semibold shadow-[0_18px_40px_rgba(255,106,0,0.35)] px-5"
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Join Free Live Masterclass
                                </Button>
                                <Link to="/courses">
                                    <Button
                                        data-testid={HOME.heroSecondaryCta}
                                        variant="secondary"
                                        className="h-12 bg-white/10 hover:bg-white/15 border border-white/15 text-white rounded-xl text-base font-medium px-5"
                                    >
                                        Explore Courses
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mt-6 flex flex-wrap items-center gap-3 text-xs text-white/65"
                            >
                                {AUDIENCE_CHIPS.map((a) => {
                                    const Icon = a.icon;
                                    return (
                                        <span key={a.label} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                                            <Icon className="w-3.5 h-3.5 text-[#FF8A3D]" />
                                            {a.label}
                                        </span>
                                    );
                                })}
                            </motion.div>
                        </div>

                        {/* Right card: masterclass preview */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="lg:col-span-5"
                        >
                            <div className="relative rounded-2xl bg-white/95 backdrop-blur border border-white/30 p-5 sm:p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-[#FFEDD5] text-[#9A3412] hover:bg-[#FFEDD5]">
                                        <PlayCircle className="w-3.5 h-3.5 mr-1" />
                                        Live this Saturday
                                    </Badge>
                                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                                        Free
                                    </Badge>
                                </div>
                                <h3 className="font-display text-2xl text-slate-900 mt-3 leading-snug">
                                    AI Chatbots — the must-knows for students & professionals.
                                </h3>
                                <p className="text-slate-600 text-sm mt-2">
                                    A 90-minute walkthrough of the prompts, agents and templates that move you 5x faster.
                                </p>
                                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                                    {[
                                        { v: '90 min', l: 'Live' },
                                        { v: '₹50K', l: 'Resources' },
                                        { v: '7 days', l: 'Replay' },
                                    ].map((m) => (
                                        <div key={m.l} className="rounded-xl bg-slate-50 py-2.5">
                                            <div className="text-sm font-semibold text-slate-900">{m.v}</div>
                                            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{m.l}</div>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    onClick={() => openMasterclass('home_hero_card')}
                                    className="mt-5 w-full h-12 bg-[#0B0F14] hover:bg-black text-white rounded-xl text-base font-semibold"
                                >
                                    <Gift className="w-4 h-4 mr-2 text-[#FF8A3D]" />
                                    Get my free seat + ₹50K kit
                                </Button>
                                <p className="text-xs text-slate-500 mt-3 text-center">
                                    No spam. WhatsApp reminders only.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* SCROLL STORY */}
            <section data-testid={HOME.scrollStory} className="relative section-mist py-16 sm:py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <span className="text-xs uppercase tracking-[0.18em] text-slate-500">The story</span>
                        <h2 className="font-display mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                            From overwhelmed to in-demand — in 4 chapters.
                        </h2>
                        <p className="text-slate-600 mt-3">
                            Scroll through how Teonox.ai changes the way you think about AI.
                        </p>
                    </div>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        {CHAPTERS.map((c, i) => {
                            const Icon = c.icon;
                            return (
                                <motion.div
                                    key={c.kicker}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.35 }}
                                    transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                    className="tilt rounded-2xl bg-white p-6 border border-slate-200 shadow-[0_10px_30px_rgba(2,6,23,0.05)]"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] uppercase tracking-[0.18em] text-[#FF6A00] font-semibold">
                                            {c.kicker}
                                        </span>
                                        <div className="w-9 h-9 rounded-xl bg-[#FFF1E2] text-[#FF6A00] grid place-items-center">
                                            <Icon className="w-4.5 h-4.5" />
                                        </div>
                                    </div>
                                    <h3 className="font-display text-xl sm:text-2xl font-semibold text-slate-900 mt-3">
                                        {c.title}
                                    </h3>
                                    <p className="text-slate-600 mt-2">{c.body}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* WHY TEONOX strip */}
            <section className="section-paper py-16 sm:py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-5">
                        <span className="text-xs uppercase tracking-[0.18em] text-slate-500">Why teonox.ai</span>
                        <h2 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
                            We teach <span className="text-[#FF6A00]">workflows</span>, not tools.
                        </h2>
                        <p className="mt-3 text-slate-600">
                            Tools change every quarter. Workflows compound for years. Our curriculum is built around the
                            way teams actually ship work with AI — in marketing, design, content, ops and beyond.
                        </p>
                        <Link
                            to="/the-gap"
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0B0F14] hover:bg-black text-white px-4 py-3 text-sm font-medium"
                        >
                            Read “The Gap”
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        {[
                            { icon: Bot, title: 'AI co-pilots', body: 'For your exact role. Not generic prompts.' },
                            { icon: Workflow, title: 'Repeatable systems', body: 'Templates you reuse every week.' },
                            { icon: ShieldCheck, title: 'Industry-real', body: 'What teams already use to ship.' },
                        ].map((b) => {
                            const Icon = b.icon;
                            return (
                                <div key={b.title} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-[0_10px_30px_rgba(2,6,23,0.05)]">
                                    <div className="w-10 h-10 rounded-xl bg-[#FFF1E2] text-[#FF6A00] grid place-items-center">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-display text-lg font-semibold text-slate-900 mt-3">{b.title}</h4>
                                    <p className="text-sm text-slate-600 mt-1">{b.body}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* MASTERCLASS section */}
            <section data-testid={HOME.masterclassSection} className="relative section-mist py-16 sm:py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl bg-[#0B0F14] text-white p-8 sm:p-10 lg:p-12 shadow-[0_30px_80px_rgba(2,6,23,0.25)] noise-overlay">
                        <div className="orb orb-orange" style={{ width: 360, height: 360, top: -120, left: -120 }} />
                        <div className="orb orb-cyan" style={{ width: 260, height: 260, bottom: -100, right: -80 }} />
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-7">
                                <Badge className="bg-[#FFEDD5] text-[#9A3412] hover:bg-[#FFEDD5]">
                                    <PlayCircle className="w-3.5 h-3.5 mr-1" />
                                    Free Live Masterclass
                                </Badge>
                                <h2 className="font-display mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                                    AI Chatbots — must-knows for students & professionals.
                                </h2>
                                <p className="text-white/75 mt-4 max-w-lg">
                                    Walk away with prompt frameworks, agent recipes, and templates worth ₹50,000. 90 min,
                                    live. Recording available for 7 days.
                                </p>
                                <ul className="mt-5 space-y-2.5">
                                    {[
                                        '7 prompt frameworks pros actually use',
                                        'Agent recipes for marketing & content teams',
                                        '₹50,000 worth of Notion + Sheets + Make templates',
                                    ].map((t) => (
                                        <li key={t} className="text-sm text-white/85 flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                                            {t}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    data-testid={HOME.masterclassSection + '-cta'}
                                    onClick={() => openMasterclass('home_masterclass_section')}
                                    className="mt-6 h-12 bg-[#FF6A00] hover:bg-[#E85F00] text-white rounded-xl text-base font-semibold px-6 shadow-[0_18px_40px_rgba(255,106,0,0.45)]"
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Reserve my free seat
                                </Button>
                            </div>
                            <div className="lg:col-span-5">
                                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/55">
                                        <Star className="w-3.5 h-3.5 text-[#FFB872]" />
                                        What people say
                                    </div>
                                    <p className="text-white/90 mt-3 leading-relaxed">
                                        “Finally a class that didn’t feel like a YouTube tutorial — we built a working
                                        captioning bot in 60 minutes.”
                                    </p>
                                    <p className="text-xs text-white/55 mt-3">— Pre-cohort tester, Mumbai</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
