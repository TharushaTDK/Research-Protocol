import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Flame,
  Package,
  Thermometer,
  Droplets,
  Timer,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Settings2,
  History,
  LineChart,
  Loader2,
} from 'lucide-react';
import { BATCH, RISK_STYLES, type Layer } from '../data/smokehouse';
import { getStoredBatchInfo } from '../lib/setupStorage';
import { useSmokehouseSimulation } from '../hooks/useSmokehouseSimulation';
import NotificationBanner from '../components/NotificationBanner';
import HistoryView from '../components/smokehouse/HistoryView';
import AnalyzeView from '../components/smokehouse/AnalyzeView';

function Sparkline({ points, tone }: { points: number[]; tone: string }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const w = 64;
  const h = 22;
  const range = max - min || 1;
  const path = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <path d={path} fill="none" stroke={tone} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const SPARK_COLOR: Record<Layer['status'], string> = {
  normal: '#16a34a',
  warning: '#d97706',
  critical: '#e11d48',
};

function LayerCard({
  layer,
  expanded,
  onToggle,
}: {
  layer: Layer;
  expanded: boolean;
  onToggle: () => void;
}) {
  const risk = RISK_STYLES[layer.status];

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-brand-100">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 p-3.5 text-left active:scale-[0.99]"
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition-colors ${risk.banner}`}
        >
          <span className="text-[13px] font-bold">{layer.id}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[13px] font-bold text-brand-900">
              {layer.label}
            </p>
            <span
              className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold transition-colors ${risk.pill}`}
            >
              {risk.label}
            </span>
          </div>
          <p className="truncate text-[10.5px] text-neutral-400">
            {layer.position}
          </p>
        </div>

        <Sparkline points={layer.trend} tone={SPARK_COLOR[layer.status]} />

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-brand-300 transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
          strokeWidth={2.4}
        />
      </button>

      <div className="grid grid-cols-3 gap-2 px-3.5 pb-3.5">
        <div className="flex flex-col items-center gap-0.5 rounded-2xl bg-brand-50 py-2">
          <Thermometer className="h-3.5 w-3.5 text-brand-500" strokeWidth={2} />
          <span className="text-[12px] font-bold text-brand-900">
            {layer.temperature.toFixed(1)}&#176;C
          </span>
          <span className="text-[9px] text-neutral-400">Temp</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 rounded-2xl bg-brand-50 py-2">
          <Droplets className="h-3.5 w-3.5 text-brand-500" strokeWidth={2} />
          <span className="text-[12px] font-bold text-brand-900">
            {Math.round(layer.humidity)}%
          </span>
          <span className="text-[9px] text-neutral-400">Humidity</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 rounded-2xl bg-brand-50 py-2">
          <Timer className="h-3.5 w-3.5 text-brand-500" strokeWidth={2} />
          <span className="text-[12px] font-bold text-brand-900">
            {layer.remainingHours.toFixed(1)}h
          </span>
          <span className="text-[9px] text-neutral-400">Remaining</span>
        </div>
      </div>

      {expanded && (
        <div className="space-y-2 border-t border-brand-100 bg-brand-50/60 px-3.5 py-3">
          <div className="flex items-center justify-between text-[11.5px]">
            <span className="text-neutral-500">Elapsed drying time</span>
            <span className="font-semibold text-brand-900">
              {layer.elapsedHours.toFixed(1)}h
            </span>
          </div>
          <div className="flex items-center justify-between text-[11.5px]">
            <span className="text-neutral-500">Temp. change (1h)</span>
            <span className="font-semibold text-brand-900">
              {layer.tempChange1h > 0 ? '+' : ''}
              {layer.tempChange1h}&#176;C
            </span>
          </div>
          <div className="flex items-center justify-between text-[11.5px]">
            <span className="text-neutral-500">Humidity change (1h)</span>
            <span className="font-semibold text-brand-900">
              {layer.humidityChange1h > 0 ? '+' : ''}
              {layer.humidityChange1h}%
            </span>
          </div>
          <p className="pt-1 text-[11.5px] leading-relaxed text-neutral-500">
            {layer.note}
          </p>
        </div>
      )}
    </div>
  );
}

interface SmokehouseScreenProps {
  onRedoSetup?: () => void;
}

type View = 'dashboard' | 'history' | 'analyze';

