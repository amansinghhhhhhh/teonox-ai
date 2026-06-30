import React, { useEffect, useRef, useState } from 'react';

/**
 * Typewriter — sequential character reveal with a blinking dot caret.
 * Fires immediately when mounted in viewport, otherwise after first scroll into view.
 *
 * Props:
 *   text: string
 *   as: tag (default span)
 *   speed: ms per char (default 28)
 *   startDelay: ms before typing starts
 *   className: wrapper classes
 *   caret: boolean (default true) — show blinking dot caret while typing
 *   trailingCaret: boolean (default false) — keep dot after typing finishes
 */
export const Typewriter = ({
    text,
    as: Tag = 'span',
    speed = 28,
    startDelay = 0,
    className = '',
    caret = true,
    trailingCaret = false,
}) => {
    const ref = useRef(null);
    const [shown, setShown] = useState('');
    const [done, setDone] = useState(false);
    const [started, setStarted] = useState(false);

    // Trigger when in viewport (immediate if already visible).
    useEffect(() => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const inView = r.top < window.innerHeight * 0.95 && r.bottom > 0;
        if (inView) {
            setStarted(true);
            return;
        }
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStarted(true);
                    io.disconnect();
                }
            },
            { threshold: 0.15 },
        );
        io.observe(ref.current);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        if (!started) return;
        let cancelled = false;
        let timeoutId;
        let intervalId;
        timeoutId = setTimeout(() => {
            let i = 0;
            intervalId = setInterval(() => {
                if (cancelled) return;
                i += 1;
                setShown(text.slice(0, i));
                if (i >= text.length) {
                    clearInterval(intervalId);
                    setDone(true);
                }
            }, speed);
        }, startDelay);
        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };
    }, [text, speed, startDelay, started]);

    return (
        <Tag ref={ref} className={className}>
            {shown || '\u00A0'}
            {caret && (!done || trailingCaret) && <span className="tw-caret" aria-hidden="true" />}
        </Tag>
    );
};

export default Typewriter;
