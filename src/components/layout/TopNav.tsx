import { Menu, Bell, Wifi, WifiOff, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDeviceStatus } from '@/hooks/useDeviceStatus';

interface TopNavProps {
  onMenuClick: () => void;
  title: string;
}

export default function TopNav({ onMenuClick, title }: TopNavProps) {
  const device = useDeviceStatus();

  return (
    <header className="glass-card border-b border-border px-4 sm:px-6 py-3 flex items-center gap-4 sticky top-0 z-30">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h2 className="text-lg font-semibold text-foreground hidden sm:block">{title}</h2>

      <div className="ml-auto flex items-center gap-3">


        {/* Tombol Settings (Ganti User) */}
        <Link 
          to="/settings" 
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg" 
          style={{ background: 'var(--gradient-primary)' }}
          title="Pengaturan"
        >
          <Settings className="w-4 h-4 text-primary-foreground" />
        </Link>
      </div>
    </header>
  );
}