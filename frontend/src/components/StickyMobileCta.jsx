import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { NAV } from '@/constants/testIds';

/**
 * Sticky bottom CTA bar for mobile devices.
 * Hidden on lg+ and hidden when masterclass drawer is open.
 */
export const StickyMobileCta = ({ onOpen, hidden = false, label = 'Join Free Masterclass' }) => {
    if (hidden) return null;
    return (
        <div
            data-testid={NAV.stickyCta}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur px-4 py-3 shadow-[0_-8px_24px_rgba(2,6,23,0.06)]"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
        >
            <Button
                onClick={onOpen}
                className="w-full h-12 bg-[#FF6A00] hover:bg-[#E85F00] active:bg-[#D45500] text-white rounded-xl text-base font-semibold shadow-[0_10px_24px_rgba(255,106,0,0.25)]"
            >
                <Sparkles className="w-4 h-4 mr-2" />
                {label}
            </Button>
        </div>
    );
};

export default StickyMobileCta;
