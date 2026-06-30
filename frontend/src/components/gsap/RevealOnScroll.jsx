import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, useGsapReady } from '@/lib/useGsap';

/**
 * Wrap any block so its children are revealed on scroll with a stagger.
 * Children must be direct DOM elements (or motion divs / cards).
 */
export const RevealOnScroll = ({
    as: Tag = 'div',
    className = '',
    stagger = 0.08,
    y = 28,
    duration = 0.7,
    delay = 0,
    children,
    once = true,
    childSelector = ':scope > *',
}) => {
    useGsapReady();
    const ref = useRef(null);
    useEffect(() => {
        if (!ref.current) return;
        const ctx = gsap.context(() => {
            const targets = ref.current.querySelectorAll(childSelector);
            if (!targets.length) return;
            gsap.set(targets, { y, opacity: 0 });
            gsap.to(targets, {
                y: 0,
                opacity: 1,
                duration,
                ease: 'expo.out',
                stagger,
                delay,
                scrollTrigger: {
                    trigger: ref.current,
                    start: 'top 85%',
                    once,
                },
            });
        }, ref);
        return () => ctx.revert();
    }, [stagger, y, duration, delay, once, childSelector]);
    return (
        <Tag ref={ref} className={className}>
            {children}
        </Tag>
    );
};

export default RevealOnScroll;
