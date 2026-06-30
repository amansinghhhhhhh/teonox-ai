import React from 'react';
import { motion } from 'framer-motion';
import { badgeTier } from '@/lib/courses';
import { COURSES } from '@/constants/testIds';

export const MatchBadge = ({ percentage, label }) => {
    const tier = badgeTier(percentage);
    return (
        <motion.div
            data-testid={COURSES.matchBadge}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: tier.bg, color: tier.fg }}
        >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tier.dot }} />
            {percentage}% · {label || tier.label}
        </motion.div>
    );
};

export default MatchBadge;
