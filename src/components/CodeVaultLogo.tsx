import React from 'react';

interface CodeVaultLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  subtitle?: string;
  isAnimated?: boolean;
}

export const CodeVaultLogo: React.FC<CodeVaultLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  subtitle,
  isAnimated = false,
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-sm', sub: 'text-[10px]' },
    md: { icon: 34, text: 'text-base', sub: 'text-xs' },
    lg: { icon: 42, text: 'text-xl', sub: 'text-xs' },
    xl: { icon: 52, text: 'text-2xl', sub: 'text-sm' },
  };

  const { icon: iconSize, text: textSize, sub: subSize } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Precision Vector Emblem */}
      <div
        className="relative shrink-0 flex items-center justify-center select-none"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg
          viewBox="0 0 40 40"
          width={iconSize}
          height={iconSize}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-[0_2px_10px_rgba(78,222,163,0.25)] transition-transform duration-300 ${
            isAnimated ? 'group-hover:scale-105 group-hover:rotate-1' : ''
          }`}
        >
          <defs>
            {/* Dark Cyber Metallic Gradient */}
            <linearGradient id="cv-vault-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e2733" />
              <stop offset="50%" stopColor="#131922" />
              <stop offset="100%" stopColor="#0a0f16" />
            </linearGradient>

            {/* Neon Border Gradient */}
            <linearGradient id="cv-vault-border" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4edea3" />
              <stop offset="50%" stopColor="#4cd7f6" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Core Glow */}
            <linearGradient id="cv-core-glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4edea3" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0.15" />
            </linearGradient>

            {/* Bracket Gradients */}
            <linearGradient id="cv-bracket-left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6ffbbe" />
              <stop offset="100%" stopColor="#4edea3" />
            </linearGradient>

            <linearGradient id="cv-bracket-right" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7bd0ff" />
              <stop offset="100%" stopColor="#4cd7f6" />
            </linearGradient>
          </defs>

          {/* Vault Squircle Base */}
          <rect
            x="2"
            y="2"
            width="36"
            height="36"
            rx="9"
            fill="url(#cv-vault-bg)"
            stroke="url(#cv-vault-border)"
            strokeWidth="1.5"
          />

          {/* Inner Circular Security Vault Hatch */}
          <circle
            cx="20"
            cy="20"
            r="12.5"
            stroke="#2b3440"
            strokeWidth="1.2"
            strokeDasharray="2.5 2.5"
          />

          {/* Core Ambient Glow Area */}
          <circle cx="20" cy="20" r="9" fill="url(#cv-core-glow)" />

          {/* Vault Locking Nodes (North, East, South, West) */}
          <circle cx="20" cy="7.5" r="1.2" fill="#4edea3" />
          <circle cx="32.5" cy="20" r="1.2" fill="#4cd7f6" />
          <circle cx="20" cy="32.5" r="1.2" fill="#4cd7f6" />
          <circle cx="7.5" cy="20" r="1.2" fill="#4edea3" />

          {/* Integrated Code Brackets: < / > */}
          {/* Left Angle Bracket < */}
          <path
            d="M15.5 15L10.5 20L15.5 25"
            stroke="url(#cv-bracket-left)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Central Slash / Vault Key Shaft */}
          <path
            d="M21.5 14L18.5 26"
            stroke="#94a3b8"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Right Angle Bracket > */}
          <path
            d="M24.5 15L29.5 20L24.5 25"
            stroke="url(#cv-bracket-right)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Micro Telemetry Active Indicator */}
          <circle cx="20" cy="20" r="1" fill="#4edea3" />
        </svg>
      </div>

      {/* Typography Brand Name */}
      {showText && (
        <div className="flex flex-col select-none text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-mono font-bold tracking-tight text-[#dee2ec] ${textSize}`}>
              Code<span className="text-[#4edea3]">Vault</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
          </div>
          {subtitle && (
            <span className={`font-mono text-[#86948a] tracking-wide mt-0.5 leading-none ${subSize}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
