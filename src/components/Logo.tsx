
'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import data from '@/app/lib/placeholder-images.json';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 32 }: LogoProps) {
  const logo = data.placeholderImages.find((img: any) => img.id === 'mechhub-logo');

  return (
    <div 
      className={cn("relative overflow-hidden rounded bg-primary", className)} 
      style={{ width: size, height: size }}
    >
      {logo && (
        <Image
          src={logo.imageUrl}
          alt="MechHub Logo"
          fill
          className="object-contain"
          data-ai-hint={logo.imageHint}
        />
      )}
    </div>
  );
}
