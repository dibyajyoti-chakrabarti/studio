'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import {
  Maximize2,
  Ruler,
  ChevronLeft,
  ArrowRight,
  Settings,
  Zap,
  ShieldCheck,
  Target,
  CheckCircle2,
  Info,
  Clock,
  Layers,
  Cpu,
  Factory,
  Database,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingNav } from '@/components/LandingNav';
import { Footer } from '@/components/Footer';

const MATERIALS = [
  {
    category: "Aluminium",
    items: [
      { name: "Aluminium 5052", sizes: "1mm, 1.6mm, 2mm, 2.3mm, 2.5mm, 3.2mm, 4.7mm, 6.3mm, 8.0mm, 9.5mm", notes: ">5mm not for bending, powder coating available", color: "bg-slate-200" },
      { name: "Aluminium 6061", sizes: "1mm, 1.6mm, 2mm, 2.5mm, 3.2mm, 4.7mm, 6.3mm, 8.0mm, 9.5mm", notes: "Not for bending, powder coating available", color: "bg-slate-300" },
    ]
  },
  {
    category: "Steel",
    items: [
      { name: "CRCA Mild Steel", sizes: "0.8mm, 1.2mm, 1.5mm, 1.9mm, 2.6mm, 3.0mm, 3.4mm, 4.8mm, 6.3mm, 8.0mm, 9.5mm", notes: ">5mm not for bending, powder coating available", color: "bg-slate-500" },
      { name: "Stainless Steel 304", sizes: "0.8mm, 1.2mm, 1.5mm, 1.9mm, 2.5mm, 3.2mm, 4.7mm, 6.3mm, 9.5mm", notes: ">5mm not for bending, powder coating available", color: "bg-zinc-300" },
    ]
  },
  {
    category: "Composites & Plastics",
    items: [
      { name: "Carbon Fiber Plate", sizes: "1mm, 1.6mm, 2mm, 3mm, 4mm, 5mm", notes: "Not for bending, no powder coating", color: "bg-zinc-800" },
      { name: "Acrylic", sizes: "1.6mm, 3mm, 4.5mm, 5.4mm, 9.5mm, 12.7mm", notes: "Not for bending, no powder coating", color: "bg-blue-100/40" },
    ]
  },
  {
    category: "Wood",
    items: [
      { name: "MDF", sizes: "3.2mm, 6.3mm, 9.5mm, 12.7mm", notes: "Not for bending, no powder coating", color: "bg-amber-100" },
      { name: "Plywood", sizes: "3.2mm, 6.3mm, 9.0mm, 12.0mm", notes: "Not for bending, no powder coating", color: "bg-amber-50" },
      { name: "Balsa Wood", sizes: "1mm, 3mm, 5mm", notes: "Not for bending, no powder coating", color: "bg-orange-50" },
    ]
  },
  {
    category: "Advanced Production",
    items: [
      { name: "3D Printed PLA", sizes: "Variable", notes: "Rapid prototyping, multiple colors available", color: "bg-emerald-400" },
      { name: "3D Printed ABS/TPU", sizes: "Variable", notes: "Functional parts, flexible (TPU) or rigid (ABS)", color: "bg-orange-400" },
      { name: "3D Printed PETG/ASA", sizes: "Variable", notes: "UV resistant (ASA), chemical resistant (PETG)", color: "bg-blue-400" },
    ]
  }
];

