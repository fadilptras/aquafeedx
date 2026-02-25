import { Save, Check, RotateCcw, Settings2, Droplets, MapPin, Fish, Waves, Box, Calendar, Loader2 } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

export default function SettingsPage() {
  const { 
    config, 
    updateConfig, 
    saveSettings, 
    handleReset, 
    showSuccess, 
    isLoading 
  } = useSettings();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">Memuat pengaturan sistem...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 glass-card rounded-xl p-4 flex items-center gap-3 border border-success/30 animate-fade-up shadow-xl shadow-success/10">
          <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
            <Check className="w-4 h-4 text-success" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Pengaturan Disimpan!</p>
            <p className="text-xs text-muted-foreground">Konfigurasi sistem berhasil diperbarui ke database</p>
          </div>
        </div>
      )}

      <div className="fade-up">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Pengaturan Sistem</h1>
        <p className="text-sm text-muted-foreground mt-1">Sesuaikan konfigurasi perangkat AquaFeedX Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Kiri */}
        <div className="glass-card h-full rounded-xl p-6 flex flex-col space-y-5 fade-up fade-up-delay-1 border border-border/50">
          <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-3">
            <Settings2 className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Identitas Perangkat & Kolam</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wider">
                Nama Perangkat
              </label>
              <input
                aria-label="Nama Perangkat"
                title="Masukkan Nama Perangkat"
                value={config.deviceName}
                onChange={e => updateConfig('deviceName', e.target.value)}
                placeholder="Contoh: AquaFeedX-01"
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 text-foreground border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Lokasi Kolam
              </label>
              <input
                aria-label="Lokasi Kolam"
                title="Masukkan Lokasi Kolam"
                value={config.poolLocation}
                onChange={e => updateConfig('poolLocation', e.target.value)}
                placeholder="Contoh: Desa Sukamaju"
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 text-foreground border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <Fish className="w-3.5 h-3.5" /> Jenis Ikan
              </label>
              <input
                aria-label="Jenis Ikan"
                title="Masukkan Jenis Ikan"
                value={config.fishType}
                onChange={e => updateConfig('fishType', e.target.value)}
                placeholder="Contoh: Nila Merah"
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 text-foreground border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5" /> Volume Kolam (m³)
              </label>
              <input
                aria-label="Volume Kolam"
                title="Masukkan Volume Kolam"
                type="number"
                value={config.poolVolume}
                onChange={e => updateConfig('poolVolume', e.target.value)}
                placeholder="Contoh: 15"
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 text-foreground border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5" /> Kapasitas Wadah Pakan (kg)
              </label>
              <input
                aria-label="Kapasitas Wadah Pakan"
                title="Masukkan Kapasitas Wadah Pakan"
                type="number"
                value={config.feedCapacity}
                onChange={e => updateConfig('feedCapacity', e.target.value)}
                placeholder="Contoh: 5"
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 text-foreground border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Tanggal Pemasangan
              </label>
              <input
                aria-label="Tanggal Pemasangan"
                title="Masukkan Tanggal Pemasangan"
                type="date"
                value={config.installDate}
                onChange={e => updateConfig('installDate', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 text-foreground border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium transition-all"
              />
            </div>
          </div>
        </div>

        {/* Kanan */}
        <div className="glass-card h-full rounded-xl p-6 flex flex-col space-y-5 fade-up fade-up-delay-2 border border-border/50">
          <div className="flex items-center gap-2 mb-2 border-b border-border/50 pb-3">
            <Droplets className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Ambang Batas Kualitas Air</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Sistem akan memberikan tanda bahaya di dashboard jika sensor membaca nilai di luar batas toleransi yang Anda tentukan di bawah ini.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {[
              { label: 'Suhu Minimum (°C)', key: 'tempMin' as const, desc: 'Batas dingin air' },
              { label: 'Suhu Maksimum (°C)', key: 'tempMax' as const, desc: 'Batas panas air' },
              { label: 'pH Minimum', key: 'phMin' as const, desc: 'Batas asam air' },
              { label: 'pH Maksimum', key: 'phMax' as const, desc: 'Batas basa air' },
            ].map(field => (
              <div key={field.key} className="p-3 rounded-xl bg-secondary/30 border border-border/50">
                <label className="text-xs font-bold text-muted-foreground mb-1 block uppercase tracking-wider">
                  {field.label}
                </label>
                <input
                  aria-label={field.label}
                  title={`Masukkan ${field.label}`}
                  type="number"
                  step={0.1}
                  value={config[field.key]}
                  onChange={e => updateConfig(field.key, e.target.value)}
                  className="w-full px-3 py-2 mt-1 rounded-lg bg-background text-foreground border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-lg font-mono font-bold transition-all"
                />
                <p className="text-[10px] text-muted-foreground mt-1.5 opacity-70">{field.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 fade-up fade-up-delay-3 pt-4">
        <button
          onClick={handleReset}
          title="Kosongkan Form"
          className="flex items-center justify-center px-6 py-3.5 rounded-xl bg-secondary text-muted-foreground font-bold text-sm hover:bg-destructive hover:text-destructive-foreground transition-all ripple-btn border border-border w-full sm:w-auto"
        >
          <RotateCcw className="w-5 h-5 sm:mr-0" />
          <span className="sm:hidden ml-2">Kosongkan Form</span>
        </button>
        <button
          onClick={saveSettings}
          title="Simpan Pengaturan"
          className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all ripple-btn glow-hover bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 uppercase tracking-widest w-full sm:w-auto"
        >
          <Save className="w-5 h-5" /> Simpan Pengaturan
        </button>
      </div>
    </div>
  );
}