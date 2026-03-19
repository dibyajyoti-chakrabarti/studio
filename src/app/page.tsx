"use client"

import { useState, useEffect } from 'react';
import { LandingNav } from '@/components/LandingNav';
import { RotatingGears } from '@/components/Gears';
import { ServicesSection } from '@/components/ServicesSection';
import { MaterialsSection } from '@/components/MaterialsSection';
import { Footer } from '@/components/Footer';
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
    "Rapid manufacturing with delivery in as little as 2 days. \n Whatever you’re building we’ve got you.",
    "Engineering Your Vision \n Prototyping to High-Volume Production.",
    "Powering Innovation \n First Prototype to Full Production Run.",
    "Precision Parts \n From Idea to Mass Production."
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

  const handleWIPClick = (e: React.MouseEvent, feature: string) => {
    e.preventDefault();
    toast({
      title: "Coming Soon!",
      description: `We're currently working on the ${feature}. Check back soon for updates!`,
    });
  };



  return (
    <div className="min-h-screen relative overflow-x-hidden" suppressHydrationWarning>
      <LandingNav />

      <section className="relative pt-32 pb-24 overflow-hidden bg-[#2F5FA7]">
        {/* Advanced Background Elements */}
        <div className="blueprint-grid opacity-[0.1]" suppressHydrationWarning />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A66] via-[#2F5FA7] to-[#1E3A66] opacity-90" />

        {/* Cinematic glow effects */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-300/10 blur-[150px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#1E3A66] to-transparent pointer-events-none z-10" />

        <div className="container mx-auto px-4 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* LEFT: Messaging & Strategy */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">

              {/* Premium Eyebrow badge */}
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/20 bg-white/10 text-white text-xs font-semibold tracking-widest uppercase mb-10 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-left-4 duration-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                India&apos;s Premier Manufacturing Network
              </div>

              {/* Main headline - Precision Terminal Aesthetic */}
              <div className="relative mb-8 min-h-[140px] md:min-h-[180px] lg:min-h-[140px] w-full transition-opacity duration-700 ease-in-out" style={{ opacity: fade ? 1 : 0 }}>
                <h1 className="font-poppins tracking-tight uppercase text-balance leading-[1.05] drop-shadow-md">
                  <div className="text-3xl md:text-5xl lg:text-[60px] text-white font-semibold  mb-6">
                    {heroPhrases[currentPhraseIndex % heroPhrases.length]?.split('\n')[0]}
                  </div>
                  {heroPhrases[currentPhraseIndex % heroPhrases.length]?.split('\n')[1] && (
                    <div className="text-md md:text-xl lg:text-2xl text-cyan-200 tracking-tight mt-2 opacity-90">
                      {heroPhrases[currentPhraseIndex % heroPhrases.length]?.split('\n')[1]}
                    </div>
                  )}
                </h1>
              </div>

              {/* Sub-headline */}
              <p className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed mb-12 font-medium animate-in fade-in slide-in-from-left-8 duration-1000">
                MechHub connects innovators with verified Indian manufacturers. <span className="text-cyan-300 font-bold">Upload a design</span> and get precision engineered parts delivered with transparency.
              </p>

              {/* Advanced CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-5 mb-16 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <Link href={user ? "/login" : "/login?tab=register&redirect=/dashboard"} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-16 px-12 text-base font-bold bg-white hover:bg-white/90 text-[#2F5FA7] rounded-full shadow-2xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative"
                    suppressHydrationWarning
                  >
                    <span className="relative z-10 flex items-center">
                      Upload Your Design
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2F5FA7]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={(e) => handleWIPClick(e, "MechMaster Portal")}
                  className="w-full sm:w-auto h-16 px-12 text-base font-semibold border-2 border-white/20 bg-transparent hover:bg-white/10 rounded-full text-white transition-all duration-300"
                  suppressHydrationWarning
                >
                  Become a MechMaster
                </Button>
              </div>

              {/* Feature Tags */}
              <div className="flex flex-wrap md:text-sm lg:text-base xl:text-lg items-center justify-center lg:justify-start gap-4 opacity-100 animate-in fade-in duration-1000">
                {['CNC Machining', 'Laser Cutting', '3D Printing'].map((tag) => (
                  <div key={tag} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: High-End Visual Showcase */}
            <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center animate-in fade-in zoom-in duration-1000">
              <div className="relative w-full aspect-square">

                {/* HUD Overlay Elements */}
                <div className="absolute inset-x-0 top-1/2 h-px bg-white/10 border-dashed border-b border-white/5 flex justify-between items-center px-4">
                  <div className="w-2 h-2 rounded-full bg-white/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                  <span className="text-[9px] font-mono text-white/30 bg-[#2F5FA7] px-2">STRUCTURAL DATUM: V1.2</span>
                  <div className="w-2 h-2 rounded-full bg-white/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                </div>

                <div className="absolute inset-y-0 left-1/2 w-px bg-white/10 border-dashed border-r border-white/5 flex flex-col justify-between items-center py-4">
                  <div className="w-2 h-2 rounded-full bg-white/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                  <span className="text-[9px] font-mono text-white/30 bg-[#2F5FA7] px-2 [writing-mode:vertical-lr] rotate-180">PRECISION ALIGNMENT</span>
                  <div className="w-2 h-2 rounded-full bg-white/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                </div>

                {/* Main Visual Container */}
                <div className="relative z-10 w-full h-full p-4 animate-float">
                  <div className="relative w-full h-full rounded-[48px] bg-white/5 overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
                    <div className="absolute inset-0 z-0">
                      <Image
                        src="/hero-industrial.png"
                        alt="MechHub Industrial Cluster"
                        fill
                        priority
                        className="object-contain opacity-100"
                      />
                    </div>


                    {/* Corners */}
                    <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-white/20" />
                    <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-white/20" />

                    {/* Dynamic Status Bar */}
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-2">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`w-1 h-8 rounded-full ${i <= 3 ? 'bg-white' : 'bg-white/10'} animate-pulse`} style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Rotating Gears Background Element */}
                <RotatingGears />
              </div>
            </div>

          </div>
        </div>
        <div className="flex marquee-container mt-auto">
          <div className="flex animate-marquee gap-8 items-center py-4">
            {[1, 2, 3, 4, 5, 2, 3, 4, 5, 1, 2, 3, 4, 5, 4, 2].map((i, idx) => (
              <div
                key={`part-1-${idx}`}
                className="w-32 h-32 shrink-0 rounded-[32px] border border-white/10 flex items-center justify-center group duration-500 relative overflow-hidden bg-white"
              >
                <Image
                  src={`/part_${i}.png`}
                  alt={`Industrial Component ${idx}`}
                  width={100}
                  height={100}
                  className="object-contain opacity-100 group-hover:scale-110 transition-all duration-700"
                />
              </div>
            ))}
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex animate-marquee gap-8 items-center py-4" aria-hidden="true">
            {[1, 2, 3, 4, 5, 2, 3, 4, 5, 1, 2, 3, 4, 5, 4, 2].map((i, idx) => (
              <div
                key={`part-2-${idx}`}
                className="w-32 h-32 shrink-0 rounded-[32px] border border-white/10 flex items-center justify-center group duration-500 relative overflow-hidden bg-white"
              >
                <Image
                  src={`/part_${i}.png`}
                  alt={`Industrial Component ${idx}`}
                  width={100}
                  height={100}
                  className="object-contain opacity-100 group-hover:scale-110 transition-all duration-700"
                />
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          .marquee-container {
            display: flex;
            width: fit-content;
          }
          .animate-marquee {
            animation: marquee 40s linear infinite;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>
      {/* Scroll Down Indicator */}
      <div className="flex flex-col items-center mt-20 mb-15 animate-pulse">
        <span className="text-[10px] uppercase tracking-[0.4em] text-[#0d7cbcff] font-bold mb-4">Explore Operations</span>
        <LaserArrow size={24} color="#0d7cbcff" className="opacity-50" />
      </div>
      <ServicesSection />
      <MaterialsSection />
      <section id="how-it-works" className="py-24 relative overflow-hidden bg-white">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 blueprint-grid opacity-[0.03]" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#2F5FA7] mb-4">THE PROCESS</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0F172A] mb-6">
              How It Works
            </h2>
            <p className="text-[#64748B] max-w-xl mx-auto text-sm md:text-base font-medium">
              From design file to finished part — a streamlined process built for speed, quality, and full transparency.
            </p>
          </div>

          {/* Steps */}
          <div className="relative max-w-6xl mx-auto">
            {/* Desktop Flow Indicators */}
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] z-0 h-px bg-slate-100" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {[
                {
                  num: '01', icon: Upload, title: 'Upload Design',
                  desc: 'Securely upload STEP, STL, DWG, or PDF files.'
                },
                {
                  num: '02', icon: Search, title: 'Budget Estimator',
                  desc: 'Get instant rough cost ranges for your design.',
                },
                {
                  num: '03', icon: Factory, title: 'Match MechMaster',
                  desc: 'We route to the best-fit verified manufacturer.',
                },
                {
                  num: '04', icon: ClipboardCheck, title: 'Production & QC',
                  desc: 'Real-time updates with images at every stage.',
                },
                {
                  num: '05', icon: CheckCircle2, title: 'Delivered to You',
                  desc: 'Parts dispatched with full documentation.',
                },
              ].map((step, i) => (
                <div key={step.num} className="flex flex-col items-center text-center group relative p-2">
                  {/* Icon badge */}
                  <div className="relative mb-8 z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-lg group-hover:border-[#2F5FA7]/30 group-hover:shadow-[#2F5FA7]/10 transition-all duration-300">
                      <step.icon className="w-7 h-7 text-[#2F5FA7]" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#1E3A66] flex items-center justify-center shadow-md">
                      <span className="text-[10px] font-bold text-white font-mono">{step.num}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-bold text-[#0F172A] mb-3 group-hover:text-[#2F5FA7] transition-colors uppercase tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-[#64748B] text-xs leading-relaxed px-2 font-medium">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA strip */}
          <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-6 p-8 rounded-3xl border border-blue-50 bg-[#E8F1FF]/50 max-w-3xl mx-auto shadow-sm">
            <div className="sm:flex-1 text-center sm:text-left">
              <p className="text-[#1E3A66] font-bold text-lg mb-1">Ready to get your parts made?</p>
              <p className="text-[#64748B] text-sm font-medium">Upload your design and get a quote in minutes.</p>
            </div>
            <Link href={user ? "/login" : "/login?tab=register&redirect=/dashboard"} className="shrink-0 w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto h-12 px-8 text-sm font-bold bg-[#2F5FA7] hover:bg-[#1E3A66] text-white rounded-full shadow-lg transition-all"
              >
                Upload Your Design <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="vendors" className="py-24 relative overflow-hidden bg-[#F8FAFC]">
        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#2F5FA7]">VERIFIED MARKETPLACE</span>
                <span className="w-12 h-px bg-[#2F5FA7]/20"></span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0F172A] mb-6">
                Meet Our MechMasters
              </h2>
              <p className="text-[#64748B] text-sm md:text-base leading-relaxed font-medium">
                Every MechMaster is rigorously vetted for capability, quality, and delivery. Your parts are in expert hands.
              </p>
            </div>

            {/* Stat pills */}
            <div className="flex gap-8 shrink-0 pb-2">
              {[
                { val: '50+', lbl: 'Active Partners' },
                { val: '99.8%', lbl: 'Quality Pass Rate' },
                { val: '12', lbl: 'Cities Covered' },
              ].map(s => (
                <div key={s.lbl} className="text-right">
                  <div className="text-[#1E3A66] font-bold text-2xl font-mono">{s.val}</div>
                  <div className="text-[#94A3B8] text-[10px] uppercase font-bold tracking-wider">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Vendor Cards — infinite auto-scroll marquee */}
          {landingVendors?.length ? (() => {
            const repeated = Array.from({ length: 6 }, () => landingVendors).flat();
            return (
              <div className="relative marquee-track overflow-hidden w-full mt-8">


                <div className="marquee-inner gap-8 pb-8 pt-4">
                  {repeated.map((vendor, idx) => (
                    <div key={`${idx}-${vendor.id}`} className="w-[300px] shrink-0 group" style={{ marginRight: '32px' }}>
                      <div className="h-full rounded-2xl border border-white bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden hover:border-[#2F5FA7]/20 hover:shadow-[0_20px_50px_rgba(47,95,167,0.1)] transition-all duration-500">
                        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                          <Image src={vendor.imageUrl || "/mechhub.png"} alt={vendor.fullName || 'Verified MechMaster'} fill className="object-cover group-hover:scale-105 transition-all duration-700" />
                          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                            {vendor.isVerified && (
                              <div className="flex items-center gap-1.5 bg-white border border-blue-50 text-[#2F5FA7] px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm">
                                <ShieldCheck className="w-3.5 h-3.5" /> Verified
                              </div>
                            )}
                            <div className="ml-auto flex items-center gap-1 bg-white border border-slate-100 px-2 py-1 rounded-full text-[10px] font-bold text-[#0F172A] shadow-sm">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              {vendor.rating || '4.8'}
                            </div>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-sm text-[#0F172A] mb-1 truncate group-hover:text-[#2F5FA7] transition-colors">
                            {vendor.teamName || vendor.fullName || 'Verified MechMaster'}
                          </h3>
                          <div className="flex items-center gap-3 text-[#64748B] text-[10px] font-bold uppercase tracking-wider mb-4">
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#2F5FA7]" />{vendor.location || 'India'}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#2F5FA7]" />{vendor.experienceYears || '0'}+ Yrs</span>
                          </div>
                          <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed font-medium">
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
            <div className="flex gap-8 pb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-[300px] shrink-0 h-[320px] rounded-2xl bg-white border border-slate-100 animate-pulse shadow-sm" />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-[#1E3A66] relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 blueprint-grid opacity-10" />
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent opacity-5" />

        <div className="container mx-auto px-4 relative z-10">
          <Tabs defaultValue="innovators" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-12 lg:gap-20 items-start">

              {/* Left panel */}
              <div className="flex flex-col gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-cyan-300">WHY MECHHUB</span>
                    <span className="w-12 h-px bg-cyan-300/30"></span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-[1.15]">
                    Built for both sides of manufacturing
                  </h2>
                  <p className="text-white/70 text-sm md:text-base leading-relaxed font-medium">
                    Whether you're launching a product or running a machine shop — MechHub creates value on both ends.
                  </p>
                </div>

                {/* Tab toggle */}
                <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-4">
                  <TabsTrigger
                    value="innovators"
                    className="w-full justify-start text-left h-auto p-5 rounded-2xl border border-white/10 bg-white/5 data-[state=active]:border-cyan-300 data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 hover:bg-white/10 hover:text-white transition-all shadow-xl"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Upload className="w-4 h-4 text-cyan-300" />
                        <span className="text-xs font-bold uppercase tracking-wider">For Innovators</span>
                      </div>
                      <p className="text-[11px] opacity-70 font-normal">Engineers, startups & product teams</p>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="manufacturers"
                    className="w-full justify-start text-left h-auto p-5 rounded-2xl border border-white/10 bg-white/5 data-[state=active]:border-cyan-300 data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 hover:bg-white/10 hover:text-white transition-all shadow-xl"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Factory className="w-4 h-4 text-cyan-300" />
                        <span className="text-xs font-bold uppercase tracking-wider">For Manufacturers</span>
                      </div>
                      <p className="text-[11px] opacity-70 font-normal">Machine shops & fabricators</p>
                    </div>
                  </TabsTrigger>
                </TabsList>

                {/* CTA */}
                <div className="mt-2">
                  <TabsContent value="innovators" className="mt-0">
                    <Link href={user ? "/login" : "/login?tab=register&redirect=/dashboard"}>
                      <Button className="w-full h-14 text-sm font-bold bg-white text-[#1E3A66] hover:bg-blue-50 rounded-full shadow-2xl transition-all">
                        Upload Your Design <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </TabsContent>
                  <TabsContent value="manufacturers" className="mt-0">
                    <Button
                      onClick={(e) => handleWIPClick(e, "MechMaster Registration")}
                      className="w-full h-14 text-sm font-bold rounded-full border-2 border-white/30 text-white hover:bg-white/10 transition-all"
                      variant="outline"
                    >
                      Join as a MechMaster <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </TabsContent>
                </div>
              </div>

              {/* Right panel */}
              <div className="bg-white/5 rounded-[32px] p-8 md:p-12 border border-white/10 shadow-3xl backdrop-blur-sm">
                <TabsContent value="innovators" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {[
                      { num: '01', title: 'Faster Quotation', desc: 'No more chasing vendors. Get structured quotes in record time.', icon: Zap },
                      { num: '02', title: 'Verified Vendors', desc: 'Every MechMaster is screened for capability and quality.', icon: ShieldCheck },
                      { num: '03', title: 'Transparent Pricing', desc: 'Clear cost breakdown with no hidden surprises.', icon: CircleDollarSign },
                      { num: '04', title: 'Quality Layer', desc: 'Production updates and inspection images before delivery.', icon: ClipboardCheck },
                      { num: '05', title: 'NDA & IP Protection', desc: 'Binding NDAs keep your designs 100% confidential.', icon: Lock },
                      { num: '06', title: 'End-to-End Tracking', desc: 'Manage everything in one integrated dashboard.', icon: LayoutDashboard },
                    ].map((b) => (
                      <div key={b.num} className="group">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-[#2F5FA7] flex items-center justify-center">
                            <b.icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-[10px] font-bold text-cyan-300 font-mono">[{b.num}]</span>
                        </div>
                        <h3 className="font-bold text-base text-white mb-2">{b.title}</h3>
                        <p className="text-white/60 text-xs leading-relaxed font-medium">{b.desc}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="manufacturers" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {[
                      { num: '01', title: 'More Orders', desc: 'Receive RFQs from serious engineering teams and startups.', icon: TrendingUp },
                      { num: '02', title: 'Zero Marketing Cost', desc: 'We bring qualified customers to you — no ad spend.', icon: MessageSquare },
                      { num: '03', title: 'No Monthly Fees', desc: 'Only a small commission on completed orders.', icon: CircleDollarSign },
                      { num: '04', title: 'Faster Payments', desc: 'Milestones designed to eliminate payment delays.', icon: FastForward },
                      { num: '05', title: 'Direct Communication', desc: 'Speak directly with customers — no middlemen.', icon: Users2 },
                      { num: '06', title: 'Grow Your Capacity', desc: 'Consistent order flow helps justify upgrades.', icon: TrendingUp },
                    ].map((b) => (
                      <div key={b.num} className="group">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-[#2F5FA7] flex items-center justify-center">
                            <b.icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-[10px] font-bold text-cyan-300 font-mono">[{b.num}]</span>
                        </div>
                        <h3 className="font-bold text-base text-white mb-2">{b.title}</h3>
                        <p className="text-white/60 text-xs leading-relaxed font-medium">{b.desc}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </section>

      {/* Expert Support Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto rounded-[40px] border border-blue-50 bg-[#E8F1FF]/30 p-8 md:p-16 relative overflow-hidden shadow-sm">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#2F5FA7]/5 rounded-full blur-3xl -z-10" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#2F5FA7] mb-6">EXPERT SUPPORT</p>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0F172A] mb-8 leading-[1.15]">
                  Need Expert Manufacturing Guidance?
                </h2>
                <p className="text-[#64748B] text-base md:text-lg leading-relaxed mb-10 font-medium max-w-lg">
                  Get your design reviewed, value-engineered, or fully optimised by our in-house experts — before a single chip is cut.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                  {[
                    { icon: Settings, label: 'Design Optimization' },
                    { icon: CircleDollarSign, label: 'Cost Reduction' },
                    { icon: ClipboardCheck, label: 'DFM Analysis' },
                    { icon: MessageSquare, label: 'Full Design Support' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-[#2F5FA7]" />
                      </div>
                      <p className="text-sm font-bold text-[#1E3A66]">{item.label}</p>
                    </div>
                  ))}
                </div>

                <Button
                  size="lg"
                  onClick={() => router.push(user ? '/consultation' : '/login?tab=register&redirect=/consultation')}
                  className="h-16 px-12 text-base font-bold bg-[#2F5FA7] hover:bg-[#1E3A66] text-white rounded-full shadow-xl transition-all"
                >
                  Book a Free Consultation <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
                  alt="Engineering Consultation"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 flex items-center gap-3 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2F5FA7] animate-pulse" />
                  <span className="text-xs font-bold text-[#1E3A66] uppercase tracking-wide">Expert Sessions Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
