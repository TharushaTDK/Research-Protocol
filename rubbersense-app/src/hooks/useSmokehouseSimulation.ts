import { useEffect, useRef, useState } from 'react';
import {
  LAYERS as INITIAL_LAYERS,
  overallRisk,
  type Layer,
  type RiskLevel,
} from '../data/smokehouse';
import { tickLayer } from '../lib/smokehouseSimulator';

// The real system predicts / notifies roughly every 5 minutes. Compressed
// to 15 seconds here so the behaviour is observable in a short demo.
const TICK_MS = 15000;
const MAX_HISTORY = 40;
const UPDATE_DISMISS_MS = 4200;
const ALERT_DISMISS_MS = 5200;

export interface HistoryEntry {
  id: string;
  time: string;
  layers: { id: number; temperature: number; remainingHours: number; status: RiskLevel }[];
  overallRisk: RiskLevel;
}

export type NotificationKind = 'update' | 'warning' | 'critical';

export interface NotificationEvent {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
}

function snapshot(layers: Layer[]): HistoryEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    time: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    layers: layers.map((l) => ({
      id: l.id,
      temperature: l.temperature,
      remainingHours: l.remainingHours,
      status: l.status,
    })),
    overallRisk: overallRisk(layers),
  };
}

export function useSmokehouseSimulation() {
  const [loading, setLoading] = useState(true);
  const [layers, setLayers] = useState<Layer[]>(INITIAL_LAYERS);
  const [history, setHistory] = useState<HistoryEntry[]>(() => [
    snapshot(INITIAL_LAYERS),
  ]);
  const [notification, setNotification] = useState<NotificationEvent | null>(
    null,
  );

  const layersRef = useRef(layers);
  layersRef.current = layers;
  const dismissTimerRef = useRef<number | null>(null);

  function showNotification(kind: NotificationKind, title: string, body: string) {
    setNotification({ id: `${Date.now()}`, kind, title, body });
    if (dismissTimerRef.current) window.clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = window.setTimeout(
      () => setNotification(null),
      kind === 'update' ? UPDATE_DISMISS_MS : ALERT_DISMISS_MS,
    );
  }

  useEffect(() => {
    const loadTimer = window.setTimeout(() => setLoading(false), 1500);
    return () => window.clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      const next = layersRef.current.map(tickLayer);
      setLayers(next);
      setHistory((h) => [snapshot(next), ...h].slice(0, MAX_HISTORY));

      const risk = overallRisk(next);
      const flagged = next.find((l) => l.status !== 'normal');
      if (risk === 'critical' && flagged) {
        showNotification('critical', 'Fire Risk Alert — Critical', `${flagged.label}: ${flagged.note}`);
      } else if (risk === 'warning' && flagged) {
        showNotification('warning', 'Fire Risk Warning', `${flagged.label}: ${flagged.note}`);
      } else {
        const fastest = [...next].sort(
          (a, b) => a.remainingHours - b.remainingHours,
        )[0];
        showNotification(
          'update',
          'Drying Update',
          `${fastest.label}: ${fastest.remainingHours.toFixed(1)}h remaining · all layers normal`,
        );
      }
    }, TICK_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => () => {
      if (dismissTimerRef.current) window.clearTimeout(dismissTimerRef.current);
    },
    [],
  );

  return {
    loading,
    layers,
    history,
    notification,
    dismissNotification: () => setNotification(null),
  };
}
