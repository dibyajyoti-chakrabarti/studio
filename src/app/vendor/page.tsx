
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Logo } from '@/components/Logo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  ClipboardList, 
  Loader2,
  Hammer,
  CheckCircle2,
  LogOut,
  Package,
  Clock,
  LayoutGrid,
  Eye,
  FileText,
  MapPin,
  Download,
  AlertCircle,
  MessageSquare,
  Gavel,
  Check,
  Zap,
  ShieldCheck,
  History
} from 'lucide-react';
import { useFirestore, useCollection, useUser, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking, useAuth } from '@/firebase';
import { collection, query, doc, getDoc, where, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

export default function VendorPortal() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isVendorConfirmed, setIsVendorConfirmed] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState('marketplace');
  const [selectedRfq, setSelectedRfq] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const [isQuoting, setIsQuoting] = useState(false);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteLeadTime, setQuoteLeadTime] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  
  const [isResponding, setIsResponding] = useState(false);
  const [negotiatingQuote, setNegotiatingQuote] = useState<any>(null);
  const [resPrice, setResPrice] = useState('');
  const [resLeadTime, setResLeadTime] = useState('');
  const [resMessage, setResMessage] = useState('');

  const db = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    async function verifyVendor() {
      if (!isUserLoading) {
        if (!user) {
          router.push('/login?redirect=/vendor');
        } else if (db) {
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists() && (userDoc.data()?.role === 'vendor' || userDoc.data()?.role === 'admin')) {
              setIsVendorConfirmed(true);
            } else {
              setIsVendorConfirmed(false);
              router.push('/dashboard');
            }
          } catch (err) {
            setIsVendorConfirmed(false);
            router.push('/dashboard');
          }
        }
      }
    }
    verifyVendor();
  }, [user, isUserLoading, db, router]);

  const marketplaceQuery = useMemoFirebase(() => {
    if (!db || !user || !isVendorConfirmed) return null;
    return query(
      collection(db, 'rfqs'), 
      where('selectedVendorIds', 'array-contains', user.uid),
      where('status', 'in', ['rfq_submitted', 'quotation_sent', 'negotiation']),
      orderBy('createdAt', 'desc')
    );
  }, [db, user, isVendorConfirmed]);
  
  const myProjectsQuery = useMemoFirebase(() => {
    if (!db || !user || !isVendorConfirmed) return null;
    return query(
      collection(db, 'rfqs'), 
      where('vendorId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );
  }, [db, user, isVendorConfirmed]);

  const myQuotesQuery = useMemoFirebase(() => {
    if (!db || !user || !isVendorConfirmed) return null;
    return query(
      collection(db, 'quotations'),
      where('vendorId', '==', user.uid)
    );
  }, [db, user, isVendorConfirmed]);
  
  const { data: marketplaceRfqs, isLoading: isMarketplaceLoading } = useCollection(marketplaceQuery);
  const { data: myRfqs, isLoading: isMyProjectsLoading } = useCollection(myProjectsQuery);
  const { data: myQuotes } = useCollection(myQuotesQuery);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleSubmitQuote = async () => {
    if (!db || !user || !selectedRfq) return;
    
    const quotationData = {
      rfqId: selectedRfq.id,
      userId: selectedRfq.userId,
      vendorId: user.uid,
      vendorName: user.displayName || 'Verified MechMaster',
      vendorRating: 4.8,
      quotedPrice: Number(quotePrice),
      leadTimeDays: Number(quoteLeadTime),
      notes: quoteNotes,
      status: 'sent',
      negotiationHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addDocumentNonBlocking(collection(db, 'quotations'), quotationData);
    updateDocumentNonBlocking(doc(db, 'rfqs', selectedRfq.id), {
      status: 'quotation_sent',
      updatedAt: new Date().toISOString()
    });

    setIsQuoting(false);
    setShowDetails(false);
    toast({ title: "Quotation Submitted", description: "Your competitive bid is now visible to the client." });
  };

  const handleRespondNegotiation = (partyAction: 'accept' | 'counter' | 'reject') => {
    if (!db || !negotiatingQuote) return;

    if (partyAction === 'accept') {
      updateDocumentNonBlocking(doc(db, 'quotations', negotiatingQuote.id), {
        quotedPrice: Number(resPrice),
        leadTimeDays: Number(resLeadTime),
        status: 'sent',
        updatedAt: new Date().toISOString()
      });
      toast({ title: "Proposal Accepted", description: "Project terms updated." });
    } else if (partyAction === 'reject') {
      updateDocumentNonBlocking(doc(db, 'quotations', negotiatingQuote.id), {
        status: 'rejected',
        updatedAt: new Date().toISOString()
      });
      toast({ title: "Proposal Rejected", description: "This quotation is now closed." });
    } else {
      const historyItem = {
        party: 'vendor',
        price: Number(resPrice),
        leadTime: Number(resLeadTime),
        message: resMessage,
        createdAt: new Date().toISOString(),
      };
      const newHistory = [...(negotiatingQuote.negotiationHistory || []), historyItem];
      
      updateDocumentNonBlocking(doc(db, 'quotations', negotiatingQuote.id), {
        negotiationHistory: newHistory,
        updatedAt: new Date().toISOString()
      });
      toast({ title: "Counter-Proposal Sent", description: "The message has been sent." });
    }

    setIsResponding(false);
    setNegotiatingQuote(null);
  };

  const handleUpdateStatus = (rfqId: string, newStatus: string) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, 'rfqs', rfqId), {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
    toast({ title: "Status Updated", description: `Production stage: ${newStatus.replace('_', ' ')}.` });
  };

  const downloadFile = (dataUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isVendorConfirmed === null || isUserLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-primary" /></div>;
  if (!isVendorConfirmed) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-card sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <span className="font-headline font-bold text-lg text-white">MechMaster Workspace</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 border-white/10 hover:bg-white/5">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-headline font-bold tracking-tight text-white">Production Control</h1>
            <p className="text-muted-foreground mt-1">Review your invited RFQs and manage active production runs.</p>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-card border border-white/10 p-1 rounded-lg">
            <TabsList className="bg-transparent">
              <TabsTrigger value="marketplace" className="gap-2 px-6"><Zap className="w-4 h-4" /> Invitations</TabsTrigger>
              <TabsTrigger value="projects" className="gap-2 px-6"><ClipboardList className="w-4 h-4" /> Active Runs</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {activeTab === 'marketplace' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-secondary">
                <Gavel className="w-5 h-5" />
                <h2 className="text-xl font-bold font-headline uppercase tracking-wider">Requested Quotations</h2>
              </div>
            </div>

            {isMarketplaceLoading ? (
              <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
            ) : marketplaceRfqs?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketplaceRfqs.map((rfq) => {
                  const myQuote = myQuotes?.find(q => q.rfqId === rfq.id);
                  const lastNeg = myQuote?.negotiationHistory?.[myQuote.negotiationHistory.length - 1];
                  const isAdminRevision = lastNeg?.party === 'admin';
                  const isUserCounter = lastNeg?.party === 'user';
                  
                  return (
                    <Card key={rfq.id} className={`bg-card border-white/10 hover:border-secondary/30 transition-all group relative overflow-hidden ${isAdminRevision ? 'ring-2 ring-primary' : ''}`}>
                      {isAdminRevision && <div className="absolute top-0 right-0 bg-primary text-[8px] font-bold uppercase px-3 py-1 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Admin Revised</div>}
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge className="bg-primary/20 text-primary border-none text-[10px] font-bold uppercase">{rfq.manufacturingProcess}</Badge>
                          {myQuote && <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-500">{myQuote.status === 'negotiating' ? 'Under Negotiation' : 'Bid Submitted'}</Badge>}
                        </div>
                        <CardTitle className="text-xl font-headline text-white group-hover:text-secondary transition-colors truncate">{rfq.projectName}</CardTitle>
                        <CardDescription className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {rfq.deliveryLocation}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-3 bg-background/50 rounded-lg border border-white/5 space-y-2 text-xs">
                          <div className="flex justify-between"><span className="text-muted-foreground">Material:</span><span className="font-bold text-white">{rfq.material}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Quantity:</span><span className="font-bold text-white">{rfq.quantity} units</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Deadline:</span><span className="font-bold text-white">{new Date(rfq.deliveryDate).toLocaleDateString()}</span></div>
                        </div>

                        {(isAdminRevision || isUserCounter) ? (
                          <div className="space-y-3">
                            <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-3 text-[10px]">
                              <p className="font-bold text-secondary mb-1 flex items-center gap-1 uppercase tracking-wider"><History className="w-3 h-3" /> {isAdminRevision ? 'Admin Revision' : 'User Counter'}</p>
                              <p className="text-white font-bold mb-1">Target: ₹{lastNeg.price} • {lastNeg.leadTime} Days</p>
                              <p className="text-muted-foreground italic line-clamp-2">"{lastNeg.message}"</p>
                            </div>
                            <Button variant="secondary" className="w-full gap-2 font-bold h-11 bg-secondary/10 text-secondary hover:bg-secondary/20" onClick={() => { 
                              setNegotiatingQuote(myQuote);
                              setResPrice(lastNeg.price.toString());
                              setResLeadTime(lastNeg.leadTime.toString());
                              setIsResponding(true);
                            }}>
                              <MessageSquare className="w-4 h-4" /> Respond to Revision
                            </Button>
                          </div>
                        ) : (
                          <Button variant="secondary" className="w-full gap-2 font-bold h-11" onClick={() => { setSelectedRfq(rfq); setShowDetails(true); }}>
                            <Eye className="w-4 h-4" /> {myQuote ? 'Review Status' : 'Bid Now'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-24 bg-card/30 rounded-2xl border border-dashed border-white/10">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Active Invitations</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">You'll see new manufacturing requests here when innovators select you for their builds.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
             <div className="flex items-center gap-2 text-primary">
              <Hammer className="w-5 h-5" />
              <h2 className="text-xl font-bold font-headline uppercase tracking-wider">In Production</h2>
            </div>
            {isMyProjectsLoading ? (
              <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" /></div>
            ) : (
              <Card className="bg-card border-white/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="font-bold text-white">Build & Client</TableHead>
                      <TableHead className="font-bold text-white">Specs</TableHead>
                      <TableHead className="font-bold text-white">Status</TableHead>
                      <TableHead className="font-bold text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myRfqs?.length ? myRfqs.map((rfq) => (
                      <TableRow key={rfq.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <TableCell>
                          <div className="font-bold text-white">{rfq.projectName}</div>
                          <div className="text-xs text-muted-foreground">{rfq.userName} ({rfq.teamName})</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-white">{rfq.manufacturingProcess}</div>
                          <div className="text-[10px] text-muted-foreground">{rfq.material} • {rfq.quantity}u</div>
                        </TableCell>
                        <TableCell>
                          <Badge className="font-bold uppercase text-[10px] bg-primary/20 text-primary border-none">
                            {rfq.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {rfq.status === 'order_confirmed' && (
                              <Button size="sm" className="h-8 text-xs font-bold" onClick={() => handleUpdateStatus(rfq.id, 'shipping')}>
                                <Package className="w-3 h-3 mr-1" /> Ship
                              </Button>
                            )}
                            {rfq.status === 'shipping' && (
                              <Button size="sm" variant="secondary" className="h-8 text-xs font-bold" onClick={() => handleUpdateStatus(rfq.id, 'delivered')}>
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Deliver
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-20 text-muted-foreground">No active assignments in your queue.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            )}
          </div>
        )}
      </div>

      <Dialog open={showDetails && !!selectedRfq} onOpenChange={setShowDetails}>
        <DialogContent className="bg-card text-foreground border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold text-white">{selectedRfq?.projectName}</DialogTitle>
            <DialogDescription>Review technical requirements and submit your competitive quotation.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-8 py-6">
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Specifications</h3>
              <div className="space-y-3 text-xs bg-background/50 p-4 rounded-xl border border-white/5">
                <div className="flex justify-between"><span className="text-muted-foreground">Process:</span><span className="text-white">{selectedRfq?.manufacturingProcess}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Material:</span><span className="text-white">{selectedRfq?.material}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Quantity:</span><span className="text-white">{selectedRfq?.quantity} units</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tolerance:</span><span className="text-white">{selectedRfq?.tolerance}</span></div>
              </div>
              
              <h3 className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Design File</h3>
              {selectedRfq?.designFileUrl ? (
                <Button variant="outline" className="w-full h-12 border-white/10 gap-2" onClick={() => downloadFile(selectedRfq.designFileUrl, selectedRfq.designFileName)}>
                  <Download className="w-4 h-4" /> Download Engineering Data
                </Button>
              ) : <p className="text-xs text-muted-foreground italic">No technical files attached.</p>}
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Submit Your Quotation</h3>
              {!myQuotes?.find(q => q.rfqId === selectedRfq?.id) ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white text-xs">Quoted Price (₹)</Label>
                    <Input value={quotePrice} onChange={(e) => setQuotePrice(e.target.value)} type="number" className="bg-background" placeholder="Total cost" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white text-xs">Lead Time (Days)</Label>
                    <Input value={quoteLeadTime} onChange={(e) => setQuoteLeadTime(e.target.value)} type="number" className="bg-background" placeholder="Days to completion" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white text-xs">Proposal Notes</Label>
                    <Textarea value={quoteNotes} onChange={(e) => setQuoteNotes(e.target.value)} className="bg-background h-20 text-xs" placeholder="Terms, material grades, etc." />
                  </div>
                  <Button className="w-full h-11 font-bold" onClick={handleSubmitQuote}>Confirm & Submit Bid</Button>
                </div>
              ) : (
                <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl text-center space-y-3">
                  <Check className="w-8 h-8 text-green-500 mx-auto" />
                  <p className="text-sm font-bold text-white">Bid Live</p>
                  <p className="text-xs text-muted-foreground">The client is reviewing your offer. Stay tuned for potential negotiations.</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isResponding} onOpenChange={setIsResponding}>
        <DialogContent className="bg-card text-foreground border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold text-white">Respond to Revision / Counter</DialogTitle>
            <DialogDescription>Review terms from {negotiatingQuote?.negotiationHistory?.[negotiatingQuote.negotiationHistory.length - 1]?.party === 'admin' ? 'Admin' : 'Client'} and respond.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-xl">
              <p className="text-[10px] font-bold text-secondary mb-2 uppercase tracking-widest">Target Conditions</p>
              {(() => {
                const last = negotiatingQuote?.negotiationHistory?.[negotiatingQuote.negotiationHistory.length - 1];
                return (
                  <div className="text-xs space-y-2">
                    <p className="text-white font-bold flex items-center justify-between"><span>Price: ₹{last?.price}</span> <span>Timeline: {last?.leadTime} Days</span></p>
                    <p className="italic text-muted-foreground bg-background/30 p-2 rounded">"{last?.message}"</p>
                  </div>
                );
              })()}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Revised Price (₹)</Label>
                <Input value={resPrice} onChange={(e) => setResPrice(e.target.value)} type="number" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Lead Time (Days)</Label>
                <Input value={resLeadTime} onChange={(e) => setResLeadTime(e.target.value)} type="number" className="bg-background" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Message / Justification</Label>
              <Textarea value={resMessage} onChange={(e) => setResMessage(e.target.value)} className="bg-background h-20" placeholder="Optional notes for the admin/client..." />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => handleRespondNegotiation('reject')} className="border-red-500/50 text-red-500 hover:bg-red-500/10">Reject Revision</Button>
            <Button variant="outline" onClick={() => handleRespondNegotiation('counter')} className="border-white/10">Submit Counter</Button>
            <Button onClick={() => handleRespondNegotiation('accept')} className="bg-green-600 hover:bg-green-700 text-white font-bold">Accept & Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
