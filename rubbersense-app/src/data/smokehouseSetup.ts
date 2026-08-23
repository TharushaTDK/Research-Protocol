// Reference values pulled directly from
// RubberSense_Smokehouse_Farmer_Setup_and_Workflow.md so the setup wizard
// matches the documented farmer experience.

export const WIFI_NETWORKS = [
  'Kalutara_Estate_5G',
  'Kalutara_Estate_2.4G',
  'Neighbour_Estate_WiFi',
];

export interface SensorCheck {
  key: string;
  label: string;
  reading: string;
}

// Matches "13. Display Actual Sensor Readings" in the setup doc.
export const SENSOR_CHECKS: SensorCheck[] = [
  { key: 'l1t', label: 'L1 Temperature', reading: '68.4°C' },
  { key: 'l1h', label: 'L1 Humidity', reading: '62%' },
  { key: 'l2t', label: 'L2 Temperature', reading: '64.2°C' },
  { key: 'l2h', label: 'L2 Humidity', reading: '66%' },
  { key: 'l3t', label: 'L3 Temperature', reading: '58.7°C' },
  { key: 'l3h', label: 'L3 Humidity', reading: '71%' },
];

// Matches the "14. Failed Sensor Detection" example in the setup doc — used
// to occasionally demonstrate the retry path on the first detection pass.
export const EXAMPLE_FAILED_SENSOR_KEY = 'l2h';

export function calcSheetsPerM2(sheets: number, areaM2: number): number {
  if (!areaM2) return 0;
  return sheets / areaM2;
}
