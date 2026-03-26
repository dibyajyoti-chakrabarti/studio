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
  Table
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingNav } from '@/components/LandingNav';
import { Footer } from '@/components/Footer';

const COUNTERSINK_MATERIALS = [
  {
    category: "Metals (Recommended)",
    items: [
      { name: "Aluminium 5052", sizes: "3.2mm - 12.7mm (.125\" - .500\")", notes: "Standard 82°/90° countersinks available.", color: "bg-slate-200" },
      { name: "Aluminium 6061", sizes: "3.2mm - 19.0mm (.125\" - .750\")", notes: "Excellent for deep countersinks. High strength.", color: "bg-slate-300" },
      { name: "Stainless Steel 304", sizes: "3.2mm - 9.5mm (.125\" - .375\")", notes: "Requires rigid setup. ± 0.2mm positional accuracy.", color: "bg-zinc-300" },
      { name: "CRCA Mild Steel", sizes: "3.2mm - 19.0mm (.125\" - .750\")", notes: "Cost-effective for structural countersinking.", color: "bg-slate-500" },
    ]
  },
  {
    category: "Plastics & Composites",
    items: [
      { name: "ABS Plastic", sizes: "3.2mm - 6.0mm (.125\" - .234\")", notes: "Soft material. Max 60% depth rule strictly enforced.", color: "bg-zinc-800" },
      { name: "Delrin / Acetal", sizes: "3.2mm - 6.3mm (.125\" - .250\")", notes: "Self-lubricating. Clean, burr-free countersinks.", color: "bg-zinc-100/50" },
      { name: "HDPE", sizes: "6.3mm - 12.7mm (.250\" - .500\")", notes: "High impact resistance. Good for flush mounting.", color: "bg-blue-50" },
    ]
  }
];

