import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
            <div className="mb-6 text-8xl font-bold text-orange-500">404</div>
            <h1 className="mb-3 text-2xl font-semibold text-white">
                Yeh page nahi mila
            </h1>
            <p className="mb-8 max-w-md text-gray-400">
                Ho sakta hai ye page delete ho gaya ho, ya URL galat ho. Ghar wapas chale?
            </p>
            <div className="flex gap-4">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-medium text-black transition hover:bg-orange-400"
                >
                    <Home size={18} />
                    Home
                </Link>
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-700 px-6 py-3 font-medium text-white transition hover:bg-gray-800"
                >
                    <ArrowLeft size={18} />
                    Wapas jayein
                </button>
            </div>
        </div>
    );
}
