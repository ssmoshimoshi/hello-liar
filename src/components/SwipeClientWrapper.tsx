'use client';

import { useState } from 'react';
import CategoryOnboarding from './CategoryOnboarding';
import SwipeFeed from './SwipeFeed';

export default function SwipeClientWrapper() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const handleOnboardingComplete = (categories: string[]) => {
    setSelectedCategories(categories);
    setOnboardingComplete(true);
  };

  return (
    <div className="w-full h-[100dvh] bg-background relative overflow-hidden flex flex-col">
      <CategoryOnboarding onComplete={handleOnboardingComplete} />
      {/* Only show the feed if onboarding is complete so it doesn't fetch prematurely */}
      {onboardingComplete && (
        <div className="flex-1 flex flex-col justify-center items-center px-4 w-full h-full relative z-10">
          <div className="mb-6 pointer-events-none">
            <p 
              className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-[var(--gray-400)] text-center" 
              style={{ fontFamily: 'var(--font-baskerville)' }}
            >
              Everyone lies. Some write it down.
            </p>
          </div>
          <SwipeFeed selectedCategories={selectedCategories} />
        </div>
      )}
    </div>
  );
}
