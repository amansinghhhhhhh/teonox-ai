import React from 'react';
import { motion } from 'framer-motion';
import { SEVERITY_COLORS } from '@/lib/courses';
import { JOBRISK } from '@/constants/testIds';

/**
 * SVG arc "probability dial" 0..100. Pure SVG + Framer Motion for smoothness.
 * Mobile-friendly. Severity drives color band.
 */
export const JobRiskDial = ({ probability = 0, severity = 'low', headline = '', confidence = 0 }) => {
    const sev = SEVERITY_COLORS[severity] || SEVERITY_COLORS.low;
    const p = Math.max(0, Math.min(100, probability));

    // Arc geometry
    const size = 220;
    const stroke = 18;
    const radius = (size - stroke) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const startAngle = 135; // bottom-left
    const endAngle = 405;   // bottom-right (270deg sweep)
    const sweep = endAngle - startAngle;

    const polar = (angle) => {
        const a = (angle * Math.PI) / 180;
        return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
    };
    const arcPath = (a0, a1) => {
        const s = polar(a0);
        const e = polar(a1);
        const largeArc = a1 - a0 > 180 ? 1 : 0;
        return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${largeArc} 1 ${e.x} ${e.y}`;
    };

    const trackPath = arcPath(startAngle, endAngle);
    const valueEndAngle = startAngle + (sweep * p) / 100;
    const valuePath = arcPath(startAngle, valueEndAngle);

    return (
        <div className="relative">
            <svg
                data-testid={JOBRISK.dial}
                width={size}
                height={size * 0.78}
                viewBox={`0 0 ${size} ${size * 0.78}`}
                role="img"
                aria-label={`Job replacement risk ${p}%`}
            >
                <defs>
                    <linearGradient id="dial-grad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#16A34A" />
                        <stop offset="50%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                </defs>
                <path d={trackPath} stroke="#E2E8F0" strokeWidth={stroke} fill="none" strokeLinecap="round" />
                <motion.path
                    d={valuePath}
                    stroke="url(#dial-grad)"
                    strokeWidth={stroke}
                    fill="none"
                    strokeLinecap="round"
                    initial={false}
                    animate={{ d: valuePath }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
                <text
                    x={cx}
                    y={cy - 4}
                    textAnchor="middle"
                    fontFamily="Space Grotesk, sans-serif"
                    fontWeight="700"
                    fontSize="42"
                    fill="#0B0F14"
                >
                    {p}%
                </text>
                <text
                    x={cx}
                    y={cy + 22}
                    textAnchor="middle"
                    fontFamily="Figtree, sans-serif"
                    fontSize="12"
                    fontWeight="500"
                    fill={sev.stroke}
                    data-testid={JOBRISK.severity}
                >
                    {sev.label.toUpperCase()}
                </text>
            </svg>
            {headline && (
                <p className="text-sm text-slate-700 mt-2 text-center">{headline}</p>
            )}
            {confidence > 0 && (
                <p data-testid={JOBRISK.confidence} className="text-xs text-slate-400 mt-1 text-center">
                    Confidence: {confidence}%
                </p>
            )}
        </div>
    );
};

export default JobRiskDial;
