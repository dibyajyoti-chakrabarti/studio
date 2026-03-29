'use client';

import Image from 'next/image';
import { cn } from '@/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <div
      className={cn('relative overflow-hidden rounded', className)}
      style={{ width: size, height: size }}
    >
      <Image src="/mechhub.png" alt="MechHub Logo" fill className="object-contain" />
    </div>
  );
}
