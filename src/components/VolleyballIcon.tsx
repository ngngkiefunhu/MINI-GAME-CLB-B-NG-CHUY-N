import React from 'react';

interface VolleyballIconProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export const VolleyballIcon: React.FC<VolleyballIconProps> = ({
  className = '',
  size = 28,
  animate = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animate ? 'animate-bounce' : ''} ${className}`}
      style={{ filter: 'drop-shadow(0 4px 8px rgba(255, 138, 54, 0.4))' }}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="46" fill="#FF8A36" stroke="#0B132B" strokeWidth="3" />
      
      {/* Volleyball panels with orange and white sections */}
      {/* Top panel cluster */}
      <path
        d="M 50 4 A 46 46 0 0 1 89 25 C 72 32 60 40 50 50 C 40 40 28 32 11 25 A 46 46 0 0 1 50 4 Z"
        fill="#FFFFFF"
        stroke="#0B132B"
        strokeWidth="2.5"
      />
      <path
        d="M 11 25 C 28 32 40 40 50 50 C 38 60 30 72 23 89 A 46 46 0 0 1 4 50 C 4 41 6 32 11 25 Z"
        fill="#FF9E54"
        stroke="#0B132B"
        strokeWidth="2.5"
      />
      <path
        d="M 89 25 C 72 32 60 40 50 50 C 62 60 70 72 77 89 A 46 46 0 0 0 96 50 C 96 41 94 32 89 25 Z"
        fill="#FF7518"
        stroke="#0B132B"
        strokeWidth="2.5"
      />
      <path
        d="M 50 50 C 62 60 70 72 77 89 A 46 46 0 0 1 23 89 C 30 72 38 60 50 50 Z"
        fill="#F5F7FA"
        stroke="#0B132B"
        strokeWidth="2.5"
      />
      
      {/* Inner panel contour lines */}
      <path
        d="M 50 4 L 50 50 M 11 25 C 30 38 42 45 50 50 M 89 25 C 70 38 58 45 50 50 M 23 89 C 33 75 42 63 50 50 M 77 89 C 67 75 58 63 50 50"
        stroke="#0B132B"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Gloss reflection highlight */}
      <ellipse cx="38" cy="24" rx="12" ry="6" transform="rotate(-30 38 24)" fill="white" opacity="0.45" />
    </svg>
  );
};
