"use client"

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { LandingNav } from '@/components/LandingNav';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useFirestore, setDocumentNonBlocking, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Check, Loader2, FileText, ArrowRight, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function ConsultationPageContent() {
    const searchParams = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();
    const db = useFirestore();
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.replace('/login?tab=register&redirect=/consultation');
        }
    }, [user, isUserLoading, router]);

    const prefilledRef = searchParams.get('ref') || '';
    const prefilledMaterial = searchParams.get('material') || '';
    const prefilledProcess = searchParams.get('process') || '';
    const prefilledQty = searchParams.get('qty') || '';
    const prefilledEstimate = searchParams.get('estimate') || '';

    const defaultMessage = prefilledRef
        ? `I have a pending quote (Ref: ${prefilledRef}) for ${prefilledQty} pcs of ${prefilledMaterial} via ${prefilledProcess}.\nThe estimated cost is ${prefilledEstimate}.\n\nI would like to discuss next steps with an expert regarding:`
        : '';

    async function handleConsultationSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!db) return;

        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const id = Math.random().toString(36).substring(2, 11);

        const requestData = {
            id,
            userId: user?.uid || null,
            name: formData.get('name') as string,
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            message: formData.get('message') as string,
            quoteRef: prefilledRef,
            material: prefilledMaterial,
            process: prefilledProcess,
            quantity: prefilledQty,
            estimate: prefilledEstimate,
            requestDate: new Date().toISOString(),
        };

        const docRef = doc(db, 'consultationRequests', id);

        try {
            setDocumentNonBlocking(docRef, requestData, { merge: true });
            setIsSubmitted(true);
            toast({
                title: "Request Sent!",
                description: "Our experts will contact you within 24 hours.",
            });
        } catch (err) {
            toast({
                title: "Submission failed",
                description: "Something went wrong while sending your request.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="pt-32 pb-20 px-4 container mx-auto">
            <div className="max-w-xl mx-auto">
                <h1 className="text-3xl  font-bold text-white mb-2 tracking-wide uppercase">Talk to a Manufacturing Expert</h1>
                <p className="text-cyan-100/60 mb-8 text-sm">
                    Get your design reviewed, value-engineered, or fully optimised by our in-house manufacturing experts.
                </p>

                {isSubmitted ? (
                    <div className="py-16 flex flex-col items-center justify-center text-center bg-zinc-900/50 rounded-2xl border border-white/10">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                            <Check className="w-7 h-7 text-green-400" />
                        </div>
                        <p className="text-zinc-500 text-sm max-w-sm">One of our engineers will reach out to you within the next 24 hours to discuss your project.</p>
                    </div>
                ) : (isUserLoading || !user) ? (
                    <div className="py-24 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mb-4" />
                        <p className="text-zinc-500 text-sm">Verifying Session...</p>
                    </div>
                ) : (
                    <div className="bg-[#040f25]/40 border border-white/10 p-6 sm:p-8 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-md relative overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 opacity-50"></div>

                        <form onSubmit={handleConsultationSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="name" className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">Name</label>
                                    <Input id="name" name="name" defaultValue={user?.displayName || ''} required className="bg-[#020617] border-white/10 text-white placeholder:text-zinc-600 focus:border-cyan-500/50 focus:ring-cyan-500/20 h-12 text-sm rounded-xl transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="phone" className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">Phone</label>
                                    <Input id="phone" name="phone" required className="bg-[#020617] border-white/10 text-white placeholder:text-zinc-600 focus:border-cyan-500/50 focus:ring-cyan-500/20 h-12 text-sm rounded-xl transition-all" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">Email</label>
                                <Input id="email" name="email" type="email" defaultValue={user?.email || ''} required className="bg-[#020617] border-white/10 text-white placeholder:text-zinc-600 focus:border-cyan-500/50 focus:ring-cyan-500/20 h-12 text-sm rounded-xl transition-all" />
                            </div>

                            {prefilledRef && (
                                <div className="p-4 bg-cyan-950/30 border border-cyan-500/20 rounded-xl flex items-start gap-3 mt-4 mb-4 shadow-inner">
                                    <FileText className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-cyan-50 mb-1 font-consolas">Quote {prefilledRef} Attached</p>
                                        <p className="text-xs text-cyan-200/70">Our engineers will have access to your estimated pricing, material choices, and quantities for faster context.</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5 pt-2">
                                <label htmlFor="message" className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">Project Brief & Questions</label>
                                <Textarea id="message" name="message" defaultValue={defaultMessage} required placeholder="Describe your design, material, quantity, and any DFM questions..." className="bg-[#020617] border-white/10 text-white placeholder:text-zinc-600 focus:border-cyan-500/50 focus:ring-cyan-500/20 min-h-[120px] text-sm rounded-xl resize-none transition-all" />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 font-bold text-base bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl mt-4 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Request Expert Consultation'}
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ConsultationPage() {
    return (
        <div className="min-h-screen bg-[#020617] font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden">
            {/* Background Grid & Glows */}
            <div className="absolute inset-0 bg-[#020617]" style={{
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '30px 30px'
            }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-900/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10">
                <LandingNav />
                
                <div className="container mx-auto px-4 pt-24 pb-0">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </div>

                <Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center pt-24">
                        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                    </div>
                }>
                    <ConsultationPageContent />
                </Suspense>
            </div>
        </div>
    );
}
