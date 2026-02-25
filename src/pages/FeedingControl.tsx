import { Clock, Save, Trash2, Plus, Check, Utensils, Loader2 } from 'lucide-react';
import { useFeedingSettings } from '@/hooks/useFeedingSettings';

export default function FeedingControl() {
  const { schedules, addTime, removeTime, handleTimeChange, saveSettings, showSuccess, isLoading } = useFeedingSettings();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">Menyinkronkan jadwal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 glass-card rounded-xl p-4 flex items-center gap-3 border border-success/30 animate-fade-up">
          <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
            <Check className="w-4 h-4 text-success" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Berhasil Disimpan!</p>
            <p className="text-xs text-muted-foreground">Jadwal telah sinkron ke database</p>
          </div>
        </div>
      )}

      <div className="fade-up">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Kontrol Pakan</h1>
        <p className="text-sm text-muted-foreground mt-1">Kelola waktu pemberian pakan otomatis</p>
      </div>

      <div className="glass-card rounded-2xl p-6 fade-up fade-up-delay-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">Jadwal Jam Pakan</h3>
              <p className="text-xs text-muted-foreground text-balance">Waktu yang tertera di bawah ini adalah jadwal kapan pakan otomatis akan mengeluarkan makanan.</p>
            </div>
          </div>
          <button 
            onClick={addTime}
            title="Tambah Waktu"
            className="flex items-center justify-center gap-2 text-xs font-bold bg-secondary hover:bg-secondary/80 text-foreground px-5 py-2.5 rounded-xl transition-all border border-border"
          >
            <Plus className="w-4 h-4" /> Tambah Waktu
          </button>
        </div>

        <div className="space-y-4">
          {schedules.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl bg-secondary/10">
              <Utensils className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Belum ada jadwal yang tersimpan</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {schedules.map((schedule, index) => (
                <div key={index} className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/40 border border-border/50 hover:border-primary/40 transition-all">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-xs font-black">
                    {index + 1}
                  </div>
                  <input
                    type="time"
                    aria-label={`Waktu Pakan ${index + 1}`}
                    title="Ubah Jam Pakan"
                    value={schedule.time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    className="flex-1 bg-transparent text-foreground outline-none font-mono text-lg font-bold focus:text-primary transition-colors"
                  />
                  <button 
                    onClick={() => removeTime(index)}
                    aria-label="Hapus Waktu"
                    title="Hapus Waktu"
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fade-up fade-up-delay-2">
        <button
          onClick={saveSettings}
          title="Simpan & Perbarui Jadwal"
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm transition-all ripple-btn glow-hover bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 uppercase tracking-widest"
        >
          <Save className="w-5 h-5" />
          Simpan & Perbarui Jadwal
        </button>
      </div>
    </div>
  );
}