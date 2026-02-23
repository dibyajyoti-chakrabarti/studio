
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, MapPin, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { MOCK_VENDORS } from '../lib/mock-data';
import { LandingNav } from '@/components/LandingNav';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';

export default function MatchingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const [loading, setLoading] = useState(true);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user profile for RFQ submission
  const userProfileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);
  const { data: profile } = useDoc(userProfileRef);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Filter vendors with rating >= 4.5 by default for "high rating" recommendation
  const recommendedVendors = MOCK_VENDORS.sort((a, b) => b.rating - a.rating);

  const toggleVendor = (id: string) => {
    setSelectedVendors(prev => 
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selectedVendors.length < 1) {
      toast({
        title: "Selection Required",
        description: "Please select at least 1 vendor to request a quotation.",
        variant: "destructive"
      });
      return;
    }

    const details = JSON.parse(localStorage.getItem('pendingRfqDetails') || '{}');
    if (!details.projectName) {
      toast({ title: "Session Expired", description: "Design details missing. Please re-upload.", variant: "destructive" });
      router.push('/upload');
      return;
    }

    const rfqData = {
      userId: user?.uid || null,
      userName: profile?.fullName || user?.displayName || 'Guest User',
      userEmail: user?.email || '',
      userPhone: profile?.phone || '',
      teamName: profile?.teamName || '',
      projectName: details.projectName,
      manufacturingProcess: details.process,
      material: details.material,
      quantity: Number(details.quantity),
      surfaceFinish: details.surfaceFinish || '',
      tolerance: details.tolerance,
      deliveryDate: details.deliveryDate,
      budgetRange: details.budget || '',
      deliveryLocation: details.location,
      selectedVendors: selectedVendors.map(id => MOCK_VENDORS.find(v => v.id === id)?.name || id),
      status: 'rfq_submitted',
      vendorId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!user) {
      localStorage.setItem('pendingRfqToSubmit', JSON.stringify(rfqData));
      toast({
        title: "Almost there!",
        description: "Sign in to submit your project and track vendor quotes.",
      });
      router.push('/login?redirect=/dashboard');
      return;
    }

    setIsSubmitting(true);
    if (db) {
      addDocumentNonBlocking(collection(db, 'rfqs'), rfqData);
      localStorage.removeItem('pendingRfqDetails');
      toast({
        title: "RFQ Submitted Successfully!",
        description: "MechMasters are reviewing your design. We'll notify you soon.",
      });
      router.push('/dashboard');
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Sparkles className="w-12 h-12 text-secondary animate-pulse mb-4" />
        <h2 className="text-2xl font-headline font-bold mb-2">Analyzing Design...</h2>
        <p className="text-muted-foreground">Our Matching Engine is finding specialized MechMasters for your project.</p>
        <div className="mt-8 flex gap-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <LandingNav />
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-secondary mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-widest">Recommended MechMasters</span>
            </div>
            <h1 className="font-headline text-3xl md:text-4xl font-bold">Matching Production Partners</h1>
            <p className="text-muted-foreground mt-2">Select the vendors you'd like to receive competitive quotations from.</p>
          </div>
          <div className="bg-secondary/10 border border-secondary/20 p-4 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-secondary w-5 h-5 shrink-0" />
            <p className="text-sm">We recommend selecting at least <b>3 vendors</b> for the best pricing results.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {recommendedVendors.map((vendor) => (
            <div 
              key={vendor.id} 
              className={`relative cursor-pointer group rounded-xl transition-all ${selectedVendors.includes(vendor.id) ? 'ring-2 ring-primary shadow-2xl shadow-primary/20' : ''}`}
              onClick={() => toggleVendor(vendor.id)}
            >
              <Card className="overflow-hidden border-white/5 bg-card hover:bg-card/80 h-full">
                <div className="relative h-44">
                  <Image 
                    src={vendor.image} 
                    alt={vendor.name} 
                    fill 
                    className="object-cover transition-transform group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute top-3 left-3">
                    <Checkbox checked={selectedVendors.includes(vendor.id)} className="w-6 h-6 border-white bg-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                  </div>
                  <div className="absolute top-3 right-3 bg-background/80 backdrop-blur px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    {vendor.rating}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-headline text-xl font-bold mb-2 group-hover:text-secondary transition-colors">{vendor.name}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3">
                    <MapPin className="w-3 h-3" />
                    {vendor.location}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {vendor.services.map((s, i) => (
                      <Badge key={i} variant="outline" className="text-[9px] border-white/10 uppercase font-bold">
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{vendor.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-md border-t border-white/5 flex items-center justify-center z-50">
          <div className="container max-w-6xl w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-medium flex items-center gap-2">
              <Badge variant="secondary" className="text-lg px-3">{selectedVendors.length}</Badge>
              <span className="text-muted-foreground">Vendors Selected for Quotation</span>
            </div>
            <Button 
              size="lg" 
              className="px-12 h-14 text-lg min-w-[240px] font-bold" 
              disabled={selectedVendors.length === 0 || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending Request...
                </>
              ) : (
                'Request Quotations'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
