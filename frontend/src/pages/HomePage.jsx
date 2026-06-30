import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    CheckCircle2,
    TrendingUp,
    Star,
    ArrowUpRight,
    Hash,
    Layers,
    Megaphone,
    Palette,
    LineChart,
    Search,
    Cpu,
    Quote,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HeroOrbBackground } from '@/components/HeroOrbBackground';
import { useMasterclass } from '@/components/MasterclassProvider';
import { TextReveal } from '@/components/gsap/TextReveal';
import { Counter } from '@/components/gsap/Counter';
import { RevealOnScroll } from '@/components/gsap/RevealOnScroll';
import { MagneticButton } from '@/components/gsap/MagneticButton';
import { Marquee } from '@/components/gsap/Marquee';
import { HOME } from '@/constants/testIds';
import { gsap, ScrollTrigger, useGsapReady } from '@/lib/useGsap';

const AUDIENCE_CHIPS = [
    { icon: GraduationCap, label: 'Students' },
    { icon: Briefcase, label: 'Professionals' },
    { icon: Building2, label: 'Business owners' },
    { icon: Users, label: 'Parents' },
];

const MARQUEE_TOKENS = [
    'Prompt Engineering',
    'AI Agents',
    'RAG',
    'AI Marketing',
    'AI Branding',
    'AI for UI/UX',
    'AI for SEO',
    'AI Workflows',
    'AI in Depth',
];

const PILOT_COURSE_PILLS = [
    { icon: Sparkles, label: 'AI se Baat' },
    { icon: Megaphone, label: 'Social Media AI' },
    { icon: Palette, label: 'AI Branding' },
    { icon: Layers, label: 'AI UI/UX' },
    { icon: LineChart, label: 'AI Digital Marketing' },
    { icon: Search, label: 'AI SEO' },
    { icon: Cpu, label: 'AI in Depth' },
];

const CHAPTERS = [
    {
        n: '01',
        kicker: 'The reality',
        title: 'AI is already in every job.',
        body: 'From WhatsApp replies to ad campaigns, the people who use AI are quietly leaving others behind.',
        icon: TrendingUp,
    },
    {
        n: '02',
        kicker: 'The problem',
        title: 'Most courses are half-complete.',
        body: 'Either they drown you in tools, or they skip the workflows real companies use. Either way — you’re stuck.',
        icon: Wand2,
    },
    {
        n: '03',
        kicker: 'Our cookbook',
        title: 'Teonox teaches the workflows.',
        body: 'We pick the exact prompts, agents and systems companies actually use — then make you fluent in them.',
        icon: Workflow,
    },
    {
        n: '04',
        kicker: 'The outcome',
        title: 'You leave with leverage.',
        body: 'A library of templates, an AI co-pilot for your role, and the confidence to lead AI projects.',
        icon: ShieldCheck,
    },
];

