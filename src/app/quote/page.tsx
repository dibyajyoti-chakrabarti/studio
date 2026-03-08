"use client";

import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, FileType, CheckCircle, ChevronRight, X, Loader2, Info, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';

// --- DATA & RATE CARDS ---
const MATERIALS = {
    'MS (Mild Steel)': { density: 7.85, cost: 65, hardness_factor: 1.0 },
    'SS 304': { density: 8.00, cost: 280, hardness_factor: 1.8 },
    'SS 316': { density: 8.00, cost: 380, hardness_factor: 2.0 },
    'Aluminium 6061': { density: 2.70, cost: 320, hardness_factor: 0.7 },
    'Aluminium 5052': { density: 2.68, cost: 295, hardness_factor: 0.65 },
    'Copper': { density: 8.96, cost: 750, hardness_factor: 1.5 },
    'Brass': { density: 8.50, cost: 600, hardness_factor: 1.3 },
    'EN8 Steel': { density: 7.85, cost: 95, hardness_factor: 1.2 },
    'EN24 Steel': { density: 7.85, cost: 140, hardness_factor: 1.6 },
};

const PROCESSES = {
    'CNC Machining 3-Axis': { rate: 1200, setup: 800, min: 600 },
    'CNC Machining 5-Axis': { rate: 2200, setup: 1500, min: 1200 },
    'Laser Cutting Fiber': { rate: 900, setup: 400, min: 300 },
    'Laser Cutting CO2': { rate: 650, setup: 300, min: 250 },
    'Sheet Metal Bending': { rate: 700, setup: 500, min: 400 },
    'TIG Welding': { rate: 600, setup: 400, min: 350 },
    'MIG Welding': { rate: 450, setup: 300, min: 250 },
    'CNC Turning/Lathe': { rate: 800, setup: 500, min: 400 },
    'Wire EDM': { rate: 1800, setup: 1200, min: 900 },
};

const QUANTITY_BREAKS = [
    { max: 1, factor: 2.8 },
    { max: 5, factor: 2.0 },
    { max: 10, factor: 1.6 },
    { max: 25, factor: 1.35 },
    { max: 50, factor: 1.18 },
    { max: 100, factor: 1.08 },
    { max: 500, factor: 0.95 },
    { max: Infinity, factor: 0.88 },
];

const getQuantityFactor = (qty: number) => {
    return QUANTITY_BREAKS.find(b => qty <= b.max)?.factor || 0.88;
};

const FINISHES = {
    'Raw / As Machined': 1.00,
    'Powder Coating': 1.18,
    'Anodizing': 1.22,
    'Zinc Plating': 1.15,
    'Chrome Plating': 1.35,
    'Nickel Plating': 1.28,
    'Sand Blasting': 1.10,
    'Mirror Polish': 1.25,
    'Black Oxide': 1.12,
};

const TOLERANCES = {
    'Standard ±0.5mm': 1.00,
    'Medium ±0.2mm': 1.20,
    'Fine ±0.1mm': 1.45,
    'Precision ±0.05mm': 1.80,
    'Ultra ±0.02mm': 2.30,
};

const COMPLEXITIES = {
    'Simple': { hours: 0.3, desc: 'flat/basic shape — plates, basic brackets', days: 2 },
    'Medium': { hours: 0.8, desc: 'holes/slots/bends — flanges, sheet metal parts', days: 4 },
    'Complex': { hours: 1.8, desc: 'pockets/curves/threads — housings, multi-feature parts', days: 7 },
    'Highly Complex': { hours: 3.5, desc: '5-axis/intricate — impellers, aerospace geometry', days: 12 },
};

const CITIES = {
    'Bengaluru': 250, 'Chennai': 250, 'Hyderabad': 250,
    'Pune': 200, 'Delhi-NCR': 200, 'Kolkata': 200,
    'Mumbai': 300,
    'Ahmedabad': 190, 'Coimbatore': 190,
    'Other': 300
};

