import Link from 'next/link';
import { Metadata } from 'next';
import { ChevronLeft } from 'lucide-react';
import { LandingNav } from '@/components/LandingNav';

export const metadata: Metadata = {
    title: 'Privacy Policy | MechHub',
    description: 'MechHub Privacy Policy — how we collect, use, store, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-[#2F5FA7]">
            <LandingNav />

            <article className="container mx-auto px-4 max-w-4xl pb-24 pt-20">
                <div className="py-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-[#2F5FA7] transition-all group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Hub
                    </Link>
                </div>

                <div className="space-y-4 mb-12 pt-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2F5FA7] border border-blue-100 px-4 py-1.5 rounded-full bg-blue-50/50 shadow-sm">Legal Protocols</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Privacy Policy</h1>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Effective Date: 4 March 2025</p>
                </div>

                <div className="prose prose-slate max-w-none space-y-12 text-slate-600 p-8 md:p-14 rounded-[2.5rem] bg-white border border-slate-100 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#2F5FA7] to-[#1E3A66]" />
                    
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <span className="text-[#2F5FA7]/20 font-black text-4xl">01</span> Introduction
                        </h2>
                        <p className="leading-relaxed font-medium">MechHub (&quot;Platform&quot;), operated by Synchubb Innovations Pvt Ltd (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;), is committed to protecting the privacy of every user who interacts with our platform at <Link href="https://www.mechhub.in" className="text-[#2F5FA7] hover:underline font-bold">www.mechhub.in</Link>. This Privacy Policy explains what information we collect, how we use it, how we store and protect it, and what rights you have regarding your data.</p>
                        <p className="mt-4 font-medium opacity-80 italic">By using the Platform, you consent to the practices described in this policy. If you do not agree, please discontinue use of the Platform.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <span className="text-[#2F5FA7]/20 font-black text-4xl">02</span> Information Collection
                        </h2>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 mt-8">2.1 Information You Provide</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-4"><div className="w-1.5 h-1.5 rounded-full bg-[#2F5FA7] mt-2 shrink-0" /><p><strong className="text-slate-900 underline decoration-blue-100 decoration-4 underline-offset-4">Account Registration:</strong> Name, email address, phone number, company name, GST number (if applicable), and shipping address.</p></li>
                            <li className="flex gap-4"><div className="w-1.5 h-1.5 rounded-full bg-[#2F5FA7] mt-2 shrink-0" /><p><strong className="text-slate-900 underline decoration-blue-100 decoration-4 underline-offset-4">RFQ Submissions:</strong> Part descriptions, CAD files (STEP, DXF, DWG, STL), drawings, material specifications, quantity, and delivery requirements.</p></li>
                            <li className="flex gap-4"><div className="w-1.5 h-1.5 rounded-full bg-[#2F5FA7] mt-2 shrink-0" /><p><strong className="text-slate-900 underline decoration-blue-100 decoration-4 underline-offset-4">Payment Information:</strong> Processed via Razorpay. We do not store financial details on our servers. Razorpay&apos;s encryption protocols apply.</p></li>
                        </ul>

                        <h3 className="text-lg font-bold text-slate-800 mb-4 mt-8">2.2 Information Collected Automatically</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-4"><div className="w-1.5 h-1.5 rounded-full bg-[#2F5FA7] mt-2 shrink-0" /><p><strong className="text-slate-900 underline decoration-blue-100 decoration-4 underline-offset-4">Usage & Device Data:</strong> Pages visited, interaction patterns, device type, and encrypted IP address for security auditing.</p></li>
                            <li className="flex gap-4"><div className="w-1.5 h-1.5 rounded-full bg-[#2F5FA7] mt-2 shrink-0" /><p><strong className="text-slate-900 underline decoration-blue-100 decoration-4 underline-offset-4">Cookies:</strong> Essential session management and anonymized Google Analytics to optimize platform performance.</p></li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <span className="text-[#2F5FA7]/20 font-black text-4xl">03</span> Strategic Data Usage
                        </h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "RFQ processing & partner matching",
                                "DFM check & algorithm optimization",
                                "Institutional order status updates",
                                "Secure payment gateway integration",
                                "Compliance with regulatory filings",
                                "Continuous platform UI/UX improvements"
                            ].map(usage => (
                                <li key={usage} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#2F5FA7]" />
                                    {usage}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <span className="text-[#2F5FA7]/20 font-black text-4xl">04</span> Verified Data Governance
                        </h2>
                        <div className="space-y-6">
                            <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 shadow-sm">
                                <p className="text-[#2F5FA7] font-bold text-lg mb-4">Zero-Sale Policy</p>
                                <p className="text-slate-600 font-medium">We do not sell, trade, or rent your personal data to non-manufacturing third parties. Data is strictly shared with assigned MechMasters for production requirements.</p>
                            </div>
                            
                            <p className="font-medium">Data is stored on <strong className="text-slate-900 underline decoration-[#2F5FA7]/20 decoration-4">Google Cloud Infrastructure</strong> with institutional-grade encryption (AES-256) at rest and in transit.</p>
                        </div>
                    </section>

                    <section className="p-10 rounded-[2rem] bg-slate-50 border border-slate-100 mt-12 relative overflow-hidden group">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 relative z-10">Legal Contact Support</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-2">
                                <p className="text-sm font-black uppercase tracking-widest text-[#2F5FA7]">Entity Oversight</p>
                                <p className="text-slate-800 font-bold">Synchubb Innovations Pvt Ltd</p>
                                <p className="text-slate-500 text-xs">VIT Vellore, Tamil Nadu, India</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-black uppercase tracking-widest text-[#2F5FA7]">Resolution Email</p>
                                <Link href="mailto:outreach@mechhub.in" className="text-slate-900 font-bold hover:underline">outreach@mechhub.in</Link>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">+91 9117203884</p>
                            </div>
                        </div>
                    </section>
                </div>
            </article>
        </div>
    );
}
