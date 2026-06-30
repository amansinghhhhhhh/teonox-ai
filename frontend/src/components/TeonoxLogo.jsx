import React from 'react';
import { NAV } from '@/constants/testIds';

/**
 * Teonox.ai logo — minimal heritage mark.
 * Inspired by the original teonox.com geometric L-corner.
 * Single orange shape, no node cluster, paired with "teonox.ai" wordmark.
 */
export const TeonoxLogo = ({ variant = 'dark', size = 32, className = '' }) => {
    const wordmarkColor = variant === 'light' ? '#FFFFFF' : '#0B0F14';
    const accent = '#FF7A1A';
    const vbW = 520;
    const vbH = 120;

    return (
        <svg
            data-testid={NAV.headerLogo}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${vbW} ${vbH}`}
            height={size}
            className={className}
            role="img"
            aria-label="teonox.ai logo"
        >
            {/* Minimal L-corner mark (heritage geometry) */}
            <g transform="translate(12, 22)">
                <path
                    d="M 6 6 L 70 6 Q 78 6 78 14 L 78 26 Q 78 34 70 34 L 40 34 L 40 60 Q 40 70 30 70 L 6 70 Z"
                    fill={accent}
                />
            </g>

            {/* Wordmark + .ai */}
            <text
                x="110"
                y="82"
                fontFamily="Space Grotesk, sans-serif"
                fontWeight="700"
                fontSize="72"
                letterSpacing="-3"
                fill={wordmarkColor}
            >
                teonox
                <tspan fill={accent}>.ai</tspan>
            </text>
        </svg>
    );
};

export default TeonoxLogo;
