import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  XCircle,
  CheckCircle2,
  Bot,
  ArrowUpRight,
  Clock,
  Zap,
  Target,
  Users,
  Megaphone,
  Search,
  Layers,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMasterclass } from "@/components/MasterclassProvider";
import { Typewriter } from "@/components/gsap/Typewriter";
import { RevealOnScroll } from "@/components/gsap/RevealOnScroll";
import { MagneticButton } from "@/components/gsap/MagneticButton";
import { Counter } from "@/components/gsap/Counter";
import { RESULTS } from "@/constants/testIds";

const STORIES = [
  {
    role: "Social Media Marketer",
    icon: Megaphone,
    course_ids: ["ai-social-media-marketing", "ai-baat-prompt-engg"],
    before: {
      headline: "Manual posting. Burnt out. Boss yelling.",
      pains: [
        "Writes 5 captions a day, by hand",
        "Reels research eats up 4 hours daily",
        "Reports built every Friday from scratch",
      ],
      metrics: [
        { label: "Time/week", value: "52", suffix: " hrs" },
        { label: "Posts/wk", value: "14", suffix: "" },
        { label: "Engagement", value: "1.2", suffix: "%" },
      ],
    },
    after: {
      headline: "AI agents run the studio. Marketer leads.",
      wins: [
        "Captioning agent drafts 25 hooks daily",
        "Reels research bot delivers a weekly trend brief",
        "Auto-publishing pipeline ships posts on schedule",
        "Friday report writes itself with citations",
      ],
      metrics: [
        { label: "Time/week", value: "18", suffix: " hrs" },
        { label: "Posts/wk", value: "38", suffix: "" },
        { label: "Engagement", value: "4.6", suffix: "%" },
      ],
    },
    deltas: [
      { label: "Time saved", value: "65", suffix: "%", icon: Clock },
      { label: "Output up", value: "2.7", suffix: "x", icon: Zap },
      { label: "Engagement up", value: "3.8", suffix: "x", icon: Target },
    ],
  },
  {
    role: "SEO Content Writer",
    icon: Search,
    course_ids: ["ai-seo", "ai-baat-prompt-engg"],
    before: {
      headline: "4 blogs a day. Soul-crushing. Easily replaced.",
      pains: [
        "Writes from briefs with no system",
        "Templated tone, generic outlines",
        "Manager already drafts with ChatGPT solo",
      ],
      metrics: [
        { label: "Output", value: "4", suffix: "/day" },
        { label: "Top-10 ranks", value: "6", suffix: "%" },
        { label: "Editor edits", value: "65", suffix: "%" },
      ],
    },
    after: {
      headline: "Cluster strategist + AI co-writers.",
      wins: [
        "Topical clusters mapped in a day, not weeks",
        "AI co-writers handle drafts; you polish + add depth",
        "On-page + entity SEO automated",
        "Briefs evolve into a content engine",
      ],
      metrics: [
        { label: "Output", value: "10", suffix: "/day" },
        { label: "Top-10 ranks", value: "31", suffix: "%" },
        { label: "Editor edits", value: "15", suffix: "%" },
      ],
    },
    deltas: [
      { label: "Output up", value: "2.5", suffix: "x", icon: Zap },
      { label: "Top-10 ranks", value: "5.2", suffix: "x", icon: Target },
      { label: "Edit time cut", value: "77", suffix: "%", icon: Clock },
    ],
  },
  {
    role: "UI/UX Designer",
    icon: Layers,
    course_ids: ["ai-ui-ux", "ai-branding"],
    before: {
      headline: "Pixel-pushing. Endless revisions. No leverage.",
      pains: [
        "Builds wireframes from zero each project",
        "Rebuilds same components across files",
        "Stakeholders ping-pong feedback for weeks",
      ],
      metrics: [
        { label: "Sprint flows", value: "2", suffix: "" },
        { label: "Revisions", value: "8", suffix: "/flow" },
        { label: "NPS", value: "12", suffix: "" },
      ],
    },
    after: {
      headline: "System designer with AI co-pilots.",
      wins: [
        "v0/Lovable produce starter UI in minutes",
        "Reusable component library + tokens",
        "AI-assisted research synth + briefs",
        "Clean dev hand-off with specs",
      ],
      metrics: [
        { label: "Sprint flows", value: "6", suffix: "" },
        { label: "Revisions", value: "2", suffix: "/flow" },
        { label: "NPS", value: "62", suffix: "" },
      ],
    },
    deltas: [
      { label: "Throughput", value: "3", suffix: "x", icon: Zap },
      { label: "Revisions down", value: "75", suffix: "%", icon: Clock },
      { label: "NPS up", value: "50", suffix: " pts", icon: Target },
    ],
  },
  {
    role: "D2C Founder",
    icon: Building2,
    course_ids: ["ai-digital-marketing", "ai-seo", "ai-branding"],
    before: {
      headline: "Wearing 7 hats. Marketing runs on luck.",
      pains: [
        "No funnel. Ads are guesswork.",
        "Brand voice changes every week",
        "No analytics rhythm fly blind",
      ],
      metrics: [
        { label: "ROAS", value: "1.4", suffix: "x" },
        { label: "Repeat rate", value: "11", suffix: "%" },
        { label: "Hours/wk", value: "70", suffix: "" },
      ],
    },
    after: {
      headline: "AI agents run the marketing org.",
      wins: [
        "Funnel agent owns landing + email + ads briefs",
        "Brand voice locked in a single guide",
        "Weekly AI report drives next week’s decisions",
        "Saved 30 hrs/week to focus on product",
      ],
      metrics: [
        { label: "ROAS", value: "3.8", suffix: "x" },
        { label: "Repeat rate", value: "29", suffix: "%" },
        { label: "Hours/wk", value: "40", suffix: "" },
      ],
    },
    deltas: [
      { label: "ROAS up", value: "2.7", suffix: "x", icon: Zap },
      { label: "Repeat rate", value: "2.6", suffix: "x", icon: Users },
      { label: "Hours cut", value: "43", suffix: "%", icon: Clock },
    ],
  },
];

