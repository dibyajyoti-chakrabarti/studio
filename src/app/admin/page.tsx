
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Logo } from '@/components/Logo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ClipboardList, 
  Users, 
  Bell, 
  Search, 
  Send,
  Eye,
  Loader2,
  CheckCircle2,
  Hammer,
  LogOut,
  ShieldCheck,
  Factory,
  User as UserIcon,
  Briefcase
} from 'lucide-react';
import { useFirestore, useCollection, useUser, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking, useAuth } from '@/firebase';
import { collection, query, orderBy, doc, getDoc, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

export default function AdminPanel() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isAdminConfirmed, setIsAdminConfirmed] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState('rfqs');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState<any>(null);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  
  const db = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    async function verifyAdmin() {
      if (!isUserLoading) {
        if (!user) {
          router.push('/login?redirect=/admin');
        } else if (db) {
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists() && userDoc.data()?.role === 'admin') {
              setIsAdminConfirmed(true);
            } else {
              setIsAdminConfirmed(false);
              router.push('/dashboard');
            }
          } catch (err) {
            setIsAdminConfirmed(false);
            router.push('/dashboard');
          }
        }
      }
    }
    verifyAdmin();
  }, [user, isUserLoading, db, router]);

  // Queries for all three types of users
  const buyersQuery = useMemoFirebase(() => db ? query(collection(db, 'users'), where('role', '==', 'user')) : null, [db]);
  const vendorsQuery = useMemoFirebase(() => db ? query(collection(db, 'users'), where('role', '==', 'vendor')) : null, [db]);
  const adminsQuery = useMemoFirebase(() => db ? query(collection(db, 'users'), where('role', '==', 'admin')) : null, [db]);
  const rfqsQuery = useMemoFirebase(() => db ? query(collection(db, 'rfqs'), orderBy('createdAt', 'desc')) : null, [db]);

  const { data: buyers } = useCollection(buyersQuery);
  const { data: vendors } = useCollection(vendorsQuery);
  const { data: admins } = useCollection(adminsQuery);
  const { data: rfqs, isLoading: isRfqsLoading } = useCollection(rfqsQuery);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleSendQuotation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRfq || !db) return;
    setIsSubmittingQuote(true);
    const formData = new FormData(e.currentTarget);
    const vendorId = formData.get('vendorId') as string;

    const quotationData = {
      rfqId: selectedRfq.id,
      userId: selectedRfq.userId,
      vendorId: vendorId,
      quotedPrice: Number(formData.get('price')),
      leadTimeDays: Number(formData.get('leadTime')),
      notes: formData.get('notes') as string,
      status: 'sent',
      createdAt: new Date().toISOString(),
    };

    addDocumentNonBlocking(collection(db, 'quotations'), quotationData)
      .then((quoteRes) => {
        updateDocumentNonBlocking(doc(db, 'rfqs', selectedRfq.id), {
          status: 'quotation_sent',
          vendorId: vendorId,
          quotationId: quoteRes?.id || 'manual',
          updatedAt: new Date().toISOString(),
        });
        toast({ title: "Quotation Sent", description: "Sent to client and assigned to vendor." });
        setShowQuoteModal(false);
      })
      .finally(() => setIsSubmittingQuote(false));
  };

  if (isAdminConfirmed === null || isUserLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!isAdminConfirmed) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-card">
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <span className="font-headline font-bold text-lg">MechHub Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 border-white/10">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 border-r border-white/5 bg-card flex flex-col p-4 space-y-2">
          <Button variant={activeTab === 'rfqs' ? 'secondary' : 'ghost'} className="justify-start gap-3" onClick={() => setActiveTab('rfqs')}><ClipboardList className="w-4 h-4" /> RFQs</Button>
          <Button variant={activeTab === 'users' ? 'secondary' : 'ghost'} className="justify-start gap-3" onClick={() => setActiveTab('users')}><UserIcon className="w-4 h-4" /> Users (Buyers)</Button>
          <Button variant={activeTab === 'vendors' ? 'secondary' : 'ghost'} className="justify-start gap-3" onClick={() => setActiveTab('vendors')}><Factory className="w-4 h-4" /> Vendors (Masters)</Button>
          <Button variant={activeTab === 'admins' ? 'secondary' : 'ghost'} className="justify-start gap-3" onClick={() => setActiveTab('admins')}><ShieldCheck className="w-4 h-4" /> Admins</Button>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'rfqs' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-headline font-bold">Manage RFQs</h1>
              <Card className="bg-card border-white/5">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead>Project</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Selected Vendors</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rfqs?.map((rfq) => (
                      <TableRow key={rfq.id} className="border-b border-white/5">
                        <TableCell><div className="font-bold">{rfq.projectName || 'Untitled'}</div></TableCell>
                        <TableCell>{rfq.userName}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {rfq.selectedVendors?.map((v: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-[9px]">{v}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell><Badge>{rfq.status.replace('_', ' ')}</Badge></TableCell>
                        <TableCell>
                          {rfq.status === 'rfq_submitted' && <Button size="sm" onClick={() => { setSelectedRfq(rfq); setShowQuoteModal(true); }}>Assign & Quote</Button>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {(activeTab === 'users' || activeTab === 'vendors' || activeTab === 'admins') && (
            <div className="space-y-6">
              <h1 className="text-3xl font-headline font-bold capitalize">{activeTab} List</h1>
              <Card className="bg-card border-white/5">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(activeTab === 'users' ? buyers : activeTab === 'vendors' ? vendors : admins)?.map((u) => (
                      <TableRow key={u.id} className="border-b border-white/5">
                        <TableCell className="font-bold">{u.fullName}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.phone}</TableCell>
                        <TableCell><Badge variant="outline">{u.onboarded ? 'Onboarded' : 'Pending'}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}
        </main>
      </div>

      {showQuoteModal && selectedRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-card border-white/10 shadow-2xl p-6">
            <h2 className="text-xl font-headline font-bold mb-4">Create Quote for {selectedRfq.projectName}</h2>
            <form onSubmit={handleSendQuotation} className="space-y-4">
              <div className="space-y-2">
                <Label>Assign MechMaster (Vendor)</Label>
                <Select name="vendorId" required>
                  <SelectTrigger className="bg-background border-white/10">
                    <SelectValue placeholder="Select a vendor to fulfill this" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors?.map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.fullName} ({v.email})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground">User requested: {selectedRfq.selectedVendors?.join(', ')}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Price (INR)</Label><Input name="price" type="number" required /></div>
                <div className="space-y-2"><Label>Lead Time (Days)</Label><Input name="leadTime" type="number" required /></div>
              </div>
              <div className="space-y-2"><Label>Notes</Label><textarea name="notes" className="w-full bg-background border border-white/10 rounded-md p-3 min-h-[100px]" /></div>
              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={isSubmittingQuote}>{isSubmittingQuote ? <Loader2 className="animate-spin" /> : 'Confirm & Send Quote'}</Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowQuoteModal(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
