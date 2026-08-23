import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Flame,
  Thermometer,
  Droplets,
  CheckCircle2,
  Circle,
  XCircle,
  Loader2,
  Power,
  Wifi,
  Lock,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Package,
  Sparkles,
  PartyPopper,
  ClipboardList,
} from 'lucide-react';
import {
  WIFI_NETWORKS,
  SENSOR_CHECKS,
  EXAMPLE_FAILED_SENSOR_KEY,
  calcSheetsPerM2,
} from '../data/smokehouseSetup';
import type { BatchInfo } from '../lib/setupStorage';

type Step =
  | 'intro'
  | 'hardware'
  | 'device'
  | 'wifi'
  | 'verifying'
  | 'detecting'
  | 'sensors'
  | 'register'
  | 'complete'
  | 'batch';

type VerifyState = 'pending' | 'active' | 'done' | 'failed';
type SensorState = 'pending' | 'pass' | 'fail';

const STEP_META: Partial<Record<Step, { number: number; label: string }>> = {
  hardware: { number: 1, label: 'Connect Hardware' },
  device: { number: 2, label: 'Connect Device' },
  wifi: { number: 3, label: 'Configure Wi-Fi' },
  verifying: { number: 3, label: 'Configure Wi-Fi' },
  detecting: { number: 4, label: 'Detect Sensors' },
  sensors: { number: 5, label: 'Verify 6 Sensors' },
  register: { number: 6, label: 'Register Smokehouse' },
};
const TOTAL_STEPS = 6;

interface SmokehouseSetupWizardProps {
  onComplete: (batch: BatchInfo) => void;
}