export default function HomePage() {
    useGsapReady();
    const { open: openMasterclass } = useMasterclass();
    const storyRef = useRef(null);
    const heroBadgeRef = useRef(null);

    // Pinned scroll story — timeline highlight follows scroll progress.
    useEffect(() => {
        if (!storyRef.current) return;
        const ctx = gsap.context(() => {
            const items = storyRef.current.querySelectorAll('[data-chapter]');
            if (!items.length) return;
            items.forEach((el, i) => {
                gsap.fromTo(
                    el,
                    { opacity: 0.2, x: 30 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.6,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 75%',
                            end: 'bottom 30%',
                            toggleActions: 'play reverse play reverse',
                        },
                    },
                );
            });
        }, storyRef);
        return () => ctx.revert();
    }, []);

    // Floating badge for the hero kicker
    useEffect(() => {
        if (!heroBadgeRef.current) return;
        gsap.fromTo(
            heroBadgeRef.current,
            { y: -8, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' },
        );
    }, []);

    return (
        <>
            {/* =========================================================== HERO */}
            <section data-testid={HOME.hero} className="relative overflow-hidden">
                <HeroOrbBackground dense />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32 pb-24 sm:pb-28">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-7">
                            <div
                                ref={heroBadgeRef}
                                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-white/90"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF8A3D] opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6A00]" />
                                </span>
                                AI seekho. Kaam pe lagao.
                            </div>

                            <TextReveal
                                as="h1"
                                text="Job-ready AI skills,"
                                className="font-display mt-6 text-5xl sm:text-6xl lg:text-7xl xl:text-[88px] font-bold leading-[0.95] tracking-tight text-white"
                            />
                            <TextReveal
                                as="h1"
                                text="without the confusion."
                                className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-[88px] font-bold leading-[0.95] tracking-tight gradient-orange-text"
                                delay={0.25}
                            />

                            <motion.p
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.6 }}
                                className="mt-6 text-base sm:text-lg text-ink-2 max-w-xl"
                            >
                                For students, professionals, business owners and parents — Teonox.ai gives you the
                                real-world workflows companies actually use to ship faster, sell more, and stay ahead.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.8 }}
                                className="mt-8 flex flex-col sm:flex-row gap-3"
                            >
                                <MagneticButton
                                    data-testid={HOME.heroPrimaryCta}
                                    onClick={() => openMasterclass('home_hero_primary')}
                                    className="group h-13 rounded-xl bg-[#FF6A00] hover:bg-[#FF8226] text-white text-base font-semibold px-6 py-3.5 btn-orange-glow inline-flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span>Join Free Live Masterclass</span>
                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </MagneticButton>
                                <Link to="/courses">
                                    <button
                                        type="button"
                                        data-testid={HOME.heroSecondaryCta}
                                        className="h-13 inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-base font-medium px-6 py-3.5 backdrop-blur-md"
                                    >
                                        Explore courses
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="mt-8 flex flex-wrap items-center gap-2 text-xs text-white/65"
                            >
                                {AUDIENCE_CHIPS.map((a) => {
                                    const Icon = a.icon;
                                    return (
                                        <span
                                            key={a.label}
                                            className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/8 px-3 py-1.5"
                                        >
                                            <Icon className="w-3.5 h-3.5 text-[#FF8A3D]" />
                                            {a.label}
                                        </span>
                                    );
                                })}
                            </motion.div>
                        </div>

                        {/* Right side: masterclass card + stat strip */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="lg:col-span-5"
                        >
                            <div className="relative rounded-3xl card-glass p-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-[#FF6A00] hover:bg-[#FF6A00] text-white border-0">
                                        <PlayCircle className="w-3.5 h-3.5 mr-1" />
                                        Live this Saturday
                                    </Badge>
                                    <Badge className="bg-white/10 hover:bg-white/10 text-white border-0 border border-white/10">Free</Badge>
                                </div>
                                <h3 className="font-display text-2xl text-white mt-4 leading-snug">
                                    AI Chatbots — the must-knows for students & professionals.
                                </h3>
                                <p className="text-ink-2 text-sm mt-2">
                                    A 90-minute walkthrough of the prompts, agents and templates that move you 5x faster.
                                </p>
                                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                                    {[
                                        { v: '90', s: 'min', l: 'Live' },
                                        { v: '50', s: 'K', l: 'Resources' },
                                        { v: '7', s: ' days', l: 'Replay' },
                                    ].map((m) => (
                                        <div key={m.l} className="rounded-xl bg-white/5 border border-white/8 py-3">
                                            <div className="text-white font-display font-semibold text-lg">
                                                <Counter value={m.v} suffix={m.s} />
                                            </div>
                                            <div className="text-[10px] uppercase tracking-[0.16em] text-ink-3">{m.l}</div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => openMasterclass('home_hero_card')}
                                    className="mt-5 w-full h-12 inline-flex items-center justify-center gap-2 bg-white text-[#0B0F14] hover:bg-[#FFB872] hover:text-[#0B0F14] rounded-xl text-base font-semibold transition-colors"
                                >
                                    <Gift className="w-4 h-4" />
                                    Get my free seat + ₹50K kit
                                </button>
                                <p className="text-xs text-ink-3 mt-3 text-center">No spam. WhatsApp reminders only.</p>
                            </div>

                            {/* Floating mini-card */}
                            <div className="hidden md:flex absolute -bottom-5 -left-6 items-center gap-2 rounded-xl bg-[#0E1638] border border-white/10 px-3 py-2 text-xs text-ink-2 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
                                <Bot className="w-3.5 h-3.5 text-[#FF8A3D]" />
                                Powered by Claude Sonnet 4.5
                            </div>
                        </motion.div>
                    </div>

                    {/* Stat strip */}
                    <div className="mt-16 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {[
                            { k: 'Templates', v: '50', s: 'K+', sub: '₹ value in masterclass' },
                            { k: 'Workflows', v: '120', s: '+', sub: 'real industry workflows' },
                            { k: 'Time saved', v: '15', s: ' hrs/wk', sub: 'with AI co-pilots' },
                            { k: 'Pilot courses', v: '7', s: '', sub: 'across roles' },
                        ].map((s) => (
                            <div key={s.k} className="rounded-2xl card-glass p-5">
                                <div className="text-xs uppercase tracking-[0.2em] text-ink-3">{s.k}</div>
                                <div className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white">
                                    <Counter value={s.v} suffix={s.s} />
                                </div>
                                <div className="text-xs text-ink-2 mt-1">{s.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =========================================================== MARQUEE */}
            <section className="section-deep border-y border-white/8 py-6">
                <Marquee>
                    {MARQUEE_TOKENS.concat(MARQUEE_TOKENS).map((t, i) => (
                        <div key={i} className="flex items-center gap-3 text-2xl sm:text-3xl font-display font-semibold text-white/35 whitespace-nowrap">
                            <Hash className="w-5 h-5 text-[#FF6A00]" />
                            {t}
                        </div>
                    ))}
                </Marquee>
            </section>

            {/* =========================================================== SCROLL STORY */}
            <section data-testid={HOME.scrollStory} className="relative section-night py-20 sm:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <p className="text-xs uppercase tracking-[0.22em] text-[#FF8A3D]">The story</p>
                        <TextReveal
                            as="h2"
                            text="From overwhelmed to in-demand — in 4 chapters."
                            className="font-display mt-3 text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.02] tracking-tight"
                        />
                        <p className="text-ink-2 mt-5 max-w-2xl">
                            A short scroll through how Teonox.ai reframes AI learning — from “too many tools” to a clean,
                            confident, role-specific path.
                        </p>
                    </div>

                    <div ref={storyRef} className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left index column */}
                        <div className="lg:col-span-3">
                            <div className="lg:sticky lg:top-28 space-y-2">
                                {CHAPTERS.map((c) => (
                                    <div
                                        key={c.n}
                                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink-2 border border-white/8 bg-white/5"
                                    >
                                        <span className="font-mono text-[#FF8A3D]">{c.n}</span>
                                        <span>{c.kicker}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right chapters */}
                        <div className="lg:col-span-9 space-y-6">
                            {CHAPTERS.map((c) => {
                                const Icon = c.icon;
                                return (
                                    <div
                                        key={c.n}
                                        data-chapter={c.n}
                                        className="relative rounded-3xl card-elev p-6 sm:p-8 overflow-hidden"
                                    >
                                        <div className="absolute right-0 top-0 w-40 h-40 opacity-30 pointer-events-none">
                                            <div className="orb orb-orange" style={{ width: 200, height: 200, top: -60, right: -60 }} />
                                        </div>
                                        <div className="relative z-10 flex items-start gap-4">
                                            <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#FF6A00]/12 text-[#FF8A3D] grid place-items-center border border-white/8">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-ink-3">
                                                    <span className="font-mono text-[#FF8A3D]">CHAPTER {c.n}</span>
                                                    <span className="h-px flex-1 bg-white/8" />
                                                    <span>{c.kicker}</span>
                                                </div>
                                                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white mt-2">{c.title}</h3>
                                                <p className="text-ink-2 mt-3 max-w-2xl">{c.body}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================== COURSES PEEK */}
            <section className="section-deep py-20 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between gap-6 flex-wrap">
                        <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-[#FF8A3D]">7 pilot courses</p>
                            <TextReveal
                                as="h2"
                                text="Pick a role. We have a path."
                                className="font-display mt-3 text-3xl sm:text-5xl font-bold text-white leading-[1.02] tracking-tight"
                            />
                        </div>
                        <Link to="/courses" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white">
                            See all courses
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <RevealOnScroll className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {PILOT_COURSE_PILLS.map((p) => {
                            const Icon = p.icon;
                            return (
                                <div key={p.label} className="tilt card-elev rounded-2xl p-5 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#FF6A00]/12 text-[#FF8A3D] grid place-items-center border border-white/8">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="text-sm font-medium text-white">{p.label}</div>
                                </div>
                            );
                        })}
                        <Link to="/courses" className="col-span-2 md:col-span-1 tilt card-glass rounded-2xl p-5 flex items-center justify-between gap-3 hover:border-[#FF6A00]/40">
                            <div className="text-sm font-medium text-white">Explore all</div>
                            <ArrowUpRight className="w-5 h-5 text-[#FF8A3D]" />
                        </Link>
                    </RevealOnScroll>
                </div>
            </section>

            {/* =========================================================== MASTERCLASS */}
            <section data-testid={HOME.masterclassSection} className="relative section-night py-20 sm:py-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl bg-card border border-white/8 p-8 sm:p-12 noise-overlay">
                        <div className="orb orb-orange" style={{ width: 420, height: 420, top: -140, left: -140 }} />
                        <div className="orb orb-cyan" style={{ width: 320, height: 320, bottom: -120, right: -80 }} />

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                            <div className="lg:col-span-7">
                                <Badge className="bg-[#FF6A00] hover:bg-[#FF6A00] text-white border-0">
                                    <PlayCircle className="w-3.5 h-3.5 mr-1" />
                                    Free Live Masterclass
                                </Badge>
                                <TextReveal
                                    as="h2"
                                    text="AI Chatbots — the must-knows."
                                    className="font-display mt-4 text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.02] tracking-tight"
                                />
                                <p className="text-ink-2 mt-5 max-w-xl">
                                    Walk away with prompt frameworks, agent recipes, and templates worth ₹50,000. 90 min,
                                    live. Recording available for 7 days.
                                </p>
                                <ul className="mt-6 space-y-2.5">
                                    {[
                                        '7 prompt frameworks pros actually use',
                                        'Agent recipes for marketing & content teams',
                                        '₹50,000 worth of Notion + Sheets + Make templates',
                                    ].map((t) => (
                                        <li key={t} className="text-sm text-ink-1 flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                                            {t}
                                        </li>
                                    ))}
                                </ul>
                                <MagneticButton
                                    data-testid={HOME.masterclassSection + '-cta'}
                                    onClick={() => openMasterclass('home_masterclass_section')}
                                    className="mt-7 inline-flex items-center justify-center gap-2 h-13 rounded-xl bg-[#FF6A00] hover:bg-[#FF8226] text-white text-base font-semibold px-6 py-3.5 btn-orange-glow"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Reserve my free seat
                                </MagneticButton>
                            </div>
                            <div className="lg:col-span-5">
                                <div className="rounded-2xl bg-white/5 border border-white/8 p-6">
                                    <Quote className="w-6 h-6 text-[#FFB872]" />
                                    <p className="text-white/90 mt-3 leading-relaxed">
                                        Finally a class that didn&apos;t feel like another YouTube tutorial. We built a working
                                        captioning bot in 60 minutes — with a workflow I still use every Monday.
                                    </p>
                                    <div className="mt-5 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6A00] to-[#FFB872] grid place-items-center text-white font-semibold">P</div>
                                        <div>
                                            <div className="text-sm font-semibold text-white">Priya, Mumbai</div>
                                            <div className="text-xs text-ink-3">Pre-cohort tester • SMM lead</div>
                                        </div>
                                        <div className="ml-auto flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3.5 h-3.5 fill-[#FFB872] text-[#FFB872]" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
