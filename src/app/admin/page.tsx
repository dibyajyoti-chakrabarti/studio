
"use client"

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  ClipboardList,
  Send,
  Eye,
  Loader2,
  CheckCircle2,
  LogOut,
  ShieldCheck,
  Factory,
  User as UserIcon,
  DollarSign,
  Download,
  UserCheck,
  History,
  TrendingUp,
  AlertCircle,
  Clock,
  Plus,
  Trash2,
  Edit3,
  MapPin,
  Star,
  Upload,
  Image as ImageIcon,
  X,
  FileText,
  ChevronRight,
  ChevronLeft,
  Building2,
  Check,
  User,
  Gavel,
  Menu,
  PanelLeftClose,
  MessageCircleQuestion,
  Package,
  ShoppingCart,
  LayoutGrid
} from 'lucide-react';
import { useFirestore, useCollection, useDoc, useUser, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking, useAuth, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc, getDoc, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import Image from 'next/image';

const STATUS_OPTIONS = [
  { value: 'submitted', label: 'RFQ Submitted' },
  { value: 'quotation_sent', label: 'Quotation Sent' },
  { value: 'quotations_received', label: 'Quotations Received' },
  { value: 'under_negotiation', label: 'Under Negotiation' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'assigned', label: 'Vendor Assigned' },
  { value: 'in_progress', label: 'In Production' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
];

const SPECIALIZATIONS = [
  'CNC Machining',
  'Laser Cutting',
  'Welding & Fabrication',
  'Sheet Metal',
  'Prototype Manufacturing',
  '3D Printing',
  'Small Batch Production'
];

export default function AdminPanel() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isAdminConfirmed, setIsAdminConfirmed] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState('rfqs');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [vendorStep, setVendorStep] = useState(1);
  const totalVendorSteps = 4;

  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showSendQuoteModal, setShowSendQuoteModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  const [selectedRfq, setSelectedRfq] = useState<any>(null);
  const [selectedVendorProfile, setSelectedVendorProfile] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [isSubmittingVendor, setIsSubmittingVendor] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

  const [isRevising, setIsRevising] = useState(false);
  const [revisingQuote, setRevisingQuote] = useState<any>(null);
  const [revPrice, setRevPrice] = useState('');
  const [revLeadTime, setRevLeadTime] = useState('');
  const [revMessage, setRevMessage] = useState('');

  const [sendQuoteVendorId, setSendQuoteVendorId] = useState('');
  const [sendQuotePrice, setSendQuotePrice] = useState('');
  const [sendQuoteLeadTime, setSendQuoteLeadTime] = useState('');
  const [sendQuoteRemarks, setSendQuoteRemarks] = useState('');

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const db = useFirestore();
  const { toast } = useToast();

  const userProfileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  useEffect(() => {
    if (isUserLoading || isProfileLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (profile && profile.role === 'admin') {
      setIsAdminConfirmed(true);
    } else if (profile && profile.role !== 'admin') {
      setIsAdminConfirmed(false);
      toast({
        title: "Access Denied",
        description: "You do not have administrative privileges.",
        variant: "destructive"
      });
      router.push('/dashboard');
    }
  }, [user, isUserLoading, profile, isProfileLoading, router, toast]);

  const buyersQuery = useMemoFirebase(() => (db && isAdminConfirmed) ? query(collection(db, 'users'), where('role', '==', 'customer')) : null, [db, isAdminConfirmed]);
  const vendorsQuery = useMemoFirebase(() => (db && isAdminConfirmed) ? query(collection(db, 'users'), where('role', '==', 'vendor')) : null, [db, isAdminConfirmed]);
  const rfqsQuery = useMemoFirebase(() => (db && isAdminConfirmed) ? query(collection(db, 'rfqs'), orderBy('createdAt', 'desc')) : null, [db, isAdminConfirmed]);
  const consultationsQuery = useMemoFirebase(() => (db && isAdminConfirmed) ? query(collection(db, 'consultationRequests'), orderBy('requestDate', 'desc')) : null, [db, isAdminConfirmed]);
  const productsQuery = useMemoFirebase(() => (db && isAdminConfirmed) ? query(collection(db, 'products'), orderBy('createdAt', 'desc')) : null, [db, isAdminConfirmed]);
  const shopOrdersQuery = useMemoFirebase(() => (db && isAdminConfirmed) ? query(collection(db, 'orders'), orderBy('createdAt', 'desc')) : null, [db, isAdminConfirmed]);

  const quotationsQuery = useMemoFirebase(() => {
    if (!db || !isAdminConfirmed || !selectedRfq) return null;
    return query(collection(db, 'quotations'), where('rfqId', '==', selectedRfq.id));
  }, [db, isAdminConfirmed, selectedRfq?.id]);

  const { data: buyers } = useCollection(buyersQuery);
  const { data: vendors } = useCollection(vendorsQuery);
  const { data: rfqs, isLoading: isRfqsLoading } = useCollection(rfqsQuery);
  const { data: consultations, isLoading: isConsultationsLoading } = useCollection(consultationsQuery);
  const { data: products, isLoading: isProductsLoading, error: productError } = useCollection(productsQuery);
  const { data: shopOrders, isLoading: isShopOrdersLoading } = useCollection(shopOrdersQuery);
  const { data: selectedRfqQuotes } = useCollection(quotationsQuery);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ title: "File too large", description: "Max 2MB logo allowed.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => setProfileImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateStatus = (rfqId: string, newStatus: string) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, 'rfqs', rfqId), {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
    toast({ title: "Status Updated", description: `Project lifecycle updated to ${newStatus}.` });
  };

  const handleShortlistVendor = (rfqId: string, vendorId: string) => {
    if (!db || !selectedRfq) return;
    const currentList = selectedRfq.shortlistedVendorIds || [];
    const newList = currentList.includes(vendorId)
      ? currentList.filter((id: string) => id !== vendorId)
      : [...currentList, vendorId];

    updateDocumentNonBlocking(doc(db, 'rfqs', rfqId), { shortlistedVendorIds: newList });
    toast({ title: "Shortlist Updated", description: "MechMaster selection refined." });
  };

  const handleAssignVendor = (rfqId: string, vendorId: string) => {
    if (!db || !confirm("Assign this project to this vendor and finalize negotiations?")) return;
    updateDocumentNonBlocking(doc(db, 'rfqs', rfqId), {
      assignedVendorId: vendorId,
      status: 'assigned',
      updatedAt: new Date().toISOString()
    });
    toast({ title: "Vendor Assigned", description: "Project has been officially assigned." });
  };

  const handleSaveVendor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db || !user) return;
    setIsSubmittingVendor(true);
    const formData = new FormData(e.currentTarget);
    const vendorId = selectedVendorProfile?.id || Math.random().toString(36).substring(2, 11);
    const specs: string[] = [];
    SPECIALIZATIONS.forEach(s => { if (formData.get(s)) specs.push(s); });

    const vendorData = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      teamName: formData.get('teamName') as string,
      location: formData.get('location') as string,
      experienceYears: Number(formData.get('experienceYears')),
      rating: Number(formData.get('rating')),
      portfolio: formData.get('portfolio') as string,
      imageUrl: profileImage,
      specializations: specs,
      role: 'vendor',
      status: 'active',
      onboarded: true,
      isActive: formData.get('isActive') === 'on',
      isVerified: formData.get('isVerified') === 'on',
      updatedAt: new Date().toISOString(),
      ...(selectedVendorProfile ? {} : { createdAt: new Date().toISOString() })
    };

    setDocumentNonBlocking(doc(db, 'users', vendorId), vendorData, { merge: true });
    setIsSubmittingVendor(false);
    setShowVendorModal(false);
    setSelectedVendorProfile(null);
    setProfileImage(null);
    setVendorStep(1);
    toast({ title: "Vendor Registry Updated" });
  };

  const handleAdminReviseQuote = () => {
    if (!db || !revisingQuote || !selectedRfq) return;
    const historyItem = {
      party: 'admin',
      price: Number(revPrice),
      leadTime: Number(revLeadTime),
      message: revMessage,
      createdAt: new Date().toISOString(),
    };
    const newHistory = [...(revisingQuote.negotiationHistory || []), historyItem];

    updateDocumentNonBlocking(doc(db, 'quotations', revisingQuote.id), {
      status: 'revised',
      quotedPrice: Number(revPrice),
      leadTimeDays: Number(revLeadTime),
      negotiationHistory: newHistory,
      updatedAt: new Date().toISOString()
    });

    updateDocumentNonBlocking(doc(db, 'rfqs', selectedRfq.id), {
      status: 'under_negotiation',
      updatedAt: new Date().toISOString()
    });

    setIsRevising(false);
    toast({ title: "Quotation Revised", description: "Intervention logged. RFQ moved to negotiation." });
  };

  const handleAdminSendQuotation = () => {
    if (!db || !selectedRfq || !sendQuoteVendorId) return;
    const vendorObj = vendors?.find((v: any) => v.id === sendQuoteVendorId);

    const quotationData = {
      rfqId: selectedRfq.id,
      userId: selectedRfq.userId,
      vendorId: sendQuoteVendorId,
      vendorName: vendorObj?.teamName || vendorObj?.fullName || 'MechMaster',
      quotedPrice: Number(sendQuotePrice),
      leadTimeDays: Number(sendQuoteLeadTime),
      notes: sendQuoteRemarks,
      status: 'pending',
      negotiationHistory: [{
        party: 'admin',
        price: Number(sendQuotePrice),
        leadTime: Number(sendQuoteLeadTime),
        message: sendQuoteRemarks || 'Initial quotation sent by admin.',
        createdAt: new Date().toISOString(),
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addDocumentNonBlocking(collection(db, 'quotations'), quotationData);
    updateDocumentNonBlocking(doc(db, 'rfqs', selectedRfq.id), {
      status: 'quotation_sent',
      updatedAt: new Date().toISOString()
    });

    setShowSendQuoteModal(false);
    setSendQuoteVendorId('');
    setSendQuotePrice('');
    setSendQuoteLeadTime('');
    setSendQuoteRemarks('');
    toast({ title: "Quotation Sent", description: "Customer will be notified of the new quotation." });
  };

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db) return;
    setIsSubmittingProduct(true);
    const formData = new FormData(e.currentTarget);
    const productId = selectedProduct?.id || Math.random().toString(36).substring(2, 11);

    const productData = {
      name: formData.get('name') as string,
      sku: formData.get('sku') as string,
      categoryId: formData.get('categoryId') as string,
      basePrice: Number(formData.get('basePrice')),
      salePrice: Number(formData.get('salePrice')),
      inventory: Number(formData.get('inventory')),
      specs: formData.get('specs') as string,
      description: formData.get('description') as string,
      isActive: formData.get('isActive') === 'on',
      updatedAt: new Date().toISOString(),
      ...(selectedProduct ? {} : { createdAt: new Date().toISOString() })
    };

    setDocumentNonBlocking(doc(db, 'products', productId), productData, { merge: true });
    setIsSubmittingProduct(false);
    setShowProductModal(false);
    setSelectedProduct(null);
    toast({ title: "Catalogue Updated", description: "Product information synchronized." });
  };

  const handleDeleteProduct = (productId: string) => {
    if (!db || !confirm("Permanently archive this product from the marketplace?")) return;
    deleteDocumentNonBlocking(doc(db, 'products', productId));
    toast({ title: "Product Archived" });
  };

  if (isAdminConfirmed === null || isUserLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-primary" /></div>;
  if (!isAdminConfirmed) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 sm:px-8 bg-card sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-white" onClick={() => setSidebarOpen(v => !v)}>
            {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <Image src="/mechhub.png" alt="MechHub Logo" width={44} height={44} />
          <span className="font-headline font-bold text-lg text-white hidden sm:inline">MechHub Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 border-white/10 hover:bg-white/5">
            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`
          border-r border-white/5 bg-card flex flex-col p-3 space-y-1.5 transition-all duration-200 ease-in-out shrink-0 z-40
          fixed md:relative top-16 md:top-0 bottom-0 left-0
          ${sidebarOpen ? 'w-56 translate-x-0' : 'w-[60px] -translate-x-full md:translate-x-0'}
        `}>
          {[
            { key: 'rfqs', label: 'RFQs', icon: ClipboardList },
            { key: 'shop_orders', label: 'Shop Orders', icon: Package },
            { key: 'products', label: 'Products', icon: ShoppingCart },
            { key: 'users', label: 'Buyers', icon: UserIcon },
            { key: 'vendors', label: 'MechMasters', icon: Factory },
            { key: 'consultations', label: 'Consultations', icon: MessageCircleQuestion },
          ].map(item => (
            <Button
              key={item.key}
              variant={activeTab === item.key ? 'secondary' : 'ghost'}
              className={`gap-3 transition-all duration-200 ${sidebarOpen ? 'justify-start px-3' : 'justify-center px-0'}`}
              onClick={() => { setActiveTab(item.key); if (window.innerWidth < 768) setSidebarOpen(false); }}
              title={item.label}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span className="truncate text-sm">{item.label}</span>}
            </Button>
          ))}
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'rfqs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-headline font-bold text-white">Project Lifecycle Control</h1>
                <Badge variant="outline" className="px-3 py-1 border-white/10 text-white">{rfqs?.length || 0} RFQs</Badge>
              </div>

              <Card className="bg-card border-white/5 overflow-x-auto">
                <Table className="min-w-[700px]">
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-white">Project & Buyer</TableHead>
                      <TableHead className="text-white">Requirements</TableHead>
                      <TableHead className="text-white">Lifecycle Stage</TableHead>
                      <TableHead className="text-white">Assignment</TableHead>
                      <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isRfqsLoading ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="animate-spin mx-auto text-primary" /></TableCell></TableRow>
                    ) : rfqs?.map((rfq) => (
                      <TableRow key={rfq.id} className="border-b border-white/5">
                        <TableCell>
                          <div className="font-bold text-white">{rfq.projectName}</div>
                          <div className="text-sm text-muted-foreground">{rfq.userName}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-white">{rfq.manufacturingProcess}</div>
                          <div className="text-[10px] text-muted-foreground uppercase">{rfq.material} | Qty: {rfq.quantity}</div>
                        </TableCell>
                        <TableCell>
                          <Select value={rfq.status} onValueChange={(val) => handleUpdateStatus(rfq.id, val)}>
                            <SelectTrigger className="w-[180px] h-8 text-xs bg-background border-white/10">
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
                          {rfq.assignedVendorId ? (
                            <div className="space-y-1.5">
                              <Badge className="bg-green-500/20 text-green-500 border-none">Assigned</Badge>
                              {rfq.paymentStatus?.advance?.paid && (
                                <div className="text-[10px] flex items-center gap-1 text-green-400 font-bold">
                                  <Check className="w-3 h-3" />
                                  {rfq.paymentStatus?.completion?.paid ? 'Fully Paid' : 'Advance Paid'}
                                </div>
                              )}
                            </div>
                          ) : (
                            <Badge variant="outline" className="border-white/10 text-muted-foreground">Pending Selection</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button size="icon" variant="ghost" className="w-8 h-8" onClick={() => { setSelectedRfq(rfq); setShowDetailsModal(true); }}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-headline font-bold text-white">Innovator Directory</h1>
              <Card className="bg-card border-white/5 overflow-x-auto">
                <Table className="min-w-[600px]">
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-white">Full Name</TableHead>
                      <TableHead className="text-white">Organization</TableHead>
                      <TableHead className="text-white">Contact</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buyers?.map((u) => (
                      <TableRow key={u.id} className="border-b border-white/5">
                        <TableCell className="font-bold text-white">{u.fullName}</TableCell>
                        <TableCell className="text-white">{u.teamName}</TableCell>
                        <TableCell>
                          <div className="text-sm text-white">{u.email}</div>
                          <div className="text-xs text-muted-foreground">{u.phone}</div>
                        </TableCell>
                        <TableCell><Badge className="bg-primary/20 text-primary">{u.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {activeTab === 'vendors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-headline font-bold text-white">MechMaster Registry</h1>
                <Button onClick={() => { setSelectedVendorProfile(null); setShowVendorModal(true); }} className="gap-2" size="sm">
                  <Plus className="w-4 h-4" /> Add MechMaster
                </Button>
              </div>
              <Card className="bg-card border-white/5 overflow-x-auto">
                <Table className="min-w-[700px]">
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-white">Company</TableHead>
                      <TableHead className="text-white">Capabilities</TableHead>
                      <TableHead className="text-white">Rating</TableHead>
                      <TableHead className="text-white">Location</TableHead>
                      <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors?.map((v) => (
                      <TableRow key={v.id} className="border-b border-white/5">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded overflow-hidden bg-muted">
                              <Image src={v.imageUrl || "/mechhub.png"} alt={v.fullName || "Vendor Logo"} fill className="object-cover" />
                            </div>
                            <div>
                              <div className="font-bold text-white flex items-center gap-1">{v.fullName} {v.isVerified && <ShieldCheck className="w-3 h-3 text-secondary" />}</div>
                              <div className="text-[10px] text-muted-foreground">{v.teamName}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {v.specializations?.map((s: string, i: number) => (
                              <Badge key={i} className="text-[8px] uppercase border-secondary/20 bg-secondary/5 text-secondary">{s}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-yellow-500 font-bold text-xs"><Star className="w-3 h-3 fill-yellow-500" /> {v.rating}</div>
                        </TableCell>
                        <TableCell className="text-xs text-white"><MapPin className="w-3 h-3 inline mr-1" />{v.location}</TableCell>
                        <TableCell>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setSelectedVendorProfile(v); setProfileImage(v.imageUrl); setShowVendorModal(true); }}>
                            <Edit3 className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-headline font-bold text-white">Product Catalogue</h1>
                <Button onClick={() => { setSelectedProduct(null); setShowProductModal(true); }} className="gap-2" size="sm">
                  <Plus className="w-4 h-4" /> Add SKU
                </Button>
              </div>

              <Card className="bg-card border-white/5 overflow-x-auto">
                <Table className="min-w-[800px]">
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-white">Product & SKU</TableHead>
                      <TableHead className="text-white">Category</TableHead>
                      <TableHead className="text-white">Pricing (INR)</TableHead>
                      <TableHead className="text-white text-center">Stock</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isProductsLoading ? (
                      <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="animate-spin mx-auto text-primary" /></TableCell></TableRow>
                    ) : productError ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">
                          <AlertCircle className="w-10 h-10 mx-auto text-destructive/50 mb-3" />
                          <p className="text-sm font-bold text-destructive">Permission Denied</p>
                          <p className="text-xs text-muted-foreground mt-1">Check Firestore security rules or authentication status.</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      products?.map((prod) => (
                        <TableRow key={prod.id} className="border-b border-white/5 group hover:bg-white/[0.01]">
                          <TableCell>
                            <div className="font-bold text-white mb-0.5">{prod.name}</div>
                            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{prod.sku}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px] border-white/10 uppercase tracking-widest">{prod.categoryId}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-bold text-white">₹{prod.salePrice}</div>
                            <div className="text-[10px] text-muted-foreground line-through opacity-40">₹{prod.basePrice}</div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`text-sm font-bold ${prod.inventory < 10 ? 'text-orange-500' : 'text-zinc-400'}`}>{prod.inventory}</span>
                          </TableCell>
                          <TableCell>
                            <Badge className={prod.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-zinc-500/10 text-zinc-500 border-white/10'}>
                              {prod.isActive ? 'Active' : 'Disabled'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button size="icon" variant="ghost" className="w-8 h-8 hover:text-primary transition-colors" onClick={() => { setSelectedProduct(prod); setShowProductModal(true); }}>
                                <Edit3 className="w-3.5 h-3.5" />
                              </Button>
                              <Button size="icon" variant="ghost" className="w-8 h-8 hover:text-destructive transition-colors" onClick={() => handleDeleteProduct(prod.id)}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {activeTab === 'consultations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-headline font-bold text-white">Consultation Requests</h1>
                <Badge variant="outline" className="px-3 py-1 border-white/10 text-white">{consultations?.length || 0} Requests</Badge>
              </div>

              <Card className="bg-card border-white/5 overflow-x-auto">
                <Table className="min-w-[900px]">
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-white w-[180px]">Customer</TableHead>
                      <TableHead className="text-white w-[250px]">RFQ Details</TableHead>
                      <TableHead className="text-white min-w-[300px]">Project Brief</TableHead>
                      <TableHead className="text-white w-[140px] text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isConsultationsLoading ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="animate-spin mx-auto text-primary" /></TableCell></TableRow>
                    ) : consultations?.map((req) => (
                      <TableRow key={req.id} className="border-b border-white/5 align-top">
                        <TableCell>
                          <div className="font-bold text-white">{req.name}</div>
                          <div className="text-sm text-muted-foreground">{req.email}</div>
                          <div className="text-xs text-muted-foreground">{req.phone}</div>
                        </TableCell>
                        <TableCell>
                          {req.quoteRef ? (
                            <div className="space-y-1.5 p-2 rounded-md bg-blue-950/20 border border-blue-900/40">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded">
                                  {req.quoteRef}
                                </span>
                                <span className="text-xs font-bold text-emerald-400">{req.estimate}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 bg-white/5 text-muted-foreground border-white/10">{req.process}</Badge>
                                <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 bg-white/5 text-muted-foreground border-white/10">{req.material}</Badge>
                                <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 bg-white/5 text-muted-foreground border-white/10">{req.quantity} pcs</Badge>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground italic">General Inquiry (No Quote Ref)</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap rounded-md bg-white/[0.02] p-3 border border-white/[0.04]">
                            {req.message}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="text-sm text-white">{new Date(req.requestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                          <div className="text-xs text-muted-foreground">{new Date(req.requestDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!isConsultationsLoading && consultations?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                          No consultation requests found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {activeTab === 'shop_orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-headline font-bold text-white uppercase italic">Shop Procurement Hub</h1>
                <Badge variant="outline" className="px-3 py-1 border-white/10 text-white uppercase tracking-widest font-bold">{shopOrders?.length || 0} Orders</Badge>
              </div>

              <Card className="bg-card border-white/5 overflow-x-auto shadow-2xl">
                <Table className="min-w-[900px]">
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-white">Order Ref</TableHead>
                      <TableHead className="text-white">Customer & Logistics</TableHead>
                      <TableHead className="text-white">Component Lineage</TableHead>
                      <TableHead className="text-white text-right">Value (INR)</TableHead>
                      <TableHead className="text-white">Fulfillment Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isShopOrdersLoading ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="animate-spin mx-auto text-primary" /></TableCell></TableRow>
                    ) : shopOrders?.length ? shopOrders.map((order: any) => (
                      <TableRow key={order.id} className="border-b border-white/5 group hover:bg-white/[0.01]">
                        <TableCell>
                          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">#{order.id.slice(-8)}</div>
                          <div className="text-[9px] text-zinc-600 mt-1 uppercase font-bold">{new Date(order.createdAt).toLocaleDateString()}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-zinc-200 text-sm italic underline decoration-cyan-500/30 underline-offset-4">{order.shippingAddress?.fullName}</div>
                          <div className="text-[10px] text-zinc-500 mt-1 uppercase tracking-tighter truncate max-w-[150px]">{order.shippingAddress?.city}, {order.shippingAddress?.state}</div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="text-[10px] text-zinc-300 font-medium flex items-center gap-2">
                                <span className="text-cyan-500/70">[{item.quantity}x]</span> {item.name}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="text-sm font-bold font-mono text-zinc-200">₹{order.pricing.total.toLocaleString()}</div>
                          <Badge variant="outline" className="text-[8px] border-emerald-500/20 text-emerald-500 uppercase py-0 leading-tight">GST PAID</Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(val) => {
                              updateDocumentNonBlocking(doc(db, 'orders', order.id), { status: val, updatedAt: new Date().toISOString() });
                              toast({ title: "Order Updated", description: `Order status set to ${val}` });
                            }}
                          >
                            <SelectTrigger className="w-[140px] h-8 text-[10px] bg-background border-white/10 uppercase font-bold tracking-widest">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="paid" className="text-[10px] font-bold">PAID (TXN)</SelectItem>
                              <SelectItem value="processing" className="text-[10px] font-bold">PROCESSING</SelectItem>
                              <SelectItem value="shipped" className="text-[10px] font-bold">SHIPPED</SelectItem>
                              <SelectItem value="delivered" className="text-[10px] font-bold">DELIVERED</SelectItem>
                              <SelectItem value="cancelled" className="text-[10px] font-bold">CANCELLED</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                          No shop orders found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

        </main>
      </div>

      {showDetailsModal && selectedRfq && (() => {
        const fileList: { name: string; dataUrl: string; size?: number }[] =
          selectedRfq.designFiles?.length > 0
            ? selectedRfq.designFiles
            : selectedRfq.designFileUrl
              ? [{ name: selectedRfq.designFileName || 'design_file', dataUrl: selectedRfq.designFileUrl }]
              : [];
        const getExt = (n: string) => { const e = n.split('.').pop()?.toUpperCase() || 'FILE'; return e.length > 4 ? e.slice(0, 4) : e; };
        const sc: Record<string, string> = {
          submitted: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
          quotation_sent: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
          under_negotiation: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
          accepted: 'bg-green-500/15 text-green-400 border-green-500/25',
          assigned: 'bg-green-500/15 text-green-400 border-green-500/25',
          in_progress: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
          completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
          rejected: 'bg-red-500/15 text-red-400 border-red-500/25',
          cancelled: 'bg-red-500/15 text-red-400 border-red-500/25',
        };
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm">
            <Card className="w-full max-w-5xl max-h-[92vh] bg-card border-white/[0.06] shadow-2xl shadow-black/50 overflow-hidden flex flex-col">
              <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
              <div className="px-4 sm:px-8 pt-4 sm:pt-6 pb-3 sm:pb-5 flex items-start justify-between gap-3 sm:gap-4 shrink-0">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-2xl font-headline font-bold text-white truncate">{selectedRfq.projectName}</h2>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground flex-wrap">
                    <span className="font-mono text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/5">{selectedRfq.id.slice(0, 14)}</span>
                    <span className="opacity-40">|</span>
                    <span>{selectedRfq.userName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge className={`text-[10px] px-3 py-1.5 font-bold uppercase tracking-wider border ${sc[selectedRfq.status] || 'bg-white/10 text-white border-white/20'}`}>
                    {selectedRfq.status.replace(/_/g, ' ')}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white" onClick={() => setShowDetailsModal(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="h-px bg-white/5" />

              <div className="px-4 sm:px-8 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 overflow-y-auto flex-1 min-h-0">
                {/* Left */}
                <div className="lg:col-span-5 space-y-6">
                  <div>
                    <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-secondary mb-3"><ClipboardList className="w-3.5 h-3.5" /> Specifications</h3>
                    <div className="rounded-xl bg-background/60 border border-white/5 overflow-hidden divide-y divide-white/[0.03]">
                      {[
                        ['Process', selectedRfq.manufacturingProcess],
                        ['Material', selectedRfq.material],
                        ['Thickness', selectedRfq.thickness || '-'],
                        ['Weight', selectedRfq.weight || '-'],
                        ['Quantity', `${selectedRfq.quantity} units`],
                        ['Tolerance', selectedRfq.tolerance || '-'],
                        ['Surface', selectedRfq.surfaceFinish || '-'],
                        ['Budget', selectedRfq.budgetRange || '-'],
                        ['Location', selectedRfq.deliveryLocation || '-'],
                        ['Deadline', new Date(selectedRfq.deliveryDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })],
                      ].map(([l, v], i) => (
                        <div key={i} className="grid grid-cols-[auto_1fr] gap-4 px-4 py-2.5 text-sm items-start">
                          <span className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold pt-0.5">{l}</span>
                          <span className="text-white font-bold text-right break-words leading-relaxed">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedRfq.extraRequirements && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-secondary mb-3"><MessageCircleQuestion className="w-3.5 h-3.5" /> Extra Requirements</h3>
                      <div className="rounded-xl bg-zinc-950/40 border border-white/5 p-4 text-[13px] leading-relaxed text-zinc-300 whitespace-pre-wrap italic">
                        "{selectedRfq.extraRequirements}"
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-secondary mb-3">
                      <FileText className="w-3.5 h-3.5" /> Design Files
                      {fileList.length > 0 && <span className="ml-auto text-[10px] text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">{fileList.length}</span>}
                    </h3>
                    {fileList.length === 0 ? (
                      <div className="rounded-xl bg-background/30 border border-dashed border-white/[0.08] p-6 text-center">
                        <FileText className="w-7 h-7 mx-auto text-muted-foreground/15 mb-2" />
                        <p className="text-xs text-muted-foreground">No files attached</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {fileList.map((f: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-background/50 border border-white/5 group hover:border-white/10 transition-all">
                            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                              <span className="text-[9px] font-extrabold text-primary uppercase">{getExt(f.name)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{f.name}</p>
                              {f.size && <p className="text-[10px] text-muted-foreground">{(f.size / 1024 / 1024).toFixed(2)} MB</p>}
                            </div>
                            <Button size="sm" variant="ghost" className="gap-1 text-xs text-primary hover:text-primary/80 opacity-50 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                const url = f.dataUrl;
                                if (url.startsWith('data:')) { const a = document.createElement('a'); a.href = url; a.download = f.name; document.body.appendChild(a); a.click(); document.body.removeChild(a); }
                                else { window.open(url, '_blank', 'noopener,noreferrer'); }
                              }}>
                              <Download className="w-3.5 h-3.5" /> Save
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-secondary mb-3"><Factory className="w-3.5 h-3.5" /> Vendor Shortlist</h3>
                    <div className="space-y-1.5">
                      {vendors?.filter(v => selectedRfq.selectedVendorIds?.includes(v.id)).map(v => {
                        const sl = selectedRfq.shortlistedVendorIds?.includes(v.id);
                        return (
                          <div key={v.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${sl ? 'bg-secondary/5 border-secondary/20 hover:border-secondary/30' : 'bg-background/50 border-white/5 hover:border-white/10'}`}
                            onClick={() => handleShortlistVendor(selectedRfq.id, v.id)}>
                            <Avatar className="w-9 h-9 border border-white/10"><AvatarImage src={v.imageUrl} /><AvatarFallback className="text-xs font-bold bg-white/5">{v.fullName?.[0] || 'V'}</AvatarFallback></Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white truncate">{v.fullName}</p>
                              <p className="text-[11px] text-muted-foreground">{v.teamName}</p>
                            </div>
                            <Checkbox checked={sl} onCheckedChange={() => handleShortlistVendor(selectedRfq.id, v.id)} className="data-[state=checked]:bg-secondary data-[state=checked]:border-secondary" />
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 pl-1">Check to shortlist for assignment.</p>
                  </div>
                </div>

                {/* Right */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Payment & Milestone Tracking (Only visible if a finalPrice exists meaning order is accepted) */}
                  {selectedRfq.finalPrice > 0 && (
                    <div>
                      <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-orange-400 mb-4">
                        <DollarSign className="w-3.5 h-3.5" /> Financial & Milestone Tracking
                      </h3>
                      <div className="rounded-xl border border-white/[0.06] bg-background/60 overflow-hidden text-sm">
                        <div className="p-4 border-b border-white/[0.06] flex justify-between items-center bg-white/[0.02]">
                          <span className="text-muted-foreground">Total Order Value</span>
                          <span className="font-bold text-white text-lg">INR {Number(selectedRfq.finalPrice).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
                          {/* Advance Payment Block */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">50% Advance</span>
                              {selectedRfq.paymentStatus?.advance?.paid ? (
                                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px]">PAID</Badge>
                              ) : (
                                <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-[10px]">PENDING</Badge>
                              )}
                            </div>
                            <div>
                              <p className="text-xl font-bold text-white">INR {Math.round(selectedRfq.finalPrice * 0.5).toLocaleString('en-IN')}</p>
                            </div>
                            {selectedRfq.paymentStatus?.advance?.paid && (
                              <div className="text-[10px] text-muted-foreground space-y-1 bg-black/20 p-2 rounded border border-white/5">
                                <p>On: {new Date(selectedRfq.paymentStatus.advance.paidAt).toLocaleString('en-IN')}</p>
                                <p className="font-mono text-[9px] truncate">Ref: {selectedRfq.paymentStatus.advance.razorpayPaymentId}</p>
                              </div>
                            )}
                          </div>

                          {/* Completion Payment Block */}
                          <div className="space-y-3 md:pl-4 pt-4 md:pt-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">50% Completion</span>
                              {selectedRfq.paymentStatus?.completion?.paid ? (
                                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px]">PAID</Badge>
                              ) : (
                                <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[10px]">{selectedRfq.paymentStatus?.advance?.paid ? 'AWAITING DELIVERY' : 'PENDING'}</Badge>
                              )}
                            </div>
                            <div>
                              <p className="text-xl font-bold text-white">INR {Math.round(selectedRfq.finalPrice * 0.5).toLocaleString('en-IN')}</p>
                            </div>
                            {selectedRfq.paymentStatus?.completion?.paid && (
                              <div className="text-[10px] text-muted-foreground space-y-1 bg-black/20 p-2 rounded border border-white/5">
                                <p>On: {new Date(selectedRfq.paymentStatus.completion.paidAt).toLocaleString('en-IN')}</p>
                                <p className="font-mono text-[9px] truncate">Ref: {selectedRfq.paymentStatus.completion.razorpayPaymentId}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-primary mb-4">
                    <TrendingUp className="w-3.5 h-3.5" /> Bidding & Negotiations
                  </h3>
                  <div className="space-y-3">
                    {selectedRfqQuotes?.map(quote => (
                      <Card key={quote.id} className="bg-background/60 border-white/[0.06] overflow-hidden hover:border-white/10 transition-all">
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="min-w-0">
                              <p className="font-bold text-white text-base truncate">{quote.vendorName}</p>
                              <Badge variant="outline" className={`text-[9px] uppercase mt-1 ${quote.status === 'pending' ? 'border-yellow-500/25 text-yellow-400' : quote.status === 'accepted' ? 'border-green-500/25 text-green-400' : 'border-white/15 text-muted-foreground'}`}>{quote.status}</Badge>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xl font-bold text-secondary">INR {Number(quote.quotedPrice).toLocaleString('en-IN')}</p>
                              <p className="text-xs text-muted-foreground">{quote.leadTimeDays} days</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1 font-semibold border-white/10 hover:bg-white/5 gap-1.5" onClick={() => { setRevisingQuote(quote); setIsRevising(true); }}>
                              <History className="w-3.5 h-3.5" /> Review
                            </Button>
                            <Button size="sm" className="flex-1 font-semibold gap-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 border border-secondary/20" onClick={() => handleAssignVendor(selectedRfq.id, quote.vendorId)}>
                              <UserCheck className="w-3.5 h-3.5" /> Assign
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                    {(!selectedRfqQuotes || selectedRfqQuotes.length === 0) && (
                      <div className="p-8 sm:p-14 text-center rounded-2xl bg-background/30 border border-dashed border-white/[0.06]">
                        <Clock className="w-10 h-10 mx-auto text-muted-foreground/15 mb-3" />
                        <p className="text-sm text-muted-foreground">No active bids yet</p>
                        <p className="text-xs text-muted-foreground/50 mt-1">Send a quotation to start receiving bids.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-4 sm:px-8 py-3 sm:py-5 bg-background/40 border-t border-white/5 flex items-center justify-end gap-3 shrink-0">
                <Button variant="outline" className="px-8 border-white/10 hover:bg-white/5" onClick={() => setShowDetailsModal(false)}>Close</Button>
                <Button className="px-8 font-bold gap-2" onClick={() => setShowSendQuoteModal(true)}><Send className="w-4 h-4" /> Send Quotation</Button>
              </div>
            </Card>
          </div>
        );
      })()}

      {showSendQuoteModal && selectedRfq && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md">
          <Card className="w-full max-w-md bg-card border-white/10 p-8 shadow-2xl">
            <h2 className="text-xl font-headline font-bold mb-6 text-white flex items-center gap-2"><Send className="w-5 h-5 text-secondary" /> Send Quotation to Customer</h2>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label>Assign Vendor</Label>
                <Select value={sendQuoteVendorId} onValueChange={setSendQuoteVendorId}>
                  <SelectTrigger className="bg-background border-white/10"><SelectValue placeholder="Select a MechMaster" /></SelectTrigger>
                  <SelectContent className="z-[200]">
                    {vendors?.map((v: any) => (
                      <SelectItem key={v.id} value={v.id}>{v.teamName || v.fullName} - {v.location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Quoted Price (INR)</Label><Input value={sendQuotePrice} onChange={e => setSendQuotePrice(e.target.value)} type="number" className="bg-background" /></div>
                <div className="space-y-2"><Label>Lead Time (Days)</Label><Input value={sendQuoteLeadTime} onChange={e => setSendQuoteLeadTime(e.target.value)} type="number" className="bg-background" /></div>
              </div>
              <div className="space-y-2"><Label>Admin Remarks</Label><Textarea value={sendQuoteRemarks} onChange={e => setSendQuoteRemarks(e.target.value)} className="bg-background h-24" placeholder="Notes about this quotation for the customer..." /></div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 font-bold h-12" onClick={handleAdminSendQuotation} disabled={!sendQuoteVendorId || !sendQuotePrice || !sendQuoteLeadTime}>Send to Customer</Button>
                <Button variant="outline" className="flex-1 border-white/10 h-12" onClick={() => setShowSendQuoteModal(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )
      }

      {
        showVendorModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-background/95 backdrop-blur-md overflow-y-auto">
            <Card className="w-full max-w-2xl bg-card border-white/10 shadow-2xl">
              <div className="bg-primary/10 p-6 border-b border-white/5 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-headline font-bold text-white">MechMaster Wizard</h2>
                  <p className="text-sm text-muted-foreground">Step {vendorStep} of {totalVendorSteps}</p>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map(s => <div key={s} className={`w-2 h-2 rounded-full ${vendorStep >= s ? 'bg-secondary' : 'bg-white/10'}`} />)}
                </div>
              </div>

              <form onSubmit={handleSaveVendor}>
                <div className="p-8">
                  <div className={`${vendorStep !== 1 ? 'hidden' : ''} space-y-6 animate-in fade-in slide-in-from-bottom-2`}>
                    <div className="flex items-center gap-6">
                      <div className="relative w-24 h-24 rounded-lg bg-background border border-white/10 overflow-hidden flex items-center justify-center">
                        {profileImage ? <Image src={profileImage} alt="Preview" fill className="object-cover" /> : <ImageIcon className="opacity-10 w-8 h-8" />}
                      </div>
                      <div className="space-y-2 flex-1">
                        <Label className="text-xs uppercase font-bold text-secondary">MechMaster Identity</Label>
                        <Button type="button" variant="outline" className="w-full border-white/10 gap-2 h-10" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="w-4 h-4" /> Upload Brand Logo
                        </Button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Company Name</Label><Input name="teamName" defaultValue={selectedVendorProfile?.teamName} required className="bg-background" /></div>
                      <div className="space-y-2"><Label>Primary Contact</Label><Input name="fullName" defaultValue={selectedVendorProfile?.fullName} required className="bg-background" /></div>
                    </div>
                  </div>

                  <div className={`${vendorStep !== 2 ? 'hidden' : ''} space-y-6 animate-in fade-in slide-in-from-right-2`}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Work Email</Label><Input name="email" type="email" defaultValue={selectedVendorProfile?.email} required className="bg-background" /></div>
                      <div className="space-y-2"><Label>Direct Phone</Label><Input name="phone" defaultValue={selectedVendorProfile?.phone} required className="bg-background" /></div>
                      <div className="space-y-2 col-span-2"><Label>Workshop Location</Label><Input name="location" defaultValue={selectedVendorProfile?.location} placeholder="City, State" className="bg-background" /></div>
                    </div>
                  </div>

                  <div className={`${vendorStep !== 3 ? 'hidden' : ''} space-y-6 animate-in fade-in slide-in-from-right-2`}>
                    <Label className="text-xs uppercase font-bold text-secondary">Core Specializations</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {SPECIALIZATIONS.map(s => (
                        <div key={s} className="flex items-center gap-3 p-3 bg-background border border-white/5 rounded-lg">
                          <Checkbox id={s} name={s} value="on" defaultChecked={selectedVendorProfile?.specializations?.includes(s)} />
                          <label htmlFor={s} className="text-xs font-bold text-white cursor-pointer">{s}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`${vendorStep !== 4 ? 'hidden' : ''} space-y-6 animate-in fade-in slide-in-from-right-2`}>
                    <div className="space-y-2">
                      <Label>About Vendor / Company Description</Label>
                      <Textarea name="portfolio" required maxLength={100} placeholder="Brief company introduction (max 100 chars)" defaultValue={selectedVendorProfile?.portfolio} className="bg-background h-24" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Years of Experience</Label><Input name="experienceYears" type="number" min={0} required defaultValue={selectedVendorProfile?.experienceYears || 0} className="bg-background" /></div>
                      <div className="space-y-2"><Label>Registry Rating (0-5)</Label><Input name="rating" type="number" min={0} max={5} step="0.1" defaultValue={selectedVendorProfile?.rating || 0} className="bg-background" /></div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <div className="flex items-center gap-2"><Checkbox id="isActive" name="isActive" value="on" defaultChecked={true} /><Label htmlFor="isActive">Public Profile</Label></div>
                      <div className="flex items-center gap-2"><Checkbox id="isVerified" name="isVerified" value="on" defaultChecked={selectedVendorProfile?.isVerified} /><Label htmlFor="isVerified" className="text-secondary">Verified Hub Partner</Label></div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-muted/20 border-t border-white/5 flex justify-between">
                  <Button type="button" variant="ghost" onClick={() => vendorStep > 1 ? setVendorStep(v => v - 1) : setShowVendorModal(false)}>
                    {vendorStep === 1 ? 'Discard' : 'Back'}
                  </Button>
                  {vendorStep < totalVendorSteps ? (
                    <Button type="button" onClick={() => setVendorStep(v => v + 1)} className="gap-2">Continue <ChevronRight className="w-4 h-4" /></Button>
                  ) : (
                    <Button type="submit" className="bg-secondary text-background hover:bg-secondary/90 font-bold" disabled={isSubmittingVendor}>
                      {isSubmittingVendor ? <Loader2 className="animate-spin" /> : 'Commit to Registry'}
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </div>
        )
      }

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <Card className="w-full max-w-xl bg-card border-white/10 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
            <form onSubmit={handleSaveProduct}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-headline text-xl text-white">{selectedProduct ? 'Update Product Details' : 'Onboard New SKU'}</CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white" onClick={() => setShowProductModal(false)} type="button">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Product Name</Label>
                    <Input name="name" defaultValue={selectedProduct?.name} required className="bg-background/50 border-white/10 h-10" placeholder="e.g. 6201 Bearing" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">SKU / Model</Label>
                    <Input name="sku" defaultValue={selectedProduct?.sku} required className="bg-background/50 border-white/10 h-10 font-mono" placeholder="BRG-001" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Category</Label>
                    <Select name="categoryId" defaultValue={selectedProduct?.categoryId || 'bearings'}>
                      <SelectTrigger className="bg-background/50 border-white/10 h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bearings">Bearings</SelectItem>
                        <SelectItem value="linear-motion">Linear Motion</SelectItem>
                        <SelectItem value="transmission">Transmission</SelectItem>
                        <SelectItem value="raw-materials">Raw Materials</SelectItem>
                        <SelectItem value="fasteners">Fasteners</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 text-right flex flex-col justify-end pb-2">
                    <div className="flex items-center justify-end gap-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Live on Store</Label>
                      <Checkbox name="isActive" defaultChecked={selectedProduct ? selectedProduct.isActive : true} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Buy Price (₹)</Label>
                    <Input name="basePrice" type="number" defaultValue={selectedProduct?.basePrice} required className="bg-background/50 border-white/10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sell Price (₹)</Label>
                    <Input name="salePrice" type="number" defaultValue={selectedProduct?.salePrice} required className="bg-background/50 border-white/10 h-10 text-primary font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current Stock</Label>
                    <Input name="inventory" type="number" defaultValue={selectedProduct?.inventory} required className="bg-background/50 border-white/10 h-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Technical Specifications</Label>
                  <Input name="specs" defaultValue={selectedProduct?.specs} required className="bg-background/50 border-white/10 h-10" placeholder="e.g. 12x32x10mm, Sealed" />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
                  <Textarea name="description" defaultValue={selectedProduct?.description} className="bg-background/50 border-white/10 min-h-[80px]" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 pt-6 pb-6">
                <Button variant="ghost" onClick={() => setShowProductModal(false)} type="button" className="text-zinc-500 hover:text-white">Cancel</Button>
                <Button type="submit" disabled={isSubmittingProduct} className="min-w-[140px] bg-primary text-primary-foreground font-bold hover:bg-primary/90">
                  {isSubmittingProduct ? <Loader2 className="animate-spin w-4 h-4" /> : 'Synchronize SKU'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </div >
  );
}
