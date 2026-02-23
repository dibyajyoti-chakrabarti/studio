
"use client"

import { useState, useEffect } from 'react';
import { LandingNav } from '@/components/LandingNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
} from '@/components/ui/dialog';
import { useUser, useAuth, useFirestore, useCollection, useDoc, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { collection, query, where, orderBy, doc } from 'firebase/firestore';
import { 
  FileText, 
  Clock, 
  Package, 
  ChevronRight, 
  ExternalLink,
  TrendingUp,
  Settings,
  LogOut,
  Plus,
  Loader2,
  User as UserIcon,
  Building2,
  Phone,
  Sparkles,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UserDashboard() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [hasSubmittedOnboarding, setHasSubmittedOnboarding] = useState(false);

  // Fetch user profile from /users/{userId}
  const userProfileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);
  
  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  // Fetch user-specific RFQs from root collection
  const rfqsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'rfqs'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [db, user?.uid]);

  const { data: rfqs, isLoading: isRfqsLoading } = useCollection(rfqsQuery);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  // Set initial selected RFQ
  useEffect(() => {
    if (rfqs && rfqs.length > 0 && !selectedOrderId) {
      setSelectedOrderId(rfqs[0].id);
    }
  }, [rfqs, selectedOrderId]);

  // Trigger onboarding ONLY if profile is missing/not onboarded
  useEffect(() => {
    if (!isProfileLoading && user && !hasSubmittedOnboarding) {
      if (!profile || !profile.onboarded) {
        setIsOnboardingOpen(true);
      } else {
        setIsOnboardingOpen(false);
      }
    }
  }, [isProfileLoading, profile, user, hasSubmittedOnboarding]);

  const handleSignOut = () => {
    signOut(auth);
    router.push('/');
  };

  const handleOnboardingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db || !user) return;

    setIsSubmittingProfile(true);
    const formData = new FormData(e.currentTarget);
    const profileData = {
      fullName: formData.get('fullName') as string,
      phone: formData.get('phone') as string,
      teamName: formData.get('teamName') as string,
      email: user.email,
      onboarded: true,
      createdAt: new Date().toISOString(),
    };

    const userRef = doc(db, 'users', user.uid);
    
    setHasSubmittedOnboarding(true);
    setIsOnboardingOpen(false);

    setDocumentNonBlocking(userRef, profileData, { merge: true });
    
    toast({
      title: "Welcome onboard!",
      description: `Glad to have you with us, ${profileData.fullName}.`,
    });
    
    setIsSubmittingProfile(false);
  };

  if (isUserLoading || (isProfileLoading && !hasSubmittedOnboarding) || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const selectedOrder = rfqs?.find(r => r.id === selectedOrderId);
  const welcomeName = profile?.fullName || user.email?.split('@')[0] || 'Innovator';

  return (
    <div className="min-h-screen pt-24 pb-12">
      <LandingNav />
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold">Welcome, {welcomeName} 👋</h1>
            <p className="text-muted-foreground">Manage your custom manufacturing requests and track production status.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" onClick={() => router.push('/upload')}>
              <Plus className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => {}}>
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8">
            <Tabs defaultValue="my-orders" className="space-y-6">
              <TabsList className="bg-card border border-white/5 p-1">
                <TabsTrigger value="my-orders">My Requests</TabsTrigger>
                <TabsTrigger value="profile">My Profile</TabsTrigger>
                <TabsTrigger value="active-production">In Production</TabsTrigger>
              </TabsList>

              <TabsContent value="my-orders" className="space-y-4">
                {isRfqsLoading ? (
                  <div className="p-12 flex justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : rfqs && rfqs.length > 0 ? (
                  rfqs.map((order) => (
                    <Card 
                      key={order.id} 
                      className={`bg-card border-white/5 hover:border-primary/50 transition-all cursor-pointer ${selectedOrderId === order.id ? 'border-primary/50 ring-1 ring-primary/20' : ''}`}
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center text-primary">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold">{order.projectName || 'Unnamed Project'}</span>
                                <Badge variant={order.status === 'quotation_sent' ? 'secondary' : 'outline'} className="capitalize">
                                  {order.status?.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center gap-4">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {order.manufacturingProcess}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" className="md:ml-auto group">
                            View Details 
                            <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="bg-card border-white/5 p-12 text-center">
                    <p className="text-muted-foreground">You haven't submitted any RFQs yet.</p>
                    <Button className="mt-4" onClick={() => router.push('/upload')}>Start First Project</Button>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="profile" className="space-y-4">
                <Card className="bg-card border-white/5">
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">Innovator Profile</CardTitle>
                    <CardDescription>Your professional details used for manufacturing requests.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Full Name</Label>
                        <div className="flex items-center gap-2 font-medium">
                          <UserIcon className="w-4 h-4 text-primary" />
                          {profile?.fullName || 'Not provided'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Team / Organization</Label>
                        <div className="flex items-center gap-2 font-medium">
                          <Building2 className="w-4 h-4 text-primary" />
                          {profile?.teamName || 'Not provided'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Phone Number</Label>
                        <div className="flex items-center gap-2 font-medium">
                          <Phone className="w-4 h-4 text-primary" />
                          {profile?.phone || 'Not provided'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Email Address</Label>
                        <div className="flex items-center gap-2 font-medium">
                          <Package className="w-4 h-4 text-primary" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                      <Button variant="outline" onClick={() => setIsOnboardingOpen(true)}>
                        Update Profile Information
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {selectedOrder && (
              <Card className="bg-card border-white/5">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Project Details</CardTitle>
                  <CardDescription>{selectedOrder.projectName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Material:</span>
                      <span className="font-medium">{selectedOrder.material}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-medium">{selectedOrder.quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tolerance:</span>
                      <span className="font-medium">{selectedOrder.tolerance}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">{selectedOrder.deliveryLocation}</span>
                    </div>
                  </div>
                  
                  {selectedOrder.status === 'rfq_submitted' ? (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 text-center">
                      <p className="text-sm font-medium text-primary">Awaiting MechMaster Bids</p>
                      <p className="text-xs text-muted-foreground mt-1">We'll notify you when quotes arrive.</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <span className="font-bold capitalize">{selectedOrder.status?.replace('_', ' ')}</span>
                      </div>
                      <Button className="w-full bg-secondary text-background hover:bg-secondary/80">Track Progress</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="bg-card border-white/5">
              <CardHeader>
                <CardTitle className="font-headline text-xl">Quick Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-background/50 rounded-lg border border-white/5 text-center">
                  <div className="text-2xl font-bold">{rfqs?.length || 0}</div>
                  <div className="text-[10px] uppercase text-muted-foreground tracking-widest mt-1">Total RFQs</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Onboarding Dialog */}
      <Dialog open={isOnboardingOpen} onOpenChange={(open) => {
        if (profile?.onboarded || hasSubmittedOnboarding) setIsOnboardingOpen(open);
      }}>
        <DialogContent className="sm:max-w-[500px] bg-card text-foreground">
          <DialogHeader>
            <div className="flex items-center gap-2 text-secondary mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Profile Setup</span>
            </div>
            <DialogTitle className="font-headline text-2xl">Hey Innovator, Let's know you a little</DialogTitle>
            <DialogDescription>
              Complete your profile to get personalized recommendations and track your projects.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOnboardingSubmit} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Enter your full name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="fullName" 
                  name="fullName" 
                  defaultValue={profile?.fullName || ''} 
                  required 
                  className="pl-10 bg-background" 
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="phone" 
                  name="phone" 
                  defaultValue={profile?.phone || ''} 
                  required 
                  className="pl-10 bg-background" 
                  placeholder="e.g. +91 98765 43210"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamName">College / Team / Startup Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="teamName" 
                  name="teamName" 
                  defaultValue={profile?.teamName || ''} 
                  required 
                  className="pl-10 bg-background" 
                  placeholder="e.g. IIT Madras RoboTeam"
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmittingProfile}>
              {isSubmittingProfile ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Welcome onboard
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
