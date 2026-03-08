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
        <div className="min-h-screen bg-[#020617] text-zinc-300 relative overflow-hidden">
            {/* Background mesh */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
            {/* Nav */}
            <div className="container mx-auto px-4 py-6">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
            </div>

            <article className="container mx-auto px-4 max-w-4xl pb-24">
                {/* Hero */}
                <div className="text-center space-y-6 mb-20 pt-8 relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 font-consolas border border-cyan-500/20 px-3 py-1 rounded-full bg-cyan-950/30">About MechHub</span>
                    <h1 className="text-4xl md:text-6xl font-bankgothic text-white tracking-tight leading-[1.1] drop-shadow-sm">
                        Building India&apos;s Manufacturing
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> Infrastructure</span>
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        MechHub is a precision manufacturing marketplace that connects engineers, startups, and product teams with verified manufacturing partners across India — making custom parts accessible, fast, and reliable.
                    </p>
                </div>

                {/* Mission */}
                <section className="mb-16 relative z-10">
                    <h2 className="text-2xl font-bankgothic text-white mb-6 flex items-center gap-3">
                        <Target className="w-6 h-6 text-cyan-400" /> Our Mission
                    </h2>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-zinc-400 leading-relaxed text-base">
                            India&apos;s custom manufacturing market is worth ₹40,000 Crore — and yet, there is no organised, transparent platform that connects buyers with the right manufacturing shop. Students building FSAE cars spend weeks finding a CNC shop. Hardware startups burn months qualifying vendors. SME procurement teams juggle WhatsApp threads and Excel sheets to track orders.
                        </p>
                        <p className="text-zinc-400 leading-relaxed text-base mt-4">
                            MechHub exists to solve this. We are building a vertically integrated marketplace where any engineer in India can upload a CAD file, receive an instant DFM review, get matched with a verified manufacturing partner (we call them <strong className="text-white">MechMasters</strong>), and receive precision parts — with quality documentation — delivered to their doorstep.
                        </p>
                    </div>
                </section>

                {/* What Makes Us Different */}
                <section className="mb-16 relative z-10">
                    <h2 className="text-2xl font-bankgothic text-white mb-8 flex items-center gap-3">
                        <Zap className="w-6 h-6 text-cyan-400" /> What Makes MechHub Different
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: 'Rapido-Speed Quoting', desc: 'Our quoting experts deliver verified bids in under 24 hours. No competitor in India comes close.' },
                            { title: 'AI DFM Quality Engine', desc: 'We auto-detect design errors before production. Every file is checked for manufacturability — eliminating wrong parts, the #1 customer complaint in custom manufacturing.' },
                            { title: 'Hyperlocal Network', desc: 'Same-city verified shops mean 24–72 hour delivery. We own the last-mile manufacturing relationship.' },
                            { title: 'Network Effect Moat', desc: 'Each order trains our pricing AI. Each shop onboarded makes quoting faster. This compounds over time — a 10× data advantage year over year.' },
                            { title: 'India Price Points', desc: 'Designed for ₹5K–₹50K orders. Global platforms ignore this range. We serve it natively.' },
                            { title: 'Campus-First GTM', desc: 'Students are our acquisition wedge — organic, fast, viral. ₹0 CAC now, branded for 10 years.' },
                        ].map(item => (
                            <div key={item.title} className="group p-6 rounded-xl border border-white/[0.05] bg-[#040f25]/30 hover:border-cyan-500/30 hover:bg-cyan-950/20 transition-all duration-300 backdrop-blur-sm space-y-2">
                                <h3 className="text-sm font-bold text-white group-hover:text-cyan-50 transition-colors">{item.title}</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed font-light">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* The Team */}
                <section className="mb-16 relative z-10">
                    <h2 className="text-2xl font-bankgothic text-white mb-8 flex items-center gap-3">
                        <Users className="w-6 h-6 text-cyan-400" /> The Team
                    </h2>
                    <p className="text-zinc-400 mb-8 leading-relaxed">Engineers who lived this problem every day.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { name: 'Ujjawal Kumar', role: 'Founder & CEO', focus: 'Product · Growth · Sales', bio: 'VIT Vellore. 40+ customer interviews. Led all traction.', image: '/team/ujjawal.jpg' },
                            { name: 'Divyanshu Ranjan', role: 'Co-Founder & CTO', focus: 'Platform · Technology · AI', bio: 'Techno Main Salt Lake . Built MVP from scratch. Full-stack + AI/ML.', image: '/team/divyanshu.jpg' },
                            { name: 'Dristi Sengupta', role: 'Co-Founder & Ops', focus: 'Vendors · Ops · QA', bio: 'VIT Vellore. Onboarded all 20 vendors. Mech background.', image: '/team/dristi.png' },
                        ].map(member => (
                            <div key={member.name} className="group p-6 rounded-xl border border-white/[0.05] bg-[#040f25]/30 hover:border-cyan-500/30 hover:bg-cyan-950/20 transition-all duration-300 backdrop-blur-sm space-y-3 text-center">
                                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto ring-2 ring-white/10 ring-offset-2 ring-offset-[#020617] group-hover:ring-cyan-500/50 transition-all">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="text-base font-bold text-white group-hover:text-cyan-50 transition-colors">{member.name}</h3>
                                <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-consolas">{member.role}</p>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">{member.focus}</p>
                                <p className="text-xs text-zinc-400 leading-relaxed font-light">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Why Us */}
                <section className="mb-16 relative z-10">
                    <h2 className="text-2xl font-bankgothic text-white mb-6 flex items-center gap-3">
                        <Shield className="w-6 h-6 text-cyan-400" /> Why Us
                    </h2>
                    <ul className="space-y-3">
                        {[
                            'We are the customers — we faced this problem personally at VIT.',
                            'First-mover advantage in India\'s ₹40,000 Crore custom manufacturing market.',
                            '20 vendors, 6 orders, ₹0 CAC in first month — execution speaks.',
                            'VIT Vellore campus + TBI ecosystem gives us unfair distribution.',
                        ].map(item => (
                            <li key={item} className="flex items-start gap-3 text-sm text-zinc-400">
                                <span className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Contact */}
                <section className="p-8 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/20 to-[#040f25]/40 backdrop-blur-sm relative z-10 shadow-[0_0_30px_rgba(34,211,238,0.05)]">
                    <h2 className="text-2xl font-bankgothic text-white mb-6 flex items-center gap-3">
                        <MapPin className="w-6 h-6 text-cyan-400" /> Get in Touch
                    </h2>
                    <div className="space-y-3 text-sm text-zinc-400">
                        <p><strong className="text-white">Registered Entity:</strong> Synchubb Innovations Pvt Ltd</p>
                        <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-zinc-500" /> VIT Vellore, Tamil Nadu, India</p>
                        <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-zinc-500" /> outreach@mechhub.in</p>
                        <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-zinc-500" /> +91 9117203884</p>
                        <p className="flex items-center gap-2">🌐 <Link href="https://www.mechhub.in" className="text-blue-400 hover:underline">www.mechhub.in</Link></p>
                    </div>
                </section>
            </article>
        </div>
    );
}
