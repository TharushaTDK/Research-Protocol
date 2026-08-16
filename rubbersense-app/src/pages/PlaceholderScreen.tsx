import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { Feature } from '../data/features';

interface PlaceholderScreenProps {
  feature: Feature;
}

export default function PlaceholderScreen({ feature }: PlaceholderScreenProps) {
  const navigate = useNavigate();
  const Icon = feature.icon;

  return (
    <div className="flex h-full w-full flex-col bg-brand-50">
      <div className="flex items-center gap-3 px-5 pb-4 pt-5">
        <button
          type="button"
          onClick={() => navigate('/home')}
          aria-label="Back to Home"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-700 shadow-sm ring-1 ring-brand-100 active:scale-95"
        >
          <ArrowLeft className="h-4.5 w-4.5" strokeWidth={2.2} />
        </button>
        <p className="text-[13px] font-semibold text-brand-800">Back to Home</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-9 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-100 text-brand-600">
          <Icon className="h-9 w-9" strokeWidth={1.6} />
        </div>
        <h1 className="mt-6 text-xl font-bold text-brand-900">
          {feature.title}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">{feature.subtitle}</p>
        <p className="mt-4 max-w-65 text-[13px] leading-relaxed text-neutral-500">
          {feature.description}
        </p>

        <div className="mt-7 flex items-center gap-1.5 rounded-full bg-brand-100 px-4 py-2 text-[12px] font-semibold text-brand-700">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} />
          Screen coming soon
        </div>
      </div>
    </div>
  );
}
