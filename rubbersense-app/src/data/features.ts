import type { LucideIcon } from 'lucide-react';
import { Sprout, FlaskConical, Droplets, Flame } from 'lucide-react';

export interface Feature {
  path: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
}

export const FEATURES: Feature[] = [
  {
    path: '/plant-health',
    title: "How's Today Your Rubber Plant?",
    subtitle: 'Weather & tapping advisory',
    description:
      'Weather-sensitive tap / do-not-tap recommendations, DRC stress level and bark-rot risk for your trees today.',
    icon: Sprout,
  },
  {
    path: '/latex',
    title: "Let's Set the Latex",
    subtitle: 'Coagulation decision support',
    description:
      'Enter your Metrolac reading, temperature and volume to get a temperature-corrected DRC and dosage recommendation.',
    icon: FlaskConical,
  },
  {
    path: '/moisture',
    title: 'Moisture Check',
    subtitle: 'Acoustic moisture assessment for processed rubber sheets',
    description:
      'IoT-based acoustic moisture prediction for processed rubber sheets using ESP32 node and standard tapping tool.',
    icon: Droplets,
  },
  {
    path: '/smokehouse',
    title: 'Smart Smokehouse',
    subtitle: 'Drying & fire-risk monitor',
    description:
      'Live layer-wise temperature, humidity, remaining drying time and fire-risk status for your smokehouse.',
    icon: Flame,
  },
];
