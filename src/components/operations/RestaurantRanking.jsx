import React from 'react';
import { Trophy, TrendingUp, TrendingDown, AlertTriangle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function RestaurantRanking({ restaurants }) {
  const defaultRestaurants = [
    { name: 'Le Bistrot Paris 11e', revenue: 8200, primeCost: 55, avgTicket: 19, growth: 12, rank: 1 },
    { name: 'Brasserie Lyon 2e', revenue: 7900, primeCost: 58, avgTicket: 18, growth: 8, rank: 2 },
    { name: 'Resto Marseille Vieux-Port', revenue: 7100, primeCost: 61, avgTicket: 17, growth: 5, rank: 3 },
    { name: 'Café Bordeaux Centre', revenue: 6300, primeCost: 67, avgTicket: 16, growth: -3, rank: 4 },
  ];

  const rankedRestaurants = restaurants || defaultRestaurants;

  const getRankBadge = (rank) => {
    if (rank === 1) return { icon: '🥇', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    if (rank === 2) return { icon: '🥈', color: 'bg-gray-100 text-gray-700 border-gray-300' };
    if (rank === 3) return { icon: '🥉', color: 'bg-orange-100 text-orange-700 border-orange-200' };
    return { icon: rank, color: 'bg-white text-gray-600 border-gray-200' };
  };

  const getPrimeCostStatus = (primeCost) => {
    if (primeCost < 60) return { label: 'Excellent', color: 'text-green-600 bg-green-50 border-green-200' };
    if (primeCost < 65) return { label: 'Bon', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    if (primeCost < 70) return { label: 'Attention', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    return { label: 'Critique', color: 'text-red-600 bg-red-50 border-red-200' };
  };

  return (
    <div className="rounded-xl bg-white border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-600" />
            Classement des restaurants
          </h3>
          <p className="text-sm text-gray-500 mt-1">Performance comparative de vos établissements</p>
        </div>
      </div>

      {/* Alerte IA */}
      {rankedRestaurants.some(r => r.primeCost > 65) && (
        <div className="mb-6 p-4 rounded-xl bg-orange-50 border border-orange-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-900">
                {rankedRestaurants.filter(r => r.primeCost > 65).length} restaurant(s) avec prime cost élevé
              </p>
              <p className="text-xs text-orange-700 mt-1">
                Suggestion : Analyser la structure des coûts (food + labor) et optimiser le staffing
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Table ranking */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-xs font-medium text-gray-500 pb-3 pr-4">Rang</th>
              <th className="text-left text-xs font-medium text-gray-500 pb-3 pr-4">Restaurant</th>
              <th className="text-right text-xs font-medium text-gray-500 pb-3 px-2">CA</th>
              <th className="text-center text-xs font-medium text-gray-500 pb-3 px-2">Prime Cost</th>
              <th className="text-right text-xs font-medium text-gray-500 pb-3 px-2">Ticket moy.</th>
              <th className="text-right text-xs font-medium text-gray-500 pb-3 pl-2">Évolution</th>
            </tr>
          </thead>
          <tbody>
            {rankedRestaurants.map((resto, index) => {
              const rankBadge = getRankBadge(resto.rank);
              const primeCostStatus = getPrimeCostStatus(resto.primeCost);
              
              return (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 pr-4">
                    <Badge className={cn("border font-bold", rankBadge.color)}>
                      {rankBadge.icon}
                    </Badge>
                  </td>
                  <td className="py-4 pr-4">
                    <p className="font-medium text-gray-900 text-sm">{resto.name}</p>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <p className="font-bold text-gray-900">€{resto.revenue.toLocaleString()}</p>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex justify-center">
                      <Badge className={cn("border text-xs font-semibold", primeCostStatus.color)}>
                        {resto.primeCost}%
                      </Badge>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <p className="text-sm text-gray-700">€{resto.avgTicket}</p>
                  </td>
                  <td className="py-4 pl-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {resto.growth > 0 ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">+{resto.growth}%</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-600">{resto.growth}%</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Key insights */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-2xl font-bold text-blue-600">€{(rankedRestaurants.reduce((acc, r) => acc + r.revenue, 0) / rankedRestaurants.length).toLocaleString()}</p>
            <p className="text-xs text-gray-600 mt-1">CA moyen</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-50 border border-green-100">
            <p className="text-2xl font-bold text-green-600">{rankedRestaurants.filter(r => r.growth > 0).length}/{rankedRestaurants.length}</p>
            <p className="text-xs text-gray-600 mt-1">En croissance</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-purple-50 border border-purple-100">
            <p className="text-2xl font-bold text-purple-600">€{Math.round(rankedRestaurants.reduce((acc, r) => acc + r.avgTicket, 0) / rankedRestaurants.length)}</p>
            <p className="text-xs text-gray-600 mt-1">Ticket moyen</p>
          </div>
        </div>
      </div>
    </div>
  );
}