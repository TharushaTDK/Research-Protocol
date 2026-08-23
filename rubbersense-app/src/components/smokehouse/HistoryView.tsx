import { ArrowLeft, Clock } from 'lucide-react';
import { RISK_STYLES } from '../../data/smokehouse';
import type { HistoryEntry } from '../../hooks/useSmokehouseSimulation';

interface HistoryViewProps {
  history: HistoryEntry[];
  onBack: () => void;
}

export default function HistoryView({ history, onBack }: HistoryViewProps) {
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
            Prediction History
          </p>
          <p className="text-[11px] text-neutral-400">
            Every recorded reading, newest first
          </p>
        </div>
      </div>

      <div className="space-y-2.5 px-5 pt-4">
        {history.map((entry, i) => {
          const risk = RISK_STYLES[entry.overallRisk];
          return (
            <div
              key={entry.id}
              className="rounded-3xl bg-white p-3.5 shadow-sm ring-1 ring-brand-100"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11.5px] font-semibold text-brand-800">
                  <Clock className="h-3.5 w-3.5 text-brand-400" strokeWidth={2.2} />
                  {entry.time}
                  {i === 0 && (
                    <span className="rounded-full bg-brand-100 px-1.5 py-0.5 text-[9px] font-bold text-brand-600">
                      LATEST
                    </span>
                  )}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold ${risk.pill}`}>
                  {risk.label}
                </span>
              </div>

              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {entry.layers.map((l) => (
                  <div
                    key={l.id}
                    className="rounded-xl bg-brand-50 px-2 py-1.5 text-center"
                  >
                    <p className="text-[9.5px] font-semibold text-neutral-400">
                      Layer {l.id}
                    </p>
                    <p className="text-[11px] font-bold text-brand-900">
                      {l.temperature.toFixed(1)}&#176;C
                    </p>
                    <p className="text-[9.5px] text-neutral-500">
                      {l.remainingHours.toFixed(1)}h left
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