function StepHeader({
  step,
  onBack,
}: {
  step: Step;
  onBack: () => void;
}) {
  const meta = STEP_META[step];
  return (
    <div className="bg-white px-5 pb-4 pt-10 shadow-sm">
      <div className="flex items-center gap-3">
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
            {meta ? meta.label : 'Smart Smokehouse Setup'}
          </p>
          {meta && (
            <p className="text-[11px] text-neutral-400">
              Step {meta.number} of {TOTAL_STEPS}
            </p>
          )}
        </div>
      </div>
      {meta && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-brand-50">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-500"
            style={{ width: `${(meta.number / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default function SmokehouseSetupWizard({
  onComplete,
}: SmokehouseSetupWizardProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('intro');

  // Step 1 — hardware
  const [hardwareChecked, setHardwareChecked] = useState(false);

  // Step 2 — device
  const [deviceConnecting, setDeviceConnecting] = useState(false);
  const [setupCode] = useState(() => 1000 + Math.floor(Math.random() * 9000));

  // Step 3 — wifi
  const [wifiListOpen, setWifiListOpen] = useState(false);
  const [wifiNetwork, setWifiNetwork] = useState<string | null>(null);
  const [wifiPassword, setWifiPassword] = useState('');

  // Verification checklist
  const [verify, setVerify] = useState<{
    device: VerifyState;
    internet: VerifyState;
    cloud: VerifyState;
  }>({ device: 'pending', internet: 'pending', cloud: 'pending' });
  const verifyAttemptRef = useRef(0);

  // Sensors
  const [sensorResults, setSensorResults] = useState<
    Record<string, SensorState>
  >({});
  const sensorAttemptRef = useRef(0);

  // Register
  const [smokehouseName, setSmokehouseName] = useState('My Smokehouse');

  // Batch
  const [sheets, setSheets] = useState(180);
  const [areaM2, setAreaM2] = useState(6);

  const timeoutsRef = useRef<number[]>([]);
  function after(ms: number, fn: () => void) {
    const id = window.setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  }
  useEffect(
    () => () => timeoutsRef.current.forEach((id) => window.clearTimeout(id)),
    [],
  );

  // --- Wi-Fi / cloud verification sequence -------------------------------
  function runVerification() {
    verifyAttemptRef.current += 1;
    const attempt = verifyAttemptRef.current;
    setVerify({ device: 'active', internet: 'pending', cloud: 'pending' });

    after(700, () => {
      setVerify((v) => ({ ...v, device: 'done', internet: 'active' }));
    });
    after(1500, () => {
      // Only the first attempt can fail, so the retry path is reachable
      // but the demo always converges.
      const shouldFail = attempt === 1 && Math.random() < 0.25;
      if (shouldFail) {
        setVerify((v) => ({ ...v, internet: 'failed' }));
      } else {
        setVerify((v) => ({ ...v, internet: 'done', cloud: 'active' }));
      }
    });
    after(2300, () => {
      setVerify((v) =>
        v.internet === 'failed' ? v : { ...v, cloud: 'done' },
      );
    });
    after(2800, () => {
      setVerify((v) => {
        if (v.internet !== 'failed') setStep('detecting');
        return v;
      });
    });
  }

  useEffect(() => {
    if (step === 'verifying') runVerification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // --- Sensor detection ----------------------------------------------------
  useEffect(() => {
    if (step !== 'detecting') return;
    sensorAttemptRef.current += 1;
    const attempt = sensorAttemptRef.current;
    after(1800, () => {
      const results: Record<string, SensorState> = {};
      const shouldFailOne = attempt === 1 && Math.random() < 0.3;
      SENSOR_CHECKS.forEach((s) => {
        results[s.key] =
          shouldFailOne && s.key === EXAMPLE_FAILED_SENSOR_KEY
            ? 'fail'
            : 'pass';
      });
      setSensorResults(results);
      setStep('sensors');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const allSensorsPass = SENSOR_CHECKS.every(
    (s) => sensorResults[s.key] === 'pass',
  );
  const failedSensor = SENSOR_CHECKS.find((s) => sensorResults[s.key] === 'fail');

  function handleBack() {
    switch (step) {
      case 'hardware':
        navigate('/home');
        return;
      case 'device':
        setStep('hardware');
        return;
      case 'wifi':
        setStep('device');
        return;
      case 'sensors':
        setStep('wifi');
        return;
      case 'register':
        setStep('sensors');
        return;
      default:
        navigate('/home');
    }
  }

  const sheetsPerM2 = calcSheetsPerM2(sheets, areaM2);

  return (
    <div className="no-scrollbar h-full w-full overflow-y-auto bg-brand-50">
      {step !== 'intro' && step !== 'complete' && step !== 'batch' && (
        <StepHeader step={step} onBack={handleBack} />
      )}

      {/* ---------------- Intro ---------------- */}
      {step === 'intro' && (
        <div className="flex h-full flex-col items-center justify-center px-9 pt-10 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-100 text-brand-600">
            <Flame className="h-9 w-9" strokeWidth={1.6} />
          </div>
          <h1 className="mt-6 text-xl font-bold text-brand-900">
            Smart Smokehouse
          </h1>
          <p className="mt-2 max-w-64 text-[13px] leading-relaxed text-neutral-500">
            Let&apos;s get your smokehouse connected. This one-time setup
            takes about five minutes.
          </p>
          <button
            type="button"
            onClick={() => setStep('hardware')}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-[13.5px] font-semibold text-white transition active:scale-[0.98]"
          >
            Set Up New Smokehouse
            <ChevronRight className="h-4 w-4" strokeWidth={2.4} />
          </button>
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="mt-3 text-[12px] font-semibold text-brand-400"
          >
            Not now
          </button>
        </div>
      )}

      {/* ---------------- Step 1: Connect Hardware ---------------- */}
      {step === 'hardware' && (
        <div className="px-5 pt-4 pb-8">
          <p className="text-[13px] leading-relaxed text-neutral-500">
            Place the two sensors for each layer as shown below, from the
            heat source upward.
          </p>

          <div className="mt-4 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-brand-100">
            {[
              { label: 'Layer 3', sub: 'L3-T + L3-H', pos: 'Top' },
              { label: 'Layer 2', sub: 'L2-T + L2-H', pos: 'Middle' },
              { label: 'Layer 1', sub: 'L1-T + L1-H', pos: 'Bottom' },
            ].map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-4 py-3.5 ${i > 0 ? 'border-t border-brand-50' : ''}`}
              >
                <div>
                  <p className="text-[13px] font-bold text-brand-900">
                    {row.label}
                  </p>
                  <p className="text-[10.5px] text-neutral-400">{row.pos}</p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
                  <Thermometer className="h-3 w-3" strokeWidth={2.2} />
                  <Droplets className="h-3 w-3" strokeWidth={2.2} />
                  {row.sub}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-center gap-2 bg-brand-900 px-4 py-3 text-[12px] font-semibold text-white">
              <Flame className="h-3.5 w-3.5" strokeWidth={2.2} />
              Heat Source
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {[
              'Place L1-T and L1-H in Layer 1',
              'Place L2-T and L2-H in Layer 2',
              'Place L3-T and L3-H in Layer 3',
            ].map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-400"
                  strokeWidth={2}
                />
                <p className="text-[12.5px] text-neutral-600">{line}</p>
              </div>
            ))}
          </div>

          <label className="mt-5 flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-brand-100">
            <input
              type="checkbox"
              checked={hardwareChecked}
              onChange={(e) => setHardwareChecked(e.target.checked)}
              className="h-5 w-5 shrink-0 rounded border-brand-300 text-brand-600 accent-brand-600"
            />
            <span className="text-[12.5px] font-semibold text-brand-900">
              I have connected all six sensors.
            </span>
          </label>

          <button
            type="button"
            disabled={!hardwareChecked}
            onClick={() => setStep('device')}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-[13.5px] font-semibold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-brand-200"
          >
            Continue
          </button>
        </div>
      )}

      {/* ---------------- Step 2: Connect Device ---------------- */}
      {step === 'device' && (
        <div className="px-5 pt-4 pb-8">
          <div className="rounded-3xl bg-linear-to-br from-brand-500 via-brand-600 to-brand-700 p-4 text-white shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                <Power className="h-4.5 w-4.5" strokeWidth={1.8} />
              </div>
              <p className="text-[14px] font-bold">
                Turn on the RubberSense Smokehouse Device
              </p>
            </div>
            <p className="mt-2 text-[11.5px] leading-relaxed text-white/85">
              The device will create a temporary Wi-Fi network for setup
              only &mdash; you won&apos;t need to enter any IP address.
            </p>
          </div>

          <div className="mt-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            <p className="mb-3 text-[13px] font-bold text-brand-900">
              Connect your phone to the device
            </p>
            <ol className="space-y-2.5">
              {[
                'Turn on the RubberSense Smokehouse Device.',
                'Open your phone’s Wi-Fi settings.',
                `Find "RubberSense-Setup-${setupCode}".`,
                'Connect to it.',
                'Return to RubberSense.',
              ].map((line, i) => (
                <li key={line} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[10.5px] font-bold text-brand-600">
                    {i + 1}
                  </span>
                  <p className="text-[12.5px] leading-snug text-neutral-600">
                    {line}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {!deviceConnecting ? (
            <button
              type="button"
              onClick={() => {
                setDeviceConnecting(true);
                after(1700, () => {
                  setDeviceConnecting(false);
                  setStep('wifi');
                });
              }}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-[13.5px] font-semibold text-white transition active:scale-[0.98]"
            >
              <Wifi className="h-4 w-4" strokeWidth={2.2} />
              I&apos;ve Connected to the Device
            </button>
          ) : (
            <div className="mt-5 flex flex-col items-center justify-center rounded-2xl bg-white py-6 shadow-sm ring-1 ring-brand-100">
              <Loader2
                className="h-7 w-7 animate-spin text-brand-500"
                strokeWidth={2}
              />
              <p className="mt-3 text-[12.5px] font-semibold text-brand-800">
                Checking device connection&hellip;
              </p>
            </div>
          )}
        </div>
      )}

      {/* ---------------- Step 3: Configure Wi-Fi ---------------- */}
      {step === 'wifi' && (
        <div className="px-5 pt-4 pb-8">
          <p className="text-[13px] leading-relaxed text-neutral-500">
            Enter your farm Wi-Fi details so the device can send readings to
            RubberSense.
          </p>

          <div className="mt-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            <p className="mb-1.5 text-[11.5px] font-semibold text-brand-500">
              Wi-Fi Network
            </p>
            <button
              type="button"
              onClick={() => setWifiListOpen((o) => !o)}
              className="flex w-full items-center justify-between rounded-2xl bg-brand-50 px-3.5 py-3 text-left"
            >
              <span className="flex items-center gap-2 text-[13px] font-semibold text-brand-900">
                <Wifi className="h-4 w-4 text-brand-500" strokeWidth={2} />
                {wifiNetwork ?? 'Select Wi-Fi Network'}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-brand-400 transition-transform ${wifiListOpen ? 'rotate-180' : ''}`}
                strokeWidth={2.2}
              />
            </button>

            {wifiListOpen && (
              <div className="mt-2 overflow-hidden rounded-2xl ring-1 ring-brand-100">
                {WIFI_NETWORKS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      setWifiNetwork(n);
                      setWifiListOpen(false);
                    }}
                    className="flex w-full items-center gap-2 border-b border-brand-50 bg-white px-3.5 py-2.5 text-left text-[12.5px] font-medium text-neutral-600 last:border-b-0 active:bg-brand-50"
                  >
                    <Wifi className="h-3.5 w-3.5 text-brand-400" strokeWidth={2} />
                    {n}
                  </button>
                ))}
              </div>
            )}

            <p className="mb-1.5 mt-4 text-[11.5px] font-semibold text-brand-500">
              Password
            </p>
            <div className="flex items-center gap-2 rounded-2xl bg-brand-50 px-3.5 py-3">
              <Lock className="h-4 w-4 text-brand-500" strokeWidth={2} />
              <input
                type="password"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                placeholder="Enter Wi-Fi password"
                className="w-full bg-transparent text-[13px] font-medium text-brand-900 outline-none placeholder:text-neutral-400"
              />
            </div>
          </div>

          <button
            type="button"
            disabled={!wifiNetwork || wifiPassword.length === 0}
            onClick={() => setStep('verifying')}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-[13.5px] font-semibold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-brand-200"
          >
            Connect
          </button>
        </div>
      )}

      {/* ---------------- Verifying connection ---------------- */}
      {step === 'verifying' && (
        <div className="px-5 pt-6 pb-8">
          <p className="mb-4 text-center text-[13px] font-bold text-brand-900">
            Verifying Connection
          </p>
          <div className="space-y-2.5">
            {(
              [
                ['device', 'Device'],
                ['internet', 'Internet'],
                ['cloud', 'RubberSense Cloud'],
              ] as const
            ).map(([key, label]) => {
              const s = verify[key];
              return (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-brand-100"
                >
                  <span className="text-[13px] font-semibold text-brand-900">
                    {label}
                  </span>
                  {s === 'pending' && (
                    <Circle className="h-4 w-4 text-neutral-300" strokeWidth={2} />
                  )}
                  {s === 'active' && (
                    <Loader2 className="h-4 w-4 animate-spin text-brand-500" strokeWidth={2} />
                  )}
                  {s === 'done' && (
                    <span className="flex items-center gap-1 text-[12px] font-bold text-brand-600">
                      <CheckCircle2 className="h-4 w-4" strokeWidth={2.2} />
                      Connected
                    </span>
                  )}
                  {s === 'failed' && (
                    <span className="flex items-center gap-1 text-[12px] font-bold text-rose-600">
                      <XCircle className="h-4 w-4" strokeWidth={2.2} />
                      Failed
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {verify.internet === 'failed' && (
            <div className="mt-4 rounded-2xl bg-rose-50 p-3.5 text-center">
              <p className="text-[12.5px] font-semibold text-rose-700">
                Couldn&apos;t reach the internet. Check the Wi-Fi password
                and try again.
              </p>
              <button
                type="button"
                onClick={runVerification}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 py-3 text-[13px] font-semibold text-white active:scale-[0.98]"
              >
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.2} />
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* ---------------- Detecting sensors ---------------- */}
      {step === 'detecting' && (
        <div className="flex h-[calc(100%-97px)] flex-col items-center justify-center px-9 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-500" strokeWidth={2} />
          <p className="mt-4 text-[14px] font-bold text-brand-900">
            Detecting Sensors&hellip;
          </p>
          <p className="mt-1 text-[11.5px] text-neutral-400">
            Reading ESP32 channel configuration
          </p>
        </div>
      )}

      {/* ---------------- Step 5: Verify 6 Sensors ---------------- */}
      {step === 'sensors' && (
        <div className="px-5 pt-4 pb-8">
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-brand-100">
            {SENSOR_CHECKS.map((s, i) => {
              const result = sensorResults[s.key];
              return (
                <div
                  key={s.key}
                  className={`flex items-center justify-between px-4 py-3 ${i > 0 ? 'border-t border-brand-50' : ''}`}
                >
                  <span className="text-[12.5px] font-semibold text-brand-900">
                    {s.label}
                  </span>
                  {result === 'pass' ? (
                    <span className="flex items-center gap-1.5 text-[12px] font-bold text-brand-600">
                      {s.reading}
                      <CheckCircle2 className="h-4 w-4" strokeWidth={2.2} />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[12px] font-bold text-rose-600">
                      Not Detected
                      <XCircle className="h-4 w-4" strokeWidth={2.2} />
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {allSensorsPass ? (
            <button
              type="button"
              onClick={() => setStep('register')}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-[13.5px] font-semibold text-white transition active:scale-[0.98]"
            >
              Continue
            </button>
          ) : (
            <div className="mt-4 rounded-2xl bg-rose-50 p-3.5">
              <p className="text-[12.5px] font-semibold text-rose-700">
                {failedSensor?.label} &mdash; Sensor Not Detected
              </p>
              <p className="mt-1 text-[11.5px] text-rose-600">
                Please check the connection for this sensor.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('detecting')}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-rose-600 py-2.5 text-[12px] font-semibold text-white active:scale-[0.98]"
                >
                  <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.2} />
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={() => setStep('hardware')}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white py-2.5 text-[12px] font-semibold text-rose-700 ring-1 ring-rose-200 active:scale-[0.98]"
                >
                  View Setup Instructions
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- Step 6: Register Smokehouse ---------------- */}
      {step === 'register' && (
        <div className="px-5 pt-4 pb-8">
          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            <p className="mb-1.5 text-[11.5px] font-semibold text-brand-500">
              Smokehouse Name
            </p>
            <input
              type="text"
              value={smokehouseName}
              onChange={(e) => setSmokehouseName(e.target.value)}
              className="w-full rounded-2xl bg-brand-50 px-3.5 py-3 text-[13px] font-semibold text-brand-900 outline-none"
            />

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl bg-brand-50 p-3 text-center">
                <p className="text-[18px] font-bold text-brand-900">3</p>
                <p className="text-[10.5px] text-neutral-500">Layers</p>
              </div>
              <div className="rounded-2xl bg-brand-50 p-3 text-center">
                <p className="text-[18px] font-bold text-brand-600">6 / 6</p>
                <p className="text-[10.5px] text-neutral-500">
                  Sensors Connected
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={smokehouseName.trim().length === 0}
            onClick={() => setStep('complete')}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-[13.5px] font-semibold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-brand-200"
          >
            Complete Setup
          </button>
        </div>
      )}

      {/* ---------------- Setup complete ---------------- */}
      {step === 'complete' && (
        <div className="flex h-full flex-col items-center justify-center px-9 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-100 text-brand-600">
            <PartyPopper className="h-9 w-9" strokeWidth={1.6} />
          </div>
          <h1 className="mt-6 text-xl font-bold text-brand-900">
            Setup Complete!
          </h1>
          <p className="mt-2 max-w-64 text-[13px] leading-relaxed text-neutral-500">
            <strong className="text-brand-700">{smokehouseName}</strong> is
            connected with all 6 sensors online and Wi-Fi configured.
          </p>
          <button
            type="button"
            onClick={() => setStep('batch')}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-[13.5px] font-semibold text-white transition active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4" strokeWidth={2.2} />
            Start New Drying Batch
          </button>
        </div>
      )}

      {/* ---------------- Start batch ---------------- */}
      {step === 'batch' && (
        <div className="flex h-full flex-col px-9 pb-8 pt-14">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-100 text-brand-600">
            <Package className="h-7 w-7" strokeWidth={1.6} />
          </div>
          <h1 className="mt-5 text-lg font-bold text-brand-900">
            Start New Drying Batch
          </h1>
          <p className="mt-1 text-[12.5px] leading-relaxed text-neutral-500">
            Enter today&apos;s batch information to begin hourly monitoring.
          </p>

          <div className="mt-6 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[12.5px] font-semibold text-brand-900">
                  Number of Sheets
                </p>
                <span className="text-[13px] font-bold text-brand-700">
                  {sheets}
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={300}
                step={10}
                value={sheets}
                onChange={(e) => setSheets(Number(e.target.value))}
                className="brand-slider mt-2.5"
                style={{
                  background: `linear-gradient(to right, var(--color-brand-500) ${((sheets - 50) / 250) * 100}%, var(--color-brand-100) ${((sheets - 50) / 250) * 100}%)`,
                }}
              />
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <p className="text-[12.5px] font-semibold text-brand-900">
                  Layer Area
                </p>
                <span className="text-[13px] font-bold text-brand-700">
                  {areaM2}m&sup2;
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={12}
                step={0.5}
                value={areaM2}
                onChange={(e) => setAreaM2(Number(e.target.value))}
                className="brand-slider mt-2.5"
                style={{
                  background: `linear-gradient(to right, var(--color-brand-500) ${((areaM2 - 2) / 10) * 100}%, var(--color-brand-100) ${((areaM2 - 2) / 10) * 100}%)`,
                }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-brand-50 px-3.5 py-3">
              <span className="flex items-center gap-1.5 text-[12px] font-semibold text-brand-700">
                <ClipboardList className="h-4 w-4" strokeWidth={2} />
                Sheets / m&sup2;
              </span>
              <span className="text-[14px] font-bold text-brand-900">
                {sheetsPerM2.toFixed(1)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onComplete({ smokehouseName, sheets, areaM2 })
            }
            className="mt-auto flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-[13.5px] font-semibold text-white transition active:scale-[0.98]"
          >
            <Flame className="h-4 w-4" strokeWidth={2.2} />
            Start Drying
          </button>
        </div>
      )}
    </div>
  );
}
