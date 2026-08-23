export interface CaptureFeatures {
  ampPeak: number; // 0-1, RMS amplitude at the loudest point of the tap
  dominantFreqHz: number;
  spectralCentroidHz: number;
  dampingRatio: number; // 0-1, how quickly the sound decayed after the peak
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
  let maxIdx = 0;
  for (let i = 0; i < freqData.length; i++) {
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
  for (let i = 0; i < freqData.length; i++) {
    const freq = (i * sampleRate) / fftSize;
    num += freq * freqData[i];
    den += freqData[i];
  }
  return den > 0 ? num / den : 0;
}

export async function requestMicStream(): Promise<MediaStream | null> {
  if (!navigator.mediaDevices?.getUserMedia) return null;
  try {
    return await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    return null;
  }
}
