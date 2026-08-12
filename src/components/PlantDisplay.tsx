'use client';

import { motion } from 'framer-motion';
import { GrowthStage } from '@/types/garden';

interface Props {
  stage: GrowthStage;
  size?: number;
}

export default function PlantDisplay({ stage, size = 220 }: Props) {
  const Plant = PLANTS[stage];
  return (
    <motion.div
      key={stage}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 80, damping: 14 }}
    >
      <Plant size={size} />
    </motion.div>
  );
}

// ─── Individual stage SVGs ──────────────────────────────────────────────────

function SeedPlant({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      {/* Soil */}
      <ellipse cx="100" cy="168" rx="50" ry="12" fill="#c4956a" opacity="0.22" />
      <ellipse cx="100" cy="165" rx="26" ry="8" fill="#c4956a" opacity="0.38" />
      {/* Seed body */}
      <ellipse cx="100" cy="158" rx="14" ry="10" fill="#8b5e3c" />
      <ellipse cx="97" cy="155" rx="8" ry="6" fill="#a0724d" />
      {/* Tiny crack / first sprout */}
      <path d="M100 148 Q101 141 100 134" stroke="#7cb87a" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="100" cy="132" rx="5" ry="4" fill="#7cb87a" opacity="0.7" />
    </svg>
  );
}

function SproutPlant({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <ellipse cx="100" cy="170" rx="52" ry="12" fill="#c4956a" opacity="0.2" />
      <ellipse cx="100" cy="167" rx="26" ry="8" fill="#c4956a" opacity="0.35" />
      {/* Stem */}
      <path d="M100 163 Q99 148 100 132" stroke="#7cb87a" strokeWidth="3.5" strokeLinecap="round" />
      {/* Left leaf */}
      <path d="M100 144 Q89 134 82 136 Q87 144 100 147" fill="#7cb87a" />
      {/* Right leaf */}
      <path d="M100 144 Q111 134 118 136 Q113 144 100 147" fill="#4a8c48" />
      {/* Top bud */}
      <circle cx="100" cy="130" r="7" fill="#7cb87a" />
      <circle cx="100" cy="128" r="4" fill="#a8d8a5" />
    </svg>
  );
}

function SmallPlant({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 220 220" fill="none">
      <ellipse cx="110" cy="192" rx="60" ry="13" fill="#c4956a" opacity="0.18" />
      <ellipse cx="110" cy="189" rx="30" ry="9" fill="#c4956a" opacity="0.32" />
      {/* Stem */}
      <path d="M110 185 Q108 165 109 144 Q110 130 110 116" stroke="#7cb87a" strokeWidth="4" strokeLinecap="round" />
      {/* Left branch */}
      <path d="M109 152 Q97 142 86 137" stroke="#7cb87a" strokeWidth="2.8" strokeLinecap="round" />
      {/* Right branch */}
      <path d="M109 162 Q121 152 132 148" stroke="#7cb87a" strokeWidth="2.8" strokeLinecap="round" />
      {/* Left leaf cluster */}
      <ellipse cx="82" cy="130" rx="20" ry="14" fill="#7cb87a" transform="rotate(-30 82 130)" />
      <ellipse cx="78" cy="136" rx="14" ry="10" fill="#4a8c48" transform="rotate(-15 78 136)" />
      {/* Right leaf cluster */}
      <ellipse cx="136" cy="142" rx="20" ry="14" fill="#7cb87a" transform="rotate(30 136 142)" />
      <ellipse cx="140" cy="147" rx="14" ry="10" fill="#4a8c48" transform="rotate(15 140 147)" />
      {/* Top */}
      <ellipse cx="110" cy="108" rx="24" ry="20" fill="#7cb87a" />
      <ellipse cx="110" cy="112" rx="18" ry="14" fill="#5a9c58" />
      <circle cx="110" cy="106" r="7" fill="#a8d8a5" />
    </svg>
  );
}

