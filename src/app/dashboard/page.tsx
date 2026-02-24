
"use client"

import { useState, useEffect } from 'react';
import { LandingNav } from '@/components/LandingNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
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
  History,
  TrendingUp,
  AlertCircle,
  Gavel
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const STATUS_MAP: Record<string, { label: string, color: string, icon: any }> = {
  rfq_submitted: { label: 'RFQ Submitted', color: 'bg-blue-500/10 text-blue-500', icon: FileText },
  quotation_sent: { label: 'Reviewing Quotes', color: 'bg-yellow-500/10 text-yellow-500', icon: CreditCard },
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
  
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [negotiatingQuote, setNegotiatingQuote] = useState<any>(null);
  const [negPrice, setNegPrice] = useState('');
  const [negLeadTime, setNegLeadTime] = useState('');
  const [negMessage, setNegMessage] = useState('');

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
    return query(
      collection(db, 'quotations'), 
      where('rfqId', '==', selectedOrder.id),
      where('userId', '==', user.uid)
    );
  }, [db, user?.uid, selectedOrder?.id]);
  
  const { data: quotations } = useCollection(quotationQuery);

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

  const handleSelectVendor = (quotation: any) => {
    if (!db || !selectedOrder) return;
    setIsConfirming(true);
    
    updateDocumentNonBlocking(doc(db, 'rfqs', selectedOrder.id), { 
      status: 'order_confirmed',
      vendorId: quotation.vendorId,
      finalPrice: quotation.quotedPrice,
      finalLeadTime: quotation.leadTimeDays,
      updatedAt: new Date().toISOString()
    });

    updateDocumentNonBlocking(doc(db, 'quotations', quotation.id), { 
      status: 'accepted',
      updatedAt: new Date().toISOString()
    });

    setIsConfirming(false);
    toast({ title: "Vendor Selected!", description: "Production phase has been triggered." });
  };

  const handleProposeNegotiation = () => {
    if (!db || !negotiatingQuote) return;
    
    const historyItem = {
      party: 'user',
      price: Number(negPrice),
      leadTime: Number(negLeadTime),
      message: negMessage,
      createdAt: new Date().toISOString(),
    };

    const newHistory = [...(negotiatingQuote.negotiationHistory || []), historyItem];

    updateDocumentNonBlocking(doc(db, 'quotations', negotiatingQuote.id), {
      status: 'negotiating',
      negotiationHistory: newHistory,
      updatedAt: new Date().toISOString()
    });

    updateDocumentNonBlocking(doc(db, 'rfqs', selectedOrder!.id), {
      status: 'negotiation',
      updatedAt: new Date().toISOString()
    });

    setIsNegotiating(false);
    setNegotiatingQuote(null);
    toast({ title: "Proposal Sent", description: "The vendor will review your counter-offer." });
  };

  if (isUserLoading || !user) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <LandingNav />
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight text-white">Project Hub</h1>
            <p className="text-muted-foreground mt-1 text-lg">Manage your manufacturing pipeline.</p>
          </div>
          <Button size="lg" className="h-12 px-8 font-bold" onClick={() => router.push('/upload')}><Plus className="w-5 h-5 mr-2" /> Start New Design</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
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
                            <p className="font-bold text-lg text-white">{order.projectName || 'Untitled Design'}</p>
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
                  <CardHeader><CardTitle className="text-white">Profile Details</CardTitle><CardDescription>Information used for your RFQ submissions.</CardDescription></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1"><Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Full Name</Label><p className="font-medium text-lg text-white">{profile?.fullName}</p></div>
                      <div className="space-y-1"><Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Email Address</Label><p className="font-medium text-lg text-white">{profile?.email || user.email}</p></div>
                      <div className="space-y-1"><Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Phone Number</Label><p className="font-medium text-lg text-white">{profile?.phone}</p></div>
                      <div className="space-y-1"><Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Organization</Label><p className="font-medium text-lg text-white">{profile?.teamName}</p></div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {selectedOrder ? (
              <div className="space-y-6 sticky top-24">
                <Card className="bg-card border-white/5 shadow-2xl">
                  <CardHeader className="border-b border-white/5 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="bg-secondary/10 text-secondary border-none uppercase tracking-tighter font-bold">{selectedOrder.manufacturingProcess}</Badge>
                      <Badge variant="outline" className="text-xs">{STATUS_MAP[selectedOrder.status]?.label}</Badge>
                    </div>
                    <CardTitle className="text-xl text-white">{selectedOrder.projectName}</CardTitle>
                    <CardDescription className="text-xs">{selectedOrder.deliveryLocation}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4 text-xs mb-6">
                      <div className="p-3 bg-background rounded-lg border border-white/5">
                        <p className="text-muted-foreground mb-1">Material</p>
                        <p className="font-bold text-white uppercase">{selectedOrder.material}</p>
                      </div>
                      <div className="p-3 bg-background rounded-lg border border-white/5">
                        <p className="text-muted-foreground mb-1">Quantity</p>
                        <p className="font-bold text-white">{selectedOrder.quantity} units</p>
                      </div>
                    </div>

                    {(selectedOrder.status === 'rfq_submitted' || selectedOrder.status === 'quotation_sent' || selectedOrder.status === 'negotiation') && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-secondary" /> Received Quotations
                          </h3>
                          <Badge className="bg-primary/20 text-primary">{quotations?.length || 0} Offers</Badge>
                        </div>
                        
                        {quotations && quotations.length > 0 ? (
                          <div className="space-y-4">
                            {quotations.map((quote) => {
                              const lastNeg = quote.negotiationHistory?.[quote.negotiationHistory.length - 1];
                              const isCounter = lastNeg?.party === 'vendor';
                              
                              return (
                                <Card key={quote.id} className="bg-background border-white/10 hover:border-secondary/30 transition-all overflow-hidden">
                                  <div className="p-4 space-y-4">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-bold text-white">{quote.vendorName || 'MechMaster'}</p>
                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                                          <TrendingUp className="w-3 h-3 text-yellow-500" />
                                          {quote.vendorRating || '4.5'} Rating
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-xl font-bold text-secondary">₹{quote.quotedPrice.toLocaleString()}</p>
                                        <p className="text-[10px] text-muted-foreground">Lead Time: {quote.leadTimeDays} Days</p>
                                      </div>
                                    </div>

                                    {isCounter && (
                                      <div className="bg-secondary/5 border border-secondary/20 p-3 rounded-lg flex items-start gap-3">
                                        <AlertCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                                        <div className="text-xs">
                                          <p className="font-bold text-secondary mb-1">Counter-Proposal Received</p>
                                          <p className="text-muted-foreground italic">"{lastNeg.message}"</p>
                                        </div>
                                      </div>
                                    )}

                                    <div className="flex gap-2">
                                      <Button 
                                        className="flex-1 font-bold h-10 text-xs"
                                        onClick={() => handleSelectVendor(quote)}
                                        disabled={isConfirming}
                                      >
                                        {isConfirming ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Check className="w-3 h-3 mr-1" />}
                                        Accept Project
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        className="flex-1 font-bold h-10 text-xs border-white/10"
                                        onClick={() => {
                                          setNegotiatingQuote(quote);
                                          setNegPrice(quote.quotedPrice.toString());
                                          setNegLeadTime(quote.leadTimeDays.toString());
                                          setIsNegotiating(true);
                                        }}
                                      >
                                        <MessageSquare className="w-3 h-3 mr-1" /> Negotiate
                                      </Button>
                                    </div>
                                  </div>
                                </Card>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-8 text-center bg-card/50 rounded-xl border border-dashed border-white/10">
                            <Clock className="w-8 h-8 mx-auto text-muted-foreground opacity-30 mb-3 animate-pulse" />
                            <p className="text-xs text-muted-foreground">Waiting for MechMasters to review your design and submit competitive bids.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedOrder.status === 'order_confirmed' && (
                      <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-center space-y-4">
                        <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto"><Check className="text-green-500 w-8 h-8" /></div>
                        <p className="text-xl font-bold text-white">Project Secured</p>
                        <p className="text-sm text-muted-foreground">Vendor is preparing materials for production. You will be notified of shipping updates.</p>
                      </div>
                    )}

                    {selectedOrder.status === 'shipping' && (
                      <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-center space-y-4">
                        <div className="w-14 h-14 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto animate-bounce"><Truck className="text-orange-500 w-8 h-8" /></div>
                        <p className="text-xl font-bold text-white">In Transit</p>
                        <p className="text-sm text-muted-foreground">Your precision parts have left the facility and are being delivered to your location.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground border-2 border-dashed border-white/5 rounded-2xl p-10 text-center">
                Select a project from the hub to manage bids, negotiate with vendors, and track production.
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isOnboardingOpen} onOpenChange={setIsOnboardingOpen}>
        <DialogContent className="bg-card text-foreground border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold text-white">Complete Your Profile</DialogTitle>
            <DialogDescription>Let's finalize your information to ensure smooth manufacturing coordination.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOnboardingSubmit} className="space-y-4 py-4">
            <div className="space-y-2"><Label className="text-white">Full Name</Label><Input name="fullName" required placeholder="e.g. John Doe" className="bg-background" /></div>
            <div className="space-y-2"><Label className="text-white">Phone Number</Label><Input name="phone" required placeholder="+91 00000 00000" className="bg-background" /></div>
            <div className="space-y-2"><Label className="text-white">Organization / Institution</Label><Input name="teamName" required placeholder="e.g. Startup Name" className="bg-background" /></div>
            <Button type="submit" className="w-full h-12 font-bold mt-4" disabled={isSubmittingProfile}>
              {isSubmittingProfile ? <Loader2 className="animate-spin" /> : "Save Profile & Continue"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isNegotiating} onOpenChange={setIsNegotiating}>
        <DialogContent className="bg-card text-foreground border-white/10 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold text-white">Negotiate Terms</DialogTitle>
            <DialogDescription>Propose your preferred price and timeline to the MechMaster.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Target Price (₹)</Label>
                <Input value={negPrice} onChange={(e) => setNegPrice(e.target.value)} type="number" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Target Lead Time (Days)</Label>
                <Input value={negLeadTime} onChange={(e) => setNegLeadTime(e.target.value)} type="number" className="bg-background" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Message to Vendor</Label>
              <Textarea 
                value={negMessage} 
                onChange={(e) => setNegMessage(e.target.value)} 
                placeholder="Explain why you are requesting these changes..." 
                className="bg-background min-h-[100px]"
              />
            </div>

            {negotiatingQuote?.negotiationHistory?.length > 0 && (
              <div className="space-y-3">
                <Label className="text-white uppercase text-[10px] font-bold">Negotiation History</Label>
                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                  {negotiatingQuote.negotiationHistory.map((item: any, i: number) => (
                    <div key={i} className={`p-2 rounded text-[10px] ${item.party === 'user' ? 'bg-primary/10 border-l-2 border-primary ml-4' : 'bg-secondary/10 border-l-2 border-secondary mr-4'}`}>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="capitalize">{item.party} Proposal</span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p>Price: ₹{item.price} • Time: {item.leadTime} Days</p>
                      {item.message && <p className="italic mt-1 text-muted-foreground">"{item.message}"</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsNegotiating(false)} className="border-white/10">Cancel</Button>
            <Button onClick={handleProposeNegotiation} className="bg-primary text-white font-bold">Send Counter-Proposal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
