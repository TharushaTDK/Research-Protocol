// ─── Research Component Data & Model Definitions ─────────────────────────────
// Research Component: "IoT-Based Acoustic Moisture Prediction System for Processed Rubber Sheets"
// Hardware Node: ESP32 + INMP441 I2S MEMS Microphone on fixed stand (controlled distance/orientation)
// Excitation: Standard wooden tapping tool on processed rubber sheet

export type DemoScenarioId = 'within_target' | 'above_target' | 'invalid_signal';

export interface DemoScenario {
  id: DemoScenarioId;
  name: string;
  badge: string;
  description: string;
  isValidSignal: boolean;
  predictedMoisture?: number; // Continuous numerical percentage
}

export const DEMO_SCENARIOS: Record<DemoScenarioId, DemoScenario> = {
  within_target: {
    id: 'within_target',
    name: 'Cured Sheet (Within Target)',
    badge: '11.8% • Target',
    description: 'Properly dried RSS sheet meeting target criteria (10.0% – 14.0%).',
    isValidSignal: true,
    predictedMoisture: 11.8,
  },
  above_target: {
    id: 'above_target',
    name: 'Under-cured Sheet (Above Target)',
    badge: '15.4% • Drying Req.',
    description: 'Moist sheet requiring additional smokehouse drying.',
    isValidSignal: true,
    predictedMoisture: 15.4,
  },
  invalid_signal: {
    id: 'invalid_signal',
    name: 'Poor Acoustic Tap (Invalid)',
    badge: 'Low Quality',
    description: 'Weak strike / excessive ambient noise requiring immediate retap.',
    isValidSignal: false,
  },
};

// ─── Configured Criterion ──────────────────────────────────────────────────
export const MOISTURE_CRITERION = {
  TARGET_MIN: 10.0,
  TARGET_MAX: 14.0,
  REFERENCE_LABEL: 'Target criterion (10.0% – 14.0%)',
};

export interface MoistureInterpretation {
  status: 'Within Target' | 'Above Target';
  isWithinTarget: boolean;
  themeColor: 'green' | 'amber';
  comparisonNote: string;
  recommendationTitle: string;
  recommendationBody: string;
  decisionSteps: {
    title: string;
    description: string;
  }[];
}

export function interpretMoistureResult(moisture: number): MoistureInterpretation {
  const isWithin = moisture >= MOISTURE_CRITERION.TARGET_MIN && moisture <= MOISTURE_CRITERION.TARGET_MAX;

  if (isWithin) {
    return {
      status: 'Within Target',
      isWithinTarget: true,
      themeColor: 'green',
      comparisonNote: 'Compared with the configured moisture criterion (Target: 10.0% – 14.0%)',
      recommendationTitle: 'Moisture level is within the configured target range.',
      recommendationBody: 'Sheet has reached the target moisture criterion. Ready for sorting, visual grading, and baling.',
      decisionSteps: [
        {
          title: 'Proceed to Visual Grading & Sorting',
          description: 'Sort sheets by cleanliness, color uniformity, and presence of blemishes or bubbles.',
        },
        {
          title: 'Safe for Baling & Storage',
          description: 'Store in a dry, ventilated storehouse or pack into standard export bales.',
        },
        {
          title: 'Use Valid Moisture for Market Transactions',
          description: 'Present this validated moisture assessment when negotiating with regional rubber buyers.',
        },
      ],
    };
  }

  // Above target (or mild excess / high moisture)
  return {
    status: 'Above Target',
    isWithinTarget: false,
    themeColor: 'amber',
    comparisonNote: 'Compared with the configured moisture criterion (Target: 10.0% – 14.0%)',
    recommendationTitle: 'Additional drying recommended',
    recommendationBody: 'Continue drying according to the adopted process, then retest the sheet.',
    decisionSteps: [
      {
        title: 'Continue Controlled Drying',
        description: 'Return sheet to the smokehouse middle rack to continue moisture evacuation without overheating.',
      },
      {
        title: 'Retest After Additional Drying',
        description: 'Perform another acoustic tap test after drying cycle to verify moisture has entered the target range.',
      },
      {
        title: 'Use Final Valid Result for Sale Decisions',
        description: 'Do not pack or finalize sale until a valid post-drying test confirms target moisture.',
      },
    ],
  };
}

