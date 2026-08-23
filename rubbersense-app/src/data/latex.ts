// Simple, transparent illustrative formulas standing in for the trained
// Metro_N temperature-corrected regression model referenced in the
// research (Component 1) — now fed by a custom gap-measurement device
// reading instead of a manual Metrolac chart. Coefficients are reasonable
// placeholders for the prototype demo, not a validated experimental result.

const REFERENCE_GAP = 6; // cm, device calibration point
const GAP_COEFFICIENT = 1.3; // % DRC per cm deviation from reference
const BASE_DRC = 34; // % at reference gap

const TARGET_DRC = 13; // % — standard dilution target before coagulation
const REFERENCE_DOSE = 4; // mL of formic acid per litre of diluted latex, baseline
const BASE_TIME = 6; // hours, at reference dose and DRC 33%

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export interface GapReading {
  gapCm: number;
  basketVolumeL: number;
}

export function computeDrcFromGap({ gapCm }: GapReading): number {
  return clamp(BASE_DRC - (gapCm - REFERENCE_GAP) * GAP_COEFFICIENT, 15, 45);
}

export interface TimeFromRecipeInput {
  correctedDrc: number;
  basketVolumeL: number;
  acidMl: number;
  waterL: number;
}

export interface TimeFromRecipeResult {
  hours: number;
  dilutedVolumeL: number;
  doseRate: number;
}

export function computeTimeFromRecipe({
  correctedDrc,
  basketVolumeL,
  acidMl,
  waterL,
}: TimeFromRecipeInput): TimeFromRecipeResult {
  const dilutedVolumeL = basketVolumeL + waterL;
  const doseRate = dilutedVolumeL > 0 ? acidMl / dilutedVolumeL : 0;
  const hours = clamp(
    BASE_TIME -
      (doseRate - REFERENCE_DOSE) * 0.5 -
      (correctedDrc - 33) * 0.05,
    2,
    10,
  );
  return { hours, dilutedVolumeL, doseRate };
}

export interface RecipeFromTimeInput {
  correctedDrc: number;
  basketVolumeL: number;
  hours: number;
}

export interface RecipeFromTimeResult {
  waterL: number;
  acidMl: number;
  dilutedVolumeL: number;
}

export function computeRecipeFromTime({
  correctedDrc,
  basketVolumeL,
  hours,
}: RecipeFromTimeInput): RecipeFromTimeResult {
  const waterL =
    correctedDrc > TARGET_DRC
      ? Math.max(0, basketVolumeL * (correctedDrc / TARGET_DRC - 1))
      : 0;
  const dilutedVolumeL = basketVolumeL + waterL;

  const doseRate = clamp(
    REFERENCE_DOSE +
      2 * (BASE_TIME - hours - (correctedDrc - 33) * 0.05),
    0.5,
    12,
  );
  const acidMl = doseRate * dilutedVolumeL;

  return { waterL, acidMl, dilutedVolumeL };
}

export const GAP_DEFAULTS: GapReading = {
  gapCm: 6,
  basketVolumeL: 15,
};

export const RECIPE_DEFAULTS = {
  acidMl: 100,
  waterL: 20,
};

export const TIME_DEFAULT_HOURS = 6;

export const METRO_N_MODEL = {
  name: 'Metro_N',
  metric: 'R²',
  value: '0.84',
  note: 'Previously referenced result',
};
