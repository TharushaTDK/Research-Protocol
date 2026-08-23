import { Bell, AlertTriangle, Siren } from 'lucide-react';
import logo from '../assets/logo-icon.png';
import type { NotificationEvent } from '../hooks/useSmokehouseSimulation';

const KIND_STYLES = {
  update: {
    bg: 'bg-white',
    text: 'text-brand-900',
    sub: 'text-neutral-500',
    iconWrap: 'bg-brand-50',
  },
  warning: {
    bg: 'bg-rose-600',
    text: 'text-white',
    sub: 'text-rose-50',
    iconWrap: 'bg-white/20 text-white',
  },
  critical: {
    bg: 'bg-rose-700',
    text: 'text-white',
    sub: 'text-rose-50',
    iconWrap: 'bg-white/20 text-white',
  },
} as const;

interface NotificationBannerProps {
  notification: NotificationEvent | null;
  onDismiss: () => void;
}

export default function NotificationBanner({
  notification,
  onDismiss,
}: NotificationBannerProps) {
  const visible = notification !== null;
  const kind = notification?.kind ?? 'update';
  const style = KIND_STYLES[kind];
  const isAlarm = kind === 'critical';

  return (
    <div
      className={`absolute left-2 right-2 top-2 z-50 transition-all duration-500 ease-out ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-28 opacity-0'
      }`}
    >
      <button
        type="button"
        onClick={onDismiss}
        className={`flex w-full items-start gap-2.5 rounded-2xl p-3 text-left shadow-lg ring-1 ring-black/5 ${style.bg} ${
          isAlarm ? 'animate-[alarm-shake_0.4s_ease-in-out_infinite]' : ''
        }`}
      >
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg ${style.iconWrap}`}
        >
          {kind === 'update' && (
            <img src={logo} alt="" className="h-full w-full object-cover" />
          )}
          {kind === 'warning' && (
            <AlertTriangle className="h-4.5 w-4.5" strokeWidth={2.2} />
          )}
          {kind === 'critical' && <Siren className="h-4.5 w-4.5" strokeWidth={2.2} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className={`text-[11.5px] font-bold ${style.text}`}>
              {notification?.title ?? ''}
            </p>
            <span className={`flex shrink-0 items-center gap-1 text-[9px] ${style.sub}`}>
              {kind === 'update' && <Bell className="h-2.5 w-2.5" strokeWidth={2.5} />}
              now
            </span>
          </div>
          <p className={`mt-0.5 text-[10.5px] leading-snug ${style.sub}`}>
            {notification?.body ?? ''}
          </p>
        </div>
      </button>
    </div>
  );
}
