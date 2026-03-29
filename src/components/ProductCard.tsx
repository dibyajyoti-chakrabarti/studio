'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Scale, History, Package, Maximize2, Star } from 'lucide-react';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';

interface ProductCardProps {
  product: any;
  isComparing: boolean;
  toggleCompare: (product: any) => void;
  addItem: (item: any) => void;
}

export function ProductCard({ product, isComparing, toggleCompare, addItem }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  // Handle images logic
  const productImages =
    product.images?.length > 0
      ? product.images.map((img: any) => (typeof img === 'string' ? img : img.urls.product))
      : ['/images/placeholder-part.svg'];

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (productImages.length > 1) {
      setCurrentImgIdx(1);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImgIdx(0);
  };

  const avgRating = product.avgRating || 4.5;
  const reviewCount = product.reviewCount || 128;

  const { toast } = useToast();
  const isOutOfStock = product.inventory <= 0;
  const { user } = useUser();
  const db = useFirestore();
  const [isRequesting, setIsRequesting] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  const handleRestockRequest = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!db) return;

    setIsRequesting(true);
    try {
      await addDocumentNonBlocking(collection(db, 'restockRequests'), {
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || 'interested_customer',
        requestedAt: new Date().toISOString(),
        status: 'pending',
      });
      setHasRequested(true);
      toast({
        title: 'Restock Flag Sent',
        description: 'Admins have been notified of your interest.',
      });
    } catch (err) {
      console.error('Restock request failed:', err);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div
      className="group relative h-full flex flex-col"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card
        className={`flex-1 bg-[#0B1120] border-white/[0.06] overflow-hidden hover:border-cyan-500/30 transition-all duration-300 rounded-xl md:rounded-2xl flex flex-col shadow-lg ${isOutOfStock ? 'opacity-90 grayscale-[0.3]' : ''}`}
      >
        {/* Image Section */}
        <Link href={`/shop/${product.id}`} className="block">
          <div className="relative aspect-square sm:aspect-[4/3] md:aspect-square bg-[#0F172A] flex items-center justify-center p-3 sm:p-6 overflow-hidden border-b border-white/[0.04]">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div
              className={`relative w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out ${isOutOfStock ? 'opacity-50' : ''}`}
            >
              <Image
                src={productImages[currentImgIdx]}
                alt={product.name}
                fill
                className="object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] md:drop-shadow-[0_12px_15px_rgba(0,0,0,0.4)]"
                sizes="(max-width: 768px) 50vw, 33vw"
                onError={(e: any) => {
                  e.target.src = '/mechhub.png';
                }}
              />
            </div>

            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <Badge className="bg-red-500/80 text-white border-none text-[10px] md:text-xs font-black px-3 py-1 animate-pulse">
                  OUT OF STOCK
                </Badge>
              </div>
            )}

            {/* Compare Toggle */}
            {!isOutOfStock && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleCompare(product);
                }}
                className={`absolute top-2 right-2 p-1.5 rounded-lg border transition-all z-30 ${
                  isComparing
                    ? 'bg-cyan-500 border-cyan-400 text-white scale-110'
                    : 'bg-black/40 border-white/10 text-white/50 hover:text-white hover:bg-black/60'
                } ${isHovered ? 'opacity-100' : 'opacity-100 sm:opacity-0 md:opacity-0'}`}
              >
                <Scale className="w-3 h-3 md:w-3.5 md:h-3.5" />
              </button>
            )}

            {/* Category Badge (Mini) */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 z-30">
              <Badge className="bg-cyan-950/60 text-cyan-400 border border-cyan-500/20 text-[7px] font-bold tracking-widest px-1.5 py-0 backdrop-blur-md">
                {product.categoryId?.split('-')[0].toUpperCase()}
              </Badge>
            </div>
          </div>
        </Link>

        <div className="p-3 md:p-5 flex flex-col flex-1 gap-1.5 md:gap-3">
          {/* Header: SKU & Title */}
          <Link href={`/shop/${product.id}`} className="block space-y-1 md:space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[7px] md:text-[9px] font-mono text-cyan-500 bg-cyan-500/10 border border-cyan-500/20 px-1 py-0.5 rounded uppercase font-bold tracking-tighter">
                {product.sku}
              </span>
              {!isOutOfStock && product.inventory < 20 && (
                <Badge className="bg-orange-500/10 text-orange-400 border-none text-[7px] font-bold px-1 py-0">
                  Limited
                </Badge>
              )}
            </div>
            <h3 className="text-xs md:text-sm font-semibold text-zinc-100 line-clamp-2 min-h-[32px] md:min-h-[40px] leading-snug group-hover:text-cyan-400 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Ratings Section */}
          <div className="flex items-center gap-1">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 md:w-3.5 md:h-3.5 ${i < Math.floor(avgRating) ? 'fill-current' : 'text-zinc-700'}`}
                />
              ))}
            </div>
            <span className="text-[8px] md:text-[10px] text-zinc-500 font-bold">
              ({reviewCount})
            </span>
          </div>

          {/* Price Section */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 md:gap-2">
              <span
                className={`text-lg md:text-2xl font-black font-mono ${isOutOfStock ? 'text-zinc-500' : 'text-white'}`}
              >
                ₹{product.salePrice?.toLocaleString()}
              </span>
              <span className="text-[9px] md:text-[11px] text-zinc-600 line-through">
                ₹{product.basePrice || product.salePrice + 100}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={`${isOutOfStock ? 'bg-zinc-500/10 text-zinc-500' : 'bg-emerald-500/10 text-emerald-400'} border-none px-1 py-0 text-[8px] md:text-[10px] font-black`}
              >
                {Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100) ||
                  15}
                % OFF
              </Badge>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="text-[8px] md:text-[10px] text-zinc-500 font-medium">
            {isOutOfStock ? (
              'Currently unavailable'
            ) : (
              <>
                FREE Delivery <span className="text-zinc-400 font-bold">Tomorrow</span>
              </>
            )}
          </div>

          {/* Direct Add Button */}
          <div className="mt-2 md:mt-auto">
            {isOutOfStock ? (
              <Button
                className={`w-full ${hasRequested ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-zinc-800 hover:bg-zinc-700'} text-white rounded-lg md:rounded-xl h-9 md:h-11 text-[9px] md:text-[11px] font-black uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all`}
                onClick={handleRestockRequest}
                disabled={isRequesting || hasRequested}
              >
                {isRequesting
                  ? 'Requesting...'
                  : hasRequested
                    ? 'Request Sent ✓'
                    : 'Notify Me (Priority)'}
              </Button>
            ) : (
              <Button
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg md:rounded-xl h-9 md:h-11 text-[9px] md:text-[11px] font-black uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  addItem({
                    id: product.id,
                    name: product.name,
                    salePrice: product.salePrice,
                    basePrice: product.basePrice,
                    sku: product.sku,
                    image: productImages[0],
                    inventory: product.inventory,
                    quantity: 1,
                  });
                }}
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
