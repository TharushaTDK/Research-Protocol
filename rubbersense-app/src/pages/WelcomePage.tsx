import { useNavigate } from 'react-router-dom';
import { ArrowRight, Wifi, Signal, BatteryFull } from 'lucide-react';
import logo from '../assets/logo-icon.png';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-linear-to-b from-brand-600 via-brand-700 to-brand-900 text-white">
      {/* Decorative blurred blobs */}
      <div className="pointer-events-none absolute -left-16 -top-10 h-56 w-56 rounded-full bg-brand-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-64 w-64 rounded-full bg-brand-300/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-400/20 blur-3xl" />

      {/* Status bar */}
      <div className="relative z-10 flex items-center justify-between px-7 pt-4 text-[13px] font-medium text-white/90">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <Signal className="h-3.5 w-3.5" strokeWidth={2.5} />
          <Wifi className="h-3.5 w-3.5" strokeWidth={2.5} />
          <BatteryFull className="h-4 w-4" strokeWidth={2.5} />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-9 text-center">
        <div className="flex h-32 w-32 items-center justify-center rounded-[28px] bg-white/95 shadow-[0_18px_35px_-10px_rgba(0,0,0,0.45)]">
          <img
            src={logo}
            alt="RubberSense logo"
            className="h-24 w-24 rounded-2xl object-cover"
          />
        </div>

        <h1 className="mt-8 text-[32px] font-bold leading-tight tracking-tight">
          RubberSense
        </h1>
        <p className="mt-1.5 text-sm font-medium uppercase tracking-[0.2em] text-brand-100">
          Natural. Smart. Sustainable.
        </p>

        <p className="mt-6 max-w-65 text-[15px] leading-relaxed text-brand-50/90">
          An intelligent decision-support companion for precision rubber
          processing &mdash; latex, weather, sheet quality and smokehouse
          drying, all in one app.
        </p>
      </div>

      {/* Bottom action */}
      <div className="relative z-10 flex flex-col items-center gap-4 px-9 pb-10">
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-4 text-[15px] font-semibold text-brand-800 shadow-[0_10px_25px_-8px_rgba(0,0,0,0.5)] transition active:scale-[0.98]"
        >
          Get Started
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <p className="text-xs text-brand-100/80">
          Final-Year Research Prototype &middot; Smallholder Rubber Sector
        </p>
      </div>
    </div>
  );
}
