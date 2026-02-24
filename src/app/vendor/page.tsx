"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Logo } from '@/components/Logo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ClipboardList, 
  Settings, 
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
  Building2,
  AlertCircle
} from 'lucide-react';
import { useFirestore, useCollection, useUser, useMemoFirebase, updateDocumentNonBlocking, useAuth } from '@/firebase';
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

  // Marketplace: Only Open RFQs
  const marketplaceQuery = useMemoFirebase(() => {
    if (!db || !user || !isVendorConfirmed) return null;
    return query(
      collection(db, 'rfqs'), 
      where('status', '==', 'rfq_submitted'),
      orderBy('createdAt', 'desc')
    );
  }, [db, user, isVendorConfirmed]);
  
  // My Projects: Assigned to this vendor
  const myProjectsQuery = useMemoFirebase(() => {
    if (!db || !user || !isVendorConfirmed) return null;
    return query(
      collection(db, 'rfqs'), 
      where('vendorId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );
  }, [db, user, isVendorConfirmed]);
  
  const { data: marketplaceRfqs, isLoading: isMarketplaceLoading } = useCollection(marketplaceQuery);
  const { data: myRfqs, isLoading: isMyProjectsLoading } = useCollection(myProjectsQuery);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleUpdateStatus = (rfqId: string, newStatus: string) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, 'rfqs', rfqId), {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
    toast({ title: "Status Updated", description: `Project state changed to ${newStatus.replace('_', ' ')}.` });
  };

  const downloadFile = (dataUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isVendorConfirmed === null || isUserLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  if (!isVendorConfirmed) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-card sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <span className="font-headline font-bold text-lg">MechMaster Portal</span>
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
            <h1 className="text-3xl font-headline font-bold tracking-tight">Vendor Workspace</h1>
            <p className="text-muted-foreground mt-1">Review new manufacturing opportunities and manage your active production queue.</p>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-card border border-white/10 p-1 rounded-lg">
            <TabsList className="bg-transparent">
              <TabsTrigger value="marketplace" className="gap-2 px-6"><LayoutGrid className="w-4 h-4" /> Marketplace</TabsTrigger>
              <TabsTrigger value="projects" className="gap-2 px-6"><ClipboardList className="w-4 h-4" /> My Assignments</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {activeTab === 'marketplace' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-secondary">
                <Package className="w-5 h-5" />
                <h2 className="text-xl font-bold font-headline uppercase tracking-wider">Open Requests</h2>
              </div>
              <Badge variant="outline" className="px-4 py-1 border-white/10">{marketplaceRfqs?.length || 0} Open RFQs</Badge>
            </div>

            {isMarketplaceLoading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="animate-spin text-primary w-10 h-10" />
                <p className="text-muted-foreground animate-pulse">Syncing marketplace data...</p>
              </div>
            ) : marketplaceRfqs?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketplaceRfqs.map((rfq) => (
                  <Card key={rfq.id} className="bg-card border-white/10 hover:border-secondary/30 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-colors" />
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2 relative z-10">
                        <Badge className="bg-primary/20 text-primary border-none text-[10px] font-bold uppercase">{rfq.manufacturingProcess}</Badge>
                        <span className="text-xs text-muted-foreground font-mono">{new Date(rfq.createdAt).toLocaleDateString()}</span>
                      </div>
                      <CardTitle className="text-xl font-headline group-hover:text-secondary transition-colors truncate">{rfq.projectName || 'Untitled Design'}</CardTitle>
                      <CardDescription className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {rfq.deliveryLocation}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 bg-background/50 rounded-lg border border-white/5 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Material:</span>
                          <span className="font-bold">{rfq.material}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Quantity:</span>
                          <span className="font-bold">{rfq.quantity} units</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Target Date:</span>
                          <span className="font-bold">{new Date(rfq.deliveryDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button variant="secondary" className="w-full gap-2 font-bold h-11" onClick={() => { setSelectedRfq(rfq); setShowDetails(true); }}>
                        <Eye className="w-4 h-4" /> Inspect Request
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-card/30 rounded-2xl border border-dashed border-white/10">
                <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 opacity-20" />
                </div>
                <h3 className="text-xl font-bold mb-2">Marketplace Quiet</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">New requests from innovators will appear here as soon as they are submitted.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
             <div className="flex items-center gap-2 text-primary">
              <Hammer className="w-5 h-5" />
              <h2 className="text-xl font-bold font-headline uppercase tracking-wider">Active Builds</h2>
            </div>
            {isMyProjectsLoading ? (
              <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" /></div>
            ) : (
              <Card className="bg-card border-white/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="font-bold">Project & Client</TableHead>
                      <TableHead className="font-bold">Technical Specs</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="font-bold">Timeline</TableHead>
                      <TableHead className="font-bold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myRfqs?.length ? myRfqs.map((rfq) => (
                      <TableRow key={rfq.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <TableCell>
                          <div className="font-bold text-lg">{rfq.projectName}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Building2 className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{rfq.userName} • {rfq.teamName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{rfq.manufacturingProcess}</div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{rfq.material} • {rfq.quantity} units</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={rfq.status === 'delivered' ? 'secondary' : 'default'} className="font-bold uppercase text-[10px]">
                            {rfq.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-mono text-muted-foreground">Due: {new Date(rfq.deliveryDate).toLocaleDateString()}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" className="h-8 text-xs border-white/10" onClick={() => { setSelectedRfq(rfq); setShowDetails(true); }}>
                              <Eye className="w-3 h-3 mr-1" /> View
                            </Button>
                            {(rfq.status === 'order_confirmed' || rfq.status === 'quotation_sent') && (
                              <Button size="sm" className="h-8 text-xs font-bold" onClick={() => handleUpdateStatus(rfq.id, 'shipping')}>
                                <Package className="w-3 h-3 mr-1" /> Ship Order
                              </Button>
                            )}
                            {rfq.status === 'shipping' && (
                              <Button size="sm" variant="secondary" className="h-8 text-xs font-bold" onClick={() => handleUpdateStatus(rfq.id, 'delivered')}>
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Mark Delivered
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                          <div className="flex flex-col items-center gap-4 opacity-30">
                            <Package className="w-16 h-16" />
                            <p className="font-headline text-lg font-bold">No Active Assignments</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            )}
          </div>
        )}
      </div>

      {showDetails && selectedRfq && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/95 backdrop-blur-md overflow-y-auto">
          <Card className="w-full max-w-2xl bg-card border-white/10 shadow-2xl p-0 overflow-hidden">
            <div className="bg-primary/10 px-8 py-6 border-b border-white/10 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-headline font-bold">{selectedRfq.projectName}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline" className="border-primary/30 text-primary">{selectedRfq.manufacturingProcess}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Submitted {new Date(selectedRfq.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="hover:bg-white/10" onClick={() => setShowDetails(false)}>
                <CheckCircle2 className="w-6 h-6 rotate-45" />
              </Button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-secondary uppercase tracking-[0.2em]">Technical Specifications</h3>
                  <div className="space-y-3 bg-background/50 p-4 rounded-xl border border-white/5 text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-muted-foreground">Material:</span><span className="font-bold">{selectedRfq.material}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-muted-foreground">Quantity:</span><span className="font-bold">{selectedRfq.quantity} Units</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-muted-foreground">Tolerance:</span><span className="font-bold">{selectedRfq.tolerance}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Surface Finish:</span><span className="font-bold">{selectedRfq.surfaceFinish || 'Standard'}</span></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-secondary uppercase tracking-[0.2em]">Logistics & Client</h3>
                  <div className="space-y-3 bg-background/50 p-4 rounded-xl border border-white/5 text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-muted-foreground">Client:</span><span className="font-bold">{selectedRfq.userName}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-muted-foreground">Team:</span><span className="font-bold">{selectedRfq.teamName}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-muted-foreground">Deadline:</span><span className="font-bold text-primary">{new Date(selectedRfq.deliveryDate).toLocaleDateString()}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Location:</span><span className="font-bold truncate max-w-[120px]">{selectedRfq.deliveryLocation}</span></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-secondary uppercase tracking-[0.2em]">Design Documents</h3>
                {selectedRfq.designFileUrl ? (
                  <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl group hover:bg-primary/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold">{selectedRfq.designFileName || 'Engineering_Drawing.pdf'}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">CAD/Blueprints Ready</p>
                      </div>
                    </div>
                    <Button variant="outline" size="lg" className="gap-2 border-primary/30 text-primary hover:bg-primary hover:text-white" onClick={() => downloadFile(selectedRfq.designFileUrl, selectedRfq.designFileName || 'design.png')}>
                      <Download className="w-4 h-4" /> Download Files
                    </Button>
                  </div>
                ) : (
                  <div className="p-6 text-center border-2 border-dashed border-white/10 rounded-xl">
                    <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground opacity-20 mb-2" />
                    <p className="text-sm text-muted-foreground italic">No design files were attached to this request.</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
                <Button variant="ghost" onClick={() => setShowDetails(false)}>Close Overview</Button>
                {selectedRfq.status === 'rfq_submitted' && (
                  <Button className="bg-primary hover:bg-primary/90 px-8 font-bold" onClick={() => toast({ title: "Inquiry Sent", description: "The admin has been notified of your interest in this RFQ." })}>
                    Submit Expression of Interest
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}