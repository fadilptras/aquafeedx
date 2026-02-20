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

const statusColors = {
  good: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
};

const statusBg = {
  good: "bg-success/10",
  warning: "bg-warning/10",
  danger: "bg-destructive/10",
};

const statusLabels = {
  good: "Aman",
  warning: "Peringatan",
  danger: "Bahaya",
};

function formatCountdown(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function Dashboard() {
  const { data } = useSensorData();

  const cards = [
    {
      label: "Suhu Air",
      value: `${data.temperature}°C`,
      icon: Thermometer,
      status: getSensorStatus("temperature", data.temperature),
      range: "25–30°C optimal",
    },
    {
      label: "pH Air",
      value: data.ph.toFixed(2),
      icon: Droplets,
      status: getSensorStatus("ph", data.ph),
      range: "6.5–8.0 optimal",
    },
    {
      label: "Status Pakan",
      value: data.feedingStatus ? "Aktif" : "Standby",
      icon: Utensils,
      status: data.feedingStatus ? ("good" as const) : ("warning" as const),
      range: data.feedingStatus ? "Motor menyala" : "Menunggu jadwal",
    },
    {
      label: "Jadwal Pakan",
      value: formatCountdown(data.nextFeedingCountdown),
      icon: Clock,
      status: "good" as const,
      range: `Jam : ${data.nextFeedingTime} WIB`,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2">
      {/* 1. Header Section - Lebih Clean */}
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

      {/* 2. Hero Visual - Frame yang lebih rapi */}
      <div className="fade-up fade-up-delay-1">
        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10" />
          <img
            src="/src/assets/bioflok.png"
            alt="Bioflok Pond"
            className="w-full h-48 sm:h-64 object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Label di dalam gambar */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <Camera className="w-3.5 h-3.5 text-white/80" />
            <span className="text-[10px] text-white font-bold uppercase tracking-wider">
              Bioflok 1 : Apa namanya?
            </span>
          </div>
        </div>
      </div>

      {/* 3. Grid Cards - Penempatan Seimbang */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`glass-card relative overflow-hidden rounded-2xl p-5 border border-white/10 hover:border-primary/30 transition-all duration-300 group flex items-center justify-between fade-up fade-up-delay-${i + 1}`}
            >
              {/* Sisi Kiri: Informasi */}
              <div className="z-10 flex-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 opacity-70">
                  {card.label}
                </p>
                <h3 className="text-2xl font-black font-mono tracking-tighter text-foreground mb-2">
                  {card.value}
                </h3>

                {/* Status Badge - Lebih rapi di bawah */}
                <div className="flex items-center gap-2">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${statusBg[card.status]} ${statusColors[card.status]}`}
                  >
                    <span
                      className={`w-1 h-1 rounded-full ${card.status === "good" ? "bg-success" : card.status === "warning" ? "bg-warning" : "bg-destructive"} animate-pulse`}
                    />
                    {statusLabels[card.status]}
                  </div>
                  <span className="text-[10px] text-muted-foreground/60 font-medium">
                    {card.range}
                  </span>
                </div>
              </div>

              {/* Sisi Kanan: Icon - Ukuran pas & rapi */}
              <div className="z-10 ml-4">
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* Dekorasi Background Halus */}
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
