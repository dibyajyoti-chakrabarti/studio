'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
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
  Search,
  Maximize2,
  Minimize2,
  Scissors,
  Droplets,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingNav } from '@/components/LandingNav';
import { Footer } from '@/components/Footer';

const CUTTING_SERVICES = [
  {
    title: "Laser Cutting",
    desc: "High-speed fiber lasers for thin to medium gauge metals. Ideal for intricate geometries and tight tolerances.",
    tolerance: "± 0.005\" (0.127mm)",
    thickness: "0.4mm – 19mm",
    icon: Zap,
    color: "bg-blue-600"
  },
  {
    title: "Waterjet Cutting",
    desc: "Cold-cutting process using high-pressure water and abrasive. Best for thick plates and heat-sensitive materials.",
    tolerance: "± 0.009\" (0.228mm)",
    thickness: "1.0mm – 57mm",
    icon: Droplets,
    color: "bg-blue-400"
  },
  {
    title: "CNC Routing",
    desc: "Mechanical cutting for non-ferrous metals, plastics, and wood. Perfect for large-format sheets.",
    tolerance: "± 0.009\" (0.228mm)",
    thickness: "3.0mm – 12.7mm",
    icon: Wrench,
    color: "bg-[#2F5FA7]"
  }
];

const CUTTING_MATERIALS = [
  {
    category: "Metals",
    items: [
      { name: "Aluminium 5052", sizes: "1mm – 9.5mm", notes: "Excellent for Laser & Waterjet. Bending notes apply.", color: "bg-slate-200" },
      { name: "Aluminium 6061", sizes: "1mm – 9.5mm", notes: "High strength. Ideal for Laser & CNC Routing.", color: "bg-slate-300" },
      { name: "CRCA Mild Steel", sizes: "0.8mm – 9.5mm", notes: "Cost-effective. Best for Laser Cutting/Powder Coating.", color: "bg-slate-500" },
      { name: "Stainless Steel 304", sizes: "0.8mm – 9.5mm", notes: "Clean edges with Nitrogen-assist Laser Cutting.", color: "bg-zinc-300" },
    ]
  },
  {
    category: "Non-Metals",
    items: [
      { name: "Carbon Fiber Plate", sizes: "1mm – 5mm", notes: "Waterjet or CNC Routing recommended to prevent delamination.", color: "bg-zinc-800" },
      { name: "Acrylic", sizes: "1.6mm – 12.7mm", notes: "Laser Cutting produces polished edges.", color: "bg-blue-100/40" },
      { name: "MDF / Plywood", sizes: "3.2mm – 12.7mm", notes: "CNC Routing for clean mechanical cuts.", color: "bg-amber-100" },
      { name: "PLA / TPU / ABS", sizes: "Custom", notes: "Soft plastics. Waterjet or CNC Routing only.", color: "bg-blue-500" },
    ]
  }
];

