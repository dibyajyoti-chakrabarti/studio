
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, useUser, useFirestore, initiateEmailSignIn, initiateEmailSignUp, initiateGoogleSignIn } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LandingNav } from '@/components/LandingNav';
import { Loader2, UserPlus, LogIn, Users, Factory } from 'lucide-react';

export default function LoginPage() {
  const auth = useAuth();
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'user' | 'vendor'>('user');

  useEffect(() => {
    async function syncUserAndRedirect() {
      if (user && db) {
        setLoading(true);
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        let role = selectedRole; // Fallback to current selection for new users

        if (!userSnap.exists()) {
          const initialProfile = {
            fullName: user.displayName || '',
            email: user.email,
            role: selectedRole, 
            onboarded: false,
            createdAt: new Date().toISOString(),
          };
          await setDoc(userRef, initialProfile);
          role = selectedRole;
        } else {
          role = userSnap.data().role || 'user';
        }

        // Route based on actual role in DB
        if (role === 'admin') {
          router.push('/admin');
        } else if (role === 'vendor') {
          router.push('/vendor');
        } else {
          router.push(searchParams.get('redirect') || '/dashboard');
        }
        setLoading(false);
      }
    }

    syncUserAndRedirect();
  }, [user, db, router, searchParams, selectedRole]);

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    initiateEmailSignIn(auth, formData.get('email') as string, formData.get('password') as string);
  };

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    initiateEmailSignUp(auth, formData.get('email') as string, formData.get('password') as string);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-24">
      <LandingNav />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          
          <div className="flex flex-col items-center gap-4">
             <div className="text-center space-y-2">
               <h1 className="text-2xl font-headline font-bold">I want to join as...</h1>
               <p className="text-sm text-muted-foreground">Select your account type below</p>
             </div>
             <Tabs 
               value={selectedRole} 
               onValueChange={(val) => setSelectedRole(val as 'user' | 'vendor')} 
               className="w-full max-w-[300px]"
             >
               <TabsList className="grid w-full grid-cols-2 bg-card border border-white/10 p-1">
                 <TabsTrigger value="user" className="data-[state=active]:bg-primary flex gap-2">
                   <Users className="w-4 h-4" /> Innovator
                 </TabsTrigger>
                 <TabsTrigger value="vendor" className="data-[state=active]:bg-primary flex gap-2">
                   <Factory className="w-4 h-4" /> Vendor
                 </TabsTrigger>
               </TabsList>
             </Tabs>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-card border border-white/10 p-1">
              <TabsTrigger value="login" className="data-[state=active]:bg-secondary data-[state=active]:text-background">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-secondary data-[state=active]:text-background">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="bg-card border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">
                    {selectedRole === 'user' ? 'Innovator Login' : 'MechMaster Login'}
                  </CardTitle>
                  <CardDescription>Enter your credentials to access your portal.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="name@example.com" className="bg-background" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" name="password" type="password" placeholder="••••••••" className="bg-background" required />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full h-11" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                      Sign In
                    </Button>
                    <div className="relative w-full">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                      <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
                    </div>
                    <Button variant="outline" type="button" className="w-full h-11 border-white/10" onClick={() => initiateGoogleSignIn(auth)} disabled={loading}>Google</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="bg-card border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">
                    {selectedRole === 'user' ? 'Innovator Registration' : 'MechMaster Registration'}
                  </CardTitle>
                  <CardDescription>Join the MechHub network as a {selectedRole === 'user' ? 'Buyer' : 'Manufacturing Vendor'}.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input id="reg-email" name="email" type="email" placeholder="name@example.com" className="bg-background" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input id="reg-password" name="password" type="password" placeholder="••••••••" className="bg-background" required />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full h-11" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                      Create Account
                    </Button>
                    <div className="relative w-full">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                      <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or register with</span></div>
                    </div>
                    <Button variant="outline" type="button" className="w-full h-11 border-white/10" onClick={() => initiateGoogleSignIn(auth)} disabled={loading}>Google</Button>
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
