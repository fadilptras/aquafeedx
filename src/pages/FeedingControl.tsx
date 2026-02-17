import { useState } from 'react';
import { Utensils, Save, Zap, Clock, ToggleLeft, ToggleRight, Check } from 'lucide-react';
import { useFeedingSettings } from '@/hooks/useFeedingSettings';

export default function FeedingControl() {
  const { settings, updateSettings, saveSettings, feedNow, lastSaved } = useFeedingSettings();
  const [showSuccess, setShowSuccess] = useState(false);
  const [feedTriggered, setFeedTriggered] = useState(false);

  const handleSave = () => {
    saveSettings();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleFeedNow = () => {
    feedNow();
    setFeedTriggered(true);
    setTimeout(() => setFeedTriggered(false), 2000);
  };

  const frequencyOptions = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Success notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 glass-card rounded-xl p-4 flex items-center gap-3 border border-success/30 animate-fade-up">
          <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
            <Check className="w-4 h-4 text-success" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Settings Saved!</p>
            <p className="text-xs text-muted-foreground">Configuration updated successfully</p>
          </div>
        </div>
      )}

      <div className="fade-up">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Feeding Control</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your automated feeding schedule</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Frequency */}
        <div className="glass-card rounded-xl p-5 fade-up fade-up-delay-1">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Feeding Frequency</h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            {frequencyOptions.map(f => (
              <button
                key={f}
                onClick={() => updateSettings({ frequency: f })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ripple-btn ${
                  settings.frequency === f 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {f}x / day
              </button>
            ))}
          </div>
        </div>

        {/* Feeding Times */}
        <div className="glass-card rounded-xl p-5 fade-up fade-up-delay-2">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Feeding Times</h3>
          </div>
          <div className="space-y-2">
            {Array.from({ length: settings.frequency }, (_, i) => (
              <input
                key={i}
                type="time"
                value={settings.times[i] || '08:00'}
                onChange={e => {
                  const newTimes = [...settings.times];
                  newTimes[i] = e.target.value;
                  updateSettings({ times: newTimes });
                }}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors font-mono text-sm"
              />
            ))}
          </div>
        </div>

        {/* Dose */}
        <div className="glass-card rounded-xl p-5 fade-up fade-up-delay-3">
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Feed Dose</h3>
          </div>
          <input
            type="range"
            min={10}
            max={200}
            step={5}
            value={settings.doseGrams}
            onChange={e => updateSettings({ doseGrams: Number(e.target.value) })}
            className="w-full accent-primary h-2 rounded-full appearance-none bg-secondary cursor-pointer"
            style={{ accentColor: 'hsl(185 72% 48%)' }}
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">10g</span>
            <span className="text-lg font-bold font-mono text-primary">{settings.doseGrams}g</span>
            <span className="text-xs text-muted-foreground">200g</span>
          </div>
        </div>

        {/* Auto Toggle */}
        <div className="glass-card rounded-xl p-5 fade-up fade-up-delay-4">
          <div className="flex items-center gap-2 mb-4">
            {settings.autoFeeding ? (
              <ToggleRight className="w-5 h-5 text-success" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-muted-foreground" />
            )}
            <h3 className="font-semibold text-foreground">Auto-Feeding</h3>
          </div>
          <button
            onClick={() => updateSettings({ autoFeeding: !settings.autoFeeding })}
            className={`w-full py-3 rounded-lg text-sm font-semibold transition-all ripple-btn ${
              settings.autoFeeding 
                ? 'bg-success/20 text-success border border-success/30' 
                : 'bg-secondary text-muted-foreground border border-border'
            }`}
          >
            {settings.autoFeeding ? '✓ Auto-Feeding Enabled' : 'Auto-Feeding Disabled'}
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 fade-up fade-up-delay-5">
        <button
          onClick={handleFeedNow}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ripple-btn glow-hover text-primary-foreground"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <Zap className="w-4 h-4" />
          {feedTriggered ? 'Feeding...' : 'Feed Now'}
        </button>
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary text-foreground font-semibold text-sm hover:bg-secondary/80 transition-all ripple-btn"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
