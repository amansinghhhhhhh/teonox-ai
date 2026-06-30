import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, useGsapReady } from '@/lib/useGsap';

/**
 * Splits text into per-char spans and reveals on scroll using GSAP.
 *
 * If the element is already inside the viewport on mount, the animation fires
 * immediately (no ScrollTrigger). Otherwise it triggers on scroll.
 */
export const TextReveal = ({
    text,
    as: Tag = 'h2',
    className = '',
    stagger = 0.018,
    delay = 0,
    from = 'mask',
    once = true,
}) => {
    useGsapReady();
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current) return;
        const ctx = gsap.context(() => {
            const chars = ref.current.querySelectorAll('.split-char');
            if (chars.length === 0) return;
            const fromVars =
                from === 'fade'
                    ? { yPercent: 0, opacity: 0 }
                    : from === 'up'
                        ? { yPercent: 110, opacity: 0 }
                        : { yPercent: 110, opacity: 1 };
            gsap.set(chars, fromVars);

            const toVars = {
                yPercent: 0,
                opacity: 1,
                duration: 0.85,
                ease: 'expo.out',
                stagger,
                delay,
            };

            // Detect "already in view" and play immediately for hero content.
            const r = ref.current.getBoundingClientRect();
            const inViewNow = r.top < window.innerHeight * 0.95 && r.bottom > 0;
            if (inViewNow) {
                gsap.to(chars, toVars);
            } else {
                gsap.to(chars, {
                    ...toVars,
                    scrollTrigger: {
                        trigger: ref.current,
                        start: 'top 88%',
                        once,
                    },
                });
            }
        }, ref);
        return () => ctx.revert();
    }, [text, stagger, delay, from, once]);

    const words = String(text).split(/(\s+)/);
    return (
        <Tag ref={ref} className={className}>
            {words.map((w, i) => {
                if (/^\s+$/.test(w)) return <span key={i}>{w}</span>;
                return (
                    <span key={i} className="split-word" style={{ overflow: 'hidden', display: 'inline-block' }}>
                        {[...w].map((ch, j) => (
                            <span key={j} className="split-char" style={{ display: 'inline-block' }}>
                                {ch}
                            </span>
                        ))}
                    </span>
                );
            })}
        </Tag>
    );
};

export default TextReveal;
