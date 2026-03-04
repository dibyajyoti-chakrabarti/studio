'use client';

import { ReactNode } from 'react';

interface BlogLayoutProps {
    children: ReactNode;
    activeTag?: string;
}

export function BlogLayout({ children }: BlogLayoutProps) {
    return (
        <div className="min-h-screen bg-zinc-950 pt-24 pb-20 overflow-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] -z-10" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 -z-10" />

            <div className="container mx-auto px-4 relative">
                {children}
            </div>
        </div>
    );
}
