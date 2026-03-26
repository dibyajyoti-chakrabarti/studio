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
  Palette,
  Droplet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingNav } from '@/components/LandingNav';
import { Footer } from '@/components/Footer';

const POWDER_COLORS = [
  { name: "Traffic White", hex: "#FFFFFF", type: "Gloss (90%)", ral: "RAL 9016" },
  { name: "Jet Black", hex: "#0A0A0A", type: "Matte (0-9%)", ral: "RAL 9005" },
  { name: "Racing Red", hex: "#CC0000", type: "Gloss (85%)", ral: "RAL 3002" },
  { name: "Sky Blue", hex: "#005EB8", type: "Gloss (85%)", ral: "RAL 5010" },
  { name: "Industrial Gray", hex: "#707070", type: "Metallic", ral: "Custom" },
  { name: "Signal Yellow", hex: "#FFCD00", type: "Gloss (85%)", ral: "RAL 1018" },
  { name: "Signal Green", hex: "#008751", type: "Gloss (85%)", ral: "RAL 6001" },
  { name: "Textured Black", hex: "#1A1A1A", type: "Wrinkle", ral: "Sandtex" },
];

const POWDER_MATERIALS = [
  {
    category: "Ideal for Coating",
    items: [
      { name: "Aluminium 5052/6061", notes: "Superior adhesion and excellent finish quality. UV and corrosion resistant.", color: "bg-slate-200", supported: true },
      { name: "CRCA Mild Steel", notes: "Provides a durable protective layer against rust. Ideal for industrial frames.", color: "bg-slate-400", supported: true },
      { name: "Stainless Steel 304", notes: "Excellent adhesion and incredible long-term durability.", color: "bg-zinc-300", supported: true },
    ]
  },
  {
    category: "Restricted / Incompatible",
    items: [
      { name: "Acrylic / Plastic", notes: "High curing temperatures (400°F) will melt or warp these materials.", color: "bg-amber-100", supported: false },
      { name: "Wood / MDF", notes: "Organic fibers cannot withstand the electrostatic charge or oven heat.", color: "bg-amber-800", supported: false },
      { name: "Copper / Brass", notes: "Surface oxidation can interfere with adhesion. Specialist pre-treatment required.", color: "bg-orange-300", supported: "Limited" },
    ]
  }
];

