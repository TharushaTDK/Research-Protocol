import { useState } from 'react';
import SmokehouseSetupWizard from './SmokehouseSetupWizard';
import SmokehouseScreen from './SmokehouseScreen';
import {
  isSmokehouseSetupComplete,
  markSmokehouseSetupComplete,
  resetSmokehouseSetup,
  type BatchInfo,
} from '../lib/setupStorage';

export default function SmokehouseFlow() {
  const [setupComplete, setSetupComplete] = useState(
    isSmokehouseSetupComplete,
  );

  function handleComplete(batch: BatchInfo) {
    markSmokehouseSetupComplete(batch);
    setSetupComplete(true);
  }

  function handleRedoSetup() {
    resetSmokehouseSetup();
    setSetupComplete(false);
  }

  if (!setupComplete) {
    return <SmokehouseSetupWizard onComplete={handleComplete} />;
  }
  return <SmokehouseScreen onRedoSetup={handleRedoSetup} />;
}
