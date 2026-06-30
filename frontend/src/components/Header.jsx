import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeonoxLogo } from './TeonoxLogo';
import { Button } from './ui/button';
import { NAV } from '@/constants/testIds';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
    { to: '/', label: 'Home' },
    { to: '/the-gap', label: 'The Gap' },
    { to: '/courses', label: 'Explore Courses' },
    { to: '/results', label: 'Results' },
    { to: '/job-risk', label: 'AI aapki Job legi?' },
];

export const Header = ({ onOpenMasterclass }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    return (
        <header
            className={cn(
                'sticky top-0 z-40 w-full transition-[background-color,box-shadow,backdrop-filter] duration-200',
                scrolled
                    ? 'bg-white/90 backdrop-blur shadow-[0_6px_18px_rgba(2,6,23,0.05)] border-b border-slate-200/70'
                    : 'bg-white border-b border-transparent',
            )}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
                <Link to="/" className="flex items-center focus-ring" aria-label="Teonox.ai home">
                    <TeonoxLogo size={28} />
                </Link>

                <nav data-testid={NAV.headerNav} className="hidden lg:flex items-center gap-1">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) =>
                                cn(
                                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                    isActive
                                        ? 'text-[#0B0F14] bg-slate-100'
                                        : 'text-slate-600 hover:text-[#0B0F14] hover:bg-slate-50',
                                )
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <Button
                        data-testid={NAV.headerCta}
                        onClick={onOpenMasterclass}
                        className="hidden sm:inline-flex bg-[#FF6A00] hover:bg-[#E85F00] active:bg-[#D45500] text-white rounded-xl shadow-[0_8px_22px_rgba(255,106,0,0.25)] focus-visible:ring-2 focus-visible:ring-[#FF6A00]/40"
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Free Masterclass
                    </Button>
                    <button
                        type="button"
                        data-testid={NAV.mobileToggle}
                        className="lg:hidden p-2 rounded-lg border border-slate-200 hover:bg-slate-50 focus-ring"
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-label="Toggle navigation"
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:hidden overflow-hidden bg-white border-t border-slate-200"
                    >
                        <nav data-testid={NAV.mobileNav} className="px-4 py-3 flex flex-col gap-1">
                            {NAV_ITEMS.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.to === '/'}
                                    className={({ isActive }) =>
                                        cn(
                                            'px-3 py-3 rounded-lg text-base font-medium',
                                            isActive ? 'bg-slate-100 text-[#0B0F14]' : 'text-slate-700 hover:bg-slate-50',
                                        )
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                            <Button
                                onClick={() => {
                                    setMobileOpen(false);
                                    onOpenMasterclass?.();
                                }}
                                className="mt-2 w-full bg-[#FF6A00] hover:bg-[#E85F00] text-white rounded-xl"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Join Free Masterclass
                            </Button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
