import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/feeding': 'Feeding Control',
  '/monitoring': 'Water Monitoring',
  '/device': 'Device Status',
  '/settings': 'Settings',
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = window.location.pathname;
  const title = pageTitles[pathname] || 'Dashboard';

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64">
        <TopNav onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
