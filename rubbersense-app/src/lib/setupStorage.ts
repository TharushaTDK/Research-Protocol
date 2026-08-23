export interface BatchInfo {
  smokehouseName: string;
  sheets: number;
  areaM2: number;
}

const SETUP_KEY = 'rubbersense_smokehouse_setup_complete';
const BATCH_KEY = 'rubbersense_smokehouse_batch_info';

export function isSmokehouseSetupComplete(): boolean {
  try {
    return localStorage.getItem(SETUP_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markSmokehouseSetupComplete(batch: BatchInfo) {
  try {
    localStorage.setItem(SETUP_KEY, 'true');
    localStorage.setItem(BATCH_KEY, JSON.stringify(batch));
  } catch {
    // Storage unavailable (private browsing etc.) — the wizard still works
    // for this session, it just won't be remembered next visit.
  }
}

export function resetSmokehouseSetup() {
  try {
    localStorage.removeItem(SETUP_KEY);
    localStorage.removeItem(BATCH_KEY);
  } catch {
    // ignore
  }
}

export function getStoredBatchInfo(): BatchInfo | null {
  try {
    const raw = localStorage.getItem(BATCH_KEY);
    return raw ? (JSON.parse(raw) as BatchInfo) : null;
  } catch {
    return null;
  }
}
