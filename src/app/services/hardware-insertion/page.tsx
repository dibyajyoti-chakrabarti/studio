'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LandingNav } from '@/components/LandingNav';

import {
  Settings,
  ShieldCheck,
  Zap,
  ArrowRight,
  ChevronRight,
  Layers,
  Maximize2,
  CheckCircle2,
  Info,
  Ruler,
  Component,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HardwareInsertionPage() {
  const hardwareTypes = [
    {
      title: "Self-Clinching Nuts",
      description: "Provides strong permanent threads in thin sheet metal. Ideal for applications requiring frequent component removal.",
      benefits: ["High torque-out resistance", "Flush mounting on reverse side", "Available in 4-40 to 1/4-20 and M2 to M10"],
      image: "/Self-Clinching-Nuts-MS-.png"
    },
    {
      title: "Self-Clinching Standoffs",
      description: "Used to space components from the panel. Available in through-hole or blind-threaded versions.",
      benefits: ["Precise spacing control", "No secondary assembly needed", "Available in lengths up to 1\" / 25mm"],
      image: "/self_clinching_standoffsimages.jpg"
    },
    {
      title: "Self-Clinching Studs",
      description: "Provides external threads for mounting components. Designed to withstand high pull-out and torque forces.",
      benefits: ["Permanent attachment", "No welding required", "Flush on the backside"],
      image: "/download.jpg"
    }
  ];

  const guidelines = [
    {
      id: "K",
      title: "Edge Distance",
      description: "Fasteners must be placed at least 1.5x the hole diameter from the part edge to prevent deformation.",
      icon: <Ruler className="w-5 h-5" />
    },
    {
      id: "N",
      title: "Bend Clearance",
      description: "Hardware should be positioned outside of bend allowance zones to ensure proper installation and part geometry.",
      icon: <Maximize2 className="w-5 h-5" />
    },
    {
      id: "M/P",
      title: "Fastener Spacing",
      description: "Minimum center-to-center spacing is required between fasteners to avoid material interference during pressing.",
      icon: <Layers className="w-5 h-5" />
    }
  ];

  const materialGroups = [
    {
      name: "Aluminium & Steel",
      materials: [
        { name: "Aluminium 5052", thicknesses: ["1mm", "1.6mm", "2mm", "2.3mm", "2.5mm", "3.2mm", "4.7mm", "6.3mm", "8mm", "9.5mm"], notes: ">5mm not for bending, powder coating available" },
        { name: "Aluminium 6061", thicknesses: ["1mm", "1.6mm", "2mm", "2.5mm", "3.2mm", "4.7mm", "6.3mm", "8mm", "9.5mm"], notes: "not for bending, powder coating available" },
        { name: "CRCA Mild steel", thicknesses: ["0.8mm", "1.2mm", "1.5mm", "1.9mm", "2.6mm", "3mm", "3.4mm", "4.8mm", "6.3mm", "8mm", "9.5mm"], notes: ">5mm not for bending, powder coating available" },
        { name: "Stainless steel 304", thicknesses: ["0.8mm", "1.2mm", "1.5mm", "1.9mm", "2.5mm", "3.2mm", "4.7mm", "6.3mm", "9.5mm"], notes: ">5mm not for bending, powder coating available" }
      ]
    },
    {
      name: "Plastics & Wood",
      materials: [
        { name: "Carbon fiber plate", thicknesses: ["1mm", "1.6mm", "2mm", "3mm", "4mm", "5mm"], notes: "not for bending, not for powder coating" },
        { name: "Acrylic", thicknesses: ["1.6mm", "3mm", "4.5mm", "5.4mm", "9.5mm", "12.7mm"], notes: "not for bending, not for powder coating" },
        { name: "MDF", thicknesses: ["3.2mm", "6.3mm", "9.5mm", "12.7mm"], notes: "not for bending, not for powder coating" },
        { name: "Plywood", thicknesses: ["3.2mm", "6.3mm", "9mm", "12mm"], notes: "not for bending, not for powder coating" },
        { name: "Balsa wood", thicknesses: ["1mm", "3mm", "5mm"], notes: "Not for bending, not for powder coating" }
      ]
    },
    {
      name: "3D Printing Materials",
      materials: [
        { name: "PLA", thicknesses: ["Custom"], notes: "Heat-set or press inserts available" },
        { name: "TPU", thicknesses: ["Custom"], notes: "Mechanical inserts available" },
        { name: "ABS", thicknesses: ["Custom"], notes: "Heat-staking optimized" },
        { name: "PETG / ASA", thicknesses: ["Custom"], notes: "Industrial inserts available" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <LandingNav />
      {/* Hero Section */}
      <section className="relative min-h-[70vh] lg:h-[70vh] flex items-center py-20 lg:py-0 overflow-hidden bg-slate-950">

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
                Mechanical Assembly
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tighter uppercase">
                Hardware <br />
                <span className="text-cyan-300">Insertion</span>
              </h1>
              <p className="text-xl text-white/80 max-w-xl leading-relaxed">
                Add permanent, high-strength threads to your custom parts with our precision hardware installation. Specializing in PEM® self-clinching fasteners for metal, plastic, and composite assemblies.
              </p>
              <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-white font-bold">
                  <ShieldCheck className="w-5 h-5 text-cyan-300" />
                  <span>Permanent Attachment</span>
                </div>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Zap className="w-5 h-5 text-cyan-300" />
                  <span>+1-2 Day Production</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link href="/login?redirect=/dashboard">
                  <Button size="lg" className="w-full sm:w-auto px-10 h-16 bg-white hover:bg-slate-100 text-[#2F5FA7] rounded-full font-black text-lg gap-2 shadow-2xl">
                    Get Started <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative group animate-in fade-in zoom-in duration-1000 hidden md:block">
              <div className="absolute -inset-4 bg-white/10 rounded-[3rem] blur-2xl group-hover:bg-white/20 transition-all duration-700 opacity-50"></div>
              <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white/10 shadow-2xl aspect-[4/3]">
                <img
                  src="https://res.cloudinary.com/dypbvtojf/image/upload/v1773984866/inserting_tisw_TitleImageSwap500x408_u9dldf.webp"
                  alt="Precision Hardware Installation"
                  width={240}
                  height={180}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-10">
                  <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl inline-flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#2F5FA7]">Verified Installation</p>
                      <p className="text-sm font-bold text-slate-900">PEM® Self-Clinching Nut</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Blueprint Elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 border-t-2 border-r-2 border-white/20 hidden xl:block" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 border-b-2 border-l-2 border-white/20 hidden xl:block" />
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Triangle Details */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="text-center max-w-3xl mx-auto mb-20 leading-tight">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
              Standard Hardware Options
            </h2>
            <p className="text-lg text-slate-600 font-medium">
              We offer a wide variety of standardized fasteners that integrate seamlessly into your parts during the manufacturing process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hardwareTypes.map((type, index) => (
              <div key={index} className="group relative bg-slate-50 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 hover:border-[#2F5FA7]/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                <div className="relative h-48 mb-8 rounded-2xl overflow-hidden shadow-lg bg-white p-4">
                  <Image src={type.image} alt={type.title} fill className="object-contain group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4">{type.title}</h3>
                <p className="text-slate-600 mb-8 font-medium leading-relaxed">{type.description}</p>
                <ul className="space-y-4">
                  {type.benefits.map((benefit, bIndex) => (
                    <li key={bIndex} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Geometry Guidelines */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#2F5FA7]/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 md:px-10 lg:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 uppercase tracking-tighter">
                  Design for <br />
                  <span className="text-cyan-400">Installation</span>
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed font-medium">
                  Proper geometry is critical for a high-quality hardware press. Follow these essential rules to ensure your parts are ready for assembly.
                </p>
              </div>

              <div className="space-y-8">
                {guidelines.map((item) => (
                  <div key={item.id} className="flex gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-400/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-400/30 font-black text-xl group-hover:scale-110 transition-transform">
                      {item.id === "K" || item.id === "N" || item.id === "M/P" ? item.id : item.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2 flex items-center gap-2">
                        {item.title}
                      </h4>
                      <p className="text-slate-400 font-medium leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group hidden md:block">
              <div className="aspect-[4/3] bg-white border-8 border-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative">
                <img
                  src="https://res.cloudinary.com/dypbvtojf/image/upload/v1773984866/inserting_tisw_TitleImageSwap500x408_u9dldf.webp"
                  alt="Installation Geometry Guide"
                  width={240}
                  height={180}
                  className="object-cover"
                />
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
              Available Materials
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              We precisely install hardware in metals, polymers, and wood. Use the table below to verify material thickness and processing notes.
            </p>
          </div>

          <div className="space-y-16">
            {materialGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="text-2xl font-black text-slate-900 mb-8 border-l-4 border-blue-600 pl-6 uppercase tracking-widest">{group.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.materials.map((material, mIndex) => (
                    <div key={mIndex} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-blue-600/20 transition-all hover:bg-white hover:shadow-xl group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <h4 className="text-lg font-black text-slate-900 flex items-center gap-2 lowercase">
                          <CheckCircle2 className="w-5 h-5 text-blue-600" />
                          {material.name}
                        </h4>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase">Hardware Ready</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 leading-none">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block w-full mb-1">Stock Thicknesses:</span>
                          {material.thicknesses.map((t, tIndex) => (
                            <span key={tIndex} className="bg-white border border-slate-200 px-3 py-1 rounded-md text-xs font-bold text-slate-700 shadow-sm">
                              {t}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 font-bold italic bg-white/10 p-2 rounded-lg border border-slate-100 leading-normal">
                          <span className="text-blue-600 inline-block mr-1">Note:</span> {material.notes}
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
                <span className="text-blue-600">Hardware</span>
              </h2>
              <p className="text-slate-600 font-medium mb-12">
                Integrating hardware into your design is a simple 3-step process within our online configurator.
              </p>
              <div className="hidden lg:block">
                <div className="w-full aspect-[4/5] relative rounded-[3rem] overflow-hidden shadow-2xl">
                  <Image src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" alt="Assembly Process" fill className="object-cover" />
                  <div className="absolute inset-0 bg-blue-600/20 mix-blend-multiply" />
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 space-y-12">
              {[
                {
                  step: "01",
                  title: "Upload Your Design",
                  description: "Upload your CAD files (.STEP, .DXF, .AI) to the MechHub dashboard. Our system automatically identifies hole centers for standard fasteners."
                },
                {
                  step: "02",
                  title: "Configure & Select",
                  description: "Choose your material and browse our hardware catalog. Select specific fasteners (Nuts, Studs, Standoffs) and assign them to your part's holes."
                },
                {
                  step: "03",
                  title: "Professional Installation",
                  description: "Our team uses Haeger® hardware presses to professionally install your fasteners with verified torque and pull-out strength before shipping."
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
          <p className="text-sm font-black text-[#2F5FA7] uppercase tracking-[0.3em] mb-4">Precision Assemblies</p>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-10 max-w-2xl mx-auto tracking-tighter uppercase leading-tight">
            Ready to build stronger products?
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <span className="font-bold text-slate-700 uppercase leading-none">ISO 9001 Certified</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <span className="font-bold text-slate-700 uppercase leading-none">DFM Feedback Included</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