// ─── Separate Downstream Economic / Market Price Range Model ────────────────
// Important: Price estimation is an optional downstream model requiring multiple
// independent variables (Rubber Grade, Market Location, Quantity, Date, Moisture Content).

export interface MarketLocation {
  id: string;
  name: string;
  basePriceLkr: number;
}

export const MARKETS: MarketLocation[] = [
  { id: 'colombo', name: 'Colombo', basePriceLkr: 335 },
  { id: 'gampaha', name: 'Gampaha', basePriceLkr: 330 },
  { id: 'kalutara', name: 'Kalutara', basePriceLkr: 325 },
];

export interface RubberGradeInfo {
  code: string;
  name: string;
  factor: number;
}

export const RUBBER_GRADES: RubberGradeInfo[] = [
  { code: 'RSS_1', name: 'RSS 1', factor: 1.0 },
  { code: 'RSS_2', name: 'RSS 2', factor: 0.94 },
  { code: 'RSS_3', name: 'RSS 3', factor: 0.88 },
];

export const QUANTITY_OPTIONS = [50, 100, 250] as const;
export type QuantityOption = (typeof QUANTITY_OPTIONS)[number];

export interface PriceEstimateResult {
  minPriceLkr: number;
  maxPriceLkr: number;
  minTotalLkr: number;
  maxTotalLkr: number;
  quantityKg: number;
  gradeLabel: string;
  marketName: string;
  dateString: string;
  moisturePercent: number;
  isAboveTarget: boolean;
  recommendation: string;
  disclaimer: string;
}

export function calculateEstimatedPriceRange(
  moisturePercent: number,
  marketId = 'colombo',
  gradeCode = 'RSS_1',
  quantityKg: QuantityOption = 100,
): PriceEstimateResult {
  const market = MARKETS.find((m) => m.id === marketId) ?? MARKETS[0];
  const grade = RUBBER_GRADES.find((g) => g.code === gradeCode) ?? RUBBER_GRADES[0];

  // Base price computation
  const baseGradePrice = market.basePriceLkr * grade.factor;

  // Moisture impact adjustment:
  // If moisture is above 14.0%, traders deduct for excess water weight & storage risk
  let moistureDeduction = 0;
  const isAboveTarget = moisturePercent > MOISTURE_CRITERION.TARGET_MAX;

  if (isAboveTarget) {
    const excess = moisturePercent - MOISTURE_CRITERION.TARGET_MAX;
    moistureDeduction = Math.round(excess * 10); // ~10 LKR deduction per excess %
  }

  const effectiveMid = Math.max(220, Math.round(baseGradePrice - moistureDeduction));
  const spread = 15; // standard +/- 15 LKR spread for 320-350 baseline
  const minPrice = effectiveMid - spread;
  const maxPrice = effectiveMid + spread;

  const minTotal = minPrice * quantityKg;
  const maxTotal = maxPrice * quantityKg;

  const recommendation = isAboveTarget
    ? 'Additional drying and retesting may improve sale readiness before negotiating.'
    : 'Moisture result is suitable for the configured target. Compare buyer offers before selling.';

  const now = new Date();
  const dateString = now.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return {
    minPriceLkr: minPrice,
    maxPriceLkr: maxPrice,
    minTotalLkr: minTotal,
    maxTotalLkr: maxTotal,
    quantityKg,
    gradeLabel: grade.name,
    marketName: market.name,
    dateString,
    moisturePercent,
    isAboveTarget,
    recommendation,
    disclaimer:
      'This is an estimated range, not a guaranteed selling price. Actual price may vary by buyer, grade, quantity, market conditions and date.',
  };
}
