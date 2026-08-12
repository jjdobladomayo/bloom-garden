'use client';

import { motion } from 'framer-motion';

interface Props {
  onInstall: () => Promise<boolean>;
  onDismiss: () => void;
}

export default function InstallPrompt({ onInstall, onDismiss }: Props) {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 120, damping: 20 }}
      className="absolute bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-xl px-6 py-4 flex items-center gap-3"
    >
      <div className="w-10 h-10 bg-[#f0f9f0] rounded-xl flex items-center justify-center flex-shrink-0">
        <span className="text-2xl">🌱</span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 truncate">Instalar Bloom</p>
        <p className="text-xs text-gray-400">Añade a tu pantalla de inicio</p>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => { onInstall(); }}
          className="text-sm font-medium text-[#7cb87a] px-3 py-1.5 bg-[#f0f9f0] rounded-lg active:scale-95 transition-transform"
        >
          Instalar
        </button>
        <button
          onClick={onDismiss}
          className="text-gray-300 text-lg leading-none"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
}
