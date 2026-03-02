'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/firebase';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LandingNav } from '@/components/LandingNav';
import { Loader2, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function ResetPasswordForm() {
    const auth = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [email, setEmail] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const oobCode = searchParams.get('oobCode');

    useEffect(() => {
        async function checkCode() {
            if (!oobCode) {
                setError('Invalid or missing reset token.');
                setVerifying(false);
                return;
            }

            try {
                const verifiedEmail = await verifyPasswordResetCode(auth, oobCode);
                setEmail(verifiedEmail);
                setVerifying(false);
            } catch (err: any) {
                console.error("Code verification failed:", err);
                setError('Your password reset link has expired or is invalid. Please request a new one.');
                setVerifying(false);
            }
        }

        checkCode();
    }, [auth, oobCode]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!oobCode || !email) return;

        const formData = new FormData(e.currentTarget);
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Passwords mismatch",
                description: "The passwords you entered do not match.",
            });
            return;
        }

        if (password.length < 6) {
            toast({
                variant: "destructive",
                title: "Password too short",
                description: "Password should be at least 6 characters.",
            });
            return;
        }

        setLoading(true);
        try {
            await confirmPasswordReset(auth, oobCode, password);

            toast({
                title: "Password Reset Successful",
                description: "You can now sign in with your new password.",
            });

            router.push('/login');
        } catch (err: any) {
            setLoading(false);
            toast({
                variant: "destructive",
                title: "Reset Failed",
                description: err.message || "An error occurred while resetting your password.",
            });
        }
    };

    if (verifying) {
        return (
            <Card className="w-full max-w-md bg-card border-white/10 shadow-2xl p-8 text-center mx-auto">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                <p className="text-muted-foreground">Verifying your secure link...</p>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md bg-card border-white/10 shadow-2xl relative overflow-hidden mx-auto">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
            <CardHeader className="space-y-1 pb-4">
                <div className="flex justify-center mb-2">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <KeyRound className="h-6 w-6 text-primary" />
                    </div>
                </div>
                <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
                <CardDescription className="text-center text-zinc-400">
                    {error ? "There was a problem with your request." : `Create a new password for ${email}`}
                </CardDescription>
            </CardHeader>

            {!error ? (
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="bg-zinc-950/50 border-white/10 focus-visible:ring-primary"
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="bg-zinc-950/50 border-white/10 focus-visible:ring-primary"
                                disabled={loading}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full h-11 bg-primary hover:bg-primary/90" type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Updating..." : "Reset Password"}
                        </Button>
                    </CardFooter>
                </form>
            ) : (
                <CardContent className="flex flex-col gap-4 items-center pb-8 p-6">
                    <p className="text-sm text-destructive font-medium text-center">{error}</p>
                    <Button variant="outline" className="mt-4 border-white/10 w-full" onClick={() => router.push('/login')}>
                        Return to Login
                    </Button>
                </CardContent>
            )}
        </Card>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col pt-24 pb-12">
            <LandingNav />
            <div className="flex-1 flex justify-center items-center px-4">
                <Suspense fallback={
                    <Card className="w-full max-w-md bg-card border-white/10 p-8 text-center mx-auto">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    </Card>
                }>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
