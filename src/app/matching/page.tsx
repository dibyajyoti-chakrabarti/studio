
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, MapPin, Loader2, Sparkles, AlertCircle, Users, ShieldCheck, Factory, Clock } from 'lucide-react';
import { LandingNav } from '@/components/LandingNav';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';

export default function MatchingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const [loading, setLoading] = useState(true);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter for ACTIVE vendors only
  const vendorsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'users'),
      where('role', '==', 'vendor'),
      where('isActive', '==', true)
    );
  }, [db]);

  const { data: dbVendors, isLoading: isVendorsLoading } = useCollection(vendorsQuery);

  const userProfileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);
  const { data: profile } = useDoc(userProfileRef);

  useEffect(() => {
    if (!isVendorsLoading) {
      const timer = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isVendorsLoading]);

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

    const selectedVendorObjects = dbVendors?.filter(v => selectedVendors.includes(v.id)) || [];

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
      designFileName: details.designFileName || 'unnamed_design',
      designFileUrl: details.designFileUrl || null,
      selectedVendorIds: selectedVendors,
      shortlistedVendorIds: selectedVendors, // Initially shortlist all invited
      assignedVendorId: null,
      status: 'submitted',
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
        description: "Selected MechMasters have been notified to review your design.",
      });
      router.push('/dashboard');
    }
    setIsSubmitting(false);
  };

  if (loading || isVendorsLoading) {
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
            <h1 className="font-headline text-3xl md:text-4xl font-bold text-white">Invite Production Partners</h1>
            <p className="text-muted-foreground mt-2">Select multiple vendors to receive competitive quotations and ensure the best price.</p>
          </div>
          <div className="bg-secondary/10 border border-secondary/20 p-4 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-secondary w-5 h-5 shrink-0" />
            <p className="text-sm">We recommend selecting <b>3-5 vendors</b> for optimal bidding results.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {dbVendors && dbVendors.length > 0 ? dbVendors.map((vendor) => (
            <div
              key={vendor.id}
              className={`relative cursor-pointer group rounded-xl transition-all ${selectedVendors.includes(vendor.id) ? 'ring-2 ring-primary shadow-2xl shadow-primary/20' : 'hover:shadow-xl hover:shadow-primary/5'}`}
              onClick={() => toggleVendor(vendor.id)}
            >
              <Card className="overflow-hidden border-white/5 bg-gradient-to-b from-card to-background hover:bg-card/80 h-full">
                <div className="relative h-48 bg-muted/20 flex items-center justify-center">
                  <Image
                    src={vendor.imageUrl || "/mechhub.png"}
                    alt={vendor.fullName || 'Verified MechMaster Profile Image'}
                    fill
                    className="object-cover transition-transform group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />

                  {vendor.isVerified && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-secondary/90 text-background px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg">
                      <ShieldCheck className="w-3 h-3" /> VERIFIED
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                    <Checkbox checked={selectedVendors.includes(vendor.id)} className="w-6 h-6 border-white bg-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                    <div className="bg-background/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 border border-white/10 shadow-lg">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      {vendor.rating || 4.5}/5
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-headline text-xl font-bold group-hover:text-secondary transition-colors truncate pr-2 text-white">
                      {vendor.teamName || vendor.fullName || 'Verified MechMaster'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-4">
                    <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-secondary" /> {vendor.location || 'Location Pending'}</div>
                    <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-secondary" /> {vendor.experienceYears || '0'}+ Yrs Exp</div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6 min-h-12">
                    {(vendor.specializations && vendor.specializations.length > 0 ? vendor.specializations : ['CNC Machining', 'Sheet Metal']).map((s: string, i: number) => (
                      <Badge key={i} variant="outline" className="rounded-full bg-secondary/5 text-secondary border-secondary/20 px-3 py-1 text-[9px] font-bold uppercase tracking-wider">
                        {s}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic border-l-2 border-secondary/20 pl-3 min-h-8">
                    {vendor.portfolio || 'Verified high-precision manufacturing facility within our trusted network.'}
                  </p>
                </CardContent>
              </Card>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <Users className="w-12 h-12 mx-auto text-muted-foreground opacity-20" />
              <p className="text-muted-foreground italic">No MechMasters are currently available for selection. Please check back soon.</p>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-md border-t border-white/5 flex items-center justify-center z-50">
          <div className="container max-w-6xl w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-medium flex items-center gap-2">
              <Badge variant="secondary" className="text-lg px-3">{selectedVendors.length}</Badge>
              <span className="text-muted-foreground font-bold uppercase tracking-widest text-[11px]">Vendors Selected for Bidding</span>
            </div>
            <Button
              size="lg"
              className="px-12 h-14 text-lg min-w-[240px] font-bold uppercase tracking-widest"
              disabled={selectedVendors.length === 0 || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending Invitations...
                </>
              ) : (
                'Request Multi-Vendor Quotes'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
