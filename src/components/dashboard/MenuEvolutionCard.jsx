import React from 'react';
import { ChefHat, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function MenuEvolutionCard({ data }) {
  const hasRealData = !!data;
  const menuData = data || {};

  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-gray-900">Évolution de la carte</h3>
        </div>
        {!hasRealData && (
          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
            Non enrichi
          </span>
        )}
      </div>

      {!hasRealData ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
          <ChefHat className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-medium text-gray-600">Données de carte non enrichies</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">
            Partagez vos données avec Oplo.ai pour afficher les performances réelles
          </p>
          <Link
            to={`${createPageUrl('OploChat')}?mode=enrich`}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium underline"
          >
            Enrichir mes données →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Stats globales */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
              <p className="text-2xl font-bold text-emerald-700 mb-1">
                {menuData.new_dishes != null ? `+${menuData.new_dishes}` : '—'}
              </p>
              <p className="text-xs text-emerald-600">Nouveaux plats</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3 border border-red-100">
              <p className="text-2xl font-bold text-red-700 mb-1">
                {menuData.removed_dishes != null ? `-${menuData.removed_dishes}` : '—'}
              </p>
              <p className="text-xs text-red-600">Plats retirés</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
              <p className="text-2xl font-bold text-amber-700 mb-1">
                {menuData.total_dishes ?? '—'}
              </p>
              <p className="text-xs text-amber-600">Plats actuels</p>
            </div>
          </div>

          {/* Top performers */}
          {menuData.top_performers?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">🌟 Nouveaux succès (30j)</h4>
              <div className="space-y-2">
                {menuData.top_performers.map((dish, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{dish.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        {dish.sales != null && <span className="text-xs text-gray-500">{dish.sales} ventes</span>}
                        {dish.growth != null && (
                          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> +{dish.growth}%
                          </span>
                        )}
                      </div>
                    </div>
                    {dish.revenue != null && (
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">€{Number(dish.revenue).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">CA</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Underperformers */}
          {menuData.underperformers?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">⚠️ À optimiser</h4>
              <div className="space-y-2">
                {menuData.underperformers.map((dish, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{dish.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        {dish.sales != null && <span className="text-xs text-gray-500">{dish.sales} ventes</span>}
                        {dish.growth != null && (
                          <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" /> {dish.growth}%
                          </span>
                        )}
                      </div>
                    </div>
                    {dish.action && (
                      <p className="text-xs text-red-700 font-medium text-right">{dish.action}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Recommendations */}
          {menuData.ai_recommendations?.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Recommandations IA</h4>
              <ul className="space-y-1 text-xs text-blue-700">
                {menuData.ai_recommendations.map((rec, i) => (
                  <li key={i}>• {typeof rec === 'string' ? rec : JSON.stringify(rec)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}