import Link from 'next/link';
import { Metadata } from 'next';
import { ChevronLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Privacy Policy | MechHub',
    description: 'MechHub Privacy Policy — how we collect, use, store, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-300">
            <div className="container mx-auto px-4 py-6">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
            </div>

            <article className="container mx-auto px-4 max-w-3xl pb-24">
                <div className="space-y-4 mb-16 pt-8">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">Legal</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Privacy Policy</h1>
                    <p className="text-sm text-zinc-500">Last Updated: 4 March 2025</p>
                </div>

                <div className="prose prose-invert max-w-none space-y-10 text-sm leading-relaxed text-zinc-400">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">1. Introduction</h2>
                        <p>MechHub (&quot;Platform&quot;), operated by Synchubb Innovations Pvt Ltd (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;), is committed to protecting the privacy of every user who interacts with our platform at <Link href="https://www.mechhub.in" className="text-blue-400 hover:underline">www.mechhub.in</Link>. This Privacy Policy explains what information we collect, how we use it, how we store and protect it, and what rights you have regarding your data.</p>
                        <p className="mt-3">By using the Platform, you consent to the practices described in this policy. If you do not agree, please discontinue use of the Platform.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">2. Information We Collect</h2>
                        <h3 className="text-base font-semibold text-zinc-200 mb-2">2.1 Information You Provide</h3>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li><strong className="text-zinc-200">Account Registration:</strong> Name, email address, phone number, company name, GST number (if applicable), and shipping address.</li>
                            <li><strong className="text-zinc-200">RFQ Submissions:</strong> Part descriptions, CAD files (STEP, DXF, DWG, STL), drawings, material specifications, quantity, and delivery requirements.</li>
                            <li><strong className="text-zinc-200">Payment Information:</strong> Payment is processed via Razorpay. We do not store credit card or UPI details on our servers. Razorpay&apos;s privacy policy applies to payment data.</li>
                            <li><strong className="text-zinc-200">Communications:</strong> Messages exchanged with MechMasters (vendors), support requests, and consultation form submissions.</li>
                            <li><strong className="text-zinc-200">Newsletter Subscriptions:</strong> Email address submitted via blog sidebar or landing page forms.</li>
                        </ul>

                        <h3 className="text-base font-semibold text-zinc-200 mb-2 mt-6">2.2 Information Collected Automatically</h3>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li><strong className="text-zinc-200">Usage Data:</strong> Pages visited, time spent, click patterns, browser type, device information, and IP address.</li>
                            <li><strong className="text-zinc-200">Cookies:</strong> We use essential cookies for authentication and session management, and analytics cookies (Google Analytics) to understand platform usage. You can disable non-essential cookies via your browser settings.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                        <ul className="list-disc pl-5 space-y-1.5">
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
                        <h2 className="text-xl font-bold text-white mb-4">4. Data Sharing</h2>
                        <p>We share your information only in the following circumstances:</p>
                        <ul className="list-disc pl-5 space-y-1.5 mt-3">
                            <li><strong className="text-zinc-200">With MechMasters (Vendors):</strong> When you submit an RFQ, your part requirements, CAD files, and project specifications are shared with the assigned manufacturing partner. Your personal contact details are shared only after you confirm the order.</li>
                            <li><strong className="text-zinc-200">Payment Processors:</strong> Razorpay processes all transactions. Financial details are governed by Razorpay&apos;s privacy policy.</li>
                            <li><strong className="text-zinc-200">Analytics Providers:</strong> Anonymised usage data may be shared with Google Analytics for platform improvement.</li>
                            <li><strong className="text-zinc-200">Legal Requirements:</strong> We may disclose information if required by law, court order, or government regulation.</li>
                        </ul>
                        <p className="mt-3"><strong className="text-zinc-200">We do not sell your personal data to third parties.</strong></p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">5. Data Storage and Security</h2>
                        <p>All data is stored on Google Cloud Platform (Firebase / Firestore) servers with encryption at rest and in transit. We implement role-based access controls, ensuring that only authorised personnel can access customer data. CAD files and drawings are stored in secure cloud storage with access restricted to the relevant MechMaster and MechHub administration.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">6. Data Retention</h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li><strong className="text-zinc-200">Account Data:</strong> Retained for the duration of your account activity, plus 3 years after account closure for legal compliance.</li>
                            <li><strong className="text-zinc-200">RFQ and Order Data:</strong> Retained for 7 years for tax, audit, and dispute resolution purposes.</li>
                            <li><strong className="text-zinc-200">Newsletter Subscriptions:</strong> Retained until you unsubscribe.</li>
                            <li><strong className="text-zinc-200">CAD Files:</strong> Retained for 12 months after order completion, then permanently deleted unless the customer requests extended storage.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">7. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc pl-5 space-y-1.5 mt-3">
                            <li><strong className="text-zinc-200">Access:</strong> Request a copy of all personal data we hold about you.</li>
                            <li><strong className="text-zinc-200">Correction:</strong> Request correction of inaccurate or incomplete data.</li>
                            <li><strong className="text-zinc-200">Deletion:</strong> Request deletion of your account and associated data, subject to legal retention obligations.</li>
                            <li><strong className="text-zinc-200">Opt-Out:</strong> Unsubscribe from marketing communications at any time by clicking the unsubscribe link in any email or by contacting us.</li>
                        </ul>
                        <p className="mt-3">To exercise any of these rights, email us at <Link href="mailto:outreach@mechhub.in" className="text-blue-400 hover:underline">outreach@mechhub.in</Link>.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">8. Third-Party Links</h2>
                        <p>The Platform may contain links to third-party websites (payment gateways, vendor websites, etc.). We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies before submitting any personal data.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">9. Changes to This Policy</h2>
                        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &quot;Last Updated&quot; date. Continued use of the Platform after any changes constitutes acceptance of the revised policy.</p>
                    </section>

                    <section className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
                        <h2 className="text-xl font-bold text-white mb-4">10. Contact</h2>
                        <p>For any privacy-related questions or requests:</p>
                        <div className="mt-3 space-y-1">
                            <p><strong className="text-zinc-200">Synchubb Innovations Pvt Ltd</strong></p>
                            <p>VIT Vellore, Tamil Nadu, India</p>
                            <p>Email: <Link href="mailto:outreach@mechhub.in" className="text-blue-400 hover:underline">outreach@mechhub.in</Link></p>
                            <p>Phone: +91 9117203884</p>
                        </div>
                    </section>
                </div>
            </article>
        </div>
    );
}
