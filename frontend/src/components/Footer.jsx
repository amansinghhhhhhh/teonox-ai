import React from 'react';
import { Link } from 'react-router-dom';
import { TeonoxLogo } from './TeonoxLogo';
import { NAV } from '@/constants/testIds';
import { Mail, MessageCircle, MapPin, Sparkles } from 'lucide-react';

const LINKS = [
    { label: 'Home', to: '/' },
    { label: 'The Gap', to: '/the-gap' },
    { label: 'Explore Courses', to: '/courses' },
    { label: 'Results', to: '/results' },
    { label: 'AI aapki Job legi?', to: '/job-risk' },
];

export const Footer = ({ onOpenMasterclass }) => {
    return (
        <footer data-testid={NAV.footer} className="dark-panel relative noise-overlay">
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
                {/* Trust strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pb-8 border-b border-white/10">
                    {[
                        'Made in India',
                        'Live cohorts + recordings',
                        'Templates worth ₹50,000',
                        'Claude-powered consultant',
                    ].map((t) => (
                        <div key={t} className="flex items-center gap-2 text-sm text-white/70">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" />
                            {t}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-10">
                    <div className="md:col-span-5">
                        <TeonoxLogo variant="light" size={32} />
                        <p className="mt-4 text-white/65 max-w-md">
                            Job-ready AI skills for students, professionals, business owners and parents. We teach the
                            workflows companies actually use — not just tools, real systems.
                        </p>
                        <button
                            onClick={onOpenMasterclass}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#FF6A00] hover:bg-[#E85F00] px-5 py-3 text-white font-medium shadow-[0_10px_24px_rgba(255,106,0,0.25)]"
                        >
                            <Sparkles className="w-4 h-4" />
                            Join Free Masterclass
                        </button>
                    </div>

                    <div className="md:col-span-3">
                        <div className="text-xs uppercase tracking-[0.18em] text-white/45 mb-4">Explore</div>
                        <ul className="space-y-2">
                            {LINKS.map((l) => (
                                <li key={l.to}>
                                    <Link to={l.to} className="text-white/75 hover:text-white transition-colors">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-4">
                        <div className="text-xs uppercase tracking-[0.18em] text-white/45 mb-4">Contact</div>
                        <ul className="space-y-3 text-white/75">
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-[#FF6A00]" />
                                hello@teonox.ai
                            </li>
                            <li className="flex items-center gap-3">
                                <MessageCircle className="w-4 h-4 text-[#FF6A00]" />
                                WhatsApp +91-XXXXX-XXXXX
                            </li>
                            <li className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-[#FF6A00]" />
                                Remote-first · India
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <p className="text-xs text-white/45">
                        © {new Date().getFullYear()} teonox.ai — Learn. Apply. Lead.
                    </p>
                    <p className="text-xs text-white/45">Built mobile-first • Powered by Claude Sonnet 4.5</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
