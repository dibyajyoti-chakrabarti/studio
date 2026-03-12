'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { isAdmin } from '@/lib/auth-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LandingNav } from '@/components/LandingNav';
import { Loader2, UserPlus, LogIn, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo, deleteUser } from 'firebase/auth';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" {...props}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [verificationState, setVerificationState] = useState<{ email: string, uid: string, name: string } | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
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

          let role = isAdmin(user.email) ? 'admin' : 'customer';

          if (!userSnap.exists()) {
            const initialProfile = {
              uid: user.uid,
              fullName: user.displayName || '',
              email: user.email,
              role: role, // Use the calculated role
              onboarded: false,
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              emailVerified: user.emailVerified
            };
            await setDoc(userRef, initialProfile);
          } else {
            const profileData = userSnap.data();
            // If it's an admin email but the role in Firestore is not admin, correct it
            if (role === 'admin' && profileData.role !== 'admin') {
              await setDoc(userRef, { role: 'admin' }, { merge: true });
            } else {
              role = profileData.role || 'customer';
            }
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
      await fetch('/api/v1/auth/send-verification', {
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

      const res = await fetch('/api/v1/auth/send-verification', {
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

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        throw new Error("Failed to send password reset email");
      }

      setResetEmailSent(true);
      toast({
        title: "Reset Email Sent",
        description: "If an account with that email exists, we've sent a password reset link.",
        variant: "default"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // If verified or Google user, the useEffect (syncUserAndRedirect) will handle everything
      // including profile creation and role-based redirection.

      // If verified, useEffect will handle redirect.
    } catch (error: any) {
      setLoading(false);
      if (error.code !== 'auth/popup-closed-by-user') {
        toast({
          variant: "destructive",
          title: "Google Sign In Failed",
          description: error.message,
        });
      }
    }
  };

  // Prevent flash for authenticated users during sync/redirect
  if (isUserLoading || (user && !verificationState)) {
    return <div className="min-h-screen flex items-center justify-center bg-[#020617]"><Loader2 className="w-10 h-10 animate-spin text-cyan-500" /></div>;
  }

  if (verificationState) {
    return (
      <div className="min-h-screen bg-[#020617] text-zinc-300 relative overflow-hidden flex flex-col pt-24">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
        <LandingNav />
        <div className="flex-1 flex items-center justify-center p-4 relative z-10">
          <Card className="w-full max-w-md bg-[#040f25]/50 backdrop-blur-md border-white/[0.05] shadow-[0_0_40px_rgba(34,211,238,0.1)] relative overflow-hidden text-center p-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 to-blue-600" />
            <div className="mx-auto w-16 h-16 bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-center rounded-full mb-6 relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
              <ShieldCheck className="w-8 h-8 text-cyan-400 relative z-10" />
            </div>
            <h2 className="text-2xl  text-white mb-2 drop-shadow-sm">Check Your Inbox</h2>
            <p className="text-zinc-400 mb-8 font-light leading-relaxed">
              We've sent a verification link to <strong className="text-white">{verificationState.email}</strong>.
              Please click the link in that email to activate your account and access your dashboard.
            </p>
            <div className="space-y-4">
              <Button onClick={() => setVerificationState(null)} className="w-full h-12 font-bold variant-outline bg-white/5 hover:bg-white/10 border-white/10 text-white rounded-full transition-all">
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
    <div className="min-h-screen bg-[#020617] text-zinc-300 relative overflow-hidden flex flex-col pt-24">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      <LandingNav />
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md space-y-8">

          <div className="flex flex-col items-center gap-4">
            <div className="text-center space-y-2">
              <h1 className="text-3xl  text-white drop-shadow-sm">Secure Access</h1>
              <p className="text-sm text-zinc-400 font-light">Sign in to your manufacturing workspace</p>
            </div>
          </div>

          <Tabs defaultValue={searchParams.get('tab') === 'register' ? 'register' : 'login'} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#040f25]/50 backdrop-blur-sm border border-white/[0.05] p-1 rounded-xl">
              <TabsTrigger value="login" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white font-bold rounded-lg transition-all text-zinc-400">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white font-bold rounded-lg transition-all text-zinc-400">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              {isForgotPassword ? (
                <Card className="bg-[#040f25]/50 backdrop-blur-md border-white/[0.05] shadow-[0_0_40px_rgba(34,211,238,0.1)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 to-blue-600" />
                  <CardHeader>
                    <CardTitle className=" text-2xl text-white">
                      Reset Password
                    </CardTitle>
                    <CardDescription className="text-zinc-400 font-light">
                      {resetEmailSent
                        ? "Check your email for a reset link."
                        : "Enter your verified email to receive a reset link."}
                    </CardDescription>
                  </CardHeader>
                  {!resetEmailSent ? (
                    <form onSubmit={handleForgotPassword}>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="reset-email" className="text-zinc-300">Work Email</Label>
                          <Input id="reset-email" name="email" type="email" placeholder="engineering@company.com" className="bg-[#020617]/50 border-white/[0.1] focus:border-cyan-500/50 text-white placeholder:text-zinc-600" required />
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full h-12 font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all" disabled={loading}>
                          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Send Reset Link
                        </Button>
                        <Button variant="ghost" type="button" className="w-full text-muted-foreground hover:text-white" onClick={() => setIsForgotPassword(false)} disabled={loading}>
                          Back to Sign In
                        </Button>
                      </CardFooter>
                    </form>
                  ) : (
                    <CardFooter className="flex flex-col gap-4 pb-8">
                      <Button variant="outline" type="button" className="w-full" onClick={() => { setIsForgotPassword(false); setResetEmailSent(false); }}>
                        Return to Sign In
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ) : (
                <Card className="bg-[#040f25]/50 backdrop-blur-md border-white/[0.05] shadow-[0_0_40px_rgba(34,211,238,0.1)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 to-blue-600" />
                  <CardHeader>
                    <CardTitle className=" text-2xl text-white">
                      Account Access
                    </CardTitle>
                    <CardDescription className="text-zinc-400 font-light">Enter your verified credentials to continue.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSignIn}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-zinc-300">Work Email</Label>
                        <Input id="email" name="email" type="email" placeholder="engineering@company.com" className="bg-[#020617]/50 border-white/[0.1] focus:border-cyan-500/50 text-white placeholder:text-zinc-600" required />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-zinc-300">Security Password</Label>
                          <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors tracking-wide">Forgot password?</button>
                        </div>
                        <Input id="password" name="password" type="password" placeholder="••••••••" className="bg-[#020617]/50 border-white/[0.1] focus:border-cyan-500/50 text-white placeholder:text-zinc-600" required />
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                      <Button type="submit" className="w-full h-12 font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                        Log In to Hub
                      </Button>
                      <div className="relative w-full py-2">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10"></span></div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest font-consolas"><span className="bg-[#040f25] px-3 text-cyan-500/70 border border-white/[0.05] rounded-full">Secure Authentication</span></div>
                      </div>
                      <Button variant="outline" type="button" className="w-full h-12 bg-white hover:bg-zinc-200 text-zinc-900 border-transparent rounded-full font-bold text-sm gap-3 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]" onClick={handleGoogleSignIn} disabled={loading}>
                        <GoogleIcon className="w-5 h-5" />
                        Sign in with Google
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="register">
              <Card className="bg-[#040f25]/50 backdrop-blur-md border-white/[0.05] shadow-[0_0_40px_rgba(34,211,238,0.1)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 to-blue-600" />
                <CardHeader>
                  <CardTitle className=" text-2xl text-white">
                    Create Hub Account
                  </CardTitle>
                  <CardDescription className="text-zinc-400 font-light">Join the managed manufacturing network.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-name" className="text-zinc-300">Full Name</Label>
                      <Input id="reg-name" name="fullName" type="text" placeholder="John Doe" className="bg-[#020617]/50 border-white/[0.1] focus:border-cyan-500/50 text-white placeholder:text-zinc-600" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email" className="text-zinc-300">Work Email</Label>
                      <Input id="reg-email" name="email" type="email" placeholder="name@organization.com" className="bg-[#020617]/50 border-white/[0.1] focus:border-cyan-500/50 text-white placeholder:text-zinc-600" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password" className="text-zinc-300">Create Password</Label>
                      <Input id="reg-password" name="password" type="password" placeholder="Min. 8 characters" className="bg-[#020617]/50 border-white/[0.1] focus:border-cyan-500/50 text-white placeholder:text-zinc-600" required />
                    </div>
                    <div className="pt-2 flex items-center gap-2 text-[10px] text-zinc-500 font-light">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      All accounts are subject to verification and NDA protocols.
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full h-12 font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all" disabled={loading}>
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
