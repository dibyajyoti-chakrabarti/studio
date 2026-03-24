'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  Layers,
  Settings,
  CircleDollarSign,
  ClipboardCheck,
  MessageSquare,
  Waves,
  Brush,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingNav } from '@/components/LandingNav';
import { Footer } from '@/components/Footer';

const DEBURRING_MATERIALS = [
  {
    category: "Optimal for Deburring",
    items: [
      { name: "Aluminium 5052/6061", notes: "Linear brush leaves a beautiful directional grain. Tumbling leaves a soft matte finish.", color: "bg-slate-200", supported: true },
      { name: "Stainless Steel 304", notes: "Heavy deburring removes laser dross efficiently. Ideal for food-grade parts.", color: "bg-zinc-300", supported: true },
      { name: "Copper / Brass", notes: "Brightens the surface and removes oxidation along with sharp edges.", color: "bg-orange-200", supported: true },
    ]
  },
  {
    category: "Conditional / Limited",
    items: [
      { name: "CRCA Mild Steel", notes: "Linear deburring NOT available to prevent machine contamination. Tumbling available (with oil).", color: "bg-slate-500", supported: "Limited" },
      { name: "Carbon Fiber / Acrylic", notes: "Tumbling only. Linear belts can crack or fray these materials.", color: "bg-zinc-800", supported: "Limited" },
      { name: "MDF / Wood / Balsa", notes: "Abrasive media can damage or soak into organic fibers. Not recommended.", color: "bg-amber-100", supported: false },
      { name: "3D Polymers (PLA/ABS)", notes: "Small parts can be tumbled; larger parts may warp under heat/pressure.", color: "bg-blue-600", supported: "Limited" },
    ]
  }
];

