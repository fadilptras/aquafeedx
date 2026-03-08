import { useState, useEffect } from "react";
import {
  Thermometer,
  Droplets,
  FlaskConical,
  Eye,
  Utensils,
  Clock,
  Camera,
} from "lucide-react";
import { useSensorData, getSensorStatus } from "@/hooks/useSensorData";
import { useSettings } from "@/hooks/useSettings";
import { useFeedingSettings } from "@/hooks/useFeedingSettings";

// Menggabungkan konfigurasi warna agar lebih rapi dan mendukung tema 'cold' (dingin)
const statusStyles = {
  good: { text: "text-success", bg: "bg-success/10", dot: "bg-success" },
  warning: { text: "text-warning", bg: "bg-warning/10", dot: "bg-warning" },
  danger: { text: "text-destructive", bg: "bg-destructive/10", dot: "bg-destructive" },
  cold: { text: "text-sky-500", bg: "bg-sky-500/10", dot: "bg-sky-500" },
};

function formatCountdown(seconds: number) {
  if (seconds < 0) return "00:00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function Dashboard() {
  const { data } = useSensorData();
  const { config } = useSettings();
  const { schedules } = useFeedingSettings();

  const [nextFeedingTime, setNextFeedingTime] = useState("-");
  const [countdown, setCountdown] = useState(0);
  const [isFeeding, setIsFeeding] = useState(false);

  useEffect(() => {
    if (!schedules || schedules.length === 0) {
      setNextFeedingTime("Belum ada");
      setCountdown(0);
      setIsFeeding(false);
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentSeconds = now.getSeconds();
      const currentTotalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

      const sortedTimes = schedules.map(s => s.time).sort();
      
      let nextTotalSeconds = Infinity;
      let nextStr = "";
      let currentlyFeeding = false;
      let foundNext = false;

      for (const t of sortedTimes) {
        if (!t) continue;
        
        const [h, m] = t.split(":").map(Number);
        const timeTotalSeconds = h * 3600 + m * 60;

        if (h === currentHours && m === currentMinutes) {
          currentlyFeeding = true;
        }

        if (timeTotalSeconds > currentTotalSeconds && !foundNext) {
          nextTotalSeconds = timeTotalSeconds;
          nextStr = t;
          foundNext = true;
        }
      }

      if (!foundNext && sortedTimes.length > 0) {
        const [h, m] = sortedTimes[0].split(":").map(Number);
        nextTotalSeconds = (h * 3600 + m * 60) + 24 * 3600; 
        nextStr = sortedTimes[0];
      }

      setIsFeeding(currentlyFeeding);
      setNextFeedingTime(nextStr);
      setCountdown(nextTotalSeconds - currentTotalSeconds);
    };

    updateTimer(); 
    const timerId = setInterval(updateTimer, 1000); 

    return () => clearInterval(timerId);
  }, [schedules]);

  const cards = [
    {
      label: "Suhu Lokasi",
      value: `${data.temperature}°C`,
      icon: Thermometer,
      status: getSensorStatus("temperature", data.temperature, 0, 0),
      range: "Suhu aktual lokasi",
    },
    {
      label: "pH Air",
      value: data.ph.toFixed(2),
      icon: Droplets,
      status: getSensorStatus("ph", data.ph, Number(config.phMin) || 0, Number(config.phMax) || 0),
      range: `${config.phMin}–${config.phMax} optimal`,
    },
    {
      label: "Status Pakan",
      value: isFeeding ? "Aktif" : "Standby",
      icon: Utensils,
      // Kita buat objek status manual untuk pakan agar selaras dengan output getSensorStatus
      status: { label: isFeeding ? "Berjalan" : "Menunggu", theme: isFeeding ? "good" : "warning" },
      range: isFeeding ? "Motor pakan menyala" : "Menunggu jadwal",
    },
    {
      label: "Jadwal Terdekat",
      value: schedules && schedules.length > 0 ? formatCountdown(countdown) : "--:--:--",
      icon: Clock,
      status: { label: schedules && schedules.length > 0 ? "Tersedia" : "Kosong", theme: schedules && schedules.length > 0 ? "good" : "warning" },
      range: schedules && schedules.length > 0 ? `Jam : ${nextFeedingTime} WIB` : "Jadwal belum diatur",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2">
      {/* 1. Header Section */}
      <div className="fade-up">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-1 w-8 bg-primary rounded-full" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Live Monitoring
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          AquaFeed<span className="text-primary text-4xl">X</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Pantau kondisi kolam dan pakan secara langsung.
        </p>
      </div>

      {/* 2. Hero Visual */}
      <div className="fade-up fade-up-delay-1">
        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10" />
          <img
            src="/src/assets/bioflok.png"
            alt="Bioflok Pond"
            className="w-full h-48 sm:h-64 object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <Camera className="w-3.5 h-3.5 text-white/80" />
            <span className="text-[10px] text-white font-bold uppercase tracking-wider">
              {config.poolLocation || "Area Utama"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          const themeClass = statusStyles[card.status.theme as keyof typeof statusStyles] || statusStyles.good;

          return (
            <div
              key={card.label}
              className={`glass-card relative overflow-hidden rounded-2xl p-5 border border-white/10 hover:border-primary/30 transition-all duration-300 group flex items-center justify-between fade-up fade-up-delay-${i + 1}`}
            >
              <div className="z-10 flex-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 opacity-70">
                  {card.label}
                </p>
                <h3 className="text-2xl font-black font-mono tracking-tighter text-foreground mb-2">
                  {card.value}
                </h3>

                <div className="flex items-center gap-2">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${themeClass.bg} ${themeClass.text}`}
                  >
                    <span
                      className={`w-1 h-1 rounded-full ${themeClass.dot} animate-pulse`}
                    />
                    {card.status.label}
                  </div>
                  <span className="text-[10px] text-muted-foreground/60 font-medium">
                    {card.range}
                  </span>
                </div>
              </div>

              <div className="z-10 ml-4">
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              </div>

              <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                <Icon size={100} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}