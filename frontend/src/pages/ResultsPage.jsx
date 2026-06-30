import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Sparkles,
    TrendingUp,
    TrendingDown,
    XCircle,
    CheckCircle2,
    Bot,
    ArrowUpRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useMasterclass } from '@/components/MasterclassProvider';
import { TextReveal } from '@/components/gsap/TextReveal';
import { RevealOnScroll } from '@/components/gsap/RevealOnScroll';
import { MagneticButton } from '@/components/gsap/MagneticButton';
import { Counter } from '@/components/gsap/Counter';
import { RESULTS } from '@/constants/testIds';

const STORIES = [
    {
        role: 'Social Media Marketer',
        course_ids: ['ai-social-media-marketing', 'ai-baat-prompt-engg'],
        before: {
            headline: 'Manual posting. Burnt out. Boss yelling.',
            pains: [
                'Writes 5 captions a day, by hand',
                'Reels research eats up 4 hours daily',
                'Reports built every Friday from scratch',
                'Manager keeps asking “why is engagement flat?”',
            ],
            metrics: [
                { label: 'Time/week', value: '52', suffix: ' hrs' },
                { label: 'Posts/week', value: '14', suffix: '' },
                { label: 'Engagement', value: '1.2', suffix: '%' },
            ],
        },
        after: {
            headline: 'AI agents run the studio. Marketer leads.',
            wins: [
                'Captioning agent drafts 25 hooks daily',
                'Reels research bot delivers a weekly trend brief',
                'Auto-publishing pipeline (Make + AI) ships posts',
                'Friday report writes itself with citations',
            ],
            metrics: [
                { label: 'Time/week', value: '18', suffix: ' hrs' },
                { label: 'Posts/week', value: '38', suffix: '' },
                { label: 'Engagement', value: '4.6', suffix: '%' },
            ],
        },
    },
    {
        role: 'SEO Content Writer',
        course_ids: ['ai-seo', 'ai-baat-prompt-engg'],
        before: {
            headline: '4 blogs a day. Soul-crushing. Easily replaced.',
            pains: [
                'Writes from briefs with no system',
                'Templated tone, generic outlines',
                'No clusters, no topical authority',
                'Manager already drafts with ChatGPT solo',
            ],
            metrics: [
                { label: 'Output', value: '4', suffix: '/day' },
                { label: 'Top-10 ranks', value: '6', suffix: '%' },
                { label: 'Editor edits', value: '65', suffix: '%' },
            ],
        },
        after: {
            headline: 'Cluster strategist + AI co-writers.',
            wins: [
                'Topical clusters mapped in a day, not weeks',
                'AI co-writers handle drafts; you polish + add depth',
                'On-page + entity SEO automated',
                'Briefs evolve into a content engine',
            ],
            metrics: [
                { label: 'Output', value: '10', suffix: '/day' },
                { label: 'Top-10 ranks', value: '31', suffix: '%' },
                { label: 'Editor edits', value: '15', suffix: '%' },
            ],
        },
    },
    {
        role: 'UI/UX Designer',
        course_ids: ['ai-ui-ux', 'ai-branding'],
        before: {
            headline: 'Pixel-pushing. Endless revisions. No leverage.',
            pains: [
                'Builds wireframes from zero each project',
                'Rebuilds same components across files',
                'Stakeholders ping-pong feedback for weeks',
                'No design-to-code pipeline',
            ],
            metrics: [
                { label: 'Sprint flows', value: '2', suffix: '' },
                { label: 'Revisions', value: '8', suffix: '/flow' },
                { label: 'NPS', value: '12', suffix: '' },
            ],
        },
        after: {
            headline: 'System designer with AI co-pilots.',
            wins: [
                'v0/Lovable produce starter UI in minutes',
                'Reusable component library + tokens',
                'AI-assisted research synth + stakeholder briefs',
                'Hand-off to devs with clean specs',
            ],
            metrics: [
                { label: 'Sprint flows', value: '6', suffix: '' },
                { label: 'Revisions', value: '2', suffix: '/flow' },
                { label: 'NPS', value: '62', suffix: '' },
            ],
        },
    },
    {
        role: 'D2C Founder',
        course_ids: ['ai-digital-marketing', 'ai-seo', 'ai-branding'],
        before: {
            headline: 'Wearing 7 hats. Marketing runs on luck.',
            pains: [
                'No funnel. Ads are guesswork.',
                'Brand voice changes every week',
                'Emails are sent only when you remember',
                'No analytics rhythm — fly blind',
            ],
            metrics: [
                { label: 'ROAS', value: '1.4', suffix: 'x' },
                { label: 'Repeat rate', value: '11', suffix: '%' },
                { label: 'Hours/wk', value: '70', suffix: '' },
            ],
        },
        after: {
            headline: 'AI agents run the marketing org.',
            wins: [
                'Funnel agent owns landing + email + ads briefs',
                'Brand voice locked in a single guide',
                'Weekly AI report drives next week’s decisions',
                'Saved 30 hrs/week to focus on product',
            ],
            metrics: [
                { label: 'ROAS', value: '3.8', suffix: 'x' },
                { label: 'Repeat rate', value: '29', suffix: '%' },
                { label: 'Hours/wk', value: '40', suffix: '' },
            ],
        },
    },
];

