'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props {
  currentName: string;
  onSave: (name: string) => void;
  onClose: () => void;
}

const MAX_LEN = 24;
const SUGGESTIONS = ['Luna', 'Roble', 'Verde', 'Brisa', 'Sol', 'Fern'];

export default function NamePlantModal({ currentName, onSave, onClose }: Props) {
  const isDefault = currentName === 'Mi planta';
  const [value, setValue] = useState(isDefault ? '' : currentName);
  const [isExiting, setIsExiting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Guard against calling onClose multiple times
  const closedRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  // When isExiting becomes true, wait for the exit animation to finish then unmount
  useEffect(() => {
    if (!isExiting) return;
    const t = setTimeout(() => {
      if (!closedRef.current) {
        closedRef.current = true;
        onClose();
      }
    }, 240); // 200ms sheet tween + 40ms buffer
    return () => clearTimeout(t);
  }, [isExiting, onClose]);

  // Single exit point — starts the exit animation
  const triggerClose = () => {
    if (!closedRef.current) setIsExiting(true);
  };

  const handleSave = () => {
    const trimmed = value.trim();
    if (trimmed) onSave(trimmed);
    triggerClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') triggerClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: isExiting ? 0.18 : 0.25 }}
      className="absolute inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
      onClick={triggerClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: isExiting ? '100%' : 0 }}
        transition={
          isExiting
            ? { duration: 0.2, ease: 'easeIn' }
            : { type: 'spring', stiffness: 130, damping: 22 }
        }
        className="w-full max-w-md bg-[#fdf9f5] rounded-t-3xl px-6 pt-6 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

        {/* Heading */}
        <h2 className="text-lg font-light text-gray-700 text-center mb-1">
          Dale un nombre a tu planta
        </h2>
        <p className="text-xs text-gray-400 text-center mb-6">
          Algo que te recuerde a ella cuando estés fuera.
        </p>

        {/* Input */}
        <div className="relative mb-4">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value.slice(0, MAX_LEN))}
            onKeyDown={handleKeyDown}
            placeholder="Ej. Luna, Roble, Verde…"
            className="w-full bg-white border border-[#e0d5c5] rounded-2xl px-5 py-4 text-base text-gray-700 placeholder-gray-300 outline-none focus:border-[#7cb87a] transition-colors"
            style={{ fontSize: 16 /* prevent iOS zoom */ }}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {value.length > 0 && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-300">
              {MAX_LEN - value.length}
            </span>
          )}
        </div>

        {/* Suggestion chips — plain conditional, no nested AnimatePresence */}
        {value.length === 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setValue(s)}
                className="px-3 py-1.5 bg-[#f0f9f0] border border-[#c8e6c4] rounded-full text-sm text-[#4a8c48] active:scale-95 transition-transform"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleSave}
          disabled={value.trim().length === 0}
          className="w-full py-4 bg-[#7cb87a] text-white rounded-2xl text-base font-medium active:scale-95 transition-all disabled:opacity-40 disabled:scale-100"
        >
          Guardar nombre
        </button>

        <button
          onClick={triggerClose}
          className="w-full py-3 text-sm text-gray-400 mt-1"
        >
          Quizás luego
        </button>
      </motion.div>
    </motion.div>
  );
}