export default function DeburringPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-[#2F5FA7] font-sans">
      <LandingNav />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] lg:h-[75vh] flex items-center pt-32 pb-20 lg:py-0 overflow-hidden  bg-slate-950">
        <div className="absolute inset-0 z-0 opacity-40"
          style={{
            backgroundImage: 'linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>

        <div className="container mx-auto px-4 md:px-10 lg:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 animate-in fade-in slide-in-from-left-12 duration-1000">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-black tracking-[0.2em] uppercase">
                <ShieldCheck className="w-4 h-4" />
                Surface Refinement
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tighter uppercase">
                Professional <br />
                <span className="text-cyan-300">Deburring</span>
              </h1>
              <p className="text-xl text-blue-100/80 max-w-xl leading-relaxed font-medium">
                Eliminate sharp edges, laser dross, and surface scratches. Our dual-method deburring process delivers safe, assembly-ready parts with a premium industrial finish.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/login?redirect=/dashboard">
                  <Button size="lg" className="h-16 px-10 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-lg gap-3 shadow-xl transition-all hover:scale-[1.02]">
                    Order Smooth Parts <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#methods">
                  <Button variant="outline" size="lg" className="h-16 px-10 border-2 border-white/20 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-lg text-white transition-all">
                    Compare Methods
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative animate-in fade-in zoom-in duration-1000 delay-300 lg:block hidden">
              <div className="relative rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl aspect-square bg-white flex items-center justify-center p-12">
                <div className="absolute inset-0 bg-blue-50/50" />
                <Waves className="w-48 h-48 text-blue-200 animate-pulse" />
                <div className="absolute inset-x-0 bottom-0 p-10">
                  <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 border border-blue-50">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Finish Quality</p>
                      <p className="text-sm font-bold text-slate-900">Burr-Free Guaranteed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-y border-slate-100">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Linear + Tub</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-600">Dual Processing</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">24" x 46"</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-600">Max Part Size</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Matte/Brushed</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-600">Finish Options</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Burr-Free</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-600">Safety Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Comparison */}
      <section id="methods" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="text-center max-w-3xl mx-auto mb-20 leading-tight">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
              Two Ways to <span className="text-blue-600">Smooth</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium">
              We offer specialized deburring methods depending on your part geometry and desired aesthetic.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="group relative bg-slate-50 rounded-[3rem] p-10 border border-slate-100 hover:border-blue-600/20 transition-all duration-500 hover:shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mb-8 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                <Brush className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Linear Deburring</h3>
              <p className="text-slate-600 font-medium leading-relaxed italic mb-8">
                Uses abrasive belts and brushes on a conveyor system. Best for face cleaning and removing scratches.
              </p>
              <ul className="space-y-4">
                {["Directional 'Brushed' Grain", "Face & Edge Smoothing", "Fast High-Volume Throughput"].map((point, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700 uppercase tracking-tighter">
                    <CheckCircle2 className="text-blue-600 w-5 h-5 shrink-0" /> {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="group relative bg-slate-50 rounded-[3rem] p-10 border border-slate-100 hover:border-blue-600/20 transition-all duration-500 hover:shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mb-8 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                <Waves className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Vibratory Tumbling</h3>
              <p className="text-slate-600 font-medium leading-relaxed italic mb-8">
                Parts vibrate in a tub with abrasive media. Reaches into holes and internal features that brushes can't.
              </p>
              <ul className="space-y-4">
                {["Non-Directional Matte Finish", "Internal Edge De-Sharping", "Ideal for Complex Geometries"].map((point, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700 uppercase tracking-tighter">
                    <CheckCircle2 className="text-blue-600 w-5 h-5 shrink-0" /> {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Guidelines */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 md:px-10 lg:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter leading-none">
                  DFM for <br />
                  <span className="text-blue-400">Edge Quality</span>
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed font-medium">
                  Optimizing your design for deburring ensures parts pass through our machines without jams or surface inconsistencies.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { id: "D1", title: "Minimum Part Size", desc: "Parts must be at least 1\" x 3\" to stay secure on linear belts. Smaller parts must be tumbled.", icon: <Maximize2 className="w-5 h-5" /> },
                  { id: "D2", title: "Thickness Minimum", desc: "Material must be at least 1.2mm (0.048\") thick. Thinner parts may get caught in the brush rollers.", icon: <Layers className="w-5 h-5" /> },
                  { id: "D3", title: "Internal Radii", desc: "Tumbling media can reach inside holes, but if the media is too large, it may bridge small gaps.", icon: <Target className="w-5 h-5" /> },
                ].map((item) => (
                  <div key={item.id} className="flex gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                    <div className="w-14 h-14 rounded-2xl bg-blue-400/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-400/30 font-black text-xl group-hover:scale-110 transition-transform">
                      {item.id}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2 uppercase tracking-tighter">{item.title}</h4>
                      <p className="text-slate-400 font-medium leading-relaxed italic">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-8">
              <h4 className="text-2xl font-black uppercase text-blue-400 tracking-tighter">Processing Limits</h4>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Linear Deburring (Max)</p>
                  <p className="text-3xl font-black uppercase tracking-tighter text-white">24" x 46"</p>
                </div>
                <div className="h-px bg-white/10" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Vibratory Tumbling (Max)</p>
                  <p className="text-3xl font-black uppercase tracking-tighter text-white">4" x 4" x 12"</p>
                </div>
                <div className="h-px bg-white/10" />
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs font-bold leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-blue-400 mb-2" />
                  Mild steel is NOT supported for linear deburring due to roller contamination. High-polish requirements may incur additional tumbling time.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto leading-tight">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 uppercase tracking-tighter leading-none">
              Abrasive <span className="text-blue-600">Substrates</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium">From aerospace alloys to consumer plastics, we tune our media to match the hardness of your parts.</p>
          </div>

          <div className="space-y-16">
            {DEBURRING_MATERIALS.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="text-2xl font-black text-slate-900 mb-8 border-l-4 border-blue-600 pl-6 uppercase tracking-widest">{group.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.items.map((material, mIndex) => (
                    <div key={mIndex} className={`bg-slate-50 rounded-[2rem] p-8 border hover:bg-white transition-all hover:shadow-xl group ${material.supported === false ? 'opacity-50 grayscale' : 'border-slate-100 hover:border-blue-600/20'}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h4 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter">
                          {material.supported === true ? <CheckCircle2 className="text-green-500 w-5 h-5 flex-shrink-0" /> : <AlertCircle className="text-amber-500 w-5 h-5 flex-shrink-0" />}
                          {material.name}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${material.supported === true ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                          {material.supported === true ? 'Full Service' : (material.supported === false ? 'Incompatible' : 'Tumbling Only')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 font-bold italic leading-relaxed border-l-2 border-slate-200 pl-4">
                        {material.notes}
                      </p>
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
                <span className="text-blue-600">Smooth Surface</span>
              </h2>
              <p className="text-slate-600 font-medium mb-12">
                Simply select 'Deburring' under services in the dashboard, and our system will recommend the best method for your part.
              </p>
              <div className="hidden lg:block relative group">
                <div className="absolute -inset-4 bg-blue-600/10 rounded-[3rem] blur-xl scale-95 group-hover:scale-100 transition-transform duration-700"></div>
                <div className="w-full aspect-[4/5] relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                  <Image src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" alt="Deburring Visual" fill className="object-cover" />
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 space-y-12">
              {[
                {
                  step: "01",
                  title: "Method Assignment",
                  description: "Large, flat parts go to Linear. Small, detailed parts go to Tumbling. We audit every design to pick the winner."
                },
                {
                  step: "02",
                  title: "Media Tuning",
                  description: "We select the correct ceramic, plastic, or abrasive belt grit based on your material's specific hardness."
                },
                {
                  step: "03",
                  title: "Finishing Run",
                  description: "Parts are processed until all dross is removed and a uniform surface finish is achieved across the batch."
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-10 group">
                  <div className="text-4xl md:text-6xl font-black text-slate-200 group-hover:text-blue-600/20 transition-all duration-500 leading-none">
                    {item.step}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter leading-none">{item.title}</h3>
                    <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-xl italic">{item.description}</p>
                  </div>
                </div>
              ))}

              <div className="pt-10">
                <Link href="/login?redirect=/dashboard">
                  <Button size="lg" className="w-full md:w-auto h-20 px-16 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black text-xl gap-4 shadow-2xl transition-all hover:scale-[1.02]">
                    Get Smooth Parts Now <ArrowRight className="w-6 h-6" />
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
                  Need Finish <br className="hidden md:block" /> Guidance?
                </h2>
                <p className="text-[#64748B] text-sm md:text-lg leading-relaxed mb-8 md:mb-10 font-medium max-w-lg mx-auto lg:mx-0">
                  Not sure if your small titanium parts can be tumbled? Need help with linear brush grain selection? Reach out to our specialists.
                </p>

                <div className="grid grid-cols-2 gap-3 md:gap-6 mb-10 md:mb-12 order-3 lg:order-2">
                  {[
                    { icon: Settings, label: 'Media Selection' },
                    { icon: CircleDollarSign, label: 'Batch Pricing' },
                    { icon: ClipboardCheck, label: 'Quality Control' },
                    { icon: MessageSquare, label: 'Custom Finishes' },
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
