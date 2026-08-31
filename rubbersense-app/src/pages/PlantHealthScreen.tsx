import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  CloudRain,
  Droplets,
  Wind,
  Thermometer,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Wallet,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Sprout,
  Gauge,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Clock,
  Info,
  Leaf,
  FlaskConical,
  CircleDot,
  Layers,
} from 'lucide-react';
import {
  PLOTS,
  WEEK_OUTLOOK,
  predictDRC,
  getDrcStatus,
  getTappingAdvisory,
  getCollectionWindow,
  estimatePrice,
  type TappingAction,
} from '../data/plots';

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { id: 0, label: 'Field', icon: Sprout },
  { id: 1, label: 'DRC', icon: FlaskConical },
  { id: 2, label: 'Advisory', icon: ShieldCheck },
  { id: 3, label: 'Collect', icon: Wallet },
] as const;

// ─── Advisory visual config ───────────────────────────────────────────────────

const ACTION_CONFIG: Record<
  TappingAction,
  {
    headline: string;
    bg: string;
    pill: string;
    icon: typeof ShieldCheck;
    badge: string;
    badgeBg: string;
  }
> = {
  tap: {
    headline: 'Tap Now',
    bg: 'from-emerald-500 via-brand-500 to-brand-700',
    pill: 'bg-white/20 text-white',
    icon: ShieldCheck,
    badge: 'Good Conditions',
    badgeBg: 'bg-emerald-400/30',
  },
  caution: {
    headline: 'Tap with Caution',
    bg: 'from-amber-400 via-amber-500 to-orange-600',
    pill: 'bg-white/20 text-white',
    icon: ShieldAlert,
    badge: 'Borderline',
    badgeBg: 'bg-amber-300/30',
  },
  delay: {
    headline: 'Delay Tapping',
    bg: 'from-orange-500 via-orange-600 to-rose-600',
    pill: 'bg-white/20 text-white',
    icon: ShieldX,
    badge: 'Caution',
    badgeBg: 'bg-orange-400/30',
  },
  stop: {
    headline: 'Do Not Tap Today',
    bg: 'from-rose-500 via-rose-600 to-rose-800',
    pill: 'bg-white/20 text-white',
    icon: ShieldX,
    badge: 'High Risk',
    badgeBg: 'bg-rose-400/30',
  },
};

const DRC_TONE_STYLES = {
  low: { pill: 'bg-amber-100 text-amber-700', bar: 'bg-amber-400', barW: '35%' },
  good: { pill: 'bg-brand-100 text-brand-700', bar: 'bg-brand-500', barW: '65%' },
  high: { pill: 'bg-sky-100 text-sky-700', bar: 'bg-sky-400', barW: '90%' },
} as const;

// ─── Slider helper ────────────────────────────────────────────────────────────

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
  icon: typeof Droplets;
}

