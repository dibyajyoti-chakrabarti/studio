'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  Palette,
  Maximize2,
  Zap,
  CheckCircle2,
  AlertCircle,
  Layers,
  Settings,
  CircleDollarSign,
  ClipboardCheck,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingNav } from '@/components/LandingNav';
import { Footer } from '@/components/Footer';

interface AnodizingMaterial {
  name: string;
  notes: string;
  color: string;
  supported: boolean;
  sizes?: string;
}

interface MaterialGroup {
  category: string;
  items: AnodizingMaterial[];
}

const ANODIZING_COLORS = [
  { name: "Matte Black", hex: "#1A1A1A", class: "Class II - Dyed" },
  { name: "Clear Silver", hex: "#E5E7EB", class: "Class I - Natural" },
  { name: "Racing Red", hex: "#DC2626", class: "Class II - Dyed" },
  { name: "Vibrant Blue", hex: "#2563EB", class: "Class II - Dyed" },
  { name: "Industrial Gold", hex: "#D4AF37", class: "Class II - Dyed" },
];

const ANODIZING_MATERIALS: MaterialGroup[] = [
  {
    category: "Supported Substrates",
    items: [
      { name: "Aluminium 5052", sizes: "1mm - 9.5mm", notes: "Primary choice for sheet metal anodizing. Excellent color uniformity.", color: "bg-slate-200", supported: true },
      { name: "Aluminium 6061", sizes: "1mm - 9.5mm", notes: "High-strength structural choice. Takes dye exceptionally well.", color: "bg-slate-300", supported: true },
    ]
  },
  {
    category: "Unsupported (Incompatible)",
    items: [
      { name: "Mild Steel / SS 304", notes: "Anodizing is restricted to Aluminium. Recommend Powder Coating.", color: "bg-zinc-400", supported: false },
      { name: "Carbon Fiber / Acrylic", notes: "Electrochemical process requires conductive metal. Not applicable.", color: "bg-blue-100/40", supported: false },
      { name: "MDF / Plywood / Wood", notes: "Non-conductive organic materials are not suitable for anodizing.", color: "bg-amber-100", supported: false },
      { name: "3D Polymers (PLA/ABS)", notes: "Plastics cannot be anodized. Recommend specialty paints.", color: "bg-blue-600", supported: false },
    ]
  }
];

