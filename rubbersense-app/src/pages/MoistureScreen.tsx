import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Sparkles,
  ChevronRight,
  RotateCcw,
  TrendingUp,
  Info,
  CircleDot,
  Volume2,
  Calendar,
  MapPin,
  Tag,
  Scale,
  Lock,
  Loader2,
} from 'lucide-react';
import {
  DEMO_SCENARIOS,
  MARKETS,
  RUBBER_GRADES,
  QUANTITY_OPTIONS,
  interpretMoistureResult,
  calculateEstimatedPriceRange,
  type DemoScenarioId,
  type QuantityOption,
} from '../data/moisture';

type ScreenView =
  | 'home'              // Screen 1: Moisture Home / Device Connection
  | 'capture'           // Screen 2: Measurement / Capture Screen
  | 'invalid'           // Screen 3: Invalid Signal Result Screen
  | 'result'            // Screen 4: Valid Moisture Result Screen
  | 'decision_support'  // Screen 5: Separate Decision Support Page
  | 'price_setup'       // Screen 6: Price Estimate Setup Screen
  | 'price_loading'     // Screen 7: Realistic Price Estimation Loading State
  | 'price_estimate';   // Screen 8: Estimated Market Price Range Result Screen

type CaptureStage = 'idle' | 'striking' | 'capturing' | 'analyzing';

