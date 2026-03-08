import { useState, useEffect } from "react";
import { toast } from "sonner";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, onValue, set } from "firebase/database";

// firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBYJKjXSNmu_WOCf8mAm_S5-Livw9hfblc",
  authDomain: "aquafeedx.firebaseapp.com",
  databaseURL: "https://aquafeedx-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aquafeedx",
  storageBucket: "aquafeedx.firebasestorage.app",
  messagingSenderId: "20038083272",
  appId: "1:20038083272:web:3459be9b982801333fbbfd",
  measurementId: "G-JL6E6NRS60"
};

// Inisialisasi Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const analytics = getAnalytics(app);
const db = getDatabase(app);

export interface FeedingSchedule {
  id: number;
  time: string;
  name: string;
  isActive: boolean;
}

export const useFeedingSettings = () => {
  const [schedules, setSchedules] = useState<FeedingSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mengambil data secara real-time dari Firebase
  useEffect(() => {
    const schedulesRef = ref(db, 'schedules');
    
    const unsubscribe = onValue(schedulesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Firebase menyimpan array atau objek, kita pastikan formatnya array
        const formattedData = Array.isArray(data) ? data : Object.values(data);
        setSchedules(formattedData as FeedingSchedule[]);
      } else {
        setSchedules([]);
      }
      setIsLoading(false);
    }, (error) => {
      console.error(error);
      toast.error("Gagal memuat jadwal dari Firebase");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fungsi untuk sinkronisasi ke Firebase (didefinisikan di atas agar bisa dipanggil fungsi lain)
  const syncSchedules = async (data: FeedingSchedule[]) => {
    try {
      setIsLoading(true);
      await set(ref(db, 'schedules'), data);
      toast.success("Jadwal berhasil diperbarui");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyinkronkan ke Firebase");
    } finally {
      setIsLoading(false);
    }
  };

  const addSchedule = () => {
    const newId = schedules.length > 0 ? Math.max(...schedules.map(s => s.id)) + 1 : 1;
    const newSchedule: FeedingSchedule = {
      id: newId,
      time: "08:00",
      name: `Jadwal ${newId}`,
      isActive: true,
    };
    const updatedSchedules = [...schedules, newSchedule];
    syncSchedules(updatedSchedules);
  };

  const updateSchedule = (id: number, updates: Partial<FeedingSchedule>) => {
    const updatedSchedules = schedules.map((s) => 
      s.id === id ? { ...s, ...updates } : s
    );
    setSchedules(updatedSchedules);
  };

  const removeSchedule = (id: number) => {
    const updatedSchedules = schedules.filter((s) => s.id !== id);
    syncSchedules(updatedSchedules);
  };

  const toggleSchedule = (id: number) => {
    const updatedSchedules = schedules.map((s) => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    );
    syncSchedules(updatedSchedules);
  };

  return {
    schedules,
    isLoading,
    addSchedule,
    updateSchedule,
    removeSchedule,
    toggleSchedule,
    syncSchedules: () => syncSchedules(schedules),
  };
};