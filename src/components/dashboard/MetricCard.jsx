import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

const gradients = [
  'from-blue-500 to-cyan-400',
  'from-violet-500 to-purple-400',
  'from-emerald-500 to-teal-400',
  'from-amber-500 to-orange-400',
  'from-rose-500 to-pink-400',
  'from-cyan-500 to-blue-400',
];

let cardIndex = 0;

export default function MetricCard({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon: Icon, 
  trend, 
  className,
  valuePrefix = '',
  valueSuffix = '',
  colorIndex,
}) {
  const isPositive = trend === 'up';
  const gradientClass = gradients[colorIndex !== undefined ? colorIndex % gradients.length : 0];

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-5 group transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:border-gray-200",
      className
    )}>
      {/* Subtle gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-cyan-50/0 group-hover:from-blue-50/60 group-hover:to-cyan-50/30 transition-all duration-500 pointer-events-none" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "p-2.5 rounded-xl bg-gradient-to-br shadow-md flex-shrink-0",
            gradientClass,
          )}>
            <Icon className="w-4.5 h-4.5 text-white" style={{ width: '18px', height: '18px' }} />
          </div>
          {change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold",
              isPositive
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-red-50 text-red-500 border border-red-100"
            )}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900 tracking-tight">
          {valuePrefix}{typeof value === 'number' ? value.toLocaleString('fr-FR') : value}{valueSuffix}
        </p>
        {changeLabel && (
          <p className="text-xs text-gray-400 mt-1.5 font-medium">{changeLabel}</p>
        )}
      </div>
    </div>
  );
}
