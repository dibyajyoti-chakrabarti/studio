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
  Layers,
  Maximize2,
  Table,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingNav } from '@/components/LandingNav';
import { Footer } from '@/components/Footer';

const DIMPLE_MATERIALS = [
  {
    category: "Ductile Metals (Forming Ready)",
    items: [
      { name: "Aluminium 5052", sizes: "1mm - 3.2mm", notes: "Excellent for dimpling. High formability.", color: "bg-slate-200" },
      { name: "CRCA Mild Steel", sizes: "0.8mm - 3.2mm", notes: "Standard industrial material for flared holes.", color: "bg-slate-500" },
      { name: "Stainless Steel 304", sizes: "0.8mm - 3.2mm", notes: "Requires high-tonnage press. Maximum stiffness.", color: "bg-zinc-300" },
      { name: "Aluminium 6061", sizes: "1mm - 3.2mm", notes: "Prone to edge cracking if flare is too aggressive.", color: "bg-slate-300" },
    ]
  },
  {
    category: "Restricted (CNC Cut Only)",
    items: [
      { name: "Carbon Fiber Plate", sizes: "1mm - 5mm", notes: "Brittle composite. Not for dimple forming.", color: "bg-zinc-800" },
      { name: "Acrylic", sizes: "1.6mm - 12.7mm", notes: "Polymer will shatter. Not for dimple forming.", color: "bg-blue-100/40" },
      { name: "MDF / Plywood", sizes: "3.2mm - 12.7mm", notes: "Fiber based. Not for dimple forming.", color: "bg-amber-100" },
      { name: "3D Polymers (PLA/TPU)", sizes: "Custom", notes: "Additive parts. Not for dimple forming.", color: "bg-blue-600" },
    ]
  }
];

