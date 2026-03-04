import Link from 'next/link';
import { Metadata } from 'next';
import { ChevronLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Terms of Service | MechHub',
    description: 'MechHub Terms of Service — governing the use of India\'s precision manufacturing marketplace.',
};

export default function TermsPage() {
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
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Terms of Service</h1>
                    <p className="text-sm text-zinc-500">Last Updated: 4 March 2025</p>
                </div>

                <div className="prose prose-invert max-w-none space-y-10 text-sm leading-relaxed text-zinc-400">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>By accessing or using MechHub (&quot;Platform&quot;), operated by Synchubb Innovations Pvt Ltd (&quot;Company&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the Platform.</p>
                        <p className="mt-3">These Terms apply to all users of the Platform, including buyers (customers), sellers (MechMasters/vendors), and visitors.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">2. Platform Description</h2>
                        <p>MechHub is a B2B manufacturing marketplace that connects buyers seeking custom-manufactured metal parts (CNC machining, laser cutting, sheet metal fabrication, welding, and related processes) with verified manufacturing partners (&quot;MechMasters&quot;) across India. The Platform facilitates RFQ submission, quotation, order management, quality assurance, and payment processing.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">3. User Accounts</h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>You must provide accurate, complete, and current information during registration.</li>
                            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                            <li>One person or entity may not maintain multiple accounts without prior written approval.</li>
                            <li>You must be at least 18 years of age or have legal authority to enter into agreements on behalf of your organisation.</li>
                            <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">4. RFQ Submission and Orders</h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>An RFQ (Request for Quotation) submitted on the Platform is an invitation to treat, not a binding order.</li>
                            <li>A binding order is created only when the buyer confirms the quotation and completes payment (or payment terms are agreed in writing).</li>
                            <li>The buyer is responsible for the accuracy of all specifications, CAD files, drawings, material requirements, and tolerances submitted with the RFQ.</li>
                            <li>MechHub conducts an automated DFM (Design for Manufacturability) review but does not guarantee that every design flaw will be detected. The buyer retains ultimate responsibility for the design.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">5. Pricing and Payment</h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>All prices quoted on the Platform are in Indian Rupees (₹) and are exclusive of GST unless explicitly stated otherwise.</li>
                            <li>MechHub earns a platform commission (15–18%) which is included in the quoted price. The buyer pays only the quoted amount.</li>
                            <li>Payment is processed via Razorpay. Accepted methods include UPI, net banking, credit/debit cards, and bank transfer.</li>
                            <li>For orders above ₹50,000, milestone-based payment schedules may be arranged upon request.</li>
                            <li>Failure to complete payment within the agreed timeframe may result in order cancellation.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">6. Manufacturing and Delivery</h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>Manufacturing is performed by independent MechMasters in MechHub&apos;s verified network. MechHub is not itself a manufacturer.</li>
                            <li>Delivery timelines provided in quotations are estimates based on current shop loading and material availability. While we strive to meet all timelines, delays caused by material procurement, design revisions, or force majeure events are not guaranteed.</li>
                            <li>All parts are inspected against the buyer&apos;s drawing before dispatch. A dimensional inspection report is provided with every order.</li>
                            <li>Risk of loss transfers to the buyer upon handover to the logistics carrier.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">7. Quality and Acceptance</h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>Parts are manufactured to the tolerances, material specifications, and surface finish requirements stated in the buyer&apos;s drawing and order confirmation.</li>
                            <li>The buyer must inspect parts within 7 business days of receipt and report any non-conformances in writing to MechHub.</li>
                            <li>Dimensional non-conformances supported by measurement evidence will be addressed through re-manufacture, repair, or refund at MechHub&apos;s discretion.</li>
                            <li>Non-conformances caused by errors in the buyer&apos;s design files or specifications are not covered.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">8. Intellectual Property</h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>All CAD files, drawings, and specifications uploaded by the buyer remain the intellectual property of the buyer.</li>
                            <li>MechHub and the assigned MechMaster will use the buyer&apos;s files solely for the purpose of manufacturing the ordered parts. All parties are bound by the MechHub NDA (see NDA Policy).</li>
                            <li>MechHub retains ownership of all platform content, trademarks, software, AI models, and proprietary algorithms.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">9. Limitation of Liability</h2>
                        <p>To the maximum extent permitted by Indian law:</p>
                        <ul className="list-disc pl-5 space-y-1.5 mt-3">
                            <li>MechHub&apos;s total liability for any claim arising from or related to the Platform or any order shall not exceed the total amount paid by the buyer for the specific order in question.</li>
                            <li>MechHub shall not be liable for indirect, incidental, consequential, or punitive damages, including lost profits, production delays, or costs of substitute procurement.</li>
                            <li>MechHub acts as a marketplace intermediary and is not the manufacturer of record. Our liability is limited to the platform services we provide.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">10. Prohibited Conduct</h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>Users shall not upload malicious files, engage in fraudulent transactions, or misrepresent their identity or capabilities.</li>
                            <li>Users shall not attempt to bypass the Platform to transact directly with MechMasters for orders initiated through MechHub.</li>
                            <li>Users shall not reverse-engineer, scrape, or copy any part of the Platform&apos;s software, UI, or proprietary algorithms.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">11. Governing Law and Disputes</h2>
                        <p>These Terms are governed by the laws of India. Any disputes arising from or related to the Platform shall be subject to the exclusive jurisdiction of the courts of Vellore, Tamil Nadu, India. Before initiating legal proceedings, both parties agree to attempt resolution through good-faith negotiation for a period of 30 days.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">12. Modifications</h2>
                        <p>MechHub reserves the right to modify these Terms at any time. Updated Terms will be posted on this page with a revised &quot;Last Updated&quot; date. Continued use of the Platform constitutes acceptance of the modified Terms.</p>
                    </section>

                    <section className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
                        <h2 className="text-xl font-bold text-white mb-4">13. Contact</h2>
                        <p>For questions regarding these Terms:</p>
                        <div className="mt-3 space-y-1">
                            <p><strong className="text-zinc-200">Synchubb Innovations Pvt Ltd</strong></p>
                            <p>VIT Vellore, Tamil Nadu, India</p>
                            <p>Email: <Link href="mailto:outreach@mechhub.in" className="text-blue-400 hover:underline">outreach@mechhub.in</Link></p>
                        </div>
                    </section>
                </div>
            </article>
        </div>
    );
}
