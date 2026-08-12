import { useState, useEffect, useCallback } from 'react';
import { GardenState } from '@/types/garden';
import { loadGarden, saveGarden } from '@/utils/storage';
import { createInitialGarden, processWatering, processReturn } from '@/utils/garden';

export function useGarden() {
  const [garden, setGarden] = useState<GardenState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoursAway, setHoursAway] = useState(0);
  const [hasPassiveGrowth, setHasPassiveGrowth] = useState(false);

  useEffect(() => {
    const saved = loadGarden();
    if (saved) {
      const { updatedState, hoursAway: h } = processReturn(saved);
      setGarden(updatedState);
      setHoursAway(h);
      if (updatedState.newPassiveElements.length > 0) {
        setHasPassiveGrowth(true);
      }
      saveGarden(updatedState);
    }
    setIsLoading(false);
  }, []);

  const initGarden = useCallback(() => {
    const initial = createInitialGarden();
    setGarden(initial);
    saveGarden(initial);
  }, []);

  const completeWatering = useCallback(() => {
    setGarden((prev) => {
      if (!prev) return prev;
      const updated = processWatering(prev);
      saveGarden(updated);
      return updated;
    });
  }, []);

  const dismissPassiveGrowth = useCallback(() => {
    setHasPassiveGrowth(false);
    setGarden((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, newPassiveElements: [] };
      saveGarden(updated);
      return updated;
    });
  }, []);

  const updatePlantName = useCallback((name: string) => {
    setGarden((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, plantName: name };
      saveGarden(updated);
      return updated;
    });
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
  };
}
