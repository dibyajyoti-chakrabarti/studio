
"use client"

import { useState, useEffect } from 'react';
import { LandingNav } from '@/components/LandingNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
} from '@/components/ui/dialog';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { useRouter } from 'next/navigation';
import { collection, query, where, orderBy, doc } from 'firebase/firestore';
import { 
  FileText, 
  Clock, 
  ChevronRight, 
  Plus, 
  Loader2, 
  Check,
  CreditCard,
  Truck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UserDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  // Memoize user profile reference
  const userProfileRef = useMemoFirebase(() => user && db ? doc(db, 'users', user.uid) : null, [db, user?.uid]);
  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  // Memoize RFQs query - STRICTLY FILTERED BY USERID TO PREVENT PERMISSION ERRORS
  const rfqsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'rfqs'), 
      where('userId', '==', user.uid), 
      orderBy('createdAt', 'desc')
    );
  }, [db, user?.uid]);
  const { data: rfqs, isLoading: isRfqsLoading } = useCollection(rfqsQuery);

  useEffect(() => {
    if (!isUserLoading && !user) router.push('/login');
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (rfqs?.length && !selectedOrderId) setSelectedOrderId(rfqs[0].id);
  }, [rfqs, selectedOrderId]);

  useEffect(() => {
    // Only show onboarding if the profile check is complete and user is not onboarded
    if (!isProfileLoading && user && profile && !profile.onboarded) {
      setIsOnboardingOpen(true);
    }
  }, [isProfileLoading, profile, user]);

  const selectedOrder = rfqs?.find(r => r.id === selectedOrderId);
  
  // Memoize quotations query
  const quotationQuery = useMemoFirebase(() => {
    if (!db || !selectedOrder?.quotationId) return null;
    return query(collection(db, 'quotations'), where('rfqId', '==', selectedOrder.id));
  }, [db, selectedOrder?.id, selectedOrder?.quotationId]);
  const { data: quotations } = useCollection(quotationQuery);
  const activeQuotation = quotations?.[0];

  const handleOnboardingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db || !user) return;
    setIsSubmittingProfile(true);
    const formData = new FormData(e.currentTarget);
    const profileData = {
      fullName: formData.get('fullName') as string,
      phone: formData.get('phone') as string,
      teamName: formData.get('teamName') as string,
      onboarded: true,
      updatedAt: new Date().toISOString(),
    };
    
    const userRef = doc(db, 'users', user.uid);
    updateDocumentNonBlocking(userRef, profileData);
    
    setIsOnboardingOpen(false);
    setIsSubmittingProfile(false);
    toast({ title: "Welcome onboard!", description: `Glad to have you with us, ${profileData.fullName}.` });
  };

  const handleConfirmOrder = () => {
    if (!db || !selectedOrder) return;
    setIsConfirming(true);
    
    const rfqRef = doc(db, 'rfqs', selectedOrder.id);
    updateDocumentNonBlocking(rfqRef, { 
      status: 'confirmed',
      updatedAt: new Date().toISOString()
    });

    if (activeQuotation) {
      const quoteRef = doc(db, 'quotations', activeQuotation.id);
      updateDocumentNonBlocking(quoteRef, { status: 'accepted' });
    }

    setIsConfirming(false);
    toast({ title: "Order Confirmed!", description: "Production will start shortly." });
  };

  if (isUserLoading || !user) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <LandingNav />
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold">Welcome, {profile?.fullName || user.email?.split('@')[0]} 👋</h1>
            <p className="text-muted-foreground">Track your manufacturing projects from design to delivery.</p>
          </div>
          <Button variant="outline" onClick={() => router.push('/upload')}><Plus className="w-4 h-4 mr-2" /> New Project</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Tabs defaultValue="my-orders" className="space-y-6">
              <TabsList className="bg-card border border-white/5 p-1">
                <TabsTrigger value="my-orders">My Requests</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="my-orders" className="space-y-4">
                {isRfqsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : rfqs?.length ? rfqs.map((order) => (
                  <Card 
                    key={order.id} 
                    className={`bg-card border-white/5 cursor-pointer transition-all ${selectedOrderId === order.id ? 'border-primary' : 'hover:border-primary/50'}`}
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary"><FileText /></div>
                        <div>
                          <p className="font-bold">{order.projectName || 'Untitled Project'}</p>
                          <div className="text-sm text-muted-foreground flex gap-3">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                            <Badge variant="outline" className="capitalize">{order.status.replace('_', ' ')}</Badge>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                )) : <p className="text-center text-muted-foreground py-12">No projects found. Start by uploading a design!</p>}
              </TabsContent>

              <TabsContent value="profile" className="space-y-6">
                <Card className="bg-card border-white/5">
                  <CardHeader>
                    <CardTitle>My Profile</CardTitle>
                    <CardDescription>Your personal and team information.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Full Name</Label>
                        <p className="font-medium text-lg">{profile?.fullName || 'Not provided'}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="font-medium text-lg">{profile?.email || user.email}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Phone</Label>
                        <p className="font-medium text-lg">{profile?.phone || 'Not provided'}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Team / Organization</Label>
                        <p className="font-medium text-lg">{profile?.teamName || 'Not provided'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {selectedOrder && (
              <Card className="bg-card border-white/5">
                <CardHeader>
                  <CardTitle className="text-xl">Project Details</CardTitle>
                  <CardDescription>{selectedOrder.projectName || 'Untitled Project'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Process:</span> <span>{selectedOrder.manufacturingProcess}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Material:</span> <span>{selectedOrder.material}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Quantity:</span> <span>{selectedOrder.quantity}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Location:</span> <span>{selectedOrder.deliveryLocation}</span></div>
                  </div>

                  {selectedOrder.status === 'quotation_sent' && activeQuotation && (
                    <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-4">
                      <p className="text-sm font-bold text-primary flex items-center gap-2"><CreditCard className="w-4 h-4" /> Quotation Received</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Price:</div><div className="font-bold">₹{activeQuotation.quotedPrice}</div>
                        <div className="text-muted-foreground">Lead Time:</div><div className="font-bold">{activeQuotation.leadTimeDays} Days</div>
                      </div>
                      {activeQuotation.notes && <p className="text-xs italic text-muted-foreground">Note: {activeQuotation.notes}</p>}
                      <Button className="w-full" onClick={handleConfirmOrder} disabled={isConfirming}>
                        {isConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Order"}
                      </Button>
                    </div>
                  )}

                  {selectedOrder.status === 'confirmed' && (
                    <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-lg text-center">
                      <Check className="w-8 h-8 text-secondary mx-auto mb-2" />
                      <p className="text-sm font-bold">Order Confirmed</p>
                      <p className="text-xs text-muted-foreground">We're preparing your project for production.</p>
                    </div>
                  )}

                  {selectedOrder.status === 'in_production' && (
                    <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg text-center">
                      <Truck className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-pulse" />
                      <p className="text-sm font-bold">In Production</p>
                      <p className="text-xs text-muted-foreground">MechMasters are working on your parts.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isOnboardingOpen} onOpenChange={setIsOnboardingOpen}>
        <DialogContent className="bg-card text-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline">Hey Innovator, Let's know you a little</DialogTitle>
            <DialogDescription>Complete your profile to manage your manufacturing projects.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOnboardingSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input name="fullName" required placeholder="e.g. Rahul Sharma" />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input name="phone" required placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-2">
              <Label>College / Team / Startup</Label>
              <Input name="teamName" required placeholder="e.g. IIT Madras RoboTeam" />
            </div>
            <Button type="submit" className="w-full h-12" disabled={isSubmittingProfile}>
              {isSubmittingProfile ? <Loader2 className="animate-spin" /> : "Welcome Onboard"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
