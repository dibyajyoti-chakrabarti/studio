'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { LandingNav } from '@/components/LandingNav';
import { Footer } from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import {
    Search,
    ChevronRight,
    Package,
    ShoppingCart,
    ArrowRight,
    ShieldCheck,
    Truck,
    RotateCcw,
    Zap,
    AlertCircle,
    CheckCircle2,
    Settings,
    Maximize2,
    Boxes,
    BarChart3,
    ArrowUpRight,
    Store,
    Scale,
    X,
    History
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Image from 'next/image';
import { ShopHeroCanvas } from '@/components/ShopHeroCanvas';

const CATEGORIES = [
    { id: 'all', label: 'All Components' },
    { id: 'bearings', label: 'Bearings' },
    { id: 'linear-motion', label: 'Linear Motion' },
    { id: 'transmission', label: 'Transmission' },
    { id: 'raw-materials', label: 'Raw Materials' },
    { id: 'fasteners', label: 'Fasteners' },
];

const FILTERS = {
    sort: ['Popular', 'Price: Low to High', 'Price: High to Low', 'New Arrivals'],
    material: ['Chrome Steel', 'Aluminum', 'Stainless Steel', 'Mild Steel'],
    diameter: ['8mm', '12mm', '15mm', '20mm']
};

export default function ShopPage() {
    const db = useFirestore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('Popular');
    const { addItem, totalItems } = useCart();
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
    const [compareList, setCompareList] = useState<any[]>([]);

    const productsRef = useMemoFirebase(() => {
        if (!db) return null;
        return collection(db, 'products');
    }, [db]);

    const { data: products, isLoading, error } = useCollection(productsRef);

    const filteredProducts = useMemo(() => {
        if (!products) return [];
        let result = products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.sku.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
            return matchesSearch && matchesCategory && p.isActive !== false;
        });

        // Basic sorting
        if (sortBy === 'Price: Low to High') result.sort((a, b) => a.salePrice - b.salePrice);
        if (sortBy === 'Price: High to Low') result.sort((a, b) => b.salePrice - a.salePrice);

        return result;
    }, [products, searchQuery, selectedCategory, sortBy]);

    const toggleCompare = (product: any) => {
        setCompareList(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (exists) return prev.filter(p => p.id !== product.id);
            if (prev.length >= 3) return prev;
            return [...prev, product];
        });
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-cyan-500/30">
            <LandingNav />

            {/* 1. Hero Section (Engineering-First Redesign) */}
            <div className="relative pt-32 pb-24 overflow-hidden bg-[#020617]">
                {/* Visual Elements: Blueprint Grid & Background Glow */}
                <div className="blueprint-grid opacity-[0.05] pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full" />
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                        {/* LEFT: Messaging & Industrial Search */}
                        <div className="lg:col-span-6 max-w-2xl">
                            <Badge variant="outline" className="mb-6 border-cyan-500/30 text-cyan-400 font-mono tracking-widest px-4 py-1.5 bg-cyan-500/5 backdrop-blur-sm animate-in fade-in slide-in-from-left-4 duration-500">
                                <Settings className="w-3.5 h-3.5 mr-2 animate-spin-slow" /> INDUSTRIAL GRADE COMPONENTS
                            </Badge>
                            
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.05] text-white animate-in fade-in slide-in-from-left-6 duration-700">
                                Reliable <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Mechanical</span> Parts Registry.
                            </h1>
                            
                            <p className="text-zinc-400 text-lg font-light mb-10 leading-relaxed max-w-lg animate-in fade-in slide-in-from-left-8 duration-1000">
                                Precision hardware for engineering scale. Verified tolerances, transparent bulk pricing, and rapid global procurement.
                            </p>

                            {/* Integrated Industrial Search */}
                            <div className="relative group max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur opacity-25 group-focus-within:opacity-50 transition-opacity" />
                                <div className="relative bg-[#0B1120]/80 backdrop-blur-2xl border border-white/10 rounded-full flex items-center p-1 px-2 shadow-2xl">
                                    <div className="pl-5 pr-3">
                                        <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                                    </div>
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search parts (SKU, Name, Category)..."
                                        className="bg-transparent border-none h-14 text-white placeholder:text-zinc-600 focus-visible:ring-0 text-base"
                                    />
                                    <Button className="rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold h-12 px-8 shadow-lg shadow-cyan-900/40">
                                        Find Parts
                                    </Button>
                                </div>
                            </div>

                            {/* Category Quick-Filters */}
                            <div className="flex flex-wrap items-center gap-2 mt-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mr-2">Top Groups:</span>
                                {CATEGORIES.slice(1, 5).map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all border ${selectedCategory === cat.id
                                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                            : 'bg-white/5 border-white/5 text-zinc-500 hover:text-white hover:border-white/10 hover:bg-white/[0.08]'
                                            }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: 3D Visualization & Blueprint Overlay */}
                        <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end animate-in fade-in zoom-in duration-1000">
                            <div className="relative w-full aspect-square max-w-[500px]">
                                {/* Blueprint technical lines overlay (CSS generated) */}
                                <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/20 border-dashed border-b border-cyan-500/10 flex justify-between items-center px-4">
                                    <div className="w-2 h-2 rounded-full bg-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                                    <span className="text-[8px] font-mono text-cyan-500/50 bg-[#020617] px-2">X-AXIS TOLERANCE: ±0.01MM</span>
                                    <div className="w-2 h-2 rounded-full bg-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                                </div>
                                <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-500/20 border-dashed border-r border-cyan-500/10 flex flex-col justify-between items-center py-4">
                                    <div className="w-2 h-2 rounded-full bg-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                                    <span className="text-[8px] font-mono text-cyan-500/50 bg-[#020617] px-2 [writing-mode:vertical-lr] rotate-180">ALIGNMENT DATUM</span>
                                    <div className="w-2 h-2 rounded-full bg-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                                </div>

                                {/* Floating 3D Render Image */}
                                <div className="relative z-10 w-full h-full p-12 animate-float">
                                    <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 backdrop-blur-3xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(6,182,212,0.15)] flex items-center justify-center">
                                         <img 
                                            src="/hero-industrial.png"
                                            alt="Mechanical Components Cluster"
                                            className="w-full h-full object-cover scale-110 opacity-70 mix-blend-lighten grayscale hover:grayscale-0 transition-all duration-700"
                                        />
                                        {/* HUD Elements */}
                                        <div className="absolute top-12 left-12 w-16 h-16 border-t-2 border-l-2 border-cyan-500/40" />
                                        <div className="absolute bottom-12 right-12 w-16 h-16 border-b-2 border-r-2 border-cyan-500/40" />
                                    </div>
                                </div>

                                {/* Live Stats Card - Overlapping bottom right */}
                                <div className="absolute -bottom-6 -right-6 lg:right-6 bg-[#0B1120]/90 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-2xl z-20 max-w-[240px] animate-in slide-in-from-bottom-8 duration-700">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                                                <Boxes className="w-5 h-5 text-cyan-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Available Parts</p>
                                                <p className="text-sm font-bold text-white">15,000+ SKUs</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                                <Truck className="w-5 h-5 text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Global Dispatch</p>
                                                <p className="text-sm font-bold text-white">24-48 Hours</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                                <Store className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Trusted By</p>
                                                <p className="text-sm font-bold text-white">120+ Eng. Teams</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-[9px] font-bold text-emerald-500 uppercase flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Status
                                        </span>
                                        <span className="text-[9px] font-mono text-zinc-600">ID: 9002-SRV</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Product Grid */}
            <section className="py-12 min-h-[600px]">
                <div className="container mx-auto px-4">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse border border-white/5" />
                            ))}
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                            {filteredProducts.map(product => {
                                const isComparing = compareList.find(p => p.id === product.id);
                                return (
                                    <div
                                        key={product.id}
                                        className="group relative"
                                        onMouseEnter={() => setHoveredProduct(product.id)}
                                        onMouseLeave={() => setHoveredProduct(null)}
                                    >
                                        <Card className="h-full bg-[#0B1120] border-white/[0.06] overflow-hidden hover:border-cyan-500/30 hover:shadow-[0_0_40px_rgba(6,182,212,0.1)] transition-all duration-500 rounded-2xl flex flex-col">
                                            {/* Top Section: Image */}
                                            <div className="relative aspect-square bg-white flex items-center justify-center p-8 overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                <div className="relative w-full h-full flex items-center justify-center transform group-hover:scale-105 transition-transform duration-700">
                                                    <Image
                                                        src="/images/placeholder-part.svg" // Replace with real product image if available
                                                        alt={product.name}
                                                        width={160}
                                                        height={160}
                                                        className="object-contain opacity-80"
                                                        onError={(e: any) => {
                                                            e.target.src = "https://cdn-icons-png.flaticon.com/512/822/822102.png";
                                                        }}
                                                    />
                                                </div>

                                                {/* Category Tag */}
                                                <Badge className="absolute top-3 left-3 bg-[#020617] text-cyan-400 border border-cyan-500/20 text-[9px] font-bold tracking-[0.2em] font-mono px-2 py-0.5">
                                                    {product.categoryId.toUpperCase()}
                                                </Badge>

                                                {/* Status Indicator */}
                                                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span className="text-[9px] font-bold text-emerald-500 uppercase">In Stock</span>
                                                </div>

                                                {/* Quick Specs Overlay */}
                                                <div className={`absolute inset-x-0 bottom-0 bg-[#0B1120]/95 backdrop-blur-md p-4 border-t border-white/10 transition-all duration-300 transform ${hoveredProduct === product.id ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                                                    <div className="grid grid-cols-2 gap-y-2">
                                                        <div>
                                                            <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">SKU</div>
                                                            <div className="text-[11px] text-white font-medium">{product.sku}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">Inventory</div>
                                                            <div className="text-[11px] text-white font-medium">{product.inventory} Units</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">Category</div>
                                                            <div className="text-[11px] text-emerald-400 font-bold uppercase tracking-tighter">{product.categoryId}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">Bulk Rate</div>
                                                            <div className="text-[11px] text-cyan-400 font-bold font-mono">₹{Math.floor(product.salePrice * 0.85)}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Compare Toggle */}
                                                <button
                                                    onClick={() => toggleCompare(product)}
                                                    className={`absolute bottom-3 left-3 p-2 rounded-lg border transition-all ${isComparing
                                                        ? 'bg-cyan-500 border-cyan-400 text-white scale-110'
                                                        : 'bg-black/20 border-white/10 text-white/50 hover:text-white hover:bg-black/40'
                                                        }`}
                                                >
                                                    <Scale className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            <CardHeader className="p-4 pt-5 pb-1 flex-grow">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-1.5 rounded uppercase">{product.sku}</span>
                                                    {product.inventory < 20 && <span className="text-[9px] text-orange-400 font-bold uppercase tracking-wider">🔥 Low Stock</span>}
                                                </div>
                                                <CardTitle className="text-sm font-bold leading-tight group-hover:text-cyan-400 transition-colors line-clamp-2">{product.name}</CardTitle>
                                                <p className="text-[11px] text-zinc-400 mt-2 font-mono flex items-center gap-2">
                                                    <History className="w-3 h-3 text-emerald-500/60" /> {product.specs}
                                                </p>
                                            </CardHeader>

                                            <CardContent className="p-4 pt-2">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-zinc-500 line-through">MRP: ₹{product.basePrice.toLocaleString()}</span>
                                                        <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400 bg-emerald-500/5 px-1.5 py-0 h-4">
                                                            SAVE ₹{(product.basePrice - product.salePrice).toLocaleString()}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-baseline gap-2">
                                                        <div className="text-xl font-bold font-mono text-white">₹{product.salePrice.toLocaleString()}</div>
                                                        <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-tight">Per PC</span>
                                                    </div>
                                                    <div className="text-[10px] text-emerald-500 uppercase font-bold tracking-wider mt-1">Bulk Pricing Available</div>
                                                </div>
                                            </CardContent>

                                            <CardFooter className="p-4 pt-0 flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 bg-transparent border-white/10 hover:bg-white/5 hover:text-white rounded-xl h-10 text-[11px] font-bold uppercase transition-all"
                                                    asChild
                                                >
                                                    <Link href={`/shop/${product.id}`}>Specs</Link>
                                                </Button>
                                                <Button
                                                    className="flex-[2] bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl h-10 text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-cyan-900/20 active:scale-[0.98] transition-all"
                                                    onClick={() => addItem({
                                                        id: product.id,
                                                        name: product.name,
                                                        salePrice: product.salePrice,
                                                        basePrice: product.basePrice,
                                                        sku: product.sku,
                                                        quantity: 1
                                                    })}
                                                >
                                                    Add to Cart
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-32 border border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
                            <Package className="w-12 h-12 text-zinc-700 mx-auto mb-6 opacity-30" />
                            <h3 className="text-xl font-bold mb-2">No components found</h3>
                            <p className="text-zinc-500 text-sm max-w-xs mx-auto">Try adjusting your filters or search query to find the parts you need.</p>
                            <Button
                                variant="ghost"
                                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                                className="mt-8 text-cyan-400 hover:text-cyan-300"
                            >
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* 5. Engineer Trust Section */}
            <section className="py-20 bg-[#040f25]/30 border-y border-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold opacity-80 uppercase tracking-widest font-mono">Why Engineers Choose MechHub</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {[
                            { icon: Settings, title: "Precision Manufacturing", desc: "ABEC-5 or higher tolerances" },
                            { icon: Truck, title: "Express Dispatch", desc: "24-48 Hours guaranteed" },
                            { icon: BarChart3, title: "Bulk Discounts", desc: "Pricing scales with volume" },
                            { icon: ShieldCheck, title: "Verified Suppliers", desc: "Full traceability reports" }
                        ].map((item, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-[#0B1120] border border-white/5 hover:border-cyan-500/20 transition-all group hover:-translate-y-1">
                                <item.icon className="w-8 h-8 text-cyan-500 mb-4 group-hover:scale-110 transition-transform" />
                                <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                                <p className="text-[11px] text-zinc-500 leading-relaxed uppercase font-bold tracking-tighter opacity-70">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Floating Comparison & Cart Bar */}
            <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
                {/* Comparison Bar */}
                {compareList.length > 0 && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                className="h-14 px-6 bg-[#0B1120] border border-cyan-500/30 text-white rounded-2xl shadow-2xl gap-3 animate-in fade-in slide-in-from-right-10"
                            >
                                <Scale className="w-5 h-5 text-cyan-400" />
                                <span className="font-bold">Compare ({compareList.length})</span>
                                <div className="flex -space-x-2">
                                    {compareList.map((p, i) => (
                                        <div key={i} className="w-6 h-6 rounded-full bg-white border border-[#0B1120] flex items-center justify-center overflow-hidden">
                                            <Package className="w-3 h-3 text-[#0B1120]" />
                                        </div>
                                    ))}
                                </div>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl bg-[#0B1120] border-white/10 text-white p-0 overflow-hidden">
                            <DialogHeader className="p-6 border-b border-white/5">
                                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                    <Scale className="w-5 h-5 text-cyan-400" /> Component Comparison
                                </DialogTitle>
                            </DialogHeader>
                            <div className="p-8 space-y-0">
                                {/* Header Row */}
                                <div className="grid grid-cols-4 gap-8 pb-10 border-b border-white/10 items-end">
                                    <div /> {/* Empty space for labels column */}
                                    {compareList.map(p => (
                                        <div key={p.id} className="text-center group">
                                            <div className="w-20 h-20 mx-auto rounded-2xl bg-white mb-5 flex items-center justify-center text-[#0B1120] shadow-xl group-hover:scale-110 transition-transform">
                                                <Package className="w-10 h-10" />
                                            </div>
                                            <div className="text-[12px] font-bold line-clamp-2 h-10 flex items-center justify-center px-2 text-white">
                                                {p.name}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleCompare(p)}
                                                className="text-[10px] text-red-500 hover:text-red-400 hover:bg-red-500/10 mt-2 h-7 px-2 font-bold uppercase tracking-tight"
                                            >
                                                <X className="w-3 h-3 mr-1" /> Remove
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {/* Comparison Rows */}
                                {[
                                    { label: 'SKU Code', value: (p: any) => p.sku, style: 'font-mono text-zinc-400' },
                                    { label: 'Technical Specs', value: (p: any) => p.specs, style: 'text-zinc-300 leading-tight' },
                                    { label: 'Stock Status', value: (p: any) => p.inventory, suffix: ' UNITS', style: 'text-emerald-500 font-bold' },
                                    { label: 'Category', value: (p: any) => p.categoryId, style: 'text-zinc-500 uppercase tracking-tighter' },
                                    { label: 'Unit Price', value: (p: any) => `₹${p.salePrice.toLocaleString()}`, style: 'text-xl font-bold text-cyan-400 font-mono' }
                                ].map((row, idx) => (
                                    <div key={idx} className="grid grid-cols-4 gap-8 py-6 border-b border-white/[0.04] items-center hover:bg-white/[0.01] transition-colors">
                                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] pl-2">
                                            {row.label}
                                        </div>
                                        {compareList.map(p => (
                                            <div key={p.id} className={`text-center text-[13px] font-medium ${row.style}`}>
                                                {row.value(p)}{row.suffix}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

                {/* Floating Cart Indicator */}

            </div>
            <Footer />
        </div >
    );
}
