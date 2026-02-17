import { useState, useEffect, useCallback } from 'react';

export interface SensorData {
  temperature: number;
  ph: number;
  ammonia: number;
  turbidity: number;
  feedingStatus: boolean;
  nextFeedingTime: string;
  nextFeedingCountdown: number; // seconds
}

export type SensorStatus = 'good' | 'warning' | 'danger';

export function getSensorStatus(type: string, value: number): SensorStatus {
  switch (type) {
    case 'temperature':
      if (value >= 25 && value <= 30) return 'good';
      if (value >= 22 && value < 25 || value > 30 && value <= 33) return 'warning';
      return 'danger';
    case 'ph':
      if (value >= 6.5 && value <= 8.0) return 'good';
      if (value >= 6.0 && value < 6.5 || value > 8.0 && value <= 8.5) return 'warning';
      return 'danger';
    case 'ammonia':
      if (value <= 0.02) return 'good';
      if (value <= 0.05) return 'warning';
      return 'danger';
    case 'turbidity':
      if (value <= 30) return 'good';
      if (value <= 60) return 'warning';
      return 'danger';
    default:
      return 'good';
  }
}

function randomInRange(min: number, max: number, decimals = 1): number {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

// READY FOR ESP32 INTEGRATION
// Replace this hook with real API calls:
// fetch("http://localhost:3000/api/sensor")
export function useSensorData(updateInterval = 3000) {
  const [data, setData] = useState<SensorData>({
    temperature: 27.5,
    ph: 7.2,
    ammonia: 0.015,
    turbidity: 22,
    feedingStatus: false,
    nextFeedingTime: '12:00',
    nextFeedingCountdown: 3600,
  });

  const [history, setHistory] = useState<{ time: string; temperature: number; ph: number; ammonia: number }[]>([]);

  const updateData = useCallback(() => {
    setData(prev => {
      const newTemp = Math.max(20, Math.min(35, prev.temperature + randomInRange(-0.5, 0.5)));
      const newPh = Math.max(5.5, Math.min(9, prev.ph + randomInRange(-0.1, 0.1, 2)));
      const newAmmonia = Math.max(0, Math.min(0.1, prev.ammonia + randomInRange(-0.005, 0.005, 3)));
      const newTurbidity = Math.max(0, Math.min(100, prev.turbidity + randomInRange(-3, 3, 0)));
      const newCountdown = Math.max(0, prev.nextFeedingCountdown - updateInterval / 1000);

      return {
        temperature: Number(newTemp.toFixed(1)),
        ph: Number(newPh.toFixed(2)),
        ammonia: Number(newAmmonia.toFixed(3)),
        turbidity: Math.round(newTurbidity),
        feedingStatus: prev.feedingStatus,
        nextFeedingTime: prev.nextFeedingTime,
        nextFeedingCountdown: newCountdown,
      };
    });

    setHistory(prev => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      const newEntry = {
        time: timeStr,
        temperature: data.temperature,
        ph: data.ph,
        ammonia: data.ammonia,
      };
      const updated = [...prev, newEntry];
      return updated.slice(-30); // Keep last 30 entries
    });
  }, [data, updateInterval]);

  useEffect(() => {
    const interval = setInterval(updateData, updateInterval);
    return () => clearInterval(interval);
  }, [updateData, updateInterval]);

  return { data, history };
}
