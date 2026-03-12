'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { LandingNav } from '@/components/LandingNav';
import { Footer } from '@/components/Footer';
import {
    ShieldCheck,
    Truck,
    CreditCard,
    MapPin,
    Package,
    ShoppingCart,
    ArrowRight,
    ChevronLeft,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { items, totalPrice, totalItems, clearCart } = useCart();
    const { user, isUserLoading } = useUser();
    const db = useFirestore();
    const { toast } = useToast();
    const router = useRouter();

    const [isProcessing, setIsProcessing] = useState(false);
    const [address, setAddress] = useState({
        fullName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
    });

    // Fetch user profile for default address
    const userProfileRef = useMemoFirebase(() => {
        if (!db || !user) return null;
        return doc(db, 'users', user.uid);
    }, [db, user?.uid]);

    const { data: profile } = useDoc(userProfileRef);

    useEffect(() => {
        if (profile) {
            setAddress(prev => ({
                ...prev,
                fullName: profile.fullName || prev.fullName,
                email: user?.email || prev.email,
                phone: profile.phone || prev.phone,
                ...profile.defaultAddress
            }));
        }
    }, [profile, user]);

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login?redirect=/checkout');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading) {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-4">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                    <ShoppingCart className="w-10 h-10 text-zinc-800" />
                </div>
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <Link href="/shop">
                    <Button className="bg-cyan-600 hover:bg-cyan-500 text-white h-12 px-8 rounded-xl font-bold">
                        Return to Shop
                    </Button>
                </Link>
            </div>
        );
    }

    const gst = Math.round(totalPrice * 0.18);
    const shipping = 0; // Logistics now integrated into product base cost
    const finalTotal = totalPrice + gst + shipping;

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const handlePayment = async () => {
        // Simple validation
        const required = ['fullName', 'phone', 'street', 'city', 'state', 'pincode'];
        const missing = required.filter(f => !address[f as keyof typeof address]);

        if (missing.length > 0) {
            toast({
                title: "Incomplete Address",
                description: "Please fill in all mandatory shipping details.",
                variant: "destructive"
            });
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Create Order on Backend
            const res = await fetch('/api/v1/shop/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    totalAmount: finalTotal,
                    shippingAddress: address,
                    userId: user.uid
                })
            });

            const orderData = await res.json();
            if (!res.ok) throw new Error(orderData.error || 'Failed to initiate order');


            // 3. Open Razorpay Modal
            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "MechHub Marketplace",
                description: "Industrial Hardware Procurement",
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    setIsProcessing(true);
                    try {
                        const verifyRes = await fetch('/api/v1/shop/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                ...response,
                                shopOrderId: orderData.shopOrderId,
                                userId: user.uid
                            })
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok) {
                            clearCart();
                            router.push(`/orders/${orderData.shopOrderId}?success=true`);
                        } else {
                            throw new Error(verifyData.error || 'Verification failed');
                        }
                    } catch (err: any) {
                        toast({
                            title: "Payment Verification Failed",
                            description: err.message,
                            variant: "destructive"
                        });
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: address.fullName,
                    email: user.email,
                    contact: address.phone
                },
                theme: { color: "#0891b2" },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                }
            };

            if (typeof (window as any).Razorpay === 'undefined') {
                throw new Error('Payment gateway is still initializing. Please wait a moment and try again.');
            }

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err: any) {
            toast({
                title: "Checkout Error",
                description: err.message,
                variant: "destructive"
            });
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans">
            <LandingNav />

            <main className="container mx-auto px-4 py-12 md:py-20 max-w-7xl">
                <Link href="/shop" className="inline-flex items-center gap-2 text-zinc-500 hover:text-cyan-400 transition-colors mb-8 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Return to Catalogue</span>
                </Link>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left: Shipping & Billing */}
                    <div className="flex-1 space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold font-headline mb-2 text-zinc-100 italic">Secure Checkout</h1>
                            <p className="text-zinc-500 text-sm">Review your procurement items and provide delivery details.</p>
                        </div>

                        <Card className="bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-lg flex items-center gap-3 text-zinc-100">
                                    <MapPin className="w-5 h-5 text-cyan-500" />
                                    Shipping Destination
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Full Name</Label>
                                        <Input
                                            name="fullName"
                                            value={address.fullName}
                                            onChange={handleAddressChange}
                                            className="bg-black/40 border-white/5 rounded-xl h-12 focus:border-cyan-500/50 text-white"
                                            placeholder="Recipient name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Contact Phone</Label>
                                        <Input
                                            name="phone"
                                            value={address.phone}
                                            onChange={handleAddressChange}
                                            className="bg-black/40 border-white/5 rounded-xl h-12 focus:border-cyan-500/50 text-white"
                                            placeholder="+91-0000000000"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Street Address</Label>
                                    <Input
                                        name="street"
                                        value={address.street}
                                        onChange={handleAddressChange}
                                        className="bg-black/40 border-white/5 rounded-xl h-12 focus:border-cyan-500/50 text-white"
                                        placeholder="Industrial Estate, Building, Unit#"
                                    />
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">City</Label>
                                        <Input
                                            name="city"
                                            value={address.city}
                                            onChange={handleAddressChange}
                                            className="bg-black/40 border-white/5 rounded-xl h-12 focus:border-cyan-500/50 text-white"
                                            placeholder="City"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">State</Label>
                                        <Input
                                            name="state"
                                            value={address.state}
                                            onChange={handleAddressChange}
                                            className="bg-black/40 border-white/5 rounded-xl h-12 focus:border-cyan-500/50 text-white"
                                            placeholder="State"
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1 space-y-2">
                                        <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Pincode</Label>
                                        <Input
                                            name="pincode"
                                            value={address.pincode}
                                            onChange={handleAddressChange}
                                            className="bg-black/40 border-white/5 rounded-xl h-12 focus:border-cyan-500/50 text-white"
                                            placeholder="000000"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-5 h-5 text-cyan-500" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-zinc-200">Buyer Protection</h4>
                                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Transactions are secured and monitored for industrial standards.</p>
                                </div>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                                    <Truck className="w-5 h-5 text-cyan-500" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-zinc-200">Tracked Logistics</h4>
                                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Real-time transit updates for mission-critical components.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="lg:w-[400px] space-y-6">
                        <Card className="bg-[#040f25]/80 backdrop-blur-2xl border-white/5 rounded-[2rem] overflow-hidden sticky top-32">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-lg flex items-center gap-3 text-zinc-100">
                                    <Package className="w-5 h-5 text-cyan-500" />
                                    Procurement Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-6">
                                <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/5">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center gap-4">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-zinc-200 truncate leading-tight">{item.name}</p>
                                                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Qty: {item.quantity} × ₹{item.salePrice.toLocaleString()}</p>
                                            </div>
                                            <p className="text-sm font-bold font-mono text-zinc-300 shrink-0">₹{(item.quantity * item.salePrice).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>

                                <Separator className="bg-white/5" />

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Subtotal</span>
                                        <span className="font-mono font-medium">₹{totalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Procurement GST (18%)</span>
                                        <span className="font-mono font-medium">₹{gst.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Industrial Logistics</span>
                                        <span className="font-mono font-bold text-emerald-400">FREE</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-dashed border-white/10 space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-bold text-zinc-100">Order Total</span>
                                        <span className="text-2xl font-bold text-cyan-400 font-mono tracking-tighter">₹{finalTotal.toLocaleString()}</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 text-right font-medium italic">Estimated Gross Total (incl. GST)</p>
                                </div>

                                <Button
                                    className="w-full h-14 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl gap-3 shadow-xl shadow-cyan-900/20 active:scale-[0.98] transition-all"
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" /> Finalizing Order...
                                        </>
                                    ) : (
                                        <>
                                            Continue to Payment <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </Button>

                                <div className="flex items-center justify-center gap-4 py-2 grayscale opacity-40">
                                    <div className="h-6 w-12 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold">VISA</div>
                                    <div className="h-6 w-12 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold">UPI</div>
                                    <div className="h-6 w-12 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold">NB</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

// Add types for Razorpay
declare global {
    interface Window {
        Razorpay: any;
    }
}
