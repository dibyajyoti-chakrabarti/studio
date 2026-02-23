
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
import { collection, query, where, doc } from 'firebase/firestore';
import { 
  FileText, 
  Clock, 
  ChevronRight, 
  Plus, 
  Loader2, 
  Check,
  CreditCard,
  Truck,
  MessageSquare,
  Package,
  History
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const STATUS_MAP: Record<string, { label: string, color: string, icon: any }> = {
  rfq_submitted: { label: 'RFQ Submitted', color: 'bg-blue-500/10 text-blue-500', icon: FileText },
  quotation_sent: { label: 'Quotation Received', color: 'bg-yellow-500/10 text-yellow-500', icon: CreditCard },
  negotiation: { label: 'Negotiation', color: 'bg-purple-500/10 text-purple-500', icon: MessageSquare },
  order_confirmed: { label: 'Order Confirmed', color: 'bg-green-500/10 text-green-500', icon: Check },
  shipping: { label: 'Shipping', color: 'bg-orange-500/10 text-orange-500', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-teal-500/10 text-teal-500', icon: Package },
};

export default function UserDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const userProfileRef = useMemoFirebase(() => user && db ? doc(db, 'users', user.uid) : null, [db, user?.uid]);
  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  const rfqsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'rfqs'), where('userId', '==', user.uid));
  }, [db, user?.uid]);
  
  const { data: rfqs, isLoading: isRfqsLoading } = useCollection(rfqsQuery);

  useEffect(() => {
    if (!isUserLoading && !user) router.push('/login');
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (rfqs?.length && !selectedOrderId) setSelectedOrderId(rfqs[0].id);
  }, [rfqs, selectedOrderId]);

  useEffect(() => {
    if (!isProfileLoading && user && profile && profile.onboarded === false) {
      setIsOnboardingOpen(true);
    }
  }, [isProfileLoading, profile, user]);

  const selectedOrder = rfqs?.find(r => r.id === selectedOrderId);
  
  const quotationQuery = useMemoFirebase(() => {
    if (!db || !user || !selectedOrder) return null;
    return query(collection(db, 'quotations'), where('rfqId', '==', selectedOrder.id));
  }, [db, user?.uid, selectedOrder?.id]);
  
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
    
    updateDocumentNonBlocking(doc(db, 'users', user.uid), profileData);
    setIsOnboardingOpen(false);
    setIsSubmittingProfile(false);
    toast({ title: "Profile Completed!", description: `Ready to build, ${profileData.fullName}.` });
  };

  const handleAcceptQuote = () => {
    if (!db || !selectedOrder) return;
    setIsConfirming(true);
    updateDocumentNonBlocking(doc(db, 'rfqs', selectedOrder.id), { 
      status: 'order_confirmed',
      updatedAt: new Date().toISOString()
    });
    if (activeQuotation) {
      updateDocumentNonBlocking(doc(db, 'quotations', activeQuotation.id), { status: 'accepted' });
    }
    setIsConfirming(false);
    toast({ title: "Order Placed!", description: "Production phase has been triggered." });
  };

  if (isUserLoading || !user) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <LandingNav />
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Project Hub</h1>
            <p className="text-muted-foreground mt-1 text-lg">Manage your manufacturing pipeline.</p>
          </div>
          <Button size="lg" className="h-12 px-8 font-bold" onClick={() => router.push('/upload')}><Plus className="w-5 h-5 mr-2" /> Start New Design</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Tabs defaultValue="projects" className="space-y-6">
              <TabsList className="bg-card border border-white/10 p-1">
                <TabsTrigger value="projects" className="px-6 font-bold">Active Projects</TabsTrigger>
                <TabsTrigger value="profile" className="px-6 font-bold">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="space-y-4">
                {isRfqsLoading ? (
                  <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                ) : rfqs?.length ? rfqs.map((order) => {
                  const statusInfo = STATUS_MAP[order.status] || { label: 'Processing', color: 'bg-muted', icon: History };
                  const StatusIcon = statusInfo.icon;
                  return (
                    <Card 
                      key={order.id} 
                      className={`bg-card border-white/5 cursor-pointer transition-all ${selectedOrderId === order.id ? 'ring-2 ring-primary shadow-xl' : 'hover:border-primary/50'}`}
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${statusInfo.color}`}><StatusIcon className="w-6 h-6" /></div>
                          <div>
                            <p className="font-bold text-lg">{order.projectName || 'Untitled Design'}</p>
                            <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                              <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                              <Badge variant="outline" className={`border-none ${statusInfo.color} font-bold`}>{statusInfo.label}</Badge>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  );
                }) : (
                  <div className="text-center py-20 bg-card/50 rounded-2xl border border-dashed border-white/10 space-y-4">
                    <History className="w-12 h-12 mx-auto text-muted-foreground opacity-20" />
                    <p className="text-muted-foreground">You haven't submitted any designs yet.</p>
                    <Button variant="outline" onClick={() => router.push('/upload')}>Submit Your First Design</Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="profile" className="space-y-6">
                <Card className="bg-card border-white/5">
                  <CardHeader><CardTitle>Profile Details</CardTitle><CardDescription>Information used for your RFQ submissions.</CardDescription></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1"><Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Full Name</Label><p className="font-medium text-lg">{profile?.fullName}</p></div>
                      <div className="space-y-1"><Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Email Address</Label><p className="font-medium text-lg">{profile?.email || user.email}</p></div>
                      <div className="space-y-1"><Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Phone Number</Label><p className="font-medium text-lg">{profile?.phone}</p></div>
                      <div className="space-y-1"><Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Organization</Label><p className="font-medium text-lg">{profile?.teamName}</p></div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {selectedOrder ? (
              <Card className="bg-card border-white/5 sticky top-24">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">Specifications</CardTitle>
                    <Badge className="bg-secondary/10 text-secondary border-none">{selectedOrder.manufacturingProcess}</Badge>
                  </div>
                  <CardDescription>{selectedOrder.projectName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-muted-foreground">Material:</span> <span className="font-bold">{selectedOrder.material}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-muted-foreground">Quantity:</span> <span className="font-bold">{selectedOrder.quantity} units</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-muted-foreground">Location:</span> <span className="font-bold">{selectedOrder.deliveryLocation}</span></div>
                    <div className="flex justify-between pb-2"><span className="text-muted-foreground">Tolerance:</span> <span className="font-bold">{selectedOrder.tolerance}</span></div>
                  </div>

                  {selectedOrder.status === 'quotation_sent' && activeQuotation && (
                    <div className="p-5 bg-primary/10 border border-primary/20 rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-primary flex items-center gap-2"><CreditCard className="w-4 h-4" /> Final Quote</p>
                        <Badge variant="outline" className="border-primary/30 text-[10px]">VERIFIED</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1"><p className="text-[10px] text-muted-foreground font-bold">PRICE</p><p className="font-bold text-lg">₹{activeQuotation.quotedPrice.toLocaleString()}</p></div>
                        <div className="space-y-1"><p className="text-[10px] text-muted-foreground font-bold">LEAD TIME</p><p className="font-bold text-lg">{activeQuotation.leadTimeDays} Days</p></div>
                      </div>
                      {activeQuotation.notes && <div className="p-3 bg-background/50 rounded text-xs italic text-muted-foreground">Note: {activeQuotation.notes}</div>}
                      <Button className="w-full h-11 font-bold shadow-lg shadow-primary/20" onClick={handleAcceptQuote} disabled={isConfirming}>
                        {isConfirming ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Accept & Confirm Order
                      </Button>
                    </div>
                  )}

                  {selectedOrder.status === 'order_confirmed' && (
                    <div className="p-5 bg-green-500/10 border border-green-500/20 rounded-xl text-center space-y-3">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto"><Check className="text-green-500 w-6 h-6" /></div>
                      <p className="text-lg font-bold">Order Confirmed</p>
                      <p className="text-xs text-muted-foreground">The assigned MechMaster has started production. We'll update you when it ships.</p>
                    </div>
                  )}

                  {selectedOrder.status === 'shipping' && (
                    <div className="p-5 bg-orange-500/10 border border-orange-500/20 rounded-xl text-center space-y-3">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto animate-bounce"><Truck className="text-orange-500 w-6 h-6" /></div>
                      <p className="text-lg font-bold">In Transit</p>
                      <p className="text-xs text-muted-foreground">Your parts are on their way to {selectedOrder.deliveryLocation}.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground border-2 border-dashed border-white/5 rounded-2xl p-10 text-center">
                Select a project from the left to view detailed status and specifications.
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isOnboardingOpen} onOpenChange={setIsOnboardingOpen}>
        <DialogContent className="bg-card text-foreground border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold">Complete Your Profile</DialogTitle>
            <DialogDescription>Let's finalize your information to ensure smooth manufacturing coordination.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOnboardingSubmit} className="space-y-4 py-4">
            <div className="space-y-2"><Label>Full Name</Label><Input name="fullName" required placeholder="e.g. John Doe" /></div>
            <div className="space-y-2"><Label>Phone Number</Label><Input name="phone" required placeholder="+91 00000 00000" /></div>
            <div className="space-y-2"><Label>Organization / Institution</Label><Input name="teamName" required placeholder="e.g. Startup Name or College Team" /></div>
            <Button type="submit" className="w-full h-12 font-bold mt-4" disabled={isSubmittingProfile}>
              {isSubmittingProfile ? <Loader2 className="animate-spin" /> : "Save Profile & Continue"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
