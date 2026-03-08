import Link from 'next/link';
import { Metadata } from 'next';
import { LandingNav } from '@/components/LandingNav';

export const metadata: Metadata = {
    title: 'Privacy Policy | MechHub',
    description: 'MechHub Privacy Policy — how we collect, use, store, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-zinc-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
            <LandingNav />

            <article className="container mx-auto px-4 max-w-3xl pb-24 pt-20">
                <div className="space-y-4 mb-16 pt-8">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] font-consolas text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full bg-cyan-950/30">Legal</span>
                    <h1 className="text-4xl md:text-5xl  text-white tracking-tight drop-shadow-sm">Privacy Policy</h1>
                    <p className="text-sm font-light text-zinc-500">Last Updated: 4 March 2025</p>
                </div>

                <div className="prose prose-invert max-w-none space-y-10 text-sm leading-relaxed text-zinc-400 p-8 md:p-12 rounded-3xl border border-white/[0.05] bg-[#040f25]/50 backdrop-blur-md shadow-[0_0_40px_rgba(34,211,238,0.05)]">
                    <section>
                        <h2 className="text-xl  text-cyan-50 mb-4 border-b border-white/[0.05] pb-2">1. Introduction</h2>
                        <p>MechHub (&quot;Platform&quot;), operated by Synchubb Innovations Pvt Ltd (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;), is committed to protecting the privacy of every user who interacts with our platform at <Link href="https://www.mechhub.in" className="text-cyan-400 hover:text-cyan-300 transition-colors">www.mechhub.in</Link>. This Privacy Policy explains what information we collect, how we use it, how we store and protect it, and what rights you have regarding your data.</p>
                        <p className="mt-3">By using the Platform, you consent to the practices described in this policy. If you do not agree, please discontinue use of the Platform.</p>
                    </section>

                    <section>
                        <h2 className="text-xl  text-cyan-50 mb-4 border-b border-white/[0.05] pb-2">2. Information We Collect</h2>
                        <h3 className="text-base font-semibold text-zinc-200 mb-2 mt-6">2.1 Information You Provide</h3>
                        <ul className="list-disc pl-5 space-y-1.5 marker:text-cyan-500">
                            <li><strong className="text-zinc-200">Account Registration:</strong> Name, email address, phone number, company name, GST number (if applicable), and shipping address.</li>
                            <li><strong className="text-zinc-200">RFQ Submissions:</strong> Part descriptions, CAD files (STEP, DXF, DWG, STL), drawings, material specifications, quantity, and delivery requirements.</li>
                            <li><strong className="text-zinc-200">Payment Information:</strong> Payment is processed via Razorpay. We do not store credit card or UPI details on our servers. Razorpay&apos;s privacy policy applies to payment data.</li>
                            <li><strong className="text-zinc-200">Communications:</strong> Messages exchanged with MechMasters (vendors), support requests, and consultation form submissions.</li>
                            <li><strong className="text-zinc-200">Newsletter Subscriptions:</strong> Email address submitted via blog sidebar or landing page forms.</li>
                        </ul>

                        <h3 className="text-base font-semibold text-zinc-200 mb-2 mt-6">2.2 Information Collected Automatically</h3>
                        <ul className="list-disc pl-5 space-y-1.5 marker:text-cyan-500">
                            <li><strong className="text-zinc-200">Usage Data:</strong> Pages visited, time spent, click patterns, browser type, device information, and IP address.</li>
                            <li><strong className="text-zinc-200">Cookies:</strong> We use essential cookies for authentication and session management, and analytics cookies (Google Analytics) to understand platform usage. You can disable non-essential cookies via your browser settings.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl  text-cyan-50 mb-4 border-b border-white/[0.05] pb-2">3. How We Use Your Information</h2>
                        <ul className="list-disc pl-5 space-y-1.5 marker:text-cyan-500">
                            <li>To process RFQs and match you with suitable manufacturing partners</li>
                            <li>To generate quotations and facilitate order execution</li>
                            <li>To communicate project status, delivery updates, and quality reports</li>
                            <li>To process payments via integrated payment gateways</li>
                            <li>To send manufacturing insights and newsletter content (only if subscribed)</li>
                            <li>To improve platform functionality, AI-based DFM checks, and pricing algorithms</li>
                            <li>To comply with legal obligations (tax filings, regulatory requirements)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl  text-cyan-50 mb-4 border-b border-white/[0.05] pb-2">4. Data Sharing</h2>
                        <p>We share your information only in the following circumstances:</p>
                        <ul className="list-disc pl-5 space-y-1.5 mt-3 marker:text-cyan-500">
                            <li><strong className="text-zinc-200">With MechMasters (Vendors):</strong> When you submit an RFQ, your part requirements, CAD files, and project specifications are shared with the assigned manufacturing partner. Your personal contact details are shared only after you confirm the order.</li>
                            <li><strong className="text-zinc-200">Payment Processors:</strong> Razorpay processes all transactions. Financial details are governed by Razorpay&apos;s privacy policy.</li>
                            <li><strong className="text-zinc-200">Analytics Providers:</strong> Anonymised usage data may be shared with Google Analytics for platform improvement.</li>
                            <li><strong className="text-zinc-200">Legal Requirements:</strong> We may disclose information if required by law, court order, or government regulation.</li>
                        </ul>
                        <p className="mt-3"><strong className="text-zinc-200">We do not sell your personal data to third parties.</strong></p>
                    </section>

                    <section>
                        <h2 className="text-xl  text-cyan-50 mb-4 border-b border-white/[0.05] pb-2">5. Data Storage and Security</h2>
                        <p>All data is stored on Google Cloud Platform (Firebase / Firestore) servers with encryption at rest and in transit. We implement role-based access controls, ensuring that only authorised personnel can access customer data. CAD files and drawings are stored in secure cloud storage with access restricted to the relevant MechMaster and MechHub administration.</p>
                    </section>

                    <section>
                        <h2 className="text-xl  text-cyan-50 mb-4 border-b border-white/[0.05] pb-2">6. Data Retention</h2>
                        <ul className="list-disc pl-5 space-y-1.5 marker:text-cyan-500">
                            <li><strong className="text-zinc-200">Account Data:</strong> Retained for the duration of your account activity, plus 3 years after account closure for legal compliance.</li>
                            <li><strong className="text-zinc-200">RFQ and Order Data:</strong> Retained for 7 years for tax, audit, and dispute resolution purposes.</li>
                            <li><strong className="text-zinc-200">Newsletter Subscriptions:</strong> Retained until you unsubscribe.</li>
                            <li><strong className="text-zinc-200">CAD Files:</strong> Retained for 12 months after order completion, then permanently deleted unless the customer requests extended storage.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl  text-cyan-50 mb-4 border-b border-white/[0.05] pb-2">7. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc pl-5 space-y-1.5 mt-3 marker:text-cyan-500">
                            <li><strong className="text-zinc-200">Access:</strong> Request a copy of all personal data we hold about you.</li>
                            <li><strong className="text-zinc-200">Correction:</strong> Request correction of inaccurate or incomplete data.</li>
                            <li><strong className="text-zinc-200">Deletion:</strong> Request deletion of your account and associated data, subject to legal retention obligations.</li>
                            <li><strong className="text-zinc-200">Opt-Out:</strong> Unsubscribe from marketing communications at any time by clicking the unsubscribe link in any email or by contacting us.</li>
                        </ul>
                        <p className="mt-6">To exercise any of these rights, email us at <Link href="mailto:outreach@mechhub.in" className="text-cyan-400 hover:text-cyan-300 transition-colors">outreach@mechhub.in</Link>.</p>
                    </section>

                    <section>
                        <h2 className="text-xl  text-cyan-50 mb-4 border-b border-white/[0.05] pb-2">8. Third-Party Links</h2>
                        <p>The Platform may contain links to third-party websites (payment gateways, vendor websites, etc.). We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies before submitting any personal data.</p>
                    </section>

                    <section>
                        <h2 className="text-xl  text-cyan-50 mb-4 border-b border-white/[0.05] pb-2">9. Changes to This Policy</h2>
                        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &quot;Last Updated&quot; date. Continued use of the Platform after any changes constitutes acceptance of the revised policy.</p>
                    </section>

                    <section className="p-6 md:p-8 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 mt-12 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <h2 className="text-xl  text-cyan-400 mb-4 relative z-10">10. Contact</h2>
                        <p className="relative z-10 text-cyan-100/70">For any privacy-related questions or requests:</p>
                        <div className="mt-4 space-y-2 relative z-10 text-sm">
                            <p><strong className="text-white">Synchubb Innovations Pvt Ltd</strong></p>
                            <p>VIT Vellore, Tamil Nadu, India</p>
                            <p>Email: <Link href="mailto:outreach@mechhub.in" className="text-cyan-400 hover:text-cyan-300 transition-colors">outreach@mechhub.in</Link></p>
                            <p>Phone: <span className="font-consolas">+91 9117203884</span></p>
                        </div>
                    </section>
                </div>
            </article>
        </div>
    );
}
