"use client"

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LandingNav } from '@/components/LandingNav';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useFirestore, setDocumentNonBlocking, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Check, Loader2, FileText, ArrowRight } from 'lucide-react';
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
                <h1 className="text-3xl font-headline font-bold text-white mb-2">Talk to a Manufacturing Expert</h1>
                <p className="text-zinc-400 mb-8 text-sm">
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
                    <div className="bg-zinc-900 border border-white/10 p-6 sm:p-8 rounded-2xl shadow-xl">
                        <form onSubmit={handleConsultationSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="name" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Name</label>
                                    <Input id="name" name="name" defaultValue={user?.displayName || ''} required className="bg-zinc-950 border-white/10 text-white placeholder:text-zinc-600 focus:border-cyan-500/40 h-11 text-sm rounded-xl" />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="phone" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Phone</label>
                                    <Input id="phone" name="phone" required className="bg-zinc-950 border-white/10 text-white placeholder:text-zinc-600 focus:border-cyan-500/40 h-11 text-sm rounded-xl" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Email</label>
                                <Input id="email" name="email" type="email" defaultValue={user?.email || ''} required className="bg-zinc-950 border-white/10 text-white placeholder:text-zinc-600 focus:border-cyan-500/40 h-11 text-sm rounded-xl" />
                            </div>

                            {prefilledRef && (
                                <div className="p-4 bg-blue-950/30 border border-blue-500/20 rounded-xl flex items-start gap-3 mt-4 mb-4">
                                    <FileText className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-blue-100 mb-1">Quote {prefilledRef} Attached</p>
                                        <p className="text-xs text-blue-300">Our engineers will have access to your estimated pricing, material choices, and quantities for faster context.</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5 pt-2">
                                <label htmlFor="message" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Project Brief & Questions</label>
                                <Textarea id="message" name="message" defaultValue={defaultMessage} required placeholder="Describe your design, material, quantity, and any DFM questions..." className="bg-zinc-950 border-white/10 text-white placeholder:text-zinc-600 focus:border-cyan-500/40 min-h-[120px] text-sm rounded-xl resize-none" />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 font-bold text-base bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl mt-4"
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
        <div className="min-h-screen bg-zinc-950 font-sans">
            <LandingNav />
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center pt-24">
                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                </div>
            }>
                <ConsultationPageContent />
            </Suspense>
        </div>
    );
}
