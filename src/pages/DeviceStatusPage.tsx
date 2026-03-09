import { Wifi, WifiOff, Cpu, Signal, Database, Activity, Plug } from 'lucide-react';
import { useDeviceStatus } from '@/hooks/useDeviceStatus';

// Fungsi bantuan untuk menilai kualitas sinyal RSSI
function getSignalQuality(rssi: number) {
  if (rssi >= -50) return 'Sangat Kuat';
  if (rssi >= -70) return 'Bagus';
  if (rssi >= -80) return 'Lemah';
  return 'Sangat Lemah';
}

export default function DeviceStatusPage() {
  const device = useDeviceStatus();

  // Baris pertama: 3 Kolom (Konektivitas ESP32 & WiFi)
  const row1Items = [
    {
      label: 'Koneksi ESP32',
      value: device.isOnline ? 'Terhubung' : 'Terputus',
      icon: Cpu,
      status: device.isOnline,
      detail: 'Sistem Kontrol Utama',
    },
    {
      label: 'Kekuatan Sinyal (RSSI)',
      value: device.isOnline ? `${device.wifiRSSI} dBm` : '-',
      icon: Signal,
      status: device.isOnline && device.wifiRSSI >= -80, // Kuning/Merah jika lemah
      detail: device.isOnline ? getSignalQuality(device.wifiRSSI) : 'Perangkat Offline',
    },
    {
      label: 'Jaringan WiFi',
      value: device.isOnline ? device.wifiSSID : 'Tidak Terhubung',
      icon: device.isOnline ? Wifi : WifiOff,
      status: device.isOnline,
      detail: device.isOnline ? 'Terhubung ke router' : 'Periksa jaringan',
    },
  ];

  // Baris kedua: 3 Kolom (Database, Sensor pH Statis, Listrik Statis)
  const row2Items = [
    {
      label: 'Koneksi Database',
      value: device.isDbConnected ? 'Terhubung' : 'Terputus',
      icon: Database,
      status: device.isDbConnected,
      detail: device.isDbConnected ? 'Firebase Real-time aktif' : 'Gagal sinkronisasi',
    },
    {
      label: 'Sensor pH Air',
      value: 'Aktif',
      icon: Activity,
      status: true, // Default Nyala
      detail: 'Membaca kadar asam/basa',
    },
    {
      label: 'Daya Listrik',
      value: 'Terhubung',
      icon: Plug,
      status: true, // Default Terhubung
      detail: 'Arus listrik',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="fade-up flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Status Perangkat</h1>
          <p className="text-sm text-muted-foreground mt-1">Informasi teknis dan kondisi komponen alat</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sistem:</span>
          <span className={`text-xs font-bold uppercase ${device.isOnline && device.isDbConnected ? 'text-success' : 'text-destructive'}`}>
            {device.isOnline && device.isDbConnected ? 'Stabil' : 'Gangguan'}
          </span>
          <span className={`w-2 h-2 rounded-full ${device.isOnline && device.isDbConnected ? 'bg-success animate-pulse' : 'bg-destructive'}`} />
        </div>
      </div>

      {/* Container Grid */}
      <div className="space-y-4">
        {/* Baris Pertama: Grid 3 Kolom (ESP32 & WiFi) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {row1Items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className={`glass-card rounded-xl p-5 fade-up fade-up-delay-${Math.min(i + 1, 3)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${item.status ? 'bg-success' : 'bg-destructive'} ${item.status && 'animate-pulse'}`} />
                </div>
                <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-tighter">{item.label}</p>
                <p className="text-lg font-bold font-mono text-foreground">{item.value}</p>
                <p className="text-[10px] text-muted-foreground mt-1 italic opacity-70">{item.detail}</p>
              </div>
            );
          })}
        </div>

        {/* Baris Kedua: Grid 3 Kolom (Database, pH, Listrik) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {row2Items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className={`glass-card rounded-xl p-5 fade-up fade-up-delay-${Math.min(i + 4, 6)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${item.status ? 'bg-success' : 'bg-destructive'} ${item.status && 'animate-pulse'}`} />
                </div>
                <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-tighter">{item.label}</p>
                <p className="text-lg font-bold font-mono text-foreground">{item.value}</p>
                <p className="text-[10px] text-muted-foreground mt-1 italic opacity-70">{item.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}