import { useState, useEffect } from 'react';

export interface DeviceInfo {
  esp32Connected: boolean;
  wifiConnected: boolean;
  wifiSSID: string;
  lastDataReceived: Date;
  batteryLevel: number;
  firmwareVersion: string;
  uptime: number; // seconds
}

// READY FOR ESP32 INTEGRATION
// Replace with: fetch("http://localhost:3000/api/device/status")
export function useDeviceStatus() {
  const [device, setDevice] = useState<DeviceInfo>({
    esp32Connected: true,
    wifiConnected: true,
    wifiSSID: 'AquaFeedX_Network',
    lastDataReceived: new Date(),
    batteryLevel: 87,
    firmwareVersion: 'v2.1.4',
    uptime: 86400,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDevice(prev => ({
        ...prev,
        lastDataReceived: new Date(),
        batteryLevel: Math.max(10, Math.min(100, prev.batteryLevel + (Math.random() > 0.5 ? -1 : 0))),
        uptime: prev.uptime + 5,
        esp32Connected: Math.random() > 0.05,
        wifiConnected: Math.random() > 0.03,
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return device;
}
