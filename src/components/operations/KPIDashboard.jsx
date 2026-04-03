import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { TrendingUp, TrendingDown, Minus, Target, DollarSign, Users, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const statusConfig = {
  green: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: '🟢' },
  orange: { bg: 'bg-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-400', icon: '🟠' },
  red: { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400', icon: '🔴' }
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus
};

export default function KPIDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('ceo');

  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const { data: kpis = [] } = useQuery({
    queryKey: ['kpi-metrics', currentUser?.email],
    queryFn: () => base44.entities.KPIMetric.filter({ created_by: currentUser.email }, '-date'),
    enabled: !!currentUser?.email
  });

  const { data: restaurants = [] } = useQuery({
    queryKey: ['restaurants', currentUser?.email],
    queryFn: () => base44.entities.Restaurant.filter({ created_by: currentUser.email }),
    enabled: !!currentUser?.email
  });

  const filteredKPIs = kpis.filter(k => k.category === selectedCategory);

  const KPICard = ({ kpi }) => {
    const status = statusConfig[kpi.status] || statusConfig.orange;
    const TrendIcon = trendIcons[kpi.trend] || Minus;
    const restaurant = restaurants.find(r => r.id === kpi.restaurant_id);
    
    const achievement = kpi.target ? ((kpi.value / kpi.target) * 100).toFixed(0) : null;

    return (
      <div className={cn(
        "p-5 rounded-xl border bg-white",
        status.border
      )}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs">{status.icon}</span>
              <h4 className="font-semibold text-gray-900">{kpi.name}</h4>
            </div>
            {restaurant && (
              <p className="text-xs text-gray-600">{restaurant.name}</p>
            )}
          </div>
          <TrendIcon className={cn("w-5 h-5", status.text)} />
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-gray-900">
            {kpi.value.toLocaleString('fr-FR')}
          </span>
          <span className="text-sm text-gray-600">{kpi.unit}</span>
        </div>

        {kpi.target && (
          <div>
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Objectif: {kpi.target.toLocaleString('fr-FR')} {kpi.unit}</span>
              <span className={status.text}>{achievement}%</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={cn("h-full transition-all", status.bg.replace('/20', ''))}
                style={{ width: `${Math.min(achievement, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const ceoKPIs = filteredKPIs.filter(k => k.category === 'ceo');
  const operationalKPIs = filteredKPIs.filter(k => k.category === 'operational');
  const hrKPIs = filteredKPIs.filter(k => k.category === 'hr');

  const getStatusCount = (category) => {
    const categoryKPIs = kpis.filter(k => k.category === category);
    return {
      green: categoryKPIs.filter(k => k.status === 'green').length,
      orange: categoryKPIs.filter(k => k.status === 'orange').length,
      red: categoryKPIs.filter(k => k.status === 'red').length
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">KPIs non négociables</h3>
        <p className="text-sm text-gray-600">
          Une seule question : "Est-ce que mes restaurants fonctionnent comme prévu ?"
        </p>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="bg-gray-100 border border-gray-200">
          <TabsTrigger value="ceo" className="data-[state=active]:bg-blue-600 gap-2">
            <DollarSign className="w-4 h-4" />
            CEO
            <div className="flex gap-1 ml-2">
              {['green', 'orange', 'red'].map(status => {
                const count = getStatusCount('ceo')[status];
                return count > 0 && (
                  <span key={status} className="text-xs">
                    {statusConfig[status].icon}{count}
                  </span>
                );
              })}
            </div>
          </TabsTrigger>
          <TabsTrigger value="operational" className="data-[state=active]:bg-blue-600 gap-2">
            <Target className="w-4 h-4" />
            Opérationnel
            <div className="flex gap-1 ml-2">
              {['green', 'orange', 'red'].map(status => {
                const count = getStatusCount('operational')[status];
                return count > 0 && (
                  <span key={status} className="text-xs">
                    {statusConfig[status].icon}{count}
                  </span>
                );
              })}
            </div>
          </TabsTrigger>
          <TabsTrigger value="hr" className="data-[state=active]:bg-blue-600 gap-2">
            <Users className="w-4 h-4" />
            RH
            <div className="flex gap-1 ml-2">
              {['green', 'orange', 'red'].map(status => {
                const count = getStatusCount('hr')[status];
                return count > 0 && (
                  <span key={status} className="text-xs">
                    {statusConfig[status].icon}{count}
                  </span>
                );
              })}
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ceo" className="mt-6">
          {ceoKPIs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun KPI CEO configuré</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ceoKPIs.map(kpi => <KPICard key={kpi.id} kpi={kpi} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="operational" className="mt-6">
          {operationalKPIs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun KPI opérationnel configuré</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {operationalKPIs.map(kpi => <KPICard key={kpi.id} kpi={kpi} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="hr" className="mt-6">
          {hrKPIs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun KPI RH configuré</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hrKPIs.map(kpi => <KPICard key={kpi.id} kpi={kpi} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}