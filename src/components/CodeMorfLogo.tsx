import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textClassName?: string;
}

export const CodeMorfLogo: React.FC<LogoProps> = ({
  className = '',
  size = 28,
  showText = false,
  textClassName = 'text-base font-bold tracking-wider'
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
      >
        <defs>
          <linearGradient id="brainBioGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="brainCircuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Central Divider subtle line */}
        <line x1="100" y1="20" x2="100" y2="180" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" opacity="0.3" />

        {/* Left Side: Biological / Synaptic Brain Gyri */}
        <g stroke="url(#brainBioGrad)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Outer hemisphere lobes */}
          <path d="M96 28 C75 25, 45 35, 36 55 C28 72, 32 88, 38 95 C25 105, 22 125, 32 142 C40 156, 55 168, 75 174 C86 177, 94 176, 96 172" />
          
          {/* Inner gyri / sulci convolutions */}
          <path d="M94 46 C78 45, 62 55, 60 70 C58 82, 70 88, 80 88 C90 88, 94 98, 86 108 C76 120, 60 115, 52 128 C45 139, 56 154, 72 156 C84 158, 92 150, 94 142" />
          <path d="M48 92 C56 94, 66 100, 70 112" />
          <path d="M68 62 C74 70, 84 72, 92 68" />
          <path d="M52 140 C62 136, 74 142, 80 132" />
        </g>

        {/* Right Side: Digital / Circuitry & Neural Microchips */}
        <g stroke="url(#brainCircuitGrad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Outer digital perimeter */}
          <path d="M104 28 C125 25, 155 35, 164 55 C172 72, 168 88, 162 95 C175 105, 178 125, 168 142 C160 156, 145 168, 125 174 C114 177, 106 176, 104 172" />
          
          {/* Circuit tracks and bus lines */}
          <path d="M106 48 H135 V65 H152" />
          <path d="M106 75 H125 V92 H148 V110 H120 V135 H145" />
          <path d="M106 105 H115 V120 H106" />
          <path d="M106 145 H128 V160 H106" />
          <path d="M140 80 V95" />
          <path d="M155 125 H162" />
        </g>

        {/* Circuit Nodes (Pins / Microchip points) */}
        <g fill="#38bdf8">
          <circle cx="152" cy="65" r="4.5" />
          <circle cx="148" cy="92" r="4" />
          <circle cx="145" cy="135" r="4.5" />
          <circle cx="128" cy="160" r="4" />
          <circle cx="135" cy="48" r="3.5" />
          <circle cx="162" cy="125" r="3.5" />
          <rect x="130" y="85" width="10" height="14" rx="2" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
        </g>
      </svg>

      {showText && (
        <span className={`bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent font-black ${textClassName}`}>
          CODEMORF
        </span>
      )}
    </div>
  );
};
