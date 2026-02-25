
'use client';
import Link from 'next/link';
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { useUser, useAuth, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { doc } from 'firebase/firestore';


export function LandingNav() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();

  // Fetch profile to get display name
  const userProfileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);
  
  const { data: profile } = useDoc(userProfileRef);

  const handleSignOut = () => {
    signOut(auth);
  };

  const displayName = profile?.fullName || user?.email?.split('@')[0] || 'Account';

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/mechhub.jpg" alt="MechHub Logo" width={60} height={60} />
          <span className="font-headline font-bold text-xl tracking-tight">MechHub</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/#services" className="hover:text-secondary transition-colors">Services</Link>
          <Link href="/#how-it-works" className="hover:text-secondary transition-colors">How it Works</Link>
          <Link href="/#vendors" className="hover:text-secondary transition-colors">MechMasters</Link>
        </div>
        <div className="flex items-center gap-4">
          {!isUserLoading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 px-2" suppressHydrationWarning>
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="hidden sm:inline-block max-w-[120px] truncate font-medium">{displayName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border-white/10 w-56">
                    <DropdownMenuLabel className="font-headline">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <Link href="/dashboard">
                      <DropdownMenuItem className="cursor-pointer gap-2">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard?tab=profile">
                      <DropdownMenuItem className="cursor-pointer gap-2">
                        <UserIcon className="w-4 h-4" /> My Profile
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" className="hidden sm:inline-flex" suppressHydrationWarning>Sign In</Button>
                </Link>
              )}
            </>
          )}
          <Link href="/upload">
            <Button className="bg-primary hover:bg-primary/90 text-white px-6" suppressHydrationWarning>Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
