import React from 'react';
import { Sparkles } from 'lucide-react';
import { NAV } from '@/constants/testIds';

/** Sticky bottom CTA bar for mobile devices on dark theme. */
export const StickyMobileCta = ({ onOpen, hidden = false, label = 'Join Free Masterclass' }) => {
    if (hidden) return null;
    return (
        <div
            data-testid={NAV.stickyCta}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-white/8 bg-[#060B1A]/95 backdrop-blur px-4 py-3"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
        >
            <button
                type="button"
                onClick={onOpen}
                className="w-full h-12 inline-flex items-center justify-center gap-2 bg-[#FF6A00] hover:bg-[#FF8226] active:bg-[#E85F00] text-white rounded-xl text-base font-semibold btn-orange-glow"
            >
                <Sparkles className="w-4 h-4" />
                {label}
            </button>
        </div>
    );
};

export default StickyMobileCta;