export default function AnodizingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-[#2F5FA7] font-sans">
      <LandingNav />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] lg:h-[80vh] flex items-center pt-32 pb-20 lg:py-0 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)',
            backgroundSize: '30px 30px'
          }}></div>
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-blue-900/40 to-transparent blur-3xl z-0" />

        <div className="container mx-auto px-4 md:px-10 lg:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 animate-in fade-in slide-in-from-left-12 duration-1000">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black tracking-[0.2em] uppercase">
                <Palette className="w-4 h-4" />
                MIL-A-8625 TYPE II Finishing
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tighter uppercase">
                Pro-Grade <br />
                <span className="text-cyan-300">Anodizing</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-xl leading-relaxed font-medium">
                Transform raw aluminum into high-performance components with a durable, vibrant, and corrosion-resistant oxide finish. Perfect for aerospace, robotics, and consumer electronics.
              </p>
              <div className="flex flex-wrap gap-8 pt-6 border-t border-white/10">
                <div className="space-y-1">
                  <p className="text-3xl font-black text-white tracking-tighter">5</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Vibrant Colors</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-white tracking-tighter">23"</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Max Part Dim</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-white tracking-tighter">100%</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Corrosion Proof</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/login?redirect=/dashboard">
                  <Button size="lg" className="h-16 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg gap-3 shadow-[0_20px_40px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02]">
                    Start Your Project <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative animate-in fade-in zoom-in duration-1000 delay-300 lg:block hidden">
              <div className="relative rounded-[3rem] overflow-hidden border-8 border-white/10 shadow-2xl aspect-[4/3] bg-slate-900/40 backdrop-blur-sm">
                <img
                  src="https://res.cloudinary.com/dypbvtojf/image/upload/v1773985502/anodized-parts_c6bzzo.webp"
                  alt="Anodized Aluminum Parts"
                  width={240}
                  height={180}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-10">
                  <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl inline-flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">Quality Check</p>
                      <p className="text-sm font-bold text-slate-900">MIL-SPEC Type II Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Corrosion Block", desc: "Chemical conversion thickens the natural oxide layer, making parts nearly immune to environmental wear.", icon: ShieldCheck },
              { title: "Hardened Surface", desc: "The resulting anodic layer is significantly harder than the base aluminum, providing superior scratch resistance.", icon: Zap },
              { title: "Non-Conductive", desc: "Anodizing creates a highly effective electrical insulator across the entire part surface.", icon: Maximize2 },
              { title: "Chemical Bond", desc: "Unlike paint, anodizing is a molecular bond that will never flake, peel, or chip under stress.", icon: Layers },
            ].map((benefit, i) => (
              <div key={i} className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-6 text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-3 uppercase tracking-tighter">{benefit.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed italic">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Color Showcase */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 uppercase tracking-tighter leading-none">
              Available <span className="text-blue-600">Finishes</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium">Standard Type II Anodized options. We use precision dyes for Class II and natural processing for Class I.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {ANODIZING_COLORS.map((color, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="w-full aspect-square rounded-[2rem] mb-4 shadow-xl border-4 border-white transition-transform hover:scale-105"
                  style={{ backgroundColor: color.hex }}
                />
                <p className="font-black text-slate-900 uppercase tracking-widest text-[10px]">{color.name}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase">{color.class}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering Specs (DFM) */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-50 lg:block hidden">
              <Image
                src="https://images.unsplash.com/photo-1504917595217-d4dc5f649771?auto=format&fit=crop&q=80&w=800"
                alt="Anodizing Bath Inspection"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            </div>

            <div className="space-y-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter leading-none">
                  Engineering <br /> <span className="text-blue-600">Considerations</span>
                </h2>
                <p className="text-lg text-slate-600 font-medium">Anodizing is a highly technical process. Correct design preparation is essential for a premium result.</p>
              </div>

              <div className="space-y-6">
                {[
                  { title: "Rack Marks", desc: "Small contact points (min 0.125\") are required to pass electrical current. These usually appear on inner edges.", icon: Settings },
                  { title: "Part Size Constraints", desc: "Flat parts must fit within 23\" x 23\". Machined parts must stay under 7\" x 7\" x 12\" for tank clearance.", icon: Maximize2 },
                  { title: "Masking Services", desc: "Precision masking is available if specific surfaces (like grounded points) must remain conductive.", icon: ShieldCheck },
                ].map((spec, i) => (
                  <div key={i} className="flex gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100 text-blue-600 group-hover:scale-110 transition-transform">
                      <spec.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 mb-1 uppercase tracking-tighter">{spec.title}</h4>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed italic">{spec.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Material Grid */}
      <section className="py-24 bg-slate-900 relative overflow-hidden text-white">
        <div className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>

        <div className="container mx-auto px-4 md:px-10 lg:px-20 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black tracking-widest uppercase mb-4">
              Compatibility List
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter leading-none">
              Substrate <span className="text-blue-400">Filtering</span>
            </h2>
            <p className="text-lg text-slate-400 font-medium">Anodizing relies on an electrolytic reaction exclusive to Aluminum. Other materials will be rejected in the bath.</p>
          </div>

          <div className="space-y-16">
            {ANODIZING_MATERIALS.map((group, gIdx) => (
              <div key={gIdx} className="space-y-8">
                <h3 className="text-2xl font-black uppercase tracking-widest border-l-4 border-blue-500 pl-6">{group.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.items.map((item, iIdx) => (
                    <div key={iIdx} className={`p-8 rounded-[2rem] border transition-all ${item.supported ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/50' : 'bg-red-500/5 border-red-500/10 opacity-60 grayscale'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                          {item.supported ? <CheckCircle2 className="text-blue-400 w-5 h-5" /> : <AlertCircle className="text-red-400 w-5 h-5" />}
                          {item.name}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${item.supported ? 'bg-blue-500/20 text-blue-300' : 'bg-red-500/20 text-red-300'}`}>
                          {item.supported ? 'Compatible' : (item.notes.includes('Powder') ? 'Recommend Powder Coat' : 'Incompatible')}
                        </span>
                      </div>
                      <p className="text-slate-400 font-medium mb-4 italic text-sm">{item.notes}</p>
                      {item.supported && item.sizes && (
                        <div className="pt-4 border-t border-white/10">
                          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-2">Available Thickness</span>
                          <span className="inline-block px-3 py-1 bg-white/5 text-slate-300 rounded-lg text-xs font-bold">{item.sizes}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Support */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto rounded-[40px] border border-blue-50 bg-[#E8F1FF]/30 p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-16 items-center">
              <div className="text-center lg:text-left space-y-8">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">EXPERT SUPPORT</p>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                  Need Help with <br /> Finishing Specs?
                </h2>
                <p className="text-slate-600 text-lg font-medium max-w-lg mx-auto lg:mx-0 italic">
                  Not sure where to place rack marks? Need guidance on Class I vs Class II dye absorption? Talk to our finishing specialists.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Palette, label: 'Color Matching' },
                    { icon: Maximize2, label: 'Rack Placement' },
                    { icon: ShieldCheck, label: 'Type II Specs' },
                    { icon: MessageSquare, label: 'Custom Quotes' },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:scale-[1.02]">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link href="/login?redirect=/consultation">
                    <Button size="lg" className="h-16 px-12 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-lg gap-4 shadow-xl transition-all">
                      Speak with an Expert <ArrowRight className="w-5 h-5 text-blue-400" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white hidden lg:block">
                <Image
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800"
                  alt="Precision Tooling"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent" />
                <div className="absolute bottom-10 left-10 p-8 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20">
                  <div className="w-12 h-1 bg-blue-400 rounded-full mb-4" />
                  <p className="text-white font-black uppercase text-xl tracking-tighter">Surface Excellence <br /> Guaranteed</p>
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
