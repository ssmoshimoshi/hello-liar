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
          <SwipeFeed selectedCategories={selectedCategories} />
        </div>
      )}

      {/* Decorative background typography to retain the brutalist aesthetic */}
      <div className="absolute inset-0 pointer-events-none opacity-5 flex flex-col items-center justify-center overflow-hidden z-0">
        <h1 className="text-[15vw] font-discipline tracking-tighter whitespace-nowrap leading-none select-none">
          EVERYONE LIES
        </h1>
        <h1 className="text-[15vw] font-discipline tracking-tighter whitespace-nowrap leading-none select-none">
          SOME WRITE IT DOWN
        </h1>
      </div>
    </div>
  );
}
