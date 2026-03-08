import { useState, useEffect, useRef } from 'react';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

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

// Mencegah inisialisasi ganda Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export interface SensorData {
  temperature: number;
  ph: number;
  feedingStatus: boolean;
  nextFeedingTime: string;
  nextFeedingCountdown: number;
}

export type SensorStatus = {
  label: string;
  theme: 'good' | 'warning' | 'danger' | 'cold';
};

export function getSensorStatus(type: string, value: number, min: number, max: number): SensorStatus {
  if (type === 'temperature') {
    // Batas suhu bisa disesuaikan. Contoh optimal: 25°C - 30°C
    if (value < 25) return { label: 'Dingin', theme: 'cold' };
    if (value > 30) return { label: 'Panas', theme: 'danger' };
    return { label: 'Normal', theme: 'good' };
  }

  if (type === 'ph') {
    if (min === 0 && max === 0) return { label: 'Normal', theme: 'good' };

    const tolerance = 0.5; 
    
    if (value >= min && value <= max) return { label: 'Normal', theme: 'good' };
    if ((value >= min - tolerance && value < min) || (value > max && value <= max + tolerance)) {
      return { label: 'Waspada', theme: 'warning' };
    }
    return { label: 'Bahaya', theme: 'danger' };
  }

  return { label: 'Normal', theme: 'good' };
}

export function useSensorData(historyInterval = 3000) {
  const [data, setData] = useState<SensorData>({
    temperature: 0,
    ph: 0,
    feedingStatus: false,
    nextFeedingTime: '-',
    nextFeedingCountdown: 0,
  });

  const [history, setHistory] = useState<{ time: string; temperature: number; ph: number }[]>([]);
  
  const latestData = useRef(data);
  const locationRef = useRef("Bogor"); // Default lokasi jika belum diatur

  // Fungsi mengambil data suhu aktual berdasarkan nama lokasi
  const fetchTemperature = async () => {
    try {
      const locName = locationRef.current;
      if (!locName) return;

      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locName)}&count=1`);
      const geoData = await geoRes.json();
      
      let lat = -6.5944; 
      let lon = 106.7892;

      if (geoData.results && geoData.results.length > 0) {
        lat = geoData.results[0].latitude;
        lon = geoData.results[0].longitude;
      }

      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      const weatherData = await weatherRes.json();
      const temp = weatherData.current_weather.temperature;
      
      setData(prev => {
        const newData = { ...prev, temperature: temp };
        latestData.current = newData;
        return newData;
      });
    } catch (error) {
      console.error("Gagal mengambil data API suhu:", error);
    }
  };

  useEffect(() => {
    const settingsRef = ref(db, 'settings/poolLocation');
    const unsubSettings = onValue(settingsRef, (snapshot) => {
      const loc = snapshot.val();
      if (loc) {
        locationRef.current = loc;
        fetchTemperature(); 
      }
    });

    const sensorRef = ref(db, 'sensor_data');
    const unsubSensor = onValue(sensorRef, (snapshot) => {
      const fbData = snapshot.val();
      if (fbData) {
        setData(prev => {
          const newData = {
            ...prev,
            ph: fbData.ph !== undefined ? fbData.ph : prev.ph,
            feedingStatus: fbData.feedingStatus || false,
            nextFeedingTime: fbData.nextFeedingTime || '-',
            nextFeedingCountdown: fbData.nextFeedingCountdown || 0,
          };
          latestData.current = newData;
          return newData;
        });
      }
    });

    fetchTemperature();
    const weatherInterval = setInterval(fetchTemperature, 5 * 60 * 1000);

    const recordInterval = setInterval(() => {
      setHistory(prev => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        const newEntry = {
          time: timeStr,
          temperature: latestData.current.temperature,
          ph: latestData.current.ph,
        };
        
        return [...prev, newEntry].slice(-30); 
      });
    }, historyInterval);

    return () => {
      unsubSettings();
      unsubSensor(); 
      clearInterval(weatherInterval);
      clearInterval(recordInterval);
    };
  }, [historyInterval]);

  return { data, history };
}