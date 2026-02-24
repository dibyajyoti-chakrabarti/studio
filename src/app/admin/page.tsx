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
  Search, 
  Send,
  Eye,
  Loader2,
  CheckCircle2,
  LogOut,
  ShieldCheck,
  Factory,
  User as UserIcon,
  Package,
  Truck,
  MessageSquare,
  FileText,
  DollarSign,
  Download,
  ExternalLink,
  UserCheck
} from 'lucide-react';
import { useFirestore, useCollection, useUser, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking, useAuth } from '@/firebase';
import { collection, query, orderBy, doc, getDoc, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

const STATUS_OPTIONS = [
  { value: 'rfq_submitted', label: 'RFQ Submitted' },
  { value: 'quotation_sent', label: 'Quotation Sent' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'order_confirmed', label: 'Order Confirmed' },
  { value: 'shipping', label: 'Shipping' },
  { value: 'delivered', label: 'Delivered' },
];

export default function AdminPanel() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isAdminConfirmed, setIsAdminConfirmed] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState('rfqs');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
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

  const buyersQuery = useMemoFirebase(() => (db && user && isAdminConfirmed) ? query(collection(db, 'users'), where('role', '==', 'user')) : null, [db, user, isAdminConfirmed]);
  const vendorsQuery = useMemoFirebase(() => (db && user && isAdminConfirmed) ? query(collection(db, 'users'), where('role', '==', 'vendor')) : null, [db, user, isAdminConfirmed]);
  const rfqsQuery = useMemoFirebase(() => (db && user && isAdminConfirmed) ? query(collection(db, 'rfqs'), orderBy('createdAt', 'desc')) : null, [db, user, isAdminConfirmed]);

  const { data: buyers } = useCollection(buyersQuery);
  const { data: vendors } = useCollection(vendorsQuery);
  const { data: rfqs, isLoading: isRfqsLoading } = useCollection(rfqsQuery);

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
    toast({ title: "Status Updated", description: `Project is now in ${newStatus.replace('_', ' ')} phase.` });
  };

  const handlePromoteToVendor = (userId: string) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, 'users', userId), {
      role: 'vendor',
      updatedAt: new Date().toISOString(),
    });
    toast({ title: "Role Updated", description: "User has been promoted to MechMaster." });
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
      .then(() => {
        updateDocumentNonBlocking(doc(db, 'rfqs', selectedRfq.id), {
          status: 'quotation_sent',
          vendorId: vendorId,
          updatedAt: new Date().toISOString(),
        });
        toast({ title: "Quotation Sent", description: "Sent to client and assigned to vendor." });
        setShowQuoteModal(false);
      })
      .finally(() => setIsSubmittingQuote(false));
  };

  const downloadFile = (dataUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <Button variant={activeTab === 'users' ? 'secondary' : 'ghost'} className="justify-start gap-3" onClick={() => setActiveTab('users')}><UserIcon className="w-4 h-4" /> Buyers</Button>
          <Button variant={activeTab === 'vendors' ? 'secondary' : 'ghost'} className="justify-start gap-3" onClick={() => setActiveTab('vendors')}><Factory className="w-4 h-4" /> Vendors</Button>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'rfqs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-headline font-bold">Project Management</h1>
                <Badge variant="outline" className="px-3 py-1">{rfqs?.length || 0} Total Requests</Badge>
              </div>
              
              <Card className="bg-card border-white/5">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead>Project & User</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Requested Vendors</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isRfqsLoading ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
                    ) : rfqs?.map((rfq) => (
                      <TableRow key={rfq.id} className="border-b border-white/5">
                        <TableCell>
                          <div className="font-bold">{rfq.projectName || 'Untitled'}</div>
                          <div className="text-xs text-muted-foreground">{rfq.userName} ({rfq.teamName})</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">{rfq.manufacturingProcess}</div>
                          <div className="text-[10px] text-muted-foreground uppercase">{rfq.material} • Qty: {rfq.quantity}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {rfq.selectedVendors?.map((v: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-[9px] border-white/10">{v}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={rfq.status} 
                            onValueChange={(val) => handleUpdateStatus(rfq.id, val)}
                          >
                            <SelectTrigger className="w-[140px] h-8 text-xs bg-background border-white/10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map(opt => (
                                <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="w-8 h-8" onClick={() => { setSelectedRfq(rfq); setShowDetailsModal(true); }}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            {rfq.status === 'rfq_submitted' && (
                              <Button size="sm" onClick={() => { setSelectedRfq(rfq); setShowQuoteModal(true); }}>
                                <DollarSign className="w-3 h-3 mr-1" /> Quote
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {(activeTab === 'users' || activeTab === 'vendors') && (
            <div className="space-y-6">
              <h1 className="text-3xl font-headline font-bold capitalize">{activeTab} Directory</h1>
              <Card className="bg-card border-white/5">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Status</TableHead>
                      {activeTab === 'users' && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(activeTab === 'users' ? buyers : vendors)?.map((u) => (
                      <TableRow key={u.id} className="border-b border-white/5">
                        <TableCell className="font-bold">{u.fullName}</TableCell>
                        <TableCell>
                          <div className="text-sm">{u.email}</div>
                          <div className="text-xs text-muted-foreground">{u.phone}</div>
                        </TableCell>
                        <TableCell>{u.teamName}</TableCell>
                        <TableCell><Badge variant="outline">{u.onboarded ? 'Onboarded' : 'Pending'}</Badge></TableCell>
                        {activeTab === 'users' && (
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              className="h-8 text-xs font-bold gap-1"
                              onClick={() => handlePromoteToVendor(u.id)}
                            >
                              <UserCheck className="w-3 h-3" /> Onboard as MechMaster
                            </Button>
                          </TableCell>
                        )}
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
            <h2 className="text-xl font-headline font-bold mb-4">Create Quote & Assign Vendor</h2>
            <form onSubmit={handleSendQuotation} className="space-y-4">
              <div className="space-y-2">
                <Label>Assign MechMaster</Label>
                <Select name="vendorId" required>
                  <SelectTrigger className="bg-background border-white/10">
                    <SelectValue placeholder="Select a vendor" />
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

      {showDetailsModal && selectedRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
          <Card className="w-full max-w-2xl bg-card border-white/10 shadow-2xl p-6 my-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-headline font-bold">{selectedRfq.projectName}</h2>
                <p className="text-muted-foreground">Detailed project specifications</p>
              </div>
              <Badge className="text-lg px-4 py-1">{selectedRfq.status.replace('_', ' ')}</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-4">
                <div><h3 className="font-bold text-secondary mb-2 uppercase tracking-widest text-[10px]">Technical Requirements</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Process:</span><span>{selectedRfq.manufacturingProcess}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Material:</span><span>{selectedRfq.material}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Tolerance:</span><span>{selectedRfq.tolerance}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Finish:</span><span>{selectedRfq.surfaceFinish || 'Standard'}</span></div>
                  </div>
                </div>
                <div><h3 className="font-bold text-secondary mb-2 uppercase tracking-widest text-[10px]">Technical Documents</h3>
                  {selectedRfq.designFileUrl ? (
                    <div className="p-3 bg-background border border-white/5 rounded-lg flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary" />
                        <div className="overflow-hidden max-w-[150px]">
                          <p className="font-bold truncate">{selectedRfq.designFileName || 'Design_File'}</p>
                          <p className="text-[10px] text-muted-foreground">Engineering Drawing</p>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" className="hover:text-secondary" onClick={() => downloadFile(selectedRfq.designFileUrl, selectedRfq.designFileName || 'design.png')}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No design files attached to this request.</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div><h3 className="font-bold text-secondary mb-2 uppercase tracking-widest text-[10px]">Logistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Quantity:</span><span>{selectedRfq.quantity} units</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Delivery:</span><span>{new Date(selectedRfq.deliveryDate).toLocaleDateString()}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Location:</span><span>{selectedRfq.deliveryLocation}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Budget:</span><span>{selectedRfq.budgetRange || 'Unspecified'}</span></div>
                  </div>
                </div>
                <div><h3 className="font-bold text-secondary mb-2 uppercase tracking-widest text-[10px]">Contact Info</h3>
                   <div className="p-3 bg-background border border-white/5 rounded-lg">
                      <p className="font-bold">{selectedRfq.userName}</p>
                      <p className="text-xs text-muted-foreground">{selectedRfq.userEmail}</p>
                      <p className="text-xs text-muted-foreground">{selectedRfq.userPhone}</p>
                      <p className="text-[10px] mt-1 text-primary/70 uppercase font-bold">{selectedRole === 'vendor' ? 'Vendor Partner' : selectedRfq.teamName}</p>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-3">
              <Button onClick={() => setShowDetailsModal(false)}>Close Specifications</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
