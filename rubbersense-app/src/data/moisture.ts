import type { CaptureFeatures } from '../lib/acousticListener';

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export const LISTENING_HINTS = [
  'Tap the sheet with your stick near the microphone',
  'Still listening… go ahead and tap the sheet',
  "Can't hear a clear tap yet — try again",
  'Try tapping a little harder to increase the sound',
  'Hold the microphone closer to the sheet',
  'Take your time — tap whenever you’re ready',
];

type ClarityResult = 'clear' | 'quiet' | 'unclear';

// Two failure tiers so the retry guidance can be specific about what went
// wrong, rather than one generic message every time.
const QUIET_THRESHOLD = 0.18;
const CLARITY_THRESHOLD = 0.32;

export const RETRY_MESSAGES: Record<Exclude<ClarityResult, 'clear'>, string> = {
  quiet: 'That tap was too quiet — try tapping a bit harder',
  unclear: "Can't understand that clearly — please tap the sheet again",
};

export function classifyClarity(ampPeak: number): ClarityResult {
  if (ampPeak >= CLARITY_THRESHOLD) return 'clear';
  if (ampPeak < QUIET_THRESHOLD) return 'quiet';
  return 'unclear';
}

// Used by the "tap the circle" fallback so the flow is always demoable
// without a physical sheet or a working microphone. Occasionally produces
// a quiet or unclear reading so both retry paths are genuinely reachable.
export function simulateTapCapture(): CaptureFeatures {
  const roll = Math.random();
  let ampPeak: number;
  if (roll < 0.68) {
    ampPeak = rand(0.36, 0.85); // clear
  } else if (roll < 0.84) {
    ampPeak = rand(0.2, 0.31); // unclear
  } else {
    ampPeak = rand(0.05, 0.17); // too quiet
  }
  return {
    ampPeak,
    dominantFreqHz: rand(300, 1900),
    spectralCentroidHz: rand(500, 2200),
    dampingRatio: rand(0.2, 0.95),
  };
}

export type QualityTone = 'good' | 'fair' | 'poor';

export interface QualityResult {
  tone: QualityTone;
  label: string;
  instructions: string;
  qualityScore: number; // 0-100
  drynessPercent: number; // 0-100
}

export function computeQuality(features: CaptureFeatures): QualityResult {
  const normFreq = clamp((features.dominantFreqHz - 200) / 1800, 0, 1);
  const normCentroid = clamp((features.spectralCentroidHz - 300) / 2200, 0, 1);
  const normDamping = clamp(features.dampingRatio, 0, 1);

  const qualityScore = clamp(
    (normFreq * 0.4 + normCentroid * 0.3 + normDamping * 0.3) * 100,
    0,
    100,
  );
  const drynessPercent = clamp(
    35 + normFreq * 30 + normDamping * 35,
    0,
    100,
  );

  if (qualityScore >= 72) {
    return {
      tone: 'good',
      label: 'Excellent Quality',
      instructions:
        'The sheet sounds crisp and firm — fully dried and ready for grading.',
      qualityScore,
      drynessPercent,
    };
  }
  if (qualityScore >= 45) {
    return {
      tone: 'fair',
      label: 'Good Quality',
      instructions:
        'The sheet sounds mostly firm but slightly dull — a little more drying time is recommended.',
      qualityScore,
      drynessPercent,
    };
  }
  return {
    tone: 'poor',
    label: 'Needs More Drying',
    instructions:
      'The sheet still sounds dull and damp — leave it in the smokehouse for longer.',
    qualityScore,
    drynessPercent,
  };
}

export const QUALITY_TONE_STYLES: Record<
  QualityTone,
  { pill: string; bar: string; card: string }
> = {
  good: {
    pill: 'bg-brand-100 text-brand-700',
    bar: 'bg-brand-500',
    card: 'from-brand-500 via-brand-600 to-brand-700',
  },
  fair: {
    pill: 'bg-amber-100 text-amber-700',
    bar: 'bg-amber-400',
    card: 'from-amber-400 via-amber-500 to-amber-600',
  },
  poor: {
    pill: 'bg-rose-100 text-rose-600',
    bar: 'bg-rose-400',
    card: 'from-rose-400 via-rose-500 to-rose-600',
  },
};

export function estimateSheetPrice(qualityScore: number) {
  const mid = Math.round(360 + qualityScore * 1.6);
  return { low: mid - 12, high: mid + 12, mid };
}
