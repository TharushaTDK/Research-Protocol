import type { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
}

/**
 * Decorative device bezel used to present each app screen as a mobile
 * mock-up on the web (for the project-proposal prototype demo).
 */
export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="relative mx-auto h-[812px] w-[375px] rounded-[52px] border-[10px] border-white bg-white shadow-[0_30px_60px_-15px_rgba(15,61,36,0.45)] ring-1 ring-black/5">
      {/* Notch */}
      <div className="absolute left-1/2 top-0 z-20 h-[26px] w-[140px] -translate-x-1/2 rounded-b-2xl bg-white" />
      <div className="absolute left-1/2 top-[6px] z-30 h-3 w-20 -translate-x-1/2 rounded-full bg-neutral-900/90" />

      {/* Screen */}
      <div className="relative h-full w-full overflow-hidden rounded-[42px] bg-white">
        {children}
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 z-30 h-1.5 w-32 -translate-x-1/2 rounded-full bg-neutral-900/80" />
    </div>
  );
}
