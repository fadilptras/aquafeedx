import { Wifi, WifiOff, Cpu, Battery, Clock, Signal, Gauge } from 'lucide-react';
import { useDeviceStatus } from '@/hooks/useDeviceStatus';

function formatUptime(seconds: number) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

export default function DeviceStatusPage() {
  const device = useDeviceStatus();

  const items = [
    {
      label: 'ESP32 Connection',
      value: device.esp32Connected ? 'Connected' : 'Disconnected',
      icon: Cpu,
      status: device.esp32Connected,
      detail: 'ESP32-WROOM-32D',
    },
    {
      label: 'WiFi Status',
      value: device.wifiConnected ? device.wifiSSID : 'Not Connected',
      icon: device.wifiConnected ? Wifi : WifiOff,
      status: device.wifiConnected,
      detail: device.wifiConnected ? 'Signal: Strong' : 'Check router',
    },
    {
      label: 'Last Data Received',
      value: device.lastDataReceived.toLocaleTimeString(),
      icon: Clock,
      status: true,
      detail: 'Data streaming active',
    },
    {
      label: 'Battery Level',
      value: `${device.batteryLevel}%`,
      icon: Battery,
      status: device.batteryLevel > 20,
      detail: device.batteryLevel > 50 ? 'Healthy' : device.batteryLevel > 20 ? 'Low' : 'Critical',
    },
    {
      label: 'Device Uptime',
      value: formatUptime(device.uptime),
      icon: Gauge,
      status: true,
      detail: 'Running continuously',
    },
    {
      label: 'Firmware',
      value: device.firmwareVersion,
      icon: Signal,
      status: true,
      detail: 'Up to date',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="fade-up">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Device Status</h1>
        <p className="text-sm text-muted-foreground mt-1">ESP32 microcontroller and connectivity status</p>
      </div>

      {/* Main status indicator */}
      <div className="glass-card rounded-xl p-6 flex items-center gap-4 fade-up fade-up-delay-1">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${device.esp32Connected ? 'bg-success/10' : 'bg-destructive/10'}`}>
          <Cpu className={`w-8 h-8 ${device.esp32Connected ? 'text-success' : 'text-destructive'}`} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            System {device.esp32Connected ? 'Online' : 'Offline'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {device.esp32Connected ? 'All systems operational' : 'Connection lost — check hardware'}
          </p>
        </div>
        <div className="ml-auto">
          <span className={`w-4 h-4 rounded-full inline-block ${device.esp32Connected ? 'bg-success' : 'bg-destructive'} status-pulse`} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className={`glass-card rounded-xl p-5 fade-up fade-up-delay-${Math.min(i + 2, 5)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className={`w-2.5 h-2.5 rounded-full ${item.status ? 'bg-success' : 'bg-destructive'} status-pulse`} />
              </div>
              <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
              <p className="text-lg font-bold font-mono text-foreground">{item.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.detail}</p>
            </div>
          );
        })}
      </div>

      {/* ESP32 Integration note */}
      <div className="glass-card rounded-xl p-4 border-l-4 border-primary fade-up fade-up-delay-5">
        <p className="text-sm font-medium text-foreground">🔧 Ready for ESP32 Integration</p>
        <p className="text-xs text-muted-foreground mt-1">
          This dashboard supports Firebase, MQTT, WebSocket, and REST API connections. 
          Replace simulated data with real sensor readings from your ESP32 device.
        </p>
      </div>
    </div>
  );
}
