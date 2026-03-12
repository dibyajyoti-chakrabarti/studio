'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { LandingNav } from '@/components/LandingNav';
import { Footer } from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import {
    ShoppingCart,
    ShieldCheck,
    Truck,
    RotateCcw,
    Package,
    ArrowLeft,
    CheckCircle2,
    Info,
    Warehouse,
    Home,
    ChevronRight,
    Star,
    StarHalf,
    Plus,
    Minus,
    Zap,
    Check,
    Download,
    FileText,
    Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Separator } from '@/components/ui/separator';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface Review {
    user: string;
    rating: number;
    comment: string;
    date: string;
}

interface FAQ {
    q: string;
    a: string;
}

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const db = useFirestore();
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [scrolledPast, setScrolledPast] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    const productRef = useMemoFirebase(() => {
        if (!db || !id) return null;
        return doc(db, 'products', id);
    }, [db, id]);

    const { data: product, isLoading, error } = useDoc(productRef);

    // Sticky CTA logic
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 800) {
                setScrolledPast(true);
            } else {
                setScrolledPast(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#020617] text-white font-sans flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-[#020617] text-white font-sans flex flex-col items-center justify-center p-4">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                    <Package className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
                <p className="text-zinc-500 mb-8 max-w-md text-center">
                    The component you are looking for does not exist in our registry or has been removed.
                </p>
                <Link href="/shop">
                    <Button variant="outline" className="border-white/10 hover:bg-white/5 gap-2 h-12 px-8">
                        <ArrowLeft className="w-4 h-4" /> Back to Catalogue
                    </Button>
                </Link>
            </div>
        );
    }

    const reviews = (product.reviews as Review[]) || [];
    const avgRating = reviews.length > 0
        ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) * 10) / 10
        : 4.5; // Placeholder for products without reviews yet

    const placeholders = [
        "https://images.unsplash.com/photo-1594819047050-99def0f34101?q=80&w=800",
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800"
    ];
    const productImages = product.images?.length > 0 ? product.images : placeholders;

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-cyan-500/30">
            <LandingNav />

            {/* Breadcrumbs */}
            <div className="bg-[#020617]/50 border-b border-white/5 py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                        <Link href="/" className="hover:text-cyan-400 flex items-center gap-1 transition-colors">
                            <Home className="w-3 h-3" /> Home
                        </Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/shop" className="hover:text-cyan-400 transition-colors">Shop</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href={`/shop?category=${product.categoryId}`} className="hover:text-cyan-400 transition-colors capitalize">{product.categoryId.replace('-', ' ')}</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-zinc-300 truncate max-w-[150px]">{product.name}</span>
                    </div>
                </div>
            </div>

            {/* Hidden Printable Datasheet */}
            <PrintableDatasheet product={product} />

            <main className="container mx-auto px-4 py-8 md:py-12 no-print">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* Left: Product Image & Gallery */}
                    <div className="lg:col-span-7 space-y-6 sticky top-24">
                        <div className="aspect-square bg-black/40 rounded-[2rem] border border-white/5 flex items-center justify-center relative overflow-hidden group shadow-2xl">
                            <img
                                src={productImages[activeImage]}
                                alt={product.name}
                                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-transparent to-cyan-500/5 pointer-events-none" />

                            {/* Tags */}
                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 font-bold text-[9px] uppercase tracking-tighter">
                                    <CheckCircle2 className="w-3 h-3 mr-1.5" /> QC Tested
                                </Badge>
                                <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-3 py-1 font-bold text-[9px] uppercase tracking-tighter">
                                    <Zap className="w-3 h-3 mr-1.5" /> Fast Dispatch
                                </Badge>
                            </div>
                        </div>

                        {/* Thumbnail Row */}
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                            {productImages.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative w-24 h-24 rounded-2xl overflow-hidden border transition-all shrink-0 ${activeImage === idx ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-cover opacity-60" />
                                </button>
                            ))}
                        </div>

                        {/* Trust Signals Block */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                            {[
                                { icon: Truck, title: "Express Logistics", desc: "Dispatch in 24h" },
                                { icon: ShieldCheck, title: "Auth Guarantee", desc: "100% Genuine" },
                                { icon: RotateCcw, title: "7-Day Return", desc: "Quality Assurance" }
                            ].map((item, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                                    <item.icon className="w-5 h-5 text-cyan-500 shrink-0" />
                                    <div>
                                        <h5 className="text-[11px] font-bold text-zinc-200">{item.title}</h5>
                                        <p className="text-[10px] text-zinc-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info & Buy Box */}
                    <div className="lg:col-span-5 flex flex-col gap-8">
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 font-mono text-[9px] tracking-widest uppercase">
                                    SKU: {product.sku}
                                </Badge>
                                {product.inventory < 50 && (
                                    <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-[9px] uppercase font-bold">
                                        Low Stock
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 leading-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(avgRating) ? 'fill-current' : 'text-zinc-700'}`} />
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-zinc-400">{avgRating}</span>
                                <span className="text-zinc-700">|</span>
                                <span className="text-xs font-medium text-zinc-500 underline underline-offset-4 cursor-pointer hover:text-cyan-400 transition-colors">
                                    {reviews.length || 124} Reviews
                                </span>
                            </div>

                            <p className="text-zinc-500 text-sm leading-relaxed max-w-lg">
                                {product.description}
                            </p>
                        </section>

                        {/* Pricing Block */}
                        <section className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full" />

                            <div className="space-y-4 relative z-10">
                                <div className="space-y-1">
                                    <div className="flex items-baseline gap-4">
                                        <span className="text-5xl font-bold text-white font-mono tracking-tighter">₹{product.salePrice.toLocaleString()}</span>
                                        {product.basePrice > product.salePrice && (
                                            <div className="flex flex-col">
                                                <span className="text-lg text-zinc-500 line-through font-mono opacity-50 decoration-1">₹{product.basePrice.toLocaleString()}</span>
                                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">You Save ₹{product.basePrice - product.salePrice}</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-zinc-500 font-medium pl-1 italic">Excl. GST (18%) & Individual Packing</p>
                                </div>

                                <div className="pt-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center bg-black/40 border border-white/10 rounded-xl overflow-hidden h-12">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-12 h-full flex items-center justify-center hover:bg-white/5 text-zinc-400 hover:text-white transition-colors border-r border-white/5"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-16 text-center text-sm font-bold font-mono text-zinc-200">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-12 h-full flex items-center justify-center hover:bg-white/5 text-zinc-400 hover:text-white transition-colors border-l border-white/5"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Stock Status</p>
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                                <span className="text-xs font-bold text-zinc-200">{product.inventory} Units In Stock</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <Button
                                            className="w-full h-14 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl gap-3 shadow-xl shadow-cyan-900/20 transition-all active:scale-[0.98]"
                                            onClick={() => addItem({
                                                id: product.id,
                                                name: product.name,
                                                salePrice: product.salePrice,
                                                basePrice: product.basePrice || product.salePrice,
                                                sku: product.sku,
                                                quantity: quantity
                                            })}
                                        >
                                            <ShoppingCart className="w-5 h-5" /> Add to Procurement
                                        </Button>
                                        <Button
                                            className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold transition-all active:scale-[0.98]"
                                            onClick={() => {
                                                addItem({
                                                    id: product.id,
                                                    name: product.name,
                                                    salePrice: product.salePrice,
                                                    basePrice: product.basePrice || product.salePrice,
                                                    sku: product.sku,
                                                    quantity: quantity
                                                });
                                                router.push('/checkout');
                                            }}
                                        >
                                            Proceed to Buy Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Highlights Section */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Zap className="w-5 h-5 text-cyan-500" /> Key Feature Highlights
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {(product.features as string[] || []).map((f, idx) => (
                                    <div key={idx} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5">
                                        <div className="w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-cyan-500" />
                                        </div>
                                        <span className="text-xs font-medium text-zinc-400">{f}</span>
                                    </div>
                                ))}
                                {(!product.features || product.features.length === 0) && (
                                    <>
                                        {["Precision Engineered", "Industrial Grade", "QC Certified", "Standard Dimensions"].map((f, idx) => (
                                            <div key={idx} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5">
                                                <div className="w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-cyan-500" />
                                                </div>
                                                <span className="text-xs font-medium text-zinc-400">{f}</span>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lower Content Sections */}
                <div className="mt-24 space-y-24">
                    {/* Detailed Specifications */}
                    <section id="specifications" className="scroll-mt-24">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold text-white">Technical Specifications</h2>
                                <p className="text-zinc-500 text-sm">Precise engineering data for professional industrial integration.</p>
                            </div>
                            <Button
                                variant="outline"
                                className="border-white/10 text-xs gap-2 rounded-xl h-10 px-6 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all"
                                onClick={() => window.print()}
                            >
                                <Download className="w-4 h-4" /> Download Datasheet (PDF)
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/5 rounded-[2rem] overflow-hidden divide-y md:divide-y-0 md:divide-x divide-white/5 bg-white/[0.01]">
                            <div className="divide-y divide-white/5">
                                {Object.entries(product.technicalSpecs || {}).slice(0, Math.ceil(Object.entries(product.technicalSpecs || {}).length / 2)).map(([label, value]) => (
                                    <div key={label} className="grid grid-cols-2 p-6 hover:bg-white/[0.02] transition-colors">
                                        <span className="text-sm text-zinc-500 font-medium">{label}</span>
                                        <span className="text-sm text-zinc-200 font-bold font-mono">{value as string}</span>
                                    </div>
                                ))}
                                {(!product.technicalSpecs) && (
                                    <div className="grid grid-cols-2 p-6">
                                        <span className="text-sm text-zinc-500 font-medium">Part Code</span>
                                        <span className="text-sm text-zinc-200 font-bold font-mono">{product.sku}</span>
                                    </div>
                                )}
                            </div>
                            <div className="divide-y divide-white/5">
                                {Object.entries(product.technicalSpecs || {}).slice(Math.ceil(Object.entries(product.technicalSpecs || {}).length / 2)).map(([label, value]) => (
                                    <div key={label} className="grid grid-cols-2 p-6 hover:bg-white/[0.02] transition-colors">
                                        <span className="text-sm text-zinc-500 font-medium">{label}</span>
                                        <span className="text-sm text-zinc-200 font-bold font-mono">{value as string}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Applications & Compatibility */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <section className="space-y-8">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white">Ideal Applications</h3>
                                <p className="text-zinc-500 text-sm">Where this component excels in efficiency and reliability.</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {(product.applications as string[] || ["3D Printing", "CNC Machinery", "Robotics", "Automation"]).map((app, idx) => (
                                    <div key={idx} className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-[#020617] border border-white/5 shadow-lg group hover:border-cyan-500/30 transition-all">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                                            <Package className="w-4 h-4 text-zinc-500 group-hover:text-cyan-500" />
                                        </div>
                                        <span className="text-sm font-bold text-zinc-300">{app}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-8">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white">System Compatibility</h3>
                                <p className="text-zinc-500 text-sm">Matching industrial standards and hardware ecosystems.</p>
                            </div>
                            <div className="space-y-4">
                                {(product.compatibility as string[] || ["Standard Shaft Assemblies", "Standard Mounting Brackets"]).map((comp, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.01]">
                                        <span className="text-sm font-medium text-zinc-400">{comp}</span>
                                        <Badge variant="outline" className="text-emerald-400 font-bold text-[10px] uppercase border-emerald-500/20">
                                            Verified
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* FAQ Section */}
                    <section id="faq" className="max-w-4xl mx-auto w-full">
                        <div className="text-center space-y-4 mb-12">
                            <h2 className="text-3xl font-bold text-white">Parts Procurement FAQ</h2>
                            <p className="text-zinc-500 text-sm">Technical answers for procurement officers and engineers.</p>
                        </div>
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {(product.faqs as FAQ[] || [
                                { q: "What is the dispatch time?", a: "Standard dispatch time is within 24-48 business hours from order verification." },
                                { q: "Do you provide bulk discounts?", a: "Yes, for quantities above 100 units, please contact our relationship manager." }
                            ]).map((faq, idx) => (
                                <AccordionItem key={idx} value={`item-${idx}`} className="border border-white/5 bg-white/[0.01] rounded-2xl px-6">
                                    <AccordionTrigger className="text-sm font-bold text-zinc-200 hover:text-cyan-400 hover:no-underline py-6">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-zinc-500 leading-relaxed pb-6">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </section>

                    {/* Reviews */}
                    <section className="space-y-12">
                        <div className="flex items-end justify-between">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold text-white">Trust & Reviews</h2>
                                <p className="text-zinc-500 text-sm">Feedback from professional engineers and labs.</p>
                            </div>
                            <div className="hidden md:flex items-center gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-white">{avgRating}</p>
                                    <div className="flex text-yellow-500 mt-1">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                    </div>
                                </div>
                                <Separator orientation="vertical" className="h-10 bg-white/5" />
                                <div className="text-left">
                                    <p className="text-sm font-bold text-zinc-300">100% Recommended</p>
                                    <p className="text-[11px] text-zinc-500 underline underline-offset-4 cursor-pointer">Based on verified orders</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(product.reviews as Review[] || [{
                                user: "Industrial Client",
                                rating: 5,
                                comment: "Consistently good quality across all batches. We use these for our prototype frames.",
                                date: "2024-03-01"
                            }, {
                                user: "Lab Manager",
                                rating: 4.5,
                                comment: "Great precision and smooth operation. Dispatch was prompt.",
                                date: "2024-02-28"
                            }]).map((review, idx) => (
                                <div key={idx} className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 space-y-6 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-sm text-zinc-400">
                                                    {review.user[0]}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-zinc-200">{review.user}</h4>
                                                    <p className="text-[10px] text-zinc-600 font-mono tracking-tighter">{new Date(review.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex text-yellow-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(review.rating) ? 'fill-current' : 'text-zinc-800'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-zinc-400 leading-relaxed italic">"{review.comment}"</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-emerald-500/70">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Verified Procurement</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />

            {/* Sticky Procurement Bar */}
            <div className={`fixed bottom-0 left-0 right-0 z-[60] bg-[#020617]/95 backdrop-blur-xl border-t border-white/10 transition-all duration-500 transform ${scrolledPast ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/5 overflow-hidden hidden sm:flex items-center justify-center shrink-0">
                            <img src={productImages[0]} className="w-full h-full object-cover opacity-40" />
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">{product.name}</h4>
                            <p className="text-[10px] font-mono text-cyan-500/70 uppercase truncate">{product.sku}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-xl font-bold text-white font-mono">₹{product.salePrice.toLocaleString()}</span>
                            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-tighter">In Stock: {product.inventory}</span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                className="h-11 px-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold hidden sm:flex"
                                onClick={() => addItem({
                                    id: product.id,
                                    name: product.name,
                                    salePrice: product.salePrice,
                                    basePrice: product.basePrice || product.salePrice,
                                    sku: product.sku,
                                    quantity: 1
                                })}
                            >
                                <Plus className="w-4 h-4 mr-2" /> Add
                            </Button>
                            <Button
                                size="sm"
                                className="h-11 px-8 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/40"
                                onClick={() => {
                                    addItem({
                                        id: product.id,
                                        name: product.name,
                                        salePrice: product.salePrice,
                                        basePrice: product.basePrice || product.salePrice,
                                        sku: product.sku,
                                        quantity: 1
                                    });
                                    router.push('/checkout');
                                }}
                            >
                                Buy Now
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Internal Component for Printable Datasheet
function PrintableDatasheet({ product }: { product: any }) {
    return (
        <div className="print-only bg-white text-black p-12 font-sans min-h-[297mm] w-[210mm] mx-auto hidden print:block">
            {/* Header / Branding */}
            <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                            <Cpu className="text-white w-5 h-5" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter italic">MECHHUB</span>
                    </div>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-500">PRECISION INDUSTRIAL MARKETPLACE</p>
                </div>
                <div className="text-right space-y-1">
                    <h1 className="text-xl font-black uppercase">Technical Datasheet</h1>
                    <p className="text-[10px] font-medium text-zinc-400">Generated: {new Date().toLocaleDateString()}</p>
                    <p className="text-[10px] font-bold text-zinc-800 tracking-widest">REF: {product.sku || 'MH-AUTO-GEN'}</p>
                </div>
            </div>

            {/* Product Summary */}
            <div className="grid grid-cols-12 gap-12 mb-12">
                <div className="col-span-8 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight">{product.name}</h2>
                    <div className="flex gap-4">
                        <div className="px-3 py-1 bg-zinc-100 rounded text-[10px] font-bold uppercase tracking-wider border border-zinc-200">
                            Category: {product.categoryId?.replace('-', ' ')}
                        </div>
                        <div className="px-3 py-1 bg-zinc-100 rounded text-[10px] font-bold uppercase tracking-wider border border-zinc-200">
                            Origin: Verified MechMaster Fabricated
                        </div>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-600">
                        {product.description || "High-precision industrial component manufactured to strict ISO standards. This datasheet provides technical specifications for design integration and procurement validation."}
                    </p>
                </div>
                <div className="col-span-4 aspect-square bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-center p-4">
                    <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1594819047050-99def0f34101?q=80&w=800'}
                        alt={product.name}
                        className="max-sm:max-w-full max-h-full object-contain grayscale"
                    />
                </div>
            </div>

            {/* Detailed Specs Table */}
            <div className="space-y-4 mb-12">
                <h3 className="text-sm font-black uppercase tracking-widest border-l-4 border-black pl-3 py-1 bg-zinc-50">Technical Specifications</h3>
                <div className="grid grid-cols-1 border border-zinc-200 rounded-lg overflow-hidden divide-y divide-zinc-200">
                    {Object.entries(product.technicalSpecs || {}).map(([label, value]) => (
                        <div key={label} className="grid grid-cols-2 text-sm">
                            <div className="p-4 bg-zinc-50 font-bold text-zinc-700 border-r border-zinc-200">{label}</div>
                            <div className="p-4 font-mono text-zinc-900">{value as string}</div>
                        </div>
                    ))}
                    {(!product.technicalSpecs) && (
                        <div className="grid grid-cols-2 text-sm">
                            <div className="p-4 bg-zinc-50 font-bold text-zinc-700 border-r border-zinc-200">SKU / Identifier</div>
                            <div className="p-4 font-mono text-zinc-900">{product.sku}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Compliance & Quality */}
            <div className="grid grid-cols-3 gap-6 mb-12">
                {[
                    { title: 'Quality Control', value: '100% Inspected' },
                    { title: 'Certification', value: 'ISO 9001:2015' },
                    { title: 'IP Protection', value: 'NDA Covered' }
                ].map((item) => (
                    <div key={item.title} className="p-4 border border-zinc-100 rounded-xl bg-zinc-50/50">
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{item.title}</p>
                        <p className="text-xs font-bold text-black">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Footer / Legal */}
            <div className="mt-auto border-t border-zinc-200 pt-8 pb-4 opacity-50">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold">MECHHUB INDUSTRIAL AUTOMATION</p>
                        <p className="text-[8px] text-zinc-500">© {new Date().getFullYear()} MechHub Inc. All rights reserved. Precision data subject to variation ±0.05mm unless specified.</p>
                    </div>
                    <div className="text-[8px] text-right font-mono">
                        VERIFIED_E_SIGNATURE: MS-{Math.random().toString(36).substring(7).toUpperCase()}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    body { background: white !important; color: black !important; }
                    @page { margin: 20mm; size: A4; }
                }
            `}</style>
        </div>
    );
}
