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
  FlaskConical,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingNav } from '@/components/LandingNav';
import { Footer } from '@/components/Footer';

const PLATING_OPTIONS = [
  { name: "Clear Zinc", desc: "Standard silvery finish with good corrosion resistance.", type: "Cr(III)" },
  { name: "Yellow Zinc", desc: "Excellent corrosion protection with an iridescent gold hue.", type: "Cr(VI) Free" },
  { name: "Black Zinc", desc: "Aesthetic black finish popular for hardware and frames.", type: "Semi-Gloss" },
  { name: "Bright Nickel", desc: "Mirror-like finish with high conductivity and wear resistance.", type: "Electroless" },
];

const PLATING_MATERIALS = [
  {
    category: "Optimal Substrates",
    items: [
      { name: "CRCA Mild Steel", notes: "The industry standard for zinc plating. Absorbs treatment uniformly.", color: "bg-slate-400", supported: true },
      { name: "Aluminium 6061", notes: "Zinc plating available via specialized pre-treatment (Anodizing recommended instead).", color: "bg-slate-200", supported: "Limited" },
      { name: "Copper / Brass", notes: "Ideal for Nickel plating to enhance conductivity and prevent oxidation.", color: "bg-orange-200", supported: true },
    ]
  },
  {
    category: "Incompatible",
    items: [
      { name: "Stainless Steel 304", notes: "Stainless features its own protective layer; plating is rarely required or effective.", color: "bg-zinc-300", supported: false },
      { name: "Acrylic / MDF / Wood", notes: "Non-conductive materials cannot be plated via electrochemical bath.", color: "bg-amber-100", supported: false },
      { name: "3D Polymers", notes: "Not suitable for standard industrial plating baths.", color: "bg-blue-600", supported: false },
    ]
  }
];

export default function PlatingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-[#2F5FA7] font-sans">
      <LandingNav />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] lg:h-[75vh] flex items-center pt-32 pb-20 lg:py-0 overflow-hidden  bg-slate-950">
        <div className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>

        <div className="container mx-auto px-4 md:px-10 lg:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 animate-in fade-in slide-in-from-left-12 duration-1000">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black tracking-[0.2em] uppercase">
                <FlaskConical className="w-4 h-4" />
                Electrochemical Protection
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tighter uppercase">
                Industrial <br />
                <span className="text-cyan-300">Plating</span>
              </h1>
              <p className="text-xl text-blue-50 max-w-xl leading-relaxed font-medium">
                Shield your precision parts with professional Zinc and Nickel plating. Enhance corrosion resistance, surface hardness, and electrical conductivity with military-grade consistency.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/login?redirect=/dashboard">
                  <Button size="lg" className="h-16 px-10 bg-white text-[#2F5FA7] hover:bg-blue-50 rounded-2xl font-black text-lg gap-3 shadow-xl transition-all hover:scale-[1.02]">
                    Start Plating Project <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#options">
                  <Button variant="outline" size="lg" className="h-16 px-10 border-2 border-white/20 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-lg text-white">
                    View Plating Types
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative animate-in fade-in zoom-in duration-1000 delay-300 lg:block hidden">
              <div className="relative aspect-square rounded-[3rem] overflow-hidden border-8 border-white/10 shadow-2xl bg-gradient-to-br from-blue-400 to-blue-600 p-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl" />
                <Sparkles className="w-48 h-48 text-white/20 animate-pulse absolute top-10 right-10" />
                <div className="relative z-10 text-center space-y-6">
                  <div className="w-32 h-32 rounded-full border-8 border-white/30 mx-auto flex items-center justify-center">
                    <Settings className="w-12 h-12 text-white animate-spin-slow" />
                  </div>
                  <p className="text-2xl font-black text-white uppercase tracking-tighter italic">Uniform Deposit <br /> Coverage</p>
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
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Zinc/Nickel</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic">Available Types</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">23" x 23"</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic">Max Part Size</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">MIL-A-8625</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic">Industry Standard</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">100%</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic">Corrosion Resistant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Plating Options */}
      <section id="options" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
              Plating <span className="text-blue-600">Variations</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium italic">
              Each plating type offers unique chemical properties tailored for specific environmental and electrical requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLATING_OPTIONS.map((option, i) => (
              <div key={i} className="group p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all duration-500 shadow-sm hover:shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mb-8 shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">{option.name}</h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">{option.type}</p>
                <p className="text-sm text-slate-500 font-medium leading-relaxed italic">{option.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>

        <div className="container mx-auto px-4 md:px-10 lg:px-20 relative z-10">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter">
              Compatible <span className="text-blue-400">Substrates</span>
            </h2>
            <p className="text-lg text-slate-400 font-medium italic leading-relaxed">
              Electroplating requires metallic conductivity for uniform deposition. Non-metals must be treated via alternative methods.
            </p>
          </div>

          <div className="space-y-16">
            {PLATING_MATERIALS.map((group, gIdx) => (
              <div key={gIdx} className="space-y-10">
                <h3 className="text-2xl font-black uppercase tracking-widest border-l-4 border-blue-500 pl-6">{group.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {group.items.map((item, iIdx) => (
                    <div key={iIdx} className={`p-8 rounded-[2rem] border transition-all ${item.supported ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/50' : 'bg-red-500/5 border-red-500/10 opacity-60'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-black uppercase tracking-tighter">
                          {item.name}
                        </h4>
                        {item.supported === true ? <CheckCircle2 className="text-blue-400 w-5 h-5 shrink-0" /> : <AlertCircle className="text-red-400 w-5 h-5 shrink-0" />}
                      </div>
                      <p className="text-slate-400 font-medium mb-4 italic text-sm leading-relaxed">{item.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical FAQ / How it Works */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter leading-none">
                  Design for <br /> <span className="text-blue-600">Plating (DFP)</span>
                </h2>
                <p className="text-lg text-slate-600 font-medium italic">Avoid common pitfalls by ensuring your CAD data accounts for the electrochemical deposition process.</p>
              </div>

              <div className="space-y-2">
                {[
                  { q: "Part Size Limitations", a: "Standard tanks accommodate flat parts up to 23\" x 23\". Volumetric parts vary based on depth." },
                  { q: "Hollow Sections & Pockets", a: "Deep pockets or tubular sections may experience 'Faraday Cage' effects, resulting in thinner plating on internal surfaces." },
                  { q: "Drainage Holes", a: "Parts with enclosed volumes must include drainage holes for the plating solution to exit and prevent fluid carry-over." },
                ].map((item, id) => (
                  <div key={id} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all cursor-default group">
                    <p className="font-black text-slate-900 uppercase tracking-tighter mb-2 group-hover:text-blue-600 transition-colors">{item.q}</p>
                    <p className="text-sm text-slate-500 leading-relaxed italic">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative aspect-square lg:block hidden">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-[100px] opacity-30 animate-pulse" />
              <div className="relative z-10 w-full h-full rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-100 transform rotate-2">
                <Image
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800"
                  alt="Plating Process Close-up"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 text-center">
          <div className="max-w-4xl mx-auto space-y-10">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9]">
              Scale Your Finish <br /> With <span className="text-blue-600">Expert Precision</span>
            </h2>
            <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto italic leading-relaxed">
              From one-off prototypes to high-volume production, our plating specialists ensure your parts meet strict tolerances and finish standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login?redirect=/consultation">
                <Button size="lg" className="h-16 px-12 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-lg gap-4 shadow-xl transition-all">
                  Consult a Specialist <MessageSquare className="w-5 h-5 text-blue-400" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
