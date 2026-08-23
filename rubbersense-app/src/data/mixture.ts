export type MixtureTone = 'good' | 'water' | 'acid';

export interface MixtureVerdict {
  tone: MixtureTone;
  label: string;
  instructions: string;
  recommendation: string;
}

const BRIGHTNESS_THRESHOLD = 150;
const EVENNESS_THRESHOLD = 35;

// Heuristic proxy standing in for a real image-quality model: colour
// (pale vs. dense) approximates dilution, pixel-brightness spread
// (even vs. patchy) approximates how uniformly the acid has mixed in.
export function analyzeMixture(
  avgBrightness: number,
  stdDev: number,
): MixtureVerdict {
  if (avgBrightness >= BRIGHTNESS_THRESHOLD && stdDev < EVENNESS_THRESHOLD) {
    return {
      tone: 'good',
      label: 'Good Consistency',
      instructions:
        'The mixture looks pale, smooth and evenly blended. Colour and texture look right for coagulation.',
      recommendation: 'No adjustment needed — proceed with your planned recipe.',
    };
  }

  if (avgBrightness < BRIGHTNESS_THRESHOLD) {
    return {
      tone: 'water',
      label: 'Too Concentrated',
      instructions:
        'The mixture looks denser and darker than ideal, which usually means it is still too concentrated to coagulate evenly.',
      recommendation: 'Add a little more water, mix well, then recheck.',
    };
  }

  return {
    tone: 'acid',
    label: 'Uneven Coagulation',
    instructions:
      'The mixture looks pale but patchy, suggesting the acid has not distributed evenly through the latex yet.',
    recommendation: 'Add a small amount of formic acid and stir thoroughly.',
  };
}

export const MIXTURE_TONE_STYLES: Record<
  MixtureTone,
  { pill: string; ring: string }
> = {
  good: { pill: 'bg-brand-100 text-brand-700', ring: 'ring-brand-200' },
  water: { pill: 'bg-sky-100 text-sky-700', ring: 'ring-sky-200' },
  acid: { pill: 'bg-amber-100 text-amber-700', ring: 'ring-amber-200' },
};
