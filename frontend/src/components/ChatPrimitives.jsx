import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ChatBubble = ({ role, children }) => {
    const isUser = role === 'user';
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={cn('flex items-start gap-2 w-full', isUser ? 'justify-end' : 'justify-start')}
        >
            {!isUser && (
                <div className="shrink-0 w-7 h-7 rounded-full bg-[#E85F00]/15 text-[#FF7A1A] grid place-items-center mt-1 border border-[#E85F00]/30">
                    <Sparkles className="w-3.5 h-3.5" />
                </div>
            )}
            <div
                className={cn(
                    'max-w-[85%] sm:max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-[0_2px_10px_rgba(0,0,0,0.3)] whitespace-pre-wrap',
                    isUser
                        ? 'bg-[#E85F00] text-white rounded-tr-md'
                        : 'bg-white/5 text-ink-1 border border-white/10 rounded-tl-md backdrop-blur',
                )}
            >
                {children}
            </div>
            {isUser && (
                <div className="shrink-0 w-7 h-7 rounded-full bg-white/10 text-ink-2 grid place-items-center mt-1 border border-white/10">
                    <User className="w-3.5 h-3.5" />
                </div>
            )}
        </motion.div>
    );
};

export const TypingBubble = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2">
        <div className="shrink-0 w-7 h-7 rounded-full bg-[#E85F00]/15 text-[#FF7A1A] grid place-items-center mt-1 border border-[#E85F00]/30">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
        </div>
        <div className="bg-white/5 text-ink-2 border border-white/10 rounded-2xl rounded-tl-md px-3.5 py-2.5 text-sm backdrop-blur">
            Thinking…
        </div>
    </motion.div>
);

export const ChatThread = ({ testId, children, className = '' }) => {
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current) ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' });
    });
    return (
        <div
            data-testid={testId}
            ref={ref}
            className={cn('flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-[#070D22]', className)}
        >
            {children}
        </div>
    );
};
