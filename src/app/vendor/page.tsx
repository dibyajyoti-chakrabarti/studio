
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Eye,
  FileText,
  MapPin,
  Download,
  MessageSquare,
  Gavel,
  Check,
  Zap,
  ShieldCheck,
  History,
  TrendingUp,
  X
} from 'lucide-react';
import { useFirestore, useCollection, useUser, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking, useAuth } from '@/firebase';
import { collection, query, doc, getDoc, where, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import Image from 'next/image';

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
      where('shortlistedVendorIds', 'array-contains', user.uid),
      where('status', 'in', ['submitted', 'quotation_sent', 'quotations_received', 'under_negotiation']),
      orderBy('createdAt', 'desc')
    );
  }, [db, user, isVendorConfirmed]);

  const myProjectsQuery = useMemoFirebase(() => {
    if (!db || !user || !isVendorConfirmed) return null;
    return query(
      collection(db, 'rfqs'),
      where('assignedVendorId', '==', user.uid),
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
      quotedPrice: Number(quotePrice),
      leadTimeDays: Number(quoteLeadTime),
      notes: quoteNotes,
      status: 'pending',
      negotiationHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addDocumentNonBlocking(collection(db, 'quotations'), quotationData);
    updateDocumentNonBlocking(doc(db, 'rfqs', selectedRfq.id), {
      status: 'quotations_received',
      updatedAt: new Date().toISOString()
    });

    setIsQuoting(false);
    setShowDetails(false);
    toast({ title: "Quotation Submitted", description: "The innovator will review your bid." });
  };

  const handleRespondNegotiation = (partyAction: 'accept' | 'counter') => {
    if (!db || !negotiatingQuote) return;

    if (partyAction === 'accept') {
      updateDocumentNonBlocking(doc(db, 'quotations', negotiatingQuote.id), {
        status: 'pending',
        updatedAt: new Date().toISOString()
      });
      toast({ title: "Offer Accepted", description: "Waiting for platform finalization." });
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
        status: 'revised',
        updatedAt: new Date().toISOString()
      });
      toast({ title: "Counter-Proposal Sent" });
    }
    setIsResponding(false);
  };

  const handleUpdateStatus = (rfqId: string, newStatus: string) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, 'rfqs', rfqId), {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
    toast({ title: "Production Status Updated" });
  };

  if (isVendorConfirmed === null || isUserLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-primary" /></div>;
  if (!isVendorConfirmed) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-card sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Image src="/mechhub.png" alt="MechHub Logo" width={60} height={60} />
          <span className="font-headline font-bold text-xl text-white">MechMaster Workspace</span>
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
            <h1 className="text-3xl font-headline font-bold text-white">Production Control</h1>
            <p className="text-muted-foreground mt-1">Manage bids and track active manufacturing assignments.</p>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-card border border-white/10 p-1 rounded-lg">
            <TabsList className="bg-transparent">
              <TabsTrigger value="marketplace" className="gap-2 px-6"><Zap className="w-4 h-4" /> Opportunities</TabsTrigger>
              <TabsTrigger value="projects" className="gap-2 px-6"><ClipboardList className="w-4 h-4" /> Active Runs</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {activeTab === 'marketplace' ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-secondary">
              <Gavel className="w-5 h-5" />
              <h2 className="text-xl font-bold font-headline uppercase tracking-wider">Available Opportunities</h2>
            </div>

            {isMarketplaceLoading ? (
              <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
            ) : marketplaceRfqs?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketplaceRfqs.map((rfq) => {
                  const myQuote = myQuotes?.find(q => q.rfqId === rfq.id);
                  const lastNeg = myQuote?.negotiationHistory?.[myQuote.negotiationHistory.length - 1];
                  const needsResponse = lastNeg?.party === 'customer' || lastNeg?.party === 'admin';

                  return (
                    <Card key={rfq.id} className="bg-card border-white/10 hover:border-secondary/30 transition-all group overflow-hidden">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge className="bg-primary/20 text-primary border-none text-[10px] font-bold uppercase">{rfq.manufacturingProcess}</Badge>
                          {myQuote && <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-500">{myQuote.status.toUpperCase()}</Badge>}
                        </div>
                        <CardTitle className="text-xl font-headline text-white group-hover:text-secondary truncate">{rfq.projectName}</CardTitle>
                        <CardDescription className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {rfq.deliveryLocation}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-3 bg-background/50 rounded-lg border border-white/5 space-y-2 text-xs">
                          <div className="flex justify-between text-muted-foreground"><span>Material:</span><span className="text-white font-bold">{rfq.material}</span></div>
                          <div className="flex justify-between text-muted-foreground"><span>Qty:</span><span className="text-white font-bold">{rfq.quantity}</span></div>
                        </div>

                        {needsResponse ? (
                          <div className="space-y-3">
                            <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-3 text-[10px]">
                              <p className="font-bold text-secondary mb-1 flex items-center gap-1 uppercase tracking-wider"><History className="w-3 h-3" /> Negotiation Update</p>
                              <p className="text-white font-bold">Target: ₹{lastNeg.price} • {lastNeg.leadTime} Days</p>
                              <p className="text-muted-foreground italic mt-1 line-clamp-1">"{lastNeg.message}"</p>
                            </div>
                            <Button variant="secondary" className="w-full h-11" onClick={() => { setNegotiatingQuote(myQuote); setIsResponding(true); }}>Respond to Bid</Button>
                          </div>
                        ) : (
                          <Button variant="secondary" className="w-full gap-2 font-bold h-11" onClick={() => { setSelectedRfq(rfq); setShowDetails(true); }}>
                            <Eye className="w-4 h-4" /> {myQuote ? 'View Bid Status' : 'Submit Quotation'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-24 bg-card/30 rounded-2xl border border-dashed border-white/10 opacity-50">
                <FileText className="w-12 h-12 mx-auto mb-4" />
                <p>No active project invitations in your region.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <Hammer className="w-5 h-5" />
              <h2 className="text-xl font-bold font-headline uppercase tracking-wider">Active Build Log</h2>
            </div>
            <Card className="bg-card border-white/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white">Build Details</TableHead>
                    <TableHead className="text-white">Specs</TableHead>
                    <TableHead className="text-white">Stage</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRfqs?.length ? myRfqs.map((rfq) => (
                    <TableRow key={rfq.id} className="border-b border-white/5">
                      <TableCell>
                        <div className="font-bold text-white">{rfq.projectName}</div>
                        <div className="text-xs text-muted-foreground">{rfq.userName}</div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="text-white">{rfq.manufacturingProcess}</div>
                        <div className="text-muted-foreground">{rfq.material} • {rfq.quantity}u</div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-primary/20 text-primary border-none uppercase text-[10px]">{rfq.status.replace('_', ' ')}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {rfq.status === 'assigned' && <Button size="sm" onClick={() => handleUpdateStatus(rfq.id, 'in_progress')}>Start Build</Button>}
                          {rfq.status === 'in_progress' && <Button size="sm" variant="secondary" onClick={() => handleUpdateStatus(rfq.id, 'completed')}>Complete Build</Button>}
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : <TableRow><TableCell colSpan={4} className="text-center py-20 opacity-30 italic">No assigned builds at this time.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}
      </div>

      <Dialog open={showDetails && !!selectedRfq} onOpenChange={setShowDetails}>
        <DialogContent className="bg-card text-foreground border-white/10 max-w-2xl">
          <DialogHeader><DialogTitle className="text-2xl font-headline font-bold text-white">{selectedRfq?.projectName}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-8 py-6">
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-secondary uppercase tracking-widest">Requirements</h3>
              <div className="space-y-3 text-xs bg-background/50 p-4 rounded-xl border border-white/5">
                <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Process:</span><span className="text-white">{selectedRfq?.manufacturingProcess}</span></div>
                <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Material:</span><span className="text-white">{selectedRfq?.material}</span></div>
                <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Qty:</span><span className="text-white">{selectedRfq?.quantity}</span></div>
              </div>
              {selectedRfq?.designFileUrl && (
                <Button variant="outline" className="w-full gap-2 border-white/10" onClick={() => window.open(selectedRfq.designFileUrl)}>
                  <Download className="w-4 h-4" /> Download Design Data
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-secondary uppercase tracking-widest">Your Bid</h3>
              {!myQuotes?.find(q => q.rfqId === selectedRfq?.id) ? (
                <div className="space-y-4">
                  <div className="space-y-2"><Label className="text-xs">Price (₹)</Label><Input value={quotePrice} onChange={e => setQuotePrice(e.target.value)} type="number" className="bg-background" /></div>
                  <div className="space-y-2"><Label className="text-xs">Lead Time (Days)</Label><Input value={quoteLeadTime} onChange={e => setQuoteLeadTime(e.target.value)} type="number" className="bg-background" /></div>
                  <Button className="w-full font-bold h-11" onClick={handleSubmitQuote}>Submit Official Quotation</Button>
                </div>
              ) : (
                <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-center">
                  <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-white">Bid Live</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isResponding} onOpenChange={setIsResponding}>
        <DialogContent className="bg-card text-foreground border-white/10 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold text-white">Negotiation Response</DialogTitle>
            <DialogDescription>Review the latest terms and respond to secure this project.</DialogDescription>
          </DialogHeader>

          {negotiatingQuote?.negotiationHistory && negotiatingQuote.negotiationHistory.length > 0 && (
            <div className="max-h-[150px] overflow-y-auto space-y-3 pr-2 mb-4 custom-scrollbar">
              {negotiatingQuote.negotiationHistory.map((hist: any, idx: number) => (
                <div key={idx} className={`p-3 rounded-lg text-sm border ${hist.party === 'admin' ? 'bg-secondary/10 border-secondary/20' : hist.party === 'customer' || hist.party === 'user' ? 'bg-primary/10 border-primary/20' : 'bg-muted/10 border-white/5'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">{hist.party}</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(hist.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-white text-xs mb-3 italic">"{hist.message}"</p>
                  <div className="flex gap-4 text-xs font-bold">
                    <span className="text-secondary">₹{hist.price}</span>
                    <span className="text-primary">{hist.leadTime} Days</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4 py-2 border-t border-white/5 pt-4">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-widest">Counter-Offer Terms (Optional)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>New Price (₹)</Label><Input value={resPrice} onChange={e => setResPrice(e.target.value)} type="number" className="bg-background" /></div>
              <div className="space-y-2"><Label>New Lead Time (Days)</Label><Input value={resLeadTime} onChange={e => setResLeadTime(e.target.value)} type="number" className="bg-background" /></div>
            </div>
            <div className="space-y-2"><Label>Message / Justification</Label><Textarea value={resMessage} onChange={e => setResMessage(e.target.value)} className="bg-background h-20" /></div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" className="border-white/10 h-11 font-bold w-full sm:w-auto" onClick={() => handleRespondNegotiation('counter')} disabled={!resPrice || !resLeadTime}>
              Send Counter-Offer
            </Button>
            <Button className="font-bold h-11 w-full sm:w-auto" onClick={() => handleRespondNegotiation('accept')}>
              <Check className="w-4 h-4 mr-2" /> Accept Latest Terms
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
