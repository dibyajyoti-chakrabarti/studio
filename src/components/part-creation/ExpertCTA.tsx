"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowRight } from 'lucide-react';

interface ExpertCTAProps {
  title?: string;
  description: string;
  buttonText?: string;
  className?: string;
}

export function ExpertCTA({
  title = "Can't find what you need?",
  description,
  buttonText = "Contact Expert",
  className = ""
}: ExpertCTAProps) {
  return (
    <div className={`mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[1.5rem] border border-blue-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 ${className}`}>
      <div className="flex items-start gap-4 flex-1">
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm border border-blue-50 shrink-0">
          <MessageSquare className="w-6 h-6 text-[#2F5FA7]" />
        </div>
        <div className="space-y-1">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2F5FA7]">
            {title}
          </h4>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      
      <Link href="/contact" className="shrink-0 w-full md:w-auto">
        <Button 
          variant="outline" 
          className="w-full md:w-auto h-11 px-6 bg-white hover:bg-blue-50 text-[#2F5FA7] border-blue-200 font-bold uppercase tracking-widest text-[10px] gap-2 rounded-xl shadow-sm transition-all hover:translate-x-1"
        >
          {buttonText}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
}
