import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, ArrowRight, AlertTriangle, TrendingUp, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

const priorityConfig = {
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-100',
    badge: 'bg-red-100 text-red-600'
  },
  high: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: TrendingUp,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100',
    badge: 'bg-amber-100 text-amber-700'
  },
  medium: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: Lightbulb,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    badge: 'bg-blue-100 text-blue-700'
  },
  low: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    icon: Sparkles,
    iconColor: 'text-cyan-600',
    iconBg: 'bg-cyan-50',
    badge: 'bg-gray-100 text-gray-600'
  }
};

export default function SmartInsightCard({ insight, onAction }) {
  const config = priorityConfig[insight.priority] || priorityConfig.medium;
  const Icon = config.icon;

  return (
    <div className={cn(
      "rounded-xl border p-4 transition-all duration-200 hover:scale-[1.02]",
      config.bg, config.border
    )}>
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg", config.iconBg, config.iconColor)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase", config.badge)}>
              {insight.priority === 'critical' ? 'Critique' : 
               insight.priority === 'high' ? 'Important' : 
               insight.priority === 'medium' ? 'Moyen' : 'Info'}
            </span>
            <span className="text-xs text-gray-400">{insight.category}</span>
          </div>
          <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">{insight.title}</h4>
          <p className="text-xs text-gray-500 line-clamp-2">{insight.description}</p>
          {insight.recommended_action && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0"
              onClick={onAction}
            >
              Voir l'action <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}