const MetricChip = ({ m, tone }) => {
  const isGood = tone === "good";
  return (
    <div
      className={`rounded-xl px-3 py-3 text-center border ${
        isGood
          ? "bg-emerald-500/8 border-emerald-500/25 text-emerald-300"
          : "bg-rose-500/8 border-rose-500/25 text-rose-300"
      }`}
    >
      <div className="text-[10px] uppercase tracking-[0.18em] opacity-80">
        {m.label}
      </div>
      <div className="font-display font-semibold text-lg mt-0.5">
        <Counter value={m.value} suffix={m.suffix} />
      </div>
    </div>
  );
};

const DeltaPill = ({ d }) => {
  const Icon = d.icon;
  return (
    <div className="rounded-xl bg-[#E85F00]/10 border border-[#E85F00]/30 px-4 py-3 flex items-center gap-3 min-w-[160px]">
      <div className="w-9 h-9 rounded-lg bg-[#E85F00] text-white grid place-items-center">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="font-display text-lg font-bold text-white leading-none">
          <Counter value={d.value} suffix={d.suffix} />
        </div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-ink-3 mt-1">
          {d.label}
        </div>
      </div>
    </div>
  );
};

export default function ResultsPage() {
  const { open } = useMasterclass();
  return (
    <div data-testid={RESULTS.page} className="section-deep">
      <section className="pt-20 sm:pt-24 pb-10">
        <div className="relative max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24">
          <Badge className="bg-[#E85F00] hover:bg-[#E85F00] text-white border-0">
            Real outcomes
          </Badge>
          <Typewriter
            as="h1"
            text="Before AI. After Teonox."
            className="font-display mt-5 block text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.98] tracking-tight"
            speed={32}
            caret={false}
          />
          <Typewriter
            as="h1"
            text="A clear transformation."
            className="font-display block text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.98] tracking-tight gradient-orange-text"
            speed={32}
            startDelay={620}
            trailingCaret
          />
          <p className="text-ink-2 mt-5 max-w-2xl text-base sm:text-lg">
            Manual, exhausting, easily replaced versus AI-leveraged, focused,
            leading. These are the archetypes our cohorts come in as, and walk
            out as.
          </p>
        </div>
      </section>

      {/* Stories */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24 space-y-10 sm:space-y-14">
          {STORIES.map((s, idx) => {
            const RoleIcon = s.icon;
            return (
              <motion.article
                key={s.role}
                data-testid={RESULTS.storyCard}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl card-elev overflow-hidden"
              >
                {/* Header row */}
                <div className="px-5 sm:px-8 py-5 border-b border-white/8 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E85F00]/15 text-[#FF7A1A] grid place-items-center border border-[#E85F00]/30">
                      <RoleIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3">
                        Story {String(idx + 1).padStart(2, "0")}
                      </div>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight">
                        {s.role}
                      </h2>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {s.course_ids.map((cid) => (
                      <Link
                        to="/courses"
                        key={cid}
                        className="text-xs rounded-full bg-[#E85F00]/12 text-[#FFA362] border border-[#E85F00]/30 px-3 py-1 hover:bg-[#E85F00]/20"
                      >
                        {cid.replace("ai-", "AI ").replaceAll("-", " ")}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Before / After */}
                <div className="relative grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/8">
                  {/* Connecting arrow (desktop only) */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-[#E85F00] text-white items-center justify-center btn-orange-glow border-[3px] border-[#080E22]">
                    <ArrowRight className="w-6 h-6" />
                  </div>

                  {/* Before */}
                  <div className="p-5 sm:p-8">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-rose-500/12 text-rose-300 grid place-items-center border border-rose-500/30">
                        <TrendingDown className="w-5 h-5" />
                      </div>
                      <span className="text-xs uppercase tracking-[0.22em] text-rose-300">
                        Before
                      </span>
                    </div>
                    <h3 className="font-display text-lg sm:text-xl font-semibold text-white mt-4">
                      {s.before.headline}
                    </h3>
                    <ul className="mt-4 space-y-2">
                      {s.before.pains.map((p, i) => (
                        <li key={i} className="text-sm text-ink-2 flex gap-2">
                          <XCircle className="w-4 h-4 mt-0.5 text-rose-400 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      {s.before.metrics.map((m) => (
                        <MetricChip key={m.label} m={m} tone="bad" />
                      ))}
                    </div>
                  </div>

                  {/* After */}
                  <div className="p-5 sm:p-8">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/12 text-emerald-300 grid place-items-center border border-emerald-500/30">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <span className="text-xs uppercase tracking-[0.22em] text-emerald-300">
                        After
                      </span>
                    </div>
                    <h3 className="font-display text-lg sm:text-xl font-semibold text-white mt-4">
                      {s.after.headline}
                    </h3>
                    <ul className="mt-4 space-y-2">
                      {s.after.wins.map((w, i) => (
                        <li key={i} className="text-sm text-ink-2 flex gap-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                          {w}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      {s.after.metrics.map((m) => (
                        <MetricChip key={m.label} m={m} tone="good" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Delta strip (the punchline) */}
                <div className="px-5 sm:px-8 py-5 border-t border-white/8 bg-[#070C1F]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[#FF7A1A]">
                      The shift
                    </div>
                    <span className="h-px flex-1 bg-white/8" />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {s.deltas.map((d) => (
                      <DeltaPill key={d.label} d={d} />
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="section-night py-16 sm:py-20">
        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24">
          <div className="rounded-3xl bg-card border border-white/8 p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8">
                <h3 className="font-display text-2xl sm:text-4xl font-bold text-white">
                  Which transformation is yours?
                </h3>
                <p className="text-ink-2 mt-3 max-w-xl">
                  Chat with our AI Counsellor it ranks the right path for your
                  role in under a minute.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                <Link to="/courses" className="sm:flex-1">
                  <button
                    type="button"
                    className="w-full h-12 inline-flex items-center justify-center gap-2 bg-[#E85F00] hover:bg-[#FF7A1A] text-white rounded-xl font-semibold btn-orange-glow"
                  >
                    <Bot className="w-4 h-4" />
                    Find my path
                  </button>
                </Link>
                <MagneticButton
                  onClick={() => open("results_cta")}
                  className="w-full h-12 inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/12 border border-white/15 text-white rounded-xl"
                >
                  Free Masterclass
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
