
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, initiateEmailSignIn, initiateEmailSignUp, initiateGoogleSignIn } from '@/firebase';
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
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      initiateEmailSignIn(auth, email, password);
      toast({
        title: "Welcome back!",
        description: "Checking your credentials...",
      });
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      initiateEmailSignUp(auth, email, password);
      toast({
        title: "Account created!",
        description: "Welcome to MechHub. Redirecting to dashboard...",
      });
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    try {
      initiateGoogleSignIn(auth);
      toast({
        title: "Google Sign In",
        description: "Connecting to your Google account...",
      });
      // Success is handled by onAuthStateChanged in FirebaseProvider
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (error: any) {
      toast({
        title: "Google sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
                  <CardDescription>Enter your credentials to access your design dashboard.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="email" name="email" type="email" placeholder="name@example.com" className="pl-10 bg-background" required suppressHydrationWarning />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="password" name="password" type="password" placeholder="••••••••" className="pl-10 bg-background" required suppressHydrationWarning />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full h-11" disabled={loading} suppressHydrationWarning>
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

                    <Button variant="outline" type="button" className="w-full h-11 bg-background border-white/10 hover:bg-white/5" onClick={handleGoogleSignIn} disabled={loading} suppressHydrationWarning>
                      <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                      </svg>
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
                  <CardDescription>Join the MechHub network and start building your designs today.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="reg-email" name="email" type="email" placeholder="name@example.com" className="pl-10 bg-background" required suppressHydrationWarning />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="reg-password" name="password" type="password" placeholder="••••••••" className="pl-10 bg-background" required suppressHydrationWarning />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full h-11" disabled={loading} suppressHydrationWarning>
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

                    <Button variant="outline" type="button" className="w-full h-11 bg-background border-white/10 hover:bg-white/5" onClick={handleGoogleSignIn} disabled={loading} suppressHydrationWarning>
                      <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                      </svg>
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
