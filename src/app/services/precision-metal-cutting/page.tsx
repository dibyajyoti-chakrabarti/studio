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

export default function PrecisionCuttingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 selection:text-[#2F5FA7] font-sans">
      <LandingNav />

      {/* Hero Section - Premium Architectural Blue/White */}
      <section className="relative pt-32 pb-44 overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-500/5 blur-[150px] rounded-full -mr-96 -mt-96" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-blue-100 bg-blue-50/50 text-[#2F5FA7] text-[10px] font-black tracking-[0.3em] uppercase shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                Low Tolerance ± 0.127mm
              </div>

              <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.95] uppercase text-slate-900">
                Precision <br />
                <span className="text-[#2F5FA7] underline decoration-blue-100 decoration-8 underline-offset-8">CNC Cutting.</span>
              </h1>

              <p className="text-xl text-slate-500 leading-relaxed max-w-2xl font-medium">
                From sheet metal to advanced composites. We utilize Fiber Laser, Waterjet, and CNC Routing technologies to deliver industrial-grade components in record time.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-base font-black uppercase tracking-widest bg-[#2F5FA7] hover:bg-[#1E3A66] text-white rounded-xl transition-all shadow-xl shadow-blue-900/10">
                    Quote Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l border-slate-200 pl-6 hidden sm:block">
                  No Minimum Order <br /> Automated DFM Checks
                </div>
              </div>
            </div>

            <div className="flex-1 relative group">
              <div className="relative aspect-video w-full max-w-[700px] mx-auto overflow-hidden rounded-[40px] shadow-2xl shadow-blue-900/10 border border-slate-100">
                <Image
                  src="/focus-image.jpg"
                  alt="Precision Laser Cutting"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1200";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
              {/* Decorative Blur Element */}
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#2F5FA7]/10 blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Service Selection Grid */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-4xl font-black uppercase tracking-tight text-slate-900">Cutting Methods Optimized for Your Application.</h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto italic">Strategic manufacturing processes for diverse substrates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CUTTING_SERVICES.map((service, i) => (
              <div key={i} className="group p-10 rounded-[40px] bg-[#F8FAFC] border border-slate-100 hover:bg-white hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500">
                <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform shadow-lg`}>
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">{service.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10">{service.desc}</p>

                <div className="space-y-4 border-t border-slate-200 pt-8">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">Tolerance</span>
                    <span className="text-sm font-black text-slate-900">{service.tolerance}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">Thickness</span>
                    <span className="text-sm font-black text-slate-900">{service.thickness}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="py-32 bg-[#F8FAFC] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="space-y-20">
            {CUTTING_MATERIALS.map((group, i) => (
              <div key={i} className="space-y-8">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#2F5FA7] border-l-4 border-[#2F5FA7] pl-4">{group.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {group.items.map((mat, j) => (
                    <div key={j} className="group p-8 rounded-3xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500">
                      <div className={`w-12 h-12 rounded-xl ${mat.color} mb-6 shadow-inner ring-1 ring-slate-900/5 group-hover:scale-110 transition-transform`} />
                      <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-3">{mat.name}</h4>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Inventory Status</span>
                          <p className="text-xs text-slate-600 font-bold leading-relaxed">{mat.sizes}</p>
                        </div>
                        <div className="flex items-start gap-2 pt-2 border-t border-slate-100">
                          <Info className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                          <p className="text-[10px] text-slate-400 font-medium italic">{mat.notes}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features/Why MechHub Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-24 items-center">
            <div className="flex-1 relative">
              <div className="bg-slate-100 rounded-[60px] p-12 lg:p-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <Maximize2 className="w-64 h-64 text-slate-200/50" />
                </div>
                <div className="relative z-10 space-y-8">
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Industrial Standards. <br /> Institially Verified.</h3>
                  <div className="space-y-6">
                    {[
                      "Automated Edge Break Technology",
                      "Nitrogen-Assist Finish for Stainless Steel",
                      "Taper Control for Thick Plates",
                      "Burr-Free Finishes on Plastics"
                    ].map((text, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <CheckCircle2 className="w-6 h-6 text-[#2F5FA7]" />
                        <span className="font-bold text-slate-700">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl font-black uppercase tracking-tight">Zero-Margin <br /> Precision.</h2>
                <div className="h-1.5 w-24 bg-[#2F5FA7]" />
              </div>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Our cutting algorithms optimized for material utilization ensure you get the best yield and the cleanest edges for your parts.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-1">
                  <div className="text-3xl font-black text-slate-900">100%</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inspection Rate</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-slate-900">0.02"</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Min Kerf Width</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-[#F8FAFC]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="p-20 rounded-[4rem] bg-[#1E3A66] text-center space-y-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400/20 to-transparent pointer-events-none" />
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight relative z-10">Start Your Next <br /> Cutting Project.</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="h-16 px-12 text-lg font-black bg-[#2F5FA7] hover:bg-blue-600 text-white rounded-xl shadow-2xl">
                  Configure Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/" className="w-full sm:w-auto text-white/50 hover:text-white font-bold text-sm tracking-widest transition-colors uppercase">
                Return to Core Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
