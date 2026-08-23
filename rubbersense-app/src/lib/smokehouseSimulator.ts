import type { Layer, RiskLevel } from '../data/smokehouse';

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function jitter(range: number) {
  return (Math.random() * 2 - 1) * range;
}

function deriveRisk(layer: Layer, tempDelta: number, newTemp: number): RiskLevel {
  if (layer.id === 1) {
    // Layer 1 is scripted to escalate toward Critical so the fire-risk
    // alarm is reliably demonstrable within a short viewing window.
    if (layer.status === 'critical') return 'critical';
    if (newTemp >= 84 || (layer.status === 'warning' && tempDelta > 0.7)) {
      return 'critical';
    }
    if (newTemp >= 74 || tempDelta > 0.7) return 'warning';
    return 'normal';
  }
  // Other layers fluctuate gently; an occasional sharp jump can trip a
  // brief warning for realism, but they recover on their own.
  if (tempDelta > 1.6) return 'warning';
  return 'normal';
}

function noteFor(status: RiskLevel, layerId: number): string {
  if (status === 'critical') {
    return 'Temperature has crossed a critical threshold. Inspect the heat source immediately.';
  }
  if (status === 'warning') {
    return 'Temperature is climbing faster than usual for this stage of drying.';
  }
  return layerId === 3
    ? 'Cooler and slower to dry, as expected for the top layer.'
    : 'Steady rise, tracking the expected drying curve.';
}

// Advances one layer forward by one simulated tick.
export function tickLayer(layer: Layer): Layer {
  const tempDelta =
    layer.id === 1
      ? layer.status === 'critical'
        ? jitter(0.4)
        : 0.9 + Math.random() * 0.7
      : jitter(0.6);

  const humidityDelta =
    layer.id === 1 && layer.status !== 'critical'
      ? -(0.6 + Math.random() * 1.2)
      : jitter(1.2);

  const temperature = clamp(layer.temperature + tempDelta, 30, 130);
  const humidity = clamp(layer.humidity + humidityDelta, 20, 95);
  const remainingHours = clamp(
    layer.remainingHours - (0.15 + Math.random() * 0.1),
    0,
    40,
  );
  const status = deriveRisk(layer, tempDelta, temperature);

  return {
    ...layer,
    temperature,
    humidity,
    tempChange1h: Math.round(tempDelta * 10) / 10,
    humidityChange1h: Math.round(humidityDelta * 10) / 10,
    remainingHours,
    elapsedHours: layer.elapsedHours + 0.25,
    status,
    trend: [...layer.trend.slice(1), temperature],
    note: noteFor(status, layer.id),
  };
}
