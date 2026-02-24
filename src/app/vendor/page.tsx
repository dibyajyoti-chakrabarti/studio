
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
  MapPin
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

  // Ensure queries only run when user is authenticated to avoid permission errors
  const marketplaceQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'rfqs'), where('status', '==', 'rfq_submitted'), orderBy('createdAt', 'desc'));
  }, [db, user]);
  
  const myProjectsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'rfqs'), where('vendorId', '==', user.uid), orderBy('updatedAt', 'desc'));
  }, [db, user]);
  
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
    toast({ title: "Status Updated", description: `Project is now ${newStatus.replace('_', ' ')}.` });
  };

  if (isVendorConfirmed === null || isUserLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!isVendorConfirmed) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-card">
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <span className="font-headline font-bold text-lg">MechMaster Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 border-white/10">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold">Workspace</h1>
            <p className="text-muted-foreground">Browse open requests or manage your active manufacturing projects.</p>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-card border border-white/5 p-1 rounded-lg">
            <TabsList className="bg-transparent">
              <TabsTrigger value="marketplace" className="gap-2"><LayoutGrid className="w-4 h-4" /> Marketplace</TabsTrigger>
              <TabsTrigger value="projects" className="gap-2"><ClipboardList className="w-4 h-4" /> My Projects</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {activeTab === 'marketplace' ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-secondary">
              <Package className="w-5 h-5" />
              <h2 className="text-xl font-bold font-headline">Open RFQs</h2>
            </div>
            {isMarketplaceLoading ? (
              <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" /></div>
            ) : marketplaceRfqs?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketplaceRfqs.map((rfq) => (
                  <Card key={rfq.id} className="bg-card border-white/5 hover:border-secondary/30 transition-all group">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-[10px] uppercase border-secondary/20 text-secondary">{rfq.manufacturingProcess}</Badge>
                        <span className="text-xs text-muted-foreground">{new Date(rfq.createdAt).toLocaleDateString()}</span>
                      </div>
                      <CardTitle className="group-hover:text-secondary transition-colors">{rfq.projectName || 'Untitled'}</CardTitle>
                      <CardDescription className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {rfq.deliveryLocation}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-muted-foreground">Material:</div><div className="font-medium">{rfq.material}</div>
                        <div className="text-muted-foreground">Quantity:</div><div className="font-medium">{rfq.quantity} units</div>
                        <div className="text-muted-foreground">Budget:</div><div className="font-medium">{rfq.budgetRange || 'TBD'}</div>
                      </div>
                      <Button variant="secondary" className="w-full gap-2">
                        <Eye className="w-4 h-4" /> View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card/30 rounded-xl border border-dashed border-white/5">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">No new RFQs available in the marketplace right now.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
             <div className="flex items-center gap-2 text-primary">
              <Hammer className="w-5 h-5" />
              <h2 className="text-xl font-bold font-headline">Active Builds</h2>
            </div>
            {isMyProjectsLoading ? (
              <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" /></div>
            ) : (
              <Card className="bg-card border-white/5">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5">
                      <TableHead>Project</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Process / Material</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myRfqs?.length ? myRfqs.map((rfq) => (
                      <TableRow key={rfq.id} className="border-b border-white/5">
                        <TableCell>
                          <div className="font-bold">{rfq.projectName}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(rfq.createdAt).toLocaleDateString()}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{rfq.userName}</div>
                          <div className="text-xs text-muted-foreground">{rfq.teamName}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{rfq.manufacturingProcess}</div>
                          <div className="text-xs text-muted-foreground">{rfq.material}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={rfq.status === 'completed' ? 'secondary' : 'default'}>
                            {rfq.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {rfq.status === 'confirmed' && (
                              <Button size="sm" onClick={() => handleUpdateStatus(rfq.id, 'in_production')}>
                                <Hammer className="w-3 h-3 mr-1" /> Start Build
                              </Button>
                            )}
                            {rfq.status === 'in_production' && (
                              <Button size="sm" variant="secondary" onClick={() => handleUpdateStatus(rfq.id, 'completed')}>
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Mark Complete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                          No active projects assigned to you yet.
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
    </div>
  );
}
