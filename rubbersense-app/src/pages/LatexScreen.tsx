import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Ruler,
  Beaker,
  Sparkles,
  Loader2,
  Pencil,
  FlaskConical,
  Info,
  Timer,
  Droplets,
  TestTube,
  Camera,
  CheckCircle2,
  RotateCcw,
  Plus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  computeDrcFromGap,
  computeTimeFromRecipe,
  computeRecipeFromTime,
  GAP_DEFAULTS,
  RECIPE_DEFAULTS,
  TIME_DEFAULT_HOURS,
  METRO_N_MODEL,
} from '../data/latex';
import { analyzeMixture, MIXTURE_TONE_STYLES, type MixtureVerdict } from '../data/mixture';
import { analyzeImageFile, delay } from '../lib/analyzeImage';

type Stage = 'input' | 'loading' | 'result';
type Mode = 'time' | 'recipe' | null;
type MixtureStage = 'closed' | 'picking' | 'loading' | 'result';

const MIN_PHOTOS = 3;

interface MixturePhoto {
  url: string;
  file: File;
}

interface SliderFieldProps {
  icon: LucideIcon;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}

function SliderField({
  icon: Icon,
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: SliderFieldProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-brand-500" strokeWidth={2} />
          <span className="text-[12.5px] font-semibold text-brand-900">
            {label}
          </span>
        </div>
        <span className="text-[13px] font-bold text-brand-700">
          {value}
          <span className="ml-0.5 text-[11px] font-medium text-neutral-400">
            {unit}
          </span>
        </span>
      </div>
      <input
        type="range"
        className="brand-slider mt-2.5"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, var(--color-brand-500) ${pct}%, var(--color-brand-100) ${pct}%)`,
        }}
      />
      <div className="mt-1 flex justify-between text-[10px] text-neutral-300">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}

export default function LatexScreen() {
  const navigate = useNavigate();

  const [stage, setStage] = useState<Stage>('input');
  const [mode, setMode] = useState<Mode>(null);

  const [gapCm, setGapCm] = useState(GAP_DEFAULTS.gapCm);
  const [basketVolumeL, setBasketVolumeL] = useState(
    GAP_DEFAULTS.basketVolumeL,
  );
  const [correctedDrc, setCorrectedDrc] = useState(0);

  const [acidMl, setAcidMl] = useState(RECIPE_DEFAULTS.acidMl);
  const [waterL, setWaterL] = useState(RECIPE_DEFAULTS.waterL);
  const [hours, setHours] = useState(TIME_DEFAULT_HOURS);

  const [mixtureStage, setMixtureStage] = useState<MixtureStage>('closed');
  const [photos, setPhotos] = useState<(MixturePhoto | null)[]>(
    Array(MIN_PHOTOS).fill(null),
  );
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [verdict, setVerdict] = useState<MixtureVerdict | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const timeoutRef = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  // Always mirrors the latest `photos` so the unmount cleanup below can
  // revoke whatever is current without a stale closure.
  const photosRef = useRef(photos);
  photosRef.current = photos;
  useEffect(
    () => () => {
      photosRef.current.forEach((p) => p && URL.revokeObjectURL(p.url));
    },
    [],
  );

  const filledCount = photos.filter(Boolean).length;
  const allPhotosReady = filledCount >= MIN_PHOTOS;

  function handlePredictDrc() {
    setStage('loading');
    setMode(null);
    timeoutRef.current = window.setTimeout(() => {
      setCorrectedDrc(computeDrcFromGap({ gapCm, basketVolumeL }));
      setStage('result');
    }, 1800);
  }

  function openSlot(index: number) {
    setActiveSlot(index);
    fileInputRef.current?.click();
  }

  function handlePhotoSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file next time
    if (!file || activeSlot === null) return;

    const url = URL.createObjectURL(file);
    setPhotos((prev) => {
      const next = [...prev];
      const old = next[activeSlot];
      if (old) URL.revokeObjectURL(old.url);
      next[activeSlot] = { url, file };
      return next;
    });
    setActiveSlot(null);
  }

  async function handleAnalyzeMixture() {
    const ready = photos.filter((p): p is MixturePhoto => p !== null);
    if (ready.length < MIN_PHOTOS) return;

    setMixtureStage('loading');
    const [statsList] = await Promise.all([
      Promise.all(ready.map((p) => analyzeImageFile(p.file))),
      delay(1800),
    ]);
    const avgBrightness =
      statsList.reduce((a, s) => a + s.avgBrightness, 0) / statsList.length;
    const avgStdDev =
      statsList.reduce((a, s) => a + s.stdDev, 0) / statsList.length;
    setVerdict(analyzeMixture(avgBrightness, avgStdDev));
    setMixtureStage('result');
  }

  function handleRetakePhotos() {
    photos.forEach((p) => p && URL.revokeObjectURL(p.url));
    setPhotos(Array(MIN_PHOTOS).fill(null));
    setVerdict(null);
    setMixtureStage('picking');
  }

  const timeResult = computeTimeFromRecipe({
    correctedDrc,
    basketVolumeL,
    acidMl,
    waterL,
  });
  const recipeResult = computeRecipeFromTime({
    correctedDrc,
    basketVolumeL,
    hours,
  });

  return (
    <div className="no-scrollbar h-full w-full overflow-y-auto bg-brand-50 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white px-5 pb-4 pt-10 shadow-sm">
        <button
          type="button"
          onClick={() => navigate('/home')}
          aria-label="Back to Home"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 active:scale-95"
        >
          <ArrowLeft className="h-4.5 w-4.5" strokeWidth={2.2} />
        </button>
        <div>
          <p className="text-[15px] font-bold leading-tight text-brand-900">
            Let&apos;s Set the Latex
          </p>
          <p className="text-[11px] text-neutral-400">
            Coagulation decision support
          </p>
        </div>
      </div>

      <div className="px-5 pt-4">
        {/* Stage: input */}
        {stage === 'input' && (
          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            <p className="mb-3 text-[13px] font-bold text-brand-900">
              Device Reading
            </p>
            <div className="space-y-4">
              <SliderField
                icon={Ruler}
                label="Centimetre Gap"
                value={gapCm}
                min={2}
                max={12}
                step={0.5}
                unit="cm"
                onChange={setGapCm}
              />
              <SliderField
                icon={Beaker}
                label="Latex Volume in Basket"
                value={basketVolumeL}
                min={5}
                max={40}
                step={1}
                unit="L"
                onChange={setBasketVolumeL}
              />
            </div>

            <button
              type="button"
              onClick={handlePredictDrc}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-[13.5px] font-semibold text-white transition active:scale-[0.98]"
            >
              <Sparkles className="h-4 w-4" strokeWidth={2.2} />
              Predict DRC
            </button>
          </div>
        )}

        {/* Stage: loading */}
        {stage === 'loading' && (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-brand-100">
            <Loader2 className="h-9 w-9 animate-spin text-brand-500" strokeWidth={2} />
            <p className="mt-4 text-[14px] font-bold text-brand-900">
              Analysing Latex Sample&hellip;
            </p>
            <p className="mt-1 text-[11.5px] text-neutral-400">
              Reading device sensor data
            </p>
          </div>
        )}

        {/* Stage: result */}
        {stage === 'result' && (
          <>
            {/* Reading summary */}
            <div className="flex items-center justify-between rounded-3xl bg-white p-3.5 shadow-sm ring-1 ring-brand-100">
              <div className="flex items-center gap-3 text-[12px] text-neutral-500">
                <span className="flex items-center gap-1">
                  <Ruler className="h-3.5 w-3.5 text-brand-500" strokeWidth={2} />
                  {gapCm}cm gap
                </span>
                <span className="flex items-center gap-1">
                  <Beaker className="h-3.5 w-3.5 text-brand-500" strokeWidth={2} />
                  {basketVolumeL}L basket
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStage('input')}
                className="flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1.5 text-[11px] font-semibold text-brand-700 active:scale-95"
              >
                <Pencil className="h-3 w-3" strokeWidth={2.2} />
                Edit
              </button>
            </div>

            {/* Corrected DRC */}
            <div className="mt-3 rounded-3xl bg-linear-to-br from-brand-500 via-brand-600 to-brand-700 p-4 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-100">
                  Corrected DRC
                </p>
                <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm">
                  <FlaskConical className="h-3 w-3" strokeWidth={2.4} />
                  {METRO_N_MODEL.name}
                </span>
              </div>
              <p className="mt-1.5 text-[36px] font-bold leading-none">
                {correctedDrc.toFixed(1)}
                <span className="text-lg font-semibold text-brand-100">%</span>
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-[10.5px] text-brand-100/90">
                <Info className="h-3 w-3 shrink-0" strokeWidth={2.2} />
                {METRO_N_MODEL.metric} {METRO_N_MODEL.value} &middot;{' '}
                {METRO_N_MODEL.note}
              </div>
            </div>

            {/* Mode selector */}
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setMode('time')}
                className={`flex flex-col items-center gap-1.5 rounded-3xl p-3.5 shadow-sm ring-1 transition ${
                  mode === 'time'
                    ? 'bg-brand-600 text-white ring-brand-600'
                    : 'bg-white text-brand-900 ring-brand-100'
                }`}
              >
                <Timer
                  className={`h-5 w-5 ${mode === 'time' ? 'text-white' : 'text-brand-500'}`}
                  strokeWidth={1.8}
                />
                <span className="text-center text-[12px] font-bold leading-tight">
                  Predict Time
                </span>
                <span
                  className={`text-center text-[10px] leading-tight ${
                    mode === 'time' ? 'text-brand-100' : 'text-neutral-400'
                  }`}
                >
                  from acid &amp; water
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMode('recipe')}
                className={`flex flex-col items-center gap-1.5 rounded-3xl p-3.5 shadow-sm ring-1 transition ${
                  mode === 'recipe'
                    ? 'bg-brand-600 text-white ring-brand-600'
                    : 'bg-white text-brand-900 ring-brand-100'
                }`}
              >
                <Droplets
                  className={`h-5 w-5 ${mode === 'recipe' ? 'text-white' : 'text-brand-500'}`}
                  strokeWidth={1.8}
                />
                <span className="text-center text-[12px] font-bold leading-tight">
                  Predict Water &amp; Acid
                </span>
                <span
                  className={`text-center text-[10px] leading-tight ${
                    mode === 'recipe' ? 'text-brand-100' : 'text-neutral-400'
                  }`}
                >
                  from target time
                </span>
              </button>
            </div>

            {/* Mode: predict time from acid & water */}
            {mode === 'time' && (
              <div className="mt-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
                <p className="mb-3 text-[13px] font-bold text-brand-900">
                  Enter Acid &amp; Water
                </p>
                <div className="space-y-4">
                  <SliderField
                    icon={TestTube}
                    label="Formic Acid"
                    value={acidMl}
                    min={20}
                    max={300}
                    step={5}
                    unit="mL"
                    onChange={setAcidMl}
                  />
                  <SliderField
                    icon={Droplets}
                    label="Water"
                    value={waterL}
                    min={0}
                    max={80}
                    step={1}
                    unit="L"
                    onChange={setWaterL}
                  />
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-brand-50 p-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600">
                    <Timer className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-[12px] text-neutral-500">
                      Predicted Coagulation Time
                    </p>
                    <p className="text-[18px] font-bold text-brand-900">
                      {timeResult.hours.toFixed(1)} hours
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-[10.5px] text-neutral-400">
                  Diluted volume {timeResult.dilutedVolumeL.toFixed(1)} L &middot;
                  dose {timeResult.doseRate.toFixed(1)} mL/L
                </p>
              </div>
            )}

            {/* Mode: predict water & acid from time */}
            {mode === 'recipe' && (
              <div className="mt-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
                <p className="mb-3 text-[13px] font-bold text-brand-900">
                  Enter Target Time
                </p>
                <SliderField
                  icon={Timer}
                  label="Target Coagulation Time"
                  value={hours}
                  min={2}
                  max={10}
                  step={0.5}
                  unit="h"
                  onChange={setHours}
                />

                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center gap-3 rounded-2xl bg-brand-50 p-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600">
                      <Droplets className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-[12px] text-neutral-500">
                        Water to Add
                      </p>
                      <p className="text-[18px] font-bold text-brand-900">
                        {recipeResult.waterL.toFixed(1)} L
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-brand-50 p-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600">
                      <TestTube className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-[12px] text-neutral-500">
                        Formic Acid to Add
                      </p>
                      <p className="text-[18px] font-bold text-brand-900">
                        {Math.round(recipeResult.acidMl)} mL
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-[10.5px] text-neutral-400">
                  Diluted volume {recipeResult.dilutedVolumeL.toFixed(1)} L
                </p>
              </div>
            )}

            {!mode && (
              <p className="mt-3 text-center text-[11px] text-neutral-400">
                Choose one above to continue
              </p>
            )}

            {/* Visual mixture check */}
            <div className="mt-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Camera className="h-4.5 w-4.5" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-brand-900">
                    Visual Mixture Check
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    See how your mixture is looking
                  </p>
                </div>
              </div>

              {mixtureStage === 'closed' && (
                <button
                  type="button"
                  onClick={() => setMixtureStage('picking')}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-brand-50 py-3 text-[13px] font-semibold text-brand-700 transition active:scale-[0.98]"
                >
                  <Camera className="h-4 w-4" strokeWidth={2.2} />
                  How&apos;s My Mixture Looking?
                </button>
              )}

              {mixtureStage === 'picking' && (
                <div className="mt-3">
                  <p className="mb-2 text-[11px] text-neutral-400">
                    Upload at least {MIN_PHOTOS} photos from different angles
                    for an accurate check.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {photos.map((photo, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => openSlot(i)}
                        className="relative aspect-square overflow-hidden rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/60 transition active:scale-[0.96]"
                      >
                        {photo ? (
                          <img
                            src={photo.url}
                            alt={`Mixture ${i + 1}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full flex-col items-center justify-center gap-1 text-brand-500">
                            <Plus className="h-5 w-5" strokeWidth={2} />
                            <span className="text-[10px] font-semibold">
                              Photo {i + 1}
                            </span>
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  <p className="mt-2.5 text-center text-[11px] font-medium text-brand-500">
                    {filledCount} of {MIN_PHOTOS} photos added
                  </p>

                  <button
                    type="button"
                    onClick={handleAnalyzeMixture}
                    disabled={!allPhotosReady}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3 text-[13px] font-semibold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-brand-200 disabled:active:scale-100"
                  >
                    <Camera className="h-4 w-4" strokeWidth={2.2} />
                    {allPhotosReady
                      ? 'Analyse Mixture'
                      : `Add ${MIN_PHOTOS - filledCount} More Photo${MIN_PHOTOS - filledCount === 1 ? '' : 's'}`}
                  </button>
                </div>
              )}

              {mixtureStage === 'loading' && (
                <div className="mt-3 flex flex-col items-center justify-center rounded-2xl bg-brand-50/60 py-8 text-center">
                  <Loader2
                    className="h-7 w-7 animate-spin text-brand-500"
                    strokeWidth={2}
                  />
                  <p className="mt-3 text-[13px] font-bold text-brand-900">
                    Analysing {MIN_PHOTOS} Mixture Photos&hellip;
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-400">
                    Checking colour and consistency
                  </p>
                </div>
              )}

              {mixtureStage === 'result' && verdict && (
                <div className="mt-3">
                  <div className="flex gap-2">
                    {photos.map(
                      (photo, i) =>
                        photo && (
                          <img
                            key={i}
                            src={photo.url}
                            alt={`Mixture ${i + 1}`}
                            className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-brand-100"
                          />
                        ),
                    )}
                  </div>

                  <span
                    className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[10.5px] font-bold ${MIXTURE_TONE_STYLES[verdict.tone].pill}`}
                  >
                    {verdict.label}
                  </span>
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-neutral-500">
                    {verdict.instructions}
                  </p>

                  <div className="mt-3 flex items-center gap-2.5 rounded-2xl bg-brand-50 p-3">
                    {verdict.tone === 'good' && (
                      <CheckCircle2
                        className="h-4 w-4 shrink-0 text-brand-600"
                        strokeWidth={2}
                      />
                    )}
                    {verdict.tone === 'water' && (
                      <Droplets
                        className="h-4 w-4 shrink-0 text-sky-600"
                        strokeWidth={2}
                      />
                    )}
                    {verdict.tone === 'acid' && (
                      <TestTube
                        className="h-4 w-4 shrink-0 text-amber-600"
                        strokeWidth={2}
                      />
                    )}
                    <p className="text-[12px] font-semibold text-brand-800">
                      {verdict.recommendation}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRetakePhotos}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-brand-50 py-2.5 text-[12px] font-semibold text-brand-700 transition active:scale-[0.98]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.2} />
                    Retake Photos
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoSelected}
                className="hidden"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
