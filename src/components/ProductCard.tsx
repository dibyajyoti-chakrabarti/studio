'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Scale, Star, Truck, BadgePercent } from 'lucide-react';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: any;
  isComparing: boolean;
  toggleCompare: (product: any) => void;
  addItem: (item: any) => void;
}

export function ProductCard({ product, isComparing, toggleCompare, addItem }: ProductCardProps) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const productImages =
    product.images?.length > 0
      ? product.images.map((img: any) => (typeof img === 'string' ? img : img.urls.product))
      : ['/images/placeholder-part.svg'];

  const avgRating =
    typeof product.avgRating === 'number'
      ? product.avgRating
      : product.reviews?.length
        ? Math.round(
            (product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) /
              product.reviews.length) *
              10
          ) / 10
        : null;
  const reviewCount = product.reviewCount || product.reviews?.length || 0;
  const basePrice = product.basePrice || product.salePrice;
  const discount =
    basePrice > product.salePrice
      ? Math.round(((basePrice - product.salePrice) / basePrice) * 100)
      : 0;
  const isOutOfStock = product.inventory <= 0;
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [isRequesting, setIsRequesting] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  const handleRestockRequest = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!db) return;

    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to submit a restock request.',
      });
      router.push('/login?redirect=/shop');
      return;
    }

    setIsRequesting(true);
    try {
      await addDocumentNonBlocking(collection(db, 'restockRequests'), {
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        userId: user.uid,
        userEmail: user.email || '',
        requestedAt: new Date().toISOString(),
        status: 'pending',
      });
      setHasRequested(true);
      toast({
        title: 'Restock request sent',
        description: 'We flagged this component for the procurement team.',
      });
    } catch (err) {
      console.error('Restock request failed:', err);
      toast({
        title: 'Request failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="group h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)]">
        <div className="relative border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white p-4">
          <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
            <Badge className="rounded-full border border-blue-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2F5FA7] shadow-sm">
              {product.categoryId?.replace('-', ' ')}
            </Badge>
            {discount > 0 && (
              <Badge className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">
                <BadgePercent className="mr-1 h-3 w-3" />
                {discount}% off
              </Badge>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleCompare(product);
            }}
            className={`absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border transition ${
              isComparing
                ? 'border-[#2F5FA7] bg-[#2F5FA7] text-white'
                : 'border-slate-200 bg-white text-slate-500 hover:border-[#2F5FA7] hover:text-[#2F5FA7]'
            }`}
            aria-label="Compare component"
          >
            <Scale className="h-4 w-4" />
          </button>

          <Link
            href={`/shop/${product.id}`}
            className="relative mt-12 block aspect-[4/3] overflow-hidden rounded-2xl bg-white"
            onMouseEnter={() => {
              if (productImages.length > 1) setCurrentImgIdx(1);
            }}
            onMouseLeave={() => setCurrentImgIdx(0)}
          >
            <Image
              src={productImages[currentImgIdx] || productImages[0]}
              alt={product.name}
              fill
              className={`object-contain p-4 transition duration-500 group-hover:scale-105 ${
                isOutOfStock ? 'opacity-55 grayscale' : ''
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
              onError={(e: any) => {
                e.target.src = '/mechhub.png';
              }}
            />
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/35">
                <Badge className="rounded-full border-none bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                  Out of stock
                </Badge>
              </div>
            )}
          </Link>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
              {product.sku}
            </p>
            {avgRating === null ? (
              <p className="text-[11px] font-bold text-slate-500">No reviews yet</p>
            ) : (
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{avgRating}</span>
                <span className="text-slate-400">({reviewCount})</span>
              </div>
            )}
          </div>

          <Link href={`/shop/${product.id}`} className="block">
            <h3 className="line-clamp-2 min-h-[52px] text-base font-bold leading-6 text-slate-900 transition-colors group-hover:text-[#2F5FA7]">
              {product.name}
            </h3>
            <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-600">
              {product.specs || 'Industrial-grade component with verified procurement support.'}
            </p>
          </Link>

          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight text-slate-950">
                  ₹{product.salePrice?.toLocaleString('en-IN')}
                </span>
                {basePrice > product.salePrice && (
                  <span className="text-sm font-semibold text-slate-400 line-through">
                    ₹{basePrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs font-semibold text-emerald-700">
                {discount > 0 ? `You save ₹${(basePrice - product.salePrice).toLocaleString('en-IN')}` : 'Best listed price'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                Stock
              </p>
              <p
                className={`mt-1 text-sm font-bold ${
                  isOutOfStock
                    ? 'text-red-600'
                    : product.inventory < 20
                      ? 'text-amber-600'
                      : 'text-emerald-700'
                }`}
              >
                {isOutOfStock
                  ? 'Unavailable'
                  : product.inventory < 20
                    ? `${product.inventory} left`
                    : `${product.inventory}+ ready`}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 px-3 py-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <Truck className="h-4 w-4 text-[#2F5FA7]" />
                <span className="font-semibold">Delivery</span>
              </div>
              <span className="text-right text-sm font-bold text-slate-900">
                {isOutOfStock ? 'Restock in progress' : 'Dispatch in 24-48 hrs'}
              </span>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <Button
              asChild
              variant="outline"
              className="h-11 min-w-0 flex-1 rounded-2xl border-slate-200 bg-white px-3 text-[11px] font-black uppercase tracking-[0.14em] text-slate-700 hover:bg-slate-50"
            >
              <Link href={`/shop/${product.id}`}>
                View details
              </Link>
            </Button>

            {isOutOfStock ? (
              <Button
                className="h-11 min-w-0 flex-1 rounded-2xl bg-[#2F5FA7] px-3 text-[11px] font-black uppercase tracking-[0.14em] text-white hover:bg-[#254b86]"
                onClick={handleRestockRequest}
                disabled={isRequesting || hasRequested}
              >
                {isRequesting ? 'Sending...' : hasRequested ? 'Requested' : 'Notify me'}
              </Button>
            ) : (
              <Button
                className="h-11 flex-1 rounded-2xl bg-[#FFD814] text-xs font-black uppercase tracking-[0.18em] text-slate-900 hover:bg-[#f7ca00]"
                onClick={(e) => {
                  e.preventDefault();
                  addItem({
                    id: product.id,
                    name: product.name,
                    salePrice: product.salePrice,
                    basePrice,
                    sku: product.sku,
                    image: productImages[0],
                    inventory: product.inventory,
                    quantity: 1,
                  });
                  toast({
                    title: 'Added to cart',
                    description: `${product.name} is ready in your procurement list.`,
                  });
                }}
              >
                Add to cart
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
