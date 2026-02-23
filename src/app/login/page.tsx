
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, useUser, useFirestore, initiateEmailSignIn, initiateEmailSignUp, initiateGoogleSignIn, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LandingNav } from '@/components/LandingNav';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, UserPlus, LogIn } from 'lucide-react';

export default function LoginPage() {
  const auth = useAuth();
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Effect to handle post-login RFQ submission to root collection
  useEffect(() => {
    if (user && db) {
      const pendingRfq = localStorage.getItem('pendingRfqToSubmit');
      if (pendingRfq) {
        try {
          const rfqData = {
            ...JSON.parse(pendingRfq),
            userId: user.uid,
            userEmail: user.email,
            userName: user.displayName || 'User',
            updatedAt: new Date().toISOString(),
          };
          addDocumentNonBlocking(collection(db, 'rfqs'), rfqData);
          localStorage.removeItem('pendingRfqToSubmit');
          localStorage.removeItem('pendingRfqDetails');
          toast({
            title: "Project Submitted!",
            description: "Your design has been added to your dashboard.",
          });
        } catch (e) {
          console.error("Failed to process pending RFQ:", e);
        }
      }
      const redirectPath = searchParams.get('redirect') || '/dashboard';
      router.push(redirectPath);
    }
  }, [user, db, router, searchParams, toast]);

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    initiateEmailSignIn(auth, email, password);
  };

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    initiateEmailSignUp(auth, email, password);
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    initiateGoogleSignIn(auth);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-24">
      <LandingNav />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-card border border-white/10 p-1">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary">Login</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-primary">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="bg-card border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
                  <CardDescription>Enter your credentials to access MechHub.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="email" name="email" type="email" placeholder="name@example.com" className="pl-10 bg-background" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="password" name="password" type="password" placeholder="••••••••" className="pl-10 bg-background" required />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full h-11" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                      Sign In
                    </Button>
                    <div className="relative w-full my-2">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/10"></span>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>
                    <Button variant="outline" type="button" className="w-full h-11 bg-background border-white/10 hover:bg-white/5" onClick={handleGoogleSignIn} disabled={loading}>
                      Google
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="bg-card border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Create Account</CardTitle>
                  <CardDescription>Join the MechHub network and start building.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="reg-email" name="email" type="email" placeholder="name@example.com" className="pl-10 bg-background" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="reg-password" name="password" type="password" placeholder="••••••••" className="pl-10 bg-background" required />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full h-11" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                      Create Account
                    </Button>
                    <div className="relative w-full my-2">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/10"></span>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>
                    <Button variant="outline" type="button" className="w-full h-11 bg-background border-white/10 hover:bg-white/5" onClick={handleGoogleSignIn} disabled={loading}>
                      Google
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
