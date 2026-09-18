'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { LogOut, Activity, Plus } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function CustomerPortalLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated || user?.role !== 'CUSTOMER') {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  if (!mounted || !isAuthenticated || user?.role !== 'CUSTOMER') return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">HKI Support</h1>
          <nav className="hidden md:flex gap-4 ml-4">
            <Link 
              href="/customer-portal" 
              className={`text-sm font-medium hover:text-blue-600 transition-colors ${pathname === '/customer-portal' ? 'text-blue-600' : 'text-gray-500'}`}
            >
              My Incidents
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/customer-portal/incidents/new"
            className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium items-center gap-2"
          >
            <Plus size={16} /> Raise Incident
          </Link>
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
            <ThemeToggle />
            <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
