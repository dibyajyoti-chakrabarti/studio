'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Settings,
  Target,
  ShieldCheck,
  CheckCircle2,
  Table,
  Cpu,
  Unlink,
  Maximize2,
  Zap,
  Layers,
  CircleDollarSign,
  ClipboardCheck,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingNav } from '@/components/LandingNav';
import { Footer } from '@/components/Footer';

const TAPPING_MATERIALS = [
  {
    category: "Metals (Standard Tapping)",
    items: [
      { name: "Aluminium 5052/6061", sizes: "1mm - 9.5mm", notes: "Excellent threading capability. Standard for electronic enclosures.", color: "bg-slate-200" },
      { name: "CRCA Mild Steel", sizes: "0.8mm - 9.5mm", notes: "Robust threads. Ideal for structural frames.", color: "bg-slate-500" },
      { name: "Stainless Steel 304", sizes: "0.8mm - 9.5mm", notes: "Requires specialized taps. High durability and corrosion resistance.", color: "bg-zinc-300" },
    ]
  },
  {
    category: "Non-Metals & Specialty",
    items: [
      { name: "Acrylic", sizes: "1.6mm - 12.7mm", notes: "Requires low-speed tapping to prevent melting or cracking.", color: "bg-blue-100/40" },
      { name: "MDF / Plywood", sizes: "3.2mm - 12.7mm", notes: "Course threads recommended. Glue reinforcement often used.", color: "bg-amber-100" },
      { name: "Carbon Fiber Plate", sizes: "1mm - 5mm", notes: "Abrasive material. Requires carbide tools for clean threads.", color: "bg-zinc-800" },
      { name: "3D Polymers (PLA/ABS/ASA)", sizes: "Custom", notes: "Direct tapping or heat-set inserts frequently used.", color: "bg-blue-600" },
    ]
  }
];

