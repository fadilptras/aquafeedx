import { useState } from 'react';
import { Save, Check, RotateCcw } from 'lucide-react';

export default function SettingsPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [config, setConfig] = useState({
    deviceName: 'AquaFeedX-01',
    apiEndpoint: 'http://localhost:3000/api',
    updateInterval: 3,
    alertsEnabled: true,
    tempMin: 25,
    tempMax: 30,
    phMin: 6.5,
    phMax: 8.0,
  });

  const handleSave = () => {
    localStorage.setItem('aquafeedx_config', JSON.stringify(config));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    localStorage.removeItem('aquafeedx_config');
    localStorage.removeItem('aquafeedx_feeding_settings');
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 glass-card rounded-xl p-4 flex items-center gap-3 border border-success/30 animate-fade-up">
          <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
            <Check className="w-4 h-4 text-success" />
          </div>
          <p className="text-sm font-medium text-foreground">Settings saved!</p>
        </div>
      )}

      <div className="fade-up">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your AquaFeedX system</p>
      </div>

      <div className="space-y-4">
        {/* Device Settings */}
        <div className="glass-card rounded-xl p-5 space-y-4 fade-up fade-up-delay-1">
          <h3 className="font-semibold text-foreground">Device Configuration</h3>
          
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Device Name</label>
            <input
              value={config.deviceName}
              onChange={e => setConfig(p => ({ ...p, deviceName: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">API Endpoint</label>
            <input
              value={config.apiEndpoint}
              onChange={e => setConfig(p => ({ ...p, apiEndpoint: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Update Interval (seconds)</label>
            <input
              type="number"
              min={1}
              max={30}
              value={config.updateInterval}
              onChange={e => setConfig(p => ({ ...p, updateInterval: Number(e.target.value) }))}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono"
            />
          </div>
        </div>

        {/* Alert Thresholds */}
        <div className="glass-card rounded-xl p-5 space-y-4 fade-up fade-up-delay-2">
          <h3 className="font-semibold text-foreground">Alert Thresholds</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Temp Min (°C)', key: 'tempMin' as const },
              { label: 'Temp Max (°C)', key: 'tempMax' as const },
              { label: 'pH Min', key: 'phMin' as const },
              { label: 'pH Max', key: 'phMax' as const },
            ].map(field => (
              <div key={field.key}>
                <label className="text-xs text-muted-foreground mb-1 block">{field.label}</label>
                <input
                  type="number"
                  step={0.1}
                  value={config[field.key]}
                  onChange={e => setConfig(p => ({ ...p, [field.key]: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 fade-up fade-up-delay-3">
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm ripple-btn glow-hover text-primary-foreground"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <Save className="w-4 h-4" /> Save Settings
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 rounded-xl bg-secondary text-muted-foreground font-semibold text-sm hover:bg-secondary/80 transition-all ripple-btn"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