export default function CountersinkingPage() {
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
                <Maximize2 className="w-4 h-4" />
                Flush Mounting Systems
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tighter uppercase">
                Precision <br />
                <span className="text-cyan-300">Countersinking</span>
              </h1>
              <p className="text-xl text-white/80 max-w-xl leading-relaxed">
                Professional-grade hole finishing for flush-mounted fasteners. Our automated process ensures consistent 82° and 90° angles with micron-level depth control.
              </p>
              <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Target className="w-5 h-5 text-cyan-300" />
                  <span>± 0.2mm Position</span>
                </div>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Zap className="w-5 h-5 text-cyan-300" />
                  <span>82° & 90° Standard</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link href="/login?redirect=/dashboard">
                  <Button size="lg" className="w-full sm:w-auto px-10 h-16 bg-white hover:bg-slate-100 text-[#2F5FA7] rounded-full font-black text-lg gap-2 shadow-2xl">
                    Get a Quote <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative group animate-in fade-in zoom-in duration-1000 hidden md:block">
              <div className="absolute -inset-4 bg-white/10 rounded-[3rem] blur-2xl group-hover:bg-white/20 transition-all duration-700 opacity-50"></div>
              <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white/10 shadow-2xl aspect-[4/3] bg-slate-900/40 backdrop-blur-sm">
                <img
                  src="https://res.cloudinary.com/dypbvtojf/image/upload/v1773985400/hole-aluminum-metal-made-chamfer-600nw-2733529461_wrekrv.webp"
                  alt="Precision Countersinking"
                  width={240}
                  height={180}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-10">
                  <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl inline-flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">Operational Status</p>
                      <p className="text-sm font-bold text-slate-900">Drilling Station Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 py-10 md:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">82° / 90°</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">Standard Angles</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Max 60%</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">Thickness Depth</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">#0 - 1/2"</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">SAE Sizes</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">M1 - M12</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">Metric Sizes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="text-center max-w-3xl mx-auto mb-20 leading-tight">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
              Flush Hole Finishing
            </h2>
            <p className="text-lg text-slate-600 font-medium">
              We provide clean, burr-free countersinks compatible with industrial fasteners and aerospace standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Universal Compatibility", desc: "Our automated systems support dynamic hole tagging for both metric (90°) and imperial (82°) fasteners.", icon: Target },
              { title: "Material Resiliency", desc: "Available for materials from 3.2mm up to 19mm thickness, ensuring structural integrity.", icon: ShieldCheck },
              { title: "Precision Control", desc: "Depth is restricted to 60% of material thickness to prevent pull-through or structural weakening.", icon: Settings },
            ].map((item, index) => (
              <div key={index} className="group relative bg-slate-50 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-slate-100 hover:border-[#2F5FA7]/30 transition-all duration-500 hover:shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mb-8 shadow-sm group-hover:bg-[#2F5FA7] group-hover:text-white transition-all duration-500">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter">{item.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed italic">{item.desc}</p>
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
                  <span className="text-cyan-400">Flush Mounts</span>
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed font-medium">
                  Proper countersink geometry is critical for fastener load distribution. Follow these safety rules.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { id: "C1", title: "Head Diameter", desc: "The countersink major diameter must be at least 0.2mm larger than the screw head diameter.", icon: <Maximize2 className="w-5 h-5" /> },
                  { id: "C2", title: "Minimum Thickness", desc: "Unprotected countersinks require material at least 1.5x thicker than the countersink depth.", icon: <Zap className="w-5 h-5" /> },
                  { id: "C3", title: "Hole Preparation", desc: "Holes must be pre-drilled or CNC cut before countersinking to ensure concentricity and finish.", icon: <Layers className="w-5 h-5" /> },
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

            <div className="relative group hidden md:block">
              <div className="aspect-[4/3] bg-white border-8 border-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative p-12">
                <img
                  src="https://res.cloudinary.com/dypbvtojf/image/upload/v1773985400/hole-aluminum-metal-made-chamfer-600nw-2733529461_wrekrv.webp"
                  alt="Countersinking Geometry Guide"
                  width={240}
                  height={180}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-10">
                  <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl inline-flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Geometry Check</p>
                      <p className="text-sm font-bold text-slate-900 text-nowrap">Concentricity Tolerance ± 0.1mm</p>
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
              Substrates & Alloys
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              We support a vast range of materials for automated countersinking, from high-strength metals to rigid composites.
            </p>
          </div>

          <div className="space-y-16">
            {COUNTERSINK_MATERIALS.map((group, groupIndex) => (
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
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase">Institutional Grade</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 leading-none">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block w-full mb-1">Depth Verification:</span>
                          <span className="bg-white border border-slate-200 px-3 py-1 rounded-md text-xs font-bold text-slate-700 shadow-sm transition-colors group-hover:border-blue-200">
                            {material.sizes}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-bold italic bg-white/10 p-2 rounded-lg border border-slate-100 leading-normal">
                          <span className="text-blue-600 inline-block mr-1">Process Note:</span> {material.notes}
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
                The <br />
                <span className="text-blue-600">Finishing Path</span>
              </h2>
              <p className="text-slate-600 font-medium mb-12">
                Our configurator identifies hole geometries and calculates tool depth automatically during the quoting process.
              </p>
              <div className="hidden lg:block">
                <div className="w-full aspect-[4/5] relative rounded-[3rem] overflow-hidden shadow-2xl">
                  <Image src="https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&q=80" alt="Process Visualization" fill className="object-cover" />
                  <div className="absolute inset-0 bg-blue-600/20 mix-blend-multiply" />
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 space-y-12">
              {[
                {
                  step: "01",
                  title: "Fastener Selection",
                  description: "Upload your CAD. Our system detects holes and prompts you to select fastener type (SAE vs Metric) and desired fit."
                },
                {
                  step: "02",
                  title: "Tagging & Limits",
                  description: "Indicate which holes require countersinking. Our engine instantly checks material thickness against depth limits."
                },
                {
                  step: "03",
                  title: "Automated Tooling",
                  description: "Once confirmed, the design is queued for our automated countersinking stations where depth is strictly controlled."
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
          <p className="text-sm font-black text-[#2F5FA7] uppercase tracking-[0.3em] mb-4">Mechanical Perfection</p>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-10 max-w-2xl mx-auto tracking-tighter uppercase leading-tight">
            Flush surfaces for your assemblies.
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <span className="font-bold text-slate-700 uppercase leading-none">Institutional Finish</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <span className="font-bold text-slate-700 uppercase leading-none">Aerospace Precision</span>
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
