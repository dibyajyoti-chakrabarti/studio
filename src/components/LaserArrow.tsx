'use client';

import React from 'react';

interface LaserArrowProps {
  direction?: 'down' | 'right' | 'up' | 'left';
  className?: string;
  size?: number;
  color?: string;
  intensity?: 'normal' | 'high';
}

/**
 * LaserArrow - A high-end, multi-layered SVG animation.
 * Created to feel like a precision laser flux, fitting for the "MechHub" industrial aesthetic.
 */
export const LaserArrow: React.FC<LaserArrowProps> = ({
  direction = 'down',
  className = '',
  size = 40,
  color = '#22d3ee', // cyan-400
  intensity = 'normal',
}) => {
  const rotationMap = {
    down: 'rotate-0',
    right: '-rotate-90',
    up: 'rotate-180',
    left: 'rotate-90',
  };

  return (
    <div
      className={`relative flex items-center justify-center ${rotationMap[direction]} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Layer 1: The Base Silhouette (Static, very faint) */}
        <path
          d="M12 4V20M12 20L5 13M12 20L19 13"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-zinc-800"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Layer 2: The Main Glow (Wide, blurred) */}
        <path
          d="M12 4V20M12 20L5 13M12 20L19 13"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-laser-glow opacity-40"
          style={{
            strokeDasharray: '60',
            strokeDashoffset: '60',
            filter: 'blur(2px)',
          }}
        />

        {/* Layer 3: The High-Intensity Core (Thin, white/bright) */}
        <path
          d="M12 4V20M12 20L5 13M12 20L19 13"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-laser-core"
          style={{
            strokeDasharray: '60',
            strokeDashoffset: '60',
          }}
        />

        {/* Layer 4: The Impact/Bloom (Subtle pulse at the tip) */}
        <circle cx="12" cy="20" r="1" fill="white" className="animate-laser-bloom" />

        <defs>
          <filter id="glow-laser">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <style jsx>{`
        @keyframes laser-stroke {
          0% {
            stroke-dashoffset: 60;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          40% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          60% {
            stroke-dashoffset: -60;
            opacity: 0;
          }
          100% {
            stroke-dashoffset: -60;
            opacity: 0;
          }
        }

        @keyframes laser-bloom-pulse {
          0%,
          35% {
            transform: scale(0);
            opacity: 0;
          }
          40% {
            transform: scale(2.5);
            opacity: 0.8;
            filter: blur(2px);
          }
          50% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }

        .animate-laser-glow {
          animation: laser-stroke 3s cubic-bezier(0.71, 0.18, 0.39, 0.88) infinite;
        }

        .animate-laser-core {
          animation: laser-stroke 3s cubic-bezier(0.71, 0.18, 0.39, 0.88) infinite;
          animation-delay: 0.05s; /* Slight lag for a trailing effect */
        }

        .animate-laser-bloom {
          transform-origin: center;
          animation: laser-bloom-pulse 3s ease-out infinite;
        }
      `}</style>
    </div>
  );
};
