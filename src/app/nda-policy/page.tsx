import Link from 'next/link';
import { Metadata } from 'next';
import { ChevronLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'NDA Policy | MechHub',
    description: 'MechHub NDA Policy — how we protect your intellectual property, trade secrets, and proprietary designs throughout the manufacturing process.',
};

export default function NdaPolicyPage() {
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
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">NDA Policy</h1>
                    <p className="text-sm text-zinc-500">Non-Disclosure Agreement Framework · Last Updated: 4 March 2025</p>
                </div>

                <div className="prose prose-invert max-w-none space-y-10 text-sm leading-relaxed text-zinc-400">
                    <section className="p-6 rounded-xl border border-blue-500/20 bg-blue-500/5">
                        <h2 className="text-lg font-bold text-blue-400 mb-3">Default Protection</h2>
                        <p>Every file uploaded to MechHub is protected by our platform-wide NDA by default. You do not need to sign a separate agreement for standard orders. This policy describes the scope and enforcement of that protection.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">1. Scope of Confidential Information</h2>
                        <p>Under this NDA framework, &quot;Confidential Information&quot; includes, without limitation:</p>
                        <ul className="list-disc pl-5 space-y-1.5 mt-3">
                            <li>CAD files, 3D models, 2D engineering drawings, and assembly files uploaded to the Platform</li>
                            <li>Material specifications, tolerance requirements, and surface finish specifications</li>
                            <li>Product names, part numbers, revision history, and project descriptions</li>
                            <li>Pricing, quotation details, and order volumes</li>
                            <li>Company names, contact information, and business relationships of all parties</li>
                            <li>Any technical data, trade secrets, or proprietary processes communicated via the Platform, email, or phone during the course of an order</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">2. Obligations of MechHub</h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>MechHub shall not disclose, publish, reproduce, or distribute any buyer&apos;s Confidential Information to any third party except the assigned MechMaster for the sole purpose of manufacturing the ordered parts.</li>
                            <li>All internal employees and contractors with access to buyer data are bound by individual confidentiality agreements.</li>
                            <li>MechHub shall not use the buyer&apos;s Confidential Information for any purpose other than fulfilling the order, unless the buyer provides explicit written consent.</li>
                            <li>MechHub shall not feature buyer projects, logos, or part images in marketing materials without prior written approval.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">3. Obligations of MechMasters (Vendors)</h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>Every MechMaster in MechHub&apos;s network signs a binding NDA with Synchubb Innovations Pvt Ltd as part of the vendor onboarding process.</li>
                            <li>MechMasters are prohibited from retaining, copying, photographing, or sharing buyer CAD files and drawings after order completion.</li>
                            <li>MechMasters shall not manufacture identical or similar parts for other clients using the buyer&apos;s design without the buyer&apos;s written consent.</li>
                            <li>MechMasters shall not contact buyers directly for future business outside the MechHub platform for orders initiated through MechHub.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">4. Data Handling and Deletion</h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>Buyer CAD files and drawings are stored on encrypted cloud servers (Google Cloud Platform) with access restricted to the MechHub operations team and the assigned MechMaster.</li>
                            <li>After order completion and the 7-day acceptance period, MechMaster access to the buyer&apos;s files is revoked automatically.</li>
                            <li>Buyer files are retained on MechHub&apos;s servers for 12 months to facilitate re-orders and warranty claims. After 12 months, files are permanently deleted unless the buyer requests extended storage.</li>
                            <li>Buyers may request immediate deletion of all files at any time by emailing <Link href="mailto:outreach@mechhub.in" className="text-blue-400 hover:underline">outreach@mechhub.in</Link>.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">5. Exclusions</h2>
                        <p>The NDA does not apply to information that:</p>
                        <ul className="list-disc pl-5 space-y-1.5 mt-3">
                            <li>Was publicly available at the time of disclosure or becomes publicly available through no fault of the receiving party</li>
                            <li>Was already in the possession of the receiving party prior to disclosure, as evidenced by written records</li>
                            <li>Is independently developed by the receiving party without reference to the Confidential Information</li>
                            <li>Is required to be disclosed by law, regulation, or court order — in which case the disclosing party shall be notified promptly before disclosure</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">6. Custom NDA Agreements</h2>
                        <p>For organisations requiring a custom NDA beyond this platform-wide policy — such as specific legal language, additional clauses, or mutual NDA formats — MechHub is happy to execute a separate agreement. Custom NDAs are available at no additional charge for orders above ₹1,00,000.</p>
                        <p className="mt-3">To request a custom NDA, email <Link href="mailto:outreach@mechhub.in" className="text-blue-400 hover:underline">outreach@mechhub.in</Link> with the subject line &quot;Custom NDA Request — [Company Name]&quot;.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">7. Duration</h2>
                        <p>This NDA remains in effect for a period of <strong className="text-zinc-200">3 years</strong> from the date of the last interaction between the parties (the last order or the last communication, whichever is later). After this period, obligations of confidentiality expire unless renewed in writing.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">8. Breach and Remedies</h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>Any suspected breach of this NDA should be reported immediately to <Link href="mailto:outreach@mechhub.in" className="text-blue-400 hover:underline">outreach@mechhub.in</Link>.</li>
                            <li>MechHub will investigate all reported breaches within 48 hours and take corrective action, which may include immediate termination of the MechMaster relationship, legal proceedings, and compensation to the affected buyer.</li>
                            <li>In the event of a confirmed breach, the affected party is entitled to seek injunctive relief and damages under Indian law. Disputes are governed by the jurisdiction of Vellore, Tamil Nadu.</li>
                        </ul>
                    </section>

                    <section className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
                        <h2 className="text-xl font-bold text-white mb-4">Contact</h2>
                        <p>For NDA-related queries:</p>
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
