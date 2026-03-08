"use client"

import { useState, useEffect } from 'react';
import { LandingNav } from '@/components/LandingNav';
import { RotatingGears } from '@/components/Gears';
import { ServicesSection } from '@/components/ServicesSection';
import { LaserArrow } from '@/components/LaserArrow';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/Logo';
import {
  Settings,
  Zap,
  Flame,
  Layers,
  Cpu,
  Boxes,
  ArrowRight,
  Upload,
  Search,
  CheckCircle2,
  Star,
  MapPin,
  TrendingUp,
  ShieldCheck,
  CircleDollarSign,
  FastForward,
  Users2,
  Lock,
  LayoutDashboard,
  ClipboardCheck,
  MessageSquare,
  Loader2,
  Check,
  Factory,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useFirestore, setDocumentNonBlocking, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { doc, collection, query, where, limit } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const { toast } = useToast();
  const db = useFirestore();
  const router = useRouter();
  const user = useUser();

  // Rotating Hero Text State
  const heroPhrases = [
    "Engineering Your Vision \n Prototyping to High-Volume Production",
    "Powering Innovation \n First Prototype to Full Production Run",
    "Precision Parts \n From Idea to Mass Production"
  ];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // trigger fade out
      setTimeout(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % heroPhrases.length);
        setFade(true); // trigger fade in
      }, 500); // half second fade
    }, 4500); // rotate every 4.5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  // Fetch a subset of active vendors for the landing page showcase
  const landingVendorsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'users'),
      where('role', '==', 'vendor'),
      where('isActive', '==', true),
      limit(6)
    );
  }, [db]);
  const { data: landingVendors } = useCollection(landingVendorsQuery);



  return (
    <div className="min-h-screen relative overflow-x-hidden" suppressHydrationWarning>
      <LandingNav />

      <section className="relative pt-28 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-[#020617]">
        {/* Advanced Background Elements */}
        <div className="blueprint-grid opacity-15" suppressHydrationWarning />
        <RotatingGears />

        {/* Multi-layered cinematic glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-cyan-600/20 blur-[150px] pointer-events-none" aria-hidden="true" />
        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#020617] to-transparent pointer-events-none z-10" />

        <div className="container mx-auto px-4 relative z-20">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">

            {/* Premium Eyebrow badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-semibold tracking-widest uppercase mb-10 shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              India's Premier Manufacturing Network
            </div>

            {/* Main headline - Precision Terminal Aesthetic */}
            <div className="relative mb-8 min-h-[100px] md:min-h-[140px] flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out" style={{ opacity: fade ? 1 : 0 }}>

              <h1 className="text-center font-verdana tracking-wide uppercase text-balance leading-[1.3] max-w-5xl drop-shadow-md flex flex-col items-center justify-center">
                <div className="text-3xl md:text-5xl lg:text-[64px] text-zinc-100 font-bold mb-4 flex items-center justify-center gap-2">

                  {heroPhrases[currentPhraseIndex % heroPhrases.length]?.split('\n')[0]}
                </div>
                {heroPhrases[currentPhraseIndex % heroPhrases.length]?.split('\n')[1] && (
                  <div className="text-xl md:text-2xl lg:text-2xl text-cyan-200/80 tracking-[0.1em] font-light mt-2">
                    {heroPhrases[currentPhraseIndex % heroPhrases.length]?.split('\n')[1]}
                  </div>
                )}
              </h1>
            </div>

            {/* Sub-headline */}
            <p className="text-base md:text-md text-zinc-400 max-w-2xl leading-relaxed mb-10 font-light">
              MechHub connects innovators with verified Indian manufacturers. <span className="text-cyan-400 font-medium">Upload a design</span> and get precision engineered parts delivered with unparalleled speed and quality transparency.
            </p>

            {/* Interactive Capabilities cluster */}
            <div className="flex flex-wrap justify-center gap-3 mb-14 max-w-4xl mx-auto">
              {['CNC Machining', 'Laser Cutting', 'Sheet Metal', 'Welding & Fab', 'Rapid Prototyping', 'Small Batch'].map((cap) => (
                <div key={cap} className="relative group cursor-default">
                  <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative block text-sm font-medium px-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/50 hover:text-cyan-100 text-zinc-300 transition-all duration-300 backdrop-blur-sm">
                    {cap}
                  </span>
                </div>
              ))}
            </div>

            {/* Advanced CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20 w-full sm:w-auto">
              <Link href="/upload" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-10 text-base font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] hover:-translate-y-0.5 transition-all duration-300 group overflow-hidden relative"
                  suppressHydrationWarning
                >
                  <span className="relative z-10 flex items-center">
                    Upload Your Design
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </span>
                  {/* High-end shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-14 px-10 text-base font-semibold border-2 border-zinc-700 bg-transparent hover:bg-white/5 hover:border-zinc-500 rounded-full text-zinc-200 transition-all duration-300 backdrop-blur-md"
                suppressHydrationWarning
              >
                Become a MechMaster
              </Button>
            </div>

            {/* Floating Trust Dashboard Box */}
            <div className="w-full max-w-5xl bg-zinc-950/40 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5" />
              <div className="relative grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 divide-x-0 md:divide-x divide-white/10">
                {[
                  { val: '±0.05mm', lbl: 'Tolerance', icon: Settings },
                  { val: '24 Hrs', lbl: 'Min Lead Time', icon: Zap },
                  { val: '50+', lbl: 'MechMasters', icon: Factory },
                  { val: '100%', lbl: 'QC Inspected', icon: ShieldCheck },
                  { val: 'NDA', lbl: 'IP Protected', icon: Lock },
                ].map((stat, i) => (
                  <div key={stat.lbl} className={`flex flex-col items-center justify-center text-center ${i === 4 ? 'col-span-2 md:col-span-1' : ''}`}>
                    <stat.icon className="w-5 h-5 text-cyan-500/70 mb-3" />
                    <div className="text-white font-bold text-xl md:text-2xl font-mono mb-1">{stat.val}</div>
                    <div className="text-zinc-400 text-[10px] md:text-xs uppercase tracking-widest font-medium">{stat.lbl}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Scroll Down Indicator - High-end Laser Animation */}
          <div className="flex flex-col items-center mt-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both" style={{ animationDelay: '1000ms' }}>
            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold mb-4">Discover MechHub</span>
            <LaserArrow size={32} color="#22d3ee" className="opacity-50" />
          </div>
        </div>
      </section>

      <ServicesSection />

      <section id="how-it-works" className="py-20 relative overflow-hidden bg-gradient-to-b from-[#020617] via-[#040f25] to-[#020617]">
        {/* Subtle background mesh */}
        <div className="blueprint-grid opacity-[0.03]" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-3">PROCESS</p>
            <h2 className="text-4xl sm:text-5xl md:text-[64px]leading-[1.1] tracking-tight text-white mb-6">
              How It Works
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto text-sm leading-relaxed">
              From design file to finished part — a streamlined process built for speed, quality, and full transparency.
            </p>
          </div>

          {/* Steps */}
          <div className="relative max-w-5xl mx-auto">
            {/* Desktop Flow Indicators - Professional Laser Animation */}
            <div className="hidden md:block absolute top-[52px] left-0 w-full z-0 pointer-events-none">
              <div className="flex items-center justify-around px-[10%]">
                <LaserArrow direction="right" size={24} color="#22d3ee" className="opacity-40" />
                <LaserArrow direction="right" size={24} color="#22d3ee" className="opacity-40" />
                <LaserArrow direction="right" size={24} color="#22d3ee" className="opacity-40" />
                <LaserArrow direction="right" size={24} color="#22d3ee" className="opacity-40" />
              </div>
            </div>

            {/* Connector line (desktop) */}


            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-6">
              {[
                {
                  num: '01', icon: Upload, title: 'Upload Design',
                  desc: 'Securely upload STEP, STL, DWG, or PDF files.'
                },
                {
                  num: '02', icon: Search, title: 'Use Budget Estimator',
                  desc: 'Our system analyzes your design and provides a rough cost range.',
                },
                {
                  num: '03', icon: Factory, title: 'Matched to MechMasters',
                  desc: 'We route your order to the best-fit verified manufacturer.',
                },
                {
                  num: '04', icon: ClipboardCheck, title: 'Production & QC',
                  desc: 'Real-time updates with inspection images at every stage.',
                },
                {
                  num: '05', icon: CheckCircle2, title: 'Delivered to You',
                  desc: 'Parts dispatched with full documentation and delivery tracking.',
                },
              ].map((step, i) => (
                <div key={step.num} className="flex flex-col items-center text-center group p-4 sm:p-6 rounded-2xl border border-white/[0.05] bg-white/[0.01] hover:bg-cyan-950/20 hover:border-cyan-500/30 transition-all duration-300 shadow-xl relative overflow-hidden backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:to-transparent transition-all duration-500" />

                  {/* Number + Icon badge */}
                  <div className="relative mb-6 z-10 group-hover:scale-110 transition-transform duration-500">
                    <div className="w-[56px] h-[56px] rounded-xl bg-zinc-950/80 border border-white/10 flex items-center justify-center group-hover:border-cyan-400/50 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300 backdrop-blur-md relative overflow-hidden">
                      {/* Inner pulse effect */}
                      <div className="absolute inset-0 bg-cyan-500/5 animate-pulse" />
                      <step.icon className="w-6 h-6 text-zinc-400 group-hover:text-cyan-300 transition-colors relative z-10" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-zinc-900 border-2 border-[#040f25] flex items-center justify-center shadow-lg group-hover:bg-cyan-950 group-hover:border-cyan-500/50 transition-all duration-300">
                      <span className="text-[10px] font-bold text-cyan-500 group-hover:text-cyan-300 font-mono tracking-tighter">{step.num}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className=" text-sm md:text-base font-bold text-white mb-2 group-hover:text-cyan-50 transition-colors z-10">
                    {step.title}
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed mb-2 px-1 z-10 group-hover:text-zinc-400 transition-colors">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA strip */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 p-5 sm:p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] max-w-2xl mx-auto text-center sm:text-left">
            <div className="sm:flex-1">
              <p className="text-white font-semibold text-sm">Ready to get your parts made?</p>
              <p className="text-zinc-500 text-xs">Upload your design and get a quote in minutes.</p>
            </div>
            <Link href="/upload" className="shrink-0 w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto h-10 px-7 text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all"
                suppressHydrationWarning
              >
                Upload Your Design <ArrowRight className="ml-1.5 w-3.5 h-3.5 inline" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="vendors" className="pt-20 pb-16 relative overflow-hidden bg-[#020617]">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#040f25] to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500">VERIFIED MARKETPLACE</span>
                <span className="w-12 h-px bg-cyan-500/30"></span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-[56px] leading-[1.1] tracking-tight text-white mb-6 drop-shadow-sm">
                Meet Our MechMasters
              </h2>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-light">
                Every MechMaster is rigorously vetted for capability, quality, and delivery. Your parts are in expert hands.
              </p>
            </div>

            {/* Stat pills */}
            <div className="flex gap-6 shrink-0">
              {[
                { val: '50+', lbl: 'Active Partners' },
                { val: '99.8%', lbl: 'Quality Pass Rate' },
                { val: '12', lbl: 'Cities Covered' },
              ].map(s => (
                <div key={s.lbl} className="text-right">
                  <div className="text-white font-bold text-xl font-mono">{s.val}</div>
                  <div className="text-zinc-500 text-[10px] uppercase tracking-wider">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Vendor Cards — infinite auto-scroll marquee */}
          {landingVendors?.length ? (() => {
            // Repeat cards enough times that first 50% always overflows viewport
            const repeated = Array.from({ length: 6 }, () => landingVendors).flat();
            return (
              <div className="relative marquee-track overflow-hidden w-full mt-6">
                {/* Left/right fade edges — match page bg */}
                <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
                  style={{ background: 'linear-gradient(to right, #020617, transparent)' }} />
                <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
                  style={{ background: 'linear-gradient(to left, #020617, transparent)' }} />
                <div className="marquee-inner gap-6 pb-4 pt-2">
                  {repeated.map((vendor, idx) => (
                    <div key={`${idx}-${vendor.id}`} className="w-[288px] shrink-0 group mx-0" style={{ marginRight: '20px' }}>
                      <div className="h-full rounded-2xl border border-white/[0.07] bg-zinc-900/60 backdrop-blur overflow-hidden hover:border-cyan-500/25 hover:shadow-[0_0_30px_rgba(0,229,255,0.07)] transition-all duration-500">
                        <div className="relative h-40 w-full overflow-hidden bg-zinc-800">
                          <Image src={vendor.imageUrl || "/mechhub.png"} alt={vendor.fullName || 'Verified MechMaster'} fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                            {vendor.isVerified && (
                              <div className="flex items-center gap-1.5 bg-cyan-500/20 border border-cyan-500/30 backdrop-blur-sm text-cyan-300 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
                                <ShieldCheck className="w-3 h-3" /> Verified
                              </div>
                            )}
                            <div className="ml-auto flex items-center gap-1 bg-zinc-900/80 backdrop-blur border border-white/10 px-2 py-1 rounded-full text-[10px] font-bold text-white">
                              <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                              {vendor.rating || '4.8'}
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-headline text-sm font-bold text-white mb-1 truncate group-hover:text-cyan-100 transition-colors">
                            {vendor.teamName || vendor.fullName || 'Verified MechMaster'}
                          </h3>
                          <div className="flex items-center gap-3 text-zinc-500 text-[10px] font-medium uppercase tracking-wider mb-3">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-cyan-500/60" />{vendor.location || 'India'}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-cyan-500/60" />{vendor.experienceYears || '0'}+ Yrs</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {(vendor.specializations?.length > 0 ? vendor.specializations : ['CNC Machining', 'Sheet Metal']).slice(0, 3).map((s: string, i: number) => (
                              <span key={i} className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-cyan-500/20 text-cyan-400/70 bg-cyan-500/5">{s}</span>
                            ))}
                          </div>
                          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed border-l-2 border-cyan-500/20 pl-3">
                            {vendor.portfolio || 'Verified precision manufacturer within the MechHub trusted network.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })() : (
            <div className="flex gap-5 pb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-[288px] shrink-0 h-[320px] rounded-2xl border border-white/[0.05] bg-zinc-900/40 animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-[#020617] relative overflow-hidden">
        <div className="blueprint-grid opacity-[0.03]" suppressHydrationWarning />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/10 via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <Tabs defaultValue="innovators" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[320px_1fr] gap-10 lg:gap-20 items-start">

              {/* Left panel: header + tabs + CTA */}
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500">WHY MECHHUB</span>
                    <span className="w-10 h-px bg-cyan-500/30"></span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl lg:text-[52px] leading-[1.2] tracking-tight text-white mb-6 drop-shadow-sm pr-4 lg:pr-10">
                    Built for both sides of manufacturing
                  </h2>
                  <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-light">
                    Whether you're launching a product or running a machine shop — MechHub creates value on both ends.
                  </p>
                </div>

                {/* Tab toggle */}
                <div className="flex flex-col gap-2">
                  <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-3">
                    <TabsTrigger
                      value="innovators"
                      className="w-full justify-start text-left h-auto p-4 rounded-xl border border-white/[0.05] bg-white/[0.01] data-[state=active]:border-cyan-500/40 data-[state=active]:bg-cyan-950/20 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(34,211,238,0.1)] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] transition-all backdrop-blur-sm"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-1.5">
                          <Upload className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-xs font-bold uppercase tracking-wider">For Innovators</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-normal text-left">Engineers, startups & product teams</p>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="manufacturers"
                      className="w-full justify-start text-left h-auto p-4 rounded-xl border border-white/[0.07] bg-transparent data-[state=active]:border-cyan-500/40 data-[state=active]:bg-cyan-950/30 data-[state=active]:text-white text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] transition-all"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Factory className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-xs font-bold uppercase tracking-wider">For Manufacturers</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-normal text-left">Machine shops, fabricators & job shops</p>
                      </div>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Contextual CTAs */}
                <TabsContent value="innovators" className="mt-2">
                  <Link href="/upload">
                    <Button className="w-full h-12 text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all" suppressHydrationWarning>
                      Upload Your Design <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </TabsContent>
                <TabsContent value="manufacturers" className="mt-2">
                  <Button className="w-full h-12 text-sm font-bold rounded-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-950/30 hover:border-cyan-400 hover:text-cyan-300 transition-all" variant="outline" suppressHydrationWarning>
                    Join as a MechMaster <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </TabsContent>
              </div>

              {/* Right panel: benefit grid */}
              <div>
                <TabsContent value="innovators" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { num: '01', title: 'Faster Quotation', desc: 'No more chasing vendors on WhatsApp. Get structured quotes in record time.', icon: Zap },
                      { num: '02', title: 'Verified Vendors', desc: 'Every MechMaster is screened for capability, quality, and delivery consistency.', icon: ShieldCheck },
                      { num: '03', title: 'Transparent Pricing', desc: 'Clear cost breakdown with no hidden surprises. Compare options side by side.', icon: CircleDollarSign },
                      { num: '04', title: 'Quality Layer', desc: 'Production updates, QC checklists, and inspection images before delivery.', icon: ClipboardCheck },
                      { num: '05', title: 'NDA & IP Protection', desc: 'Binding NDAs with all MechMasters keep your designs 100% confidential.', icon: Lock },
                      { num: '06', title: 'End-to-End Tracking', desc: 'From upload to delivery, manage everything in one integrated dashboard.', icon: LayoutDashboard },
                    ].map((b) => (
                      <div key={b.num} className="group flex gap-4 p-5 rounded-2xl border border-white/[0.05] bg-[#040f25]/30 hover:border-cyan-500/30 hover:bg-cyan-950/20 transition-all duration-300 backdrop-blur-sm">
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-xl bg-zinc-950/80 border border-white/10 flex items-center justify-center group-hover:border-cyan-400/50 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all">
                            <b.icon className="w-4 h-4 text-cyan-500/80 group-hover:text-cyan-300 transition-colors" />
                          </div>
                          <span className="absolute -top-2 -right-2 text-[9px] font-bold text-cyan-400 font-consolas bg-[#020617] px-1 rounded-sm border border-cyan-500/20">{b.num}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-zinc-100 mb-1.5 group-hover:text-cyan-50 transition-colors">{b.title}</h3>
                          <p className="text-xs text-zinc-400 leading-relaxed font-light">{b.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="manufacturers" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { num: '01', title: 'More Orders', desc: 'Receive RFQs from serious engineering teams, startups, and enterprises.', icon: TrendingUp },
                      { num: '02', title: 'Zero Marketing Cost', desc: 'We bring qualified customers to you — no ad spend required.', icon: MessageSquare },
                      { num: '03', title: 'No Monthly Fees', desc: 'Only a small commission on confirmed, completed orders. No upfront cost.', icon: CircleDollarSign },
                      { num: '04', title: 'Faster Payments', desc: 'Structured payment milestones designed to eliminate traditional delays.', icon: FastForward },
                      { num: '05', title: 'Direct Communication', desc: 'Speak directly with customers — no middlemen, no misunderstandings.', icon: Users2 },
                      { num: '06', title: 'Grow Your Capacity', desc: 'Consistent order flow helps justify equipment upgrades and team expansion.', icon: TrendingUp },
                    ].map((b) => (
                      <div key={b.num} className="group flex gap-4 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-cyan-500/20 hover:bg-cyan-950/10 transition-all duration-300">
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-cyan-500/30 group-hover:bg-cyan-950/30 transition-all">
                            <b.icon className="w-4 h-4 text-cyan-400/70 group-hover:text-cyan-300 transition-colors" />
                          </div>
                          <span className="absolute -top-1.5 -right-1.5 text-[8px] font-bold text-cyan-500/60 font-mono">{b.num}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-white mb-1 group-hover:text-cyan-100 transition-colors">{b.title}</h3>
                          <p className="text-xs text-zinc-500 leading-relaxed">{b.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </div>
            </div>

            {/* NDA Trust Banner */}
            <div className="mt-16 max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/20 to-[#040f25]/40 backdrop-blur-sm shadow-[0_0_30px_rgba(34,211,238,0.05)]">
              <div className="w-16 h-16 rounded-2xl bg-[#020617] border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-inner">
                <Lock className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-zinc-100 font-bold text-base md:text-lg mb-1.5 flex items-center gap-2 justify-center sm:justify-start">
                  Your IP is 100% protected <ShieldCheck className="w-5 h-5 text-cyan-400" />
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed font-light">
                  Innovation is your greatest asset. We sign a strictly binding NDA with all MechMasters to ensure your designs and intellectual property are fully protected at every stage of production.
                </p>
              </div>
            </div>
          </Tabs>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-[#020617] to-cyan-950/10 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] lg:grid-cols-[1fr_400px] gap-10 lg:gap-16 items-center">

              {/* Left: Content */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500 mb-3">EXPERT SUPPORT</p>
                <h2 className="font-bold text-3xl md:text-4xl tracking-tight text-white leading-tight">
                  Need Expert Manufacturing Guidance?
                </h2>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-10 max-w-md font-light">
                  Get your design reviewed, value-engineered, or fully optimised by our in-house manufacturing experts — before a single chip is cut.
                </p>

                {/* Service highlights */}
                <div className="grid grid-cols-2 gap-4 mb-12">
                  {[
                    { icon: Settings, label: 'Design Optimization', desc: 'Improve manufacturability & tolerances' },
                    { icon: CircleDollarSign, label: 'Cost Reduction', desc: 'Reduce part cost by 10–40%' },
                    { icon: ClipboardCheck, label: 'DFM Analysis', desc: 'Design-for-manufacturing review' },
                    { icon: MessageSquare, label: 'Full Design Support', desc: 'End-to-end engineering assistance' },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-4 p-4 rounded-xl border border-white/[0.05] bg-white/[0.01] hover:border-cyan-500/30 hover:bg-cyan-950/20 transition-all duration-300 group">
                      <div className="w-10 h-10 rounded-xl bg-zinc-950/50 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all">
                        <item.icon className="w-4 h-4 text-zinc-400 group-hover:text-cyan-300 transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-200 group-hover:text-cyan-100 transition-colors">{item.label}</p>
                        <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  size="lg"
                  onClick={() => {
                    if (user) {
                      router.push('/consultation');
                    } else {
                      router.push('/login?tab=register&redirect=/consultation');
                    }
                  }}
                  className="h-12 px-10 text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-full shadow-[0_0_25px_rgba(59,130,246,0.3)] hover:shadow-[0_0_35px_rgba(59,130,246,0.5)] transition-all"
                  suppressHydrationWarning
                >
                  Book a Free Consultation <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              {/* Right: Image */}
              <div className="hidden md:block relative h-[420px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
                <Image
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
                  alt="Engineering Consultation Session"
                  fill
                  className="object-cover grayscale mix-blend-overlay opacity-60 hover:scale-105 transition-transform duration-700"
                />
                {/* Cinematic gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/80 via-[#020617]/50 to-blue-900/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />

                {/* Floating tag */}
                <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md border border-cyan-500/20 px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  <span className="text-[10px] font-bold text-cyan-100 uppercase tracking-wider">Consultations Available</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

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

    </div>
  );
}
