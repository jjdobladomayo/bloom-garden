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
import MilestoneScreen from '@/components/MilestoneScreen';
import MemoriasScreen from '@/components/MemoriasScreen';
import { GrowthStage } from '@/types/garden';
import { wateredToday, getTreeMaturity } from '@/utils/garden';
import TreeEcosystem from '@/components/TreeEcosystem';
import { MILESTONE_META } from '@/utils/milestones';

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
    pendingMilestone,
    consumeMilestone,
  } = useGarden();

  const { showPrompt, promptInstall, dismissPrompt } = usePWA();

  const [screen, setScreen]           = useState<Screen>('loading');
  const [prevStage, setPrevStage]     = useState<GrowthStage | null>(null);
  const [showRename, setShowRename]   = useState(false);
  const [showEcosystem, setShowEcosystem] = useState(false);
  const [showMemorias, setShowMemorias]   = useState(false);

  // --- Milestone overlay: shows when back on home and a pending important milestone exists ---
  const [milestoneVisible, setMilestoneVisible] = useState(false);

  useEffect(() => {
    if (screen === 'home' && pendingMilestone && MILESTONE_META[pendingMilestone]?.important) {
      const t = setTimeout(() => setMilestoneVisible(true), 700);
      return () => clearTimeout(t);
    }
  }, [screen, pendingMilestone]);

  // Resolve initial screen once data loads
  useEffect(() => {
    if (!isLoading) {
      setScreen(garden ? 'home' : 'welcome');
    }
  }, [isLoading, garden]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleStart = (name: string) => {
    initGarden(name || undefined);
    setScreen('home');
  };

  const handleWater = () => setScreen('watering');

  const handleWateringComplete = () => {
    const isExtra = garden ? wateredToday(garden) : false;
    if (garden) setPrevStage(garden.stage);
    completeWatering();
    setScreen(isExtra ? 'home' : 'moment');
  };

  const handleWateringCancel = () => setScreen('home');

  const handleMomentComplete = () => {
    if (prevStage !== null && garden && garden.stage !== prevStage) {
      setScreen('growth');
    } else {
      setPrevStage(null);
      setScreen('home');
    }
  };

  const handleGrowthContinue = () => {
    setPrevStage(null);
    setScreen('home');
  };

  // Milestone overlay
  const handleMilestoneClose = () => {
    setMilestoneVisible(false);
    // Wait for exit animation, then consume from queue
    setTimeout(() => consumeMilestone(), 500);
  };

  // Ecosystem
  const handleOpenEcosystem  = () => setShowEcosystem(true);
  const handleCloseEcosystem = () => setShowEcosystem(false);

  // Memorias
  const handleOpenMemorias  = () => setShowMemorias(true);
  const handleCloseMemorias = () => setShowMemorias(false);

  // Name modal
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
            onExploreTree={handleOpenEcosystem}
            onOpenMemorias={handleOpenMemorias}
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

      {/* Name modal */}
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

      {/* ── Tree ecosystem overlay ───────────────────────── */}
      <AnimatePresence>
        {showEcosystem && garden && (
          <TreeEcosystem
            key="ecosystem"
            stage={garden.stage}
            maturity={getTreeMaturity(garden.wateringCount)}
            onClose={handleCloseEcosystem}
            passiveElements={garden.passiveElements}
          />
        )}
      </AnimatePresence>

      {/* ── Milestone moment overlay ─────────────────────── */}
      <AnimatePresence>
        {milestoneVisible && pendingMilestone && garden && (
          <MilestoneScreen
            key={`milestone-${pendingMilestone}`}
            milestoneId={pendingMilestone}
            unlockedAt={
              garden.milestones?.find((m) => m.id === pendingMilestone)?.unlockedAt
            }
            onClose={handleMilestoneClose}
          />
        )}
      </AnimatePresence>

      {/* ── Memorias screen ──────────────────────────────── */}
      <AnimatePresence>
        {showMemorias && garden && (
          <MemoriasScreen
            key="memorias"
            milestones={garden.milestones ?? []}
            onClose={handleCloseMemorias}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
