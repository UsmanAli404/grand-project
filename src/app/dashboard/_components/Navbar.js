'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sun, Moon, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabaseClient";
import { toggleTheme } from "@/lib/themeToggle";
import { useState, useEffect } from 'react';
import { checkAuthStatus } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleTheme = () => {
    const html = document.documentElement;
    const newIsDark = !isDark;

    if (newIsDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    setIsDark(newIsDark);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      await fetch("/api/logout");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { isAuthenticated, session } = await checkAuthStatus();
      if (isAuthenticated && session?.user?.email) {
        setUserEmail(session.user.email);
      }
    };
    fetchUser();
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-black border-b dark:border-gray-400">
      <Button
        variant="link"
        className="text-xl font-bold hover:cursor-pointer"
        onClick={() => router.push('/dashboard')}
      >
        NextHire
      </Button>

      <div className="flex items-center gap-4">
        <Button
          size="icon"
          variant="ghost"
          aria-label="Toggle theme"
          className="hover:border-2 hover:cursor-pointer"
          onClick={toggleTheme}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" aria-label="Profile" className="hover:border-2 hover:cursor-pointer">
            <User className="w-5 h-5" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="" className="w-47">
            <DropdownMenuItem className="text-sm opacity-70 cursor-default hover:bg-transparent mb-1">
              {userEmail || "Fetching user..."}
            </DropdownMenuItem>
            <Button
              variant="destructive"
              className="w-full flex items-center justify-center"
              disabled={isLoggingOut}
              onClick={handleLogout}
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging out...
                </>
              ) : (
                "Logout"
              )}
            </Button>
        </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}