function MediumPlant({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" fill="none">
      <ellipse cx="120" cy="214" rx="70" ry="15" fill="#c4956a" opacity="0.16" />
      <ellipse cx="120" cy="210" rx="34" ry="10" fill="#c4956a" opacity="0.3" />
      {/* Trunk */}
      <path d="M120 207 Q116 180 117 155 Q118 136 120 118" stroke="#8b5e3c" strokeWidth="6" strokeLinecap="round" />
      {/* Branches */}
      <path d="M118 165 Q103 150 88 142" stroke="#6b7c3c" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M118 150 Q133 136 150 130" stroke="#6b7c3c" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M118 178 Q102 180 86 176" stroke="#6b7c3c" strokeWidth="3" strokeLinecap="round" />
      <path d="M118 178 Q136 180 154 175" stroke="#6b7c3c" strokeWidth="3" strokeLinecap="round" />
      {/* Leaf clusters */}
      <ellipse cx="82" cy="134" rx="28" ry="20" fill="#7cb87a" transform="rotate(-28 82 134)" />
      <ellipse cx="76" cy="142" rx="20" ry="14" fill="#4a8c48" transform="rotate(-14 76 142)" />
      <ellipse cx="156" cy="122" rx="28" ry="20" fill="#7cb87a" transform="rotate(28 156 122)" />
      <ellipse cx="162" cy="129" rx="20" ry="14" fill="#4a8c48" transform="rotate(14 162 129)" />
      <ellipse cx="80" cy="172" rx="24" ry="16" fill="#5a9c58" transform="rotate(-18 80 172)" />
      <ellipse cx="158" cy="170" rx="24" ry="16" fill="#5a9c58" transform="rotate(18 158 170)" />
      {/* Crown */}
      <ellipse cx="120" cy="106" rx="34" ry="28" fill="#7cb87a" />
      <ellipse cx="120" cy="112" rx="26" ry="20" fill="#4a8c48" />
      <ellipse cx="114" cy="100" rx="18" ry="14" fill="#8dc88b" />
      {/* Flower */}
      <g>
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <ellipse
            key={a}
            cx={138 + 9 * Math.cos((a * Math.PI) / 180)}
            cy={96 + 9 * Math.sin((a * Math.PI) / 180)}
            rx="5"
            ry="3.5"
            fill="#fde8b0"
            transform={`rotate(${a} ${138 + 9 * Math.cos((a * Math.PI) / 180)} ${96 + 9 * Math.sin((a * Math.PI) / 180)})`}
          />
        ))}
        <circle cx="138" cy="96" r="6" fill="#f5a623" />
        <circle cx="138" cy="95" r="3" fill="#fbd06a" />
      </g>
    </svg>
  );
}

