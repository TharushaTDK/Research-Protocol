export interface Plot {
  id: string;
  name: string;
  x: number; // marker position on the map, percent
  y: number; // marker position on the map, percent
  drc: number; // predicted DRC, %
  humidity: number; // %
  rainfall: number; // mm, last 24h
  windSpeed: number; // km/h
  suitable: boolean; // suitable to tap/collect today
  reason: string; // weather reasoning for the verdict
  priceTrendPct: number; // vs. yesterday
}

export const PLOTS: Plot[] = [
  {
    id: 'a',
    name: 'North Block — A12',
    x: 27,
    y: 30,
    drc: 34.2,
    humidity: 74,
    rainfall: 1,
    windSpeed: 8,
    suitable: true,
    reason: 'Low rainfall and moderate humidity give steady, healthy latex flow.',
    priceTrendPct: 1.8,
  },
  {
    id: 'b',
    name: 'Riverside Block — B4',
    x: 66,
    y: 20,
    drc: 29.6,
    humidity: 81,
    rainfall: 4,
    windSpeed: 11,
    suitable: true,
    reason: 'Conditions are within the safe range, though humidity is a little high.',
    priceTrendPct: 0.6,
  },
  {
    id: 'c',
    name: 'Hillside Block — C7',
    x: 45,
    y: 66,
    drc: 22.1,
    humidity: 89,
    rainfall: 14,
    windSpeed: 6,
    suitable: false,
    reason: 'Heavy overnight rainfall raises bark-rot risk — best to skip tapping today.',
    priceTrendPct: -2.3,
  },
  {
    id: 'd',
    name: 'South Block — D2',
    x: 78,
    y: 74,
    drc: 31.5,
    humidity: 76,
    rainfall: 0,
    windSpeed: 9,
    suitable: true,
    reason: 'Dry conditions with good airflow — a favourable tapping day.',
    priceTrendPct: 3.1,
  },
];

export const WEEK_OUTLOOK = [
  { day: 'Mon', suitable: true },
  { day: 'Tue', suitable: true },
  { day: 'Wed', suitable: false },
  { day: 'Thu', suitable: true },
  { day: 'Fri', suitable: true },
  { day: 'Sat', suitable: true },
  { day: 'Sun', suitable: false },
];

export interface DrcStatus {
  label: string;
  tone: 'low' | 'good' | 'high';
  advice: string;
}

export function getDrcStatus(drc: number): DrcStatus {
  if (drc < 26) {
    return {
      label: 'Below Optimal',
      tone: 'low',
      advice:
        'DRC is below the optimal range. Reduce coagulant strength slightly and monitor tree stress before increasing tapping frequency.',
    };
  }
  if (drc > 35) {
    return {
      label: 'Above Average',
      tone: 'high',
      advice:
        'DRC is above average and latex is more concentrated. Reduce water dilution slightly during coagulation.',
    };
  }
  return {
    label: 'Optimal Range',
    tone: 'good',
    advice:
      'DRC is within the optimal 26–35% range. Proceed with standard tapping and the usual formic-acid dosage.',
  };
}

const BASE_PRICE = 450; // Rs. per kg, illustrative baseline

export function estimatePrice(drc: number) {
  const mid = Math.round(BASE_PRICE + (drc - 30) * 6);
  return { low: mid - 15, high: mid + 15, mid };
}
