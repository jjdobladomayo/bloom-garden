import { useState, useEffect, useCallback } from 'react';
import { GardenState, MilestoneId } from '@/types/garden';
import { loadGarden, saveGarden } from '@/utils/storage';
import { createInitialGarden, processWatering, processReturn } from '@/utils/garden';
import { detectNewMilestones, applyMilestones, MILESTONE_META } from '@/utils/milestones';

export function useGarden() {
  const [garden, setGarden]                         = useState<GardenState | null>(null);
  const [isLoading, setIsLoading]                   = useState(true);
  const [hoursAway, setHoursAway]                   = useState(0);
  const [hasPassiveGrowth, setHasPassiveGrowth]     = useState(false);
  const [pendingMilestones, setPendingMilestones]   = useState<MilestoneId[]>([]);

  // ── Initial load ────────────────────────────────────────────────────────────

  useEffect(() => {
    const saved = loadGarden();
    if (saved) {
      const { updatedState, hoursAway: h } = processReturn(saved);
      // Detect milestones arising from time elapsed + new passive elements
      const newIds = detectNewMilestones(saved, updatedState, 'return');
      const finalState = applyMilestones(updatedState, newIds);
      setGarden(finalState);
      setHoursAway(h);
      if (finalState.newPassiveElements.length > 0) setHasPassiveGrowth(true);
      saveGarden(finalState);
      // Queue important milestones for overlay display
      const important = newIds.filter((id) => MILESTONE_META[id].important);
      if (important.length > 0) setPendingMilestones(important);
    }
    setIsLoading(false);
  }, []);

  // ── Garden creation ──────────────────────────────────────────────────────────

  const initGarden = useCallback((name?: string) => {
    const initial = createInitialGarden(name);
    setGarden(initial);
    saveGarden(initial);
  }, []);

  // ── Watering ────────────────────────────────────────────────────────────────

  const completeWatering = useCallback(() => {
    setGarden((prev) => {
      if (!prev) return prev;
      const next    = processWatering(prev);
      const newIds  = detectNewMilestones(prev, next, 'watering');
      const updated = applyMilestones(next, newIds);
      saveGarden(updated);
      // Queue important milestones for overlay
      const important = newIds.filter((id) => MILESTONE_META[id].important);
      if (important.length > 0) {
        setPendingMilestones((q) => [...q, ...important]);
      }
      return updated;
    });
  }, []);

  // ── Passive growth dismissal ─────────────────────────────────────────────────

  const dismissPassiveGrowth = useCallback(() => {
    setHasPassiveGrowth(false);
    setGarden((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, newPassiveElements: [] };
      saveGarden(updated);
      return updated;
    });
  }, []);

  // ── Name ────────────────────────────────────────────────────────────────────

  const updatePlantName = useCallback((name: string) => {
    setGarden((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, plantName: name };
      saveGarden(updated);
      return updated;
    });
  }, []);

  // ── Milestone queue ──────────────────────────────────────────────────────────

  const consumeMilestone = useCallback(() => {
    setPendingMilestones((q) => q.slice(1));
  }, []);

  return {
    garden,
    isLoading,
    hoursAway,
    hasPassiveGrowth,
    initGarden,
    completeWatering,
    dismissPassiveGrowth,
    updatePlantName,
    pendingMilestone: pendingMilestones[0] ?? null,
    consumeMilestone,
  };
}
