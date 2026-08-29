export interface CaptureFeatures {
  ampPeak: number; // 0 - 1 Peak RMS amplitude during impact
  dominantFreqHz: number; // Primary acoustic resonance peak in Hz
  spectralCentroidHz: number; // Center of mass of the frequency spectrum in Hz
  dampingRatio: number; // Energy decay speed (0 - 1)
  snrDb?: number; // Signal-to-noise ratio in decibels
  fftSpectrum?: number[]; // Sub-sampled 32-bin frequency magnitude array for spectrum visualization
}

// ─── Hanning Window Function (Document 1, Section 2) ─────────────────────────
// Multiplies the segmented time-domain signal by a Hanning (Hann) window
// to reduce spectral leakage prior to FFT computation:
// w(n) = 0.5 * (1 - cos(2 * pi * n / (N - 1)))
export function applyHanningWindow(timeData: Float32Array): Float32Array {
  const N = timeData.length;
  const windowed = new Float32Array(N);
  for (let n = 0; n < N; n++) {
    const w = 0.5 * (1 - Math.cos((2 * Math.PI * n) / (N - 1)));
    windowed[n] = timeData[n] * w;
  }
  return windowed;
}

export function computeRms(timeData: Uint8Array): number {
  let sumSq = 0;
  for (let i = 0; i < timeData.length; i++) {
    const v = (timeData[i] - 128) / 128;
    sumSq += v * v;
  }
  return Math.sqrt(sumSq / timeData.length);
}

export function dominantFrequency(
  freqData: Uint8Array,
  sampleRate: number,
  fftSize: number,
): number {
  let maxVal = -1;
  let maxIdx = 1; // skip DC bin 0
  for (let i = 1; i < freqData.length; i++) {
    if (freqData[i] > maxVal) {
      maxVal = freqData[i];
      maxIdx = i;
    }
  }
  return (maxIdx * sampleRate) / fftSize;
}

export function spectralCentroid(
  freqData: Uint8Array,
  sampleRate: number,
  fftSize: number,
): number {
  let num = 0;
  let den = 0;
  for (let i = 1; i < freqData.length; i++) {
    const freq = (i * sampleRate) / fftSize;
    num += freq * freqData[i];
    den += freqData[i];
  }
  return den > 0 ? num / den : 1000;
}

export function extractSubsampledSpectrum(freqData: Uint8Array, binsCount: number = 32): number[] {
  const step = Math.floor(freqData.length / binsCount);
  const result: number[] = [];
  for (let i = 0; i < binsCount; i++) {
    let sum = 0;
    for (let j = 0; j < step; j++) {
      sum += freqData[i * step + j] || 0;
    }
    result.push(Math.round(sum / step));
  }
  return result;
}

export async function requestMicStream(): Promise<MediaStream | null> {
  if (!navigator.mediaDevices?.getUserMedia) return null;
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });
  } catch {
    return null;
  }
}
