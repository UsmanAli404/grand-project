'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sun, User } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b">
      <Button
        variant="link"
        className="text-xl font-bold hover:cursor-pointer"
        onClick={() => router.push('/dashboard')}
      >
        NextHire
      </Button>

      <div className="flex items-center gap-4">
        <Button size="icon" variant="ghost" aria-label="Toggle theme" className="hover:border-2 hover:cursor-pointer">
          <Sun className="w-5 h-5" />
        </Button>

        <Button size="icon" variant="ghost" aria-label="Profile" className="hover:border-2 hover:cursor-pointer">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}