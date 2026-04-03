import React from 'react';
import { ChefHat, Star, Settings, HelpCircle, X, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function MenuEngineering({ menuData }) {
  const defaultMenuData = [
    { name: 'Burger Classic', sales: 320, margin: 'high', category: 'star', profitability: 85, popularity: 92 },
    { name: 'Caesar Salad', sales: 180, margin: 'medium', category: 'workhorse', profitability: 62, popularity: 65 },
    { name: 'Truffle Pasta', sales: 45, margin: 'high', category: 'puzzle', profitability: 88, popularity: 28 },
    { name: 'Fish Plate', sales: 22, margin: 'low', category: 'dog', profitability: 35, popularity: 18 },
    { name: 'Steak Frites', sales: 280, margin: 'high', category: 'star', profitability: 82, popularity: 88 },
    { name: 'Veggie Bowl', sales: 95, margin: 'medium', category: 'workhorse', profitability: 58, popularity: 45 },
    { name: 'Lobster Risotto', sales: 18, margin: 'high', category: 'puzzle', profitability: 91, popularity: 15 },
    { name: 'Chicken Wings', sales: 12, margin: 'low', category: 'dog', profitability: 28, popularity: 12 },
  ];

  const items = menuData || defaultMenuData;

  const getCategoryConfig = (category) => {
    switch (category) {
      case 'star':
        return {
          icon: Star,
          label: 'Star',
          color: 'bg-green-100 text-green-800 border-green-200',
          description: 'Forte marge + Forte vente',
          action: 'Mettre en avant'
        };
      case 'workhorse':
        return {
          icon: Settings,
          label: 'Workhorse',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          description: 'Marge moyenne + Forte vente',
          action: 'Augmenter la marge'
        };
      case 'puzzle':
        return {
          icon: HelpCircle,
          label: 'Puzzle',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          description: 'Forte marge + Faible vente',
          action: 'Promouvoir ou retirer'
        };
      case 'dog':
        return {
          icon: X,
          label: 'Dog',
          color: 'bg-red-100 text-red-800 border-red-200',
          description: 'Faible marge + Faible vente',
          action: 'Retirer du menu'
        };
      default:
        return {
          icon: HelpCircle,
          label: category,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          description: '',
          action: ''
        };
    }
  };

  const categoryStats = {
    star: items.filter(i => i.category === 'star').length,
    workhorse: items.filter(i => i.category === 'workhorse').length,
    puzzle: items.filter(i => i.category === 'puzzle').length,
    dog: items.filter(i => i.category === 'dog').length,
  };

  return (
    <div className="rounded-xl bg-white border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-blue-600" />
            Menu Engineering
          </h3>
          <p className="text-sm text-gray-500 mt-1">Optimisez la rentabilité de votre carte</p>
        </div>
      </div>

      {/* Insight IA */}
      <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              {((categoryStats.star / items.length) * 100).toFixed(0)}% de votre carte est composée de Stars
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Suggestion : Retirer {categoryStats.dog} plat(s) "Dog" et promouvoir les {categoryStats.puzzle} "Puzzle"
            </p>
          </div>
        </div>
      </div>

      {/* Menu matrix */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-xs font-medium text-gray-500 pb-3 pr-4">Plat</th>
              <th className="text-right text-xs font-medium text-gray-500 pb-3 px-2">Ventes</th>
              <th className="text-center text-xs font-medium text-gray-500 pb-3 px-2">Rentabilité</th>
              <th className="text-center text-xs font-medium text-gray-500 pb-3 px-2">Popularité</th>
              <th className="text-center text-xs font-medium text-gray-500 pb-3 px-2">Catégorie</th>
              <th className="text-left text-xs font-medium text-gray-500 pb-3 pl-4">Action suggérée</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const config = getCategoryConfig(item.category);
              const Icon = config.icon;
              
              return (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 pr-4">
                    <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <p className="font-semibold text-gray-900">{item.sales}</p>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            item.profitability > 75 ? "bg-green-500" : item.profitability > 50 ? "bg-yellow-500" : "bg-red-500"
                          )} 
                          style={{ width: `${item.profitability}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 w-8">{item.profitability}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            item.popularity > 75 ? "bg-blue-500" : item.popularity > 50 ? "bg-cyan-500" : "bg-gray-400"
                          )} 
                          style={{ width: `${item.popularity}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 w-8">{item.popularity}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex justify-center">
                      <Badge className={cn("border gap-1 font-semibold", config.color)}>
                        <Icon className="w-3 h-3" />
                        {config.label}
                      </Badge>
                    </div>
                  </td>
                  <td className="py-4 pl-4">
                    <p className="text-xs text-gray-600">{config.action}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Légende */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs font-medium text-gray-500 mb-3">Catégories Menu Engineering</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries({
            star: 'star',
            workhorse: 'workhorse',
            puzzle: 'puzzle',
            dog: 'dog'
          }).map(([key, category]) => {
            const config = getCategoryConfig(category);
            const Icon = config.icon;
            return (
              <div key={key} className={cn("p-3 rounded-lg border", config.color.replace('text-', 'bg-').replace('-800', '-50').replace('bg-bg-', 'bg-'))}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4" />
                  <p className="font-semibold text-sm">{config.label}</p>
                </div>
                <p className="text-xs opacity-80">{config.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}