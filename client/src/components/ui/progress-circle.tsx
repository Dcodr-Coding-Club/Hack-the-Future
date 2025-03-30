import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressCircleProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  textClassName?: string;
  color?: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  size = 36,
  strokeWidth = 2,
  className,
  textClassName,
  color
}) => {
  const radius = (size / 2) - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  
  // Determine color based on value
  const getColor = () => {
    if (color) return color;
    if (value >= 80) return '#10B981'; // green-500
    if (value >= 60) return '#F59E0B'; // amber-500
    return '#EF4444'; // red-500
  };
  
  const getMatchLabel = () => {
    if (value >= 80) return 'Strong Match';
    if (value >= 60) return 'Good Match';
    return 'Low Match';
  };

  return (
    <div className={cn("relative inline-flex", className)}>
      <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`} fill="none">
        <circle 
          cx={size / 2} 
          cy={size / 2} 
          r={radius}
          stroke="#e6e6e6" 
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle 
          className="transition-all duration-300 ease-in-out"
          cx={size / 2} 
          cy={size / 2} 
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="none"
          style={{
            transformOrigin: '50% 50%',
            transform: 'rotate(-90deg)'
          }}
        />
        <text 
          x={size / 2} 
          y={size / 2} 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fill="#1F2937"
          fontSize={size / 4.5}
          fontWeight="600"
          className={cn("font-sans", textClassName)}
        >
          {value}%
        </text>
      </svg>
    </div>
  );
};

export { ProgressCircle, type ProgressCircleProps };
