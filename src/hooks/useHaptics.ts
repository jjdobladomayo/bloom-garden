export function useHaptics() {
  const vibrate = (pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  return {
    tap: () => vibrate(10),
    medium: () => vibrate(20),
    success: () => vibrate([30, 40, 30]),
    growth: () => vibrate([20, 30, 20, 30, 60]),
  };
}
