import Link from 'next/link';
import { Metadata } from 'next';
import { ChevronLeft } from 'lucide-react';
import { LandingNav } from '@/components/LandingNav';

export const metadata: Metadata = {
    title: 'Refund Policy | MechHub',
    description: 'MechHub Refund Policy — clear guidelines on when and how refunds are processed for custom manufacturing orders.',
};

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-zinc-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
            <LandingNav />

            <article className="container mx-auto px-4 max-w-3xl pb-24 pt-20">
                <div className="py-6 relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </div>

                <div className="space-y-4 mb-16 pt-8 relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] font-consolas text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full bg-cyan-950/30">Legal</span>
                    <h1 className="text-4xl md:text-5xl  text-white tracking-tight drop-shadow-sm">Refund Policy</h1>
                    <p className="text-sm text-zinc-500 font-light">Last Updated: 4 March 2025</p>
                </div>

                <div className="prose prose-invert max-w-none space-y-10 text-sm leading-relaxed text-zinc-400 relative z-10 p-8 md:p-12 rounded-2xl border border-white/[0.05] bg-[#040f25]/50 backdrop-blur-md shadow-[0_0_40px_rgba(34,211,238,0.05)]">
                    <section className="p-6 rounded-xl border border-amber-500/20 bg-amber-950/20">
                        <h2 className="text-lg  text-amber-400 mb-3">Important Note</h2>
                        <p>Custom manufacturing is fundamentally different from off-the-shelf product purchases. Every part on MechHub is manufactured to your exact specifications — material, geometry, tolerances, and finish. Once production begins, the raw material is cut, machined, or formed exclusively for your order and cannot be returned to stock or resold.</p>
                        <p className="mt-2">This policy reflects the realities of custom manufacturing while ensuring fair protection for buyers when genuine quality issues arise.</p>
                    </section>

                    <section>
                        <h2 className="text-xl  text-cyan-50 mb-4 border-b border-white/[0.05] pb-2">1. Cancellation Before Production</h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li><strong className="text-zinc-200">Before material procurement:</strong> Full refund (100%). No charges apply if the order has not entered the production pipeline.</li>
                            <li><strong className="text-zinc-200">After material has been procured but before machining begins:</strong> Refund of the order amount minus material cost. Material cost is the verifiable cost of raw material purchased specifically for your order.</li>
                            <li><strong className="text-zinc-200">After machining or fabrication has started:</strong> No refund is available for partially or fully manufactured parts, as the material has been irreversibly altered to your specifications.</li>
                        </ul>
                        <p className="mt-3">To cancel an order, email <Link href="mailto:outreach@mechhub.in" className="text-blue-400 hover:underline">outreach@mechhub.in</Link> with your order ID. Cancellation is confirmed only upon written acknowledgement from MechHub.</p>
                    </section>

                    <section>
                        <h2 className="text-xl  text-cyan-50 mb-4 border-b border-white/[0.05] pb-2">2. Non-Conforming Parts (Quality Issues)</h2>
                        <p>If parts received do not conform to the specifications, tolerances, or material requirements stated in your confirmed order and engineering drawing, you are entitled to a remedy.</p>

                        <h3 className="text-base font-semibold text-zinc-200 mb-2 mt-6">Eligibility</h3>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>The non-conformance must be reported within <strong className="text-zinc-200">7 business days</strong> of receiving the parts.</li>
                            <li>The claim must include <strong className="text-zinc-200">measurement evidence</strong> — photographs, dimensional inspection data (calliper readings, CMM report), or material test certificates — demonstrating the deviation from the agreed specification.</li>
                            <li>Non-conformances caused by errors in the buyer&apos;s own design files, drawings, or specifications are not covered.</li>
                        </ul>

                        <h3 className="text-base font-semibold text-zinc-200 mb-2 mt-6">Remedy Options</h3>
                        <p>At MechHub&apos;s discretion, the following remedies are available:</p>
                        <ul className="list-disc pl-5 space-y-1.5 mt-2">
                            <li><strong className="text-zinc-200">Re-manufacture:</strong> The parts are re-manufactured to the correct specification at no additional cost to the buyer. Original non-conforming parts may be required to be returned.</li>
                            <li><strong className="text-zinc-200">Partial refund:</strong> A proportional refund based on the severity of the non-conformance, if the parts are still usable with minor deviation.</li>
                            <li><strong className="text-zinc-200">Full refund:</strong> In cases where parts are completely unusable and the non-conformance is clearly attributable to the manufacturing process.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl  text-cyan-50 mb-4 border-b border-white/[0.05] pb-2">3. Delivery Damage</h2>
                        <p>If parts arrive with visible damage caused during shipping:</p>
                        <ul className="list-disc pl-5 space-y-1.5 mt-2">
                            <li>Photograph the damage immediately upon receipt, including the packaging.</li>
                            <li>Report the damage to MechHub within <strong className="text-zinc-200">48 hours</strong> of delivery.</li>
                            <li>MechHub will arrange re-manufacture or refund at no additional cost. We will handle the logistics claim with the carrier.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl  text-cyan-50 mb-4 border-b border-white/[0.05] pb-2">4. Non-Refundable Situations</h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>Parts manufactured correctly to the buyer&apos;s specification but the buyer&apos;s design was flawed (e.g. incorrect hole position in the CAD file).</li>
                            <li>Buyer changes requirements after production has commenced without initiating a formal revision and new quotation.</li>
                            <li>Cosmetic preferences not specified in the original order (e.g. &quot;I wanted it smoother&quot; without a Ra value on the drawing).</li>
                            <li>Parts that were accepted and put into use before a claim is raised.</li>
                            <li>Setup charges, onboarding fees, or premium listing subscriptions.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl  text-cyan-50 mb-4 border-b border-white/[0.05] pb-2">5. Refund Processing</h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>Approved refunds are processed within <strong className="text-zinc-200">7–10 business days</strong> from approval.</li>
                            <li>Refunds are credited to the original payment method (UPI, bank account, or card used for payment).</li>
                            <li>Payment gateway processing fees (charged by Razorpay) are non-refundable.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl  text-cyan-50 mb-4 border-b border-white/[0.05] pb-2">6. Dispute Resolution</h2>
                        <p>If you disagree with a refund decision, you may escalate the matter by emailing <Link href="mailto:outreach@mechhub.in" className="text-blue-400 hover:underline">outreach@mechhub.in</Link> with subject line &quot;Refund Escalation — [Order ID]&quot;. A senior member of the MechHub team will review the case and respond within 5 business days. All disputes are governed by the laws of India with jurisdiction in Vellore, Tamil Nadu.</p>
                    </section>

                    <section className="p-6 rounded-xl border border-cyan-500/20 bg-cyan-950/20 mt-12">
                        <h2 className="text-xl  text-cyan-400 mb-4">Contact</h2>
                        <p>For all refund requests and quality claims:</p>
                        <div className="mt-3 space-y-1">
                            <p><strong className="text-zinc-200">Synchubb Innovations Pvt Ltd</strong></p>
                            <p>Email: <Link href="mailto:outreach@mechhub.in" className="text-blue-400 hover:underline">outreach@mechhub.in</Link></p>
                            <p>Phone: +91 9117203884</p>
                        </div>
                    </section>
                </div>
            </article>
        </div>
    );
}
