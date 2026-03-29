'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const SERVICES = [
  {
    num: '01',
    title: 'Precision Sheet Cutting',
    desc: 'Laser cutting, waterjet, and CNC routing for sheet materials.',
    img: 'https://res.cloudinary.com/dypbvtojf/image/upload/v1773983927/3e6da763-3528-4151-803a-895414e5e3b5.png',
  },
  {
    num: '02',
    title: 'CNC Milling/Turning',
    desc: 'Multi-axis CNC processing in billet stock.',
    img: 'https://res.cloudinary.com/dypbvtojf/image/upload/v1773985132/CNC-milling-housing-300x292_ppqvvc.jpg',
  },
  {
    num: '03',
    title: 'Bending',
    desc: 'Bends within 1 degree of accuracy or better.',
    img: 'https://res.cloudinary.com/dypbvtojf/image/upload/v1773984524/sheet-metal-bending-parts-014_ofmchf.jpg',
  },
  {
    num: '04',
    title: 'Countersinking',
    desc: 'Allow hardware to sit flush on your parts to reduce wear and tear.',
    img: 'https://res.cloudinary.com/dypbvtojf/image/upload/v1773985400/hole-aluminum-metal-made-chamfer-600nw-2733529461_wrekrv.webp',
  },
  {
    num: '05',
    title: 'Dimple Forming',
    desc: 'Reinforce and enhance your parts with dimples up to 3"',
    img: 'https://res.cloudinary.com/dypbvtojf/image/upload/v1773984647/1771003010117-dimple-forming-1.jpg_rbtfn0.jpg',
  },
  {
    num: '06',
    title: 'Hardware Insertion',
    desc: 'Add strong, permanent fasteners to your metal parts.',
    img: 'https://res.cloudinary.com/dypbvtojf/image/upload/v1773984866/inserting_tisw_TitleImageSwap500x408_u9dldf.webp',
  },
  {
    num: '07',
    title: 'Tapping',
    desc: 'Easily add threading to allow for the addition of hardware to your parts.',
    img: 'https://res.cloudinary.com/dypbvtojf/image/upload/v1773985261/Threaded-Holes-Vs-Tapped-Holes-e1723621552746_jkg74r.png',
  },
  {
    num: '08',
    title: 'Anodizing',
    desc: 'Increase durability with Class II anodizing services available in 5 colors.',
    img: 'https://res.cloudinary.com/dypbvtojf/image/upload/v1773985502/anodized-parts_c6bzzo.webp',
  },
  {
    num: '10',
    title: 'Powder Coating',
    desc: 'Give your custom cut parts a bold, long-lasting protective layer in one of 11 options.',
    img: 'https://res.cloudinary.com/dypbvtojf/image/upload/v1773985460/powder-coated-profile_e6k4yo.png',
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#0F172A] mb-4">
            Everything you need in just a few clicks.
          </h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 max-w-7xl mx-auto px-2 md:px-0">
          {SERVICES.map((service) => {
            const isCNC = service.title === 'CNC Milling/Turning';
            const isBending = service.title === 'Bending';
            const isCountersinking = service.title === 'Countersinking';
            const isCutting = service.title === 'Precision Sheet Cutting';
            const isHardware = service.title === 'Hardware Insertion';
            const isDimpleForming = service.title === 'Dimple Forming';
            const isTapping = service.title === 'Tapping';
            const isAnodizing = service.title === 'Anodizing';
            const isPowderCoating = service.title === 'Powder Coating';
            const CardContent = (
              <div className="group bg-slate-100 rounded-xl md:rounded-[32px] p-2 md:p-8 flex flex-col items-start transition-all duration-300 hover:shadow-xl md:hover:-translate-y-1 active:scale-95 md:active:scale-100 h-full">
                <div className="w-full aspect-[4/3] relative mb-4 md:mb-8 overflow-hidden rounded-xl md:rounded-2xl bg-slate-200">
                  <Image
                    src={service.img}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <h3 className="text-[9px] sm:text-lg md:text-xl font-black text-[#0F172A] mb-1.5 md:mb-4 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-[#64748B] text-[8px] sm:text-xs md:text-sm leading-relaxed mb-4 md:mb-8 font-medium line-clamp-2">
                  {service.desc}
                </p>
                <div className="mt-auto hidden md:block">
                  <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    View Capability <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );

            if (isCNC) {
              return (
                <Link
                  key={service.num}
                  href="/services/cnc-machining"
                  className="block cursor-pointer"
                >
                  {CardContent}
                </Link>
              );
            }

            if (isBending) {
              return (
                <Link key={service.num} href="/services/bending" className="block cursor-pointer">
                  {CardContent}
                </Link>
              );
            }

            if (isCountersinking) {
              return (
                <Link
                  key={service.num}
                  href="/services/countersinking"
                  className="block cursor-pointer"
                >
                  {CardContent}
                </Link>
              );
            }

            if (isCutting) {
              return (
                <Link
                  key={service.num}
                  href="/services/precision-sheet-cutting"
                  className="block cursor-pointer"
                >
                  {CardContent}
                </Link>
              );
            }

            if (isHardware) {
              return (
                <Link
                  key={service.num}
                  href="/services/hardware-insertion"
                  className="block cursor-pointer"
                >
                  {CardContent}
                </Link>
              );
            }

            if (isDimpleForming) {
              return (
                <Link
                  key={service.num}
                  href="/services/dimple-forming"
                  className="block cursor-pointer"
                >
                  {CardContent}
                </Link>
              );
            }

            if (isTapping) {
              return (
                <Link key={service.num} href="/services/tapping" className="block cursor-pointer">
                  {CardContent}
                </Link>
              );
            }

            if (isAnodizing) {
              return (
                <Link key={service.num} href="/services/anodizing" className="block cursor-pointer">
                  {CardContent}
                </Link>
              );
            }

            if (isPowderCoating) {
              return (
                <Link
                  key={service.num}
                  href="/services/powder-coating"
                  className="block cursor-pointer"
                >
                  {CardContent}
                </Link>
              );
            }

            return <div key={service.num}>{CardContent}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
