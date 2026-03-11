'use client';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter
} from '@/components/ui/sheet';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Trash2, Plus, Minus, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export function CartSidebar() {
    const { items, removeItem, updateQuantity, clearCart, totalPrice, totalSavings, totalItems, isCartOpen, setIsCartOpen } = useCart();

    return (
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetContent className="w-full sm:max-w-md bg-[#020617] border-l border-white/5 text-white flex flex-col p-0">
                <SheetHeader className="p-6">
                    <SheetTitle className="text-xl font-bold flex items-center gap-2 text-white">
                        <ShoppingBag className="w-5 h-5 text-cyan-500" />
                        Your Procurement Cart
                        <div className="ml-auto flex items-center gap-3">
                            {items.length > 0 && (
                                <button
                                    onClick={clearCart}
                                    className="text-[10px] font-bold text-red-500/70 hover:text-red-400 uppercase tracking-tighter flex items-center gap-1 transition-colors"
                                >
                                    <Trash2 className="w-3 h-3" /> Clear All
                                </button>
                            )}
                            <span className="text-[10px] font-mono text-zinc-500 font-normal bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                {totalItems} ITEMS
                            </span>
                        </div>
                    </SheetTitle>
                </SheetHeader>

                <Separator className="bg-white/5" />

                <div className="flex-1 overflow-hidden">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#020617]">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5">
                                <Package className="w-8 h-8 text-zinc-800" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Cart is empty</h3>
                            <p className="text-sm text-zinc-500 max-w-[200px] leading-relaxed">Browse our mechanical catalogue to add industrial grade hardware to your cart.</p>
                            <Button
                                variant="outline"
                                className="mt-8 border-white/10 hover:bg-white/5 h-11 px-8 rounded-xl font-bold"
                                onClick={() => setIsCartOpen(false)}
                            >
                                Back to Shop
                            </Button>
                        </div>
                    ) : (
                        <ScrollArea className="h-full px-6">
                            <div className="py-6 space-y-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="relative w-24 h-24 bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center shrink-0 group-hover:border-cyan-500/30 transition-all duration-300">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <Package className="w-10 h-10 text-zinc-800 opacity-20" />
                                            <div className="absolute inset-x-0 bottom-0 py-1 bg-black/60 backdrop-blur-sm border-t border-white/5">
                                                <p className="text-[8px] font-mono text-zinc-500 text-center tracking-tighter uppercase">{item.sku}</p>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <h4 className="text-sm font-bold text-zinc-100 truncate group-hover:text-cyan-400 transition-colors leading-tight">{item.name}</h4>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-zinc-500 hover:text-red-400 transition-all p-1 hover:bg-red-500/10 rounded"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <p className="text-[10px] font-bold text-cyan-500/60 uppercase tracking-widest mt-1">STANDARD PART</p>
                                            </div>

                                            <div className="flex justify-between items-center mt-3">
                                                <div className="flex items-center bg-black/40 border border-white/10 rounded-xl overflow-hidden h-9">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-full flex items-center justify-center hover:bg-white/5 text-zinc-400 hover:text-white transition-colors border-r border-white/5"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-10 text-center text-xs font-bold font-mono text-zinc-200">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-full flex items-center justify-center hover:bg-white/5 text-zinc-400 hover:text-white transition-colors border-l border-white/5"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-zinc-500 font-mono mb-0.5">₹{item.salePrice.toLocaleString()} ea</p>
                                                    <p className="text-sm font-bold text-white font-mono break-all">₹{(item.salePrice * item.quantity).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 h-auto flex flex-col border-t border-white/5 bg-[#040f25]/80 backdrop-blur-2xl">
                        <div className="w-full space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-xs text-zinc-500">
                                    <span>Subtotal</span>
                                    <span className="font-mono">₹{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-zinc-500">
                                    <span>Procurement Savings</span>
                                    <span className="font-mono text-emerald-400 font-bold">- ₹{totalSavings.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-zinc-500">
                                    <span>Industrial Logistics</span>
                                    <span className="font-mono text-emerald-400 font-bold">FREE</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-zinc-500">
                                    <span>Estimated Tax (GST 18%)</span>
                                    <span className="font-mono">₹{Math.round(totalPrice * 0.18).toLocaleString()}</span>
                                </div>
                                <Separator className="bg-white/5" />
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-sm font-bold text-zinc-100">Total Payable</span>
                                    <div className="text-right">
                                        <span className="text-xl font-bold text-cyan-400 font-mono">₹{Math.round(totalPrice * 1.18).toLocaleString()}</span>
                                        <p className="text-[9px] text-zinc-500 font-medium italic">Net Payable (inc. GST)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 pt-2">
                                <Link href="/checkout" className="w-full" onClick={() => setIsCartOpen(false)}>
                                    <Button className="w-full h-14 bg-cyan-600 hover:bg-cyan-500 text-white font-bold gap-2 rounded-2xl shadow-xl shadow-cyan-900/20 group transition-all duration-300 active:scale-[0.98]">
                                        Proceed to Checkout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    className="w-full h-11 text-zinc-400 hover:text-white hover:bg-white/5 text-xs font-medium"
                                    onClick={() => setIsCartOpen(false)}
                                >
                                    Continue Procuring
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
