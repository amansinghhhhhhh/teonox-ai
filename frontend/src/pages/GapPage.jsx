import React from 'react';
import { Link } from 'react-router-dom';
import {
    AlertOctagon,
    XCircle,
    GraduationCap,
    Briefcase,
    Building2,
    Users,
    Layers,
    Workflow,
    BookOpenCheck,
    CheckCircle2,
    ArrowUpRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useMasterclass } from '@/components/MasterclassProvider';
import { Typewriter } from '@/components/gsap/Typewriter';
import { RevealOnScroll } from '@/components/gsap/RevealOnScroll';
import { MagneticButton } from '@/components/gsap/MagneticButton';
import { GAP } from '@/constants/testIds';

const FAILURE_MODES = [
    {
        title: 'Too technical',
        body: 'Half the courses drown you in transformers, embeddings and Python. Great if you’re becoming an ML engineer — useless if you just want to do your job better.',
        icon: XCircle,
        accent: '#E11D48',
    },
    {
        title: 'Too shallow',
        body: 'The other half show you ChatGPT screenshots and call it a day. You finish, feel inspired — but still can’t do real work with it on Monday.',
        icon: AlertOctagon,
        accent: '#D97706',
    },
];

const TEONOX_DOES = [
    { title: 'We use the industry cookbook', body: 'We map the prompts, agents and workflows companies are actively using — then teach you those.', icon: BookOpenCheck },
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
        bullets: ['Portfolio capstones in every course', 'Internship-ready workflows', 'Hinglish, friendly, low-jargon'],
    },
    {
        key: 'professionals',
        icon: Briefcase,
        title: 'Working professionals',
        line: 'Don’t get replaced. Get promoted.',
        body: 'Your role won’t be killed by AI — it’ll be killed by someone using AI. Become that someone.',
        bullets: ['Function-specific AI playbooks', 'Save 10+ hrs/week with agents', 'Lead AI projects at your company'],
    },
    {
        key: 'business_owners',
        icon: Building2,
        title: 'Business owners',
        line: 'Run leaner. Ship more. Hire smarter.',
        body: 'Don’t outsource what AI can do for ₹zero. Learn the systems your competitors won’t.',
        bullets: ['Marketing + ops automations', 'D2C-tested workflows', 'Hire “AI-native” teammates with confidence'],
    },
    {
        key: 'parents',
        icon: Users,
        title: 'Parents',
        line: 'Give your child a real head-start.',
        body: 'Most school AI classes are theory. Teonox teaches the same skills creators and entrepreneurs use.',
        bullets: ['Safe, parent-friendly curriculum', 'Project-led: kids build real things', 'Mentor support + parent updates'],
    },
];

