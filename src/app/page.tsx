"use client"

import { useState, useEffect } from 'react';
import { LandingNav } from '@/components/LandingNav';
import { RotatingGears } from '@/components/Gears';
import { ServicesSection } from '@/components/ServicesSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/Logo';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useFirestore, setDocumentNonBlocking, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where, limit } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const db = useFirestore();

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

  async function handleConsultationSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!db) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const id = Math.random().toString(36).substring(2, 11);

    const requestData = {
      id,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
      consultationOptions: [],
      requestDate: new Date().toISOString(),
    };

    const docRef = doc(db, 'consultationRequests', id);

    try {
      setDocumentNonBlocking(docRef, requestData, { merge: true });
      setIsSubmitted(true);
      setIsSubmitting(false);
      setTimeout(() => {
        setDialogOpen(false);
        setIsSubmitted(false);
      }, 2000);
    } catch (err) {
      setIsSubmitting(false);
      toast({
        title: "Submission failed",
        description: "Something went wrong while sending your request.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden" suppressHydrationWarning>
      <LandingNav />

      <section className="relative pt-24 pb-14 md:pt-36 md:pb-24 overflow-hidden">
        {/* Background elements */}
        <div className="blueprint-grid opacity-10" suppressHydrationWarning />
        <RotatingGears />

        {/* Soft radial glow behind hero text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <div className="w-[700px] h-[400px] rounded-full bg-blue-600/10 blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              India's Precision Manufacturing Platform
            </div>

            {/* Main headline */}
            <h1 className="font-headline text-4xl sm:text-5xl md:text-[64px] font-bold leading-[1.1] tracking-tight text-white mb-6">
              From Laser-Cut Prototypes to{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Full Production Runs
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed mb-4">
              MechHub delivers <span className="text-zinc-300 font-semibold">precision-engineered parts</span> with unmatched quality — connecting innovators with verified Indian manufacturers for every stage of production.
            </p>

            {/* Capabilities pill strip */}
            <div className="flex flex-wrap justify-center gap-2 mb-10 mt-2">
              {['CNC Machining', 'Laser Cutting', 'Sheet Metal', 'Welding & Fab', 'Rapid Prototyping', 'Small Batch'].map((cap) => (
                <span key={cap} className="text-[11px] font-semibold px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-zinc-400">
                  {cap}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
              <Link href="/upload">
                <Button
                  size="lg"
                  className="h-14 px-10 text-base font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-full shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:shadow-[0_0_40px_rgba(59,130,246,0.55)] transition-all duration-300 group"
                  suppressHydrationWarning
                >
                  Upload Your Design
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="ghost"
                className="h-14 px-10 text-base border border-white/10 hover:bg-white/5 rounded-full text-zinc-300 hover:text-white transition-all"
                suppressHydrationWarning
              >
                Become a MechMaster
              </Button>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-3 sm:flex sm:flex-wrap justify-center items-center gap-x-6 sm:gap-x-8 gap-y-4 sm:gap-y-3 border-t border-white/[0.07] pt-8 w-full">
              {[
                { val: '±0.05mm', lbl: 'Tolerance' },
                { val: '24 Hrs', lbl: 'Min Lead Time' },
                { val: '50+', lbl: 'MechMasters' },
                { val: '100%', lbl: 'QC Inspected' },
                { val: 'NDA', lbl: 'IP Protected' },
              ].map((stat) => (
                <div key={stat.lbl} className="text-center">
                  <div className="text-white font-bold text-base sm:text-lg font-mono">{stat.val}</div>
                  <div className="text-zinc-500 text-[10px] uppercase tracking-wider">{stat.lbl}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      <ServicesSection />

      <section id="how-it-works" className="py-10 relative overflow-hidden">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-3">// PROCESS</p>
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4 uppercase tracking-tight text-white">
              How It Works
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto text-sm leading-relaxed">
              From design file to finished part — a streamlined process built for speed, quality, and full transparency.
            </p>
          </div>

          {/* Steps */}
          <div className="relative max-w-5xl mx-auto">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-[52px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-4">
              {[
                {
                  num: '01', icon: Upload, title: 'Upload Design',
                  desc: 'Securely upload STEP, STL, DWG, or PDF files.'
                },
                {
                  num: '02', icon: Search, title: 'Get Instant Quote',
                  desc: 'Our system analyzes your design and matches it with capacity.',
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
                <div key={step.num} className="flex flex-col items-center text-center group">
                  {/* Number + Icon badge */}
                  <div className="relative mb-6">
                    <div className="w-[52px] h-[52px] rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-cyan-500/40 group-hover:bg-cyan-950/40 transition-all duration-300 shadow-lg">
                      <step.icon className="w-5 h-5 text-cyan-400/70 group-hover:text-cyan-300 transition-colors" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-zinc-950 border border-white/10 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-cyan-400 font-mono">{step.num}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-headline text-base font-bold text-white mb-2 group-hover:text-cyan-100 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed mb-4 px-2">
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

      <section id="vendors" className="pt-10 pb-6 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/0 via-blue-950/5 to-zinc-950/0 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">// VERIFIED MARKETPLACE</span>
              </div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-3">
                Meet Our MechMasters
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed">
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
              <div className="relative marquee-track overflow-hidden w-full">
                {/* Left/right fade edges — match page bg */}
                <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
                  style={{ background: 'linear-gradient(to right, hsl(200 19% 17%), transparent)' }} />
                <div className="marquee-inner gap-5 pb-2">
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

      <section className="py-10 bg-background relative overflow-hidden">
        <div className="blueprint-grid opacity-5" suppressHydrationWarning />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/10 via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <Tabs defaultValue="innovators" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[320px_1fr] gap-10 lg:gap-20 items-start">

              {/* Left panel: header + tabs + CTA */}
              <div className="flex flex-col gap-6 md:sticky md:top-28">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-3">// WHY MECHHUB</p>
                  <h2 className="font-headline text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-4 leading-tight">
                    Built for both sides of manufacturing
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Whether you're launching a product or running a machine shop — MechHub creates value on both ends.
                  </p>
                </div>

                {/* Tab toggle */}
                <div className="flex flex-col gap-2">
                  <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-2">
                    <TabsTrigger
                      value="innovators"
                      className="w-full justify-start text-left h-auto p-4 rounded-xl border border-white/[0.07] bg-transparent data-[state=active]:border-cyan-500/40 data-[state=active]:bg-cyan-950/30 data-[state=active]:text-white text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] transition-all"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
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
                <TabsContent value="innovators" className="mt-0">
                  <Link href="/upload">
                    <Button className="w-full h-10 text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-full" suppressHydrationWarning>
                      Upload Your Design <ArrowRight className="ml-2 w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </TabsContent>
                <TabsContent value="manufacturers" className="mt-0">
                  <Button className="w-full h-10 text-sm font-bold rounded-full" variant="outline" suppressHydrationWarning>
                    Join as a MechMaster <ArrowRight className="ml-2 w-3.5 h-3.5" />
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
            <div className="mt-16 max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border border-white/[0.07] bg-gradient-to-r from-blue-950/30 to-zinc-900/30">
              <div className="w-14 h-14 rounded-2xl bg-blue-950/60 border border-blue-400/20 flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6 text-cyan-300" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-white font-bold text-base mb-1 flex items-center gap-2 justify-center sm:justify-start">
                  Your IP is 100% protected <ShieldCheck className="w-4 h-4 text-cyan-400" />
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Innovation is your greatest asset. We sign a strictly binding NDA with all MechMasters to ensure your designs and intellectual property are fully protected at every stage of production.
                </p>
              </div>
            </div>
          </Tabs>
        </div>
      </section>

      <section className="py-10 bg-white relative overflow-hidden">

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] lg:grid-cols-[1fr_400px] gap-10 lg:gap-16 items-center">

              {/* Left: Content */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-3">// EXPERT SUPPORT</p>
                <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4 uppercase tracking-tight text-zinc-900 leading-tight">
                  Need Expert Manufacturing Guidance?
                </h2>
                <p className="text-zinc-600 text-sm leading-relaxed mb-8 max-w-md">
                  Get your design reviewed, value-engineered, or fully optimised by our in-house manufacturing experts — before a single chip is cut.
                </p>

                {/* Service highlights */}
                <div className="grid grid-cols-2 gap-3 mb-10">
                  {[
                    { icon: Settings, label: 'Design Optimization', desc: 'Improve manufacturability & tolerances' },
                    { icon: CircleDollarSign, label: 'Cost Reduction', desc: 'Reduce part cost by 10–40%' },
                    { icon: ClipboardCheck, label: 'DFM Analysis', desc: 'Design-for-manufacturing review' },
                    { icon: MessageSquare, label: 'Full Design Support', desc: 'End-to-end engineering assistance' },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-3 p-4 rounded-xl border border-zinc-200 bg-zinc-50 hover:border-blue-200 hover:bg-blue-50/50 transition-all group">
                      <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center shrink-0 group-hover:border-blue-300 group-hover:bg-blue-50 transition-all shadow-sm">
                        <item.icon className="w-3.5 h-3.5 text-blue-600/70 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-800 group-hover:text-blue-700 transition-colors">{item.label}</p>
                        <p className="text-[10px] text-zinc-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="h-12 px-10 text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-full shadow-[0_0_25px_rgba(59,130,246,0.3)] hover:shadow-[0_0_35px_rgba(59,130,246,0.5)] transition-all"
                      suppressHydrationWarning
                    >
                      Book a Free Consultation <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] bg-zinc-950 border border-white/10 text-foreground">
                    <DialogHeader>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-cyan-400">// FREE CONSULTATION</span>
                      </div>
                      <DialogTitle className="font-headline text-xl text-white">Expert Manufacturing Consultation</DialogTitle>
                      <DialogDescription className="text-zinc-500 text-sm">
                        Share your project details and our experts will get back to you within 24 hours.
                      </DialogDescription>
                    </DialogHeader>
                    {isSubmitted ? (
                      <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                          <Check className="w-7 h-7 text-green-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-1 text-white">Request Sent!</h3>
                        <p className="text-zinc-500 text-sm">Our experts will contact you within 24 hours.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleConsultationSubmit} className="space-y-3 mt-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label htmlFor="name" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Name</label>
                            <Input id="name" name="name" required className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus:border-cyan-500/40 h-10 text-sm rounded-xl" suppressHydrationWarning />
                          </div>
                          <div className="space-y-1.5">
                            <label htmlFor="phone" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Phone</label>
                            <Input id="phone" name="phone" required className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus:border-cyan-500/40 h-10 text-sm rounded-xl" suppressHydrationWarning />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="email" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Email</label>
                          <Input id="email" name="email" type="email" required className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus:border-cyan-500/40 h-10 text-sm rounded-xl" suppressHydrationWarning />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="message" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Project Brief</label>
                          <Textarea id="message" name="message" required placeholder="Describe your design, material, quantity, and timeline..." className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus:border-cyan-500/40 min-h-[90px] text-sm rounded-xl resize-none" suppressHydrationWarning />
                        </div>
                        <div className="flex items-center gap-3 p-3 border border-dashed border-white/10 rounded-xl hover:border-cyan-500/20 transition-colors cursor-pointer">
                          <Upload className="w-4 h-4 text-zinc-500" />
                          <span className="text-xs text-zinc-500">Attach design file (STEP, STL, PDF) — optional</span>
                        </div>
                        <Button
                          type="submit"
                          className="w-full h-11 font-bold text-sm bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-full"
                          disabled={isSubmitting}
                          suppressHydrationWarning
                        >
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Request'}
                        </Button>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </div>

              {/* Right: Image */}
              <div className="hidden md:block relative h-[420px] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
                  alt="Engineering Consultation Session"
                  fill
                  className="object-cover grayscale"
                />
                {/* Light gradient overlay for white background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
                {/* Border */}
                <div className="absolute inset-0 rounded-2xl border border-zinc-200" />
                {/* Floating tag */}
                <div className="absolute bottom-5 left-5 flex items-center gap-2 bg-white/95 backdrop-blur border border-zinc-200 px-3 py-2 rounded-xl shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-wider">Consultations Available</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <footer className="bg-zinc-950 border-t border-white/[0.06]">
        {/* Top CTA strip */}
        <div className="border-b border-white/[0.05] py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-headline text-xl font-bold text-white mb-1">Ready to build your next part?</h3>
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
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-5">
                <Logo size={32} />
                <span className="font-headline font-bold text-lg tracking-tight text-white uppercase">MechHub</span>
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
                  { label: 'About Us', href: '#' },
                  { label: 'How It Works', href: '#how-it-works' },
                  { label: 'MechMasters', href: '#vendors' },
                  { label: 'Contact', href: '#' },
                  { label: 'Careers', href: '#' },
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
                  { label: 'Privacy Policy', href: '#' },
                  { label: 'Terms of Service', href: '#' },
                  { label: 'Refund Policy', href: '#' },
                  { label: 'NDA Policy', href: '#' },
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