function LargePlant({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 260 260" fill="none">
      <ellipse cx="130" cy="232" rx="80" ry="16" fill="#c4956a" opacity="0.15" />
      <ellipse cx="130" cy="228" rx="38" ry="11" fill="#c4956a" opacity="0.28" />
      {/* Trunk */}
      <path d="M130 225 Q125 192 126 164 Q127 142 128 122 Q129 108 130 94" stroke="#8b5e3c" strokeWidth="8" strokeLinecap="round" />
      {/* Major branches */}
      <path d="M128 170 Q110 154 92 144" stroke="#6b4226" strokeWidth="5" strokeLinecap="round" />
      <path d="M128 154 Q148 136 166 127" stroke="#6b4226" strokeWidth="5" strokeLinecap="round" />
      <path d="M128 185 Q108 188 88 184" stroke="#6b4226" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M128 185 Q150 188 172 182" stroke="#6b4226" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M129 118 Q114 104 98 96" stroke="#6b4226" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M129 118 Q144 104 160 96" stroke="#6b4226" strokeWidth="3.5" strokeLinecap="round" />
      {/* Lower clusters */}
      <ellipse cx="86" cy="136" rx="30" ry="22" fill="#7cb87a" transform="rotate(-28 86 136)" />
      <ellipse cx="78" cy="146" rx="22" ry="16" fill="#4a8c48" transform="rotate(-14 78 146)" />
      <ellipse cx="172" cy="119" rx="30" ry="22" fill="#7cb87a" transform="rotate(28 172 119)" />
      <ellipse cx="178" cy="128" rx="22" ry="16" fill="#4a8c48" transform="rotate(14 178 128)" />
      <ellipse cx="82" cy="180" rx="28" ry="18" fill="#5a9c58" transform="rotate(-20 82 180)" />
      <ellipse cx="178" cy="176" rx="28" ry="18" fill="#5a9c58" transform="rotate(20 178 176)" />
      {/* Crown layers */}
      <ellipse cx="130" cy="100" rx="46" ry="36" fill="#7cb87a" />
      <ellipse cx="124" cy="92" rx="34" ry="28" fill="#5a9c58" />
      <ellipse cx="136" cy="90" rx="28" ry="24" fill="#4a8c48" />
      <ellipse cx="126" cy="82" rx="22" ry="18" fill="#8dc88b" />
      {/* Multiple flowers */}
      {[
        { cx: 110, cy: 80, r: 5.5 },
        { cx: 148, cy: 86, r: 5 },
        { cx: 130, cy: 74, r: 6 },
        { cx: 90, cy: 126, r: 4 },
      ].map(({ cx, cy, r }, i) => (
        <g key={i}>
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse
              key={a}
              cx={cx + (r + 3) * Math.cos((a * Math.PI) / 180)}
              cy={cy + (r + 3) * Math.sin((a * Math.PI) / 180)}
              rx={r * 0.7}
              ry={r * 0.5}
              fill="#fde8b0"
            />
          ))}
          <circle cx={cx} cy={cy} r={r * 0.7} fill="#f5a623" />
        </g>
      ))}
      {/* Bird silhouette */}
      <path d="M60 66 Q65 61 70 66" stroke="#a0a0a0" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M70 66 Q75 61 80 66" stroke="#a0a0a0" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function TreePlant({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 280 280" fill="none">
      <ellipse cx="140" cy="254" rx="90" ry="18" fill="#c4956a" opacity="0.13" />
      <ellipse cx="140" cy="250" rx="44" ry="12" fill="#c4956a" opacity="0.26" />
      {/* Root bumps */}
      <path d="M118 250 Q114 255 106 255 Q108 248 118 250" fill="#8b5e3c" opacity="0.35" />
      <path d="M162 250 Q166 255 174 255 Q172 248 162 250" fill="#8b5e3c" opacity="0.35" />
      {/* Trunk */}
      <path d="M140 248 Q134 210 135 178 Q136 152 138 130 Q139 115 140 100" stroke="#8b5e3c" strokeWidth="12" strokeLinecap="round" />
      {/* Major branches */}
      <path d="M138 172 Q116 154 96 144" stroke="#6b4226" strokeWidth="7" strokeLinecap="round" />
      <path d="M138 156 Q162 136 182 126" stroke="#6b4226" strokeWidth="7" strokeLinecap="round" />
      <path d="M138 190 Q116 194 94 190" stroke="#6b4226" strokeWidth="6" strokeLinecap="round" />
      <path d="M138 190 Q162 194 186 188" stroke="#6b4226" strokeWidth="6" strokeLinecap="round" />
      <path d="M139 118 Q124 104 108 96" stroke="#6b4226" strokeWidth="5" strokeLinecap="round" />
      <path d="M139 118 Q154 104 170 96" stroke="#6b4226" strokeWidth="5" strokeLinecap="round" />
      {/* Crown — layered ellipses for lush look */}
      <ellipse cx="140" cy="195" rx="82" ry="34" fill="#3d7a3b" />
      <ellipse cx="140" cy="178" rx="74" ry="40" fill="#4a8c48" />
      <ellipse cx="140" cy="158" rx="66" ry="42" fill="#5a9c58" />
      <ellipse cx="140" cy="136" rx="56" ry="40" fill="#7cb87a" />
      <ellipse cx="140" cy="112" rx="44" ry="36" fill="#8dc88b" />
      <ellipse cx="140" cy="94" rx="34" ry="30" fill="#7cb87a" />
      {/* Highlight */}
      <ellipse cx="128" cy="84" rx="18" ry="14" fill="#a8d8a5" opacity="0.55" />
      {/* Side clusters */}
      <ellipse cx="86" cy="160" rx="26" ry="18" fill="#4a8c48" transform="rotate(-24 86 160)" />
      <ellipse cx="196" cy="148" rx="26" ry="18" fill="#4a8c48" transform="rotate(24 196 148)" />
      <ellipse cx="82" cy="190" rx="24" ry="16" fill="#3d7a3b" transform="rotate(-18 82 190)" />
      <ellipse cx="200" cy="184" rx="24" ry="16" fill="#3d7a3b" transform="rotate(18 200 184)" />
      {/* Flowers all over */}
      {[
        { cx: 118, cy: 82, r: 6 },
        { cx: 160, cy: 88, r: 5.5 },
        { cx: 140, cy: 76, r: 7 },
        { cx: 96, cy: 148, r: 4.5 },
        { cx: 186, cy: 140, r: 4.5 },
        { cx: 126, cy: 108, r: 4 },
        { cx: 154, cy: 104, r: 4 },
      ].map(({ cx, cy, r }, i) => (
        <g key={i}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cx={cx + (r + 3) * Math.cos((a * Math.PI) / 180)}
              cy={cy + (r + 3) * Math.sin((a * Math.PI) / 180)}
              rx={r * 0.65}
              ry={r * 0.5}
              fill={i % 2 === 0 ? '#fde8b0' : '#ffd1dc'}
            />
          ))}
          <circle cx={cx} cy={cy} r={r * 0.65} fill={i % 2 === 0 ? '#f5a623' : '#f08080'} />
        </g>
      ))}
      {/* Two birds */}
      <path d="M64 72 Q69 67 74 72" stroke="#909090" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M74 72 Q79 67 84 72" stroke="#909090" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M210 60 Q214 56 218 60" stroke="#909090" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M218 60 Q222 56 226 60" stroke="#909090" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

const PLANTS: Record<GrowthStage, (props: { size: number }) => React.JSX.Element> = {
  seed: SeedPlant,
  sprout: SproutPlant,
  small: SmallPlant,
  medium: MediumPlant,
  large: LargePlant,
  tree: TreePlant,
};