export default function GapPage() {
    const { open } = useMasterclass();
    return (
        <div data-testid={GAP.page} className="section-deep">
            {/* HERO */}
            <section className="relative overflow-hidden pt-20 sm:pt-24 pb-12 sm:pb-16">
                <div className="relative max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
                    <div className="lg:col-span-8">
                        <Badge className="bg-[#E85F00] hover:bg-[#E85F00] text-white border-0">The Gap</Badge>
                        <Typewriter
                            as="h1"
                            text="Most AI courses are"
                            className="font-display mt-5 block text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.98] tracking-tight text-white"
                            speed={30}
                            caret={false}
                        />
                        <Typewriter
                            as="h1"
                            text="half-complete."
                            className="font-display block text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.98] tracking-tight gradient-orange-text"
                            speed={30}
                            startDelay={600}
                            trailingCaret
                        />
                        <p className="mt-6 text-ink-2 text-base sm:text-lg max-w-2xl">
                            Either they drown you in tools, or they skip the workflows real companies use. We know how the
                            industry actually works — and we only teach what people who&apos;ve adapted to AI are doing
                            right now.
                        </p>
                    </div>
                    <div className="lg:col-span-4">
                        <div className="rounded-2xl card-elev p-5">
                            <p className="text-ink-3 text-xs uppercase tracking-[0.2em]">A line we keep saying</p>
                            <p className="mt-3 font-display text-xl text-white leading-snug">
                                “You don&apos;t need more tools. You need a workflow.”
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* COMPARISON */}
            <section className="section-night py-16 sm:py-20">
                <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24">
                    <RevealOnScroll className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {FAILURE_MODES.map((f) => {
                            const Icon = f.icon;
                            return (
                                <div key={f.title} className="relative rounded-3xl card-elev p-6 sm:p-8">
                                    <div className="relative z-10 flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-2xl grid place-items-center" style={{ background: f.accent + '1F', color: f.accent, border: `1px solid ${f.accent}55` }}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-display text-2xl font-semibold text-white">{f.title}</h3>
                                    </div>
                                    <p className="mt-4 text-ink-2">{f.body}</p>
                                </div>
                            );
                        })}
                    </RevealOnScroll>

                    {/* Comparison table */}
                    <div className="mt-12 rounded-3xl card-elev overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-3">
                            <div className="hidden md:block p-6 border-b md:border-b-0 md:border-r border-white/8">
                                <div className="text-xs uppercase tracking-[0.2em] text-ink-3">Criteria</div>
                            </div>
                            <div className="p-6 border-b md:border-b-0 md:border-r border-white/8">
                                <div className="text-xs uppercase tracking-[0.2em] text-ink-3">Other courses</div>
                            </div>
                            <div className="p-6 bg-[#E85F00]/8">
                                <div className="text-xs uppercase tracking-[0.2em] text-[#FF7A1A]">Teonox.ai</div>
                            </div>
                        </div>
                        {[
                            { c: 'Curriculum source', a: 'Random tools list', b: 'Real industry cookbook' },
                            { c: 'Audience focus', a: 'One generic learner', b: 'Students, pros, founders, parents' },
                            { c: 'Outcome per module', a: 'Slides + screenshots', b: 'Working workflow you ship' },
                            { c: 'Time-to-leverage', a: 'Months of theory', b: 'Days, by design' },
                            { c: 'Updated for', a: '2023 hype', b: 'What teams ship today' },
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-3 border-t border-white/8">
                                <div className="hidden md:block p-5 text-ink-2 text-sm">{row.c}</div>
                                <div className="p-5 text-ink-2 text-sm md:border-r border-white/8 flex items-center gap-2">
                                    <span className="md:hidden text-xs uppercase tracking-[0.18em] text-ink-3 mr-2">Others</span>
                                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                                    {row.a}
                                </div>
                                <div className="p-5 text-white text-sm flex items-center gap-2 bg-[#E85F00]/6">
                                    <span className="md:hidden text-xs uppercase tracking-[0.18em] text-[#FF7A1A] mr-2">Teonox</span>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    {row.b}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* What Teonox does */}
                    <div className="mt-16">
                        <Typewriter
                            as="h2"
                            text="What Teonox does differently."
                            className="font-display block text-2xl sm:text-4xl font-bold text-white leading-tight"
                            speed={25}
                            trailingCaret
                        />
                        <RevealOnScroll className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                            {TEONOX_DOES.map((d) => {
                                const Icon = d.icon;
                                return (
                                    <div key={d.title} className="rounded-2xl card-elev p-5 tilt">
                                        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 grid place-items-center border border-emerald-500/30">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h4 className="font-display text-lg font-semibold text-white mt-4">{d.title}</h4>
                                        <p className="text-sm text-ink-2 mt-1">{d.body}</p>
                                    </div>
                                );
                            })}
                        </RevealOnScroll>
                    </div>
                </div>
            </section>

            {/* AUDIENCE BENTO */}
            <section className="section-deep py-20 sm:py-24">
                <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24">
                    <p className="text-xs uppercase tracking-[0.22em] text-[#FF7A1A]">Built for you</p>
                    <Typewriter
                        as="h2"
                        text="Whoever you are — we have a path."
                        className="font-display mt-3 block text-3xl sm:text-5xl font-bold text-white leading-tight tracking-tight"
                        speed={28}
                        trailingCaret
                    />
                    <RevealOnScroll data-testid={GAP.audienceCards} className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {AUDIENCES.map((a) => {
                            const Icon = a.icon;
                            return (
                                <div key={a.key} className="rounded-3xl card-elev p-6 sm:p-8 tilt">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-[#E85F00]/12 text-[#FF7A1A] grid place-items-center border border-white/8">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-display text-xl sm:text-2xl font-semibold text-white">{a.title}</h3>
                                            <p className="text-sm text-[#FF7A1A] font-medium">{a.line}</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-ink-2">{a.body}</p>
                                    <ul className="mt-4 space-y-2">
                                        {a.bullets.map((b, i) => (
                                            <li key={i} className="text-sm text-ink-1 flex gap-2">
                                                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400" />
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </RevealOnScroll>
                </div>
            </section>

            {/* CTA */}
            <section className="section-night py-16 sm:py-20">
                <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24">
                    <div className="rounded-3xl bg-card border border-white/8 p-8 sm:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                            <div className="lg:col-span-8">
                                <h3 className="font-display text-2xl sm:text-4xl font-bold text-white">
                                    Tell us your goal. We&apos;ll build you a path.
                                </h3>
                                <p className="text-ink-2 mt-3 max-w-xl">
                                    Chat with our AI Course Consultant — 3-4 questions and you get a ranked path.
                                </p>
                            </div>
                            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                                <Link to="/courses" className="sm:flex-1 lg:flex-none">
                                    <button type="button" className="w-full h-12 inline-flex items-center justify-center gap-2 bg-[#E85F00] hover:bg-[#FF7A1A] text-white rounded-xl btn-orange-glow font-semibold">
                                        Start AI Consultant
                                    </button>
                                </Link>
                                <MagneticButton
                                    onClick={() => open('gap_cta')}
                                    className="w-full h-12 inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/12 border border-white/15 text-white rounded-xl font-medium"
                                >
                                    Join Free Masterclass
                                    <ArrowUpRight className="w-4 h-4" />
                                </MagneticButton>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
