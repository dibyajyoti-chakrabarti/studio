'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { LandingNav } from '@/components/LandingNav';
import { Footer } from '@/components/Footer';
import {
    CheckCircle2,
    XCircle,
    Package,
    Printer,
    ArrowLeft,
    ExternalLink,
    MapPin,
    Calendar,
    Receipt,
    Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';

export default function OrderConfirmationPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params.id as string;
    const isSuccess = searchParams.get('success') === 'true';
    const db = useFirestore();

    const orderRef = useMemoFirebase(() => {
        if (!db || !id) return null;
        return doc(db, 'orders', id);
    }, [db, id]);

    const { data: order, isLoading, error } = useDoc(orderRef);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-4">
                <XCircle className="w-20 h-20 text-red-500 mb-6 opacity-20" />
                <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
                <p className="text-zinc-500 mb-8 text-center max-w-md">The order record could not be retrieved from the central procurement system.</p>
                <Link href="/shop"><Button variant="outline" className="border-white/10 hover:bg-white/5">Back to Shop</Button></Link>
            </div>
        );
    }

    const isPaid = order.paymentStatus === 'paid';

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-cyan-500/30">
            <LandingNav />

            <main className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            {isPaid ? (
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                    <Receipt className="w-6 h-6 text-orange-500" />
                                </div>
                            )}
                            <h1 className="text-3xl font-bold font-headline italic">
                                {isPaid ? 'Order Confirmed' : 'Verification Pending'}
                            </h1>
                        </div>
                        <p className="text-zinc-500 text-sm pl-1">
                            Ref ID: <span className="font-mono text-zinc-300">#{order.id.slice(-8).toUpperCase()}</span>
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="bg-white/5 border-white/10 hover:bg-white/10 rounded-xl gap-2 h-11 px-6 print:hidden"
                            onClick={() => window.print()}
                        >
                            <Printer className="w-4 h-4" /> Print Receipt
                        </Button>
                        <Link href="/shop">
                            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-cyan-900/20 print:hidden">
                                Continue Procuring
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Summary and Items */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-lg font-bold flex items-center gap-3 text-zinc-100">
                                    <Package className="w-5 h-5 text-cyan-500" /> Procurement Lineage
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-6">
                                <div className="divide-y divide-white/5">
                                    {order.items.map((item: any) => (
                                        <div key={item.id} className="py-6 flex justify-between items-start gap-6 group">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-base font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors leading-tight italic">{item.name}</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <Badge variant="outline" className="text-[10px] border-white/10 text-zinc-500 font-mono py-0">SKU: {item.sku}</Badge>
                                                    <span className="text-xs text-zinc-500">Qty: <span className="text-zinc-300 font-bold">{item.quantity}</span></span>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-sm font-bold font-mono text-zinc-200">₹{(item.quantity * item.price).toLocaleString()}</p>
                                                <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-tighter">₹{item.price.toLocaleString()} unit</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden">
                                <CardHeader className="p-6 pb-2">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-zinc-400 uppercase tracking-widest">
                                        <MapPin className="w-4 h-4 text-cyan-500" /> Shipping Destination
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 pt-2">
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-zinc-100 italic">{order.shippingAddress.fullName}</p>
                                        <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                                            {order.shippingAddress.street}, {order.shippingAddress.city}<br />
                                            {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                                            Contact: {order.shippingAddress.phone}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden">
                                <CardHeader className="p-6 pb-2">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-zinc-400 uppercase tracking-widest">
                                        <CheckCircle2 className="w-4 h-4 text-cyan-500" /> Compliance Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 pt-2">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span className="text-xs font-bold text-zinc-200 uppercase tracking-tighter">QC Passed</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-xs font-bold text-zinc-200 uppercase tracking-tighter">Tax Invoice Generated</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Right: Payment Details */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="bg-[#111827]/80 backdrop-blur-2xl border-white/5 rounded-[2.5rem] overflow-hidden border-t border-t-white/10">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-lg font-bold flex items-center gap-3 text-zinc-100 italic underline decoration-cyan-500 underline-offset-8">
                                    Commercials
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500 font-medium tracking-wide">Logistics Subtotal</span>
                                        <span className="font-mono font-bold text-zinc-300">₹{order.pricing.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500 font-medium tracking-wide italic">GST (IGST 18%)</span>
                                        <span className="font-mono font-bold text-zinc-300">₹{order.pricing.gst.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500 font-medium tracking-wide">Procure Shipping</span>
                                        <span className="font-mono font-bold text-zinc-300">{order.pricing.shipping === 0 ? 'FREE' : `₹${order.pricing.shipping.toLocaleString()}`}</span>
                                    </div>
                                </div>

                                <Separator className="bg-white/5" />

                                <div className="space-y-1">
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-zinc-400 font-headline font-bold uppercase text-[11px] tracking-widest">Gross Total</span>
                                        <span className="text-3xl font-bold text-cyan-400 font-mono tracking-tighter">₹{order.pricing.total.toLocaleString()}</span>
                                    </div>
                                    <Badge className={`${isPaid ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'} w-full flex justify-center py-2 rounded-xl text-[10px] uppercase font-bold tracking-widest`}>
                                        {isPaid ? 'TXN SECURED & SETTLED' : 'SETTLEMENT PENDING'}
                                    </Badge>
                                </div>

                                <Separator className="bg-white/5" />

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                            <Calendar className="w-4 h-4 text-zinc-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Procured Date</p>
                                            <p className="text-xs font-bold text-zinc-300 italic">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                            <Truck className="w-4 h-4 text-zinc-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Fulfillment Type</p>
                                            <p className="text-xs font-bold text-zinc-300 italic">Standard Tracked Ground</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <Receipt className="w-5 h-5 text-cyan-500" />
                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">View Tax Invoice</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