const FALLBACK_INSIGHTS = [
    { title: "Cost Tip", tip: "Batching 25+ pieces reduces per-part cost by 18–25% with Indian job shops." },
    { title: "DFM Tip", tip: "Adding 0.5mm corner radius on internal pockets significantly reduces CNC time." },
    { title: "Vendor Tip", tip: "Request ISO-certified MechMasters for B2B orders requiring documentation." }
];

const LOADING_MESSAGES = [
    "Parsing CAD geometry...",
    "Matching Indian material rates...",
    "Calculating machining time...",
    "Applying quantity breaks...",
    "Fetching MechMaster availability...",
    "Generating AI insights..."
];

// --- MAIN COMPONENT ---
export default function QuoteEngine() {
    const [step, setStep] = useState<1 | 2 | 3 | 'loading'>(1);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

    // Form State
    const [material, setMaterial] = useState(Object.keys(MATERIALS)[0]);
    const [process, setProcess] = useState(Object.keys(PROCESSES)[0]);
    const [finish, setFinish] = useState(Object.keys(FINISHES)[0]);
    const [tolerance, setTolerance] = useState(Object.keys(TOLERANCES)[0]);
    const [complexity, setComplexity] = useState(Object.keys(COMPLEXITIES)[0]);
    const [length, setLength] = useState<number | ''>('');
    const [width, setWidth] = useState<number | ''>('');
    const [height, setHeight] = useState<number | ''>('');
    const [weight, setWeight] = useState<number | ''>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [city, setCity] = useState(Object.keys(CITIES)[0]);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileSize, setFileSize] = useState<number>(0);
    const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);

    // Results State
    const [results, setResults] = useState<any>(null);

    // New API/UX States
    const [insights, setInsights] = useState(FALLBACK_INSIGHTS);
    const [insightsLoading, setInsightsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [quoteRef, setQuoteRef] = useState<string>('');
    const router = useRouter();
    const { user } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- LOGIC ---
    const handleSampleSelect = (type: string) => {
        setFileName(`Sample_${type.replace(' ', '_')}.step`);
        setFileSize(1024 * 543);
        setFileDataUrl(null);
        setStep(2);
    };

    const computeResults = () => {
        const mat = MATERIALS[material as keyof typeof MATERIALS];
        const proc = PROCESSES[process as keyof typeof PROCESSES];
        const finMultiplier = FINISHES[finish as keyof typeof FINISHES];
        const tolMultiplier = TOLERANCES[tolerance as keyof typeof TOLERANCES];
        const comp = COMPLEXITIES[complexity as keyof typeof COMPLEXITIES];
        const cityCost = CITIES[city as keyof typeof CITIES];

        const qty = quantity || 1;
        const l = Number(length);
        const w = Number(width);
        const h = Number(height);

        const volume_cm3 = (l * w * h) / 1000;
        const utilized_volume = volume_cm3 * 0.60;
        const calc_weight_kg = (utilized_volume * mat.density) / 1000;
        const final_weight_kg = Number(weight) > 0 ? Number(weight) : calc_weight_kg || 0.1;

        const material_cost = final_weight_kg * mat.cost * mat.hardness_factor;
        const machining_cost = (comp.hours * proc.rate) + proc.setup;
        const base_per_part = Math.max(material_cost + machining_cost, proc.min);
        const with_finish = base_per_part * finMultiplier;
        const with_tolerance = with_finish * tolMultiplier;
        const qtyFactor = getQuantityFactor(qty);
        const per_part_with_qty = with_tolerance * qtyFactor;
        const subtotal = per_part_with_qty * qty;

        const material_cost_total = Math.round((material_cost / base_per_part) * subtotal) || 0;
        const machining_cost_total = Math.round((machining_cost / base_per_part) * subtotal) || 0;
        const finish_cost_total = Math.round(((with_finish - base_per_part) / base_per_part) * subtotal) || 0;

        const platform_fee = subtotal * 0.08;
        const logistics = cityCost;
        const preTax = subtotal + platform_fee + logistics;
        const gst = preTax * 0.18;
        const total = preTax + gst;

        const low_estimate = Math.round(total * 0.75);
        const high_estimate = Math.round(total * 1.25);
        const per_part_display = Math.round(per_part_with_qty);

        let leadTimeDays = comp.days;
        if (qty > 200) leadTimeDays += 5;
        else if (qty > 50) leadTimeDays += 3;
        if (tolerance.includes('Precision') || tolerance.includes('Ultra')) leadTimeDays += 2;

        return {
            weight: final_weight_kg,
            material_cost,
            machining_cost,
            finish_cost: (with_finish - base_per_part),
            material_cost_total,
            machining_cost_total,
            finish_cost_total,
            platform_fee,
            logistics,
            gst,
            total,
            low_estimate,
            high_estimate,
            per_part: per_part_display,
            lead_time: leadTimeDays
        };
    };

    const runLoadingAnimation = () => {
        return new Promise<void>((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 4;
                setLoadingProgress(progress);
                const msgIdx = Math.floor((progress / 100) * LOADING_MESSAGES.length);
                setLoadingMsgIdx(Math.min(msgIdx, LOADING_MESSAGES.length - 1));
                if (progress >= 100) {
                    clearInterval(interval);
                    resolve();
                }
            }, 50);
        });
    };

    const fetchInsights = async (resData: any) => {
        setInsightsLoading(true);
        try {
            const res = await fetch('/api/ai-insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    material, process, finish, tolerance, complexity,
                    quantity, city,
                    dimensions: { l: Number(length), w: Number(width), h: Number(height) },
                    estimate: { low: resData.low_estimate, high: resData.high_estimate }
                })
            });
            const data = await res.json();
            if (data.insights && Array.isArray(data.insights)) {
                setInsights(data.insights);
            } else {
                setInsights(FALLBACK_INSIGHTS);
            }
        } catch {
            setInsights(FALLBACK_INSIGHTS);
        } finally {
            setInsightsLoading(false);
        }
    };

    const calculateQuote = async () => {
        const l = Number(length);
        const w = Number(width);
        const h = Number(height);
        const wt = Number(weight);

        const hasDimensions = l > 0 && w > 0 && h > 0;
        const hasWeight = wt > 0;

        if (!hasDimensions && !hasWeight) {
            alert("Please provide either Bounding Box Dimensions or a Weight estimate.");
            return;
        }
        if (l > 3000 || w > 3000 || h > 3000) {
            alert("Maximum dimension is 3000mm. Contact us for larger parts.");
            return;
        }
        if (quantity < 1 || quantity > 10000) {
            alert("Quantity must be between 1 and 10,000 pieces.");
            return;
        }

        const calculatedResults = computeResults();
        setResults(calculatedResults);
        setQuoteRef(`MH-${Date.now().toString(36).toUpperCase().slice(-6)}`);

        setStep('loading');
        setLoadingProgress(0);
        setLoadingMsgIdx(0);

        await runLoadingAnimation();

        setStep(3);
        fetchInsights(calculatedResults);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-zinc-300 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[#020617]" style={{
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '30px 30px'
            }} />
            <div className="max-w-5xl mx-auto relative z-10">

                {/* Header & Stepper */}
                <div className="mb-12">
                    <h1 className="text-3xl md:text-5xl  uppercase tracking-wide text-white mb-4">Budget Estimator</h1>
                    <p className="text-cyan-100/60 text-lg mb-8">Get a rough cost range to plan your project — before speaking to a MechMaster.</p>

                    <div className="flex items-center justify-between relative max-w-2xl mx-auto">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 z-0 rounded">
                            <div
                                className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-300"
                                style={{ width: step === 1 ? '0%' : step === 2 || step === 'loading' ? '50%' : '100%' }}
                            />
                        </div>

                        {[1, 2, 3].map((s) => {
                            const isActive = step === s || (step === 'loading' && s === 2);
                            const isPast = (typeof step === 'number' && step > s) || (step === 'loading' && s < 2) || (step === 3);

                            return (
                                <div key={s} className="relative z-10 flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2 ${isActive ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]' :
                                        isPast ? 'bg-cyan-500 border-cyan-400 text-slate-950' :
                                            'bg-[#020617] border-white/20 text-zinc-500'
                                        }`}>
                                        {isPast ? <CheckCircle size={18} /> : <span className="">{s}</span>}
                                    </div>
                                    <span className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${isActive || isPast ? 'text-cyan-400' : 'text-zinc-500'}`}>
                                        {s === 1 ? 'Your Part' : s === 2 ? 'Specs' : 'Budget Range'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* --- STEP 1: UPLOAD --- */}
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div
                            className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center bg-[#040f25]/40 hover:bg-cyan-950/20 transition-all cursor-pointer group hover:border-cyan-500/50 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-md"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept=".step,.stp,.stl,.dxf,.dwg,.pdf,.iges,.igs"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setFileName(file.name);
                                        setFileSize(file.size);
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            setFileDataUrl(event.target?.result as string);
                                            setStep(2);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                            <div className="w-20 h-20 bg-cyan-950/50 border border-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:border-cyan-400 transitions-transform shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                                <UploadCloud className="w-10 h-10 text-cyan-400 group-hover:text-cyan-300" />
                            </div>
                            <h3 className="text-2xl  uppercase font-semibold mb-2 text-white">Upload 3D CAD File</h3>
                            <p className="text-zinc-500 font-consolas mb-6 text-sm">Drag and drop or click to browse</p>
                            <div className="flex flex-wrap justify-center gap-2 text-[10px] text-cyan-400 font-bold tracking-widest uppercase">
                                <span className="bg-[#020617] px-3 py-1.5 rounded-lg border border-white/10">.STEP</span>
                                <span className="bg-[#020617] px-3 py-1.5 rounded-lg border border-white/10">.STP</span>
                                <span className="bg-[#020617] px-3 py-1.5 rounded-lg border border-white/10">.STL</span>
                                <span className="bg-[#020617] px-3 py-1.5 rounded-lg border border-white/10">.DXF</span>
                                <span className="bg-[#020617] px-3 py-1.5 rounded-lg border border-white/10">.DWG</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-6 text-[11px] font-bold tracking-widest uppercase text-zinc-500">
                            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-cyan-500" /> NDA Protected</span>
                            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-cyan-500" /> IP Confidential</span>
                            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-cyan-500" /> Instant Analysis</span>
                        </div>

                        <div className="pt-8 border-t border-white/10">
                            <p className="text-[10px] font-bold text-zinc-500 mb-4 uppercase tracking-[0.2em] text-center">Or try a sample part</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['Flange Plate', 'Shaft Collar', 'Mounting Bracket', 'Custom Housing'].map((sample) => (
                                    <button
                                        key={sample}
                                        onClick={() => handleSampleSelect(sample)}
                                        className="p-4 rounded-xl bg-[#040f25]/40 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-950/30 hover:-translate-y-1 transition-all text-[11px] uppercase tracking-widest font-bold flex flex-col items-center gap-3 text-zinc-300 hover:text-cyan-50 shadow-sm"
                                    >
                                        <FileType className="w-5 h-5 text-cyan-500/70" />
                                        {sample}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- STEP 2: PARAMETERS --- */}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="flex items-center justify-between mb-6 bg-[#040f25]/40 border border-white/10 p-4 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-cyan-950/50 rounded-lg"><FileType size={20} className="text-cyan-400" /></div>
                                <span className="font-consolas text-sm font-medium text-white">{fileName}</span>
                            </div>
                            <button onClick={() => setStep(1)} className="text-sm text-zinc-500 hover:text-cyan-400 flex items-center gap-1 transition-colors">
                                <X size={16} /> Change file
                            </button>
                        </div>

                        <div className="bg-zinc-950/60 border border-white/10 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden">
                            {/* Glow accent */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 opacity-50" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                                {/* Left Col */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[11px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Material</label>
                                        <select value={material} onChange={e => setMaterial(e.target.value)} className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 hover:border-white/20 appearance-none custom-select transition-all">
                                            {Object.keys(MATERIALS).map(m => <option key={m} value={m} className="bg-zinc-950">{m}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Manufacturing Process</label>
                                        <select value={process} onChange={e => setProcess(e.target.value)} className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 hover:border-white/20 appearance-none custom-select transition-all">
                                            {Object.keys(PROCESSES).map(p => <option key={p} value={p} className="bg-zinc-950">{p}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Surface Finish</label>
                                        <select value={finish} onChange={e => setFinish(e.target.value)} className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 hover:border-white/20 appearance-none custom-select transition-all">
                                            {Object.keys(FINISHES).map(f => <option key={f} value={f} className="bg-zinc-950">{f}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Tolerance Requirements</label>
                                        <select value={tolerance} onChange={e => setTolerance(e.target.value)} className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 hover:border-white/20 appearance-none custom-select transition-all">
                                            {Object.keys(TOLERANCES).map(t => <option key={t} value={t} className="bg-zinc-950">{t}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Right Col */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[11px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Part Complexity</label>
                                        <select value={complexity} onChange={e => setComplexity(e.target.value)} className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 hover:border-white/20 appearance-none custom-select transition-all mb-2">
                                            {Object.keys(COMPLEXITIES).map(c => <option key={c} value={c} className="bg-zinc-950">{c}</option>)}
                                        </select>
                                        <p className="text-[11px] text-zinc-500 font-consolas italic">&quot;{COMPLEXITIES[complexity as keyof typeof COMPLEXITIES].desc}&quot;</p>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-[11px] font-bold text-cyan-400 uppercase tracking-widest">Bounding Box Dimensions (mm) <span className="text-zinc-600 font-semibold lowercase tracking-normal">(optional if weight provided)</span></label>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="relative">
                                                <input type="number" placeholder="L" value={length} onChange={e => setLength(e.target.value ? Number(e.target.value) : '')} className="w-full bg-[#020617] border border-white/10 rounded-xl px-3 py-3 text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 hover:border-white/20 focus:outline-none pl-8 transition-all" />
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-600 text-sm font-consolas">L</span>
                                            </div>
                                            <div className="relative">
                                                <input type="number" placeholder="W" value={width} onChange={e => setWidth(e.target.value ? Number(e.target.value) : '')} className="w-full bg-[#020617] border border-white/10 rounded-xl px-3 py-3 text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 hover:border-white/20 focus:outline-none pl-8 transition-all" />
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-600 text-sm font-consolas">W</span>
                                            </div>
                                            <div className="relative">
                                                <input type="number" placeholder="H" value={height} onChange={e => setHeight(e.target.value ? Number(e.target.value) : '')} className="w-full bg-[#020617] border border-white/10 rounded-xl px-3 py-3 text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 hover:border-white/20 focus:outline-none pl-8 transition-all" />
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-600 text-sm font-consolas">H</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-[11px] font-bold text-cyan-400 uppercase tracking-widest">Estimated Weight (kg) <span className="text-zinc-600 font-semibold lowercase tracking-normal">(optional)</span></label>
                                        </div>
                                        <input type="number" placeholder="e.g. 1.25 (Overrides dimensions)" min="0" step="0.01" value={weight} onChange={e => setWeight(e.target.value ? Number(e.target.value) : '')} className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 hover:border-white/20 transition-all font-consolas" />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-[11px] font-bold text-cyan-400 uppercase tracking-widest">Quantity</label>
                                            {quantity >= 25 && <span className="text-[10px] bg-cyan-950/50 text-cyan-400 border border-cyan-500/20 px-2 py-1.5 rounded-lg flex items-center gap-1 uppercase tracking-widest font-bold"><Info size={12} /> Bulk active</span>}
                                        </div>
                                        <input type="number" min="1" max="10000" value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value)))} className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 hover:border-white/20 transition-all font-consolas" />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Delivery City</label>
                                        <select value={city} onChange={e => setCity(e.target.value)} className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 hover:border-white/20 appearance-none custom-select transition-all">
                                            {Object.keys(CITIES).map(c => <option key={c} value={c} className="bg-zinc-950">{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-6 border-t border-white/10 flex justify-between items-center relative z-10">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-3 rounded-xl border border-white/10 bg-[#020617]/50 text-zinc-400 hover:text-white hover:border-white/30 transition-all"
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={calculateQuote}
                                    className="bg-gradient-to-r from-cyan-600 to-blue-600 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:from-cyan-500 hover:to-blue-500 text-white font-bold tracking-wide py-4 px-8 rounded-xl transition-all flex items-center gap-2"
                                >
                                    Calculate Budget Range <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- LOADING --- */}
                {step === 'loading' && (
                    <div className="bg-zinc-950/60 border border-white/10 rounded-2xl p-16 flex flex-col items-center justify-center min-h-[400px] shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                        <Loader2 className="w-16 h-16 text-cyan-500 animate-[spin_3s_linear_infinite] mb-8" />
                        <h3 className="text-2xl  uppercase tracking-wider text-white mb-6">Analyzing Constraints</h3>

                        <div className="w-full max-w-md bg-[#020617] rounded-full h-2 mb-4 overflow-hidden border border-white/10 shadow-inner">
                            <div
                                className="bg-cyan-500 h-full transition-all duration-300 ease-linear rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                                style={{ width: `${loadingProgress}%` }}
                            />
                        </div>

                        <p className="text-cyan-400 font-consolas text-sm animate-pulse h-6 tracking-widest uppercase">
                            {LOADING_MESSAGES[loadingMsgIdx]}
                        </p>
                    </div>
                )}

                {/* --- STEP 3: RESULTS --- */}
                {step === 3 && results && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto">

                        {/* Unified SaaS Estimate Panel */}
                        <div className="bg-zinc-950/60 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl rounded-2xl overflow-hidden text-white relative">
                            {/* Alert Banner */}
                            <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-4 flex items-start gap-3 relative z-10">
                                <Info size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-amber-500/90 leading-relaxed font-sans">
                                    <strong className="text-amber-500 font-bold uppercase tracking-wider text-[11px]">Planning estimate only.</strong> Actual quote may vary within indicative range based on CAD geometry, strict tolerances, and real-time machine availability. Use this to plan your budget, then request an exact quote.
                                </p>
                            </div>

                            {/* Header & Ref */}
                            <div className="px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 relative z-10">
                                <div>
                                    <h2 className="text-xl  uppercase font-bold text-white tracking-wide">Est. Budget Range</h2>
                                    <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-bold">Based on provided requirements</p>
                                </div>
                                <div className="flex items-center gap-2 bg-[#020617]/50 border border-white/10 rounded-lg px-3 py-1.5 w-fit shadow-inner">
                                    <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">Ref</span>
                                    <span className="text-sm font-consolas text-cyan-50 shadow-sm">{quoteRef}</span>
                                </div>
                            </div>

                            {/* Main Split Content */}
                            <div className="flex flex-col md:flex-row relative z-10">
                                {/* Left Side: Pricing */}
                                <div className="flex-1 p-8 md:border-r border-white/5 flex flex-col justify-center bg-[#040f25]/30">
                                    <div className="mb-2">
                                        <span className="text-5xl md:text-6xl font-bold tracking-tight text-white block drop-shadow-md">
                                            ₹{results.low_estimate.toLocaleString('en-IN')} <span className="text-zinc-600 text-4xl font-normal mx-1">–</span> ₹{results.high_estimate.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-400 flex items-center gap-1.5 uppercase tracking-widest font-bold mt-2">
                                        <CheckCircle className="w-3.5 h-3.5 text-cyan-500" /> Indicative manufacturing band (incl. taxes)
                                    </p>
                                </div>

                                {/* Right Side: Specs Snapshot */}
                                <div className="w-full md:w-80 p-8 bg-[#020617]/50 flex flex-col justify-center border-l border-white/5">
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 mb-4">Specs Summary</h4>
                                    <ul className="space-y-3">
                                        <li className="flex justify-between items-center"><span className="text-[11px] font-bold tracking-widest uppercase text-zinc-500">Material</span> <span className="text-xs font-consolas text-white text-right">{material}</span></li>
                                        <li className="flex justify-between items-center"><span className="text-[11px] font-bold tracking-widest uppercase text-zinc-500">Process</span> <span className="text-xs font-consolas text-white text-right">{process}</span></li>
                                        <li className="flex justify-between items-center"><span className="text-[11px] font-bold tracking-widest uppercase text-zinc-500">Finish</span> <span className="text-xs font-consolas text-white text-right">{finish}</span></li>
                                        <li className="flex justify-between items-center"><span className="text-[11px] font-bold tracking-widest uppercase text-zinc-500">Tolerance</span> <span className="text-xs font-consolas text-white text-right">{tolerance}</span></li>
                                        <li className="flex justify-between items-center"><span className="text-[11px] font-bold tracking-widest uppercase text-cyan-600">Est. Weight</span> <span className="text-xs font-consolas text-cyan-100 text-right">{results.weight.toFixed(2)} kg/pc</span></li>
                                    </ul>
                                </div>
                            </div>

                            {/* Bottom Metric Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/5 border-t border-white/5 bg-[#020617]/80 relative z-10">
                                <div className="p-6 flex flex-col items-center sm:items-start group hover:bg-[#040f25]/50 transition-colors">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 group-hover:text-cyan-400 transition-colors">Per Part (incl. GST)</p>
                                    <p className="text-2xl font-bold font-consolas text-white">₹{results.per_part.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="p-6 flex flex-col items-center sm:items-start group hover:bg-[#040f25]/50 transition-colors">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 group-hover:text-cyan-400 transition-colors">Total Quantity</p>
                                    <p className="text-2xl font-bold font-consolas text-white">{quantity} <span className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-500 ml-1">pcs</span></p>
                                </div>
                                <div className="p-6 flex flex-col items-center sm:items-start relative overflow-hidden group hover:bg-[#040f25]/50 transition-colors">
                                    <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-2 relative z-10">Est. Lead Time</p>
                                    <p className="text-2xl font-bold font-consolas text-white relative z-10">{results.lead_time} <span className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-500 ml-1">Days</span></p>
                                </div>
                            </div>

                            {/* Optional Bulk Discount Banner */}
                            {quantity >= 10 && (
                                <div className="bg-emerald-500/10 border-t border-emerald-500/20 px-8 py-3 flex items-center gap-3">
                                    <Info size={16} className="text-emerald-500" />
                                    <p className="text-sm text-emerald-400">
                                        <strong className="font-semibold">Bulk Discount Applied:</strong> You are saving ₹{Math.round((results.total / 0.88 * 2.8 - results.total)).toLocaleString('en-IN')} vs prototype pricing
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Middle Row: Breakdown & Insights */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">

                            {/* Detailed Breakdown Table */}
                            <div className="bg-zinc-950/60 border border-white/10 rounded-2xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
                                <h3 className="text-lg  uppercase text-cyan-50 mb-6 tracking-wide">Cost Breakdown</h3>

                                <div className="space-y-4 font-consolas text-sm">
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-zinc-500">Material Cost</span>
                                        <span className="text-white">₹{results.material_cost_total?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-zinc-500">Machining / Process Cost</span>
                                        <span className="text-white">₹{results.machining_cost_total?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-zinc-500">Finish & Treatments</span>
                                        <span className="text-white">₹{results.finish_cost_total?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-cyan-600">QC & Platform Fee (8%)</span>
                                        <span className="text-white">₹{results.platform_fee.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-zinc-500">Logistics to {city}</span>
                                        <span className="text-white">₹{results.logistics.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-zinc-500">GST (18%)</span>
                                        <span className="text-white">₹{results.gst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                    </div>

                                    <div className="flex justify-between pt-2 text-lg font-bold text-cyan-400">
                                        <span className="uppercase tracking-widest font-sans text-xs pt-1">Total Estimate</span>
                                        <span>₹{results.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                    </div>
                                </div>
                            </div>

                            {/* What Affects Your Final Quote */}
                            <div className="bg-[#040f25]/40 border border-white/10 rounded-2xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
                                <h3 className="text-white  uppercase tracking-wide text-lg mb-6 flex items-center gap-2">
                                    <Info size={18} className="text-cyan-500" />
                                    What Could Affect Your Final Quote
                                </h3>
                                <div className="grid grid-cols-1 gap-4 text-sm">
                                    {[
                                        ["Exact geometry", "Complex features not visible from bounding box"],
                                        ["Actual tolerances", "Tighter tolerances increase machining time"],
                                        ["Material availability", "Spot prices fluctuate weekly in Indian markets"],
                                        ["MechMaster location", "Logistics cost varies by city and weight"],
                                        ["Finish complexity", "Multi-step finishing adds time and cost"],
                                        ["Rush requirement", "24–48hr turnaround carries 30–50% premium"],
                                    ].map(([factor, desc]) => (
                                        <div key={factor} className="flex gap-3 items-start bg-zinc-950/50 p-3 rounded-lg border border-white/5">
                                            <span className="text-cyan-500 font-bold mt-0.5 font-consolas">→</span>
                                            <div>
                                                <p className="text-zinc-200 font-bold uppercase tracking-wider text-[11px] mb-1">{factor}</p>
                                                <p className="text-zinc-500 text-xs leading-relaxed">{desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="bg-[#020617]/80 border border-cyan-500/20 p-6 rounded-2xl flex flex-col xl:flex-row items-center justify-between gap-6 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                            <p className="text-xs text-zinc-500 max-w-[200px] xl:max-w-sm uppercase tracking-widest leading-relaxed">
                                <strong className="text-cyan-500">* For exact pricing, request a quote.</strong> This is a planning estimate only — your actual quote may vary.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-end w-full xl:w-auto mt-4 xl:mt-0">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-3 rounded-xl border border-white/10 bg-[#040f25]/40 text-white font-bold uppercase tracking-widest text-[11px] hover:bg-cyan-950/50 hover:border-cyan-500/50 transition-all flex-1 sm:flex-none"
                                >
                                    New Estimate
                                </button>
                                <button
                                    onClick={() => {
                                        const contactUrl = `/consultation?ref=${quoteRef}&material=${encodeURIComponent(material)}&process=${encodeURIComponent(process)}&qty=${quantity}&estimate=${encodeURIComponent(`₹${results.low_estimate}–₹${results.high_estimate}`)}`;
                                        if (user) {
                                            router.push(contactUrl);
                                        } else {
                                            router.push(`/login?tab=register&redirect=${encodeURIComponent(contactUrl)}`);
                                        }
                                    }}
                                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold uppercase tracking-widest text-[11px] shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all hover:scale-[1.02] flex-1 sm:flex-none flex items-center justify-center gap-2"
                                >
                                    Talk to an Expert → Free
                                </button>
                            </div>
                        </div>

                    </div>
                )}

            </div>

            {/* Styles for custom select dropdown arrows to match dark theme */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238B9CB6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }
      `}} />
        </div>
    );
}