export default function DimpleFormingPage() {
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
                Structural Flaring
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tighter uppercase">
                Precision <br />
                <span className="text-cyan-300">Dimple Forming</span>
              </h1>
              <p className="text-xl text-white/80 max-w-xl leading-relaxed">
                Add industrial-grade structural flaring to your sheet metal parts. Our CNC dimple forming process increases panel stiffness while adding a high-performance aesthetic.
              </p>
              <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Target className="w-5 h-5 text-cyan-300" />
                  <span>± 0.2mm Position</span>
                </div>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Zap className="w-5 h-5 text-cyan-300" />
                  <span>10+ Tool Sizes</span>
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
              <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white/10 shadow-2xl aspect-[4/3] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
                <Cpu className="w-48 h-48 text-cyan-300/20 animate-pulse" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-10">
                  <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl inline-flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">Operational Status</p>
                      <p className="text-sm font-bold text-slate-900">Hydraulic Press Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 py-10 md:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">10+</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">Available Tools</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">± 0.2mm</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">Positional Accuracy</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">3:1</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">Stiffness Ratio</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Metal</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">Optimized Substrates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dimple Strategies */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="text-center max-w-3xl mx-auto mb-20 leading-tight">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
              Performance Benefits
            </h2>
            <p className="text-lg text-slate-600 font-medium">
              Dimple forming transforms flat parts into high-rigidity structural components using mechanical flaring techniques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Increased Stiffness", desc: "Dimpled holes act as structural ribs, significantly increasing the resistance of thin panels to bowing or flexing.", icon: Layers },
              { title: "Weight Reduction", desc: "Achieve the structural performance of thicker material while maintaining the weight of thin-gauge sheets.", icon: Maximize2 },
              { title: "Industrial Aesthetic", desc: "Popular in automotive and race applications for its high-performance, professional appearance.", icon: ShieldCheck },
            ].map((type, index) => (
              <div key={index} className="group relative bg-slate-50 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-slate-100 hover:border-[#2F5FA7]/30 transition-all duration-500 hover:shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mb-8 shadow-sm group-hover:bg-[#2F5FA7] group-hover:text-white transition-all duration-500">
                  <type.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter">{type.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed italic">{type.desc}</p>
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
                  <span className="text-cyan-400">Dimpling</span>
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed font-medium">
                  To ensure perfect flares without material tearing, follow our technical geometry requirements.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { id: "D1", title: "Edge Clearance", desc: "Maintain a minimum distance of at least 1.0x the tool OD from any edge to prevent part deformation.", icon: <Maximize2 className="w-5 h-5" /> },
                  { id: "D2", title: "Min Spacing", desc: "Spacing between dimples should be at least equal to the Tool OD to avoid material bowing.", icon: <Zap className="w-5 h-5" /> },
                  { id: "D3", title: "Material Thickness", desc: "Restricted to ductile metals thinner than 3.2mm (0.125\") to ensure clean, crack-free flares.", icon: <Layers className="w-5 h-5" /> },
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

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
              <h4 className="text-xl font-black uppercase text-cyan-400">Tooling Matrix</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 font-bold text-slate-300">Minor Hole (C)</th>
                      <th className="py-3 font-bold text-slate-300">Tool OD (A)</th>
                      <th className="py-3 font-bold text-slate-300">Min Edge (D)</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-400 font-medium">
                    <tr className="border-b border-white/5">
                      <td className="py-3">0.500"</td>
                      <td className="py-3">1.200"</td>
                      <td className="py-3">0.600"</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3">1.000"</td>
                      <td className="py-3">1.800"</td>
                      <td className="py-3">0.900"</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3">1.500"</td>
                      <td className="py-3">2.550"</td>
                      <td className="py-3">1.275"</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3">2.000"</td>
                      <td className="py-3">3.470"</td>
                      <td className="py-3">1.735"</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-cyan-400 font-bold">10+ More</td>
                      <td className="py-3">...</td>
                      <td className="py-3">...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 italic">Values provided in inches. Metric conversion available in quote dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
              Forming Substrates
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              We precisely dimple ductile metal alloys. Brittle materials and wood derivatives are not suitable for this mechanical flare process.
            </p>
          </div>

          <div className="space-y-16">
            {DIMPLE_MATERIALS.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="text-2xl font-black text-slate-900 mb-8 border-l-4 border-blue-600 pl-6 uppercase tracking-widest">{group.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.items.map((material, mIndex) => (
                    <div key={mIndex} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-blue-600/20 transition-all hover:bg-white hover:shadow-xl group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <h4 className="text-lg font-black text-slate-900 flex items-center gap-2 lowercase">
                          <CheckCircle2 className={`w-5 h-5 ${groupIndex === 0 ? 'text-blue-600' : 'text-slate-300'}`} />
                          {material.name}
                        </h4>
                        <div className="flex gap-2">
                          <span className={`px-3 py-1 ${groupIndex === 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'} rounded-full text-[10px] font-black uppercase`}>
                            {groupIndex === 0 ? 'Forming Ready' : 'Incompatible'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 leading-none">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block w-full mb-1">Thickness Range:</span>
                          <span className="bg-white border border-slate-200 px-3 py-1 rounded-md text-xs font-bold text-slate-700 shadow-sm transition-colors group-hover:border-blue-200">
                            {material.sizes}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-bold italic bg-white/10 p-2 rounded-lg border border-slate-100 leading-normal">
                          <span className="text-blue-600 inline-block mr-1">Notes:</span> {material.notes}
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
                <span className="text-blue-600">Dimpled Parts</span>
              </h2>
              <p className="text-slate-600 font-medium mb-12">
                Our configurator allows you to select flared holes during the design verification step. No complex 3D modeling required.
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
                  title: "Laser-Cut Minor Hole",
                  description: "Upload your CAD. Our system laser cuts the required 'minor' hole into your flat panel using fiber laser technology."
                },
                {
                  step: "02",
                  title: "Hydraulic Flare",
                  description: "Parts are transferred to a hydraulic press where a punch and die set flares the edges to your selected tool size."
                },
                {
                  step: "03",
                  title: "Structural Finish",
                  description: "The flared edges provide a structural rib, finished to professional standards before shipping or secondary coating."
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
          <p className="text-sm font-black text-[#2F5FA7] uppercase tracking-[0.3em] mb-4">Structural Excellence</p>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-10 max-w-2xl mx-auto tracking-tighter uppercase leading-tight">
            Stronger panels. Better designs.
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <span className="font-bold text-slate-700 uppercase leading-none">Industrial Rigidity</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <span className="font-bold text-slate-700 uppercase leading-none">Flush Backside Available</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