function SliderRow({ label, value, min, max, step, unit, onChange, icon: Icon }: SliderRowProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-brand-500" strokeWidth={2} />
          <span className="text-[12px] font-semibold text-brand-900">{label}</span>
        </div>
        <span className="text-[13px] font-bold text-brand-700">
          {value}
          <span className="ml-0.5 text-[11px] font-medium text-neutral-400">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        className="brand-slider mt-2"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, var(--color-brand-500) ${pct}%, var(--color-brand-100) ${pct}%)`,
        }}
      />
      <div className="mt-0.5 flex justify-between text-[10px] text-neutral-300">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PlantHealthScreen() {
  const navigate = useNavigate();

  // ── Tab navigation ──
  const [activeTab, setActiveTab] = useState(0);

  // ── Tab 1 state ──
  const [selectedId, setSelectedId] = useState(PLOTS[0].id);
  const [soilMoisture, setSoilMoisture] = useState(42);
  const [soilPH, setSoilPH] = useState(5.2);

  // Derived data
  const plot = PLOTS.find((p) => p.id === selectedId) ?? PLOTS[0];
  const predictedDRC = predictDRC(plot, soilMoisture, soilPH);
  const drcStatus = getDrcStatus(predictedDRC);
  const drcTone = DRC_TONE_STYLES[drcStatus.tone];
  const advisory = getTappingAdvisory(plot, soilMoisture, soilPH, predictedDRC);
  const actionCfg = ACTION_CONFIG[advisory.action];
  const ActionIcon = actionCfg.icon;
  const collection = getCollectionWindow(plot, predictedDRC);
  const price = estimatePrice(predictedDRC);
  const suitableDays = WEEK_OUTLOOK.filter((d) => d.suitable).length;

  function goNext() {
    if (activeTab < TABS.length - 1) setActiveTab((t) => t + 1);
  }
  function goBack() {
    if (activeTab > 0) setActiveTab((t) => t - 1);
  }

  const tappingCycleLabel =
    plot.tappingCycle === 'd2' ? 'Every 2 Days' : plot.tappingCycle === 'd3' ? 'Every 3 Days' : 'Every 4 Days';

  return (
    <div className="no-scrollbar h-full w-full overflow-y-auto bg-brand-50 pb-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 bg-white px-5 pb-3.5 pt-10 shadow-sm">
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
            How&apos;s Today Your Rubber Plant?
          </p>
          <p className="text-[11px] text-neutral-400">Village-level tapping advisory</p>
        </div>
      </div>

      {/* ── Step tab bar ── */}
      <div className="bg-white px-4 pb-3 pt-2 shadow-sm">
        <div className="flex items-center gap-1">
          {TABS.map(({ id, label, icon: TabIcon }, i) => {
            const isActive = activeTab === id;
            const isDone = activeTab > id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : isDone
                      ? 'bg-brand-50 text-brand-500'
                      : 'text-neutral-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-brand-500" strokeWidth={2.3} />
                ) : (
                  <TabIcon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-neutral-300'}`} strokeWidth={1.8} />
                )}
                <span className={`text-[9.5px] font-bold tracking-wide ${isActive ? 'text-white' : isDone ? 'text-brand-500' : 'text-neutral-300'}`}>
                  {i + 1}. {label}
                </span>
              </button>
            );
          })}
        </div>
        {/* Progress bar */}
        <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-brand-100">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-500"
            style={{ width: `${((activeTab + 1) / TABS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1 — WEATHER & FIELD CONDITIONS
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 0 && (
        <div className="px-4 pt-4">
          {/* Section: Select plot */}
          <p className="mb-2 text-[12px] font-bold uppercase tracking-widest text-brand-400">
            Your Estate Plot
          </p>
          {/* Map */}
          <div
            className="relative h-40 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 shadow-sm ring-1 ring-brand-100"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.28) 1px, transparent 1.3px)',
              backgroundSize: '13px 13px',
            }}
          >
            {/* stylised river */}
            <svg
              className="absolute inset-0 h-full w-full opacity-40"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M -5 10 Q 30 25 25 45 T 40 75 T 20 105"
                fill="none"
                stroke="white"
                strokeWidth="3.5"
              />
            </svg>

            {PLOTS.map((p) => {
              const active = p.id === selectedId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  aria-label={p.name}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                >
                  <span
                    className={`flex items-center justify-center rounded-full border-2 border-white shadow-md transition-all ${
                      active ? 'h-8 w-8 bg-amber-400 ring-4 ring-white/50' : 'h-6 w-6 bg-white/90'
                    }`}
                  >
                    <MapPin
                      className={active ? 'h-4 w-4 text-white' : 'h-3 w-3 text-brand-700'}
                      strokeWidth={2.5}
                      fill={active ? 'currentColor' : 'none'}
                    />
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-brand-800">
            <MapPin className="h-3.5 w-3.5 text-brand-500" strokeWidth={2.2} />
            <span>{plot.name}</span>
          </div>

          {/* Section: Weather */}
          <p className="mb-2 mt-4 text-[12px] font-bold uppercase tracking-widest text-brand-400">
            Current Weather
          </p>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            <div className="grid grid-cols-4 divide-x divide-brand-100">
              <div className="flex flex-col items-center gap-1 pr-2">
                <Thermometer className="h-4 w-4 text-brand-500" strokeWidth={2} />
                <span className="text-[13px] font-bold text-brand-900">{plot.temperature}°</span>
                <span className="text-[10px] text-neutral-400">Temp</span>
              </div>
              <div className="flex flex-col items-center gap-1 px-2">
                <Droplets className="h-4 w-4 text-brand-500" strokeWidth={2} />
                <span className="text-[13px] font-bold text-brand-900">{plot.humidity}%</span>
                <span className="text-[10px] text-neutral-400">Humidity</span>
              </div>
              <div className="flex flex-col items-center gap-1 px-2">
                <CloudRain className="h-4 w-4 text-brand-500" strokeWidth={2} />
                <span className="text-[13px] font-bold text-brand-900">{plot.rainfall}mm</span>
                <span className="text-[10px] text-neutral-400">Rainfall</span>
              </div>
              <div className="flex flex-col items-center gap-1 pl-2">
                <Wind className="h-4 w-4 text-brand-500" strokeWidth={2} />
                <span className="text-[13px] font-bold text-brand-900">{plot.windSpeed}<span className="text-[9px]">km/h</span></span>
                <span className="text-[10px] text-neutral-400">Wind</span>
              </div>
            </div>
          </div>

          {/* Section: Soil conditions */}
          <p className="mb-2 mt-4 text-[12px] font-bold uppercase tracking-widest text-brand-400">
            Soil Conditions
          </p>
          <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            <SliderRow
              icon={Droplets}
              label="Soil Moisture"
              value={soilMoisture}
              min={10}
              max={95}
              step={1}
              unit="%"
              onChange={setSoilMoisture}
            />
            <SliderRow
              icon={CircleDot}
              label="Soil pH"
              value={soilPH}
              min={3.5}
              max={7.0}
              step={0.1}
              unit=""
              onChange={setSoilPH}
            />
          </div>

          {/* Section: Tapping history */}
          <p className="mb-2 mt-4 text-[12px] font-bold uppercase tracking-widest text-brand-400">
            Tapping History
          </p>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 rounded-xl bg-brand-50 p-3">
                <Layers className="h-4 w-4 shrink-0 text-brand-500" strokeWidth={1.8} />
                <div>
                  <p className="text-[10px] text-neutral-400">Tapping Cycle</p>
                  <p className="text-[12px] font-bold text-brand-900">{tappingCycleLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl bg-brand-50 p-3">
                <CalendarDays className="h-4 w-4 shrink-0 text-brand-500" strokeWidth={1.8} />
                <div>
                  <p className="text-[10px] text-neutral-400">Last Tapped</p>
                  <p className="text-[12px] font-bold text-brand-900">{plot.lastTapDaysAgo}d ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next button */}
          <button
            type="button"
            onClick={goNext}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-[13.5px] font-semibold text-white shadow-sm transition active:scale-[0.98]"
          >
            Next: DRC Prediction
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2 — DRC PREDICTION (INTERNAL SUPPORT)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 1 && (
        <div className="px-4 pt-4">
          {/* Internal info banner */}
          <div className="flex items-start gap-2.5 rounded-2xl border border-brand-200 bg-brand-50 p-3.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" strokeWidth={2} />
            <p className="text-[11.5px] leading-relaxed text-brand-700">
              <span className="font-bold">Internal Decision Support</span> — The DRC value below is
              an analytical input used to refine your tapping advice. It is not the primary
              farmer-facing recommendation.
            </p>
          </div>

          {/* Predicted DRC hero */}
          <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Gauge className="h-4.5 w-4.5" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-brand-900">Predicted DRC</p>
                  <p className="text-[10.5px] text-neutral-400">Dry Rubber Content</p>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-bold ${drcTone.pill}`}>
                {drcStatus.label}
              </span>
            </div>

            <p className="mt-3 text-[38px] font-bold leading-none text-brand-900">
              {predictedDRC.toFixed(1)}
              <span className="text-xl font-semibold text-neutral-400">%</span>
            </p>

            {/* Progress bar */}
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-brand-50">
              <div className={`h-full rounded-full transition-all duration-700 ${drcTone.bar}`} style={{ width: drcTone.barW }} />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-neutral-300">
              <span>18%</span>
              <span>Optimal: 26–35%</span>
              <span>42%</span>
            </div>

            <p className="mt-3 text-[12px] leading-relaxed text-neutral-500">{drcStatus.advice}</p>
          </div>

          {/* Input factors */}
          <p className="mb-2 mt-4 text-[12px] font-bold uppercase tracking-widest text-brand-400">
            Factors Influencing DRC
          </p>
          <div className="space-y-2">
            {[
              { label: 'Humidity', value: `${plot.humidity}%`, icon: Droplets },
              { label: '24h Rainfall', value: `${plot.rainfall} mm`, icon: CloudRain },
              { label: 'Temperature', value: `${plot.temperature}°C`, icon: Thermometer },
              { label: 'Soil Moisture', value: `${soilMoisture}%`, icon: Leaf },
              { label: 'Soil pH', value: soilPH.toFixed(1), icon: CircleDot },
            ].map(({ label, value, icon: FactorIcon }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-brand-100"
              >
                <div className="flex items-center gap-2">
                  <FactorIcon className="h-3.5 w-3.5 text-brand-400" strokeWidth={2} />
                  <span className="text-[12px] text-neutral-500">{label}</span>
                </div>
                <span className="text-[12.5px] font-semibold text-brand-900">{value}</span>
              </div>
            ))}
          </div>

          {/* What DRC means for tapping */}
          <div className="mt-3 rounded-2xl bg-brand-600 p-4 text-white shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand-100">
              Effect on Tapping
            </p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-brand-50">
              {drcStatus.tone === 'low'
                ? 'Low DRC signals tree stress. This will push the tapping advisory toward caution or delay to protect long-term productivity.'
                : drcStatus.tone === 'high'
                  ? 'High DRC means concentrated latex — adjust your coagulant dilution. Tapping conditions remain favourable.'
                  : 'Optimal DRC supports healthy latex flow. This is one positive signal used in your tapping recommendation.'}
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={goBack}
              className="flex w-1/3 items-center justify-center gap-1.5 rounded-full bg-brand-50 py-3.5 text-[13px] font-semibold text-brand-700 transition active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-[13.5px] font-semibold text-white shadow-sm transition active:scale-[0.98]"
            >
              See Tapping Advisory
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 3 — TAPPING ADVISORY (MAIN FARMER OUTPUT)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 2 && (
        <div className="px-4 pt-4">
          {/* HERO CARD */}
          <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br p-5 text-white shadow-lg ${actionCfg.bg}`}>
            {/* Decorative circle */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

            <div className="flex items-start justify-between">
              <div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold ${actionCfg.pill} ${actionCfg.badgeBg}`}>
                  <ActionIcon className="h-3 w-3" strokeWidth={2.5} />
                  {actionCfg.badge}
                </span>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-white/70">
                  Today&apos;s Tapping Action
                </p>
                <h2 className="mt-1 text-[30px] font-extrabold leading-tight text-white">
                  {advisory.headline}
                </h2>
              </div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <ActionIcon className="h-7 w-7 text-white" strokeWidth={1.8} />
              </div>
            </div>

            <p className="mt-3 text-[12.5px] leading-relaxed text-white/85">
              {advisory.reason}
            </p>

            {/* Best time window */}
            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/15 px-3.5 py-2.5 backdrop-blur-sm">
              <Clock className="h-4 w-4 shrink-0 text-white/80" strokeWidth={2} />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/60">
                  Best Tapping Window
                </p>
                <p className="text-[13px] font-bold text-white">{advisory.bestTimeWindow}</p>
              </div>
            </div>
          </div>

          {/* Factor breakdown */}
          <p className="mb-2 mt-4 text-[12px] font-bold uppercase tracking-widest text-brand-400">
            Decision Factors
          </p>
          <div className="space-y-2">
            {advisory.factors.map(({ label, ok, detail }) => (
              <div
                key={label}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm ${
                  ok
                    ? 'border-brand-100 bg-white'
                    : 'border-rose-100 bg-rose-50/60'
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    ok ? 'bg-brand-100 text-brand-600' : 'bg-rose-100 text-rose-500'
                  }`}
                >
                  {ok ? (
                    <CheckCircle2 className="h-4 w-4" strokeWidth={2.3} />
                  ) : (
                    <XCircle className="h-4 w-4" strokeWidth={2.3} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold text-brand-900">{label}</p>
                  <p className="text-[11px] leading-snug text-neutral-400">{detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={goBack}
              className="flex w-1/3 items-center justify-center gap-1.5 rounded-full bg-brand-50 py-3.5 text-[13px] font-semibold text-brand-700 transition active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-[13.5px] font-semibold text-white shadow-sm transition active:scale-[0.98]"
            >
              Collection & Price
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 4 — COLLECTION TIME & PRICE ESTIMATION
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 3 && (
        <div className="px-4 pt-4">
          {/* Collection window */}
          <p className="mb-2 text-[12px] font-bold uppercase tracking-widest text-brand-400">
            Latex Collection Window
          </p>
          <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-4 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <Clock className="h-5.5 w-5.5 text-white" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-wide text-brand-100">
                  Recommended Collection Time
                </p>
                <p className="mt-0.5 text-[18px] font-bold text-white">
                  {collection.windowDescription}
                </p>
              </div>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-brand-100">
              {collection.collectionNote}
            </p>
          </div>

          {/* Expected yield */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
              <Leaf className="h-4 w-4 text-brand-400" strokeWidth={1.8} />
              <p className="mt-2 text-[10.5px] text-neutral-400">Expected Yield</p>
              <p className="text-[20px] font-bold leading-snug text-brand-900">
                ~{collection.expectedYieldKg} kg
                <span className="text-[11px] font-medium text-neutral-400"> / tree</span>
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
              <FlaskConical className="h-4 w-4 text-brand-400" strokeWidth={1.8} />
              <p className="mt-2 text-[10.5px] text-neutral-400">Predicted DRC</p>
              <p className="text-[20px] font-bold leading-snug text-brand-900">
                {predictedDRC.toFixed(1)}
                <span className="text-[11px] font-medium text-neutral-400">%</span>
              </p>
            </div>
          </div>

          {/* Price estimation */}
          <p className="mb-2 mt-4 text-[12px] font-bold uppercase tracking-widest text-brand-400">
            Price Estimation
          </p>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-wide text-brand-400">
                  Approx. Market Price
                </p>
                <p className="mt-1 text-[30px] font-extrabold leading-none text-brand-900">
                  Rs.&nbsp;{price.mid}
                  <span className="text-[13px] font-semibold text-neutral-400">/kg</span>
                </p>
                <p className="mt-1 text-[11px] text-neutral-400">
                  Range Rs.&nbsp;{price.low}–{price.high}&nbsp;/kg
                </p>
              </div>
              <span
                className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[12px] font-bold ${
                  plot.priceTrendPct >= 0
                    ? 'bg-brand-100 text-brand-700'
                    : 'bg-rose-100 text-rose-600'
                }`}
              >
                {plot.priceTrendPct >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" strokeWidth={2.5} />
                )}
                {Math.abs(plot.priceTrendPct)}%
              </span>
            </div>

            <div className="mt-3 flex items-start gap-1.5 text-[11px] text-neutral-400">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-300" strokeWidth={2} />
              <span>Illustrative estimate based on DRC and market trend — not a market guarantee.</span>
            </div>
          </div>

          {/* Weekly collection window */}
          <p className="mb-2 mt-4 text-[12px] font-bold uppercase tracking-widest text-brand-400">
            Weekly Collection Outlook
          </p>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-brand-400" strokeWidth={1.8} />
              <p className="text-[12px] font-semibold text-brand-700">
                {suitableDays} of 7 days suitable to collect
              </p>
            </div>
            <div className="mt-3 grid grid-cols-7 gap-1.5">
              {WEEK_OUTLOOK.map(({ day, suitable }) => (
                <div key={day} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-medium text-neutral-400">{day}</span>
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      suitable ? 'bg-brand-100 text-brand-600' : 'bg-rose-50 text-rose-400'
                    }`}
                  >
                    {suitable ? (
                      <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.4} />
                    ) : (
                      <XCircle className="h-3.5 w-3.5" strokeWidth={2.4} />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={goBack}
              className="flex w-1/3 items-center justify-center gap-1.5 rounded-full bg-brand-50 py-3.5 text-[13px] font-semibold text-brand-700 transition active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
              Back
            </button>
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-[13.5px] font-semibold text-white shadow-sm transition active:scale-[0.98]"
            >
              Done — Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
