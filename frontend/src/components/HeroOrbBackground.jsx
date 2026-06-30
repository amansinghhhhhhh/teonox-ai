import React from 'react';
import { motion } from 'framer-motion';

/**
 * Lightweight abstract "3D-feel" hero background.
 * Pure CSS orbs + animated gradient + SVG node-grid. NO Three.js, mobile-fast.
 *
 * Layered:
 *   - hero-ember-wash gradient (charcoal + orange + cyan)
 *   - 3 floating blurred orbs (orange / cyan / navy) animated via framer-motion
 *   - SVG "node grid" lines that subtly drift (AI connectivity feel)
 *   - noise overlay
 */
export const HeroOrbBackground = ({ className = '' }) => {
    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 overflow-hidden hero-ember-wash noise-overlay ${className}`}
        >
            <motion.div
                className="orb orb-orange"
                style={{ width: 420, height: 420, top: '-80px', left: '-100px' }}
                animate={{ y: [0, 18, 0], x: [0, 10, 0] }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="orb orb-cyan"
                style={{ width: 360, height: 360, top: '20%', right: '-90px' }}
                animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
                transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="orb orb-navy"
                style={{ width: 380, height: 380, bottom: '-160px', left: '30%' }}
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Subtle node grid */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.18]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
                        <circle cx="0" cy="0" r="1.2" fill="rgba(46,230,214,0.5)" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>
    );
};

export default HeroOrbBackground;
