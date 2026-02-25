import { useState, useEffect, useCallback } from 'react';

export interface SensorData {
  temperature: number;
  ph: number;
  feedingStatus: boolean;
  nextFeedingTime: string;
  nextFeedingCountdown: number;
}

export type SensorStatus = 'good' | 'warning' | 'danger';

export function getSensorStatus(type: string, value: number, min: number, max: number): SensorStatus {
  // Fallback jika API settings belum termuat
  if (min === 0 && max === 0) return 'good';

  // Tentukan jarak toleransi untuk peringatan sebelum masuk kategori bahaya
  let tolerance = 0;
  if (type === 'temperature') tolerance = 3; // Peringatan jika selisih 3 derajat dari batas
  if (type === 'ph') tolerance = 0.5; // Peringatan jika selisih 0.5 dari batas

  // Jika nilai ada di dalam batas minimum & maksimum -> Aman
  if (value >= min && value <= max) return 'good';
  
  // Jika nilai di luar batas, tapi masih masuk dalam jarak toleransi -> Peringatan
  if ((value >= min - tolerance && value < min) || (value > max && value <= max + tolerance)) return 'warning';
  
  // Jika sudah melampaui batas dan toleransi -> Bahaya
  return 'danger';
}

export function useSensorData(updateInterval = 3000) {
  const [data, setData] = useState<SensorData>({
    temperature: 0,
    ph: 0,
    feedingStatus: false,
    nextFeedingTime: '-',
    nextFeedingCountdown: 0,
  });

  const [history, setHistory] = useState<{ time: string; temperature: number; ph: number }[]>([]);

  const updateData = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/api/sensor");
      const jsonData: SensorData = await response.json();
      
      setData(jsonData);

      setHistory(prev => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        const newEntry = {
          time: timeStr,
          temperature: jsonData.temperature,
          ph: jsonData.ph,
        };
        return [...prev, newEntry].slice(-30);
      });
    } catch (error) {
      console.error("Gagal fetch data sensor:", error);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(updateData, updateInterval);
    return () => clearInterval(interval);
  }, [updateData, updateInterval]);

  return { data, history };
}