export default function SmokehouseScreen({
  onRedoSetup,
}: SmokehouseScreenProps) {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [view, setView] = useState<View>('dashboard');

  const { loading, layers, history, notification, dismissNotification } =
    useSmokehouseSimulation();

  const stored = getStoredBatchInfo();
  const smokehouseName = stored?.smokehouseName ?? 'Smart Smokehouse';
  const sheets = stored?.sheets ?? BATCH.sheets;
  const areaM2 = stored?.areaM2 ?? BATCH.areaM2;

  const risk =
    layers.find((l) => l.status === 'critical')?.status ??
    layers.find((l) => l.status === 'warning')?.status ??
    'normal';
  const riskStyle = RISK_STYLES[risk];
  const flaggedLayer = layers.find((l) => l.status !== 'normal');
  const sheetsPerM2 = (sheets / areaM2).toFixed(1);

  return (
    <div className="relative h-full w-full">
      <NotificationBanner
        notification={notification}
        onDismiss={dismissNotification}
      />

      {view === 'history' && (
        <HistoryView history={history} onBack={() => setView('dashboard')} />
      )}
      {view === 'analyze' && (
        <AnalyzeView history={history} onBack={() => setView('dashboard')} />
      )}

      {view === 'dashboard' && (
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
                {smokehouseName}
              </p>
              <p className="text-[11px] text-neutral-400">
                Drying &amp; fire-risk monitor
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex h-[calc(100%-73px)] flex-col items-center justify-center px-9 text-center">
              <Loader2
                className="h-9 w-9 animate-spin text-brand-500"
                strokeWidth={2}
              />
              <p className="mt-4 text-[14px] font-bold text-brand-900">
                Fetching Live Prediction&hellip;
              </p>
              <p className="mt-1 text-[11.5px] text-neutral-400">
                Reading current smokehouse state
              </p>
            </div>
          ) : (
            <div className="px-5 pt-4">
              {/* Fire-risk banner */}
              <div
                className={`flex items-center gap-3 rounded-3xl p-4 text-white shadow-sm transition-colors ${riskStyle.banner}`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20">
                  {risk === 'normal' ? (
                    <CheckCircle2 className="h-5.5 w-5.5" strokeWidth={2} />
                  ) : (
                    <AlertTriangle className="h-5.5 w-5.5" strokeWidth={2} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-bold">
                    {risk === 'normal'
                      ? 'All Layers Normal'
                      : `${flaggedLayer?.label} Needs Attention`}
                  </p>
                  <p className="text-[11px] text-white/85">
                    {risk === 'normal'
                      ? 'No abnormal heat patterns detected'
                      : flaggedLayer?.note}
                  </p>
                </div>
              </div>

              {/* Batch info */}
              <div className="mt-3 flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Package className="h-4.5 w-4.5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-brand-900">
                      Batch {BATCH.id}
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      {sheets} sheets &middot; {areaM2.toFixed(1)}m&sup2;
                      /layer &middot; {sheetsPerM2}/m&sup2;
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-brand-500">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
                  Live
                </div>
              </div>

              {/* History / Analyze actions */}
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setView('history')}
                  className="flex items-center justify-center gap-1.5 rounded-2xl bg-white py-2.5 text-[12px] font-semibold text-brand-700 shadow-sm ring-1 ring-brand-100 active:scale-[0.98]"
                >
                  <History className="h-3.5 w-3.5" strokeWidth={2} />
                  History
                </button>
                <button
                  type="button"
                  onClick={() => setView('analyze')}
                  className="flex items-center justify-center gap-1.5 rounded-2xl bg-white py-2.5 text-[12px] font-semibold text-brand-700 shadow-sm ring-1 ring-brand-100 active:scale-[0.98]"
                >
                  <LineChart className="h-3.5 w-3.5" strokeWidth={2} />
                  Analyze
                </button>
              </div>

              {/* Layer cards */}
              <p className="mb-2 mt-4 text-[13px] font-bold text-brand-900">
                Layer-Wise Status
              </p>
              <div className="space-y-2.5">
                {layers.map((layer) => (
                  <LayerCard
                    key={layer.id}
                    layer={layer}
                    expanded={expandedId === layer.id}
                    onToggle={() =>
                      setExpandedId(expandedId === layer.id ? null : layer.id)
                    }
                  />
                ))}
              </div>

              {/* Cadence footer note */}
              <div className="mt-3 flex items-center gap-2 rounded-2xl bg-brand-100/60 px-3.5 py-2.5 text-[11px] text-brand-700">
                <Flame className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                Sensors update every hour &middot; started at {BATCH.startedAt}
              </div>

              {onRedoSetup && (
                <button
                  type="button"
                  onClick={onRedoSetup}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 text-[11px] font-semibold text-brand-400"
                >
                  <Settings2 className="h-3 w-3" strokeWidth={2.2} />
                  Redo Smokehouse Setup
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
