interface ObsiLogoProps {
  className?: string;
}

export const ObsiLogo = ({ className = '' }: ObsiLogoProps) => {
  return (
    <svg
      viewBox="0 0 400 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5d060" />
          <stop offset="50%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#d4a537" />
        </linearGradient>
      </defs>

      {/* Logo OBSI */}
      <g className="logo-text">
        {/* O */}
        <path
          d="M40 30 C40 20, 50 10, 65 10 C80 10, 90 20, 90 35 C90 50, 80 60, 65 60 C50 60, 40 50, 40 35 Z M50 35 C50 45, 55 52, 65 52 C75 52, 80 45, 80 35 C80 25, 75 18, 65 18 C55 18, 50 25, 50 35 Z"
          fill="url(#goldGradient)"
        />

        {/* B */}
        <path
          d="M105 10 L105 60 L130 60 C145 60, 155 52, 155 42 C155 37, 152 33, 147 31 C152 29, 155 25, 155 20 C155 13, 147 10, 135 10 Z M115 18 L130 18 C137 18, 142 20, 142 26 C142 32, 137 34, 130 34 L115 34 Z M115 40 L132 40 C140 40, 145 42, 145 47 C145 52, 140 54, 132 54 L115 54 Z"
          fill="url(#goldGradient)"
        />

        {/* S */}
        <path
          d="M170 25 C170 15, 180 10, 195 10 C210 10, 220 15, 220 23 L210 25 C210 20, 205 17, 195 17 C185 17, 180 19, 180 24 C180 28, 183 30, 195 33 C210 37, 220 40, 220 48 C220 57, 210 62, 195 62 C180 62, 170 57, 170 47 L180 45 C180 52, 185 55, 195 55 C205 55, 210 53, 210 48 C210 44, 207 42, 195 39 C180 35, 170 32, 170 25 Z"
          fill="url(#goldGradient)"
        />

        {/* I */}
        <path
          d="M235 10 L245 10 L245 60 L235 60 Z"
          fill="url(#goldGradient)"
        />
      </g>

      {/* Tagline */}
      <g className="tagline">
        <text
          x="50"
          y="90"
          fill="url(#goldGradient)"
          fontSize="12"
          fontWeight="300"
          letterSpacing="1.5"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          une Carte,
        </text>
        <text
          x="125"
          y="90"
          fill="url(#goldGradient)"
          fontSize="12"
          fontWeight="300"
          letterSpacing="1.5"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          un Geste,
        </text>
        <text
          x="200"
          y="90"
          fill="url(#goldGradient)"
          fontSize="12"
          fontWeight="300"
          letterSpacing="1.5"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          un Lien
        </text>
      </g>
    </svg>
  );
};
