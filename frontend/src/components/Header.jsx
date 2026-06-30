import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeonoxLogo } from './TeonoxLogo';
import { NAV } from '@/constants/testIds';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
    { to: '/', label: 'Home' },
    { to: '/the-gap', label: 'The Gap' },
    { to: '/courses', label: 'Courses' },
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
                    ? 'bg-[#060B1A]/85 backdrop-blur-xl border-b border-white/8 shadow-[0_8px_30px_rgba(0,0,0,0.45)]'
                    : 'bg-transparent border-b border-transparent',
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
                <Link to="/" className="flex items-center focus-ring" aria-label="Teonox.ai home">
                    <TeonoxLogo variant="light" size={28} />
                </Link>

                <nav data-testid={NAV.headerNav} className="hidden lg:flex items-center gap-1">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) =>
                                cn(
                                    'px-3.5 py-2 rounded-lg text-sm font-medium transition-colors',
                                    isActive
                                        ? 'text-white bg-white/10'
                                        : 'text-white/70 hover:text-white hover:bg-white/5',
                                )
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        data-testid={NAV.headerCta}
                        onClick={onOpenMasterclass}
                        className="hidden sm:inline-flex items-center gap-2 group rounded-xl bg-[#E85F00] hover:bg-[#FF7A1A] active:bg-[#C95300] text-white px-4 py-2.5 text-sm font-semibold transition-colors btn-orange-glow"
                    >
                        <span>Free Masterclass</span>
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                    <button
                        type="button"
                        data-testid={NAV.mobileToggle}
                        className="lg:hidden p-2 rounded-lg border border-white/10 text-white/80 hover:bg-white/5 focus-ring"
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
                        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:hidden overflow-hidden bg-[#060B1A] border-t border-white/8"
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
                                            isActive ? 'bg-white/10 text-white' : 'text-white/75 hover:bg-white/5',
                                        )
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileOpen(false);
                                    onOpenMasterclass?.();
                                }}
                                className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-[#E85F00] hover:bg-[#FF7A1A] text-white rounded-xl px-4 py-3 font-semibold"
                            >
                                Join Free Masterclass
                            </button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
