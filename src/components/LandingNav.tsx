
'use client';

import Link from 'next/link';
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { useUser, useAuth, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { LogOut, User as UserIcon, LayoutDashboard, Menu, X, ShoppingCart, Search, ChevronDown, Package2 } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CartSidebar } from '@/components/CartSidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { doc } from 'firebase/firestore';
import { Input } from '@/components/ui/input';

const NAV_LINKS = [
  { href: '/#services', label: 'Services' },
  { href: '/shop', label: 'Shop' },
  { href: '/#vendors', label: 'MechMasters' },
  { href: '/blog', label: 'Blog' },
];

export function LandingNav() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, setIsCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverStyle, setHoverStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Fetch profile to get display name
  const userProfileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: profile } = useDoc(userProfileRef);

  const handleSignOut = () => {
    signOut(auth);
  };

  const displayName = profile?.fullName || user?.email?.split('@')[0] || 'Account';
  const role = profile?.role || 'customer';
  const dashboardHref = role === 'admin' ? '/admin' : role === 'vendor' ? '/vendor' : '/dashboard';

  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Shrink navbar on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Automatically float nav on non-home pages or when scrolled
  const isNavFloated = scrolled || pathname !== '/';

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Animate the hover indicator
  const handleMouseEnter = (index: number) => {
    const el = navRefs.current[index];
    if (el) {
      const parent = el.parentElement;
      const parentLeft = parent?.getBoundingClientRect().left ?? 0;
      const rect = el.getBoundingClientRect();
      setHoverStyle({
        left: rect.left - parentLeft,
        width: rect.width,
        opacity: 1,
      });
    }
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
    setHoverStyle(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isNavFloated
          ? 'top-3 mx-4 md:mx-auto md:max-w-6xl'
          : 'mx-0 top-0'
          }`}
      >
        <div
          className={`relative flex items-center justify-between px-4 md:px-6 h-[68px] transition-all duration-500 ease-in-out ${isNavFloated
            ? 'rounded-2xl bg-[#020617]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] mx-auto'
            : 'bg-[#020617]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] mx-auto'
            }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 z-10 shrink-0">
            <div className="relative">
              <Image
                src="/mechhub.png"
                alt="MechHub Logo"
                width={30}
                height={30}
                className="object-contain rounded-sm"
              />
            </div>
            <span className=" text-2xl tracking-tight text-white mt-1">
              MechHub
            </span>
          </Link>

          {/* Search Bar - Center */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
              } else {
                router.push('/shop');
              }
            }}
            className="hidden lg:flex flex-1 max-w-md mx-8 relative group"
          >
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-cyan-500 transition-colors" />
            </div>
            <Input
              type="text"
              placeholder="Search industrial parts (SKU, Name, Category)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border-white/10 pl-10 h-10 rounded-full text-sm focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all placeholder:text-zinc-600 focus:placeholder:text-zinc-500"
            />
          </form>

          {/* Nav Links + Categories - Right Side (shifted) */}
          <div
            className="hidden md:flex items-center gap-1 relative mr-2"
            onMouseLeave={handleMouseLeave}
          >
            {/* Animated background pill */}
            <span
              aria-hidden="true"
              className="absolute top-0 h-full rounded-full bg-white/[0.07] transition-all duration-300 ease-out pointer-events-none"
              style={{
                left: hoverStyle.left,
                width: hoverStyle.width,
                opacity: hoverStyle.opacity,
              }}
            />

            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="relative px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
                  onMouseEnter={() => handleMouseEnter(-1)} // Special index for indicator
                >
                  Categories <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-blue-1000 border border-white/10 rounded-xl p-1.5 mt-2">
                <Link href="/shop?category=bearings">
                  <DropdownMenuItem className="cursor-pointer gap-2.5 px-2 py-2 rounded-lg text-sm text-zinc-300 focus:bg-blue-900">
                    <Package2 className="w-4 h-4" /> Bearings
                  </DropdownMenuItem>
                </Link>
                <Link href="/shop?category=linear-motion">
                  <DropdownMenuItem className="cursor-pointer gap-2.5 px-2 py-2 rounded-lg text-sm text-zinc-300 focus:bg-blue-900">
                    <Package2 className="w-4 h-4" /> Linear Motion
                  </DropdownMenuItem>
                </Link>
                <Link href="/shop?category=transmission">
                  <DropdownMenuItem className="cursor-pointer gap-2.5 px-2 py-2 rounded-lg text-sm text-zinc-300 focus:bg-blue-900">
                    <Package2 className="w-4 h-4" /> Transmission
                  </DropdownMenuItem>
                </Link>
                <Link href="/shop?category=raw-materials">
                  <DropdownMenuItem className="cursor-pointer gap-2.5 px-2 py-2 rounded-lg text-sm text-zinc-300 focus:bg-blue-900">
                    <Package2 className="w-4 h-4" /> Raw Materials
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                ref={el => { navRefs.current[i] = el; }}
                onMouseEnter={() => handleMouseEnter(i)}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${activeIndex === i ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side: Auth + Cart + CTA */}
          <div className="flex items-center gap-2 z-10">
            {/* Cart Toggle */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-all group"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-cyan-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#020617] animate-in zoom-in duration-300">
                  {totalItems}
                </span>
              )}
            </button>

            {!isUserLoading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-white/5 transition-colors group"
                        suppressHydrationWarning
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white ring-2 ring-white/10 group-hover:ring-white/20 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                          {initials}
                        </div>
                        <span className="hidden sm:inline-block max-w-[100px] truncate text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                          {displayName}
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-1.5 mt-2"
                    >
                      <DropdownMenuLabel className="px-2 py-1.5 text-xs text-zinc-500 font-normal">
                        Signed in as <span className="font-semibold text-zinc-300">{user.email}</span>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/5 my-1" />
                      <Link href={dashboardHref}>
                        <DropdownMenuItem className="cursor-pointer gap-2.5 px-2 py-2 rounded-lg text-sm text-zinc-300 hover:text-white focus:bg-white/5 focus:text-white">
                          <LayoutDashboard className="w-4 h-4 text-zinc-400" /> Dashboard
                        </DropdownMenuItem>
                      </Link>
                      <Link href={dashboardHref}>
                        <DropdownMenuItem className="cursor-pointer gap-2.5 px-2 py-2 rounded-lg text-sm text-zinc-300 hover:text-white focus:bg-white/5 focus:text-white">
                          <UserIcon className="w-4 h-4 text-zinc-400" /> My Profile
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator className="bg-white/5 my-1" />
                      <DropdownMenuItem
                        className="cursor-pointer gap-2.5 px-2 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 focus:bg-red-500/10 focus:text-red-300"
                        onClick={handleSignOut}
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/login">
                      <button
                        className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-full hover:bg-white/5 transition-all duration-200"
                        suppressHydrationWarning
                      >
                        Sign In
                      </button>
                    </Link>
                    <Link href="/login">
                      <button
                        className="relative inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_28px_rgba(34,211,238,0.5)] transition-all duration-300"
                        suppressHydrationWarning
                      >
                        Get Started
                      </button>
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile Hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className={`mx-2 mt-1 rounded-2xl bg-[#020617]/95 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-3 flex flex-col gap-1`}>
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/5 mt-1 pt-1">
              {!user && (
                <Link href="/login" className="flex items-center px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to ensure content starts below the nav */}
      <div className="h-[68px]" />

      <CartSidebar />
    </>
  );
}
