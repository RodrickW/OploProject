import React from 'react';
import { AlertTriangle, AlertCircle, TrendingDown, Clock, Package, ChefHat, Users, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AutomaticAlerts({ alerts }) {
  const defaultAlerts = [
    {
      id: 1,
      type: 'critical',
      category: 'profit',
      icon: TrendingDown,
      title: 'Food cost en hausse',
      description: 'Food cost +5% vs moyenne',
      value: '+5%',
      suggestion: 'Vérifier les prix fournisseurs et portions servies',
      restaurant: 'Restaurant Paris 11e',
      timestamp: '2h ago'
    },
    {
      id: 2,
      type: 'warning',
      category: 'revenue',
      icon: TrendingDown,
      title: 'Ticket moyen en baisse',
      description: 'Ticket moyen -8% cette semaine',
      value: '-8%',
      suggestion: 'Former l\'équipe à l\'upsell des boissons et desserts',
      restaurant: 'Tous les restaurants',
      timestamp: '4h ago'
    },
    {
      id: 3,
      type: 'critical',
      category: 'stock',
      icon: Package,
      title: 'Rupture de stock',
      description: '3 produits indisponibles',
      value: '3 items',
      suggestion: 'Commander : steak, saumon, vin blanc',
      restaurant: 'Restaurant Lyon 2e',
      timestamp: '30min ago'
    },
    {
      id: 4,
      type: 'warning',
      category: 'operations',
      icon: Clock,
      title: 'Temps de service élevé',
      description: 'Temps moyen: 18min (+6min)',
      value: '+6min',
      suggestion: 'Simplifier le menu ou ajouter un commis de cuisine',
      restaurant: 'Restaurant Marseille',
      timestamp: '1h ago'
    },
    {
      id: 5,
      type: 'info',
      category: 'team',
      icon: Users,
      title: 'Sous-effectif prévu',
      description: '2 absences demain midi',
      value: '-2',
      suggestion: 'Contacter les extras de la liste de remplacement',
      restaurant: 'Restaurant Bordeaux',
      timestamp: '6h ago'
    },
  ];

  const alertList = alerts || defaultAlerts;

  const getAlertStyle = (type) => {
    switch (type) {
      case 'critical':
        return {
          badge: 'bg-red-100 text-red-800 border-red-200',
          border: 'border-red-200',
          bg: 'bg-red-50',
          icon: 'text-red-600'
        };
      case 'warning':
        return {
          badge: 'bg-orange-100 text-orange-800 border-orange-200',
          border: 'border-orange-200',
          bg: 'bg-orange-50',
          icon: 'text-orange-600'
        };
      case 'info':
        return {
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          border: 'border-blue-200',
          bg: 'bg-blue-50',
          icon: 'text-blue-600'
        };
      default:
        return {
          badge: 'bg-gray-100 text-gray-800 border-gray-200',
          border: 'border-gray-200',
          bg: 'bg-gray-50',
          icon: 'text-gray-600'
        };
    }
  };

  const criticalCount = alertList.filter(a => a.type === 'critical').length;
  const warningCount = alertList.filter(a => a.type === 'warning').length;

  return (
    <div className="rounded-xl bg-white border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-blue-600" />
            Alertes automatiques
          </h3>
          <p className="text-sm text-gray-500 mt-1">Anomalies détectées par l'IA</p>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <Badge className="bg-red-100 text-red-800 border-red-200">
              {criticalCount} critique{criticalCount > 1 ? 's' : ''}
            </Badge>
          )}
          {warningCount > 0 && (
            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
              {warningCount} attention
            </Badge>
          )}
        </div>
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        {alertList.map(alert => {
          const style = getAlertStyle(alert.type);
          const Icon = alert.icon;
          
          return (
            <div 
              key={alert.id}
              className={cn(
                "rounded-xl border p-4 transition-all hover:shadow-md",
                style.border,
                style.bg
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn("p-2 rounded-lg bg-white", style.border)}>
                  <Icon className={cn("w-5 h-5", style.icon)} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        {alert.title}
                        <Badge className={cn("text-xs font-bold", style.badge)}>
                          {alert.value}
                        </Badge>
                      </h4>
                      <p className="text-sm text-gray-600 mt-0.5">{alert.description}</p>
                    </div>
                    <span className="text-xs text-gray-400">{alert.timestamp}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">💡 Suggestion</p>
                      <p className="text-sm text-gray-700 font-medium">{alert.suggestion}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-gray-300 hover:bg-white text-xs"
                    >
                      Traiter <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">📍 {alert.restaurant}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-red-50 border border-red-100">
            <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
            <p className="text-xs text-gray-600 mt-1">Critique</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-orange-50 border border-orange-100">
            <p className="text-2xl font-bold text-orange-600">{warningCount}</p>
            <p className="text-xs text-gray-600 mt-1">Attention</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-2xl font-bold text-blue-600">{alertList.filter(a => a.type === 'info').length}</p>
            <p className="text-xs text-gray-600 mt-1">Info</p>
          </div>
        </div>
      </div>
    </div>
  );
}