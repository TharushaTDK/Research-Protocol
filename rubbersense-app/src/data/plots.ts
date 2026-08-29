// ─── Plot model ───────────────────────────────────────────────────────────────

export interface Plot {
  id: string;
  name: string;
  x: number; // marker position on the map, percent
  y: number; // marker position on the map, percent
  // Weather / field conditions (Tab 1)
  humidity: number;        // %
  rainfall: number;        // mm, last 24h
  temperature: number;     // °C
  windSpeed: number;       // km/h
  soilMoisture: number;    // % (0-100)
  soilPH: number;          // 3.5 – 7.0
  // Tapping history (Tab 1)
  tappingCycle: 'd2' | 'd3' | 'd4'; // tapping frequency
  lastTapDaysAgo: number;  // days since last tap
  // Market
  priceTrendPct: number;   // vs. yesterday
}

export const PLOTS: Plot[] = [
  {
    id: 'a',
    name: 'North Block — A12',
    x: 27,
    y: 30,
    humidity: 74,
    rainfall: 1,
    temperature: 28,
    windSpeed: 8,
    soilMoisture: 42,
    soilPH: 5.2,
    tappingCycle: 'd2',
    lastTapDaysAgo: 2,
    priceTrendPct: 1.8,
  },
  {
    id: 'b',
    name: 'Riverside Block — B4',
    x: 66,
    y: 20,
    humidity: 81,
    rainfall: 4,
    temperature: 26,
    windSpeed: 11,
    soilMoisture: 58,
    soilPH: 4.8,
    tappingCycle: 'd3',
    lastTapDaysAgo: 3,
    priceTrendPct: 0.6,
  },
  {
    id: 'c',
    name: 'Hillside Block — C7',
    x: 45,
    y: 66,
    humidity: 89,
    rainfall: 14,
    temperature: 23,
    windSpeed: 6,
    soilMoisture: 78,
    soilPH: 4.4,
    tappingCycle: 'd3',
    lastTapDaysAgo: 4,
    priceTrendPct: -2.3,
  },
  {
    id: 'd',
    name: 'South Block — D2',
    x: 78,
    y: 74,
    humidity: 76,
    rainfall: 0,
    temperature: 30,
    windSpeed: 9,
    soilMoisture: 35,
    soilPH: 5.6,
    tappingCycle: 'd2',
    lastTapDaysAgo: 2,
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

// ─── DRC Prediction (Tab 2) ────────────────────────────────────────────────────

export interface DrcStatus {
  label: string;
  tone: 'low' | 'good' | 'high';
  advice: string;
}

/**
 * Multi-factor DRC prediction incorporating weather, soil, and tapping history.
 * Returns predicted DRC (%) and status.
 */
export function predictDRC(plot: Plot, soilMoisture: number, soilPH: number): number {
  // Base DRC from humidity and rainfall (inverse relationship)
  let drc = 35;
  drc -= (plot.humidity - 70) * 0.25;
  drc -= plot.rainfall * 0.6;
  drc -= (soilMoisture - 40) * 0.12;
  // Soil pH effect — optimal is ~5.0–5.5 for rubber
  const phDelta = Math.abs(soilPH - 5.2);
  drc -= phDelta * 1.5;
  // Temperature bonus
  drc += (plot.temperature - 25) * 0.3;
  // Clamp to realistic range
  return Math.min(42, Math.max(18, parseFloat(drc.toFixed(1))));
}

export function getDrcStatus(drc: number): DrcStatus {
  if (drc < 26) {
    return {
      label: 'Below Optimal',
      tone: 'low',
      advice:
        'DRC is below the optimal range. Trees may be under stress or over-tapped. Reduce coagulant strength and monitor before increasing tapping frequency.',
    };
  }
  if (drc > 35) {
    return {
      label: 'Above Average',
      tone: 'high',
      advice:
        'DRC is above average — latex is more concentrated. Reduce water dilution slightly during coagulation for best slab quality.',
    };
  }
  return {
    label: 'Optimal Range',
    tone: 'good',
    advice:
      'DRC is within the optimal 26–35% range. Proceed with standard tapping and the usual formic-acid dosage.',
  };
}

// ─── Tapping Advisory (Tab 3) — MAIN FARMER OUTPUT ────────────────────────────

export type TappingAction = 'tap' | 'caution' | 'delay' | 'stop';

export interface TappingAdvisory {
  action: TappingAction;
  headline: string;
  reason: string;
  bestTimeWindow: string;
  factors: {
    label: string;
    ok: boolean;
    detail: string;
  }[];
}

/**
 * Multi-factor tapping advisory combining weather, DRC, soil, and tapping history.
 * This is the MAIN FARMER-FACING output (Section 9.2).
 */
export function getTappingAdvisory(
  plot: Plot,
  soilMoisture: number,
  soilPH: number,
  predictedDRC: number,
): TappingAdvisory {
  const weatherOk = plot.rainfall < 8 && plot.humidity < 85;
  const drcOk = predictedDRC >= 26;
  const soilOk = soilMoisture < 70 && soilPH >= 4.5;
  const cycleOk = plot.lastTapDaysAgo >= (plot.tappingCycle === 'd2' ? 2 : plot.tappingCycle === 'd3' ? 3 : 4);

  const okCount = [weatherOk, drcOk, soilOk, cycleOk].filter(Boolean).length;

  let action: TappingAction;
  let headline: string;
  let reason: string;
  let bestTimeWindow: string;

  if (plot.rainfall >= 14) {
    action = 'stop';
    headline = 'Do Not Tap Today';
    reason =
      'Heavy rainfall in the last 24 hours significantly raises bark-rot and panel infection risk. Allow the bark to dry before resuming tapping.';
    bestTimeWindow = 'Wait for at least 24 h after rain stops';
  } else if (okCount >= 3 && weatherOk) {
    action = 'tap';
    headline = 'Tap Now';
    reason =
      'All key conditions are favourable — weather is clear, DRC is healthy, soil conditions are good, and your tapping cycle is on schedule.';
    bestTimeWindow = plot.temperature > 27 ? '5:00 – 7:00 AM' : '5:30 – 7:30 AM';
  } else if (okCount >= 2) {
    action = 'caution';
    headline = 'Tap with Caution';
    reason =
      'Conditions are borderline. You may tap, but reduce tapping intensity and monitor latex flow closely for any signs of tree stress.';
    bestTimeWindow = '5:30 – 7:00 AM';
  } else {
    action = 'delay';
    headline = 'Delay Tapping';
    reason =
      'Multiple unfavourable factors detected. Delaying tapping today will protect tree health and maintain long-term latex productivity.';
    bestTimeWindow = 'Re-check conditions tomorrow morning';
  }

  const cycleLabel =
    plot.tappingCycle === 'd2' ? 'every 2 days' : plot.tappingCycle === 'd3' ? 'every 3 days' : 'every 4 days';

  return {
    action,
    headline,
    reason,
    bestTimeWindow,
    factors: [
      {
        label: 'Weather',
        ok: weatherOk,
        detail: weatherOk
          ? `${plot.rainfall}mm rain · ${plot.humidity}% humidity — safe range`
          : `${plot.rainfall}mm rain or ${plot.humidity}% humidity — too high`,
      },
      {
        label: 'Latex DRC',
        ok: drcOk,
        detail: drcOk
          ? `${predictedDRC.toFixed(1)}% — within healthy range`
          : `${predictedDRC.toFixed(1)}% — below optimal, tree may be stressed`,
      },
      {
        label: 'Soil Conditions',
        ok: soilOk,
        detail: soilOk
          ? `Moisture ${soilMoisture}% · pH ${soilPH.toFixed(1)} — acceptable`
          : `Moisture ${soilMoisture}% or pH ${soilPH.toFixed(1)} — outside target range`,
      },
      {
        label: 'Tapping Cycle',
        ok: cycleOk,
        detail: cycleOk
          ? `Last tapped ${plot.lastTapDaysAgo}d ago · schedule (${cycleLabel}) met`
          : `Last tapped ${plot.lastTapDaysAgo}d ago · cycle (${cycleLabel}) not yet due`,
      },
    ],
  };
}

// ─── Collection & Price (Tab 4) ────────────────────────────────────────────────

export interface CollectionWindow {
  hoursAfterTap: number;
  windowDescription: string;
  expectedYieldKg: number;
  collectionNote: string;
}

export function getCollectionWindow(plot: Plot, predictedDRC: number): CollectionWindow {
  // Higher DRC → latex solidifies faster → shorter collection window
  const hoursAfterTap = predictedDRC > 33 ? 4.5 : predictedDRC > 28 ? 5.5 : 6.5;
  // Yield estimate: DRC × volume factor × plot size proxy
  const expectedYieldKg = parseFloat(((predictedDRC / 30) * 4.2).toFixed(1));

  return {
    hoursAfterTap,
    windowDescription: `Collect ${hoursAfterTap}–${hoursAfterTap + 1} h after tapping`,
    expectedYieldKg,
    collectionNote:
      plot.rainfall > 0
        ? 'Rain may have diluted latex — check cup before full collection.'
        : 'Dry conditions expected — normal latex concentration.',
  };
}

const BASE_PRICE = 450; // Rs. per kg, illustrative baseline

export function estimatePrice(drc: number) {
  const mid = Math.round(BASE_PRICE + (drc - 30) * 6);
  return { low: mid - 15, high: mid + 15, mid };
}
