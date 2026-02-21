import { Cog } from 'lucide-react';

export function RotatingGears() {
  return (
    <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10 pointer-events-none select-none">
      <div className="relative w-96 h-96">
        <div className="absolute top-0 left-0 animate-spin-slow">
          <Cog size={256} className="text-secondary" />
        </div>
        <div className="absolute top-40 left-48 animate-spin-reverse-slow">
          <Cog size={160} className="text-primary" />
        </div>
        <div className="absolute top-10 left-64 animate-spin-slow">
          <Cog size={128} className="text-secondary" />
        </div>
      </div>
    </div>
  );
}