import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/LanguageContext';
import { 
  Target, 
  Flag, 
  ListChecks, 
  Map,
  FileText,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export default function Alignment() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [activeTab, setActiveTab] = useState('overview');

  const subPages = [
    { id: 'overview', label: isEn ? 'Overview' : 'Vue d\'ensemble', icon: Target },
    { id: 'goals', label: isEn ? 'Goals' : 'Objectifs', icon: Flag },
    { id: 'okrs', label: 'OKRs', icon: ListChecks },
    { id: 'strategy', label: isEn ? 'Strategy' : 'Stratégie', icon: Map },
    { id: 'reports', label: isEn ? 'Reports' : 'Rapports', icon: FileText },
    { id: 'insights', label: 'Insights', icon: Sparkles },
  ];

  const statusConfig = {
    on_track: { label: isEn ? 'On track' : 'En bonne voie', color: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle2 },
    at_risk: { label: isEn ? 'At risk' : 'À risque', color: 'bg-amber-500/20 text-amber-400', icon: AlertCircle },
    behind: { label: isEn ? 'Behind' : 'En retard', color: 'bg-red-500/20 text-red-400', icon: AlertCircle },
    completed: { label: isEn ? 'Completed' : 'Complété', color: 'bg-cyan-500/20 text-cyan-400', icon: CheckCircle2 }
  };

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: () => base44.entities.Goal.list('-created_date')
  });

  const stats = {
    totalGoals: goals.length || 12,
    onTrack: goals.filter(g => g.status === 'on_track').length || 8,
    atRisk: goals.filter(g => g.status === 'at_risk').length || 3,
    completed: goals.filter(g => g.status === 'completed').length || 1,
    overallProgress: 67
  };

  const displayGoals = goals.length > 0 ? goals : [
    { id: '1', title: isEn ? 'Increase revenue by 20%' : 'Augmenter le CA de 20%', category: 'revenue', target_value: 3600000, current_value: 2520000, status: 'on_track', deadline: '2024-12-31' },
    { id: '2', title: isEn ? 'Reach 50k customers' : 'Atteindre 50k clients', category: 'customer', target_value: 50000, current_value: 45280, status: 'on_track', deadline: '2024-12-31' },
    { id: '3', title: isEn ? 'Open 2 new restaurants' : 'Ouvrir 2 nouveaux restaurants', category: 'expansion', target_value: 2, current_value: 0, status: 'at_risk', deadline: '2024-12-31' },
    { id: '4', title: isEn ? 'Reduce turnover by 30%' : 'Réduire turnover de 30%', category: 'team', target_value: 30, current_value: 18, status: 'on_track', deadline: '2024-12-31' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-blue-100 border border-blue-300">
          <span className="text-xl font-bold text-blue-600">A</span>
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Alignment</h1>
          <p className="text-gray-500">{isEn ? 'Track your strategic objectives' : 'Suivez vos objectifs stratégiques'}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 border border-gray-200 h-auto flex-wrap gap-1 p-1">
          {subPages.map(page => (
            <TabsTrigger key={page.id} value={page.id} className="data-[state=active]:bg-blue-600 gap-2">
              <page.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{page.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{isEn ? 'Overall progress' : 'Progression globale'}</h3>
                <p className="text-sm text-gray-500">{isEn ? '2024 annual goals' : 'Objectifs annuels 2024'}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{stats.onTrack}</p>
                  <p className="text-xs text-gray-500">{isEn ? 'On track' : 'En bonne voie'}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">{stats.atRisk}</p>
                  <p className="text-xs text-gray-500">{isEn ? 'At risk' : 'À risque'}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-cyan-600">{stats.completed}</p>
                  <p className="text-xs text-gray-500">{isEn ? 'Completed' : 'Complétés'}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{isEn ? 'Progress' : 'Progression'}</span>
                <span className="text-gray-900 font-medium">{stats.overallProgress}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-500" style={{ width: `${stats.overallProgress}%` }} />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {displayGoals.map(goal => {
              const progress = goal.target_value ? Math.round((goal.current_value / goal.target_value) * 100) : 0;
              const config = statusConfig[goal.status] || statusConfig.on_track;
              const Icon = config.icon;
              return (
                <div key={goal.id} className="rounded-xl bg-white border border-gray-200 p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{goal.title}</h4>
                      <Badge className={config.color}>
                        <Icon className="w-3 h-3 mr-1" />{config.label}
                      </Badge>
                    </div>
                    {goal.deadline && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {new Date(goal.deadline).toLocaleDateString(isEn ? 'en-GB' : 'fr-FR', { month: 'short', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{goal.current_value?.toLocaleString()} / {goal.target_value?.toLocaleString()}</span>
                      <span className="text-gray-900 font-medium">{progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all duration-500",
                        goal.status === 'on_track' ? 'bg-emerald-500' :
                        goal.status === 'at_risk' ? 'bg-amber-500' :
                        goal.status === 'behind' ? 'bg-red-500' : 'bg-cyan-500'
                      )} style={{ width: `${Math.min(progress, 100)}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {subPages.slice(1).map(page => (
          <TabsContent key={page.id} value={page.id} className="mt-6">
            <div className="rounded-xl bg-white border border-gray-200 p-12 text-center">
              <page.icon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{page.label}</h3>
              <p className="text-gray-500">{isEn ? 'This section is coming soon' : 'Cette section sera bientôt disponible'}</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
