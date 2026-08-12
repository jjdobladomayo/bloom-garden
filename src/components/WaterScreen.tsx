'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CircularProgress from './CircularProgress';
import RainEffect from './RainEffect';
import { useHaptics } from '@/hooks/useHaptics';

const DURATION = 5000; // 5 seconds

interface Props {
  onComplete: () => void;
  onCancel: () => void;
}

export default function WaterScreen({ onComplete, onCancel }: Props) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const haptics = useHaptics();

  // ── Audio helpers ──────────────────────────────────────────────────────────
  const startAudio = useCallback(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Ctx = window.AudioContext ?? (window as any).webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // White noise buffer → bandpass → gain
      const bufLen = ctx.sampleRate * 2;
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 600;
      filter.Q.value = 0.8;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.6);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      src.start();

      sourceRef.current = src;
      gainRef.current = gain;
    } catch {
      // Fail silently — audio is enhancement only
    }
  }, []);

  const stopAudio = useCallback(() => {
    try {
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.linearRampToValueAtTime(
          0,
          audioCtxRef.current.currentTime + 0.5
        );
        const src = sourceRef.current;
        setTimeout(() => { try { src?.stop(); } catch { /* noop */ } }, 600);
        sourceRef.current = null;
        gainRef.current = null;
      }
    } catch { /* noop */ }
  }, []);

  // ── Progress tick ──────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const elapsed = performance.now() - startRef.current;
    const p = Math.min(elapsed / DURATION, 1);
    setProgress(p);

    if (p < 1) {
      // Gentle mid-way haptic at ~50%
      if (p > 0.48 && p < 0.52) haptics.tap();
      rafRef.current = requestAnimationFrame(tick);
    } else {
      setDone(true);
      setIsHolding(false);
      stopAudio();
      haptics.growth();
      setTimeout(onComplete, 900);
    }
  }, [haptics, stopAudio, onComplete]);

  // ── Pointer handlers ───────────────────────────────────────────────────────
  const startHold = useCallback((e: React.PointerEvent) => {
    if (done) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsHolding(true);
    startRef.current = performance.now();
    haptics.tap();
    startAudio();
    rafRef.current = requestAnimationFrame(tick);
  }, [done, haptics, startAudio, tick]);

  const endHold = useCallback(() => {
    if (done) return;
    setIsHolding(false);
    stopAudio();
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (progress < 1) setProgress(0);
  }, [done, progress, stopAudio]);

  // ── Cleanup ────────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      stopAudio();
    };
  }, [stopAudio]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-col items-center justify-center min-h-screen bg-[#fdf9f5] overflow-hidden safe-top safe-bottom"
      style={{ userSelect: 'none' }}
    >
      {/* Rain overlay */}
      <AnimatePresence>{isHolding && <RainEffect key="rain" />}</AnimatePresence>

      {/* Background colour shift while watering — animate opacity, not gradient */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(135,206,235,0.14) 0%, transparent 70%)',
        }}
        animate={{ opacity: isHolding ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Back button (hidden while holding) */}
      <AnimatePresence>
        {!isHolding && !done && (
          <motion.button
            key="back"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute top-14 left-6 flex items-center gap-1 text-gray-400 text-sm"
          >
            <span>←</span>
            <span>Volver</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main interactive area */}
      <div className="flex flex-col items-center gap-10 z-10">
        {/* Hold target */}
        <div
          onPointerDown={startHold}
          onPointerUp={endHold}
          onPointerCancel={endHold}
          className="touch-none"
          style={{ cursor: done ? 'default' : 'pointer' }}
        >
          <CircularProgress
            progress={progress}
            isActive={isHolding}
            isCompleted={done}
          />
        </div>

        {/* Instruction text */}
        <AnimatePresence mode="wait">
          {done ? (
            <motion.p
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-lg font-light text-[#4a8c48] text-center"
            >
              ¡Regado! 🌿
            </motion.p>
          ) : isHolding ? (
            <motion.p
              key="watering"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-base text-[#7cb87a] text-center"
            >
              Regando…
            </motion.p>
          ) : (
            <motion.p
              key="idle"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-base text-gray-400 text-center leading-relaxed"
            >
              Mantén pulsado
              <br />
              <span className="text-sm">para regar tu planta</span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Hint */}
      <AnimatePresence>
        {!isHolding && !done && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-14 text-xs text-gray-300 tracking-wide"
          >
            5 segundos de calma
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
