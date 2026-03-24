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
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingNav } from '@/components/LandingNav';
import { Footer } from '@/components/Footer';

const TUMBLING_MATERIALS = [
  {
    category: "Ideal for Batch Tumbling",
    items: [
      { name: "Aluminium / SS 304", notes: "Produces a beautiful, uniform matte finish. Eliminates all burrs simultaneously.", color: "bg-slate-200", supported: true },
      { name: "Copper / Brass / Bronze", notes: "Leaves a bright, polished surface. Ideal for removing oxidation.", color: "bg-orange-200", supported: true },
      { name: "Industrial Polymers", notes: "Safe for Delrin and ABS. Removes machining marks without melting the substrate.", color: "bg-blue-600", supported: true },
    ]
  },
  {
    category: "Restricted",
    items: [
      { name: "Thin Metal (<1.2mm)", notes: "Parts can warp or bend under the weight of the ceramic media.", color: "bg-slate-100", supported: "Limited" },
      { name: "Organic Fibers (Wood/MDF)", notes: "Water-based tumbling solutions will soak into and ruin the material.", color: "bg-amber-100", supported: false },
      { name: "Large Flat Parts", notes: "Parts over 10\" are better suited for linear deburring belts.", color: "bg-zinc-800", supported: false },
    ]
  }
];

export default function TumblingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-[#2F5FA7] font-sans">
      <LandingNav />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] lg:h-[75vh] flex items-center pt-32 pb-20 lg:py-0 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}></div>

        <div className="container mx-auto px-4 md:px-10 lg:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 animate-in fade-in slide-in-from-left-12 duration-1000">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black tracking-[0.2em] uppercase">
                <RotateCcw className="w-4 h-4" />
                Mass Finishing Performance
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tighter uppercase">
                Vibratory <br />
                <span className="text-cyan-300">Tumbling</span>
              </h1>
              <p className="text-xl text-blue-50 max-w-xl leading-relaxed font-medium">
                The most efficient way to de-burr and finish small, complex parts. Our ceramic-media tumbling process delivers a uniform, de-glared matte finish to every edge and surface.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/login?redirect=/dashboard">
                  <Button size="lg" className="h-16 px-10 bg-white text-[#2F5FA7] hover:bg-blue-50 rounded-2xl font-black text-lg gap-3 shadow-xl transition-all hover:scale-[1.02]">
                    Order Tumbled Parts <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#materials">
                  <Button variant="outline" size="lg" className="h-16 px-10 border-2 border-white/20 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-lg text-white">
                    Material Suitability
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative animate-in fade-in zoom-in duration-1000 delay-300 lg:block hidden">
              <div className="relative rounded-[5rem] overflow-hidden border-8 border-white shadow-2xl aspect-square bg-blue-900 flex items-center justify-center p-12">
                <div className="absolute inset-x-0 bottom-0 p-10 z-20">
                  <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 border border-blue-50">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Surface Finish</p>
                      <p className="text-sm font-bold text-slate-900">Uniform Matte Guaranteed</p>
                    </div>
                  </div>
                </div>
                <Waves className="w-48 h-48 text-white/10 animate-pulse" />
                <Sparkles className="absolute top-1/4 left-1/4 w-12 h-12 text-blue-400 opacity-40 animate-bounce" />
                <Sparkles className="absolute bottom-1/4 right-1/4 w-8 h-8 text-blue-300 opacity-40 animate-bounce delay-75" />
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
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Ceramic</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic">Advanced Media</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">10" x 10"</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic">Max Volume</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">3mm +</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic">Safe Thickness</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">360°</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic">Full Coverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-12 rounded-[3.5rem] bg-slate-50 border border-slate-100 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm">
                <Maximize2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Internal Access</h3>
              <p className="text-slate-600 font-medium leading-relaxed italic">Unlike linear sanding, tumbling reaches inside holes, slots, and complex internal cutouts to ensure safety everywhere.</p>
            </div>
            <div className="p-12 rounded-[3.5rem] bg-slate-50 border border-slate-100 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Consistent Finish</h3>
              <p className="text-slate-600 font-medium leading-relaxed italic">Achieve a repeatable, professional matte appearance across entire production batches with zero directional grain.</p>
            </div>
            <div className="p-12 rounded-[3.5rem] bg-slate-50 border border-slate-100 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Cost Effective</h3>
              <p className="text-slate-600 font-medium leading-relaxed italic">Batch processing allows for high-volume finishing at a fraction of the cost of manual or secondary deburring methods.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Guidelines */}
      <section id="materials" className="py-24 bg-slate-950 text-white relative">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter leading-none">
                  Tumbling <br /> <span className="text-blue-400">Engineering Rules</span>
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed font-medium italic">While versatile, mass finishing has specific geometric requirements to ensure parts don't nest or damage each other.</p>
              </div>

              <div className="space-y-8">
                {[
                  { id: "T1", title: "Aspect Ratio", desc: "Long, thin parts can bend or warp in the tub. Parts should ideally have a length-to-thickness ratio under 20:1.", icon: <Maximize2 /> },
                  { id: "T2", title: "Internal Radii", desc: "Ensure your smallest internal radius is larger than the media size (standard 6mm) to prevent media bridging.", icon: <Settings /> },
                ].map((item) => (
                  <div key={item.id} className="flex gap-6 p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/15 transition-all group">
                    <div className="w-16 h-16 rounded-2xl bg-blue-400/10 border border-blue-400/30 flex items-center justify-center text-blue-400 font-black text-2xl group-hover:scale-110 transition-transform">
                      {item.id}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2 uppercase tracking-tighter">{item.title}</h4>
                      <p className="text-slate-400 font-medium leading-relaxed italic text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              {TUMBLING_MATERIALS.map((cat, ci) => (
                <div key={ci} className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">{cat.category}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {cat.items.map((mat, mi) => (
                      <div key={mi} className={`p-6 rounded-2xl border ${mat.supported === true ? 'bg-white/5 border-white/10' : 'bg-red-500/5 border-red-500/10 opacity-50'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-black uppercase tracking-tighter">{mat.name}</p>
                          {mat.supported === true ? <CheckCircle2 className="w-4 h-4 text-blue-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                        </div>
                        <p className="text-xs text-slate-400 italic leading-relaxed">{mat.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Expert Advice */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="max-w-5xl mx-auto rounded-[4rem] bg-slate-50 border border-slate-100 p-12 md:p-20 relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-8">
              Achieve the Perfect <br /> <span className="text-blue-600">Industrial Matte</span> Finish
            </h2>
            <p className="text-xl text-slate-600 font-medium mb-12 italic max-w-2xl mx-auto">
              Not sure if your parts are too delicate for ceramic media? Upload your design for a free DFM audit by our engineering team.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/login?redirect=/dashboard">
                <Button size="lg" className="h-16 px-12 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-lg gap-4 shadow-xl transition-all">
                  Order Tumbled Parts <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login?redirect=/consultation">
                <Button variant="outline" size="lg" className="h-16 px-12 border-2 border-slate-200 rounded-2xl font-black text-lg text-slate-700 hover:bg-white transition-all">
                  Talk to an Engineer
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