export default function MoistureScreen() {
  const navigate = useNavigate();

  // Navigation and active view
  const [view, setView] = useState<ScreenView>('home');

  // Selected evaluation scenario for interactive prototype demonstration
  const [scenarioId, setScenarioId] = useState<DemoScenarioId>('above_target');

  // Capture workflow state
  const [captureStage, setCaptureStage] = useState<CaptureStage>('idle');

  // Market price estimation user-selected inputs
  const [selectedGradeCode, setSelectedGradeCode] = useState('RSS_1');
  const [selectedMarketId, setSelectedMarketId] = useState('colombo');
  const [selectedQuantityKg, setSelectedQuantityKg] = useState<QuantityOption>(100);

  const scenario = DEMO_SCENARIOS[scenarioId];
  const activeMoisture = scenario.predictedMoisture ?? 12.6;
  const interpretation = interpretMoistureResult(activeMoisture);

  // Price estimate calculation
  const priceEstimate = calculateEstimatedPriceRange(
    activeMoisture,
    selectedMarketId,
    selectedGradeCode,
    selectedQuantityKg,
  );

  // Handle capture simulation
  useEffect(() => {
    let timer1: ReturnType<typeof setTimeout>;
    let timer2: ReturnType<typeof setTimeout>;
    let timer3: ReturnType<typeof setTimeout>;

    if (view === 'capture' && captureStage === 'striking') {
      // Step 1: Strike impact & sound propagation (600ms)
      timer1 = setTimeout(() => {
        setCaptureStage('capturing');
      }, 600);
    } else if (view === 'capture' && captureStage === 'capturing') {
      // Step 2: ESP32 + INMP441 internal acquisition (900ms)
      timer2 = setTimeout(() => {
        setCaptureStage('analyzing');
      }, 900);
    } else if (view === 'capture' && captureStage === 'analyzing') {
      // Step 3: Model 1 Quality Gate -> Model 2 Regression (900ms)
      timer3 = setTimeout(() => {
        setCaptureStage('idle');
        if (scenario.isValidSignal) {
          setView('result');
        } else {
          setView('invalid');
        }
      }, 900);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [view, captureStage, scenario.isValidSignal]);

  // Handle price estimation loading transition (1.4s)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (view === 'price_loading') {
      timer = setTimeout(() => {
        setView('price_estimate');
      }, 1400);
    }
    return () => clearTimeout(timer);
  }, [view]);

  const handleStartCapture = () => {
    setCaptureStage('striking');
    setView('capture');
  };

  const handleCancelCapture = () => {
    setCaptureStage('idle');
    setView('home');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VECTOR ILLUSTRATION: Processed Sheet + Wooden Tool + Microphone Stand Rig
  // ═══════════════════════════════════════════════════════════════════════════
  const SetupIllustration = ({ isCapturing = false }: { isCapturing?: boolean }) => (
    <div className="relative mx-auto flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-brand-50/70 via-emerald-50/40 to-brand-100/40 p-3 shadow-inner">
      {/* Background Grid & Alignment Marks */}
      <svg className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#15803d" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Tapping Position Target Circle */}
      <div className="absolute bottom-9 left-1/2 h-20 w-36 -translate-x-1/2 rounded-full border border-dashed border-brand-400/60" />

      {/* 1. Processed Rubber Sheet (Ribbed Smoked Sheet) */}
      <div className="relative z-10 -mt-2 flex h-24 w-44 rotate-[-3deg] flex-col justify-between rounded-lg border border-amber-800/40 bg-gradient-to-br from-amber-700/85 via-amber-800/90 to-amber-950 p-2 shadow-md">
        {/* Diamond / Ribbed Texture lines */}
        <div className="absolute inset-0 flex flex-col justify-evenly opacity-30">
          <div className="h-[1px] w-full bg-amber-200" />
          <div className="h-[1px] w-full bg-amber-200" />
          <div className="h-[1px] w-full bg-amber-200" />
          <div className="h-[1px] w-full bg-amber-200" />
          <div className="h-[1px] w-full bg-amber-200" />
        </div>
        <div className="relative z-10 flex items-center justify-between text-[8.5px] font-bold text-amber-200/90">
          <span>RSS SHEET</span>
          <span className="rounded bg-black/30 px-1 py-0.5 text-[7px] text-amber-100">TEST ZONE</span>
        </div>
        <div className="relative z-10 flex justify-center">
          {/* Target Impact Point */}
          <div className="relative flex h-5 w-5 items-center justify-center rounded-full border border-amber-300 bg-amber-400/30">
            <div className="h-2 w-2 rounded-full bg-amber-200" />
            {isCapturing && (
              <span className="absolute h-10 w-10 animate-ping rounded-full border border-amber-300 opacity-60" />
            )}
          </div>
        </div>
        <div className="relative z-10 text-right text-[7px] text-amber-300/70">Marked Position</div>
      </div>

      {/* 2. Standard Wooden Tapping Tool */}
      <div
        className={`absolute z-20 transition-all duration-500 ${
          isCapturing
            ? 'bottom-20 left-[48%] -translate-x-1/2 rotate-[12deg] scale-105'
            : 'bottom-28 left-[40%] -translate-x-1/2 rotate-[-25deg]'
        }`}
      >
        {/* Wooden striker head */}
        <div className="relative flex h-7 w-5 flex-col items-center rounded-sm bg-gradient-to-b from-amber-800 to-amber-900 shadow-md">
          {/* Wooden handle */}
          <div className="absolute -top-12 h-14 w-2 rounded-t-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 shadow-sm" />
          <span className="mt-1 text-[5.5px] font-bold uppercase tracking-tighter text-amber-200">
            WOOD
          </span>
        </div>
      </div>

      {/* 3. Fixed Microphone Stand with ESP32 + INMP441 MEMS Node */}
      <div className="absolute right-7 top-4 z-20 flex flex-col items-center">
        {/* Stand Boom Arm */}
        <div className="flex flex-col items-center">
          {/* ESP32 + INMP441 Acoustic Head */}
          <div className="relative flex items-center gap-1 rounded-md border border-brand-700 bg-brand-900 px-1.5 py-1 text-white shadow-lg">
            <Radio className="h-3 w-3 text-brand-300" />
            <div className="flex flex-col">
              <span className="text-[7.5px] font-bold leading-none text-brand-100">INMP441</span>
              <span className="text-[6px] font-medium leading-none text-brand-300">I2S MEMS</span>
            </div>
            {/* Active Green LED */}
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400 shadow-[0_0_6px_#4ade80]" />
          </div>

          {/* Stand Vertical Rod */}
          <div className="h-16 w-1.5 bg-gradient-to-r from-neutral-400 via-neutral-300 to-neutral-500 shadow-sm" />
          {/* Stand Heavy Base */}
          <div className="h-2 w-10 rounded-full bg-neutral-700 shadow" />
          <span className="mt-0.5 text-[6.5px] font-semibold text-neutral-500">Fixed Stand (5cm)</span>
        </div>
      </div>

      {/* Acoustic waves representation during capturing */}
      {isCapturing && (
        <div className="pointer-events-none absolute right-14 top-10 flex items-center justify-center">
          <div className="h-16 w-16 animate-ping rounded-full border border-brand-500/40" />
          <div className="h-24 w-24 animate-ping rounded-full border border-brand-400/20 [animation-delay:200ms]" />
        </div>
      )}
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN 1: MOISTURE HOME / DEVICE CONNECTION
  // ═══════════════════════════════════════════════════════════════════════════
  if (view === 'home') {
    return (
      <div className="no-scrollbar flex h-full w-full flex-col overflow-y-auto bg-brand-50">
        {/* Header */}
        <div className="sticky top-0 z-30 flex items-center gap-3 bg-white px-5 pb-3.5 pt-10 shadow-sm">
          <button
            type="button"
            onClick={() => navigate('/home')}
            aria-label="Back to Dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition active:scale-95"
          >
            <ArrowLeft className="h-4.5 w-4.5" strokeWidth={2.2} />
          </button>
          <div>
            <h1 className="text-[16px] font-bold leading-tight text-brand-900">Moisture Check</h1>
            <p className="text-[11px] font-medium text-neutral-400">
              Acoustic moisture assessment for processed rubber sheets
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-3.5 px-4.5 pb-6 pt-3.5">
          {/* Prototype Evaluation Demo Path Selector */}
          <div className="rounded-2xl border border-brand-200/80 bg-white p-3 shadow-xs">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-700">
                <Sparkles className="h-3.5 w-3.5 text-brand-500" />
                Demo Test Scenario
              </span>
              <span className="text-[10px] font-medium text-neutral-400">Select research path</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(Object.keys(DEMO_SCENARIOS) as DemoScenarioId[]).map((id) => {
                const s = DEMO_SCENARIOS[id];
                const active = scenarioId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setScenarioId(id)}
                    className={`flex flex-col items-center rounded-xl p-2 text-center transition-all ${
                      active
                        ? 'border-2 border-brand-600 bg-brand-50/90 text-brand-900 shadow-xs'
                        : 'border border-neutral-100 bg-neutral-50/70 text-neutral-600 hover:bg-neutral-100/70'
                    }`}
                  >
                    <span className="text-[10.5px] font-bold leading-tight">
                      {id === 'within_target' ? 'Within Target' : id === 'above_target' ? 'Above Target' : 'Invalid Tap'}
                    </span>
                    <span
                      className={`mt-1 rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
                        id === 'within_target'
                          ? 'bg-emerald-100 text-emerald-800'
                          : id === 'above_target'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {s.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Device Status Card */}
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <Radio className="h-5 w-5" strokeWidth={2} />
                  <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-500" />
                  </span>
                </div>
                <div>
                  <h2 className="text-[14px] font-bold text-brand-900">RubberSense Acoustic Node</h2>
                  <p className="text-[11px] font-medium text-neutral-400">ESP32 + INMP441</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10.5px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                Connected
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-brand-50/70 px-3 py-2 text-[11.5px] font-semibold text-brand-800">
              <CircleDot className="h-3.5 w-3.5 text-brand-600" />
              <span>Ready to capture a tap</span>
            </div>
          </div>

          {/* Visual Setup Instruction Card */}
          <div className="overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            <p className="mb-2.5 text-[11.5px] font-bold uppercase tracking-wider text-brand-600">
              Acoustic Testing Rig Setup
            </p>
            
            <SetupIllustration isCapturing={false} />

            <p className="mt-3 text-center text-[12px] font-medium leading-relaxed text-neutral-600">
              Place the sheet in the marked position and tap once using the wooden tool.
            </p>
          </div>

          {/* Compact Setup Checklist */}
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-brand-700">
              Ready Checklist
            </h3>
            <div className="mt-2.5 space-y-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-600" strokeWidth={2.4} />
                <span className="text-[12px] font-medium text-neutral-700">Acoustic node connected</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-600" strokeWidth={2.4} />
                <span className="text-[12px] font-medium text-neutral-700">Sheet positioned correctly</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-600" strokeWidth={2.4} />
                <span className="text-[12px] font-medium text-neutral-700">Use the standard wooden tool</span>
              </div>
            </div>
          </div>

          {/* Main Primary Button */}
          <button
            type="button"
            onClick={handleStartCapture}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-[14px] font-semibold text-white shadow-[0_4px_14px_rgba(22,163,74,0.35)] transition active:scale-[0.98]"
          >
            <span>Start Moisture Check</span>
            <ChevronRight className="h-4.5 w-4.5" strokeWidth={2.4} />
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN 2: MEASUREMENT / CAPTURE SCREEN
  // ═══════════════════════════════════════════════════════════════════════════
  if (view === 'capture') {
    const isProcessing = captureStage === 'capturing' || captureStage === 'analyzing';

    return (
      <div className="no-scrollbar flex h-full w-full flex-col overflow-y-auto bg-brand-50">
        {/* Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between bg-white px-5 pb-3.5 pt-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancelCapture}
              aria-label="Cancel Capture"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition active:scale-95"
            >
              <ArrowLeft className="h-4.5 w-4.5" strokeWidth={2.2} />
            </button>
            <div>
              <h1 className="text-[16px] font-bold leading-tight text-brand-900">Capture Acoustic Tap</h1>
              <p className="text-[11px] font-medium text-neutral-400">Acoustic sensing in progress</p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between px-4.5 pb-6 pt-4">
          <div className="space-y-4">
            {/* Rig Illustration with Dynamic Capture Animation */}
            <div className="overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
              <SetupIllustration isCapturing={isProcessing || captureStage === 'striking'} />

              {/* Instructions */}
              <div className="mt-4 text-center">
                <h2 className="text-[15px] font-bold text-brand-900">
                  Tap the sheet once with the wooden tool.
                </h2>
                <p className="mt-1 text-[12px] font-medium text-neutral-500">
                  Keep the sheet and microphone in the marked position.
                </p>
              </div>
            </div>

            {/* Listening / Recording Status Box */}
            <div className="rounded-2xl border border-brand-200 bg-white p-4 text-center shadow-sm">
              {captureStage === 'idle' && (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    <Volume2 className="h-6 w-6" />
                  </div>
                  <p className="text-[13px] font-bold text-brand-900">Ready for Tap</p>
                  <p className="text-[11.5px] text-neutral-500">
                    Perform a single perpendicular strike on the marked rubber sheet.
                  </p>
                </div>
              )}

              {captureStage === 'striking' && (
                <div className="flex flex-col items-center gap-2 py-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 shadow-inner">
                    <Volume2 className="h-6 w-6 animate-bounce" />
                  </div>
                  <p className="text-[13px] font-bold text-brand-900">Acoustic Strike Detected</p>
                  <p className="text-[11.5px] text-neutral-500">Receiving acoustic sound wave...</p>
                </div>
              )}

              {captureStage === 'capturing' && (
                <div className="flex flex-col items-center gap-2.5 py-1">
                  <div className="relative flex h-12 w-12 items-center justify-center">
                    <span className="absolute h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white">
                      <Radio className="h-5 w-5 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[13.5px] font-bold text-brand-900">Capturing acoustic response…</p>
                    <p className="text-[11px] text-neutral-400">ESP32 + INMP441 internal processing</p>
                  </div>
                </div>
              )}

              {captureStage === 'analyzing' && (
                <div className="flex flex-col items-center gap-2.5 py-1">
                  <div className="relative flex h-12 w-12 items-center justify-center">
                    <div className="h-9 w-9 animate-spin rounded-full border-3 border-brand-200 border-t-brand-600" />
                  </div>
                  <div>
                    <p className="text-[13.5px] font-bold text-brand-900">Analysing measurement quality…</p>
                    <p className="text-[11px] text-neutral-400">Signal-quality verification</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 space-y-2">
            {captureStage === 'idle' && (
              <button
                type="button"
                onClick={() => setCaptureStage('striking')}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-[14px] font-semibold text-white shadow-sm transition active:scale-[0.98]"
              >
                <span>Simulate Wooden Tap</span>
                <Volume2 className="h-4.5 w-4.5" />
              </button>
            )}

            <button
              type="button"
              onClick={handleCancelCapture}
              className="w-full rounded-full border border-brand-200 bg-white py-3 text-[13px] font-semibold text-brand-800 shadow-xs transition active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN 3: INVALID SIGNAL RESULT SCREEN
  // ═══════════════════════════════════════════════════════════════════════════
  if (view === 'invalid') {
    return (
      <div className="no-scrollbar flex h-full w-full flex-col overflow-y-auto bg-brand-50">
        {/* Header */}
        <div className="sticky top-0 z-30 flex items-center gap-3 bg-white px-5 pb-3.5 pt-10 shadow-sm">
          <button
            type="button"
            onClick={() => setView('home')}
            aria-label="Back to Moisture Check"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition active:scale-95"
          >
            <ArrowLeft className="h-4.5 w-4.5" strokeWidth={2.2} />
          </button>
          <div>
            <h1 className="text-[16px] font-bold leading-tight text-brand-900">
              Measurement Needs Retrying
            </h1>
            <p className="text-[11px] font-medium text-neutral-400">Acoustic quality assessment</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between px-4.5 pb-6 pt-4">
          <div className="space-y-4">
            {/* Amber Warning State Card */}
            <div className="rounded-3xl border border-amber-200 bg-gradient-to-b from-amber-50/90 to-amber-100/40 p-5 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-inner">
                <AlertTriangle className="h-7 w-7" strokeWidth={2.2} />
              </div>
              <h2 className="mt-3 text-[17px] font-bold text-amber-950">Signal quality poor</h2>
              <p className="mt-1.5 text-[12.5px] font-medium leading-relaxed text-amber-800">
                A reliable moisture result could not be produced from this tap.
              </p>
            </div>

            {/* Guidance Card */}
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-brand-800">
                Retry Guidance
              </h3>
              <div className="mt-3 space-y-2.5 text-[12px] text-neutral-700">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[11px] font-bold text-amber-800">
                    1
                  </span>
                  <p className="leading-snug">Check that the microphone stand is in position.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[11px] font-bold text-amber-800">
                    2
                  </span>
                  <p className="leading-snug">Tap the sheet once using the wooden tool.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[11px] font-bold text-amber-800">
                    3
                  </span>
                  <p className="leading-snug">Avoid background noise.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={handleStartCapture}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-600 py-3.5 text-[14px] font-semibold text-white shadow-[0_4px_14px_rgba(217,119,6,0.3)] transition active:scale-[0.98]"
            >
              <RotateCcw className="h-4.5 w-4.5" strokeWidth={2.4} />
              <span>Tap Again</span>
            </button>
            <button
              type="button"
              onClick={() => setView('home')}
              className="w-full rounded-full border border-brand-200 bg-white py-3 text-[13px] font-semibold text-brand-800 shadow-xs transition active:scale-[0.98]"
            >
              Back to Moisture Check
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN 4: VALID MOISTURE RESULT SCREEN
  // ═══════════════════════════════════════════════════════════════════════════
  if (view === 'result') {
    return (
      <div className="no-scrollbar flex h-full w-full flex-col overflow-y-auto bg-brand-50">
        {/* Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between bg-white px-5 pb-3.5 pt-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setView('home')}
              aria-label="Back to Moisture Check"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition active:scale-95"
            >
              <ArrowLeft className="h-4.5 w-4.5" strokeWidth={2.2} />
            </button>
            <div>
              <h1 className="text-[16px] font-bold leading-tight text-brand-900">Moisture Result</h1>
              <p className="text-[11px] font-medium text-neutral-400">Acoustic assessment complete</p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-3.5 px-4.5 pb-6 pt-3.5">
          {/* Signal Quality Badge */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.5} />
              Signal Quality: Valid
            </span>
            <span className="text-[10.5px] font-medium text-neutral-400">Single Tap Assessment</span>
          </div>

          {/* Main Large Result Card */}
          <div className="rounded-3xl bg-white p-5 shadow-[0_12px_30px_-10px_rgba(15,61,36,0.18)] ring-1 ring-brand-100">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-bold uppercase tracking-wider text-brand-600">
                Predicted Moisture
              </p>
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-brand-700">
                Acoustic Regression
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-[44px] font-black leading-none tracking-tight text-brand-950">
                {activeMoisture.toFixed(1)}
              </span>
              <span className="text-[26px] font-bold text-brand-700">%</span>
            </div>

            <p className="mt-2 text-[11.5px] font-medium text-neutral-500">
              Estimated from a valid acoustic measurement
            </p>
            <p className="mt-1 text-[10px] italic text-neutral-400">
              * Prototype demonstration value
            </p>
          </div>

          {/* Derived Status Card */}
          <div
            className={`rounded-2xl p-4 shadow-sm ring-1 ${
              interpretation.isWithinTarget
                ? 'bg-emerald-50/80 ring-emerald-200 text-emerald-950'
                : 'bg-amber-50/90 ring-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-70">
                Interpretation Status
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                  interpretation.isWithinTarget
                    ? 'bg-emerald-200 text-emerald-900'
                    : 'bg-amber-200 text-amber-900'
                }`}
              >
                {interpretation.status}
              </span>
            </div>
            <p className="mt-2 text-[13.5px] font-bold">{interpretation.status}</p>
            <p className="mt-1 text-[11.5px] leading-relaxed opacity-80">
              {interpretation.comparisonNote}
            </p>
          </div>

          {/* Recommendation Card */}
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-brand-700">
              Recommendation
            </h3>
            <p className="mt-1.5 text-[13.5px] font-bold text-brand-900">
              {interpretation.recommendationTitle}
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-neutral-600">
              {interpretation.recommendationBody}
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-brand-50/70 p-2.5 text-[11px] text-brand-800">
              <Info className="h-4 w-4 shrink-0 text-brand-600" />
              <span>This result supports assessment and should be interpreted using the adopted drying criterion.</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleStartCapture}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-[14px] font-semibold text-white shadow-[0_4px_14px_rgba(22,163,74,0.35)] transition active:scale-[0.98]"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={2.4} />
              <span>Check Another Sheet</span>
            </button>
            <button
              type="button"
              onClick={() => setView('decision_support')}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-brand-300 bg-white py-3.5 text-[13.5px] font-semibold text-brand-800 shadow-xs transition active:scale-[0.98]"
            >
              <span>View Decision Support</span>
              <ChevronRight className="h-4.5 w-4.5" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN 5: SEPARATE DECISION SUPPORT PAGE
  // ═══════════════════════════════════════════════════════════════════════════
  if (view === 'decision_support') {
    return (
      <div className="no-scrollbar flex h-full w-full flex-col overflow-y-auto bg-brand-50">
        {/* Header */}
        <div className="sticky top-0 z-30 flex items-center gap-3 bg-white px-5 pb-3.5 pt-10 shadow-sm">
          <button
            type="button"
            onClick={() => setView('result')}
            aria-label="Back to Result"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition active:scale-95"
          >
            <ArrowLeft className="h-4.5 w-4.5" strokeWidth={2.2} />
          </button>
          <div>
            <h1 className="text-[16px] font-bold leading-tight text-brand-900">
              Farmer Decision Support
            </h1>
            <p className="text-[11px] font-medium text-neutral-400">
              Operational next steps & economics
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-3.5 px-4.5 pb-6 pt-3.5">
          {/* Compact Summary Card */}
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            <h2 className="text-[11.5px] font-bold uppercase tracking-wider text-brand-600">
              Assessment Summary
            </h2>
            <div className="mt-2.5 grid grid-cols-2 gap-2 border-b border-brand-100 pb-3">
              <div>
                <p className="text-[10.5px] text-neutral-400">Predicted Moisture</p>
                <p className="text-[16px] font-bold text-brand-900">{activeMoisture.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-[10.5px] text-neutral-400">Status</p>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    interpretation.isWithinTarget
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {interpretation.status}
                </span>
              </div>
            </div>
            <div className="mt-2.5">
              <p className="text-[10.5px] text-neutral-400">Recommended Action</p>
              <p className="mt-0.5 text-[12.5px] font-bold text-brand-900">
                {interpretation.recommendationTitle}
              </p>
            </div>
          </div>

          {/* Next Best Action Section */}
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-brand-800">
              Next Best Action
            </h3>
            <div className="mt-3 space-y-3">
              {interpretation.decisionSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[11.5px] font-bold text-brand-800">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-[12.5px] font-bold text-brand-900">{step.title}</h4>
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-neutral-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Separate Optional Market Price Range Section/Card */}
          <div className="rounded-2xl border border-brand-200/90 bg-gradient-to-br from-white via-brand-50/40 to-emerald-50/50 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-brand-950">Market Price Range</h3>
              <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[9.5px] font-bold uppercase text-brand-800">
                Optional Model
              </span>
            </div>
            
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-neutral-600">
              Available only when the price model has been independently validated with market data.
            </p>

            <div className="mt-2.5 rounded-xl bg-white/90 p-2.5 text-[11px] text-neutral-500 ring-1 ring-brand-100">
              <span className="font-semibold text-neutral-700">Note:</span> Price estimation uses moisture together with relevant available market variables (grade, quantity, location, date, and market channel).
            </div>

            {/* Working View Price Estimate Button */}
            <div className="mt-3.5">
              <button
                type="button"
                onClick={() => setView('price_setup')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 py-3 text-[13px] font-semibold text-white shadow-sm transition active:scale-[0.98]"
              >
                <TrendingUp className="h-4 w-4" />
                <span>View Price Estimate</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleStartCapture}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-[13.5px] font-semibold text-white shadow-sm transition active:scale-[0.98]"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
              <span>Check Another Sheet</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN 6: PRICE ESTIMATE SETUP SCREEN
  // ═══════════════════════════════════════════════════════════════════════════
  if (view === 'price_setup') {
    const todayFormatted = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return (
      <div className="no-scrollbar flex h-full w-full flex-col overflow-y-auto bg-brand-50">
        {/* Header */}
        <div className="sticky top-0 z-30 flex items-center gap-3 bg-white px-5 pb-3.5 pt-10 shadow-sm">
          <button
            type="button"
            onClick={() => setView('decision_support')}
            aria-label="Back to Decision Support"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition active:scale-95"
          >
            <ArrowLeft className="h-4.5 w-4.5" strokeWidth={2.2} />
          </button>
          <div>
            <h1 className="text-[16px] font-bold leading-tight text-brand-900">
              Price Estimate Setup
            </h1>
            <p className="text-[11px] font-medium text-neutral-400">
              Select market context variables
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-3.5 px-4.5 pb-6 pt-3.5">
          {/* Automatic Carry-over Context Card (Read-only Moisture & Date) */}
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
              Validated Sheet Parameters
            </h2>
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <div className="flex flex-col rounded-xl bg-brand-50/80 p-2.5 ring-1 ring-brand-100">
                <div className="flex items-center justify-between text-[10px] text-neutral-500">
                  <span>Predicted Moisture</span>
                  <Lock className="h-3 w-3 text-brand-600" />
                </div>
                <p className="mt-1 text-[16px] font-bold text-brand-900">
                  {activeMoisture.toFixed(1)}%
                </p>
                <span className="text-[9.5px] font-medium text-brand-700">From Acoustic Node</span>
              </div>

              <div className="flex flex-col rounded-xl bg-brand-50/80 p-2.5 ring-1 ring-brand-100">
                <div className="flex items-center justify-between text-[10px] text-neutral-500">
                  <span>Market Date</span>
                  <Calendar className="h-3 w-3 text-brand-600" />
                </div>
                <p className="mt-1 text-[14px] font-bold text-brand-900">
                  {todayFormatted}
                </p>
                <span className="text-[9.5px] font-medium text-brand-700">Today&apos;s Benchmark</span>
              </div>
            </div>
          </div>

          {/* Selectable Inputs */}
          <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            {/* 1. Rubber Type / Grade */}
            <div>
              <label className="flex items-center gap-1.5 text-[11.5px] font-bold text-brand-900">
                <Tag className="h-3.5 w-3.5 text-brand-600" />
                Rubber Type / Grade:
              </label>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {RUBBER_GRADES.map((g) => {
                  const active = selectedGradeCode === g.code;
                  return (
                    <button
                      key={g.code}
                      type="button"
                      onClick={() => setSelectedGradeCode(g.code)}
                      className={`rounded-xl py-2 text-center text-[11.5px] font-bold transition-all ${
                        active
                          ? 'border-2 border-brand-600 bg-brand-50 text-brand-900 shadow-xs'
                          : 'border border-neutral-200 bg-neutral-50/60 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {g.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Market / Location */}
            <div className="border-t border-brand-50 pt-3">
              <label className="flex items-center gap-1.5 text-[11.5px] font-bold text-brand-900">
                <MapPin className="h-3.5 w-3.5 text-brand-600" />
                Market / Location:
              </label>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {MARKETS.map((m) => {
                  const active = selectedMarketId === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMarketId(m.id)}
                      className={`rounded-xl py-2 text-center text-[11.5px] font-bold transition-all ${
                        active
                          ? 'border-2 border-brand-600 bg-brand-50 text-brand-900 shadow-xs'
                          : 'border border-neutral-200 bg-neutral-50/60 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {m.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Quantity */}
            <div className="border-t border-brand-50 pt-3">
              <label className="flex items-center gap-1.5 text-[11.5px] font-bold text-brand-900">
                <Scale className="h-3.5 w-3.5 text-brand-600" />
                Batch Quantity:
              </label>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {QUANTITY_OPTIONS.map((q) => {
                  const active = selectedQuantityKg === q;
                  return (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setSelectedQuantityKg(q)}
                      className={`rounded-xl py-2 text-center text-[11.5px] font-bold transition-all ${
                        active
                          ? 'border-2 border-brand-600 bg-brand-50 text-brand-900 shadow-xs'
                          : 'border border-neutral-200 bg-neutral-50/60 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {q} kg
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Research Clarification Note */}
          <div className="rounded-xl border border-brand-200 bg-brand-50/70 p-3 text-[11px] leading-relaxed text-brand-800">
            <span className="font-semibold text-brand-900">Note: </span>
            Price estimation considers moisture together with available market and product information.
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => setView('price_loading')}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-[14px] font-semibold text-white shadow-[0_4px_14px_rgba(22,163,74,0.35)] transition active:scale-[0.98]"
          >
            <TrendingUp className="h-4.5 w-4.5" />
            <span>Estimate Price Range</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN 7: REALISTIC PRICE ESTIMATION LOADING STATE
  // ═══════════════════════════════════════════════════════════════════════════
  if (view === 'price_loading') {
    return (
      <div className="no-scrollbar flex h-full w-full flex-col items-center justify-center bg-brand-50 px-6 text-center">
        <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm ring-1 ring-brand-100">
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
            <span className="absolute h-full w-full animate-ping rounded-full bg-brand-400 opacity-30" />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Loader2 className="h-7 w-7 animate-spin" />
            </div>
          </div>

          <h2 className="mt-4 text-[16px] font-bold text-brand-900">
            Estimating market price range…
          </h2>
          <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-neutral-500">
            Combining moisture, grade, quantity, market and date.
          </p>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10.5px] font-semibold text-brand-700">
            <CircleDot className="h-3 w-3 animate-pulse text-brand-500" />
            <span>Evaluating multi-variable downstream model</span>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN 8: ESTIMATED MARKET PRICE RANGE RESULT SCREEN
  // ═══════════════════════════════════════════════════════════════════════════
  if (view === 'price_estimate') {
    return (
      <div className="no-scrollbar flex h-full w-full flex-col overflow-y-auto bg-brand-50">
        {/* Header */}
        <div className="sticky top-0 z-30 flex items-center gap-3 bg-white px-5 pb-3.5 pt-10 shadow-sm">
          <button
            type="button"
            onClick={() => setView('decision_support')}
            aria-label="Back to Decision Support"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition active:scale-95"
          >
            <ArrowLeft className="h-4.5 w-4.5" strokeWidth={2.2} />
          </button>
          <div>
            <h1 className="text-[16px] font-bold leading-tight text-brand-900">
              Estimated Market Price Range
            </h1>
            <p className="text-[11px] font-medium text-neutral-400">
              Downstream multi-variable valuation
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-3.5 px-4.5 pb-6 pt-3.5">
          {/* Main Price Range Hero Card */}
          <div className="rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-emerald-950 p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-200">
                Estimated Price Range
              </span>
              <span className="rounded-full bg-emerald-400/25 px-2 py-0.5 text-[9px] font-bold text-emerald-200">
                Market model available
              </span>
            </div>

            {/* Price Per KG */}
            <div className="mt-3">
              <p className="text-[28px] font-black tracking-tight text-white">
                LKR {priceEstimate.minPriceLkr} – {priceEstimate.maxPriceLkr}
              </p>
              <p className="text-[12px] font-semibold text-brand-200">per kg</p>
            </div>

            {/* Total For Selected Batch Quantity */}
            <div className="mt-3 rounded-xl bg-white/10 p-2.5 text-[11.5px] font-semibold text-brand-100 backdrop-blur-xs">
              Estimated total for {priceEstimate.quantityKg} kg: <br />
              <span className="text-[13.5px] font-bold text-white">
                LKR {priceEstimate.minTotalLkr.toLocaleString()} – {priceEstimate.maxTotalLkr.toLocaleString()}
              </span>
            </div>

            <div className="mt-2 text-right text-[9px] italic text-brand-300/80">
              * Prototype estimate based on benchmark market data
            </div>
          </div>

          {/* Compact Context Chips Card */}
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
              Selected Evaluation Context
            </h2>
            <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 rounded-xl bg-brand-50 p-2 text-brand-900">
                <CircleDot className="h-3.5 w-3.5 text-brand-600" />
                <span>Moisture: <strong>{activeMoisture.toFixed(1)}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-brand-50 p-2 text-brand-900">
                <Tag className="h-3.5 w-3.5 text-brand-600" />
                <span>Grade: <strong>{priceEstimate.gradeLabel}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-brand-50 p-2 text-brand-900">
                <MapPin className="h-3.5 w-3.5 text-brand-600" />
                <span>Market: <strong>{priceEstimate.marketName}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-brand-50 p-2 text-brand-900">
                <Scale className="h-3.5 w-3.5 text-brand-600" />
                <span>Quantity: <strong>{priceEstimate.quantityKg} kg</strong></span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5 rounded-xl bg-brand-50/60 px-2 py-1.5 text-[10.5px] text-neutral-600">
              <Calendar className="h-3.5 w-3.5 text-brand-600" />
              <span>Date: <strong>{priceEstimate.dateString}</strong></span>
            </div>
          </div>

          {/* Recommendation Card */}
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            <h3 className="text-[11.5px] font-bold uppercase tracking-wider text-brand-700">
              Sale Recommendation
            </h3>
            <p className="mt-1.5 text-[12px] leading-relaxed text-neutral-700">
              {priceEstimate.recommendation}
            </p>
          </div>

          {/* Clear Disclaimer */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-3.5 text-[11px] leading-relaxed text-neutral-600">
            <span className="font-bold text-neutral-800">Disclaimer: </span>
            {priceEstimate.disclaimer}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => setView('decision_support')}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-[13.5px] font-semibold text-white shadow-sm transition active:scale-[0.98]"
            >
              <span>Back to Decision Support</span>
            </button>
            <button
              type="button"
              onClick={handleStartCapture}
              className="w-full rounded-full border border-brand-200 bg-white py-3 text-[13px] font-semibold text-brand-800 shadow-xs transition active:scale-[0.98]"
            >
              Check Another Sheet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
