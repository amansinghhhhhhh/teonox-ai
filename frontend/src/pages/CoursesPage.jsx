import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CourseConsultant } from '@/components/CourseConsultant';
import { CourseCard } from '@/components/CourseCard';
import { getCourses } from '@/lib/api';
import { COURSES } from '@/constants/testIds';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Bot } from 'lucide-react';
import { TextReveal } from '@/components/gsap/TextReveal';
import { RevealOnScroll } from '@/components/gsap/RevealOnScroll';

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('consultant');

    useEffect(() => {
        let active = true;
        getCourses()
            .then((d) => { if (active) setCourses(d.courses || []); })
            .catch(() => {})
            .finally(() => active && setLoading(false));
        return () => { active = false; };
    }, []);

    return (
        <div data-testid={COURSES.page} className="section-deep">
            <section className="relative overflow-hidden pt-20 sm:pt-24 pb-8 sm:pb-10">
                <div className="orb orb-orange" style={{ width: 460, height: 460, top: -200, right: -120, opacity: 0.3 }} />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Badge className="bg-[#FF6A00] hover:bg-[#FF6A00] text-white border-0">Explore Courses</Badge>
                    <TextReveal
                        as="h1"
                        text="Not a library."
                        className="font-display mt-5 text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.98] tracking-tight"
                    />
                    <TextReveal
                        as="h1"
                        text="Your AI counsellor."
                        className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.98] tracking-tight gradient-orange-text"
                        delay={0.18}
                    />
                    <p className="text-ink-2 mt-5 max-w-2xl text-base sm:text-lg">
                        Have a 60-second chat. Watch the right course rise to the top — with a clear match % and a single
                        line of “why this matters for you.”
                    </p>
                </div>
            </section>

            <section className="pb-20 sm:pb-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Tabs value={tab} onValueChange={setTab} data-testid={COURSES.viewToggle}>
                        <TabsList className="bg-white/5 border border-white/8 rounded-xl p-1">
                            <TabsTrigger
                                value="consultant"
                                className="data-[state=active]:bg-[#FF6A00] data-[state=active]:text-white text-white/70 rounded-lg px-4"
                            >
                                <Bot className="w-4 h-4 mr-2" />
                                AI Consultant
                            </TabsTrigger>
                            <TabsTrigger
                                value="library"
                                className="data-[state=active]:bg-[#FF6A00] data-[state=active]:text-white text-white/70 rounded-lg px-4"
                            >
                                <BookOpen className="w-4 h-4 mr-2" />
                                Full Library
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="consultant" className="mt-6">
                            <CourseConsultant courses={courses} />
                        </TabsContent>
                        <TabsContent value="library" className="mt-6">
                            {loading ? (
                                <div className="text-sm text-ink-3">Loading courses…</div>
                            ) : (
                                <RevealOnScroll data-testid={COURSES.libraryGrid} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {courses.map((c) => (
                                        <CourseCard key={c.id} course={c} />
                                    ))}
                                </RevealOnScroll>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
        </div>
    );
}
