export type RiskLevel = 'normal' | 'warning' | 'critical';

export interface Layer {
  id: number;
  label: string;
  position: string;
  temperature: number;
  humidity: number;
  tempChange1h: number;
  humidityChange1h: number;
  remainingHours: number;
  elapsedHours: number;
  status: RiskLevel;
  trend: number[]; // last 6 hourly temperature readings, °C
  note: string;
}

export const BATCH = {
  id: 'B001',
  sheets: 180,
  areaM2: 6.0,
  startedAt: '02:00',
  updatedAt: '09:00',
};

export const LAYERS: Layer[] = [
  {
    id: 1,
    label: 'Layer 1',
    position: 'Bottom — closest to heat source',
    temperature: 76.8,
    humidity: 54,
    tempChange1h: 2.9,
    humidityChange1h: -3,
    remainingHours: 13.1,
    elapsedHours: 7,
    status: 'warning',
    trend: [68.2, 69.4, 71.0, 73.5, 75.1, 76.8],
    note: 'Temperature is climbing faster than usual for this stage of drying.',
  },
  {
    id: 2,
    label: 'Layer 2',
    position: 'Middle',
    temperature: 65.1,
    humidity: 63,
    tempChange1h: 0.6,
    humidityChange1h: -1,
    remainingHours: 17.8,
    elapsedHours: 7,
    status: 'normal',
    trend: [62.4, 63.0, 63.8, 64.3, 64.5, 65.1],
    note: 'Steady rise, tracking the expected drying curve.',
  },
  {
    id: 3,
    label: 'Layer 3',
    position: 'Top — furthest from heat source',
    temperature: 59.8,
    humidity: 70,
    tempChange1h: 0.3,
    humidityChange1h: -1,
    remainingHours: 21.2,
    elapsedHours: 7,
    status: 'normal',
    trend: [58.0, 58.4, 58.9, 59.2, 59.5, 59.8],
    note: 'Cooler and slower to dry, as expected for the top layer.',
  },
];

export const RISK_ORDER: RiskLevel[] = ['normal', 'warning', 'critical'];

export function overallRisk(layers: Layer[]): RiskLevel {
  return layers.reduce<RiskLevel>((worst, l) => {
    return RISK_ORDER.indexOf(l.status) > RISK_ORDER.indexOf(worst)
      ? l.status
      : worst;
  }, 'normal');
}

export const RISK_STYLES: Record<
  RiskLevel,
  { label: string; pill: string; banner: string; dot: string }
> = {
  normal: {
    label: 'Normal',
    pill: 'bg-brand-100 text-brand-700',
    banner: 'bg-brand-600',
    dot: 'bg-brand-400',
  },
  warning: {
    label: 'Warning',
    pill: 'bg-amber-100 text-amber-700',
    banner: 'bg-amber-500',
    dot: 'bg-amber-400',
  },
  critical: {
    label: 'Critical',
    pill: 'bg-rose-100 text-rose-700',
    banner: 'bg-rose-600',
    dot: 'bg-rose-400',
  },
};