const MetricChip = ({ m, tone }) => {
    const isGood = tone === 'good';
    return (
        <div
            className={`rounded-xl px-3 py-2.5 text-center border ${
                isGood
                    ? 'bg-emerald-500/8 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/8 border-rose-500/30 text-rose-300'
            }`}
        >
            <div className="text-[10px] uppercase tracking-[0.18em] opacity-80">{m.label}</div>
            <div className="font-display font-semibold text-base mt-0.5">
                <Counter value={m.value} suffix={m.suffix} />
            </div>
        </div>
    );
};

export default function ResultsPage() {
    const { open } = useMasterclass();
    return (
        <div data-testid={RESULTS.page} className="section-deep">
            <section className="relative overflow-hidden pt-20 sm:pt-24 pb-10">
                <div className="orb orb-orange" style={{ width: 460, height: 460, top: -180, left: -120, opacity: 0.3 }} />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Badge className="bg-[#FF6A00] hover:bg-[#FF6A00] text-white border-0">Real outcomes</Badge>
                    <TextReveal
                        as="h1"
                        text="Before AI. After Teonox."
                        className="font-display mt-5 text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.98] tracking-tight"
                    />
                    <TextReveal
                        as="h1"
                        text="A clear transformation."
                        className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.98] tracking-tight gradient-orange-text"
                        delay={0.18}
                    />
                    <p className="text-ink-2 mt-5 max-w-2xl text-base sm:text-lg">
                        Manual, exhausting, easily replaced — versus AI-leveraged, focused, leading. These are the
                        archetypes our cohorts come in as, and walk out as.
                    </p>
                </div>
            </section>

            <section className="py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
                    {STORIES.map((s) => (
                        <motion.article
                            key={s.role}
                            data-testid={RESULTS.storyCard}
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="rounded-3xl card-elev overflow-hidden"
                        >
                            <div className="px-5 sm:px-8 py-5 border-b border-white/8 flex items-center justify-between gap-3 flex-wrap">
                                <h2 className="font-display text-xl sm:text-2xl font-bold text-white">{s.role}</h2>
                                <div className="flex flex-wrap gap-2">
                                    {s.course_ids.map((cid) => (
                                        <Link
                                            to="/courses"
                                            key={cid}
                                            className="text-xs rounded-full bg-[#FF6A00]/15 text-[#FFB872] border border-[#FF6A00]/30 px-3 py-1 hover:bg-[#FF6A00]/25"
                                        >
                                            {cid.replace('ai-', 'AI ').replaceAll('-', ' ')}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/8 relative">
                                {/* Connecting arrow */}
                                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#FF6A00] text-white items-center justify-center btn-orange-glow border-4 border-[#0E1638]">
                                    <ArrowRight className="w-5 h-5" />
                                </div>

                                {/* Before */}
                                <div className="p-5 sm:p-8 bg-rose-500/3 relative">
                                    <div className="flex items-center gap-2">
                                        <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-300 grid place-items-center border border-rose-500/30">
                                            <TrendingDown className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs uppercase tracking-[0.2em] text-rose-300">Before</span>
                                    </div>
                                    <h3 className="font-display text-lg sm:text-xl font-semibold text-white mt-4">{s.before.headline}</h3>
                                    <ul className="mt-3 space-y-2">
                                        {s.before.pains.map((p, idx) => (
                                            <li key={idx} className="text-sm text-ink-2 flex gap-2">
                                                <XCircle className="w-4 h-4 mt-0.5 text-rose-400 shrink-0" />
                                                {p}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-5 grid grid-cols-3 gap-2">
                                        {s.before.metrics.map((m) => <MetricChip key={m.label} m={m} tone="bad" />)}
                                    </div>
                                </div>
                                {/* After */}
                                <div className="p-5 sm:p-8 bg-emerald-500/3 relative">
                                    <div className="flex items-center gap-2">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-300 grid place-items-center border border-emerald-500/30">
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs uppercase tracking-[0.2em] text-emerald-300">After</span>
                                    </div>
                                    <h3 className="font-display text-lg sm:text-xl font-semibold text-white mt-4">{s.after.headline}</h3>
                                    <ul className="mt-3 space-y-2">
                                        {s.after.wins.map((w, idx) => (
                                            <li key={idx} className="text-sm text-ink-2 flex gap-2">
                                                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                                                {w}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-5 grid grid-cols-3 gap-2">
                                        {s.after.metrics.map((m) => <MetricChip key={m.label} m={m} tone="good" />)}
                                    </div>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="section-night py-16 sm:py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl bg-card border border-white/8 p-8 sm:p-12 relative overflow-hidden noise-overlay">
                        <div className="orb orb-orange" style={{ width: 360, height: 360, top: -140, left: -100 }} />
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                            <div className="lg:col-span-8">
                                <h3 className="font-display text-2xl sm:text-4xl font-bold text-white">
                                    Which transformation is yours?
                                </h3>
                                <p className="text-ink-2 mt-3 max-w-xl">
                                    Chat with our AI Counsellor — it ranks the right path for your role in under a minute.
                                </p>
                            </div>
                            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                                <Link to="/courses" className="sm:flex-1">
                                    <button type="button" className="w-full h-12 inline-flex items-center justify-center gap-2 bg-[#FF6A00] hover:bg-[#FF8226] text-white rounded-xl font-semibold btn-orange-glow">
                                        <Bot className="w-4 h-4" />
                                        Find my path
                                    </button>
                                </Link>
                                <MagneticButton
                                    onClick={() => open('results_cta')}
                                    className="w-full h-12 inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/12 border border-white/15 text-white rounded-xl"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Free Masterclass
                                </MagneticButton>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
