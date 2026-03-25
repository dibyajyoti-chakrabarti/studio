'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, ChevronRight, Info, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase/provider';

// --- DATA ---
const CATEGORIES = ["ALL", "ALUMINUM", "STEEL", "STAINLESS", "COMPOSITES", "PLASTICS", "WOODS", "3D PRINTING"];

const MATERIALS = [
  // ALUMINUM
  {
    name: "Aluminium 5052",
    category: "aluminum",
    processes: ["Sheet Cutting", "Bending"],
    thicknesses: "1, 1.6, 2, 2.3, 2.5, 3.2, 4.7, 6.3, 8, 9.5 mm",
    notes: ">5mm not for bending, powder coating available",
    thumb: "", 
    colors: { base: "#C0C7CF", alt: "#A8B0B8", hover: "#D6DBE1" }
  },
  {
    name: "Aluminium 6061",
    category: "aluminum",
    processes: ["Sheet Cutting", "CNC Machining"],
    thicknesses: "1, 1.6, 2, 2.5, 3.2, 4.7, 6.3, 8, 9.5 mm",
    notes: "not for bending, powder coating available",
    thumb: "", 
    colors: { base: "#B0B7BF", alt: "#9AA3AB" }
  },

  // STEEL
  {
    name: "CRCA Mild Steel",
    category: "steel",
    processes: ["Sheet Cutting", "Bending"],
    thicknesses: "0.8, 1.2, 1.5, 1.9, 2.6, 3, 3.4, 4.8, 6.3, 8, 9.5 mm",
    notes: ">5mm not for bending, powder coating available",
    thumb: "/mild_steel_swatch.png", 
    colors: { base: "#6E6E6E", alt: "#4B4B4B" }
  },

  // STAINLESS STEEL
  {
    name: "Stainless Steel 304",
    category: "stainless",
    processes: ["Sheet Cutting", "Bending"],
    thicknesses: "0.8, 1.2, 1.5, 1.9, 2.5, 3.2, 4.7, 6.3, 9.5 mm",
    notes: ">5mm not for bending, powder coating available",
    thumb: "", 
    colors: { base: "#D9DEE3", alt: "#BFC5CC", highlight: "#8E959C" }
  },

  // COMPOSITES
  {
    name: "Carbon Fiber Plate",
    category: "composites",
    processes: ["Sheet Cutting"],
    thicknesses: "1, 1.6, 2, 3, 4, 5 mm",
    notes: "not for bending, not for powder coating",
    thumb: "", 
    colors: { base: "#1C1C1E", pattern: "#2A2A2D" }
  },

  // PLASTICS
  {
    name: "Acrylic",
    category: "plastics",
    processes: ["Laser Cut", "Sheet Cutting"],
    thicknesses: "1.6, 3, 4.5, 5.4, 9.5, 12.7 mm",
    notes: "not for bending, not for powder coating",
    thumb: "", 
    colors: { base: "rgba(200, 220, 255, 0.25)", frosted: "#E6F0FF", edge: "#BFD7FF" }
  },

  // WOODS
  {
    name: "MDF",
    category: "woods",
    processes: ["Laser Cut", "CNC Machining"],
    thicknesses: "3.2, 6.3, 9.5, 12.7 mm",
    notes: "not for bending, not for powder coating",
    thumb: "", 
    colors: { base: "#C49A6C", alt: "#A67C52" }
  },
  {
    name: "Plywood",
    category: "woods",
    processes: ["Laser Cut", "Sheet Cutting"],
    thicknesses: "3.2, 6.3, 9, 12 mm",
    notes: "not for bending, not for powder coating",
    thumb: "", 
    colors: { base: "#D2A679", alt: "#B98A5A" }
  },
  {
    name: "Balsa Wood",
    category: "woods",
    processes: ["Laser Cut"],
    thicknesses: "1, 3, 5 mm",
    notes: "not for bending, not for powder coating",
    thumb: "", 
    colors: { base: "#E6CFA8" }
  },

  // 3D PRINTING
  { name: "PLA", category: "3d_printing", processes: ["3D Printing"], thicknesses: "Any geometry", colors: { base: "#E8E8E8" } },
  { name: "TPU", category: "3d_printing", processes: ["3D Printing"], thicknesses: "Any geometry", colors: { base: "#2E2E2E", alt: "#3A3A3A" } },
  { name: "ABS", category: "3d_printing", processes: ["3D Printing"], thicknesses: "Any geometry", colors: { base: "#D6D6D6", alt: "#2F2F30" } },
  { name: "PETG", category: "3d_printing", processes: ["3D Printing"], thicknesses: "Any geometry", colors: { base: "#DFF3FF", translucent: "rgba(180, 220, 255, 0.35)" } },
  { name: "ASA", category: "3d_printing", processes: ["3D Printing"], thicknesses: "Any geometry", colors: { base: "#C8CDD2" } },
];

