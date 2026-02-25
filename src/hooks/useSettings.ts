import { useState, useEffect } from 'react';

export interface SettingsConfig {
  deviceName: string;
  poolLocation: string;
  fishType: string;
  poolVolume: number | string;
  feedCapacity: number | string;
  installDate: string;
  tempMin: number | string;
  tempMax: number | string;
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
  tempMin: 0,
  tempMax: 0,
  phMin: 0,
  phMax: 0,
};

export function useSettings() {
  const [config, setConfig] = useState<SettingsConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  // ambil data dr db (port 3004)
  const fetchSettings = async () => {
    try {
      const response = await fetch("http://localhost:3004/api/settings");
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      } else {
        console.warn("Data pengaturan belum ada di database (404)");
      }
    } catch (error) {
      console.error("Gagal mengambil pengaturan dari database:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Muat data saat halaman pertama kali dibuka
  useEffect(() => {
    fetchSettings();
  }, []);

  // Fungsi untuk update state lokal sebelum disimpan
  const updateConfig = (key: keyof SettingsConfig, value: string | number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // save
  const saveSettings = async () => {
    try {
      const payload = {
        ...config,
        poolVolume: Number(config.poolVolume) || 0,
        feedCapacity: Number(config.feedCapacity) || 0,
        tempMin: Number(config.tempMin) || 0,
        tempMax: Number(config.tempMax) || 0,
        phMin: Number(config.phMin) || 0,
        phMax: Number(config.phMax) || 0,
      };

      const response = await fetch("http://localhost:3004/api/settings", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000); // notif muncul 3 detik
      } else {
        const err = await response.json();
        console.error("Backend Error:", err);
        alert("Gagal menyimpan ke database.");
      }
    } catch (error) {
      console.error("Gagal koneksi ke API:", error);
      alert("Terjadi kesalahan koneksi ke server.");
    }
  };

  // reset
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