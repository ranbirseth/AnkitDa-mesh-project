'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BedDouble, Images, Star, MessageSquare } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-gold-400 font-bold">Dashboard</h1>
        <p className="text-forest-300 mt-2">Welcome to the Ankit Da Mess Admin Portal.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard title="Total Rooms" value="12" icon={BedDouble} />
        <DashboardStatCard title="Gallery Items" value="48" icon={Images} />
        <DashboardStatCard title="Testimonials" value="15" icon={Star} />
        <DashboardStatCard title="New Enquiries" value="4" icon={MessageSquare} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-forest-900/50 border-forest-800">
          <CardHeader>
            <CardTitle className="text-forest-50">Recent Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-forest-400 py-8">
              No new enquiries at this time.
            </div>
          </CardContent>
        </Card>

        <Card className="bg-forest-900/50 border-forest-800">
          <CardHeader>
            <CardTitle className="text-forest-50">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-forest-800/50">
              <span className="text-forest-300">Public Website</span>
              <span className="text-green-400 text-sm font-medium bg-green-400/10 px-2 py-1 rounded">Online</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-forest-800/50">
              <span className="text-forest-300">Database Connection</span>
              <span className="text-green-400 text-sm font-medium bg-green-400/10 px-2 py-1 rounded">Connected</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardStatCard({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) {
  return (
    <Card className="bg-forest-900/50 border-forest-800 overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
        <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-gold-500" />
      </div>
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="text-forest-300 text-xs sm:text-sm font-medium uppercase tracking-wider truncate">{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-2xl sm:text-3xl font-bold text-forest-50 truncate">{value}</div>
      </CardContent>
    </Card>
  );
}
