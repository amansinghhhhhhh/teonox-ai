import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import '@/App.css';
import { Toaster } from 'sonner';

import { MasterclassProvider } from '@/components/MasterclassProvider';
import { Layout } from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import GapPage from '@/pages/GapPage';
import CoursesPage from '@/pages/CoursesPage';
import ResultsPage from '@/pages/ResultsPage';
import JobRiskPage from '@/pages/JobRiskPage';

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, [pathname]);
    return null;
}

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <MasterclassProvider>
                    <ScrollToTop />
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/the-gap" element={<GapPage />} />
                            <Route path="/courses" element={<CoursesPage />} />
                            <Route path="/results" element={<ResultsPage />} />
                            <Route path="/job-risk" element={<JobRiskPage />} />
                        </Route>
                    </Routes>
                    <Toaster
                        position="top-right"
                        toastOptions={{ className: 'rounded-xl' }}
                        richColors
                    />
                </MasterclassProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
