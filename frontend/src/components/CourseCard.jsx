import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BarChart3, ChevronRight, Sparkles, Megaphone, Palette, Layers, LineChart, Search, Cpu } from 'lucide-react';
import { Badge } from './ui/badge';
import { COURSE_ICON_BY_ID } from '@/lib/courses';
import { useMasterclass } from './MasterclassProvider';
import { COURSES } from '@/constants/testIds';

const ICONS = { Sparkles, Megaphone, Palette, Layers, LineChart, Search, Cpu };

export const CourseCard = ({ course }) => {
    const Icon = ICONS[COURSE_ICON_BY_ID[course.id]] || Sparkles;
    const { open: openMasterclass } = useMasterclass();
    return (
        <motion.article
            data-testid={COURSES.libraryCard}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="tilt rounded-2xl bg-white border border-slate-200 p-5 shadow-[0_10px_30px_rgba(2,6,23,0.05)] flex flex-col h-full"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#FFF1E2] text-[#FF6A00] grid place-items-center">
                    <Icon className="w-5 h-5" />
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-700">{course.level}</Badge>
            </div>
            <h4 className="font-display text-lg sm:text-xl font-semibold text-slate-900 mt-4 leading-snug">
                {course.title}
            </h4>
            <p className="text-sm text-slate-600 mt-1">{course.subtitle}</p>

            <ul className="mt-3 space-y-1.5">
                {course.outcomes.slice(0, 3).map((o, i) => (
                    <li key={i} className="text-xs text-slate-600 flex gap-2">
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#FF6A00] mt-1.5" />
                        {o}
                    </li>
                ))}
            </ul>

            <div className="mt-4 flex items-center gap-3 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration}
                </span>
                <span className="inline-flex items-center gap-1">
                    <BarChart3 className="w-3.5 h-3.5" />
                    {course.hours} hrs
                </span>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                    <div className="text-base font-semibold text-slate-900">
                        ₹{course.price_inr.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-slate-400 line-through">
                        ₹{course.original_price_inr.toLocaleString('en-IN')}
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => openMasterclass('library_card_' + course.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B0F14] hover:bg-black text-white px-4 py-2 text-sm font-medium"
                >
                    Reserve seat
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </motion.article>
    );
};

export default CourseCard;
