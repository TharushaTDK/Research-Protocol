import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mic,
  Loader2,
  Gauge,
  AudioLines,
  Waves,
  Activity,
  Wallet,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  requestMicStream,
  computeRms,
  dominantFrequency,
  spectralCentroid,
  type CaptureFeatures,
} from '../lib/acousticListener';
import {
  LISTENING_HINTS,
  RETRY_MESSAGES,
  classifyClarity,
  simulateTapCapture,
  computeQuality,
  QUALITY_TONE_STYLES,
  estimateSheetPrice,
} from '../data/moisture';

type Stage = 'idle' | 'listening' | 'checking' | 'analyzing' | 'result';

const HINT_INTERVAL_MS = 6500;
const CAPTURE_WINDOW_MS = 450;
const TAIL_START_MS = 250;

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export default function MoistureScreen() {
  const navigate = useNavigate();

  const [stage, setStage] = useState<Stage>('idle');
  const [hintIndex, setHintIndex] = useState(0);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);
  const [features, setFeatures] = useState<CaptureFeatures | null>(null);
  const [showPrice, setShowPrice] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);

  const stageRef = useRef<Stage>('idle');
  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  // --- Audio graph refs (kept outside React state for 60fps updates) ---
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  const baselineRef = useRef(0.04);
  const levelRef = useRef(0);
  const capturingRef = useRef(false);
  const captureStartRef = useRef(0);
  const capturePeakRef = useRef(0);
  const capturePeakFreqRef = useRef<Uint8Array | null>(null);
  const captureTailRef = useRef<number[]>([]);

  const ring1 = useRef<HTMLDivElement | null>(null);
  const ring2 = useRef<HTMLDivElement | null>(null);
  const ring3 = useRef<HTMLDivElement | null>(null);
  const core = useRef<HTMLDivElement | null>(null);

  function stopAudio() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    analyserRef.current = null;
  }

  useEffect(() => stopAudio, []);

  function applyRingStyles(level: number) {
    const s1 = 1 + level * 0.9;
    const s2 = 1 + level * 1.6;
    const s3 = 1 + level * 2.3;
    if (ring1.current) ring1.current.style.transform = `scale(${s1})`;
    if (ring2.current) ring2.current.style.transform = `scale(${s2})`;
    if (ring3.current)
      ring3.current.style.transform = `scale(${s3})`;
    if (ring2.current) ring2.current.style.opacity = `${0.35 - level * 0.15}`;
    if (ring3.current) ring3.current.style.opacity = `${0.2 - level * 0.1}`;
    if (core.current) core.current.style.transform = `scale(${1 + level * 0.15})`;
  }

  function handleTapCaptured(f: CaptureFeatures) {
    setFeatures(f);
    setStage('checking');
  }

  function tick() {
    const analyser = analyserRef.current;
    if (!analyser) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    const timeData = new Uint8Array(analyser.fftSize);
    const freqData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(timeData);
    analyser.getByteFrequencyData(freqData);
    const rms = computeRms(timeData);

    if (!capturingRef.current) {
      baselineRef.current = baselineRef.current * 0.98 + rms * 0.02;
    }
    levelRef.current = levelRef.current * 0.7 + rms * 0.3;
    if (stageRef.current === 'listening') {
      applyRingStyles(clamp(levelRef.current * 6, 0, 1));
    }

    if (stageRef.current === 'listening') {
      const threshold = Math.max(0.09, baselineRef.current * 2.6 + 0.05);
      if (!capturingRef.current && rms > threshold) {
        capturingRef.current = true;
        captureStartRef.current = performance.now();
        capturePeakRef.current = rms;
        capturePeakFreqRef.current = freqData.slice();
        captureTailRef.current = [];
      } else if (capturingRef.current) {
        if (rms > capturePeakRef.current) {
          capturePeakRef.current = rms;
          capturePeakFreqRef.current = freqData.slice();
        }
        const elapsed = performance.now() - captureStartRef.current;
        if (elapsed > TAIL_START_MS) captureTailRef.current.push(rms);
        if (elapsed > CAPTURE_WINDOW_MS) {
          capturingRef.current = false;
          const tail = captureTailRef.current;
          const tailAvg = tail.length
            ? tail.reduce((a, b) => a + b, 0) / tail.length
            : capturePeakRef.current * 0.5;
          const dampingRatio = clamp(
            1 - tailAvg / Math.max(capturePeakRef.current, 0.0001),
            0,
            1,
          );
          const peakFreq = capturePeakFreqRef.current;
          const sampleRate = audioCtxRef.current?.sampleRate ?? 44100;
          const fftSize = analyser.fftSize;
          const f: CaptureFeatures = {
            ampPeak: capturePeakRef.current,
            dominantFreqHz: peakFreq
              ? dominantFrequency(peakFreq, sampleRate, fftSize)
              : 500,
            spectralCentroidHz: peakFreq
              ? spectralCentroid(peakFreq, sampleRate, fftSize)
              : 800,
            dampingRatio,
          };
          handleTapCaptured(f);
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }

  async function handleStartListening() {
    setRetryMessage(null);
    setStage('listening');
    setHintIndex(0);

    if (!audioCtxRef.current) {
      const stream = await requestMicStream();
      if (stream) {
        streamRef.current = stream;
        const ctx = new AudioContext();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.6;
        source.connect(analyser);
        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
      }
    }

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }

  function handleSimulateTap() {
    if (stage !== 'listening') return;
    handleTapCaptured(simulateTapCapture());
  }

  // Rotate idle hints while waiting for a tap. A retry message (shown after
  // a failed clarity check) takes over the display until the next tick,
  // then fades back into the normal rotating hints.
  useEffect(() => {
    if (stage !== 'listening') return;
    const id = window.setInterval(() => {
      setHintIndex((i) => (i + 1) % LISTENING_HINTS.length);
      setRetryMessage(null);
    }, HINT_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [stage]);

  // Stage: checking audio clarity (first model)
  useEffect(() => {
    if (stage !== 'checking' || !features) return;
    const t = window.setTimeout(() => {
      const clarity = classifyClarity(features.ampPeak);
      if (clarity === 'clear') {
        setStage('analyzing');
      } else {
        setRetryMessage(RETRY_MESSAGES[clarity]);
        setStage('listening');
      }
    }, 1500);
    return () => window.clearTimeout(t);
  }, [stage, features]);

  // Stage: analyzing sheet quality (second model)
  useEffect(() => {
    if (stage !== 'analyzing') return;
    const t = window.setTimeout(() => setStage('result'), 1800);
    return () => window.clearTimeout(t);
  }, [stage]);

  function handleReset() {
    setFeatures(null);
    setShowPrice(false);
    setPriceLoading(false);
    setRetryMessage(null);
    setStage('idle');
  }

  function handlePredictPrice() {
    setPriceLoading(true);
    window.setTimeout(() => {
      setPriceLoading(false);
      setShowPrice(true);
    }, 1500);
  }

  const quality = features ? computeQuality(features) : null;
  const price = quality ? estimateSheetPrice(quality.qualityScore) : null;

  return (
    <div className="no-scrollbar h-full w-full overflow-y-auto bg-brand-50">
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
            How&apos;s the Moisture
          </p>
          <p className="text-[11px] text-neutral-400">
            Acoustic sheet quality test
          </p>
        </div>
      </div>

      {/* Listening / idle / checking / analyzing */}
      {stage !== 'result' && (
        <div className="flex h-[calc(100%-73px)] flex-col items-center justify-center px-9 text-center">
          {(stage === 'idle' || stage === 'listening') && (
            <>
              <button
                type="button"
                onClick={
                  stage === 'idle' ? handleStartListening : handleSimulateTap
                }
                aria-label={
                  stage === 'idle' ? 'Start listening' : 'Simulate a tap'
                }
                className="relative flex h-36 w-36 items-center justify-center"
              >
                <div
                  ref={ring3}
                  className="absolute inset-0 rounded-full bg-brand-300/20"
                />
                <div
                  ref={ring2}
                  className="absolute inset-3 rounded-full bg-brand-400/25"
                />
                <div
                  ref={ring1}
                  className="absolute inset-7 rounded-full bg-brand-500/30"
                />
                <div
                  ref={core}
                  className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-brand-500 to-brand-700 shadow-lg transition-transform ${
                    stage === 'listening' ? 'animate-pulse' : ''
                  }`}
                >
                  <Mic className="h-8 w-8 text-white" strokeWidth={1.8} />
                </div>
              </button>

              <p className="mt-7 text-[15px] font-bold text-brand-900">
                {stage === 'idle' ? 'Tap to Start Listening' : 'Listening…'}
              </p>

              {stage === 'listening' && (
                <p className="mt-2 min-h-[34px] max-w-64 text-[12.5px] leading-relaxed text-neutral-500">
                  {retryMessage ?? LISTENING_HINTS[hintIndex]}
                </p>
              )}
              {stage === 'idle' && (
                <p className="mt-2 max-w-60 text-[12.5px] leading-relaxed text-neutral-400">
                  Hold your phone near the rubber sheet and tap it with your
                  stick.
                </p>
              )}
              {stage === 'listening' && (
                <p className="mt-6 text-[11px] font-medium text-brand-400">
                  Or tap the circle above to simulate a tap
                </p>
              )}
            </>
          )}

          {stage === 'checking' && (
            <>
              <Loader2
                className="h-10 w-10 animate-spin text-brand-500"
                strokeWidth={2}
              />
              <p className="mt-4 text-[14px] font-bold text-brand-900">
                Checking Sound Quality&hellip;
              </p>
              <p className="mt-1 text-[11.5px] text-neutral-400">
                Making sure the tap was recorded clearly
              </p>
            </>
          )}

          {stage === 'analyzing' && (
            <>
              <Loader2
                className="h-10 w-10 animate-spin text-brand-500"
                strokeWidth={2}
              />
              <p className="mt-4 text-[14px] font-bold text-brand-900">
                Analysing Sheet Sound&hellip;
              </p>
              <p className="mt-1 text-[11.5px] text-neutral-400">
                Estimating quality and dryness
              </p>
            </>
          )}
        </div>
      )}

      {/* Result */}
      {stage === 'result' && quality && (
        <div className="px-5 pb-10 pt-4">
          {/* Quality */}
          <div
            className={`rounded-3xl bg-linear-to-br p-4 text-white shadow-sm ${QUALITY_TONE_STYLES[quality.tone].card}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-white/80">
                Sheet Quality
              </p>
              <span
                className={`rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm`}
              >
                {Math.round(quality.qualityScore)}/100
              </span>
            </div>
            <p className="mt-1.5 text-[26px] font-bold leading-tight">
              {quality.label}
            </p>
            <p className="mt-2 text-[11.5px] leading-relaxed text-white/90">
              {quality.instructions}
            </p>
          </div>

          {/* Dryness */}
          <div className="mt-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Gauge className="h-4.5 w-4.5" strokeWidth={1.8} />
              </div>
              <p className="text-[13px] font-bold text-brand-900">
                Estimated Dryness
              </p>
            </div>
            <p className="mt-3 text-[30px] font-bold leading-none text-brand-900">
              {Math.round(quality.drynessPercent)}
              <span className="text-lg font-semibold text-neutral-400">%</span>
            </p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-brand-50">
              <div
                className={`h-full rounded-full ${QUALITY_TONE_STYLES[quality.tone].bar}`}
                style={{ width: `${quality.drynessPercent}%` }}
              />
            </div>
          </div>

          {/* Acoustic features */}
          {features && (
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              <div className="flex flex-col items-center gap-1 rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-brand-100">
                <AudioLines className="h-4 w-4 text-brand-500" strokeWidth={2} />
                <span className="text-[11.5px] font-bold text-brand-900">
                  {Math.round(features.dominantFreqHz)}Hz
                </span>
                <span className="text-[9px] text-neutral-400">Dominant Freq.</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-brand-100">
                <Waves className="h-4 w-4 text-brand-500" strokeWidth={2} />
                <span className="text-[11.5px] font-bold text-brand-900">
                  {Math.round(features.spectralCentroidHz)}Hz
                </span>
                <span className="text-[9px] text-neutral-400">Spectral Centroid</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-brand-100">
                <Activity className="h-4 w-4 text-brand-500" strokeWidth={2} />
                <span className="text-[11.5px] font-bold text-brand-900">
                  {features.dampingRatio.toFixed(2)}
                </span>
                <span className="text-[9px] text-neutral-400">Damping Ratio</span>
              </div>
            </div>
          )}

          {/* Price */}
          <div className="mt-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Wallet className="h-4.5 w-4.5" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-brand-900">
                  Sheet Price Estimate
                </p>
                <p className="text-[11px] text-neutral-400">
                  Based on predicted quality grade
                </p>
              </div>
            </div>

            {!showPrice && !priceLoading && (
              <button
                type="button"
                onClick={handlePredictPrice}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3 text-[13px] font-semibold text-white transition active:scale-[0.98]"
              >
                <Sparkles className="h-4 w-4" strokeWidth={2.2} />
                Predict Sheet Price
              </button>
            )}

            {priceLoading && (
              <div className="mt-3 flex flex-col items-center justify-center rounded-2xl bg-brand-50/60 py-6">
                <Loader2
                  className="h-6 w-6 animate-spin text-brand-500"
                  strokeWidth={2}
                />
                <p className="mt-2 text-[12px] font-semibold text-brand-800">
                  Estimating Price&hellip;
                </p>
              </div>
            )}

            {showPrice && price && (
              <div className="mt-3 rounded-2xl bg-brand-50 p-3.5">
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
                <p className="mt-2 text-[11px] leading-relaxed text-neutral-500">
                  Range Rs. {price.low}&ndash;{price.high}/kg &middot;
                  illustrative sample estimate.
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-brand-50 py-2.5 text-[12px] font-semibold text-brand-700 transition active:scale-[0.98]"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.2} />
            Test Another Sheet
          </button>
        </div>
      )}
    </div>
  );
}
