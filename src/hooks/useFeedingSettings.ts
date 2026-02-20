import { useState, useEffect } from 'react';

export interface FeedingSettings {
  times: string[];
}

export function useFeedingSettings() {
  const [settings, setSettings] = useState<FeedingSettings>({
    times: [] 
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // data terbaru dr database
  const fetchSchedules = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/schedules");
      if (response.ok) {
        const data = await response.json();
        
        // Ambil indeks [0] karena backend mengirim data terbaru di urutan pertama (desc)
        if (data && data.length > 0) {
          const latestSchedule = data[0]; // Ganti dari data[data.length - 1] menjadi data[0]
          setSettings({ 
            times: latestSchedule.time || [] 
          });
        }
      }
    } catch (error) {
      console.error("Gagal mengambil jadwal dari database:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Ambil data saat komponen pertama kali dimuat (mencegah reset saat refresh)
  useEffect(() => {
    fetchSchedules();
  }, []);

  const updateSettings = (partial: Partial<FeedingSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  const saveSettings = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/schedules", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          name: "Jadwal Pakan Aktif",
          time: settings.times, // Mengirim array string
          isActive: true
        })
      });

      if (response.ok) {
        setShowSuccess(true);
        
        await fetchSchedules();
        
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        const err = await response.json();
        console.error("Backend Error:", err);
        alert("Gagal menyimpan ke database. Cek format data.");
      }
    } catch (error) {
      console.error("Gagal koneksi ke API:", error);
      alert("Terjadi kesalahan koneksi ke server.");
    }
  };

  return { 
    settings, 
    updateSettings, 
    saveSettings, 
    showSuccess, 
    isLoading 
  };
}