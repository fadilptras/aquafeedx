import { useState, useEffect, useCallback } from 'react';

export interface SensorData {
  temperature: number;
  ph: number;
  feedingStatus: boolean;
  nextFeedingTime: string;
  nextFeedingCountdown: number;
}

export type SensorStatus = 'good' | 'warning' | 'danger';

// Fungsi ini tetap dipertahankan untuk logika warna di Dashboard
export function getSensorStatus(type: string, value: number): SensorStatus {
  switch (type) {
    case 'temperature':
      if (value >= 25 && value <= 30) return 'good';
      if ((value >= 22 && value < 25) || (value > 30 && value <= 33)) return 'warning';
      return 'danger';
    case 'ph':
      if (value >= 6.5 && value <= 8.0) return 'good';
      if ((value >= 6.0 && value < 6.5) || (value > 8.0 && value <= 8.5)) return 'warning';
      return 'danger';
    default:
      return 'good';
  }
}

// GANTI dengan URL Realtime Database Anda sendiri
const FIREBASE_URL = "https://proyek-anda-default-rtdb.firebaseio.com/sensor.json";

export function useSensorData(updateInterval = 3000) {
  const [data, setData] = useState<SensorData>({
    temperature: 0,
    ph: 0,
    feedingStatus: false,
    nextFeedingTime: '-',
    nextFeedingCountdown: 0,
  });

  // History tetap dipertahankan untuk grafik jika diperlukan
  const [history, setHistory] = useState<{ time: string; temperature: number; ph: number }[]>([]);

  const updateData = useCallback(async () => {
    try {
      const response = await fetch(FIREBASE_URL);
      const jsonData = await response.json();
      
      if (jsonData) {
        const newData = {
          temperature: jsonData.temperature || 0,
          ph: jsonData.ph || 0,
          feedingStatus: jsonData.feedingStatus || false,
          nextFeedingTime: jsonData.nextFeedingTime || "-",
          nextFeedingCountdown: jsonData.nextFeedingCountdown || 0,
        };

        setData(newData);

        // Menambahkan data ke history secara lokal setiap kali fetch berhasil
        setHistory(prev => {
          const now = new Date();
          const timeStr = now.toLocaleTimeString();
          const newEntry = {
            time: timeStr,
            temperature: newData.temperature,
            ph: newData.ph,
          };
          return [...prev, newEntry].slice(-30); // Simpan 30 data terakhir
        });
      }
    } catch (error) {
      console.error("Gagal mengambil data dari Firebase:", error);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(updateData, updateInterval);
    return () => clearInterval(interval);
  }, [updateData, updateInterval]);

  return { data, history };
}