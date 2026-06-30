import React, { useEffect, useRef } from 'react';
import { gsap, useGsapReady } from '@/lib/useGsap';

/**
 * Cursor-following soft glow on dark sections. Desktop only.
 */
export const CursorGlow = () => {
    useGsapReady();
    const ref = useRef(null);
    useEffect(() => {
        if (window.matchMedia('(hover: none)').matches) return;
        const el = ref.current;
        if (!el) return;
        gsap.set(el, { xPercent: -50, yPercent: -50 });
        const onMove = (e) => {
            gsap.to(el, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'power3.out' });
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);
    return (
        <div
            ref={ref}
            aria-hidden="true"
            className="hidden lg:block pointer-events-none fixed top-0 left-0 z-[5] w-[420px] h-[420px] rounded-full"
            style={{
                background: 'radial-gradient(circle, rgba(255,106,0,0.18) 0%, transparent 60%)',
                mixBlendMode: 'screen',
                filter: 'blur(20px)',
            }}
        />
    );
};

export default CursorGlow;
