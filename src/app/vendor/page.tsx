
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Logo } from '@/components/Logo';
import { 
  ClipboardList, 
  Settings, 
  Loader2,
  Hammer,
  CheckCircle2,
  LogOut,
  Package,
  Clock
} from 'lucide-react';
import { useFirestore, useCollection, useUser, useMemoFirebase, updateDocumentNonBlocking, useAuth } from '@/firebase';
import { collection, query, doc, getDoc, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

export default function VendorPortal() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isVendorConfirmed, setIsVendorConfirmed] = useState<boolean | null>(null);
  
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
            if (userDoc.exists() && userDoc.data()?.role === 'vendor') {
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

  // Query for RFQs assigned to this vendor
  const rfqsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'rfqs'), where('vendorId', '==', user.uid));
  }, [db, user?.uid]);
  
  const { data: rfqs, isLoading } = useCollection(rfqsQuery);

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
        <div>
          <h1 className="text-3xl font-headline font-bold">Assigned Projects</h1>
          <p className="text-muted-foreground">Manage production and update status for your active orders.</p>
        </div>

        {isLoading ? (
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
                {rfqs?.length ? rfqs.map((rfq) => (
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
    </div>
  );
}
