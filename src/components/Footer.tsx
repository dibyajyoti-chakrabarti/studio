'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Footer() {
    const [currentYear, setCurrentYear] = useState<number | null>(null);

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="bg-[#020617] border-t border-white/[0.06] relative overflow-hidden">
            {/* Subtle bottom glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cyan-900/10 blur-[120px] pointer-events-none" />

            {/* Top CTA strip */}
            <div className="border-b border-white/[0.05] py-10 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl tracking-tight text-white mb-2">Ready to build your next part?</h3>
                            <p className="text-zinc-500 text-sm">Upload your design and get matched with a verified MechMaster in minutes.</p>
                        </div>
                        <div className="flex gap-3 shrink-0">
                            <Link href="/upload">
                                <Button
                                    className="h-10 px-7 text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-full shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_30px_rgba(59,130,246,0.45)] transition-all"
                                    suppressHydrationWarning
                                >
                                    Upload Your Design <ArrowRight className="ml-1.5 w-3.5 h-3.5 inline" />
                                </Button>
                            </Link>
                            <Button variant="ghost" className="h-10 px-6 text-sm border border-white/10 text-zinc-400 hover:text-white rounded-full" suppressHydrationWarning>
                                View Services
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main link grid */}
            <div className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 lg:gap-16">

                    {/* Brand column */}
                    <div className="col-span-2 md:col-span-1 relative z-10">
                        <Link href="/" className="flex items-center gap-2.5 mb-5 group">
                            <Logo size={32} />
                            <span className="text-2xl tracking-tight text-zinc-100 group-hover:text-white transition-colors">MechHub</span>
                        </Link>
                        <p className="text-zinc-500 text-sm leading-relaxed mb-6 max-w-xs">
                            India's precision manufacturing marketplace — connecting design teams with verified CNC, laser, and fabrication experts.
                        </p>
                        {/* Mini trust badges */}
                        <div className="flex flex-wrap gap-2">
                            {['NDA Signed', 'ISO-Ready', 'QC Inspected', 'On-Time Delivery'].map(b => (
                                <span key={b} className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/[0.08] text-zinc-500 bg-white/[0.02]">
                                    {b}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/80 mb-5">Company</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'About Us', href: '/about' },
                                { label: 'How It Works', href: '#how-it-works' },
                                { label: 'MechMasters', href: '#vendors' },
                                { label: 'Blog', href: '/blog' },
                                { label: 'Contact', href: '#contact' },
                            ].map(l => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-sm text-zinc-500 hover:text-white transition-colors">{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/80 mb-5">Legal</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Privacy Policy', href: '/privacy-policy' },
                                { label: 'Terms of Service', href: '/terms-of-service' },
                                { label: 'Refund Policy', href: '/refund-policy' },
                                { label: 'NDA Policy', href: '/nda-policy' },
                            ].map(l => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-sm text-zinc-500 hover:text-white transition-colors">{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Vendors */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/80 mb-5">For Vendors</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Onboarding Guide', href: '#' },
                                { label: 'Seller Portal', href: '#' },
                                { label: 'Quality Standards', href: '#' },
                                { label: 'Partner FAQs', href: '#' },
                            ].map(l => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-sm text-zinc-500 hover:text-white transition-colors">{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/[0.05] py-6">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
                        <span className="text-zinc-600 text-[11px] uppercase tracking-wider">
                            © {currentYear || new Date().getFullYear()} MechHub. All rights reserved.
                        </span>
                        <span className="hidden md:inline text-zinc-700">·</span>
                        <span className="text-zinc-700 text-[10px] uppercase tracking-widest font-semibold">
                            A Unit of Synchubb Innovations Pvt Ltd
                        </span>
                    </div>

                    {/* Social links (placeholder icons) */}
                    <div className="flex items-center gap-3">
                        {[
                            { label: 'LinkedIn', path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
                            { label: 'Twitter/X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835-8.17-10.665H8.08l4.265 5.64L18.244 2.25z' },
                            { label: 'Instagram', path: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z' },
                        ].map(s => (
                            <Link
                                key={s.label}
                                href="#"
                                aria-label={s.label}
                                className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-zinc-500 hover:text-white hover:border-cyan-500/30 hover:bg-cyan-950/20 transition-all"
                            >
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d={s.path} />
                                </svg>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
