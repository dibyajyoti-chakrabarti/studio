'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, useUser, useFirestore, initiateGoogleSignIn } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LandingNav } from '@/components/LandingNav';
import { Loader2, UserPlus, LogIn, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const auth = useAuth();
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function syncUserAndRedirect() {
      if (user && db) {
        setLoading(true);
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          let role = 'customer';

          if (!userSnap.exists()) {
            const initialProfile = {
              uid: user.uid,
              fullName: user.displayName || '',
              email: user.email,
              role: 'customer',
              onboarded: false,
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            await setDoc(userRef, initialProfile);
            role = 'customer';
          } else {
            role = userSnap.data().role || 'customer';
          }

          if (role === 'admin') {
            router.push('/admin');
          } else if (role === 'vendor') {
            router.push('/vendor');
          } else {
            router.push(searchParams.get('redirect') || '/dashboard');
          }
        } catch (err) {
          console.error("Error syncing user profile:", err);
        } finally {
          setLoading(false);
        }
      }
    }

    syncUserAndRedirect();
  }, [user, db, router, searchParams]);

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    signInWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        setLoading(false);
        let message = "An unexpected error occurred.";
        if (error.code === 'auth/invalid-credential') {
          message = "Invalid email or password. Please verify your credentials.";
        } else if (error.code === 'auth/user-not-found') {
          message = "No account found with this email.";
        } else if (error.code === 'auth/wrong-password') {
          message = "Incorrect password.";
        } else {
          message = error.message;
        }

        toast({
          variant: "destructive",
          title: "Sign In Failed",
          description: message,
        });
      });
  };

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    createUserWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: error.message,
        });
      });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-24">
      <LandingNav />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">

          <div className="flex flex-col items-center gap-4">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-headline font-bold">Secure Access</h1>
              <p className="text-sm text-muted-foreground">Sign in to your manufacturing workspace</p>
            </div>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-card border border-white/10 p-1">
              <TabsTrigger value="login" className="data-[state=active]:bg-secondary data-[state=active]:text-background font-bold">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-secondary data-[state=active]:text-background font-bold">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="bg-card border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/30" />
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">
                    Account Access
                  </CardTitle>
                  <CardDescription>Enter your verified credentials to continue.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email</Label>
                      <Input id="email" name="email" type="email" placeholder="engineering@company.com" className="bg-background border-white/10 focus:border-primary/50" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Security Password</Label>
                      <Input id="password" name="password" type="password" placeholder="••••••••" className="bg-background border-white/10 focus:border-primary/50" required />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full h-12 font-bold" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                      Log In to Hub
                    </Button>
                    <div className="relative w-full py-2">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                      <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-card px-3 text-muted-foreground">Secure Authentication</span></div>
                    </div>
                    <Button variant="outline" type="button" className="w-full h-11 border-white/10 hover:bg-white/5" onClick={() => initiateGoogleSignIn(auth)} disabled={loading}>
                      Continue with Google
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="bg-card border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/30" />
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">
                    Create Hub Account
                  </CardTitle>
                  <CardDescription>Join the managed manufacturing network.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Work Email</Label>
                      <Input id="reg-email" name="email" type="email" placeholder="name@organization.com" className="bg-background border-white/10 focus:border-primary/50" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Create Password</Label>
                      <Input id="reg-password" name="password" type="password" placeholder="Min. 8 characters" className="bg-background border-white/10 focus:border-primary/50" required />
                    </div>
                    <div className="pt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <ShieldCheck className="w-4 h-4 text-secondary" />
                      All accounts are subject to verification and NDA protocols.
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full h-12 font-bold" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                      Register as Innovator
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
