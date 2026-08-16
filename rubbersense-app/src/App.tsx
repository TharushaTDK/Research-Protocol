import type { CSSProperties } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import PhoneFrame from './components/PhoneFrame';
import WelcomePage from './pages/WelcomePage';
import HomeScreen from './pages/HomeScreen';
import PlaceholderScreen from './pages/PlaceholderScreen';
import { FEATURES } from './data/features';

// Native mock-up size (matches PhoneFrame's fixed 375x812 dimensions).
const PHONE_W = 375;
const PHONE_H = 812;
const RESERVED_V = 110; // label + outer padding, kept out of the scale budget
const RESERVED_H = 48; // outer horizontal padding

// One scale factor, computed purely in CSS, so the whole mock-up (frame +
// content) shrinks as a single unit to always fit the viewport with no
// scrolling and no clipping — never upscaled past 1 (native size).
const stageStyle = {
  '--s': `min(1, calc((100dvh - ${RESERVED_V}px) / ${PHONE_H}px), calc((100vw - ${RESERVED_H}px) / ${PHONE_W}px))`,
  width: `calc(${PHONE_W}px * var(--s))`,
  height: `calc(${PHONE_H}px * var(--s))`,
} as CSSProperties;

const scaledStyle = {
  transform: 'scale(var(--s))',
  transformOrigin: 'top left',
} as CSSProperties;

const SCREEN_LABELS: Record<string, string> = {
  '/': 'Welcome Screen',
  '/home': 'Home Dashboard',
  ...Object.fromEntries(FEATURES.map((f) => [f.path, f.title])),
};

function ScreenLabel() {
  const { pathname } = useLocation();
  const label = SCREEN_LABELS[pathname] ?? 'Screen';
  return (
    <div className="relative z-10 mb-3 shrink-0 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-700">
        Mobile App Prototype
      </p>
      <h2 className="mt-1 text-lg font-semibold text-brand-900">{label}</h2>
    </div>
  );
}

function App() {
  return (
    <div className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-linear-to-br from-brand-50 via-emerald-50 to-brand-200 px-6 py-4">
      {/* Backdrop decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-brand-400/30 blur-3xl" />

      <ScreenLabel />

      <div className="relative z-10" style={stageStyle}>
        <div className="absolute left-0 top-0" style={scaledStyle}>
          <PhoneFrame>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/home" element={<HomeScreen />} />
              {FEATURES.map((f) => (
                <Route
                  key={f.path}
                  path={f.path}
                  element={<PlaceholderScreen feature={f} />}
                />
              ))}
            </Routes>
          </PhoneFrame>
        </div>
      </div>
    </div>
  );
}

export default App;
