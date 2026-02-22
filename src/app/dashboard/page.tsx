
"use client"

import { useState, useEffect } from 'react';
import { LandingNav } from '@/components/LandingNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Clock, 
  Package, 
  ChevronRight, 
  ExternalLink,
  TrendingUp,
  Settings,
  LogOut,
  Plus
} from 'lucide-react';

const MOCK_ORDERS = [
  {
    id: 'RFQ-8291',
    process: 'CNC Machining',
    date: '2023-11-20',
    status: 'Quotation Sent',
    statusVariant: 'secondary' as const,
    vendors: 3,
    material: 'Aluminum 6061',
    price: '₹24,500',
    leadTime: '7 Days'
  },
  {
    id: 'RFQ-7102',
    process: 'Laser Cutting',
    date: '2023-11-18',
    status: 'In Production',
    statusVariant: 'default' as const,
    vendors: 3,
    material: 'Stainless Steel 304',
    price: '₹12,200',
    leadTime: '4 Days'
  },
  {
    id: 'RFQ-6045',
    process: '3D Printing',
    date: '2023-11-10',
    status: 'Completed',
    statusVariant: 'outline' as const,
    vendors: 4,
    material: 'Resin',
    price: '₹5,800',
    leadTime: '2 Days'
  }
];

export default function UserDashboard() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState(MOCK_ORDERS[0]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = () => {
    signOut(auth);
    router.push('/');
  };

  if (isUserLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <LandingNav />
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold">Welcome, {user.email?.split('@')[0]} 👋</h1>
            <p className="text-muted-foreground">Manage your custom manufacturing requests and track production status.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" onClick={() => router.push('/upload')} suppressHydrationWarning>
              <Plus className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" suppressHydrationWarning>
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={handleSignOut} suppressHydrationWarning>
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="my-orders" className="space-y-6">
              <TabsList className="bg-card border border-white/5 p-1">
                <TabsTrigger value="my-orders">My Orders</TabsTrigger>
                <TabsTrigger value="active-production">In Production</TabsTrigger>
                <TabsTrigger value="drafts">Draft RFQs</TabsTrigger>
              </TabsList>

              <TabsContent value="my-orders" className="space-y-4">
                {MOCK_ORDERS.map((order) => (
                  <Card 
                    key={order.id} 
                    className={`bg-card border-white/5 hover:border-primary/50 transition-all cursor-pointer ${selectedOrder.id === order.id ? 'border-primary/50 ring-1 ring-primary/20' : ''}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center text-primary">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold">{order.id}</span>
                              <Badge variant={order.statusVariant}>{order.status}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-4">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {order.date}</span>
                              <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {order.process}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" className="md:ml-auto group" suppressHydrationWarning>
                          View Details 
                          <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Side Panels */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-card border-white/5">
              <CardHeader>
                <CardTitle className="font-headline text-xl">Order Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="text-secondary w-5 h-5" />
                    <span className="text-sm font-medium">Monthly Savings</span>
                  </div>
                  <span className="font-bold text-secondary">₹12,400</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-background/50 rounded-lg border border-white/5 text-center">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-[10px] uppercase text-muted-foreground tracking-widest mt-1">Total RFQs</div>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg border border-white/5 text-center">
                    <div className="text-2xl font-bold">4</div>
                    <div className="text-[10px] uppercase text-muted-foreground tracking-widest mt-1">Active</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedOrder.status === 'Quotation Sent' && (
              <Card className="bg-primary/5 border-primary/20 animate-pulse">
                <CardHeader>
                  <CardTitle className="font-headline text-xl text-primary">Quotation Received!</CardTitle>
                  <CardDescription>An admin has reviewed your request for {selectedOrder.id}.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-card rounded-lg border border-white/5">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Total Price</span>
                      <span className="font-bold text-lg">{selectedOrder.price}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Lead Time</span>
                      <span className="font-bold">{selectedOrder.leadTime}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="bg-primary" suppressHydrationWarning>Accept</Button>
                    <Button variant="outline" suppressHydrationWarning>Negotiate</Button>
                  </div>
                  <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/5" suppressHydrationWarning>Reject Quotation</Button>
                </CardContent>
              </Card>
            )}

            <Card className="bg-card border-white/5">
              <CardHeader>
                <CardTitle className="font-headline text-xl">Design Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-background rounded border border-white/5">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-xs truncate max-w-[150px]">Main_Part_RevA.step</span>
                  </div>
                  <Button variant="ghost" size="sm" suppressHydrationWarning><ExternalLink className="w-3 h-3" /></Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-background rounded border border-white/5">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-xs truncate max-w-[150px]">Tolerance_Specs.pdf</span>
                  </div>
                  <Button variant="ghost" size="sm" suppressHydrationWarning><ExternalLink className="w-3 h-3" /></Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
