import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { StickyMobileCta } from './StickyMobileCta';
import { useMasterclass } from './MasterclassProvider';

export const Layout = () => {
    const { open, isOpen } = useMasterclass();
    const location = useLocation();

    const stickyLabel = location.pathname === '/job-risk'
        ? 'Get my AI safety plan'
        : location.pathname === '/courses'
            ? 'Reserve my free seat'
            : 'Join Free Masterclass';

    return (
        <div className="min-h-screen flex flex-col bg-deep text-ink-1">
            <Header onOpenMasterclass={() => open('header_cta')} />
            <main className="flex-1 pb-24 lg:pb-0">
                <Outlet />
            </main>
            <Footer onOpenMasterclass={() => open('footer_cta')} />
            <StickyMobileCta
                onOpen={() => open('sticky_mobile_cta')}
                hidden={isOpen}
                label={stickyLabel}
            />
        </div>
    );
};

export default Layout;
