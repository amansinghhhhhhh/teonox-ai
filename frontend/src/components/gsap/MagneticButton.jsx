import React, { useRef, useState } from 'react';
import { gsap } from '@/lib/useGsap';

/**
 * Magnetic button — the inner content gently follows the cursor on hover.
 * Mobile/touch: behaves as a normal button.
 */
export const MagneticButton = ({ as: Tag = 'button', children, strength = 18, className = '', ...rest }) => {
    const wrapRef = useRef(null);
    const innerRef = useRef(null);
    const [isTouch, setIsTouch] = useState(false);

    React.useEffect(() => {
        setIsTouch(window.matchMedia('(hover: none)').matches);
    }, []);

    const onMove = (e) => {
        if (isTouch || !wrapRef.current || !innerRef.current) return;
        const r = wrapRef.current.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(innerRef.current, { x: (x / r.width) * strength, y: (y / r.height) * strength, duration: 0.4, ease: 'power3.out' });
    };
    const onLeave = () => {
        if (!innerRef.current) return;
        gsap.to(innerRef.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    };

    return (
        <Tag
            ref={wrapRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className={className}
            {...rest}
        >
            <span ref={innerRef} className="inline-flex items-center justify-center will-change-transform">
                {children}
            </span>
        </Tag>
    );
};

export default MagneticButton;
