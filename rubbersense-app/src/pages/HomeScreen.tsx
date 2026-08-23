import { useNavigate } from 'react-router-dom';
import {
  Bell,
  MapPin,
  CloudSun,
  Droplets,
  CloudRain,
  Wind,
  CheckCircle2,
  Timer,
  ChevronRight,
  Signal,
  Wifi,
  BatteryFull,
} from 'lucide-react';
import { FEATURES } from '../data/features';
import logo from '../assets/logo-icon.png';

const INSIGHTS = [
  {
    icon: CheckCircle2,
    label: 'Tap Today',
    value: 'Recommended',
  },
  {
    icon: Droplets,
    label: 'Latex DRC',
    value: 'Stable',
  },
  {
    icon: Timer,
    label: 'Drying Batch',
    value: '62% Done',
  },
];

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="no-scrollbar h-full w-full overflow-y-auto bg-brand-50">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-b-[36px] bg-linear-to-b from-brand-500 via-brand-600 to-brand-700 pb-11">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-14 top-24 h-32 w-32 rounded-full bg-brand-300/30 blur-2xl" />

        {/* Status bar */}
        <div className="relative z-10 flex items-center justify-between px-6 pt-3.5 text-[13px] font-medium text-white/90">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="h-3.5 w-3.5" strokeWidth={2.5} />
            <Wifi className="h-3.5 w-3.5" strokeWidth={2.5} />
            <BatteryFull className="h-4 w-4" strokeWidth={2.5} />
          </div>
        </div>

        {/* Greeting */}
        <div className="relative z-10 mt-3 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/95 p-1.5 shadow-sm">
              <img
                src={logo}
                alt="RubberSense"
                className="h-full w-full rounded-xl object-cover"
              />
            </div>
            <div>
              <p className="text-[13px] font-medium text-brand-100">
                Good Morning &#128075;
              </p>
              <h1 className="mt-0.5 text-xl font-bold text-white">
                Nimal&apos;s Estate
              </h1>
              <div className="mt-1 flex items-center gap-1 text-[12px] text-brand-100">
                <MapPin className="h-3 w-3" />
                <span>Kalutara, Sri Lanka</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm active:scale-95"
          >
            <Bell className="h-4.5 w-4.5" strokeWidth={2.2} />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-amber-300" />
          </button>
        </div>
      </div>

      {/* Weather card — overlaps hero boundary */}
      <div className="relative z-10 -mt-11 px-6">
        <div className="rounded-3xl bg-white p-4 shadow-[0_18px_35px_-15px_rgba(15,61,36,0.35)] ring-1 ring-brand-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
                Today&apos;s Forecast
              </p>
              <p className="mt-1 text-[26px] font-bold leading-none text-brand-900">
                28&#176;C
              </p>
              <p className="mt-1.5 text-sm text-neutral-500">
                Partly Cloudy &middot; good for tapping
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
              <CloudSun className="h-8 w-8 text-brand-500" strokeWidth={1.7} />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 divide-x divide-brand-100 border-t border-brand-100 pt-3">
            <div className="flex flex-col items-center gap-1">
              <Droplets className="h-4 w-4 text-brand-500" strokeWidth={2} />
              <span className="text-[13px] font-semibold text-brand-900">
                74%
              </span>
              <span className="text-[10px] text-neutral-400">Humidity</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CloudRain className="h-4 w-4 text-brand-500" strokeWidth={2} />
              <span className="text-[13px] font-semibold text-brand-900">
                2mm
              </span>
              <span className="text-[10px] text-neutral-400">Rainfall</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Wind className="h-4 w-4 text-brand-500" strokeWidth={2} />
              <span className="text-[13px] font-semibold text-brand-900">
                9km/h
              </span>
              <span className="text-[10px] text-neutral-400">Wind</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's insight */}
      <div className="px-6 pt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-brand-900">
            Today&apos;s Insight
          </h2>
          <span className="text-[11px] font-medium text-brand-400">
            Updated 9:00 AM
          </span>
        </div>

        <div className="mt-2.5 grid grid-cols-3 gap-2.5">
          {INSIGHTS.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 rounded-2xl bg-white px-2 py-3 text-center shadow-sm ring-1 ring-brand-100"
            >
              <Icon className="h-4.5 w-4.5 text-brand-500" strokeWidth={2} />
              <span className="text-[12px] font-bold leading-tight text-brand-900">
                {value}
              </span>
              <span className="text-[10px] leading-tight text-neutral-400">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature grid */}
      <div className="px-6 pb-5 pt-5">
        <h2 className="text-[15px] font-bold text-brand-900">
          Explore Tools
        </h2>

        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          {FEATURES.map(({ path, title, subtitle, icon: Icon }) => (
            <button
              key={path}
              type="button"
              onClick={() => navigate(path)}
              className="group flex flex-col items-start gap-2 rounded-2xl bg-white p-3.5 text-left shadow-sm ring-1 ring-brand-100 transition active:scale-[0.97]"
            >
              <div className="flex w-full items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-active:bg-brand-100">
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                </div>
                <ChevronRight className="h-4 w-4 text-brand-300" />
              </div>
              <div>
                <p className="text-[12.5px] font-semibold leading-snug text-brand-900">
                  {title}
                </p>
                <p className="mt-0.5 text-[10.5px] leading-snug text-neutral-400">
                  {subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
