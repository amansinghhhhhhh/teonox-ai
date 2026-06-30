import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { JobRiskChat } from '@/components/JobRiskChat';
import { getCourses } from '@/lib/api';
import { JOBRISK } from '@/constants/testIds';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { useMasterclass } from '@/components/MasterclassProvider';
import { TextReveal } from '@/components/gsap/TextReveal';
import { MagneticButton } from '@/components/gsap/MagneticButton';

export default function JobRiskPage() {
    const [courses, setCourses] = useState([]);
    const { open } = useMasterclass();
    useEffect(() => {
        let active = true;
        getCourses().then((d) => active && setCourses(d.courses || [])).catch(() => {});
        return () => { active = false; };
    }, []);

    return (
        <div data-testid={JOBRISK.page} className="section-deep">
            <section className="relative overflow-hidden pt-20 sm:pt-24 pb-8">
                <div className="orb orb-orange" style={{ width: 460, height: 460, top: -180, right: -120, opacity: 0.28 }} />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                    <div className="lg:col-span-8">
                        <Badge className="bg-rose-500/15 text-rose-200 border border-rose-500/30 hover:bg-rose-500/15">
                            <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                            Honest, kind risk read
                        </Badge>
                        <TextReveal
                            as="h1"
                            text="AI aapki job legi?"
                            className="font-display mt-5 text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.98] tracking-tight"
                        />
                        <TextReveal
                            as="h1"
                            text="Let's find out."
                            className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.98] tracking-tight gradient-orange-text"
                            delay={0.18}
                        />
                        <p className="text-ink-2 mt-5 max-w-2xl text-base sm:text-lg">
                            Tell our AI advisor about your tasks, tools and seniority. You&apos;ll see a clear risk dial,
                            the reasons, your safe zones, and the courses that move you forward.
                        </p>
                    </div>
                    <div className="lg:col-span-4">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 text-ink-2 px-3 py-1.5 text-sm">
                            <Lock className="w-3.5 h-3.5 text-[#FF8A3D]" />
                            Private. Not stored to your name.
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-8 sm:py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <JobRiskChat courses={courses} />
                </div>
            </section>

            <section className="section-night py-14 sm:py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl bg-card border border-white/8 p-8 sm:p-12 relative overflow-hidden noise-overlay">
                        <div className="orb orb-orange" style={{ width: 380, height: 380, bottom: -140, right: -120 }} />
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                            <div className="lg:col-span-8">
                                <h3 className="font-display text-2xl sm:text-4xl font-bold text-white">
                                    Move from at-risk to AI-amplified.
                                </h3>
                                <p className="text-ink-2 mt-3 max-w-xl">
                                    Join the free live masterclass — you&apos;ll leave with a working AI workflow for your
                                    exact role.
                                </p>
                            </div>
                            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                                <MagneticButton
                                    onClick={() => open('jobrisk_cta')}
                                    className="w-full h-12 inline-flex items-center justify-center gap-2 bg-[#FF6A00] hover:bg-[#FF8226] text-white rounded-xl font-semibold btn-orange-glow"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Free Masterclass
                                </MagneticButton>
                                <Link to="/courses">
                                    <button type="button" className="w-full h-12 inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/12 border border-white/15 text-white rounded-xl">
                                        Explore courses
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
