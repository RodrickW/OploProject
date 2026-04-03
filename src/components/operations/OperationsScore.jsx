import React from 'react';
import { Trophy, TrendingUp, DollarSign, Settings, Users, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export default function OperationsScore({ restaurant, scores }) {
  const defaultScores = {
    overall: 82,
    revenue: 90,
    profit: 75,
    operations: 80,
    customer: 85,
    team: 78
  };

  const scoreData = scores || defaultScores;

  const getScoreColor = (score) => {
    if (score >= 85) return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Excellent' };
    if (score >= 70) return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Bon' };
    if (score >= 50) return { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'À améliorer' };
    return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Critique' };
  };

  const overallStyle = getScoreColor(scoreData.overall);

  const categories = [
    { key: 'revenue', label: 'Revenue', icon: DollarSign, score: scoreData.revenue },
    { key: 'profit', label: 'Profit', icon: TrendingUp, score: scoreData.profit },
    { key: 'operations', label: 'Operations', icon: Settings, score: scoreData.operations },
    { key: 'customer', label: 'Customer', icon: Star, score: scoreData.customer },
    { key: 'team', label: 'Team', icon: Users, score: scoreData.team },
  ];

  return (
    <div className="rounded-xl bg-white border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Operations Score</h3>
      </div>

      {/* Overall Score */}
      <div className={cn("rounded-xl border p-6 mb-6", overallStyle.bg, overallStyle.border)}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Score global</p>
            <p className="text-5xl font-bold" style={{ color: overallStyle.color.replace('text-', '') }}>
              {scoreData.overall}
              <span className="text-2xl text-gray-400">/100</span>
            </p>
          </div>
          <div className={cn("px-4 py-2 rounded-lg border", overallStyle.bg, overallStyle.border)}>
            <p className={cn("text-sm font-semibold", overallStyle.color)}>{overallStyle.label}</p>
          </div>
        </div>
        <Progress 
          value={scoreData.overall} 
          className={cn("h-3", overallStyle.bg)}
        />
      </div>

      {/* Category Scores */}
      <div className="space-y-4">
        {categories.map(category => {
          const Icon = category.icon;
          const style = getScoreColor(category.score);
          
          return (
            <div key={category.key} className="flex items-center gap-4">
              <div className={cn("p-2 rounded-lg", style.bg)}>
                <Icon className={cn("w-5 h-5", style.color)} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-700">{category.label}</p>
                  <p className={cn("text-lg font-bold", style.color)}>{category.score}</p>
                </div>
                <Progress 
                  value={category.score} 
                  className={cn("h-2", style.bg)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-600 mb-3">Points d'amélioration prioritaires</p>
        <ul className="space-y-2">
          {categories
            .filter(c => c.score < 80)
            .sort((a, b) => a.score - b.score)
            .slice(0, 2)
            .map(category => (
              <li key={category.key} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>Améliorer <strong>{category.label}</strong> (score: {category.score}/100)</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}