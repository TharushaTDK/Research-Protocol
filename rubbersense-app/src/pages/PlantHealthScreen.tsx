import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Gauge,
  CloudRain,
  Droplets,
  Wind,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Wallet,
  TrendingUp,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { PLOTS, WEEK_OUTLOOK, getDrcStatus, estimatePrice } from '../data/plots';

const TONE_STYLES = {
  low: { pill: 'bg-amber-100 text-amber-700', bar: 'bg-amber-400', w: '35%' },
  good: { pill: 'bg-brand-100 text-brand-700', bar: 'bg-brand-500', w: '65%' },
  high: { pill: 'bg-sky-100 text-sky-700', bar: 'bg-sky-400', w: '90%' },
} as const;

export default function PlantHealthScreen() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(PLOTS[0].id);
  const [showPrice, setShowPrice] = useState(false);

  const plot = PLOTS.find((p) => p.id === selectedId) ?? PLOTS[0];
  const status = getDrcStatus(plot.drc);
  const tone = TONE_STYLES[status.tone];
  const price = estimatePrice(plot.drc);
  const suitableDays = WEEK_OUTLOOK.filter((d) => d.suitable).length;

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
            Rubber Plant Health
          </p>
          <p className="text-[11px] text-neutral-400">
            Weather &amp; tapping advisory
          </p>
        </div>
      </div>

      <div className="px-5 pt-4">
        {/* Map — select estate plot */}
        <p className="mb-2 text-[13px] font-bold text-brand-900">
          Select Your Estate Plot
        </p>
        <div
          className="relative h-44 w-full overflow-hidden rounded-3xl bg-linear-to-br from-brand-400 via-brand-500 to-brand-700 shadow-sm ring-1 ring-brand-100"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.32) 1px, transparent 1.3px)',
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
                    active
                      ? 'h-8 w-8 bg-amber-400 ring-4 ring-white/50'
                      : 'h-6 w-6 bg-white/90'
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
        <div className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-brand-800">
          <MapPin className="h-3.5 w-3.5 text-brand-500" strokeWidth={2.2} />
          <span>{plot.name}</span>
        </div>

        {/* DRC prediction */}
        <div className="mt-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Gauge className="h-4.5 w-4.5" strokeWidth={1.8} />
              </div>
              <p className="text-[13px] font-bold text-brand-900">
                Predicted DRC
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[10.5px] font-bold ${tone.pill}`}
            >
              {status.label}
            </span>
          </div>

          <p className="mt-3 text-[32px] font-bold leading-none text-brand-900">
            {plot.drc.toFixed(1)}
            <span className="text-lg font-semibold text-neutral-400">%</span>
          </p>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-brand-50">
            <div
              className={`h-full rounded-full ${tone.bar}`}
              style={{ width: tone.w }}
            />
          </div>

          <p className="mt-3 text-[12px] leading-relaxed text-neutral-500">
            {status.advice}
          </p>
        </div>

        {/* Today's tapping verdict */}
        <div className="mt-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-bold text-brand-900">
              Today&apos;s Tapping Verdict
            </p>
            <span
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-bold ${
                plot.suitable
                  ? 'bg-brand-100 text-brand-700'
                  : 'bg-rose-100 text-rose-600'
              }`}
            >
              {plot.suitable ? (
                <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
              ) : (
                <XCircle className="h-3 w-3" strokeWidth={2.5} />
              )}
              {plot.suitable ? 'Suitable' : 'Not Suitable'}
            </span>
          </div>

          <p className="mt-2 text-[12px] leading-relaxed text-neutral-500">
            {plot.reason}
          </p>

          <div className="mt-3 grid grid-cols-3 divide-x divide-brand-100 border-t border-brand-100 pt-3">
            <div className="flex flex-col items-center gap-1">
              <Droplets className="h-4 w-4 text-brand-500" strokeWidth={2} />
              <span className="text-[12.5px] font-semibold text-brand-900">
                {plot.humidity}%
              </span>
              <span className="text-[10px] text-neutral-400">Humidity</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CloudRain className="h-4 w-4 text-brand-500" strokeWidth={2} />
              <span className="text-[12.5px] font-semibold text-brand-900">
                {plot.rainfall}mm
              </span>
              <span className="text-[10px] text-neutral-400">Rainfall</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Wind className="h-4 w-4 text-brand-500" strokeWidth={2} />
              <span className="text-[12.5px] font-semibold text-brand-900">
                {plot.windSpeed}km/h
              </span>
              <span className="text-[10px] text-neutral-400">Wind</span>
            </div>
          </div>
        </div>

        {/* Weekly collection window */}
        <div className="mt-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <CalendarDays className="h-4.5 w-4.5" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[13px] font-bold text-brand-900">
                This Week&apos;s Collection Window
              </p>
              <p className="text-[11px] text-neutral-400">
                {suitableDays} of 7 days suitable to collect
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1.5">
            {WEEK_OUTLOOK.map(({ day, suitable }) => (
              <div key={day} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-medium text-neutral-400">
                  {day}
                </span>
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    suitable
                      ? 'bg-brand-100 text-brand-600'
                      : 'bg-rose-50 text-rose-400'
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

        {/* Price estimate */}
        <div className="mt-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Wallet className="h-4.5 w-4.5" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[13px] font-bold text-brand-900">
                Today&apos;s Latex Price
              </p>
              <p className="text-[11px] text-neutral-400">
                Estimated from DRC &amp; market trend
              </p>
            </div>
          </div>

          {!showPrice ? (
            <button
              type="button"
              onClick={() => setShowPrice(true)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3 text-[13px] font-semibold text-white transition active:scale-[0.98]"
            >
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} />
              Check Today&apos;s Price
            </button>
          ) : (
            <div className="mt-3 rounded-2xl bg-brand-50 p-3.5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10.5px] font-semibold uppercase tracking-wide text-brand-500">
                    Approx. Price
                  </p>
                  <p className="mt-0.5 text-2xl font-bold leading-none text-brand-900">
                    Rs. {price.mid}
                    <span className="text-xs font-semibold text-neutral-400">
                      {' '}
                      /kg
                    </span>
                  </p>
                </div>
                <span
                  className={`flex items-center gap-0.5 rounded-full px-2 py-1 text-[11px] font-bold ${
                    plot.priceTrendPct >= 0
                      ? 'bg-brand-100 text-brand-700'
                      : 'bg-rose-100 text-rose-600'
                  }`}
                >
                  {plot.priceTrendPct >= 0 ? (
                    <TrendingUp className="h-3 w-3" strokeWidth={2.5} />
                  ) : (
                    <TrendingDown className="h-3 w-3" strokeWidth={2.5} />
                  )}
                  {Math.abs(plot.priceTrendPct)}%
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-neutral-500">
                Range Rs. {price.low}&ndash;{price.high}/kg &middot;
                illustrative estimate, not a market guarantee.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
