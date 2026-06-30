import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CourseConsultant } from '@/components/CourseConsultant';
import { CourseCard } from '@/components/CourseCard';
import { getCourses } from '@/lib/api';
import { COURSES } from '@/constants/testIds';
import { Sparkles, BookOpen, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('consultant');

    useEffect(() => {
        let active = true;
        getCourses()
            .then((d) => {
                if (active) setCourses(d.courses || []);
            })
            .catch(() => {})
            .finally(() => active && setLoading(false));
        return () => {
            active = false;
        };
    }, []);

    return (
        <div data-testid={COURSES.page} className="section-paper">
            <section className="pt-12 sm:pt-16 pb-6 sm:pb-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Badge className="bg-[#FFEDD5] text-[#9A3412] hover:bg-[#FFEDD5]">Explore Courses</Badge>
                    <h1 className="font-display mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                        Not a library. <span className="gradient-orange-text">Your AI counsellor.</span>
                    </h1>
                    <p className="text-slate-600 mt-3 max-w-2xl">
                        Have a 60-second chat. Watch the right course rise to the top, with a clear match % and
                        “why this matters for you.”
                    </p>
                </div>
            </section>

            <section className="pb-16 sm:pb-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Tabs value={tab} onValueChange={setTab} data-testid={COURSES.viewToggle}>
                        <TabsList className="bg-white border border-slate-200 rounded-xl p-1">
                            <TabsTrigger
                                value="consultant"
                                className="data-[state=active]:bg-[#0B0F14] data-[state=active]:text-white rounded-lg px-4"
                            >
                                <Bot className="w-4 h-4 mr-2" />
                                AI Consultant
                            </TabsTrigger>
                            <TabsTrigger
                                value="library"
                                className="data-[state=active]:bg-[#0B0F14] data-[state=active]:text-white rounded-lg px-4"
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
                                <div className="text-sm text-slate-500">Loading courses…</div>
                            ) : (
                                <div data-testid={COURSES.libraryGrid} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {courses.map((c) => (
                                        <CourseCard key={c.id} course={c} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
        </div>
    );
}
