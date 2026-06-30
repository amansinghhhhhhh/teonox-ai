import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Clock,
    AlertTriangle,
    Smile,
    ArrowRight,
    Sparkles,
    TrendingUp,
    TrendingDown,
    XCircle,
    CheckCircle2,
    BarChart3,
    Bot,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMasterclass } from '@/components/MasterclassProvider';
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
                { label: 'Time/week', value: '52 hrs', tone: 'bad' },
                { label: 'Posts/week', value: '14', tone: 'bad' },
                { label: 'Engagement', value: '1.2%', tone: 'bad' },
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
                { label: 'Time/week', value: '18 hrs', tone: 'good' },
                { label: 'Posts/week', value: '38', tone: 'good' },
                { label: 'Engagement', value: '4.6%', tone: 'good' },
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
                { label: 'Output', value: '4 blogs/day', tone: 'bad' },
                { label: 'Top-10 ranks', value: '6%', tone: 'bad' },
                { label: 'Editor edits', value: '↑ 65%', tone: 'bad' },
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
                { label: 'Output', value: '10 blogs/day', tone: 'good' },
                { label: 'Top-10 ranks', value: '31%', tone: 'good' },
                { label: 'Editor edits', value: '↓ 70%', tone: 'good' },
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
                { label: 'Sprint output', value: '2 flows', tone: 'bad' },
                { label: 'Revisions', value: '8/flow', tone: 'bad' },
                { label: 'Stakeholder NPS', value: '+12', tone: 'bad' },
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
                { label: 'Sprint output', value: '6 flows', tone: 'good' },
                { label: 'Revisions', value: '2/flow', tone: 'good' },
                { label: 'Stakeholder NPS', value: '+62', tone: 'good' },
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
                { label: 'ROAS', value: '1.4x', tone: 'bad' },
                { label: 'Repeat rate', value: '11%', tone: 'bad' },
                { label: 'Hours/week', value: '70', tone: 'bad' },
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
                { label: 'ROAS', value: '3.8x', tone: 'good' },
                { label: 'Repeat rate', value: '29%', tone: 'good' },
                { label: 'Hours/week', value: '40', tone: 'good' },
            ],
        },
    },
];

const MetricChip = ({ m }) => {
    const isGood = m.tone === 'good';
    return (
        <div
            className={`rounded-xl px-3 py-2 text-center border ${
                isGood ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
        >
            <div className="text-xs uppercase tracking-[0.16em] opacity-70">{m.label}</div>
            <div className="font-display font-semibold text-base mt-0.5">{m.value}</div>
        </div>
    );
};

export default function ResultsPage() {
    const { open } = useMasterclass();
    return (
        <div data-testid={RESULTS.page} className="section-paper">
            <section className="pt-12 sm:pt-16 pb-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Badge className="bg-[#FFEDD5] text-[#9A3412] hover:bg-[#FFEDD5]">Real outcomes</Badge>
                    <h1 className="font-display mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                        Before AI. After Teonox. <span className="gradient-orange-text">A clear transformation.</span>
                    </h1>
                    <p className="text-slate-600 mt-3 max-w-2xl">
                        Manual, exhausting, easily replaced — versus AI-leveraged, focused, leading. These are the
                        archetypes our cohorts come in as, and walk out as.
                    </p>
                </div>
            </section>

            <section className="py-6 sm:py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
                    {STORIES.map((s, i) => (
                        <motion.article
                            key={s.role}
                            data-testid={RESULTS.storyCard}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.25 }}
                            transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                            className="rounded-3xl bg-white border border-slate-200 shadow-[0_10px_30px_rgba(2,6,23,0.05)] overflow-hidden"
                        >
                            <div className="px-5 sm:px-8 py-5 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
                                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">{s.role}</h2>
                                <div className="flex flex-wrap gap-2">
                                    {s.course_ids.map((cid) => (
                                        <Link
                                            to="/courses"
                                            key={cid}
                                            className="text-xs rounded-full bg-[#FFF1E2] text-[#9A3412] px-3 py-1 hover:bg-[#FFE3CB]"
                                        >
                                            {cid.replace('ai-', 'AI ').replaceAll('-', ' ')}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                                {/* Before */}
                                <div className="p-5 sm:p-8 bg-rose-50/30">
                                    <div className="flex items-center gap-2">
                                        <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 grid place-items-center">
                                            <TrendingDown className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs uppercase tracking-[0.18em] text-rose-700">Before</span>
                                    </div>
                                    <h3 className="font-display text-lg font-semibold text-slate-900 mt-3">{s.before.headline}</h3>
                                    <ul className="mt-3 space-y-1.5">
                                        {s.before.pains.map((p, idx) => (
                                            <li key={idx} className="text-sm text-slate-700 flex gap-2">
                                                <XCircle className="w-4 h-4 mt-0.5 text-rose-500" />
                                                {p}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4 grid grid-cols-3 gap-2">
                                        {s.before.metrics.map((m) => <MetricChip key={m.label} m={m} />)}
                                    </div>
                                </div>
                                {/* After */}
                                <div className="p-5 sm:p-8 bg-emerald-50/30">
                                    <div className="flex items-center gap-2">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 grid place-items-center">
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs uppercase tracking-[0.18em] text-emerald-700">After</span>
                                    </div>
                                    <h3 className="font-display text-lg font-semibold text-slate-900 mt-3">{s.after.headline}</h3>
                                    <ul className="mt-3 space-y-1.5">
                                        {s.after.wins.map((w, idx) => (
                                            <li key={idx} className="text-sm text-slate-700 flex gap-2">
                                                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600" />
                                                {w}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4 grid grid-cols-3 gap-2">
                                        {s.after.metrics.map((m) => <MetricChip key={m.label} m={m} />)}
                                    </div>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="section-mist py-12 sm:py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl bg-[#0B0F14] text-white p-8 sm:p-10 relative overflow-hidden noise-overlay">
                        <div className="orb orb-orange" style={{ width: 320, height: 320, top: -120, left: -100 }} />
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                            <div className="lg:col-span-8">
                                <h3 className="font-display text-2xl sm:text-3xl font-bold">Which transformation is yours?</h3>
                                <p className="text-white/70 mt-2">
                                    Chat with our AI Counsellor — it ranks the right path for your role in under a minute.
                                </p>
                            </div>
                            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                                <Link to="/courses" className="sm:flex-1">
                                    <Button className="w-full h-12 bg-[#FF6A00] hover:bg-[#E85F00] text-white rounded-xl">
                                        <Bot className="w-4 h-4 mr-2" />
                                        Find my path
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => open('results_cta')}
                                    variant="secondary"
                                    className="w-full h-12 bg-white/10 hover:bg-white/15 border border-white/15 text-white rounded-xl"
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Free Masterclass
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
