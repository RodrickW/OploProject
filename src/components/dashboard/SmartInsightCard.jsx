import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, ArrowRight, AlertTriangle, TrendingUp, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

const priorityConfig = {
  critical: {
    gradient: 'from-red-500/10 to-rose-500/5',
    border: 'border-red-200/60',
    icon: AlertTriangle,
    iconGradient: 'from-red-500 to-rose-600',
    badge: 'bg-red-100 text-red-600 border-red-200',
    label: { fr: 'Critique', en: 'Critical' },
    dot: 'bg-red-500',
  },
  high: {
    gradient: 'from-amber-500/10 to-orange-500/5',
    border: 'border-amber-200/60',
    icon: TrendingUp,
    iconGradient: 'from-amber-500 to-orange-500',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    label: { fr: 'Important', en: 'High' },
    dot: 'bg-amber-500',
  },
  medium: {
    gradient: 'from-blue-500/10 to-cyan-500/5',
    border: 'border-blue-200/60',
    icon: Lightbulb,
    iconGradient: 'from-blue-500 to-cyan-500',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    label: { fr: 'Moyen', en: 'Medium' },
    dot: 'bg-blue-500',
  },
  low: {
    gradient: 'from-gray-500/5 to-slate-500/5',
    border: 'border-gray-200/60',
    icon: Sparkles,
    iconGradient: 'from-slate-500 to-gray-600',
    badge: 'bg-gray-100 text-gray-600 border-gray-200',
    label: { fr: 'Info', en: 'Info' },
    dot: 'bg-gray-400',
  }
};

export default function SmartInsightCard({ insight, onAction }) {
  const config = priorityConfig[insight.priority] || priorityConfig.medium;
  const Icon = config.icon;

  return (
    <div className={cn(
      "rounded-xl border bg-gradient-to-br p-4 transition-all duration-200 hover:shadow-md hover:shadow-black/5 hover:-translate-y-0.5",
      config.gradient, config.border
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-lg bg-gradient-to-br flex-shrink-0 shadow-sm",
          config.iconGradient
        )}>
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={cn(
              "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border tracking-wide",
              config.badge
            )}>
              {config.label.fr}
            </span>
            {insight.category && (
              <span className="text-xs text-gray-400 truncate">{insight.category}</span>
            )}
          </div>
          <h4 className="font-semibold text-gray-900 text-sm mb-1 leading-snug">{insight.title}</h4>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{insight.description}</p>
          {insight.recommended_action && (
            <button
              onClick={onAction}
              className="mt-2 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Voir l'action <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
