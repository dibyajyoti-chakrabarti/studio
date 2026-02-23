"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Bell, 
  Search, 
  Send,
  Eye,
  Loader2,
  CheckCircle2,
  Hammer
} from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useFirestore, useCollection, useUser, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [isAdminConfirmed, setIsAdminConfirmed] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState('rfqs');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState<any>(null);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  
  const db = useFirestore();
  const { toast } = useToast();
  const logo = PlaceHolderImages.find((img) => img.id === 'mechhub-logo');

  // Verify Admin Status and Redirect if necessary
  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        router.push('/login?redirect=/admin');
      } else {
        user.getIdTokenResult().then((idTokenResult) => {
          if (idTokenResult.claims.admin) {
            setIsAdminConfirmed(true);
          } else {
            toast({
              title: "Access Denied",
              description: "You do not have administrative privileges.",
              variant: "destructive"
            });
            router.push('/dashboard');
          }
        });
      }
    }
  }, [user, isUserLoading, router, toast]);

  // Real-time RFQs query - ONLY for confirmed admins to prevent permission errors
  const rfqsQuery = useMemoFirebase(() => {
    if (!db || isAdminConfirmed !== true) return null;
    return query(collection(db, 'rfqs'), orderBy('createdAt', 'desc'));
  }, [db, isAdminConfirmed]);
  
  const { data: rfqs, isLoading } = useCollection(rfqsQuery);

  const handleSendQuotation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRfq || !db) return;

    setIsSubmittingQuote(true);
    const formData = new FormData(e.currentTarget);
    const price = Number(formData.get('price'));
    const leadTime = Number(formData.get('leadTime'));
    const notes = formData.get('notes') as string;

    const quotationId = Math.random().toString(36).substring(2, 11);
    const quotationData = {
      rfqId: selectedRfq.id,
      userId: selectedRfq.userId,
      quotedPrice: price,
      leadTimeDays: leadTime,
      notes: notes,
      status: 'sent',
      createdAt: new Date().toISOString(),
    };

    try {
      // Create quotation document
      await addDocumentNonBlocking(collection(db, 'quotations'), quotationData);
      
      // Update RFQ status
      const rfqRef = doc(db, 'rfqs', selectedRfq.id);
      updateDocumentNonBlocking(rfqRef, {
        status: 'quotation_sent',
        quotationId: quotationId,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: "Quotation Sent",
        description: `Quote successfully sent to ${selectedRfq.userName}`,
      });
      setShowQuoteModal(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to send quotation.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  const handleUpdateStatus = (rfqId: string, newStatus: string) => {
    const rfqRef = doc(db, 'rfqs', rfqId);
    updateDocumentNonBlocking(rfqRef, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
    toast({
      title: "Status Updated",
      description: `Project is now marked as ${newStatus.replace('_', ' ')}.`,
    });
  };

  if (isAdminConfirmed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-card">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 overflow-hidden rounded bg-primary/20">
            {logo?.imageUrl && (
              <Image
                src={logo.imageUrl}
                alt="MechHub Logo"
                width={32}
                height={32}
                className="object-cover"
                data-ai-hint={logo?.imageHint}
                suppressHydrationWarning
              />
            )}
          </div>
          <span className="font-headline font-bold text-lg">MechHub Admin</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="w-64 pl-10 h-9 bg-background border-white/10" placeholder="Search RFQs, Users..." suppressHydrationWarning />
          </div>
          <Button variant="ghost" size="icon" className="relative" suppressHydrationWarning>
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
          </Button>
          <div className="w-8 h-8 rounded-full bg-secondary text-background font-bold flex items-center justify-center">A</div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 border-r border-white/5 bg-card flex flex-col p-4 space-y-2">
          <Button variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Button>
          <Button variant={activeTab === 'rfqs' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('rfqs')}>
            <ClipboardList className="w-4 h-4" /> RFQ Management
          </Button>
          <Button variant={activeTab === 'vendors' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('vendors')}>
            <Users className="w-4 h-4" /> MechMasters
          </Button>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'rfqs' && (
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-headline font-bold">RFQ Management</h1>
                  <p className="text-muted-foreground">Review incoming requests and manage production lifecycle.</p>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <Card className="bg-card border-white/5">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/5 hover:bg-transparent">
                        <TableHead>Project</TableHead>
                        <TableHead>User / Team</TableHead>
                        <TableHead>Process</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rfqs?.map((rfq) => (
                        <TableRow key={rfq.id} className="border-b border-white/5 hover:bg-white/5">
                          <TableCell>
                            <div className="font-bold">{rfq.projectName || 'Untitled'}</div>
                            <div className="text-xs text-muted-foreground">{new Date(rfq.createdAt).toLocaleDateString()}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{rfq.userName}</div>
                            <div className="text-xs text-muted-foreground">{rfq.teamName}</div>
                          </TableCell>
                          <TableCell>{rfq.manufacturingProcess}</TableCell>
                          <TableCell>
                            <Badge variant={rfq.status === 'quotation_sent' ? 'secondary' : 'default'} className="capitalize">
                              {rfq.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {rfq.status === 'rfq_submitted' && (
                                <Button size="sm" onClick={() => { setSelectedRfq(rfq); setShowQuoteModal(true); }}>
                                  Send Quote
                                </Button>
                              )}
                              {rfq.status === 'confirmed' && (
                                <Button size="sm" variant="secondary" onClick={() => handleUpdateStatus(rfq.id, 'in_production')}>
                                  <Hammer className="w-3 h-3 mr-1" /> Start Production
                                </Button>
                              )}
                              {rfq.status === 'in_production' && (
                                <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(rfq.id, 'completed')}>
                                  <CheckCircle2 className="w-3 h-3 mr-1" /> Complete
                                </Button>
                              )}
                              <Button variant="ghost" size="icon">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>

      {showQuoteModal && selectedRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-card border-white/10 shadow-2xl">
            <CardHeader>
              <CardTitle className="font-headline">Create Quotation</CardTitle>
              <CardDescription>Reviewing {selectedRfq.projectName} from {selectedRfq.userName}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSendQuotation}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price (INR)</Label>
                    <Input name="price" type="number" required placeholder="e.g. 25000" className="bg-background border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Lead Time (Days)</Label>
                    <Input name="leadTime" type="number" required placeholder="e.g. 7" className="bg-background border-white/10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Admin Notes</Label>
                  <textarea name="notes" className="w-full bg-background border border-white/10 rounded-md p-3 min-h-[100px] text-sm" placeholder="Additional details..." />
                </div>
                <div className="pt-4 flex gap-3">
                  <Button type="submit" className="flex-1 gap-2" disabled={isSubmittingQuote}>
                    {isSubmittingQuote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Submit Quote
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowQuoteModal(false)}>Cancel</Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}