function MaterialSwatch({ mat, overrideColor }: { mat: any, overrideColor?: string }) {
  const isMetal = ["aluminum", "steel", "stainless"].includes(mat.category);
  const isWood = mat.category === "woods";
  const isPlastic = mat.category === "plastics" || mat.category === "3d_printing";
  const isComposite = mat.category === "composites";

  if (mat.thumb && mat.thumb.startsWith('/') && !overrideColor) {
    return (
      <div className="w-14 h-14 rounded-xl relative overflow-hidden shadow-inner border border-slate-200 bg-white">
        <Image src={mat.thumb} alt={mat.name} fill className="object-cover" />
      </div>
    );
  }

  let style: React.CSSProperties = {
    backgroundColor: overrideColor || mat.colors?.base || '#CBD5E1'
  };

  if (overrideColor) {
    style.backgroundImage = 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)';
  } else if (isMetal) {
    style.backgroundImage = `linear-gradient(145deg, ${mat.colors?.base || '#C0C7CF'} 0%, ${mat.colors?.alt || '#A8B0B8'} 100%)`;
  } else if (isComposite) {
    style.backgroundImage = `
      repeating-linear-gradient(45deg, ${mat.colors?.base} 0px, ${mat.colors?.base} 2px, ${mat.colors?.pattern} 2px, ${mat.colors?.pattern} 4px),
      repeating-linear-gradient(-45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 10px)
    `;
  } else if (isWood) {
    style.backgroundImage = `
      linear-gradient(to right, ${mat.colors?.base}, ${mat.colors?.alt || mat.colors?.base}),
      repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 4px)
    `;
  } else if (mat.name === "Acrylic") {
    style.backdropFilter = "blur(8px)";
    style.border = "1px solid rgba(255,255,255,0.3)";
    style.backgroundImage = `linear-gradient(135deg, ${mat.colors?.base}, rgba(255,255,255,0.1))`;
  } else if (mat.name === "PETG") {
    style.backgroundImage = `linear-gradient(135deg, ${mat.colors?.base}, ${mat.colors?.translucent || mat.colors?.base})`;
  } else if (isPlastic) {
    style.backgroundImage = `linear-gradient(145deg, ${mat.colors?.base}, ${mat.colors?.alt || mat.colors?.base})`;
  }

  return (
    <div 
      className="w-14 h-14 rounded-xl relative overflow-hidden shadow-inner border border-slate-200/50 group-hover:scale-105 transition-transform duration-500" 
      style={style}
    >
      {/* Dynamic Shine/Texture Overlays */}
      {isMetal && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}
      {isWood && (
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }} />
      )}
      {isComposite && (
        <div className="absolute inset-0 bg-white/5 mix-blend-overlay" />
      )}
      <div className="absolute inset-0 bg-black/5" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-black/5 blur-[4px]" />
    </div>
  );
}

