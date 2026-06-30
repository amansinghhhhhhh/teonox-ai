import React, { useEffect, useRef } from 'react';

/**
 * Interactive cursor-reactive dot grid (canvas) on a flat dark background.
 * - No background gradient (solid dark)
 * - Dots near cursor scale up + brighten with brand orange
 * - On touch / no-hover devices, a slow ambient virtual cursor drifts the
 *   highlight across the grid so the bg still feels alive
 * - Respects prefers-reduced-motion
 *
 * Used as the Home hero background. Pure canvas — no WebGL, no extra libs.
 */
export const HeroOrbBackground = ({ className = '', dense = false }) => {
    const canvasRef = useRef(null);
    const wrapRef = useRef(null);
    const stateRef = useRef({ mouseX: -9999, mouseY: -9999, raf: 0, w: 0, h: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrap = wrapRef.current;
        if (!canvas || !wrap) return;

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isTouch = window.matchMedia('(hover: none)').matches;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const ctx = canvas.getContext('2d');

        const resize = () => {
            const r = wrap.getBoundingClientRect();
            stateRef.current.w = r.width;
            stateRef.current.h = r.height;
            canvas.width = Math.floor(r.width * dpr);
            canvas.height = Math.floor(r.height * dpr);
            canvas.style.width = r.width + 'px';
            canvas.style.height = r.height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(wrap);

        const baseSpacing = dense ? 28 : 34;
        const dotBase = 1.1;
        const dotMax = 3.0;
        const influence = 160;

        const onMove = (e) => {
            const r = wrap.getBoundingClientRect();
            stateRef.current.mouseX = e.clientX - r.left;
            stateRef.current.mouseY = e.clientY - r.top;
        };
        const onLeave = () => {
            stateRef.current.mouseX = -9999;
            stateRef.current.mouseY = -9999;
        };
        if (!isTouch) {
            wrap.addEventListener('mousemove', onMove, { passive: true });
            wrap.addEventListener('mouseleave', onLeave, { passive: true });
            // Track window so highlight follows even when hovering child content
            window.addEventListener('mousemove', onMove, { passive: true });
        }

        let virtualT = 0;

        const draw = () => {
            const { w, h, mouseX, mouseY } = stateRef.current;
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = '#030712';
            ctx.fillRect(0, 0, w, h);

            let cx = mouseX;
            let cy = mouseY;
            if (isTouch || cx < -1000) {
                virtualT += reduced ? 0.002 : 0.008;
                cx = w * 0.5 + Math.cos(virtualT) * (w * 0.28);
                cy = h * 0.5 + Math.sin(virtualT * 1.3) * (h * 0.32);
            }

            const spacing = baseSpacing;
            const cols = Math.ceil(w / spacing) + 1;
            const rows = Math.ceil(h / spacing) + 1;
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * spacing;
                    const y = j * spacing;
                    const dx = x - cx;
                    const dy = y - cy;
                    const dist = Math.hypot(dx, dy);
                    const k = Math.max(0, 1 - dist / influence);
                    const eased = k * k * (3 - 2 * k);
                    const r = dotBase + (dotMax - dotBase) * eased;
                    if (eased > 0.04) {
                        const a = 0.18 + 0.78 * eased;
                        ctx.fillStyle = `rgba(255, 140, 60, ${a.toFixed(3)})`;
                    } else {
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.10)';
                    }
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            if (cx > -1000) {
                const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 220);
                grad.addColorStop(0, 'rgba(232, 95, 0, 0.18)');
                grad.addColorStop(0.5, 'rgba(232, 95, 0, 0.05)');
                grad.addColorStop(1, 'rgba(232, 95, 0, 0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(cx, cy, 220, 0, Math.PI * 2);
                ctx.fill();
            }

            stateRef.current.raf = requestAnimationFrame(draw);
        };
        stateRef.current.raf = requestAnimationFrame(draw);

        const stateAtMount = stateRef.current;
        return () => {
            cancelAnimationFrame(stateAtMount.raf);
            ro.disconnect();
            if (!isTouch) {
                wrap.removeEventListener('mousemove', onMove);
                wrap.removeEventListener('mouseleave', onLeave);
                window.removeEventListener('mousemove', onMove);
            }
        };
    }, [dense]);

    return (
        <div
            ref={wrapRef}
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 overflow-hidden bg-deep ${className}`}
        >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#030712]" />
        </div>
    );
};

export default HeroOrbBackground;
