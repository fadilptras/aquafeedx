import { Thermometer, Droplets, FlaskConical, Eye, Utensils, Clock } from 'lucide-react';
import { useSensorData, getSensorStatus } from '@/hooks/useSensorData';

const statusColors = {
  good: 'text-success',
  warning: 'text-warning',
  danger: 'text-destructive',
};

const statusBg = {
  good: 'bg-success/10',
  warning: 'bg-warning/10',
  danger: 'bg-destructive/10',
};

const statusLabels = {
  good: 'Good',
  warning: 'Warning',
  danger: 'Danger',
};

function formatCountdown(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function Dashboard() {
  const { data } = useSensorData();

  const cards = [
    {
      label: 'Water Temperature',
      value: `${data.temperature}°C`,
      icon: Thermometer,
      status: getSensorStatus('temperature', data.temperature),
      range: '25–30°C optimal',
    },
    {
      label: 'pH Level',
      value: data.ph.toFixed(2),
      icon: Droplets,
      status: getSensorStatus('ph', data.ph),
      range: '6.5–8.0 optimal',
    },
    {
      label: 'Ammonia Level',
      value: `${data.ammonia.toFixed(3)} ppm`,
      icon: FlaskConical,
      status: getSensorStatus('ammonia', data.ammonia),
      range: '< 0.02 ppm optimal',
    },
    {
      label: 'Water Turbidity',
      value: `${data.turbidity} NTU`,
      icon: Eye,
      status: getSensorStatus('turbidity', data.turbidity),
      range: '< 30 NTU optimal',
    },
    {
      label: 'Feeding Status',
      value: data.feedingStatus ? 'Active' : 'Standby',
      icon: Utensils,
      status: data.feedingStatus ? 'good' as const : 'warning' as const,
      range: data.feedingStatus ? 'Motor running' : 'Awaiting schedule',
    },
    {
      label: 'Next Feeding',
      value: formatCountdown(data.nextFeedingCountdown),
      icon: Clock,
      status: 'good' as const,
      range: `Scheduled at ${data.nextFeedingTime}`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="fade-up">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Real-Time Monitoring</h1>
        <p className="text-sm text-muted-foreground mt-1">Live sensor data from your AquaFeedX system</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`glass-card rounded-xl p-5 gradient-border glow-hover fade-up fade-up-delay-${i + 1}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusBg[card.status]} ${statusColors[card.status]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${card.status === 'good' ? 'bg-success' : card.status === 'warning' ? 'bg-warning' : 'bg-destructive'} status-pulse`} />
                  {statusLabels[card.status]}
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
              <p className="text-2xl font-bold font-mono text-foreground animate-number-tick">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-2">{card.range}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