export default function PrecisionSheetCuttingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 selection:text-[#2F5FA7] font-sans overflow-x-hidden">
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
                <Scissors className="w-4 h-4" />
                Industrial Fabrication
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tighter uppercase">
                Precision <br />
                <span className="text-cyan-300">Sheet Cutting</span>
              </h1>
              <p className="text-xl text-white/80 max-w-xl leading-relaxed">
                From high-speed fiber lasers to cold-waterjet cutting. We deliver industrial-grade components with institutional precision across metals, plastics, and advanced composites.
              </p>
              <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Target className="w-5 h-5 text-cyan-300" />
                  <span>± 0.005" Tolerance</span>
                </div>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Zap className="w-5 h-5 text-cyan-300" />
                  <span>1-3 Day Production</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link href="/login?redirect=/dashboard">
                  <Button size="lg" className="w-full sm:w-auto px-10 h-16 bg-white hover:bg-slate-100 text-[#2F5FA7] rounded-full font-black text-lg gap-2 shadow-2xl">
                    Get Instant Quote <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative group animate-in fade-in zoom-in duration-1000 hidden md:block">
              <div className="absolute -inset-4 bg-white/10 rounded-[3rem] blur-2xl group-hover:bg-white/20 transition-all duration-700 opacity-50"></div>
              <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border-4 md:border-8 border-white/10 shadow-2xl aspect-square md:aspect-[4/3]">
                <Image
                  src="/focus-image.jpg"
                  alt="Precision Laser Cutting Blueprint"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 md:p-10">
                  <div className="bg-white/95 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl shadow-xl inline-flex items-center gap-3 md:gap-4">
                    <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">Operational Status</p>
                      <p className="text-sm font-bold text-slate-900">High-Speed Fiber Laser Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cutting Methods Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="text-center max-w-3xl mx-auto mb-20 leading-tight">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
              Cutting Capabilities
            </h2>
            <p className="text-lg text-slate-600 font-medium">
              We utilize multiple industrial technologies to ensure the perfect finish and dimensional accuracy for every material type.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CUTTING_SERVICES.map((service, index) => (
              <div key={index} className="group relative bg-slate-50 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 hover:border-[#2F5FA7]/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                <div className="relative h-48 mb-8 rounded-2xl overflow-hidden shadow-lg bg-white flex items-center justify-center p-8">
                  <div className={`w-20 h-20 rounded-2xl ${service.color} flex items-center justify-center text-white shadow-xl transform group-hover:rotate-12 transition-transform duration-500`}>
                    <service.icon className="w-10 h-10" />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter">{service.title}</h3>
                <p className="text-slate-600 mb-8 font-medium leading-relaxed">{service.desc}</p>
                <div className="space-y-4 border-t border-slate-200 pt-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">Tolerance</span>
                    <span className="text-sm font-black text-slate-900">{service.tolerance}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">Max Thickness</span>
                    <span className="text-sm font-black text-slate-900">{service.thickness}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
              Available Materials
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              We stock a comprehensive range of industrial substrates. Use the tables below to verify thicknesses and processing notes for each technology.
            </p>
          </div>

          <div className="space-y-16">
            {CUTTING_MATERIALS.map((group, groupIndex) => (
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
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase">Cutting Verified</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 leading-none">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block w-full mb-1">Stock Thicknesses:</span>
                          <span className="bg-white border border-slate-200 px-3 py-1 rounded-md text-xs font-bold text-slate-700 shadow-sm transition-colors group-hover:border-blue-200">
                            {material.sizes}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-bold italic bg-white/10 p-2 rounded-lg border border-slate-100 leading-normal">
                          <span className="text-blue-600 inline-block mr-1">Note:</span> {material.notes}
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

      {/* Engineering Guidelines */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#2F5FA7]/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 md:px-10 lg:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 uppercase tracking-tighter">
                  Design for <br />
                  <span className="text-cyan-400">Sheet Cutting</span>
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed font-medium">
                  Optimizing your geometry for CNC cutting reduces waste and prevents edge deformation. Follow these essential DFM rules.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { id: "K", title: "Kerf Allowance", desc: "Account for the width of the cut (Kerf). Laser usually 0.2mm, Waterjet up to 0.8mm.", icon: <Maximize2 className="w-5 h-5" /> },
                  { id: "L", title: "Lead-In Distance", desc: "Ensure at least 2mm clearance from any critical geometry for the cut start-point.", icon: <Zap className="w-5 h-5" /> },
                  { id: "S", title: "Part Spacing", desc: "Maintain a minimum distance of 1x material thickness between adjacent parts to ensure structural integrity.", icon: <Layers className="w-5 h-5" /> },
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
              <div className="aspect-square md:aspect-[4/3] bg-white border-4 md:border-8 border-slate-900 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative">
                <Image
                  src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1200"
                  alt="Cutting Geometry Guide"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 md:p-10">
                  <div className="bg-white/95 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl shadow-xl inline-flex items-center gap-3 md:gap-4">
                    <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Geometry Verification</p>
                      <p className="text-sm font-bold text-slate-900 text-nowrap">Automated Kerf Compensation Active</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full border-4 border-cyan-400 rounded-[3rem] hidden lg:block opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
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
                <span className="text-blue-600">Cut Parts</span>
              </h2>
              <p className="text-slate-600 font-medium mb-12">
                Our automated pipeline ensures your custom sheet components are cut to exact specifications.
              </p>
              <div className="hidden lg:block">
                <div className="w-full aspect-[4/5] relative rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
                  <Image src="https://images.unsplash.com/photo-1531289172671-1ed49202fb47?auto=format&fit=crop&q=80" alt="Process Visualization" fill className="object-cover" />
                  <div className="absolute inset-0 bg-blue-600/20 mix-blend-multiply" />
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 space-y-12">
              {[
                {
                  step: "01",
                  title: "Upload Your Design",
                  description: "Drag and drop your DXF, DWG, or AI files. Our engine instantly analyzes your geometry for cut paths and hole diameters."
                },
                {
                  step: "02",
                  title: "Select Technology",
                  description: "Compare Laser, Waterjet, and Routing in real-time. Choose the process that matches your tolerance and edge-finish requirements."
                },
                {
                  step: "03",
                  title: "Automated Production",
                  description: "Once confirmed, your parts are nested into high-efficiency sheets and cut using industrial-grade CNC equipment."
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
                    Start Your Project <ArrowRight className="w-6 h-6" />
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
          <p className="text-sm font-black text-[#2F5FA7] uppercase tracking-[0.3em] mb-4">Industrial Quality</p>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-10 max-w-2xl mx-auto tracking-tighter uppercase leading-tight">
            Ready to cut your custom designs?
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <span className="font-bold text-slate-700 uppercase leading-none">Certified Precision</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <span className="font-bold text-slate-700 uppercase leading-none">Rapid Turnaround</span>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
