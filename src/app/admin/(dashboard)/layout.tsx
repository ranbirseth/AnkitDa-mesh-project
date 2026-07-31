'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BedDouble,
  Images,
  Star,
  MapPin,
  Phone,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Video,
  ListPlus,
  FolderOpen,
  MessageSquare,
  Megaphone,
  PanelBottom,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/hero', icon: Star, label: 'Hero Section' },
  { href: '/admin/rooms', icon: BedDouble, label: 'Rooms & Pricing' },
  { href: '/admin/gallery', icon: Images, label: 'Gallery' },
  { href: '/admin/media', icon: FolderOpen, label: 'Media Library' },
  { href: '/admin/amenities', icon: ListPlus, label: 'Amenities' },
  { href: '/admin/testimonials', icon: MessageSquare, label: 'Testimonials' },
  { href: '/admin/virtual-tour', icon: Video, label: 'Virtual Tour' },
  { href: '/admin/why-choose-us', icon: ShieldCheck, label: 'Why Choose Us' },
  { href: '/admin/location', icon: MapPin, label: 'Location' },
  { href: '/admin/contact', icon: Phone, label: 'Contact' },
  { href: '/admin/cta', icon: Megaphone, label: 'Call to Action' },
  { href: '/admin/footer', icon: PanelBottom, label: 'Footer' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest-900 text-forest-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-forest-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-50 w-64 bg-forest-950 border-r border-forest-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shrink-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-forest-800 shrink-0">
          <span className="text-xl font-serif text-gold-400 font-bold">Admin Portal</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-forest-400 hover:text-forest-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-forest-800">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg transition-colors group",
                  isActive
                    ? "bg-gold-500/10 text-gold-400"
                    : "text-forest-300 hover:bg-forest-900 hover:text-forest-50"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={cn("w-5 h-5 mr-3 shrink-0", isActive ? "text-gold-400" : "text-forest-400 group-hover:text-forest-50")} />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-forest-800 shrink-0 space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start text-forest-300 border-forest-700 hover:bg-forest-900 hover:text-forest-50"
            asChild
          >
            <Link href="/" target="_blank">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Live Site
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 flex items-center px-4 sm:px-6 lg:px-8 bg-forest-950/50 backdrop-blur-md border-b border-forest-800 shrink-0 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 mr-4 text-forest-400 hover:text-forest-50 lg:hidden rounded-lg hover:bg-forest-800 focus:outline-none focus:ring-2 focus:ring-gold-500"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 flex justify-end items-center">
            {/* User Profile dropdown can go here */}
            <div className="w-8 h-8 rounded-full bg-forest-800 flex items-center justify-center text-sm font-medium text-gold-400 border border-forest-700">
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-forest-900/50 relative">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
