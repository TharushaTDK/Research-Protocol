export interface ImageStats {
  avgBrightness: number; // 0-255
  stdDev: number; // pixel-brightness spread, a proxy for unevenness/texture
}

export function analyzeImageFile(file: File): Promise<ImageStats> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    const cleanup = () => URL.revokeObjectURL(url);

    img.onload = () => {
      const size = 32;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        cleanup();
        resolve({ avgBrightness: 150, stdDev: 20 });
        return;
      }
      ctx.drawImage(img, 0, 0, size, size);
      const { data } = ctx.getImageData(0, 0, size, size);

      const samples: number[] = [];
      for (let i = 0; i < data.length; i += 4) {
        samples.push((data[i] + data[i + 1] + data[i + 2]) / 3);
      }
      const avgBrightness =
        samples.reduce((a, b) => a + b, 0) / samples.length;
      const variance =
        samples.reduce((a, b) => a + (b - avgBrightness) ** 2, 0) /
        samples.length;
      const stdDev = Math.sqrt(variance);

      cleanup();
      resolve({ avgBrightness, stdDev });
    };

    img.onerror = () => {
      cleanup();
      resolve({ avgBrightness: 150, stdDev: 20 });
    };

    img.src = url;
  });
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
