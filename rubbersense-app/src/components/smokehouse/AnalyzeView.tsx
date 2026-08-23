import { ArrowLeft, TrendingDown, Thermometer } from 'lucide-react';
import type { RiskLevel } from '../../data/smokehouse';
import type { HistoryEntry } from '../../hooks/useSmokehouseSimulation';

interface AnalyzeViewProps {
  history: HistoryEntry[];
  onBack: () => void;
}

const LAYER_COLOR: Record<number, string> = {
  1: '#d97706',
  2: '#16a34a',
  3: '#0ea5e9',
};

const RISK_DOT: Record<RiskLevel, string> = {
  normal: 'bg-brand-400',
  warning: 'bg-amber-400',
  critical: 'bg-rose-500',
};

function MultiTrendChart({
  history,
  pick,
  unit,
}: {
  history: HistoryEntry[];
  pick: (layerId: number, entry: HistoryEntry) => number;
  unit: string;
}) {
  const ordered = [...history].reverse(); // oldest -> newest, left to right
  const w = 300;
  const h = 110;
  const padL = 28;
  const padB = 14;
  const plotW = w - padL - 6;
  const plotH = h - padB - 6;

  const allValues = ordered.flatMap((e) => [1, 2, 3].map((id) => pick(id, e)));
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min || 1;

  function pathFor(layerId: number) {
    return ordered
      .map((e, i) => {
        const x = padL + (i / Math.max(1, ordered.length - 1)) * plotW;
        const v = pick(layerId, e);
        const y = 6 + plotH - ((v - min) / range) * plotH;
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      {[0, 0.5, 1].map((t) => (
        <line
          key={t}
          x1={padL}
          x2={w - 6}
          y1={6 + plotH * t}
          y2={6 + plotH * t}
          stroke="#EAF6EE"
          strokeWidth={1}
        />
      ))}
      <text x={2} y={12} className="fill-neutral-400" style={{ fontSize: 7 }}>
        {max.toFixed(0)}{unit}
      </text>
      <text x={2} y={h - padB + 2} className="fill-neutral-400" style={{ fontSize: 7 }}>
        {min.toFixed(0)}{unit}
      </text>
      {[1, 2, 3].map((id) => (
        <path
          key={id}
          d={pathFor(id)}
          fill="none"
          stroke={LAYER_COLOR[id]}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

export default function AnalyzeView({ history, onBack }: AnalyzeViewProps) {
  const ordered = [...history].reverse();
  const latest = history[0];

  return (
    <div className="no-scrollbar h-full w-full overflow-y-auto bg-brand-50 pb-8">
      <div className="flex items-center gap-3 bg-white px-5 pb-4 pt-10 shadow-sm">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 active:scale-95"
        >
          <ArrowLeft className="h-4.5 w-4.5" strokeWidth={2.2} />
        </button>
        <div>
          <p className="text-[15px] font-bold leading-tight text-brand-900">
            Drying Analysis
          </p>
          <p className="text-[11px] text-neutral-400">
            Trends across {history.length} recorded readings
          </p>
        </div>
      </div>

      <div className="px-5 pt-4">
        {/* Fire-risk timeline */}
        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
          <p className="text-[13px] font-bold text-brand-900">
            Fire-Risk Timeline
          </p>
          <p className="text-[10.5px] text-neutral-400">
            Oldest &rarr; newest
          </p>
          <div className="mt-3 flex h-8 items-end gap-[3px] overflow-hidden rounded-lg">
            {ordered.map((e) => (
              <span
                key={e.id}
                className={`h-full flex-1 rounded-sm ${RISK_DOT[e.overallRisk]}`}
                title={e.overallRisk}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-3 text-[10px] text-neutral-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-brand-400" /> Normal
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-400" /> Warning
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-500" /> Critical
            </span>
          </div>
        </div>

        {/* Remaining drying time trend */}
        <div className="mt-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <TrendingDown className="h-4.5 w-4.5" strokeWidth={1.8} />
            </div>
            <p className="text-[13px] font-bold text-brand-900">
              Remaining Drying Time
            </p>
          </div>
          <div className="mt-2">
            <MultiTrendChart
              history={history}
              pick={(id, e) => e.layers.find((l) => l.id === id)?.remainingHours ?? 0}
              unit="h"
            />
          </div>
          <Legend />
        </div>

        {/* Temperature trend */}
        <div className="mt-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Thermometer className="h-4.5 w-4.5" strokeWidth={1.8} />
            </div>
            <p className="text-[13px] font-bold text-brand-900">
              Layer Temperature
            </p>
          </div>
          <div className="mt-2">
            <MultiTrendChart
              history={history}
              pick={(id, e) => e.layers.find((l) => l.id === id)?.temperature ?? 0}
              unit="°"
            />
          </div>
          <Legend />
        </div>

        {/* Current snapshot */}
        {latest && (
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {latest.layers.map((l) => (
              <div
                key={l.id}
                className="rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-brand-100"
              >
                <p className="text-[10px] font-semibold text-neutral-400">
                  Layer {l.id}
                </p>
                <p className="mt-0.5 text-[13px] font-bold text-brand-900">
                  {l.remainingHours.toFixed(1)}h
                </p>
                <p className="text-[9.5px] text-neutral-400">remaining</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-2 flex items-center gap-3 text-[10px] text-neutral-500">
      <span className="flex items-center gap-1">
        <span className="h-1.5 w-3 rounded-full" style={{ background: LAYER_COLOR[1] }} />
        Layer 1
      </span>
      <span className="flex items-center gap-1">
        <span className="h-1.5 w-3 rounded-full" style={{ background: LAYER_COLOR[2] }} />
        Layer 2
      </span>
      <span className="flex items-center gap-1">
        <span className="h-1.5 w-3 rounded-full" style={{ background: LAYER_COLOR[3] }} />
        Layer 3
      </span>
    </div>
  );
}
