import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon: Icon, 
  trend, 
  className,
  valuePrefix = '',
  valueSuffix = ''
}) {
  const isPositive = trend === 'up';
  
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-5 group hover:border-blue-300 hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          {change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
            )}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">
          {valuePrefix}{typeof value === 'number' ? value.toLocaleString('fr-FR') : value}{valueSuffix}
        </p>
        {changeLabel && (
          <p className="text-xs text-gray-400 mt-2">{changeLabel}</p>
        )}
      </div>
    </div>
  );
}