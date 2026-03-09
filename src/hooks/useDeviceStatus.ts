import { useState, useEffect } from 'react';
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

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export interface DeviceStatus {
  isOnline: boolean;
  wifiSSID: string;
  wifiRSSI: number;
  lastHeartbeat: number;
  isDbConnected: boolean;
}

export function useDeviceStatus() {
  const [status, setStatus] = useState<DeviceStatus>({
    isOnline: false,
    wifiSSID: 'Mencari...',
    wifiRSSI: 0,
    lastHeartbeat: 0,
    isDbConnected: false,
  });

  useEffect(() => {
    // 1. Membaca status alat dari ESP32
    const statusRef = ref(db, 'device_status');
    const unsubStatus = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Toleransi offline: 2 menit (120000 ms)
        const now = Date.now();
        const isOnline = (now - (data.lastHeartbeat || 0)) < 120000;

        setStatus(prev => ({
          ...prev,
          isOnline: isOnline,
          wifiSSID: data.wifiSSID || 'Tidak diketahui',
          wifiRSSI: data.wifiRSSI || 0,
          lastHeartbeat: data.lastHeartbeat || 0,
        }));
      }
    });

    // 2. Membaca status koneksi Firebase Database secara Real-time
    const connectedRef = ref(db, '.info/connected');
    const unsubConnected = onValue(connectedRef, (snapshot) => {
      setStatus(prev => ({
        ...prev,
        isDbConnected: snapshot.val() === true
      }));
    });

    // 3. Pengecekan interval setiap 10 detik agar UI ESP32 update jadi 'Offline' jika mati tiba-tiba
    const interval = setInterval(() => {
      setStatus(prev => {
        const now = Date.now();
        const isOnline = (now - prev.lastHeartbeat) < 120000;
        if (prev.isOnline !== isOnline) {
          return { ...prev, isOnline };
        }
        return prev;
      });
    }, 10000);

    return () => {
      unsubStatus();
      unsubConnected();
      clearInterval(interval);
    };
  }, []);

  return status;
}