export default function PowderCoatingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-[#2F5FA7] font-sans">
      <LandingNav />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] lg:h-[75vh] flex items-center pt-32 pb-20 lg:py-0 overflow-hidden  bg-slate-950">
        <div className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>

        <div className="container mx-auto px-4 md:px-10 lg:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 animate-in fade-in slide-in-from-left-12 duration-1000">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black tracking-[0.2em] uppercase">
                <Palette className="w-4 h-4" />
                Ultra-Durable Finishing
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tighter uppercase">
                Powder <br />
                <span className="text-cyan-300">Coating</span>
              </h1>
              <p className="text-xl text-blue-50 max-w-xl leading-relaxed font-medium">
                The ultimate industrial finish for sheet metal. High-impact protection, vibrant color selection, and superior chemical resistance for parts that last.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/login?redirect=/dashboard">
                  <Button size="lg" className="h-16 px-10 bg-white text-[#2F5FA7] hover:bg-blue-50 rounded-2xl font-black text-lg gap-3 shadow-xl transition-all hover:scale-[1.02]">
                    Choose Your Color <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#colors">
                  <Button variant="outline" size="lg" className="h-16 px-10 border-2 border-white/20 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-lg text-white">
                    View Color Palette
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative animate-in fade-in zoom-in duration-1000 delay-300 lg:block hidden">
              <div className="relative rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl aspect-square bg-[#1E3A66] flex items-center justify-center p-12">
                <div className="absolute inset-x-0 bottom-0 p-10 z-20">
                  <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 border border-blue-50">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Finish Status</p>
                      <p className="text-sm font-bold text-slate-900">UV Stable & Impact Resistant</p>
                    </div>
                  </div>
                </div>
                <img
                  src="https://res.cloudinary.com/dypbvtojf/image/upload/v1773985460/powder-coated-profile_e6k4yo.png"
                  alt="Powder Coated Profile"
                  width={240}
                  height={180}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
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
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">10+ Colors</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7] italic">Stock Options</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">30" x 36"</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7] italic">Max Envelope</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">20 Years</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7] italic">Weather Stability</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">ASTM D3363</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7] italic">Pencil Hardness</div>
            </div>
          </div>
        </div>
      </section>

      {/* Color Grid */}
      <section id="colors" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="text-center max-w-3xl mx-auto mb-20 leading-tight">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
              Vibrant <span className="text-blue-600">Stock Finishes</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium italic">
              From high-gloss automotive colors to rugged industrial textures, our stock powder selection meets every demand.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {POWDER_COLORS.map((color, idx) => (
              <div key={idx} className="group bg-white rounded-[2rem] p-6 border border-slate-100 hover:border-blue-200 transition-all duration-500 hover:shadow-xl">
                <div className="aspect-square rounded-2xl mb-6 shadow-inner relative overflow-hidden group-hover:scale-[1.02] transition-transform" style={{ backgroundColor: color.hex }}>
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-1 uppercase tracking-tighter">{color.name}</h3>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-blue-600">{color.ral}</span>
                  <span className="text-slate-400">{color.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering Guidelines */}
      <section className="py-24 bg-slate-950 text-white relative">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter leading-none">
                  DFM for <br /> <span className="text-blue-400">Powder Coating</span>
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed font-medium italic">Essential design considerations to ensure a flawless finish and prevent coating buildup in sensitive areas.</p>
              </div>

              <div className="space-y-8">
                {[
                  { id: "PC1", title: "Rack Marks", desc: "Parts are hung by a hook in an existing hole. This hole must be at least 0.063\" and will have a tiny un-coated 'shadow'.", icon: <Settings className="w-5 h-5 text-blue-400" /> },
                  { id: "PC2", title: "Thread Protection", desc: "Holes meant for fasteners must be masked. Specify these in your RFQ to prevent buildup in the threads.", icon: <ShieldCheck className="w-5 h-5 text-blue-400" /> },
                  { id: "PC3", title: "Corner Radii", desc: "Powder can accumulate in sharp internal corners (Faraday Cage effect). Standard fillets are recommended for uniform flow.", icon: <Maximize2 className="w-5 h-5 text-blue-400" /> },
                ].map((guideline) => (
                  <div key={guideline.id} className="flex gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 font-black text-xl text-blue-400 group-hover:scale-110 transition-transform">
                      {guideline.id}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2 uppercase tracking-tighter">{guideline.title}</h4>
                      <p className="text-slate-400 font-medium text-sm leading-relaxed italic">{guideline.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border-8 border-white/10 rounded-[3rem] p-10 space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-blue-600/5 rotate-12 -z-10 translate-x-12 translate-y-12" />
              <h4 className="text-2xl font-black uppercase text-blue-400 tracking-tighter">Environmental Performance</h4>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Salt Spray Resistance</p>
                    <p className="text-white font-bold italic text-sm">Passes 1000+ hours under ASTM B117 standards.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">UV Stability</p>
                    <p className="text-white font-bold italic text-sm">Retains color and gloss for up to 20 years in outdoor environments.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Chemical Resilience</p>
                    <p className="text-white font-bold italic text-sm">Resistant to solvents, detergents, and industrial oils.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <p className="text-[10px] font-bold text-slate-500 italic flex items-center gap-2">
                  <AlertCircle className="w-3 h-3 text-amber-500" />
                  Note: Micro-tabs from laser cutting will be visible under the coating.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Materials Table */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 uppercase tracking-tighter leading-none">
              Substrate <span className="text-blue-600">Suitability</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium italic">Our standard architectural powders bond best to metallic surfaces capable of withstanding the high-heat curing process.</p>
          </div>

          <div className="space-y-16">
            {POWDER_MATERIALS.map((category, cIdx) => (
              <div key={cIdx} className="space-y-8">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-widest border-l-4 border-blue-600 pl-6">{category.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {category.items.map((item, iIdx) => (
                    <div key={iIdx} className={`rounded-[2rem] p-8 border transition-all hover:bg-white hover:shadow-xl group ${item.supported === true ? 'bg-slate-50 border-slate-100 hover:border-blue-600/20' : (item.supported === false ? 'bg-slate-50 opacity-50 grayscale border-slate-100 cursor-not-allowed' : 'bg-slate-50 border-amber-200 hover:border-amber-300')}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{item.name}</h4>
                        {item.supported === true ? <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0" /> : <AlertCircle className="text-amber-500 w-5 h-5 shrink-0" />}
                      </div>
                      <p className="text-sm text-slate-500 font-medium italic border-l-2 border-slate-200 pl-4">{item.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Path */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9] mb-10">
              Finish Your Build <br /> With <span className="text-blue-600">Vibrant Durability</span>
            </h2>
            <p className="text-xl text-slate-600 font-medium mb-12 italic leading-relaxed max-w-2xl mx-auto">
              Upload your files and select your RAL color. We handle the hanging, coating, and curing to deliver assembly-ready parts directly to your facility.
            </p>
            <Link href="/login?redirect=/dashboard">
              <Button size="lg" className="h-20 px-16 bg-[#2F5FA7] hover:bg-[#1E3A66] text-white rounded-[2rem] font-black text-2xl gap-4 shadow-2xl transition-all hover:scale-[1.02]">
                Order Coated Parts <ArrowRight className="w-7 h-7" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
