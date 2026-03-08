import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBYJKjXSNmu_WOCf8mAm_S5-Livw9hfblc",
  authDomain: "aquafeedx.firebaseapp.com",
  databaseURL: "https://aquafeedx-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aquafeedx",
  storageBucket: "aquafeedx.firebasestorage.app",
  messagingSenderId: "20038083272",
  appId: "1:20038083272:web:3459be9b982801333fbbfd",
};

// Inisialisasi Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export interface SettingsConfig {
  deviceName: string;
  poolLocation: string;
  fishType: string;
  poolVolume: number | string;
  feedCapacity: number | string;
  installDate: string;
  feedDuration: number | string;      // Durasi motor pakan menyala (detik)
  phCalibrationOffset: number | string; // Nilai offset untuk kalibrasi pH digital
  phMin: number | string;
  phMax: number | string;
}

const defaultConfig: SettingsConfig = {
  deviceName: '',
  poolLocation: '',
  fishType: '',
  poolVolume: 0,
  feedCapacity: 0,
  installDate: '',
  feedDuration: 5,           // Default 5 detik
  phCalibrationOffset: 0,    // Default 0 (tidak ada offset)
  phMin: 6.5,
  phMax: 8.0,
};

export function useSettings() {
  const [config, setConfig] = useState<SettingsConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  // Ambil data dari Firebase secara Real-time
  useEffect(() => {
    const settingsRef = ref(db, 'settings');
    
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setConfig({ ...defaultConfig, ...data });
      } else {
        console.warn("Data pengaturan belum ada di database Firebase");
        setConfig(defaultConfig);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Gagal mengambil pengaturan dari Firebase:", error);
      toast.error("Gagal terhubung ke database");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fungsi untuk update state lokal sebelum disimpan
  const updateConfig = (key: keyof SettingsConfig, value: string | number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // Simpan data ke Firebase
  const saveSettings = async () => {
    try {
      console.log("Mencoba menyimpan data ke Firebase...");
      const payload = {
        ...config,
        poolVolume: Number(config.poolVolume) || 0,
        feedCapacity: Number(config.feedCapacity) || 0,
        feedDuration: Number(config.feedDuration) || 0,
        phCalibrationOffset: Number(config.phCalibrationOffset) || 0,
        phMin: Number(config.phMin) || 0,
        phMax: Number(config.phMax) || 0,
      };

      await set(ref(db, 'settings'), payload);

      console.log("Data berhasil disimpan!");
      setShowSuccess(true);
      toast.success("Pengaturan berhasil disimpan");
      setTimeout(() => setShowSuccess(false), 3000); 
    } catch (error: any) {
      console.error("Gagal koneksi ke Firebase:", error);
      toast.error("Gagal menyimpan: Akses Ditolak");
      alert("Gagal menyimpan data ke Firebase! Pastikan 'Rules' sudah diset ke true.");
    }
  };

  // Reset form ke nilai awal
  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mengosongkan semua isian form?')) {
      setConfig(defaultConfig);
    }
  };

  return { 
    config, 
    updateConfig, 
    saveSettings, 
    handleReset, 
    showSuccess, 
    isLoading 
  };
}