import React from 'react';

/**
 * Infinite CSS marquee. Renders the children list twice for seamless looping.
 */
export const Marquee = ({ children, speed = 'slow', reverse = false, className = '' }) => {
    const speedClass = speed === 'fast' ? 'marquee-fast' : '';
    const reverseClass = reverse ? 'marquee-reverse' : '';
    return (
        <div className={`overflow-hidden w-full ${className}`}>
            <div className={`marquee ${speedClass} ${reverseClass}`}>
                <div className="flex items-center gap-12 pr-12">{children}</div>
                <div className="flex items-center gap-12 pr-12" aria-hidden="true">{children}</div>
            </div>
        </div>
    );
};

export default Marquee;
