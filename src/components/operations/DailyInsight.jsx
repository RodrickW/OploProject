import React from 'react';
import { Lightbulb, TrendingUp, Target, ChefHat } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function DailyInsight({ insight }) {
  const defaultInsight = {
    title: "72% des ventes générées par 3 plats",
    description: "Vos best-sellers (Burger Classic, Steak Frites, Caesar Salad) représentent la majorité de votre chiffre d'affaires.",
    suggestions: [
      "Optimiser la production de ces 3 plats pour réduire le temps de préparation",
      "Améliorer leur visibilité sur le menu (position, mise en avant)",
      "Former l'équipe à l'upsell de ces plats avec boissons premium"
    ],
    metric: "72%",
    metricLabel: "du CA",
    impact: "high",
    category: "revenue"
  };

  const insightData = insight || defaultInsight;

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-white border border-blue-200 shadow-sm">
          <Lightbulb className="w-6 h-6 text-blue-600" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900">Insight du jour</h3>
                <Badge className={getImpactColor(insightData.impact)}>
                  Impact {insightData.impact === 'high' ? 'élevé' : insightData.impact}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">Généré par l'IA Oplo</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">{insightData.metric}</p>
              <p className="text-xs text-gray-600">{insightData.metricLabel}</p>
            </div>
          </div>

          <p className="text-base text-gray-900 font-medium mb-4">
            {insightData.title}
          </p>
          
          <p className="text-sm text-gray-700 mb-4">
            {insightData.description}
          </p>

          <div className="bg-white rounded-lg border border-blue-100 p-4">
            <p className="text-xs font-semibold text-gray-600 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              Actions recommandées
            </p>
            <ul className="space-y-2">
              {insightData.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-600 font-bold mt-0.5">{index + 1}.</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}