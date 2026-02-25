import { useSensorData, getSensorStatus } from "@/hooks/useSensorData";
import { useSettings } from "@/hooks/useSettings";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const statusColors = {
  good: "bg-success text-success",
  warning: "bg-warning text-warning",
  danger: "bg-destructive text-destructive",
};

export default function WaterMonitoring() {
  const { data, history } = useSensorData(2000);
  const { config } = useSettings(); // Memanggil batas optimal dari settings

  // Memasukkan array ini ke dalam komponen agar bisa membaca config secara reaktif
  const chartConfig = [
    {
      key: "temperature",
      label: "Suhu Air (°C)",
      color: "hsl(185, 72%, 48%)",
      range: `${config.tempMin}–${config.tempMax}°C`,
    },
    { 
      key: "ph", 
      label: "pH Air", 
      color: "hsl(210, 90%, 55%)", 
      range: `${config.phMin}–${config.phMax}` 
    },
  ];

  const currentValues = [
    { type: "temperature", label: "Suhu Air", value: data.temperature, unit: "°C", min: config.tempMin, max: config.tempMax },
    { type: "ph", label: "pH Air", value: data.ph, unit: "", min: config.phMin, max: config.phMax },
  ];

  return (
    <div className="space-y-6">
      <div className="fade-up">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
          Monitoring Kualitas Air
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Grafik dan Status Terkini
        </p>
      </div>

      {/* Status indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 fade-up fade-up-delay-1">
        {currentValues.map((item) => {
          // Fungsi getSensorStatus kini dipanggil dengan membawa batas min dan max-nya
          const status = getSensorStatus(item.type, item.value, Number(item.min), Number(item.max));
          return (
            <div
              key={item.type}
              className="glass-card rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-muted-foreground capitalize">
                  {item.label}
                </p>
                <p className="text-xl font-bold font-mono text-foreground">
                  {typeof item.value === "number"
                    ? item.value.toFixed(item.type === "ph" ? 2 : 1)
                    : item.value}
                  {item.unit}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${statusColors[status].split(" ")[0]}/30 flex items-center justify-center`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${statusColors[status].split(" ")[0]} status-pulse`}
                  />
                </span>
                <span
                  className={`text-xs font-medium capitalize ${statusColors[status].split(" ")[1]}`}
                >
                  {status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="space-y-4">
        {chartConfig.map((chart, i) => (
          <div
            key={chart.key}
            className={`glass-card rounded-xl p-5 fade-up fade-up-delay-${i + 2}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">{chart.label}</h3>
                <p className="text-xs text-muted-foreground">
                  Rentang optimal: {chart.range}
                </p>
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(215, 20%, 16%)"
                  />
                  <XAxis
                    dataKey="time"
                    stroke="hsl(215, 15%, 35%)"
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis stroke="hsl(215, 15%, 35%)" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(215, 30%, 10%)",
                      border: "1px solid hsl(215, 20%, 20%)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "hsl(210, 40%, 93%)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={chart.key}
                    stroke={chart.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: chart.color }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}