import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { JobRiskChat } from '@/components/JobRiskChat';
import { getCourses } from '@/lib/api';
import { JOBRISK } from '@/constants/testIds';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { useMasterclass } from '@/components/MasterclassProvider';

export default function JobRiskPage() {
    const [courses, setCourses] = useState([]);
    const { open } = useMasterclass();
    useEffect(() => {
        let active = true;
        getCourses().then((d) => active && setCourses(d.courses || [])).catch(() => {});
        return () => { active = false; };
    }, []);

    return (
        <div data-testid={JOBRISK.page} className="section-paper">
            <section className="pt-12 sm:pt-16 pb-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                    <div className="lg:col-span-8">
                        <Badge className="bg-rose-50 text-rose-800 hover:bg-rose-50">
                            <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                            Honest, kind risk read
                        </Badge>
                        <h1 className="font-display mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                            AI aapki job legi? <span className="gradient-orange-text">Let&apos;s find out.</span>
                        </h1>
                        <p className="text-slate-600 mt-3 max-w-2xl">
                            Tell our AI advisor about your tasks, tools and seniority. It will show a clear risk dial,
                            the reasons, your safe zones, and the courses that move you forward.
                        </p>
                    </div>
                    <div className="lg:col-span-4 text-sm text-slate-500">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 border border-slate-200">
                            <Lock className="w-3.5 h-3.5" />
                            Private. Not stored to your name.
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-6 sm:py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <JobRiskChat courses={courses} />
                </div>
            </section>

            {/* CTA */}
            <section className="section-mist py-12 sm:py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl bg-[#0B0F14] text-white p-8 sm:p-10 relative overflow-hidden noise-overlay">
                        <div className="orb orb-orange" style={{ width: 320, height: 320, bottom: -120, right: -100 }} />
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                            <div className="lg:col-span-8">
                                <h3 className="font-display text-2xl sm:text-3xl font-bold">
                                    Move from at-risk to AI-amplified.
                                </h3>
                                <p className="text-white/70 mt-2 max-w-xl">
                                    Join the free live masterclass — you&apos;ll leave with a working AI workflow for your
                                    exact role.
                                </p>
                            </div>
                            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                                <Button
                                    onClick={() => open('jobrisk_cta')}
                                    className="w-full h-12 bg-[#FF6A00] hover:bg-[#E85F00] text-white rounded-xl"
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Free Masterclass
                                </Button>
                                <Link to="/courses">
                                    <Button
                                        variant="secondary"
                                        className="w-full h-12 bg-white/10 hover:bg-white/15 border border-white/15 text-white rounded-xl"
                                    >
                                        Explore courses
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