export default function TappingPage() {
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
                <Settings className="w-4 h-4" />
                Internal Threading
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tighter uppercase">
                Precision <br />
                <span className="text-cyan-300">Tapping Services</span>
              </h1>
              <p className="text-xl text-white/80 max-w-xl leading-relaxed">
                Add high-strength internal threads directly into your custom laser-cut or machined parts. Our automated tapping process ensures professional assembly without the need for bulky nuts or inserts.
              </p>
              <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Target className="w-5 h-5 text-cyan-300" />
                  <span>Metric & SAE Sizes</span>
                </div>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Zap className="w-5 h-5 text-cyan-300" />
                  <span>Automated CNS Precision</span>
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
                <Unlink className="w-48 h-48 text-cyan-300/20 animate-spin-slow" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-10">
                  <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl inline-flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">Operational Status</p>
                      <p className="text-sm font-bold text-slate-900">CNC Tapping Active</p>
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
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">M2 - M10</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">Metric Range</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">4-40 - 1/2"</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">Imperial Range</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">12.7mm</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">Max Thickness</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">± 0.1mm</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">Depth Precision</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="text-center max-w-3xl mx-auto mb-20 leading-tight">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
              Why Choose Tapped Holes?
            </h2>
            <p className="text-lg text-slate-600 font-medium">
              Eliminate secondary assembly steps and reduce part count with integrated precision threading.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Superior Strength", desc: "Internal threads cut directly into the base material provide a high-torque, durable connection for critical assemblies.", icon: ShieldCheck },
              { title: "Space Efficiency", desc: "By removing the need for nuts or spacers, you can design tighter assemblies and reduce overall product footprint.", icon: Maximize2 },
              { title: "Flush Finish", desc: "Enable components to mount completely flush against the part surface for a clean, professional aesthetic.", icon: Target },
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
                  <span className="text-cyan-400">Threading</span>
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed font-medium">
                  Success in tapping starts with a perfectly sized 'Tap Drill Hole'. Ensure your CAD matches our technical requirements.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { id: "T1", title: "Tap Drill Sizing", desc: "The pre-drilled or laser-cut hole must be the exact 'tap drill' diameter. For M3, use a 2.6mm hole.", icon: <Target className="w-5 h-5" /> },
                  { id: "T2", title: "Min Material Thickness", desc: "Rule of thumb: Thickness should be at least 1.5x the thread pitch to ensure enough thread engagement.", icon: <Layers className="w-5 h-5" /> },
                  { id: "T3", title: "Hole Placement", desc: "Maintain distance from edges (min 1.0x thread OD) to prevent wall bulging during the cutting process.", icon: <Maximize2 className="w-5 h-5" /> },
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
              <h4 className="text-xl font-black uppercase text-cyan-400">Thread Sizing Table</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 font-bold text-slate-300">Thread Size</th>
                      <th className="py-3 font-bold text-slate-300">Tap Drill (mm)</th>
                      <th className="py-3 font-bold text-slate-300">Min Thickness</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-400 font-medium">
                    <tr className="border-b border-white/5">
                      <td className="py-3 font-bold text-white">M3 x 0.5</td>
                      <td className="py-3">2.60</td>
                      <td className="py-3">1.2mm</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 font-bold text-white">M4 x 0.7</td>
                      <td className="py-3">3.40</td>
                      <td className="py-3">1.6mm</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 font-bold text-white">M5 x 0.8</td>
                      <td className="py-3">4.30</td>
                      <td className="py-3">2.00</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 font-bold text-white">M6 x 1.0</td>
                      <td className="py-3">5.10</td>
                      <td className="py-3">2.5mm</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 font-bold text-white">10-32 UNF</td>
                      <td className="py-3">4.10</td>
                      <td className="py-3">1.9mm</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-cyan-400 font-bold">20+ More Available</td>
                      <td className="py-3">...</td>
                      <td className="py-3">...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 italic">Common sizes shown. Full chart available in our Design Resources.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
              Machinable Substrates
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              From hard metals into brittle polymers, our precision tapping handles a wide variety of industrial and experimental materials.
            </p>
          </div>

          <div className="space-y-16">
            {TAPPING_MATERIALS.map((group, groupIndex) => (
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
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase">
                            Active Service
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
                          <span className="text-blue-600 inline-block mr-1">Tapping Notes:</span> {material.notes}
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
                The Path to <br />
                <span className="text-blue-600">Flush Precision</span>
              </h2>
              <p className="text-slate-600 font-medium mb-12">
                Our easy configuration tools allow you to specify thread sizes during the design validation phase of your order.
              </p>
              <div className="hidden lg:block relative group">
                <div className="absolute -inset-4 bg-blue-600/10 rounded-[3rem] blur-xl scale-95 group-hover:scale-100 transition-transform duration-700"></div>
                <div className="w-full aspect-[4/5] relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                  <Image src="https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80" alt="Process Visualization" fill className="object-cover" />
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 space-y-12">
              {[
                {
                  step: "01",
                  title: "CAD Integration",
                  description: "Include 'Tap Drill' holes in your CAD file. Our system will automatically detect these for threading configuration."
                },
                {
                  step: "02",
                  title: "Thread Assignment",
                  description: "Select which holes you want to tap in the online dashboard. Assign Metric or SAE thread sizes instantly."
                },
                {
                  step: "03",
                  title: "Automated Production",
                  description: "Parts are laser-cut and then mechanically tapped using CNC equipment for 100% thread consistency."
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

      {/* Expert Support Section */}
      <section className="py-20 lg:py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto rounded-[32px] md:rounded-[40px] border border-blue-50 bg-[#E8F1FF]/30 p-6 md:p-16 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#2F5FA7]/5 rounded-full blur-3xl -z-10" />
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-1 lg:order-1 text-center lg:text-left">
                <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em] text-[#2F5FA7] mb-6">EXPERT SUPPORT</p>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#0F172A] mb-6 lg:mb-8 leading-tight lg:leading-[1.15]">
                  Need Tapping <br className="hidden md:block" /> Guidance?
                </h2>
                <p className="text-[#64748B] text-sm md:text-lg leading-relaxed mb-8 md:mb-10 font-medium max-w-lg mx-auto lg:mx-0">
                  Not sure which thread size matches your material thickness? Our engineers are here to help you optimize your assembly.
                </p>

                <div className="grid grid-cols-2 gap-3 md:gap-6 mb-10 md:mb-12 order-3 lg:order-2">
                  {[
                    { icon: Settings, label: 'Thread Selection' },
                    { icon: CircleDollarSign, label: 'Cost Optimization' },
                    { icon: ClipboardCheck, label: 'Assembly Review' },
                    { icon: MessageSquare, label: 'Direct Engineering' },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col md:flex-row items-center md:items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-default">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 md:w-5 md:h-5 text-[#2F5FA7]" />
                      </div>
                      <p className="text-[10px] md:text-sm font-bold text-[#1E3A66] text-center md:text-left">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="order-4 lg:order-3">
                  <Link href="/login?redirect=/consultation">
                    <Button
                      size="lg"
                      className="w-full md:w-auto h-14 md:h-16 px-8 md:px-12 text-sm md:text-base font-bold bg-[#2F5FA7] hover:bg-[#1E3A66] text-white rounded-full shadow-xl transition-all"
                    >
                      Book a Free Consultation <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="hidden lg:block relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white lg:order-2">
                <Image
                  src="https://images.unsplash.com/photo-1504917595217-d4dc5f649771?auto=format&fit=crop&q=80&w=800"
                  alt="Engineering Consultation"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
