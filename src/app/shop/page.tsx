'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { LandingNav } from '@/components/LandingNav';
import { Footer } from '@/components/Footer';
import Fuse from 'fuse.js';
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
  History,
  ChevronLeft,
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
} from '@/components/ui/dialog';
import Image from 'next/image';
import { ShopHeroCanvas } from '@/components/ShopHeroCanvas';
import { ProductCard } from '@/components/ProductCard';

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
  diameter: ['8mm', '12mm', '15mm', '20mm'],
};

export default function ShopPage() {
  const db = useFirestore();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('Popular');
  const { addItem, totalItems } = useCart();
  const [compareList, setCompareList] = useState<any[]>([]);

  const productsRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'products');
  }, [db]);

  const { data: products, isLoading, error } = useCollection(productsRef);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let result = products.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
      return matchesCategory && p.isActive !== false;
    });

    if (debouncedSearchQuery) {
      const fuse = new Fuse(result, {
        keys: ['name', 'sku', 'specs'],
        threshold: 0.35,
      });
      result = fuse.search(debouncedSearchQuery).map((r) => r.item);
    }

    // Basic sorting
    const sortedResult = [...result];
    if (sortBy === 'Price: Low to High') sortedResult.sort((a, b) => a.salePrice - b.salePrice);
    if (sortBy === 'Price: High to Low') sortedResult.sort((a, b) => b.salePrice - a.salePrice);

    return sortedResult;
  }, [products, debouncedSearchQuery, selectedCategory, sortBy]);

  const toggleCompare = (product: any) => {
    setCompareList((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      if (prev.length >= 3) return prev;
      return [...prev, product];
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-500/30">
      <LandingNav />

      {/* 1. Hero Section (Industrial-Grade Redesign) */}
      <div className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-[#F8FAFC]">
        {/* Visual Elements: Blueprint Grid & Background Glow */}
        <div className="blueprint-grid opacity-[0.03] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#2F5FA7] transition-all group"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* LEFT: Messaging & Industrial Search */}
            <div className="lg:col-span-7 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-100 mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
                <Settings className="w-3 h-3 text-[#2F5FA7]" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#2F5FA7]">
                  Industrial Grade Components
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-[80px] font-bold mb-8 tracking-tighter leading-[1] text-slate-900 animate-in fade-in slide-in-from-left-6 duration-700">
                Reliable <span className="text-[#2F5FA7]">Mechanical</span> <br />
                Parts Registry.
              </h1>

              <p className="text-slate-500 text-base md:text-xl font-medium mb-10 md:mb-12 leading-relaxed max-w-lg animate-in fade-in slide-in-from-left-8 duration-1000">
                Precision hardware for engineering scale. Verified tolerances, transparent bulk
                pricing, and rapid global procurement.
              </p>

              {/* Integrated Industrial Search - Premium Pill */}
              <div className="relative group max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-1000 mb-10">
                <div className="relative bg-white border border-slate-200 rounded-[28px] flex flex-col md:flex-row items-stretch md:items-center p-1.5 shadow-[0_15px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all">
                  <div className="flex items-center flex-1">
                    <div className="pl-5 pr-3">
                      <Search className="w-5 h-5 text-slate-300 group-focus-within:text-[#2F5FA7] transition-colors" />
                    </div>
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search parts (SKU, Name)..."
                      className="bg-transparent border-none h-14 md:h-16 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 text-sm md:text-base flex-1 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Category Quick-Filters */}
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0 hidden sm:block">
                  Top Groups:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
                  {CATEGORIES.slice(1, 6).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border shrink-0 ${
                        selectedCategory === cat.id
                          ? 'bg-[#2F5FA7] text-white border-[#2F5FA7] shadow-lg shadow-blue-500/20'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-[#2F5FA7] hover:text-[#2F5FA7]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Circular Visualization & Stats overlay */}
            <div className="hidden lg:flex lg:col-span-5 relative items-center justify-center animate-in fade-in zoom-in duration-1000">
              <div className="relative w-full aspect-square max-w-[480px]">
                {/* The Technical Circle */}
                <div className="absolute inset-0 rounded-full border border-blue-500/10 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-[0.5px] border-dashed border-blue-500/20 scale-90" />
                  <div className="absolute inset-x-0 h-px bg-blue-500/10 top-1/2 -translate-y-1/2" />
                  <div className="absolute inset-y-0 w-px bg-blue-500/10 left-1/2 -translate-x-1/2" />

                  {/* Crosshair Dots */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                  <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                  <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500/40" />

                  {/* 3D Illustration Container */}
                  <div className="relative w-[340px] h-[340px] rounded-full bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 p-4">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent" />
                    <img
                      src="/hero-industrial.png"
                      alt="Mechanical Components"
                      className="w-full h-full object-contain scale-125 opacity-90 drop-shadow-2xl hover:scale-150 transition-transform duration-1000 ease-out"
                    />
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
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-[28px]">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] rounded-2xl bg-white/5 animate-pulse border border-white/5"
                />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-[28px]">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isComparing={!!compareList.find((p) => p.id === product.id)}
                  toggleCompare={toggleCompare}
                  addItem={addItem}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 border border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
              <Package className="w-12 h-12 text-zinc-700 mx-auto mb-6 opacity-30" />
              <h3 className="text-xl font-bold mb-2">No components found</h3>
              <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                Try adjusting your filters or search query to find the parts you need.
              </p>
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-8 text-cyan-400 hover:text-cyan-300"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* 5. Engineer Trust Section */}
      <section className="py-20 bg-blue-50/30 border-y border-blue-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-400 uppercase tracking-widest font-mono">
              Why Engineers Choose MechHub
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              {
                icon: Settings,
                title: 'Precision Manufacturing',
                desc: 'ABEC-5 or higher tolerances',
              },
              { icon: Truck, title: 'Express Dispatch', desc: '24-48 Hours guaranteed' },
              { icon: BarChart3, title: 'Bulk Discounts', desc: 'Pricing scales with volume' },
              { icon: ShieldCheck, title: 'Verified Suppliers', desc: 'Full traceability reports' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-blue-50 hover:border-blue-200 transition-all group hover:-translate-y-1 shadow-sm hover:shadow-md"
              >
                <item.icon className="w-8 h-8 text-[#2F5FA7] mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-sm text-slate-800 mb-1">{item.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed uppercase font-bold tracking-tighter">
                  {item.desc}
                </p>
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
              <Button className="h-14 px-6 bg-[#0B1120] border border-cyan-500/30 text-white rounded-2xl shadow-2xl gap-3 animate-in fade-in slide-in-from-right-10">
                <Scale className="w-5 h-5 text-cyan-400" />
                <span className="font-bold">Compare ({compareList.length})</span>
                <div className="flex -space-x-2">
                  {compareList.map((p, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-white border border-[#0B1120] flex items-center justify-center overflow-hidden"
                    >
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
              <div className="p-0 sm:p-8 space-y-0 overflow-x-auto no-scrollbar">
                {/* Header Row */}
                <div className="grid grid-cols-[120px_repeat(3,240px)] sm:grid-cols-4 gap-4 sm:gap-8 pb-10 border-b border-white/10 items-end min-w-max sm:min-w-0 px-6 sm:px-0 pt-6 sm:pt-0">
                  <div /> {/* Empty space for labels column */}
                  {compareList.map((p) => (
                    <div key={p.id} className="text-center group">
                      <div className="w-20 h-20 mx-auto rounded-2xl bg-white mb-5 flex items-center justify-center text-[#0B1120] shadow-xl group-hover:scale-110 transition-transform relative overflow-hidden p-2">
                        <Image
                          src={
                            p.images?.length > 0
                              ? typeof p.images[0] === 'string'
                                ? p.images[0]
                                : p.images[0].urls.thumb
                              : '/images/placeholder-part.svg'
                          }
                          alt={p.name}
                          fill
                          className="object-contain p-1"
                          onError={(e: any) => {
                            e.target.src = '/mechhub.png';
                          }}
                        />
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
                  {
                    label: 'Technical Specs',
                    value: (p: any) => p.specs,
                    style: 'text-zinc-300 leading-tight',
                  },
                  {
                    label: 'Stock Status',
                    value: (p: any) => p.inventory,
                    suffix: ' UNITS',
                    style: 'text-emerald-500 font-bold',
                  },
                  {
                    label: 'Category',
                    value: (p: any) => p.categoryId,
                    style: 'text-zinc-500 uppercase tracking-tighter',
                  },
                  {
                    label: 'Unit Price',
                    value: (p: any) => `₹${p.salePrice.toLocaleString()}`,
                    style: 'text-xl font-bold text-cyan-400 font-mono',
                  },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[120px_repeat(3,240px)] sm:grid-cols-4 gap-4 sm:gap-8 py-6 border-b border-white/[0.04] items-center hover:bg-white/[0.01] transition-colors min-w-max sm:min-w-0 px-6 sm:px-0"
                  >
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                      {row.label}
                    </div>
                    {compareList.map((p) => (
                      <div
                        key={p.id}
                        className={`text-center text-[13px] font-medium ${row.style}`}
                      >
                        {row.value(p)}
                        {row.suffix}
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
    </div>
  );
}