export default function CNCMachiningPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 selection:text-[#2F5FA7] font-sans">
      <LandingNav />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] lg:h-[70vh] flex items-center py-20 lg:py-0 overflow-hidden  bg-slate-950">
        {/* Architect/Blueprint Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '20px 20px, 100px 100px, 100px 100px'
          }}></div>

        <div className="container mx-auto px-4 md:px-10 lg:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left-12 duration-1000">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold tracking-widest uppercase mb-4">
                <Cpu className="w-4 h-4" />
                Subtractive Manufacturing
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tighter uppercase">
                Online CNC <br />
                <span className="text-cyan-300">Machining</span>
              </h1>
              <p className="text-xl text-white/80 max-w-xl leading-relaxed">
                Professional 3-axis and 5-axis CNC machining services. From prototype to production, we deliver precision components with mechanical excellence and verified tolerances.
              </p>
              <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Target className="w-5 h-5 text-cyan-300" />
                  <span>± 0.005" Standard</span>
                </div>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Zap className="w-5 h-5 text-cyan-300" />
                  <span>3 Day Rush Lead-time</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link href="/login?redirect=/dashboard">
                  <Button size="lg" className="w-full sm:w-auto px-10 h-16 bg-white hover:bg-slate-100 text-[#2F5FA7] rounded-full font-black text-lg gap-2 shadow-2xl">
                    Get Started <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative group animate-in fade-in zoom-in duration-1000">
              <div className="absolute -inset-4 bg-white/10 rounded-[3rem] blur-2xl group-hover:bg-white/20 transition-all duration-700 opacity-50"></div>
              <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border-4 md:border-8 border-white/10 shadow-2xl aspect-square md:aspect-[4/3] bg-slate-900/40 backdrop-blur-sm">
                <Image
                  src="/cnc.png"
                  alt="Precision CNC Machined Component"
                  fill
                  className="object-contain p-12 transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 md:p-10">
                  <div className="bg-white/95 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl shadow-xl inline-flex items-center gap-3 md:gap-4">
                    <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">Verified Quality</p>
                      <p className="text-sm font-bold text-slate-900">5-Axis Alignment Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Machining Capabilities */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="text-center max-w-3xl mx-auto mb-20 leading-tight">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
              Machining Capabilities
            </h2>
            <p className="text-lg text-slate-600 font-medium">
              We utilize state-of-the-art subtractive centers to deliver high-performance mechanical components with institutional precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "CNC Milling",
                desc: "3-axis, 4-axis, and 5-axis vertical/horizontal milling for complex prismatic parts.",
                icon: Cpu,
                color: "bg-blue-600",
                features: ["±0.01mm Position Accuracy", "High-speed 20k RPM Spindles", "Large Platform 1000mm+"]
              },
              {
                title: "CNC Turning",
                desc: "High-precision lathe services for shafts, bushings, and round components with live-tooling.",
                icon: Settings,
                color: "bg-cyan-500",
                features: ["Concentricity ±0.01mm", "Live Tooling Capability", "Sub-spindle Finishing"]
              }
            ].map((option, index) => (
              <div key={index} className="group relative bg-slate-50 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-slate-100 hover:border-[#2F5FA7]/30 transition-all duration-500 hover:shadow-2xl">
                <div className="relative h-48 mb-8 rounded-2xl overflow-hidden shadow-lg bg-white flex items-center justify-center p-8">
                  <div className={`w-20 h-20 rounded-2xl ${option.color} flex items-center justify-center text-white shadow-xl transform group-hover:rotate-12 transition-transform duration-500`}>
                    <option.icon className="w-10 h-10" />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">{option.title}</h3>
                <p className="text-slate-600 mb-8 font-bold leading-relaxed">{option.desc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 pt-8">
                  {option.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      <span className="text-sm font-bold text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering Guidelines */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#2F5FA7]/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 md:px-10 lg:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 uppercase tracking-tighter">
                  Design for <br />
                  <span className="text-cyan-400">Machining</span>
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed font-medium">
                  Optimizing your geometry for subtractive tools reduces machine time and tooling cost. Follow these essential DFM rules.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { id: "M1", title: "Wall Thickness", desc: "Maintain at least 0.8mm for metals and 1.5mm for plastics to prevent deformation.", icon: <Maximize2 className="w-5 h-5" /> },
                  { id: "M2", title: "Internal Radii", desc: "Corners should have a radius of at least 1/3 the cavity depth to fit standard end-mills.", icon: <Zap className="w-5 h-5" /> },
                  { id: "M3", title: "Thread Depth", desc: "Limit internal threads to 3x the hole diameter. Deeper reaches risk tap breakage.", icon: <Layers className="w-5 h-5" /> },
                ].map((item) => (
                  <div key={item.id} className="flex gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-400/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-400/30 font-black text-xl group-hover:scale-110 transition-transform">
                      {item.id}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2 flex items-center gap-2">
                        {item.title}
                      </h4>
                      <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="aspect-square md:aspect-[4/3] bg-white border-4 md:border-8 border-slate-900 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative p-6 md:p-12">
                <Image
                  src="https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=1200"
                  alt="Machining Geometry Guide"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 md:p-10">
                  <div className="bg-white/95 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl shadow-xl inline-flex items-center gap-3 md:gap-4">
                    <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Geometry Audit</p>
                      <p className="text-sm font-bold text-slate-900 text-nowrap">Auto-Detection of Sub-mm Walls Active</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full border-4 border-cyan-400 rounded-[3rem] hidden lg:block opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
              Machining Materials
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              We machine everything from aerospace-grade aluminum to high-temp engineering plastics.
            </p>
          </div>

          <div className="space-y-16">
            {MATERIALS.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="text-2xl font-black text-slate-900 mb-8 border-l-4 border-blue-600 pl-6 uppercase tracking-widest">{group.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.items.map((material, mIndex) => (
                    <div key={mIndex} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-blue-600/20 transition-all hover:bg-white hover:shadow-xl group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <h4 className="text-lg font-black text-slate-900 flex items-center gap-2 lowercase">
                          <CheckCircle2 className="w-5 h-5 text-blue-600" />
                          {material.name}
                        </h4>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase">Machining QC Passed</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 leading-none">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block w-full mb-1">Stock Availability:</span>
                          <span className="bg-white border border-slate-200 px-3 py-1 rounded-md text-xs font-bold text-slate-700 shadow-sm transition-colors group-hover:border-blue-200">
                            Industrial Grade
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-bold italic bg-white/10 p-2 rounded-lg border border-slate-100 leading-normal">
                          <span className="text-blue-600 inline-block mr-1">Characteristics:</span> {material.notes}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 relative z-10">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="lg:w-1/3">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 uppercase tracking-tighter leading-none">
                How to Order <br />
                <span className="text-blue-600">Machined Parts</span>
              </h2>
              <p className="text-slate-600 font-medium mb-12">
                Our digital twin process ensures your CAD is executed with 1:1 fidelity on our shop floor.
              </p>
              <div className="hidden lg:block">
                <div className="w-full aspect-[4/5] relative rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
                  <Image src="https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&q=80" alt="Process Visualization" fill className="object-cover" />
                  <div className="absolute inset-0 bg-blue-600/20 mix-blend-multiply" />
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 space-y-12">
              {[
                {
                  step: "01",
                  title: "Instant CAD Analysis",
                  description: "Drag & drop your 3D models (STEP, IGES). Our automated engine analyzes your geometry in seconds for machinability and cost."
                },
                {
                  step: "02",
                  title: "Configure & Quote",
                  description: "Choose your material, surface finish, and tolerances. Receive an instant price with verified lead times."
                },
                {
                  step: "03",
                  title: "Precision Production",
                  description: "Your parts are routed to a verified MechHub cluster for precision manufacturing under strict AS9100 quality control."
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-10 group">
                  <div className="text-4xl md:text-6xl font-black text-slate-200 group-hover:text-[#2F5FA7]/20 transition-colors leading-none">
                    {item.step}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter">{item.title}</h3>
                    <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-xl">{item.description}</p>
                  </div>
                </div>
              ))}

              <div className="pt-10">
                <Link href="/login?redirect=/dashboard">
                  <Button size="lg" className="w-full md:w-auto px-16 h-20 bg-[#2F5FA7] hover:bg-blue-700 text-white rounded-[2rem] font-black text-xl gap-4 shadow-[0_20px_50px_rgba(47,95,167,0.3)]">
                    Start Machining <ArrowRight className="w-6 h-6" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-black text-[#2F5FA7] uppercase tracking-[0.3em] mb-4">Precision Engineering</p>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-10 max-w-2xl mx-auto tracking-tighter uppercase leading-tight">
            Machine your components with absolute confidence.
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <span className="font-bold text-slate-700 uppercase leading-none">AS9100 Verified</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <span className="font-bold text-slate-700 uppercase leading-none">Global Shipping</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
