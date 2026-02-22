
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function LandingNav() {
  const logo = PlaceHolderImages.find((img) => img.id === 'mechhub-logo');

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-8 h-8 overflow-hidden rounded bg-primary/20">
            {logo?.imageUrl && (logo.imageUrl.startsWith('http') || logo.imageUrl.startsWith('/')) && (
              <Image
                src={logo.imageUrl}
                alt="MechHub Logo"
                width={32}
                height={32}
                className="object-cover"
                data-ai-hint={logo?.imageHint}
                suppressHydrationWarning
              />
            )}
          </div>
          <span className="font-headline font-bold text-xl tracking-tight">MechHub</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/#services" className="hover:text-secondary transition-colors">Services</Link>
          <Link href="/#how-it-works" className="hover:text-secondary transition-colors">How it Works</Link>
          <Link href="/#vendors" className="hover:text-secondary transition-colors">MechMasters</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="hidden sm:inline-flex" suppressHydrationWarning>Sign In</Button>
          </Link>
          <Link href="/upload">
            <Button className="bg-primary hover:bg-primary/90 text-white px-6" suppressHydrationWarning>Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
