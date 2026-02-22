
"use client"

import { useState } from 'react';
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
  BarChart3, 
  Bell, 
  Search, 
  MoreVertical,
  Send,
  Download,
  Eye
} from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const MOCK_RFQS = [
  { id: 'RFQ-8291', user: 'Rahul Sharma', phone: '+91 98765 43210', process: 'CNC Machining', date: '2023-11-20', status: 'Under Review' },
  { id: 'RFQ-7102', user: 'TechFlow Solutions', phone: '+91 88877 66554', process: 'Laser Cutting', date: '2023-11-18', status: 'Quotation Sent' },
  { id: 'RFQ-6045', user: 'Ankit Verma', phone: '+91 77766 55443', process: '3D Printing', date: '2023-11-10', status: 'Completed' },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('rfqs');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState<any>(null);
  const logo = PlaceHolderImages.find((img) => img.id === 'mechhub-logo');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-card">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 overflow-hidden rounded">
            <Image
              src={logo?.imageUrl || ''}
              alt="MechHub Logo"
              width={32}
              height={32}
              className="object-cover"
              data-ai-hint={logo?.imageHint}
            />
          </div>
          <span className="font-headline font-bold text-lg">MechHub Admin</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="w-64 pl-10 h-9 bg-background border-white/10" placeholder="Search RFQs, Users..." />
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
          </Button>
          <div className="w-8 h-8 rounded-full bg-secondary text-background font-bold flex items-center justify-center">A</div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/5 bg-card flex flex-col p-4 space-y-2">
          <Button 
            variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-3" 
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Button>
          <Button 
            variant={activeTab === 'rfqs' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-3" 
            onClick={() => setActiveTab('rfqs')}
          >
            <ClipboardList className="w-4 h-4" /> RFQ Management
          </Button>
          <Button 
            variant={activeTab === 'vendors' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-3" 
            onClick={() => setActiveTab('vendors')}
          >
            <Users className="w-4 h-4" /> MechMasters
          </Button>
          <Button 
            variant={activeTab === 'analytics' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-3" 
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 className="w-4 h-4" /> Analytics
          </Button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'rfqs' && (
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-headline font-bold">RFQ Management</h1>
                  <p className="text-muted-foreground">Review incoming requests and send quotations to users.</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" /> Export CSV</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-card border-white/5">
                  <CardContent className="p-6">
                    <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">New Requests</div>
                    <div className="text-3xl font-bold">14</div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-white/5">
                  <CardContent className="p-6">
                    <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Pending Quotes</div>
                    <div className="text-3xl font-bold text-primary">08</div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-white/5">
                  <CardContent className="p-6">
                    <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Conversion Rate</div>
                    <div className="text-3xl font-bold text-secondary">64%</div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-white/5">
                  <CardContent className="p-6">
                    <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Total Orders</div>
                    <div className="text-3xl font-bold">152</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-card border-white/5">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead>RFQ ID</TableHead>
                      <TableHead>User / Customer</TableHead>
                      <TableHead>Process</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_RFQS.map((rfq) => (
                      <TableRow key={rfq.id} className="border-white/5 hover:bg-white/5">
                        <TableCell className="font-bold">{rfq.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{rfq.user}</div>
                          <div className="text-xs text-muted-foreground">{rfq.phone}</div>
                        </TableCell>
                        <TableCell>{rfq.process}</TableCell>
                        <TableCell>
                          <Badge variant={rfq.status === 'Quotation Sent' ? 'secondary' : 'default'} className="uppercase text-[9px]">
                            {rfq.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{rfq.date}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => { setSelectedRfq(rfq); setShowQuoteModal(true); }}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-card border-white/5">
                <CardHeader><CardTitle>Revenue Forecast</CardTitle></CardHeader>
                <CardContent className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed border-white/5 rounded-lg m-6">
                  Analytics Chart Placeholder
                </CardContent>
              </Card>
              <Card className="bg-card border-white/5">
                <CardHeader><CardTitle>Vendor Distribution</CardTitle></CardHeader>
                <CardContent className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed border-white/5 rounded-lg m-6">
                  Map Chart Placeholder
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Quotation Modal */}
      {showQuoteModal && selectedRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-card border-white/10 shadow-2xl">
            <CardHeader>
              <CardTitle className="font-headline">Create Quotation for {selectedRfq.id}</CardTitle>
              <CardDescription>Reviewing request from {selectedRfq.user}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Price (INR)</Label>
                  <Input type="number" placeholder="e.g. 24500" className="bg-background border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Lead Time</Label>
                  <Input placeholder="e.g. 7 Days" className="bg-background border-white/10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes for User</Label>
                <textarea className="w-full bg-background border border-white/10 rounded-md p-3 min-h-[100px] text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Details about material availability or process specific notes..." />
              </div>
              <div className="pt-4 flex gap-3">
                <Button className="flex-1 gap-2" onClick={() => setShowQuoteModal(false)}>
                  <Send className="w-4 h-4" /> Send to User
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowQuoteModal(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
