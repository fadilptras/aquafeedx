import { Wifi, WifiOff, Cpu, Zap, Clock, Signal } from 'lucide-react';
import { useDeviceStatus } from '@/hooks/useDeviceStatus';

// Fungsi untuk memformat waktu aktif perangkat
function formatUptime(seconds: number) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}hari ${h}jam ${m}menit`;
}

export default function DeviceStatusPage() {
  const device = useDeviceStatus();

  // Baris pertama: 3 Kolom
  const row1Items = [
    {
      label: 'Koneksi ESP32',
      value: device.esp32Connected ? 'Terhubung' : 'Terputus',
      icon: Cpu,
      status: device.esp32Connected,
      detail: 'ESP32-WROOM-32D',
    },
    {
      label: 'Koneksi Listrik',
      value: device.powerConnected ? 'Terhubung' : 'Terputus',
      icon: Zap,
      status: device.powerConnected,
      detail: device.powerConnected ? 'Catu daya stabil' : 'Cek adaptor listrik',
    },
    {
      label: 'Status WiFi',
      value: device.wifiConnected ? device.wifiSSID : 'Tidak Terhubung',
      icon: device.wifiConnected ? Wifi : WifiOff,
      status: device.wifiConnected,
      detail: device.wifiConnected ? 'Sinyal: Kuat' : 'Periksa router',
    },
  ];

  // Baris kedua: 2 Kolom
  const row2Items = [
    {
      label: 'Waktu Aktif Sistem',
      value: formatUptime(device.uptime),
      icon: Signal,
      status: true,
      detail: 'Berjalan tanpa gangguan',
    },
    {
      label: 'Data Terakhir Diterima',
      value: device.lastDataReceived.toLocaleTimeString('id-ID'),
      icon: Clock,
      status: true,
      detail: 'Aliran data aktif',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="fade-up flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Status Perangkat</h1>
          <p className="text-sm text-muted-foreground mt-1">Informasi teknis sistem AquaFeedX Anda</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sistem:</span>
          <span className="text-xs font-bold text-success uppercase">Stabil</span>
          <span className={`w-2 h-2 rounded-full bg-success animate-pulse`} />
        </div>
      </div>

      {/* Container Grid */}
      <div className="space-y-4">
        {/* Baris Pertama: Grid 3 Kolom */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {row1Items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className={`glass-card rounded-xl p-5 fade-up fade-up-delay-${Math.min(i + 1, 5)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${item.status ? 'bg-success' : 'bg-destructive'} animate-pulse`} />
                </div>
                <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-tighter">{item.label}</p>
                <p className="text-lg font-bold font-mono text-foreground">{item.value}</p>
                <p className="text-[10px] text-muted-foreground mt-1 italic opacity-70">{item.detail}</p>
              </div>
            );
          })}
        </div>

        {/* Baris Kedua: Grid 2 Kolom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {row2Items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className={`glass-card rounded-xl p-5 fade-up fade-up-delay-${Math.min(i + 4, 5)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${item.status ? 'bg-success' : 'bg-destructive'} animate-pulse`} />
                </div>
                <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-tighter">{item.label}</p>
                <p className="text-lg font-bold font-mono text-foreground">{item.value}</p>
                <p className="text-[10px] text-muted-foreground mt-1 italic opacity-70">{item.detail}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Catatan Integrasi ESP32 */}
      {/* <div className="glass-card rounded-xl p-4 border-l-4 border-primary fade-up fade-up-delay-5 bg-primary/5">
        <p className="text-sm font-bold text-foreground flex items-center gap-2">
          <span>🔧</span> Siap untuk Integrasi ESP32
        </p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Sistem saat ini menggunakan data simulasi untuk keperluan demo UI. Hubungkan ESP32 Anda ke endpoint API lokal untuk melihat performa perangkat yang sebenarnya secara real-time.
        </p>
      </div> */}
    </div>
  );
}