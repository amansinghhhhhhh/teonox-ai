import React, { useEffect, useRef, useState } from 'react';
import { gsap, useGsapReady } from '@/lib/useGsap';

export const Counter = ({ value, prefix = '', suffix = '', duration = 1.6, className = '', once = true }) => {
    useGsapReady();
    const ref = useRef(null);
    const [display, setDisplay] = useState('0');

    const parsed = parseFloat(String(value).replace(/[^0-9.\-]/g, '')) || 0;
    const isFloat = String(value).includes('.');
    const detectedSuffix = String(value).replace(/[\d.\-]/g, '');

    useEffect(() => {
        if (!ref.current) return;
        const obj = { v: 0 };
        const ctx = gsap.context(() => {
            const tween = {
                v: parsed,
                duration,
                ease: 'power3.out',
                onUpdate: () => {
                    const v = obj.v;
                    setDisplay(isFloat ? v.toFixed(1) : Math.round(v).toLocaleString('en-IN'));
                },
            };
            const r = ref.current.getBoundingClientRect();
            const inViewNow = r.top < window.innerHeight * 0.95 && r.bottom > 0;
            if (inViewNow) {
                gsap.to(obj, tween);
            } else {
                gsap.to(obj, {
                    ...tween,
                    scrollTrigger: { trigger: ref.current, start: 'top 92%', once },
                });
            }
        }, ref);
        return () => ctx.revert();
    }, [parsed, duration, isFloat, once]);

    return (
        <span ref={ref} className={className}>
            {prefix}
            {display}
            {suffix || detectedSuffix}
        </span>
    );
};

export default Counter;
