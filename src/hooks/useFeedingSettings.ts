import { useState, useEffect } from 'react';

export interface ScheduleItem {
  id?: number;
  name?: string;
  time: string;
  isActive?: boolean;
}

export function useFeedingSettings() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // db
  const fetchSchedules = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/schedules");
      if (response.ok) {
        const data = await response.json();
        setSchedules(data || []);
      }
    } catch (error) {
      console.error("Gagal mengambil jadwal dari database:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Ambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchSchedules();
  }, []);

  const addTime = () => {
    setSchedules(prev => [...prev, { time: "08:00" }]);
  };

  const removeTime = (index: number) => {
    setSchedules(prev => prev.filter((_, i) => i !== index));
  };

  const handleTimeChange = (index: number, value: string) => {
    setSchedules(prev => {
      const newSchedules = [...prev];
      newSchedules[index].time = value;
      return newSchedules;
    });
  };

  const saveSettings = async () => {
    try {
      // Format data array of objects untuk dikirim ke endpoint sync
      const payload = schedules.map(s => ({
        name: "Jadwal Pakan Aktif",
        time: s.time,
        isActive: true
      }));

      // Kirim ke endpoint sync yang akan menghapus data lama dan mereplace dengan data baru ini
      const response = await fetch("http://localhost:3000/api/schedules/sync", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(payload)
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
    schedules, 
    addTime, 
    removeTime, 
    handleTimeChange, 
    saveSettings, 
    showSuccess, 
    isLoading 
  };
}