'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const SERVICES = [
    {
        num: '01',
        title: 'Precision Sheet Cutting',
        desc: 'Laser cutting, waterjet, and CNC routing for sheet materials.',
        img: '/sheet_cutting_service.png',
    },
    {
        num: '02',
        title: 'CNC Machining',
        desc: 'Multi-axis CNC machining in billet stock.',
        img: '/cnc_machining_service.png',
    },
    {
        num: '03',
        title: 'Bending',
        desc: 'Bends within 1 degree of accuracy or better.',
        img: '/bending_service.png',
    },
    {
        num: '04',
        title: 'Countersinking',
        desc: 'Allow hardware to sit flush on your parts to reduce wear and tear.',
        img: '/countersinking_service.png',
    },
    {
        num: '05',
        title: 'Dimple Forming',
        desc: 'Reinforce and enhance your parts with dimples up to 3"',
        img: '/dimple_forming_service.png',
    },
    {
        num: '06',
        title: 'Hardware Insertion',
        desc: 'Add strong, permanent fasteners to your metal parts.',
        img: '/hardware_insertion_service.png',
    },
    {
        num: '07',
        title: 'Tapping',
        desc: 'Easily add threading to allow for the addition of hardware to your parts.',
        img: '/tapping_service.png',
    },
    {
        num: '08',
        title: 'Anodizing',
        desc: 'Increase durability with Class II anodizing services available in 5 colors.',
        img: '/anodizing_service.png',
    },
    {
        num: '09',
        title: 'Deburring',
        desc: 'Smooth sharp edges and clean up your metal parts.',
        img: '/deburring_service.png',
    },
    {
        num: '10',
        title: 'Plating',
        desc: 'Increase rust prevention, wear resistance, and strength with zinc and nickel plating.',
        img: '/plating_service.png',
    },
    {
        num: '11',
        title: 'Powder Coating',
        desc: 'Give your custom cut parts a bold, long-lasting protective layer in one of 11 options.',
        img: '/powder_coating_service.png',
    },
    {
        num: '12',
        title: 'Tumbling',
        desc: 'Reduce the surface blemishes and handling scratches found in raw materials.',
        img: '/tumbling_service.png',
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

                <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 max-w-7xl mx-auto px-2 md:px-0">
                    {SERVICES.map((service) => (
                        <div
                            key={service.num}
                            className="group bg-slate-100 rounded-xl md:rounded-[32px] p-2 md:p-8 flex flex-col items-start transition-all duration-300 hover:shadow-xl md:hover:-translate-y-1 active:scale-95 md:active:scale-100"
                        >
                            <div className="w-full aspect-square md:aspect-[4/3] relative mb-2 md:mb-8 flex items-center justify-center overflow-hidden rounded-lg md:rounded-2xl bg-white/50">
                                <Image
                                    src={service.img}
                                    alt={service.title}
                                    width={240}
                                    height={180}
                                    className="object-contain drop-shadow-xl md:drop-shadow-2xl brightness-105 group-hover:scale-110 transition-transform duration-500 h-12 md:h-auto"
                                />
                            </div>
                            <h3 className="text-[10px] md:text-lg font-bold text-[#0F172A] mb-1 md:mb-3 line-clamp-1">
                                {service.title}
                            </h3>
                            <p className="text-[#64748B] text-[8px] md:text-sm leading-tight md:leading-relaxed mb-2 md:mb-6 font-medium line-clamp-2">
                                {service.desc}
                            </p>
                            <div className="mt-auto hidden md:block">
                                <div className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center group-hover:bg-white transition-colors">
                                    <ArrowRight className="w-5 h-5 text-blue-500" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
