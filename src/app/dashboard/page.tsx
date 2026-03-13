
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
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
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
  Gavel,
  Hammer,
  Zap,
  ShieldCheck,
  UserIcon,
  IndianRupee,
  Calculator,
  PhoneCall,
  CheckCircle2,
  MapPin,
  Layers,
  Hash,
  ShieldAlert
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { isAdmin } from '@/lib/auth-utils';


const STATUS_MAP: Record<string, { label: string, color: string, icon: any }> = {
  submitted: { label: 'MATCHING IN PROGRESS', color: 'bg-primary/20 text-primary', icon: Package },
  quotation_sent: { label: 'QUOTATION RECEIVED', color: 'bg-cyan-500/20 text-cyan-500', icon: FileText },
  quotations_received: { label: 'BIDS READY', color: 'bg-secondary/20 text-secondary', icon: FileText },
  under_negotiation: { label: 'NEGOTIATING', color: 'bg-yellow-500/20 text-yellow-500', icon: MessageSquare },
  accepted: { label: 'ADVANCE PAYMENT DUE', color: 'bg-orange-500/20 text-orange-400', icon: CreditCard },
  assigned: { label: 'ASSIGNED', color: 'bg-green-500/20 text-green-500', icon: Check },
  in_progress: { label: 'IN PRODUCTION', color: 'bg-blue-500/20 text-blue-500', icon: Hammer },
  shipped: { label: 'SHIPPED', color: 'bg-orange-500/20 text-orange-500', icon: Truck },
  delivered: { label: 'DELIVERED (PAYMENT DUE)', color: 'bg-indigo-500/20 text-indigo-400', icon: Package },
  completed: { label: 'COMPLETED', color: 'bg-purple-500/20 text-purple-500', icon: CheckCircle2 },
  rejected: { label: 'REJECTED', color: 'bg-red-500/20 text-red-500', icon: AlertCircle },
  cancelled: { label: 'CANCELLED', color: 'bg-red-500/20 text-red-500', icon: AlertCircle }
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
  const [isPayingAdvance, setIsPayingAdvance] = useState(false);
  const [isPayingCompletion, setIsPayingCompletion] = useState(false);

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

  const shopOrdersQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'orders'), where('userId', '==', user.uid));
  }, [db, user?.uid]);

  const { data: shopOrders, isLoading: isShopOrdersLoading } = useCollection(shopOrdersQuery);

  useEffect(() => {
    if (!isUserLoading && !user) router.push('/login');
  }, [user, isUserLoading, router]);

  // Intercept pending RFQs upon successful login
  useEffect(() => {
    if (user && db) {
      const pendingRfq = localStorage.getItem('pendingRfqToSubmit');
      if (pendingRfq) {
        try {
          const rfqData = JSON.parse(pendingRfq);
          rfqData.userId = user.uid;
          rfqData.userName = profile?.fullName || user.displayName || 'Guest User';
          rfqData.userEmail = user.email || '';
          rfqData.userPhone = profile?.phone || '';

          addDocumentNonBlocking(collection(db, 'rfqs'), rfqData);
          localStorage.removeItem('pendingRfqToSubmit');
          toast({ title: "Order Confirmed!", description: "Your pending order has been successfully saved to your dashboard." });
        } catch (e) {
          console.error("Failed to recover pending RFQ", e);
          localStorage.removeItem('pendingRfqToSubmit');
        }
      }
    }
  }, [user, db, profile, toast]);


  useEffect(() => {
    if (rfqs?.length && !selectedOrderId) setSelectedOrderId(rfqs[0].id);
  }, [rfqs, selectedOrderId]);

  useEffect(() => {
    // If profile exists and onboarded is explicitly false (or missing for a logged in user with profile), open modal
    if (!isProfileLoading && user && profile && (profile.onboarded === false || !profile.onboarded)) {
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
      designation: formData.get('designation') as string,
      location: formData.get('location') as string,
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
      status: 'accepted',
      assignedVendorId: quotation.vendorId,
      acceptedQuotationId: quotation.id,
      finalPrice: quotation.quotedPrice,
      finalLeadTime: quotation.leadTimeDays,
      // initialise paymentStatus so UI can check it reactively
      paymentStatus: { advance: null, completion: null },
      updatedAt: new Date().toISOString()
    });

    updateDocumentNonBlocking(doc(db, 'quotations', quotation.id), {
      status: 'accepted',
      updatedAt: new Date().toISOString()
    });

    setIsConfirming(false);
    toast({ title: "Offer Accepted!", description: "Please complete the advance payment to begin production." });
  };

  // ── Razorpay payment handler ───────────────────────────────────────────────
  const handlePayment = async (type: 'advance' | 'completion') => {
    if (!user || !selectedOrder) return;
    const setLoading = type === 'advance' ? setIsPayingAdvance : setIsPayingCompletion;
    setLoading(true);

    try {
      // Step 1: create a Razorpay order on the server
      const res = await fetch('/api/v1/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rfqId: selectedOrder.id, paymentType: type, userId: user.uid }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create payment order');
      }

      const orderData = await res.json();

      // Step 2: open Razorpay popup
      const RazorpayClass = (window as any).Razorpay;
      if (!RazorpayClass) {
        throw new Error('Payment gateway is still initializing. Please wait a moment and try again.');
      }

      const rzp = new RazorpayClass({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'MechHub',
        description: type === 'advance' ? '50% Advance Payment' : '50% Completion Payment',
        order_id: orderData.orderId,
        prefill: {
          name: orderData.customerName,
          email: orderData.customerEmail,
          contact: orderData.customerPhone,
        },
        theme: { color: '#2962FF' },
        handler: async (response: any) => {
          // Step 3: verify on server
          try {
            const verifyRes = await fetch('/api/v1/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                rfqId: selectedOrder.id,
                paymentType: type,
                userId: user.uid,
              }),
            });

            if (!verifyRes.ok) throw new Error('Payment verification failed');

            toast({
              title: type === 'advance' ? '✅ Advance Paid!' : '✅ Payment Complete!',
              description: type === 'advance'
                ? 'Your advance payment is confirmed. Production begins now.'
                : 'Final payment confirmed. Your order is complete!',
            });
          } catch {
            toast({ title: 'Verification Failed', description: 'Please contact support.', variant: 'destructive' });
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.open();
    } catch (err: any) {
      toast({ title: 'Payment Error', description: err.message, variant: 'destructive' });
      setLoading(false);
    }
  };

  const handleRejectQuotation = (quotation: any) => {
    if (!db || !selectedOrder || !confirm('Are you sure you want to reject this quotation?')) return;

    updateDocumentNonBlocking(doc(db, 'quotations', quotation.id), {
      status: 'rejected',
      updatedAt: new Date().toISOString()
    });

    updateDocumentNonBlocking(doc(db, 'rfqs', selectedOrder.id), {
      status: 'rejected',
      updatedAt: new Date().toISOString()
    });

    toast({ title: "Quotation Rejected", description: "The offer has been declined." });
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
      status: 'under_negotiation',
      updatedAt: new Date().toISOString()
    });

    setIsNegotiating(false);
    setNegotiatingQuote(null);
    toast({ title: "Proposal Sent", description: "The vendor will review your counter-offer." });
  };

  if (isUserLoading || !user) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#020617] font-sans text-zinc-300 relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[#020617]" style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }} />
      <LandingNav />
      <div className="container mx-auto px-4 relative z-10">
        {isAdmin(user?.email) && (
          <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-between backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-wider">Admin Access Detected</p>
                <p className="text-[10px] text-cyan-100/60 uppercase tracking-widest font-bold">You are currently in the customer view.</p>
              </div>
            </div>
            <Button 
              onClick={() => router.push('/admin')}
              className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl px-6 h-10 text-[10px] font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            >
              Go to Admin Panel
            </Button>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-6">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className=" text-3xl font-bold tracking-wide uppercase text-white shadow-cyan-500/20 drop-shadow-md">Project Hub</h1>
            <p className="text-cyan-100/60 mt-2 text-xs font-bold uppercase tracking-widest">Manage your manufacturing pipeline</p>
          </div>
          <div className="flex w-full md:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both" style={{ animationDelay: '100ms' }}>
            <Button
              className="h-11 px-6  tracking-widest uppercase text-[10px] font-bold bg-[#040f25]/50 hover:bg-cyan-950/30 text-white border border-white/10 hover:border-cyan-500/50 transition-all backdrop-blur-md"
              onClick={() => router.push('/consultation')}
            >
              <PhoneCall className="w-4 h-4 mr-2 text-cyan-400" /> Book Free Consultation
            </Button>
            <Button
              className="h-11 px-6  tracking-widest uppercase text-[10px] font-bold bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)]"
              onClick={() => router.push('/quote')}
            >
              <Calculator className="w-4 h-4 mr-2 text-cyan-400" /> Budget Estimator
            </Button>
            <Button
              className="h-11 px-6  tracking-widest uppercase text-[10px] font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all border-none"
              onClick={() => router.push('/upload')}
            >
              <Plus className="w-4 h-4 mr-2" /> Start New Design
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both" style={{ animationDelay: '200ms' }}>
            <Tabs defaultValue="projects" className="space-y-6">
              <TabsList className="bg-[#040f25]/40 backdrop-blur-md border border-white/10 p-1.5 rounded-xl shadow-inner w-full sm:w-auto flex">
                <TabsTrigger value="projects" className="px-6 data-[state=active]:bg-cyan-950/50 data-[state=active]:text-cyan-400 data-[state=active]:shadow-[0_0_15px_rgba(34,211,238,0.2)] rounded-lg transition-all font-bold tracking-widest uppercase text-[10px] flex-1">Project RFQs</TabsTrigger>
                <TabsTrigger value="shop_orders" className="px-6 data-[state=active]:bg-cyan-950/50 data-[state=active]:text-cyan-400 data-[state=active]:shadow-[0_0_15px_rgba(34,211,238,0.2)] rounded-lg transition-all font-bold tracking-widest uppercase text-[10px] flex-1">Shop Orders</TabsTrigger>
                <TabsTrigger value="profile" className="px-6 data-[state=active]:bg-cyan-950/50 data-[state=active]:text-cyan-400 data-[state=active]:shadow-[0_0_15px_rgba(34,211,238,0.2)] rounded-lg transition-all font-bold tracking-widest uppercase text-[10px] flex-1">Settings</TabsTrigger>
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
                      className={`cursor-pointer transition-all duration-300 ${selectedOrderId === order.id ? 'bg-[#040f25]/80 border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.15)] ring-1 ring-cyan-500/50 scale-[1.02] -translate-y-1' : 'bg-[#040f25]/30 border-white/5 hover:border-cyan-500/30 hover:bg-[#040f25]/50'} backdrop-blur-md overflow-hidden relative group`}
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${statusInfo.color} bg-opacity-10 border border-white/5 shadow-inner`}><StatusIcon className="w-5 h-5" /></div>
                          <div>
                            <p className="font-bold text-white  uppercase tracking-wide text-sm drop-shadow-sm group-hover:text-cyan-400 transition-colors">{order.projectName || 'Untitled Design'}</p>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-3 mt-1.5 border-t border-white/5 pt-1.5">
                              <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-cyan-500/70" /> <span className="font-consolas pt-0.5">{new Date(order.createdAt).toLocaleDateString()}</span></span>
                              <Badge variant="outline" className={`border-none ${statusInfo.color} bg-opacity-10 font-bold text-[8px] uppercase tracking-widest px-2 py-0 h-5 shadow-inner`}>{statusInfo.label}</Badge>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${selectedOrderId === order.id ? 'text-cyan-400 translate-x-1' : 'text-zinc-600 group-hover:text-cyan-500/50'}`} />
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

              <TabsContent value="shop_orders" className="space-y-4">
                {isShopOrdersLoading ? (
                  <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                ) : shopOrders?.length ? shopOrders.map((order: any) => (
                  <Card
                    key={order.id}
                    className="bg-[#040f25]/30 border-white/5 hover:border-cyan-500/30 hover:bg-[#040f25]/50 backdrop-blur-md overflow-hidden relative group cursor-pointer transition-all"
                    onClick={() => router.push(`/orders/${order.id}`)}
                  >
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-cyan-500/10 border border-white/5 shadow-inner">
                          <Package className="w-5 h-5 text-cyan-500" />
                        </div>
                        <div>
                          <p className="font-bold text-white uppercase tracking-wide text-sm truncate max-w-[200px]">
                            {order.items.length} {order.items.length === 1 ? 'Component' : 'Components'} Procured
                          </p>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-3 mt-1.5 border-t border-white/5 pt-1.5">
                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-cyan-500/70" /> <span className="font-consolas">{new Date(order.createdAt).toLocaleDateString()}</span></span>
                            <Badge variant="outline" className={`border-none ${order.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-400'} font-bold text-[8px] uppercase tracking-widest px-2 py-0 h-5 shadow-inner`}>
                              {order.status === 'paid' ? 'TXN SECURED' : order.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div className="hidden sm:block">
                          <p className="text-xs font-bold text-white font-mono italic">₹{order.pricing.total.toLocaleString()}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-cyan-500/50 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="text-center py-20 bg-card/50 rounded-2xl border border-dashed border-white/10 space-y-4">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground opacity-20" />
                    <p className="text-muted-foreground">No shop orders found.</p>
                    <Button variant="outline" onClick={() => router.push('/shop')}>Visit Catalogue</Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="profile" className="space-y-6">
                <Card className="bg-[#040f25]/40 border-white/10 backdrop-blur-md shadow-2xl">
                  <CardHeader className="border-b border-white/5 pb-5">
                    <CardTitle className="text-xl  uppercase tracking-wide text-white">Profile Details</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-widest font-bold text-zinc-500 mt-1">Information used for your RFQ submissions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2"><Label className="text-[10px] uppercase text-cyan-400 font-bold tracking-widest">Full Name</Label><p className="font-bold text-sm uppercase tracking-wider text-white bg-[#020617]/50 border border-white/5 rounded-lg p-3 shadow-inner">{profile?.fullName}</p></div>
                      <div className="space-y-2"><Label className="text-[10px] uppercase text-cyan-400 font-bold tracking-widest">Email Address</Label><p className="font-bold text-sm uppercase tracking-wider text-white bg-[#020617]/50 border border-white/5 rounded-lg p-3 shadow-inner font-consolas">{profile?.email || user.email}</p></div>
                      <div className="space-y-2"><Label className="text-[10px] uppercase text-cyan-400 font-bold tracking-widest">Phone Number</Label><p className="font-bold text-sm uppercase tracking-wider text-white bg-[#020617]/50 border border-white/5 rounded-lg p-3 shadow-inner font-consolas">{profile?.phone}</p></div>
                      <div className="space-y-2"><Label className="text-[10px] uppercase text-cyan-400 font-bold tracking-widest">Organization</Label><p className="font-bold text-sm uppercase tracking-wider text-white bg-[#020617]/50 border border-white/5 rounded-lg p-3 shadow-inner">{profile?.teamName}</p></div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-5 space-y-6 relative z-10">
            {selectedOrder ? (
              <div className="space-y-6 sticky top-28 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both" style={{ animationDelay: '300ms' }}>
                <Card className="bg-[#040f25]/60 border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                  <CardHeader className="border-b border-white/5 pb-5">
                    <div className="flex justify-between items-start mb-3">
                      <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-widest text-[10px] font-bold px-2.5 py-1 box-shadow-[0_0_10px_rgba(34,211,238,0.2)]">{selectedOrder.manufacturingProcess}</Badge>
                      <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-white/10">{STATUS_MAP[selectedOrder.status]?.label}</Badge>
                    </div>
                    <CardTitle className="text-xl text-white  tracking-wide uppercase">{selectedOrder.projectName}</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-widest text-zinc-500 font-bold mt-2 max-w-[80%] leading-relaxed border-l-2 border-cyan-500/30 pl-3">
                      <MapPin className="w-3.5 h-3.5 inline-block mr-1 text-cyan-400" />
                      {selectedOrder.deliveryLocation}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4 text-xs mb-8">
                      <div className="p-4 bg-[#020617]/50 rounded-xl border border-white/5 shadow-inner">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Layers className="w-3 h-3 text-cyan-500/70" /> Material</p>
                        <p className="font-bold text-white uppercase text-xs font-consolas">{selectedOrder.material}</p>
                      </div>
                      <div className="p-4 bg-[#020617]/50 rounded-xl border border-white/5 shadow-inner">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Hash className="w-3 h-3 text-cyan-500/70" /> Quantity</p>
                        <p className="font-bold text-white text-xs font-consolas">{selectedOrder.quantity} PCS</p>
                      </div>
                    </div>

                    {(selectedOrder.status === 'submitted' || selectedOrder.status === 'quotation_sent' || selectedOrder.status === 'quotations_received' || selectedOrder.status === 'under_negotiation') && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold text-white  uppercase tracking-wider flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-cyan-400" /> Received Quotations
                          </h3>
                          <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest text-[10px] font-bold">{quotations?.length || 0} Offers</Badge>
                        </div>

                        {quotations && quotations.length > 0 ? (
                          <div className="space-y-4">
                            {quotations.map((quote) => {
                              const lastNeg = quote.negotiationHistory?.[quote.negotiationHistory.length - 1];
                              const isCounter = lastNeg?.party === 'vendor';

                              return (
                                <Card key={quote.id} className="bg-[#040f25]/40 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-md hover:border-cyan-500/50 hover:bg-cyan-950/20 transition-all overflow-hidden group">
                                  <div className="p-5 space-y-4">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-bold text-white  tracking-wide uppercase">{quote.vendorName || 'MechMaster'}</p>
                                        <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                                          <TrendingUp className="w-3 h-3 text-cyan-500" />
                                          {quote.vendorRating || '4.5'} Rating
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-2xl font-bold font-consolas text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">₹{quote.quotedPrice.toLocaleString()}</p>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Lead Time: <span className="text-white">{quote.leadTimeDays} Days</span></p>
                                      </div>
                                    </div>

                                    {quote.negotiationHistory && quote.negotiationHistory.length > 0 && (
                                      <div className="bg-[#020617]/50 border border-white/5 p-4 rounded-xl space-y-3 mt-4 shadow-inner">
                                        <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                          <MessageSquare className="w-3 h-3" /> Negotiation History
                                        </p>
                                        <div className="max-h-[150px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                          {quote.negotiationHistory.map((hist: any, idx: number) => (
                                            <div key={idx} className={`p-3 rounded-lg text-xs border ${hist.party === 'admin' ? 'bg-blue-950/20 border-blue-500/20' : hist.party === 'vendor' ? 'bg-amber-950/20 border-amber-500/20' : 'bg-cyan-950/20 border-cyan-500/20'}`}>
                                              <div className="flex justify-between font-bold mb-2 uppercase tracking-widest text-[10px] text-zinc-500">
                                                <span className={hist.party === 'admin' ? 'text-blue-400' : hist.party === 'vendor' ? 'text-amber-400' : 'text-cyan-400'}>{hist.party}</span>
                                                <span className="font-consolas">{new Date(hist.createdAt).toLocaleDateString()}</span>
                                              </div>
                                              <p className="text-zinc-300 leading-relaxed mb-2 italic">"{hist.message}"</p>
                                              <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest mt-2 bg-[#020617]/40 p-2 rounded-md">
                                                <span className="text-cyan-400">₹{hist.price}</span>
                                                <span className="text-zinc-500">|</span>
                                                <span className="text-cyan-400">{hist.leadTime} Days</span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                      <Button
                                        className="flex-1  tracking-widest h-11 text-xs bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all border-none"
                                        onClick={() => handleSelectVendor(quote)}
                                        disabled={isConfirming}
                                      >
                                        {isConfirming ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                                        Accept Offer
                                      </Button>
                                      <div className="flex flex-1 gap-3">
                                        <Button
                                          variant="outline"
                                          className="flex-1  tracking-widest h-11 text-[10px] uppercase border-cyan-500/30 text-cyan-400 bg-cyan-950/10 hover:bg-cyan-950/30 hover:text-cyan-300 transition-all hover:border-cyan-500/50"
                                          onClick={() => {
                                            setNegotiatingQuote(quote);
                                            setNegPrice(quote.quotedPrice.toString());
                                            setNegLeadTime(quote.leadTimeDays.toString());
                                            setIsNegotiating(true);
                                          }}
                                        >
                                          <MessageSquare className="w-3 h-3 mr-1" /> Negotiate
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          className="flex-1  tracking-widest h-11 text-[10px] uppercase bg-red-950/20 text-red-500 border border-red-500/20 hover:bg-red-500/20 hover:text-red-400 transition-all"
                                          onClick={() => handleRejectQuotation(quote)}
                                        >
                                          <AlertCircle className="w-3 h-3 mr-1" /> Reject
                                        </Button>
                                      </div>
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

                    {/* ── ADVANCE PAYMENT (status = accepted, advance not yet paid) ── */}
                    {selectedOrder.status === 'accepted' && !selectedOrder.paymentStatus?.advance?.paid && (
                      <div className="rounded-2xl border border-orange-500/30 bg-[#020617]/80 shadow-[0_0_20px_rgba(249,115,22,0.1)] overflow-hidden">
                        <div className="p-5 border-b border-orange-500/20 bg-orange-950/20">
                          <div className="flex items-center gap-2 mb-1">
                            <CreditCard className="w-4 h-4 text-orange-400" />
                            <p className="text-sm font-bold text-white  uppercase tracking-wider">Advance Payment Required</p>
                          </div>
                          <p className="text-[10px] text-orange-200/60 uppercase tracking-widest font-bold">Pay 50% to lock in your MechMaster and start production.</p>
                        </div>
                        <div className="p-5 space-y-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Total Order Value</p>
                              <p className="text-lg font-bold text-white font-consolas">₹{(selectedOrder.finalPrice || 0).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest mb-1">Advance (50%)</p>
                              <p className="text-2xl font-bold text-orange-400 font-consolas drop-shadow-[0_0_10px_rgba(249,115,22,0.4)]">₹{Math.round((selectedOrder.finalPrice || 0) * 0.5).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-3 text-[10px] text-zinc-400 bg-black/40 rounded-xl p-3.5 border border-white/5 shadow-inner">
                            <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                            <p className="leading-relaxed font-bold tracking-wide">Advance is held securely in escrow. Remaining 50% is due only after you confirm delivery of your parts.</p>
                          </div>
                          <Button
                            className="w-full h-12 font-bold  tracking-widest uppercase text-xs bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-all border-none"
                            onClick={() => handlePayment('advance')}
                            disabled={isPayingAdvance}
                          >
                            {isPayingAdvance
                              ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Processing...</>
                              : <><Zap className="w-4 h-4 mr-2" />Pay ₹{Math.round((selectedOrder.finalPrice || 0) * 0.5).toLocaleString()} Advance</>
                            }
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* ── IN PRODUCTION (advance paid) ── */}
                    {selectedOrder.status === 'in_progress' && (
                      <div className="rounded-2xl border border-cyan-500/30 bg-[#020617]/80 shadow-[0_0_20px_rgba(34,211,238,0.1)] p-6 space-y-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-cyan-950/40 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                            <Hammer className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm  uppercase tracking-wide">In Production</p>
                            <p className="text-[10px] text-cyan-100/60 font-bold uppercase tracking-widest">Your MechMaster is manufacturing your parts.</p>
                          </div>
                        </div>
                        {selectedOrder.paymentStatus?.advance?.paid && (
                          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-green-950/20 border border-green-500/20 text-[10px] uppercase font-bold tracking-widest shadow-inner">
                            <Check className="w-4 h-4 text-green-400 shrink-0" />
                            <div className="flex-1">
                              <span className="text-green-400">Advance Paid</span>
                              <span className="text-zinc-500 ml-2 font-consolas text-xs">· ₹{Math.round((selectedOrder.finalPrice || 0) * 0.5).toLocaleString()}</span>
                            </div>
                            {selectedOrder.paymentStatus.advance.paidAt && (
                              <span className="text-zinc-500 font-consolas text-xs">{new Date(selectedOrder.paymentStatus.advance.paidAt).toLocaleDateString()}</span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#040f25]/50 border border-white/5 text-[10px] font-bold uppercase tracking-wide text-zinc-400 shadow-inner">
                          <Clock className="w-4 h-4 shrink-0 text-cyan-500 animate-pulse" />
                          <span className="leading-relaxed">Remaining <strong className="text-cyan-400 font-consolas text-xs">₹{Math.round((selectedOrder.finalPrice || 0) * 0.5).toLocaleString()}</strong> will be due upon delivery.</span>
                        </div>
                      </div>
                    )}

                    {/* ── SHIPPED OR DELIVERED — Completion Payment ── */}
                    {(selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' || selectedOrder.status === 'shipping') && (
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-orange-500/30 bg-[#020617]/80 shadow-[0_0_20px_rgba(249,115,22,0.1)] p-6 space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-950/40 flex items-center justify-center border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.2)] animate-pulse">
                              <Truck className="w-5 h-5 text-orange-400" />
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm  uppercase tracking-wide">Parts Ready for Arrival</p>
                              <p className="text-[10px] text-orange-200/60 font-bold uppercase tracking-widest">Complete full payment to receive your order.</p>
                            </div>
                          </div>
                          {selectedOrder.paymentStatus?.advance?.paid && (
                            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-green-950/20 border border-green-500/20 text-[10px] uppercase font-bold tracking-widest shadow-inner">
                              <Check className="w-4 h-4 text-green-400 shrink-0" />
                              <span className="text-green-400">Advance <strong className="font-consolas text-xs">₹{Math.round((selectedOrder.finalPrice || 0) * 0.5).toLocaleString()}</strong> Paid</span>
                            </div>
                          )}
                        </div>
                        {!selectedOrder.paymentStatus?.completion?.paid && (
                          <div className="rounded-2xl border border-cyan-500/30 bg-[#040f25]/50 shadow-[0_0_20px_rgba(34,211,238,0.1)] p-6 space-y-5">
                            <div>
                              <p className="text-sm font-bold text-white mb-1  uppercase tracking-wider">Pay Balance & Complete Order</p>
                              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Once full payment is received, your MechMaster will ensure delivery of your parts.</p>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-[#020617]/50 rounded-xl border border-white/5 shadow-inner">
                              <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Balance Due (50%)</p>
                              <p className="text-2xl font-bold text-cyan-400 font-consolas drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">₹{Math.round((selectedOrder.finalPrice || 0) * 0.5).toLocaleString()}</p>
                            </div>
                            <Button
                              className="w-full h-12 font-bold  tracking-widest uppercase text-xs bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all border-none"
                              onClick={() => handlePayment('completion')}
                              disabled={isPayingCompletion}
                            >
                              {isPayingCompletion
                                ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Processing...</>
                                : <><Check className="w-4 h-4 mr-2" />Pay ₹{Math.round((selectedOrder.finalPrice || 0) * 0.5).toLocaleString()} & Complete Order</>
                              }
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── FULLY COMPLETED ── */}
                    {selectedOrder.status === 'completed' && (
                      <div className="rounded-2xl border border-purple-500/30 bg-[#020617]/80 shadow-[0_0_20px_rgba(168,85,247,0.1)] p-8 space-y-6">
                        <div className="text-center space-y-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                            <CheckCircle2 className="text-green-400 w-8 h-8 filter drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                          </div>
                          <p className="text-2xl font-bold  uppercase tracking-widest text-white drop-shadow-md">Order Complete!</p>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-purple-200/60">All payments settled. Thanks for building with MechHub.</p>
                        </div>
                        <div className="space-y-3 pt-4 border-t border-white/5">
                          {selectedOrder.paymentStatus?.advance?.paid && (
                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#040f25]/40 border border-white/5 shadow-inner text-xs">
                              <div className="flex items-center gap-3">
                                <Check className="w-4 h-4 text-green-400" />
                                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Advance Paid</span>
                              </div>
                              <div className="text-right flex items-center gap-3">
                                <p className="font-consolas text-green-400 font-bold">₹{Math.round((selectedOrder.finalPrice || 0) * 0.5).toLocaleString()}</p>
                                {selectedOrder.paymentStatus.advance.paidAt && (
                                  <p className="font-consolas text-zinc-600 text-[10px]">{new Date(selectedOrder.paymentStatus.advance.paidAt).toLocaleDateString()}</p>
                                )}
                              </div>
                            </div>
                          )}
                          {selectedOrder.paymentStatus?.completion?.paid && (
                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#040f25]/40 border border-white/5 shadow-inner text-xs">
                              <div className="flex items-center gap-3">
                                <Check className="w-4 h-4 text-green-400" />
                                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Final Payment</span>
                              </div>
                              <div className="text-right flex items-center gap-3">
                                <p className="font-consolas text-green-400 font-bold">₹{Math.round((selectedOrder.finalPrice || 0) * 0.5).toLocaleString()}</p>
                                {selectedOrder.paymentStatus.completion.paidAt && (
                                  <p className="font-consolas text-zinc-600 text-[10px]">{new Date(selectedOrder.paymentStatus.completion.paidAt).toLocaleDateString()}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
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

      <Dialog
        open={isOnboardingOpen}
        onOpenChange={(open) => {
          // Prevent closing if not onboarded
          if (profile?.onboarded) setIsOnboardingOpen(open);
        }}
      >
        <DialogContent
          className="bg-[#020617] text-zinc-300 border-white/[0.05] shadow-[0_0_50px_rgba(34,211,238,0.15)] rounded-3xl sm:max-w-[450px] overflow-hidden"
          onPointerDownOutside={(e) => { if (!profile?.onboarded) e.preventDefault(); }}
          onEscapeKeyDown={(e) => { if (!profile?.onboarded) e.preventDefault(); }}
        >
          {/* Top accent glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500" />

          <DialogHeader className="pt-4">
            <DialogTitle className="text-2xl  tracking-wide font-bold text-white flex items-center gap-3">
              <UserIcon className="w-6 h-6 text-cyan-400" />
              Complete Your Profile
            </DialogTitle>
            <DialogDescription className="font-consolas text-cyan-50/50 text-[11px] uppercase tracking-widest pt-2">
              Setup your account to start managing high-precision manufacturing projects.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleOnboardingSubmit} className="space-y-4 py-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <Label className="text-zinc-500 font-bold uppercase tracking-[0.1em] text-[10px] pl-1">Full Name</Label>
                <Input name="fullName" required placeholder="e.g. Rahul Sharma" className="bg-[#040f25]/80 border-white/[0.08] text-white focus-visible:ring-cyan-500/50 h-12 rounded-xl placeholder:text-zinc-700" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-500 font-bold uppercase tracking-[0.1em] text-[10px] pl-1">Phone Number</Label>
                <Input name="phone" required placeholder="+91 XXXXX XXXXX" className="bg-[#040f25]/80 border-white/[0.08] text-white focus-visible:ring-cyan-500/50 h-12 rounded-xl placeholder:text-zinc-700" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-500 font-bold uppercase tracking-[0.1em] text-[10px] pl-1">Organization / Institution</Label>
                <Input name="teamName" required placeholder="Company or College name" className="bg-[#040f25]/80 border-white/[0.08] text-white focus-visible:ring-cyan-500/50 h-12 rounded-xl placeholder:text-zinc-700" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-zinc-500 font-bold uppercase tracking-[0.1em] text-[10px] pl-1">Your Role</Label>
                  <Input name="designation" required placeholder="e.g. Founder, HOD" className="bg-[#040f25]/80 border-white/[0.08] text-white focus-visible:ring-cyan-500/50 h-12 rounded-xl placeholder:text-zinc-700" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-zinc-500 font-bold uppercase tracking-[0.1em] text-[10px] pl-1">City</Label>
                  <Input name="location" required placeholder="e.g. Pune" className="bg-[#040f25]/80 border-white/[0.08] text-white focus-visible:ring-cyan-500/50 h-12 rounded-xl placeholder:text-zinc-700" />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14  tracking-[0.2em] mt-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all border-none rounded-xl text-sm font-bold uppercase"
              disabled={isSubmittingProfile}
            >
              {isSubmittingProfile ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>Save Profile & Access Hub <ChevronRight className="w-4 h-4 ml-1" /></>
              )}
            </Button>

            <p className="text-[9px] text-zinc-600 text-center font-consolas uppercase tracking-tighter">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isNegotiating} onOpenChange={setIsNegotiating}>
        <DialogContent className="bg-[#020617] text-zinc-300 border-white/[0.05] shadow-[0_0_50px_rgba(34,211,238,0.1)] rounded-3xl sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl  tracking-wide font-bold text-white">Negotiate Terms</DialogTitle>
            <DialogDescription className="font-consolas text-cyan-50/50">Propose your preferred price and timeline to the MechMaster.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white font-consolas uppercase tracking-wider text-[10px]">Target Price (₹)</Label>
                <Input value={negPrice} onChange={(e) => setNegPrice(e.target.value)} type="number" className="bg-[#040f25]/50 border-white/[0.05] text-white focus-visible:ring-cyan-500/50 h-11" />
              </div>
              <div className="space-y-2">
                <Label className="text-white font-consolas uppercase tracking-wider text-[10px]">Target Lead Time (Days)</Label>
                <Input value={negLeadTime} onChange={(e) => setNegLeadTime(e.target.value)} type="number" className="bg-[#040f25]/50 border-white/[0.05] text-white focus-visible:ring-cyan-500/50 h-11" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white font-consolas uppercase tracking-wider text-[10px]">Message to Vendor</Label>
              <Textarea
                value={negMessage}
                onChange={(e) => setNegMessage(e.target.value)}
                placeholder="Explain why you are requesting these changes..."
                className="bg-[#040f25]/50 border-white/[0.05] text-white focus-visible:ring-cyan-500/50 min-h-[100px] resize-none"
              />
            </div>

            {negotiatingQuote?.negotiationHistory?.length > 0 && (
              <div className="space-y-4 border-t border-white/5 pt-6 bg-[#020617]/30 -mx-6 px-6 shadow-inner pb-6">
                <Label className="text-cyan-400 uppercase tracking-widest text-[10px] font-bold flex items-center gap-2"><History className="w-3 h-3" /> Negotiation History</Label>
                <div className="space-y-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                  {negotiatingQuote.negotiationHistory.map((item: any, i: number) => (
                    <div key={i} className={`p-4 rounded-xl text-xs border ${item.party === 'user' || item.party === 'customer' ? 'bg-amber-950/20 border-amber-500/30' : item.party === 'admin' ? 'bg-blue-950/20 border-blue-500/30' : 'bg-cyan-950/20 border-cyan-500/30'} shadow-inner`}>
                      <div className={`flex justify-between font-bold mb-3 uppercase tracking-widest text-[10px] ${item.party === 'user' || item.party === 'customer' ? 'text-amber-400' : item.party === 'admin' ? 'text-blue-400' : 'text-cyan-400'}`}>
                        <span>{item.party} Update</span>
                        <span className="font-consolas text-zinc-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                      {item.message && <p className="italic mb-3 text-zinc-300 leading-relaxed">"{item.message}"</p>}
                      <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest bg-[#020617]/40 p-2 rounded-md">
                        <span className="text-cyan-400">₹{item.price}</span>
                        <span className="text-zinc-500">|</span>
                        <span className="text-cyan-400">{item.leadTime} Days</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setIsNegotiating(false)} className="border-white/[0.05] text-zinc-400 hover:text-white hover:bg-white/[0.02]">Cancel</Button>
            <Button onClick={handleProposeNegotiation} className="bg-cyan-600 hover:bg-cyan-500 text-white  tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all border-none">Send Counter-Proposal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
