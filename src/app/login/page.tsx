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
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';

export default function LoginPage() {
  const auth = useAuth();
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [verificationState, setVerificationState] = useState<{ email: string, uid: string, name: string } | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Handle verified=true from callback
  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      toast({
        title: "Email Verified",
        description: "Your account is now verified. You can sign in.",
        variant: "default"
      });
      // Clean up URL
      router.replace('/login');
    }
  }, [searchParams, router, toast]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    async function syncUserAndRedirect() {
      if (user && db) {
        // Enforce email verification (Google sign-in is typically verified automatically)
        if (!user.emailVerified && user.providerData?.[0]?.providerId === 'password') {
          setVerificationState({
            email: user.email || '',
            uid: user.uid,
            name: user.displayName || 'Innovator'
          });
          await signOut(auth); // Force them out until verified
          return;
        }

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

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      // If not verified, the useEffect will catch it, update state, and sign out.
      // But we can also handle it right here for an immediate UI response:
      if (!userCred.user.emailVerified) {
        setVerificationState({
          email: userCred.user.email || '',
          uid: userCred.user.uid,
          name: userCred.user.displayName || 'Innovator'
        });
        await signOut(auth);
        setLoading(false);
        return;
      }

      // If verified, useEffect will redirect
    } catch (error: any) {
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
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCred.user, { displayName: fullName });

      // Call API to send verification
      await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: fullName, uid: userCred.user.uid })
      });

      setVerificationState({ email, uid: userCred.user.uid, name: fullName });
      setResendCooldown(60);

      // Sign out to prevent access
      await signOut(auth);
      setLoading(false);

    } catch (error: any) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
    }
  };

  const handleResend = async () => {
    if (!verificationState || resendCooldown > 0) return;

    try {
      setResendCooldown(60); // Start cooldown immediately
      toast({ title: "Sending...", description: "Requesting a new verification email.", variant: "default" });

      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verificationState)
      });

      if (!res.ok) throw new Error("Failed to send");

      toast({ title: "Email Sent", description: "A new verification link has been sent to your inbox.", variant: "default" });
    } catch (error) {
      setResendCooldown(0); // Reset on error
      toast({ title: "Error", description: "Failed to resend email. Try again later.", variant: "destructive" });
    }
  };

  if (verificationState) {
    return (
      <div className="min-h-screen bg-background flex flex-col pt-24">
        <LandingNav />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-card border-white/10 shadow-2xl relative overflow-hidden text-center p-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
            <div className="mx-auto w-16 h-16 bg-primary/20 flex items-center justify-center rounded-full mb-6">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-headline font-bold mb-2">Check Your Inbox</h2>
            <p className="text-muted-foreground mb-8">
              We've sent a verification link to <strong className="text-white">{verificationState.email}</strong>.
              Please click the link in that email to activate your account and access your dashboard.
            </p>
            <div className="space-y-4">
              <Button onClick={() => setVerificationState(null)} className="w-full h-12 font-bold variant-outline bg-white/5 hover:bg-white/10 border-white/10">
                Back to Sign In
              </Button>
              <Button
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="w-full h-12 font-bold gap-2 text-primary"
                variant="ghost"
              >
                {resendCooldown > 0 ? `Resend available in ${resendCooldown}s` : "Resend Verification Email"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

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
                      <Label htmlFor="reg-name">Full Name</Label>
                      <Input id="reg-name" name="fullName" type="text" placeholder="John Doe" className="bg-background border-white/10 focus:border-primary/50" required />
                    </div>
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