export function MaterialsSection() {
  const router = useRouter();
  const { user } = useUser();
  const [activeFilter, setActiveFilter] = useState('ALUMINUM');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [selectedCoating, setSelectedCoating] = useState<string | undefined>(undefined);

  const handleQuoteClick = () => {
    if (!user) {
      router.push('/login');
    } else {
      router.push('/dashboard');
    }
  };

  const filteredMaterials = useMemo(() => {
    return MATERIALS.filter(mat => {
      const matchCategory = activeFilter === 'ALL' || mat.category.toUpperCase() === activeFilter.replace(' ', '_').toUpperCase();
      const matchSearch = mat.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [activeFilter, searchQuery]);

  useEffect(() => {
    if (selectedMaterial) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedMaterial]);

  return (
    <section id="materials" className="py-16 md:py-24 bg-[#F8FAFC] relative overflow-hidden border-t border-slate-200">
      {/* Layer 1: Subtle Background Visuals */}
      <div className="absolute inset-0 blueprint-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white to-transparent opacity-80 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#F1F5F9] to-transparent opacity-100 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Layer 2: Hero Content */}
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-block text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-[#2F5FA7] mb-4 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100/50">
            INDUSTRIAL CATALOG
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#0F172A] mb-4 md:mb-6 leading-tight">
            <span className="text-[#2F5FA7]">{MATERIALS.length}+</span> materials in stock
          </h2>
          <p className="text-[#64748B] max-w-xl mx-auto text-sm md:text-base font-medium mb-8 text-balance">
            Every material is stocked, cut to order, and shipped fast. No minimums. No surprises.
          </p>
          <div className="max-w-md mx-auto relative mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search specifications..."
              className="w-full h-12 md:h-14 pl-12 pr-4 bg-white border border-slate-300/50 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none text-slate-700 font-medium text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-2 mb-4 md:mb-8">
          {/* Subtle Masking gradients for overflow indication */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none md:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none" />

          <div className="flex overflow-x-auto pb-4 md:pb-6 gap-2 no-scrollbar-on-mobile custom-scrollbar-on-desktop">
            {CATEGORIES.map(cat => {
              const count = cat === 'ALL'
                ? MATERIALS.length
                : MATERIALS.filter(m => m.category.toUpperCase() === cat.replace(' ', '_').toUpperCase()).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`
                    flex-shrink-0 px-5 md:px-6 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold tracking-wider uppercase transition-all duration-300 border
                    ${activeFilter === cat
                      ? 'bg-[#1e40af] text-white shadow-xl shadow-blue-200 border-[#1e40af]'
                      : 'bg-white text-[#475569] border-slate-200 hover:border-blue-300 hover:text-[#1e40af] hover:shadow-md'}
                  `}
                >
                  {cat} {count > 0 && <span className="ml-1 opacity-60">· {count}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Layer 3: Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6 max-w-7xl mx-auto">
          {filteredMaterials.map((mat, idx) => (
            <div
              key={mat.name}
              onClick={() => {
                // Check if 'slug' exists on the material object (casting to any for safety with dynamic materials)
                const material = mat as any;
                if (material.slug) {
                  router.push(material.slug);
                } else {
                  setSelectedMaterial(mat);
                }
              }}
              className="group bg-white border border-slate-100 rounded-xl md:rounded-2xl p-3 md:p-5 flex items-center gap-4 cursor-pointer transition-all duration-300 hover:border-blue-400/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 active:scale-95 animate-in fade-in zoom-in-95 duration-200 backdrop-blur-sm"
            >
              <MaterialSwatch mat={mat} />
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm font-bold text-[#0F172A] mb-0.5 truncate uppercase tracking-tight group-hover:text-blue-600 transition-colors">{mat.name}</div>
                <div className="text-[10px] font-mono font-medium text-slate-500 mb-2 truncate opacity-80">{mat.thicknesses}</div>
                <div className="flex flex-wrap gap-1">
                  {mat.processes.slice(0, 2).map(p => (
                    <span key={p} className="text-[8px] md:text-[9px] px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md font-bold uppercase tracking-wide border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">{p}</span>
                  ))}
                </div>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMaterial && (
        <>
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300" onClick={() => { setSelectedMaterial(null); setSelectedCoating(undefined); }} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[101] shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-10">
                <button onClick={() => { setSelectedMaterial(null); setSelectedCoating(undefined); }} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200 text-slate-700`}>
                  {selectedMaterial.category}
                </div>
              </div>

              <div className="flex items-center gap-6 mb-12">
                <div className="w-24 h-24 relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <MaterialSwatch mat={selectedMaterial} overrideColor={selectedCoating} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight uppercase tracking-tight mb-2">{selectedMaterial.name}</h3>
                  <div className="flex items-center gap-2 text-blue-600 font-mono text-sm font-bold">
                    <Info className="w-4 h-4" /> IN STOCK · SHIPS FAST
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {selectedMaterial.notes && (
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                    <h4 className="text-[10px] font-black text-[#2F5FA7] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3" /> MANUFACTURING NOTES
                    </h4>
                    <p className="text-xs font-bold text-[#1E3A66] leading-relaxed">
                      {selectedMaterial.notes}
                    </p>
                  </div>
                )}

                {selectedMaterial.notes?.toLowerCase().includes("powder coating") && (
                  <div>
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">POWDER COATING COLORS</h4>
                    <div className="flex gap-3">
                      {[
                        { name: 'Black', hex: '#1C1C1C' },
                        { name: 'White', hex: '#F5F5F5' },
                        { name: 'Red', hex: '#C62828' },
                        { name: 'Blue', hex: '#1565C0' },
                        { name: 'Yellow', hex: '#F9A825' }
                      ].map(color => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedCoating(color.hex)}
                          className={`w-10 h-10 rounded-full border-2 transition-all ${selectedCoating === color.hex ? 'border-blue-500 scale-110 shadow-lg' : 'border-slate-200 hover:border-slate-300'}`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                      <button
                        onClick={() => setSelectedCoating(undefined)}
                        className={`px-4 py-2 rounded-xl border-2 text-[10px] font-bold uppercase tracking-widest transition-all ${!selectedCoating ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-400 hover:border-slate-300'}`}
                      >
                        Raw
                      </button>
                    </div>
                  </div>
                )}
                <div>
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">PROPERTIES</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[{ l: 'Thickness', v: selectedMaterial.thicknesses }, { l: 'Machinability', v: 'High' }, { l: 'Corrosion', v: 'Excellent' }, { l: 'Strength', v: 'Industrial' }].map(p => (
                      <div key={p.l} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{p.l}</div>
                        <div className="text-sm font-bold text-slate-700">{p.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">CAPABILITIES</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMaterial.processes.map((proc: string) => (
                      <div key={proc} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {proc}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-10">
                  <Button
                    onClick={handleQuoteClick}
                    className="w-full h-16 bg-[#2F5FA7] hover:bg-[#1E3A66] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 group"
                  >
                    Quote with this Material <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .no-scrollbar-on-mobile::-webkit-scrollbar { 
          display: none; 
        }
        @media (min-width: 768px) {
          .custom-scrollbar-on-desktop::-webkit-scrollbar {
            height: 4px;
          }
          .custom-scrollbar-on-desktop::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
          }
          .custom-scrollbar-on-desktop::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }
          .custom-scrollbar-on-desktop::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        }
        .no-scrollbar-on-mobile { 
          -ms-overflow-style: none; 
          scrollbar-width: none; 
        }
        @media (min-width: 768px) {
          .custom-scrollbar-on-desktop {
            -ms-overflow-style: auto;
            scrollbar-width: thin;
          }
        }
      `}</style>
    </section>
  );
}
