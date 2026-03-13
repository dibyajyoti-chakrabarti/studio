import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, Package, ArrowRight, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function CartSidebar() {
    const { items, removeItem, updateQuantity, clearCart, totalPrice, totalSavings, totalItems, isCartOpen, setIsCartOpen } = useCart();
    const router = useRouter();

    const handleItemClick = (id: string) => {
        router.push(`/shop/${id}`);
        setIsCartOpen(false);
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetContent className="w-full sm:max-w-md bg-[#020617] border-l border-white/5 text-white flex flex-col p-0 overflow-hidden outline-none">
                {/* Custom Enhanced Header */}
                <div className="p-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                                <ShoppingBag className="w-5 h-5 text-cyan-500" />
                            </div>
                            <div>
                                <SheetTitle className="text-lg font-bold tracking-tight text-white leading-none">Procurement</SheetTitle>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Industrial Logistics</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-cyan-500/20 to-transparent" />
                        <span className="text-[9px] font-black text-cyan-400/60 uppercase tracking-[0.2em] whitespace-nowrap">
                            {totalItems} Inventory Units
                        </span>
                        <div className="flex-1 h-[1px] bg-gradient-to-l from-cyan-500/20 to-transparent" />
                    </div>
                </div>

                <div className="px-6 pb-2 flex items-center justify-between">
                    {items.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-[10px] font-bold text-red-500 uppercase tracking-widest transition-all active:scale-[0.98]"
                        >
                            <Trash2 className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                            Clear Selection
                        </button>
                    )}
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                        <span className="text-[9px] font-bold text-zinc-400 uppercase">Live Registry</span>
                    </div>
                </div>

                <Separator className="bg-white/5 mx-6 w-auto" />

                <div className="flex-1 overflow-hidden">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5 relative group">
                                <Package className="w-10 h-10 text-zinc-700 group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 rounded-full bg-cyan-500/5 blur-xl group-hover:bg-cyan-500/10 transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Cart is empty</h3>
                            <p className="text-sm text-zinc-500 max-w-[240px] leading-relaxed">Your procurement list is currently empty. Browse our catalogue to get started.</p>
                            <Button
                                className="mt-8 bg-cyan-600 hover:bg-cyan-500 h-12 px-10 rounded-xl font-bold transition-all shadow-lg shadow-cyan-900/10"
                                onClick={() => setIsCartOpen(false)}
                            >
                                Browse Catalogue
                            </Button>
                        </div>
                    ) : (
                        <ScrollArea className="h-full px-6">
                            <div className="py-6 space-y-5">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 group cursor-pointer"
                                        onDoubleClick={() => handleItemClick(item.id)}
                                        title="Double click to view details"
                                    >
                                        <div className="relative w-24 h-24 bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center shrink-0 group-hover:border-cyan-500/40 transition-all duration-500">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <Package className="w-8 h-8 text-zinc-800 opacity-20" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <ExternalLink className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                                            </div>
                                            <div className="absolute inset-x-0 bottom-0 py-1 bg-black/40 backdrop-blur-sm border-t border-white/5">
                                                <p className="text-[7px] font-mono text-zinc-500 text-center tracking-tighter uppercase font-bold">{item.sku}</p>
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <h4 className="text-sm font-bold text-zinc-100 truncate group-hover:text-cyan-400 transition-colors leading-tight tracking-tight uppercase">{item.name}</h4>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                                                        className="text-zinc-600 hover:text-red-500 transition-all p-1.5 hover:bg-red-500/10 rounded-lg group/trash"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 group-hover/trash:scale-110 transition-transform" />
                                                    </button>
                                                </div>
                                                <p className="text-[9px] font-bold text-cyan-500/40 uppercase tracking-widest mt-1">Verified Component</p>
                                            </div>

                                            <div className="flex justify-between items-end mt-2">
                                                <div className="flex items-center bg-black/60 border border-white/10 rounded-xl overflow-hidden h-8 ring-1 ring-white/5">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, item.quantity - 1); }}
                                                        className="w-8 h-full flex items-center justify-center hover:bg-white/5 text-zinc-500 hover:text-white transition-colors border-r border-white/5"
                                                    >
                                                        <Minus className="w-2.5 h-2.5" />
                                                    </button>
                                                    <span className="w-9 text-center text-[11px] font-bold font-mono text-zinc-300">{item.quantity}</span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, item.quantity + 1); }}
                                                        disabled={item.quantity >= item.inventory}
                                                        className={`w-7 h-7 flex items-center justify-center hover:bg-white/10 text-zinc-400 hover:text-white transition-colors ${item.quantity >= item.inventory ? 'opacity-20 cursor-not-allowed' : ''}`}
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-zinc-600 font-mono leading-none mb-1 group-hover:text-zinc-500 transition-colors">₹{item.salePrice.toLocaleString()} ea</p>
                                                    <p className="text-base font-bold text-white font-mono group-hover:text-cyan-400 transition-colors">₹{(item.salePrice * item.quantity).toLocaleString()}</p>
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
                    <div className="p-6 h-auto flex flex-col border-t border-white/10 bg-[#040f25]/95 backdrop-blur-3xl relative">
                        <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

                        <div className="w-full space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-[11px] text-zinc-500 font-medium">
                                    <span>Subtotal</span>
                                    <span className="font-mono text-zinc-400">₹{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] text-zinc-500 font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        Procurement Savings
                                    </span>
                                    <span className="font-mono text-emerald-400 font-bold">- ₹{totalSavings.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] text-zinc-500 font-medium">
                                    <span>Estimated Tax (GST 18%)</span>
                                    <span className="font-mono text-zinc-400">₹{Math.round(totalPrice * 0.18).toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between items-center py-3 border-t border-white/5 mt-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest leading-none">Total Payable</span>
                                        <span className="text-[9px] text-zinc-600 italic mt-1 font-medium italic">Net Payable (inc. GST)</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-cyan-400 font-mono tracking-tighter shadow-cyan-500/20 drop-shadow-md">
                                            ₹{Math.round(totalPrice * 1.18).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 pt-2">
                                <Link href="/checkout" className="w-full" onClick={() => setIsCartOpen(false)}>
                                    <Button className="w-full h-14 bg-cyan-600 hover:bg-cyan-500 text-white font-bold gap-3 rounded-2xl shadow-xl shadow-cyan-900/20 group transition-all duration-500 active:scale-[0.98] relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        Proceed to Checkout
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    className="w-full h-11 text-zinc-400 hover:text-white hover:bg-white/5 text-[10px] uppercase font-bold tracking-widest transition-all"
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
