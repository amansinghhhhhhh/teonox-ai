import React from 'react';
import { NAV } from '@/constants/testIds';

/**
 * Teonox.ai logo — heritage-inspired wordmark with evolved "x-corner node" mark.
 * Uses an inline SVG so it scales perfectly on mobile and dark/light surfaces.
 *
 * Visual story:
 *   - The mark on the left is the heritage L/x-corner DNA, with 3 small orange
 *     nodes connecting from it (implies neural connectivity).
 *   - "teonox" wordmark uses Space Grotesk (system text, no font file dep).
 *   - ".ai" tspan is rendered in safety orange to signal the AI evolution.
 *
 * Props:
 *   variant: 'dark' (for light bg) | 'light' (for dark bg)
 *   size: number (height in px). Width auto-scales.
 */
export const TeonoxLogo = ({ variant = 'dark', size = 36, withTagline = false, className = '' }) => {
    const wordmarkColor = variant === 'light' ? '#FFFFFF' : '#0B0F14';
    const cornerColor = variant === 'light' ? '#FFFFFF' : '#0B0F14';
    const nodeColor = '#FF6A00';
    const taglineColor = variant === 'light' ? 'rgba(255,255,255,0.65)' : '#64748B';

    const height = withTagline ? size + 14 : size;
    const vbW = 560;
    const vbH = withTagline ? 150 : 120;

    return (
        <svg
            data-testid={NAV.headerLogo}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${vbW} ${vbH}`}
            height={height}
            className={className}
            role="img"
            aria-label="teonox.ai logo"
        >
            {/* Heritage x-corner with AI nodes */}
            <g transform="translate(0, 18)">
                {/* L-corner heritage shape */}
                <path
                    d="M 10 8 Q 10 0 18 0 L 64 0 Q 72 0 72 8 L 72 24 Q 72 32 64 32 L 42 32 L 42 58 Q 42 66 34 66 L 18 66 Q 10 66 10 58 Z"
                    fill={cornerColor}
                />
                {/* AI node cluster (orange) */}
                <circle cx="58" cy="50" r="7" fill={nodeColor} />
                <circle cx="82" cy="66" r="5" fill={nodeColor} />
                <circle cx="50" cy="82" r="5" fill={nodeColor} />
                <path d="M 58 50 L 82 66" stroke={nodeColor} strokeWidth="3" strokeLinecap="round" />
                <path d="M 58 50 L 50 82" stroke={nodeColor} strokeWidth="3" strokeLinecap="round" />
                <path d="M 82 66 L 50 82" stroke={nodeColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
            </g>

            {/* Wordmark + .ai */}
            <text
                x="118"
                y="78"
                fontFamily="Space Grotesk, sans-serif"
                fontWeight="700"
                fontSize="72"
                letterSpacing="-2"
                fill={wordmarkColor}
            >
                teonox
                <tspan fill={nodeColor}>.ai</tspan>
            </text>

            {withTagline && (
                <text
                    x="120"
                    y="120"
                    fontFamily="Figtree, sans-serif"
                    fontWeight="500"
                    fontSize="18"
                    letterSpacing="4"
                    fill={taglineColor}
                >
                    LEARN.  APPLY.  LEAD.
                </text>
            )}
        </svg>
    );
};

export default TeonoxLogo;
