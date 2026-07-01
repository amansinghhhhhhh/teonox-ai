import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
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
    Sparkles,
    Megaphone,
    Palette,
    Layers,
    LineChart,
    Search,
    Cpu,
    Quote,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HeroOrbBackground } from '@/components/HeroOrbBackground';
import { useMasterclass } from '@/components/MasterclassProvider';
import { Typewriter } from '@/components/gsap/Typewriter';
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

    useEffect(() => {
        if (!storyRef.current) return;
        const ctx = gsap.context(() => {
            const items = storyRef.current.querySelectorAll('[data-chapter]');
            if (!items.length) return;
            items.forEach((el) => {
                gsap.fromTo(
                    el,
                    { opacity: 0.2, x: 24 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.65,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 78%',
                            end: 'bottom 25%',
                            toggleActions: 'play reverse play reverse',
                        },
                    },
                );
            });
        }, storyRef);
        return () => ctx.revert();
    }, []);

    return (
        <>
            {/* ============================================================= HERO */}
            <section data-testid={HOME.hero} className="relative overflow-hidden">
                <HeroOrbBackground dense />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32 pb-20 sm:pb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-7">
                            <p className="text-[11px] sm:text-xs uppercase tracking-[0.32em] text-[#FF7A1A]">
                                Teonox.ai &nbsp;·&nbsp; Learn. Apply. Lead.
                            </p>

                            <Typewriter
                                as="h1"
                                text="Job-ready AI skills,"
                                className="font-display block mt-5 text-[40px] leading-[1.02] sm:text-6xl lg:text-7xl xl:text-[88px] font-bold tracking-tight text-white"
                                speed={32}
                                caret={false}
                            />
                            <Typewriter
                                as="h1"
                                text="without the confusion."
                                className="font-display block text-[40px] leading-[1.02] sm:text-6xl lg:text-7xl xl:text-[88px] font-bold tracking-tight gradient-orange-text"
                                speed={32}
                                startDelay={620}
                                trailingCaret
                            />

                            <p className="mt-6 text-base sm:text-lg text-ink-2 max-w-xl">
                                For students, professionals, business owners and parents — Teonox.ai gives you the
                                real-world workflows companies actually use to ship faster, sell more, and stay ahead.
                            </p>

                            <div className="mt-8 flex flex-col sm:flex-row gap-3">
                                <MagneticButton
                                    data-testid={HOME.heroPrimaryCta}
                                    onClick={() => openMasterclass('home_hero_primary')}
                                    className="group h-13 rounded-xl bg-[#E85F00] hover:bg-[#FF7A1A] active:bg-[#C95300] text-white text-base font-semibold px-6 py-3.5 btn-orange-glow inline-flex items-center justify-center gap-2 transition-colors"
                                >
                                    <span>Join Free Live Masterclass</span>
                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </MagneticButton>
                                <Link to="/courses">
                                    <button
                                        type="button"
                                        data-testid={HOME.heroSecondaryCta}
                                        className="h-13 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/5 hover:bg-white/8 text-white text-base font-medium px-6 py-3.5 backdrop-blur-md"
                                    >
                                        Explore courses
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>

                            <div className="mt-8 flex flex-wrap items-center gap-2 text-xs text-white/70">
                                {AUDIENCE_CHIPS.map((a) => {
                                    const Icon = a.icon;
                                    return (
                                        <span
                                            key={a.label}
                                            className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/8 px-3 py-1.5"
                                        >
                                            <Icon className="w-3.5 h-3.5 text-[#FF7A1A]" />
                                            {a.label}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right side: SOLID masterclass card (no gradient) */}
                        <div className="lg:col-span-5">
                            <div className="relative rounded-3xl bg-[#080E22] border border-white/8 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-[#E85F00] hover:bg-[#E85F00] text-white border-0">
                                        <PlayCircle className="w-3.5 h-3.5 mr-1" />
                                        Live this Saturday
                                    </Badge>
                                    <Badge className="bg-white/8 hover:bg-white/8 text-white/85 border border-white/10">Free</Badge>
                                </div>
                                <h3 className="font-display text-2xl text-white mt-4 leading-snug">
                                    AI Chatbots — the must-knows for students &amp; professionals.
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
                                    className="mt-5 w-full h-12 inline-flex items-center justify-center gap-2 bg-white text-[#0B0F14] hover:bg-[#FFA362] hover:text-[#0B0F14] rounded-xl text-base font-semibold transition-colors"
                                >
                                    <Gift className="w-4 h-4" />
                                    Get my free seat + ₹50K kit
                                </button>
                                <p className="text-xs text-ink-3 mt-3 text-center">No spam. WhatsApp reminders only.</p>

                                {/* Mini-info row */}
                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-3">
                                    <Bot className="w-3.5 h-3.5 text-[#FF7A1A]" />
                                    Personalized AI guidance
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stat strip */}
                    <div className="mt-14 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {[
                            { k: 'Templates', v: '50', s: 'K+', sub: '₹ value in masterclass' },
                            { k: 'Workflows', v: '120', s: '+', sub: 'real industry workflows' },
                            { k: 'Time saved', v: '15', s: ' hrs/wk', sub: 'with AI co-pilots' },
                            { k: 'Pilot courses', v: '7', s: '', sub: 'across roles' },
                        ].map((s) => (
                            <div key={s.k} className="rounded-2xl bg-[#080E22] border border-white/6 p-5">
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
            <section className="section-deep border-y border-white/6 py-6">
                <Marquee>
                    {MARQUEE_TOKENS.concat(MARQUEE_TOKENS).map((t, i) => (
                        <div key={i} className="flex items-center gap-3 text-2xl sm:text-3xl font-display font-semibold text-white/30 whitespace-nowrap">
                            <Hash className="w-5 h-5 text-[#E85F00]" />
                            {t}
                        </div>
                    ))}
                </Marquee>
            </section>

            {/* =========================================================== SCROLL STORY */}
            <section data-testid={HOME.scrollStory} className="relative section-night py-20 sm:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <p className="text-xs uppercase tracking-[0.22em] text-[#FF7A1A]">The story</p>
                        <Typewriter
                            as="h2"
                            text="From overwhelmed to in-demand."
                            className="font-display mt-3 block text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.02] tracking-tight"
                            speed={28}
                            trailingCaret
                        />
                        <p className="text-ink-2 mt-5 max-w-2xl">
                            A short scroll through how Teonox.ai reframes AI learning — from “too many tools” to a clean,
                            confident, role-specific path.
                        </p>
                    </div>

                    <div ref={storyRef} className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-3">
                            <div className="lg:sticky lg:top-28 space-y-2">
                                {CHAPTERS.map((c) => (
                                    <div
                                        key={c.n}
                                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink-2 border border-white/6 bg-white/3"
                                    >
                                        <span className="font-mono text-[#FF7A1A]">{c.n}</span>
                                        <span>{c.kicker}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-9 space-y-6">
                            {CHAPTERS.map((c) => {
                                const Icon = c.icon;
                                return (
                                    <div
                                        key={c.n}
                                        data-chapter={c.n}
                                        className="relative rounded-3xl card-elev p-6 sm:p-8"
                                    >
                                        <div className="relative z-10 flex items-start gap-4">
                                            <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#E85F00]/12 text-[#FF7A1A] grid place-items-center border border-white/8">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-ink-3">
                                                    <span className="font-mono text-[#FF7A1A]">CHAPTER {c.n}</span>
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
                            <p className="text-xs uppercase tracking-[0.22em] text-[#FF7A1A]">7 pilot courses</p>
                            <Typewriter
                                as="h2"
                                text="Pick a role. We have a path."
                                className="font-display mt-3 block text-3xl sm:text-5xl font-bold text-white leading-[1.02] tracking-tight"
                                speed={28}
                                trailingCaret
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
                                    <div className="w-10 h-10 rounded-xl bg-[#E85F00]/12 text-[#FF7A1A] grid place-items-center border border-white/8">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="text-sm font-medium text-white">{p.label}</div>
                                </div>
                            );
                        })}
                        <Link to="/courses" className="col-span-2 md:col-span-1 tilt card-elev rounded-2xl p-5 flex items-center justify-between gap-3 hover:border-[#E85F00]/40">
                            <div className="text-sm font-medium text-white">Explore all</div>
                            <ArrowUpRight className="w-5 h-5 text-[#FF7A1A]" />
                        </Link>
                    </RevealOnScroll>
                </div>
            </section>

            {/* =========================================================== MASTERCLASS */}
            <section data-testid={HOME.masterclassSection} className="relative section-night py-20 sm:py-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl bg-card border border-white/8 p-8 sm:p-12">
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                            <div className="lg:col-span-7">
                                <Badge className="bg-[#E85F00] hover:bg-[#E85F00] text-white border-0">
                                    <PlayCircle className="w-3.5 h-3.5 mr-1" />
                                    Free Live Masterclass
                                </Badge>
                                <Typewriter
                                    as="h2"
                                    text="AI Chatbots — the must-knows."
                                    className="font-display mt-4 block text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.02] tracking-tight"
                                    speed={26}
                                    trailingCaret
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
                                    className="mt-7 inline-flex items-center justify-center gap-2 h-13 rounded-xl bg-[#E85F00] hover:bg-[#FF7A1A] text-white text-base font-semibold px-6 py-3.5 btn-orange-glow"
                                >
                                    Reserve my free seat
                                    <ArrowUpRight className="w-4 h-4" />
                                </MagneticButton>
                            </div>
                            <div className="lg:col-span-5">
                                <div className="rounded-2xl bg-[#0C1430] border border-white/8 p-6">
                                    <Quote className="w-6 h-6 text-[#FFA362]" />
                                    <p className="text-white/90 mt-3 leading-relaxed">
                                        Finally a class that didn&apos;t feel like another YouTube tutorial. We built a working
                                        captioning bot in 60 minutes — with a workflow I still use every Monday.
                                    </p>
                                    <div className="mt-5 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-[#E85F00] grid place-items-center text-white font-semibold">P</div>
                                        <div>
                                            <div className="text-sm font-semibold text-white">Priya, Mumbai</div>
                                            <div className="text-xs text-ink-3">Pre-cohort tester · SMM lead</div>
                                        </div>
                                        <div className="ml-auto flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3.5 h-3.5 fill-[#FFA362] text-[#FFA362]" />
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
