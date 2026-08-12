'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGarden } from '@/hooks/useGarden';
import { usePWA } from '@/hooks/usePWA';
import WelcomeScreen from '@/components/WelcomeScreen';
import WaterScreen from '@/components/WaterScreen';
import GardenScreen from '@/components/GardenScreen';
import GrowthScreen from '@/components/GrowthScreen';
import PassiveGrowthModal from '@/components/PassiveGrowthModal';
import BloomMoment from '@/components/BloomMoment';
import NamePlantModal from '@/components/NamePlantModal';
import InstallPrompt from '@/components/InstallPrompt';
import { GrowthStage } from '@/types/garden';

type Screen = 'loading' | 'welcome' | 'home' | 'watering' | 'moment' | 'growth';

export default function App() {
  const {
    garden,
    isLoading,
    hoursAway,
    hasPassiveGrowth,
    initGarden,
    completeWatering,
    dismissPassiveGrowth,
    updatePlantName,
  } = useGarden();

  const { showPrompt, promptInstall, dismissPrompt } = usePWA();

  const [screen, setScreen] = useState<Screen>('loading');
  const [prevStage, setPrevStage] = useState<GrowthStage | null>(null);
  const [showRename, setShowRename] = useState(false);   // ← lifted here

  // Resolve initial screen once data loads
  useEffect(() => {
    if (!isLoading) {
      setScreen(garden ? 'home' : 'welcome');
    }
  }, [isLoading, garden]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleStart = () => {
    initGarden();
    setScreen('home');
  };

  const handleWater = () => setScreen('watering');

  const handleWateringComplete = () => {
    if (garden) setPrevStage(garden.stage);
    completeWatering();
    setScreen('moment'); // BloomMoment — 2.7s calm transition
  };

  const handleWateringCancel = () => setScreen('home');

  // Called automatically after the BloomMoment resolves
  const handleMomentComplete = () => {
    if (prevStage !== null && garden && garden.stage !== prevStage) {
      setScreen('growth'); // Level-up → celebratory screen
    } else {
      setPrevStage(null);
      setScreen('home');
    }
  };

  const handleGrowthContinue = () => {
    setPrevStage(null);
    setScreen('home');
  };

  // Name modal — onSave only updates the name; the modal drives its own exit animation
  // and calls onClose() when the animation completes (avoids AnimatePresence safeToRemove issues)
  const handleRenameSave = (name: string) => {
    updatePlantName(name);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  if (screen === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fdf9f5]">
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="text-5xl"
        >
          🌱
        </motion.span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fdf9f5]">
      <AnimatePresence mode="wait">
        {screen === 'welcome' && (
          <WelcomeScreen key="welcome" onStart={handleStart} />
        )}

        {screen === 'home' && garden && (
          <GardenScreen
            key="home"
            garden={garden}
            hoursAway={hoursAway}
            onWater={handleWater}
            onOpenRename={() => setShowRename(true)}
          />
        )}

        {screen === 'watering' && (
          <WaterScreen
            key="watering"
            onComplete={handleWateringComplete}
            onCancel={handleWateringCancel}
          />
        )}

        {screen === 'moment' && garden && (
          <BloomMoment
            key="moment"
            stage={garden.stage}
            onComplete={handleMomentComplete}
          />
        )}

        {screen === 'growth' && garden && (
          <GrowthScreen
            key="growth"
            garden={garden}
            prevStage={prevStage}
            onContinue={handleGrowthContinue}
          />
        )}
      </AnimatePresence>

      {/* ── Overlays ─────────────────────────────────────── */}

      <AnimatePresence>
        {hasPassiveGrowth && screen === 'home' && garden && (
          <PassiveGrowthModal
            key="passive"
            elements={garden.newPassiveElements}
            hoursAway={hoursAway}
            onDismiss={dismissPassiveGrowth}
          />
        )}
      </AnimatePresence>

      {/* Name modal — self-contained exit animation; AnimatePresence not needed here */}
      {showRename && garden && (
        <NamePlantModal
          key="rename"
          currentName={garden.plantName}
          onSave={handleRenameSave}
          onClose={() => setShowRename(false)}
        />
      )}

      <AnimatePresence>
        {showPrompt && screen === 'home' && (
          <InstallPrompt
            key="install"
            onInstall={promptInstall}
            onDismiss={dismissPrompt}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
