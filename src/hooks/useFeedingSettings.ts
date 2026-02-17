import { useState, useEffect } from 'react';

export interface FeedingSettings {
  frequency: number;
  times: string[];
  doseGrams: number;
  autoFeeding: boolean;
}

const DEFAULT_SETTINGS: FeedingSettings = {
  frequency: 3,
  times: ['08:00', '12:00', '17:00'],
  doseGrams: 50,
  autoFeeding: true,
};

const STORAGE_KEY = 'aquafeedx_feeding_settings';

// READY FOR ESP32 INTEGRATION
// Replace with: fetch("http://localhost:3000/api/feed", { method: "POST", body: JSON.stringify(settings) })
export function useFeedingSettings() {
  const [settings, setSettings] = useState<FeedingSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveSettings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setLastSaved(new Date());
    // READY FOR ESP32 INTEGRATION
    // fetch("http://localhost:3000/api/feed/settings", { method: "POST", body: JSON.stringify(settings) })
  };

  const feedNow = () => {
    // READY FOR ESP32 INTEGRATION
    // fetch("http://localhost:3000/api/feed/manual", { method: "POST" })
    console.log('Manual feed triggered!');
  };

  const updateSettings = (partial: Partial<FeedingSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  return { settings, updateSettings, saveSettings, feedNow, lastSaved };
}
