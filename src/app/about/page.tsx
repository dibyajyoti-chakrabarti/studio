import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { ChevronLeft, Users, Zap, Shield, Target, MapPin, Mail, Phone } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About Us | MechHub',
    description: 'MechHub is India\'s precision manufacturing marketplace — connecting design teams with verified CNC, laser, and fabrication experts.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 relative overflow-hidden">
            {/* Background mesh */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />

            {/* Nav */}
            <div className="container mx-auto px-4 py-8">
                <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-[#2F5FA7] transition-all group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Hub
                </Link>
            </div>

            <article className="container mx-auto px-4 max-w-4xl pb-24">
                {/* Hero */}
                <div className="text-center space-y-6 mb-24 pt-8 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2F5FA7] border border-blue-100 px-4 py-1.5 rounded-full bg-blue-50/50 shadow-sm">About MechHub</span>
                    <h1 className="text-4xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.05]">
                        Building India&apos;s Manufacturing
                        <span className="block text-[#2F5FA7]"> Infrastructure.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        MechHub is a precision manufacturing marketplace connecting engineers with verified fabrication experts — making custom parts accessible, fast, and reliable.
                    </p>
                </div>

                {/* Mission */}
                <section className="mb-24 relative z-10">
                    <div className="p-8 md:p-12 rounded-[2rem] bg-white border border-slate-100 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full -mr-32 -mt-32" />
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                            <Target className="w-8 h-8 text-[#2F5FA7]" /> Our Strategic Mission
                        </h2>
                        <div className="prose prose-slate max-w-none">
                            <p className="text-slate-500 leading-relaxed text-lg font-medium">
                                India&apos;s custom manufacturing market is worth ₹40,000 Crore — yet there is no unified platform connecting buyers with precision manufacturing shops.
                            </p>
                            <p className="text-slate-500 leading-relaxed text-base mt-6">
                                MechHub exists to bridge this gap. We are building a vertically integrated marketplace where any engineer can upload a CAD file, receive an instant DFM review, get matched with a verified manufacturing partner (<strong className="text-[#2F5FA7]">MechMasters</strong>), and receive precision parts delivered to their doorstep with full quality documentation.
                            </p>
                        </div>
                    </div>
                </section>

                {/* What Makes Us Different */}
                <section className="mb-24 relative z-10">
                    <h2 className="text-3xl font-bold text-slate-900 mb-10 flex items-center gap-3">
                        <Zap className="w-8 h-8 text-[#2F5FA7]" /> Core Differentiators
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { title: 'Engineer-Verified Quoting', desc: 'Our quoting experts deliver verified bids in under 24 hours. No competitor in India comes close.' },
                            { title: 'AI-Powered DFM Engine', desc: 'We auto-detect design errors before production. Every file is checked for manufacturability — eliminating wrong parts.' },
                            { title: 'Localized Manufacturing', desc: 'Verified clusters across India mean 24–72 hour delivery. We own the local vendor relationship.' },
                            { title: 'Data-Driven Optimization', desc: 'Each order trains our pricing AI. Each shop onboarded makes quoting faster, creating a significant moat.' },
                            { title: 'Market-Leading Pricing', desc: 'Designed specifically for the India-native price points. We serve the ₹5K–₹50K range natively.' },
                            { title: 'Industry-First GTM', desc: 'Built for engineers, by engineers. We are establishing the standard for precision procurement.' },
                        ].map(item => (
                            <div key={item.title} className="group p-8 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-xl transition-all duration-300 space-y-3">
                                <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#2F5FA7] transition-colors">{item.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* The Team */}
                <section className="mb-24 relative z-10">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <Users className="w-8 h-8 text-[#2F5FA7]" /> The Leadership Team
                    </h2>
                    <p className="text-slate-500 mb-10 leading-relaxed font-medium">Engineers solving the high-friction procurement gap in India.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Ujjawal Kumar', role: 'Founder & CEO', focus: 'Product · Strategy · P&L Management', bio: 'VIT Vellore. Leading strategic growth and partnerships.', image: '/team/ujjawal.jpg' },
                            { name: 'Divyanshu Ranjan', role: 'Co-Founder & CTO', focus: 'Innovation · Technology · AI', bio: 'Techno Main Salt Lake. Architect of the MechHub platform.', image: '/team/divyanshu.jpg' },
                            { name: 'Dristi Sengupta', role: 'Co-Founder & COO', focus: 'Execution · Operation . Leadership', bio: 'VIT Vellore. Managing 20+ verified manufacturing partners.', image: '/team/dristi.png' },
                            { name: 'Ramchadiran', role: 'CPO', focus: 'Product · Strategy · Growth', bio: 'VIT Vellore. Aligning cross-functional teams to deliver customer value and drive business growth.', image: '/team/ram_image.jpeg' },
                        ].map(member => (
                            <div key={member.name} className="group p-8 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-xl transition-all duration-300 text-center space-y-4">
                                <div className="w-28 h-28 rounded-full overflow-hidden mx-auto ring-4 ring-slate-50 ring-offset-2 ring-offset-white group-hover:ring-blue-100 transition-all border border-slate-100 relative">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        width={112}
                                        height={112}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#2F5FA7] transition-colors">{member.name}</h3>
                                    <p className="text-xs font-black uppercase tracking-widest text-[#2F5FA7] mt-1">{member.role}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mt-2">{member.focus}</p>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Why Us */}
                <section className="mb-24 relative z-10">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <Shield className="w-8 h-8 text-[#2F5FA7]" /> Why Choose MechHub
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            'Engineers who faced these manufacturing bottlenecks personally.',
                            'Strategic footprint in India\'s ₹40,000 Crore custom market.',
                            'Rapidly growing network of 20+ verified manufacturing partners.',
                            'Embedded within the prestigious VIT Vellore TBI ecosystem.',
                        ].map(item => (
                            <div key={item} className="p-5 rounded-2xl bg-white border border-slate-100 flex items-start gap-4 hover:border-blue-100 transition-colors">
                                <div className="mt-1 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#2F5FA7]" />
                                </div>
                                <p className="text-slate-600 font-medium text-sm">{item}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact */}
                <section className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-2xl relative z-10 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#2F5FA7] to-[#1E3A66]" />
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <MapPin className="w-8 h-8 text-[#2F5FA7]" /> Institutional Presence
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-[#2F5FA7] mb-1">Registered Entity</p>
                                    <p className="text-slate-800 font-bold">Synchubb Innovations Pvt Ltd</p>
                                    <p className="text-slate-500 text-sm font-medium">VIT Vellore, Tamil Nadu, India</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-slate-400" />
                                </div>
                                <p className="text-slate-600 font-bold select-all">outreach@mechhub.in</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                    <Phone className="w-5 h-5 text-slate-400" />
                                </div>
                                <p className="text-slate-600 font-bold select-all">+91 9117203884</p>
                            </div>
                        </div>
                    </div>
                </section>
            </article>
        </div>
    );
}
