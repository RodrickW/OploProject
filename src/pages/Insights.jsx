import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/LanguageContext';
import ViewAsUserBanner from '@/components/admin/ViewAsUserBanner';
import { 
  Lightbulb, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles,
  Filter,
  CheckCircle,
  Clock,
  ArrowRight,
  Euro
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function Insights() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [activeTab, setActiveTab] = useState('all');
  const queryClient = useQueryClient();

  const priorityConfig = {
    critical: {
      label: isEn ? 'Critical' : 'Critique',
      icon: AlertTriangle,
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      badge: 'bg-red-500/20 text-red-400'
    },
    high: {
      label: isEn ? 'Important' : 'Important',
      icon: TrendingUp,
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      badge: 'bg-amber-500/20 text-amber-400'
    },
    medium: {
      label: isEn ? 'Medium' : 'Moyen',
      icon: Lightbulb,
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-700'
    },
    low: {
      label: 'Info',
      icon: Sparkles,
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      text: 'text-cyan-400',
      badge: 'bg-cyan-500/20 text-cyan-400'
    }
  };

  const categoryLabels = {
    customer: isEn ? 'Customers' : 'Clients',
    operations: isEn ? 'Operations' : 'Opérations',
    market: isEn ? 'Market' : 'Marché',
    product: isEn ? 'Products' : 'Produits',
    alignment: 'Alignment',
    sales: isEn ? 'Sales' : 'Ventes',
    team: isEn ? 'Team' : 'Équipe'
  };

  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const viewAsEmail = localStorage.getItem('admin_view_as_user');
  const effectiveUserEmail = viewAsEmail || currentUser?.email;

  const { data: insights = [], isLoading } = useQuery({
    queryKey: ['insights', effectiveUserEmail],
    queryFn: () => base44.entities.Insight.filter({ created_by: effectiveUserEmail }, '-created_date'),
    enabled: !!effectiveUserEmail
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Insight.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['insights'])
  });

  const filteredInsights = activeTab === 'all' 
    ? insights 
    : insights.filter(i => i.priority === activeTab);

  const criticalCount = insights.filter(i => i.priority === 'critical' && i.status === 'new').length;
  const highCount = insights.filter(i => i.priority === 'high' && i.status === 'new').length;

  const InsightCard = ({ insight }) => {
    const config = priorityConfig[insight.priority] || priorityConfig.medium;
    const Icon = config.icon;

    return (
      <div className={cn("rounded-xl border p-5 transition-all duration-200 hover:scale-[1.01]", config.bg, config.border)}>
        <div className="flex items-start gap-4">
          <div className={cn("p-2.5 rounded-xl bg-white/80", config.text)}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge className={config.badge}>{config.label}</Badge>
              <Badge variant="outline" className="border-gray-200 text-gray-600">
                {categoryLabels[insight.category] || insight.category}
              </Badge>
              {insight.status === 'new' && (
                <Badge className="bg-blue-100 text-blue-700">{isEn ? 'New' : 'Nouveau'}</Badge>
              )}
              {insight.status === 'in_progress' && (
                <Badge className="bg-amber-100 text-amber-700">{isEn ? 'In progress' : 'En cours'}</Badge>
              )}
              {insight.status === 'resolved' && (
                <Badge className="bg-emerald-100 text-emerald-700">{isEn ? 'Resolved' : 'Résolu'}</Badge>
              )}
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{insight.description}</p>
            
            {insight.impact_value && (
              <div className="flex items-center gap-2 mb-4 text-sm">
                <Euro className="w-4 h-4 text-emerald-600" />
                <span className="text-gray-600">{isEn ? 'Estimated impact:' : 'Impact estimé:'}</span>
                <span className="font-semibold text-emerald-600">€{insight.impact_value.toLocaleString()}</span>
              </div>
            )}
            
            {insight.recommended_action && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">{isEn ? 'Recommended action' : 'Action recommandée'}</p>
                <p className="text-sm text-gray-700">{insight.recommended_action}</p>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              {insight.status === 'new' && (
                <Button 
                  size="sm"
                  onClick={() => updateMutation.mutate({ id: insight.id, data: { status: 'in_progress' }})}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Clock className="w-4 h-4 mr-1" /> {isEn ? 'Take over' : 'Prendre en charge'}
                </Button>
              )}
              {insight.status === 'in_progress' && (
                <Button 
                  size="sm"
                  onClick={() => updateMutation.mutate({ id: insight.id, data: { status: 'resolved' }})}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle className="w-4 h-4 mr-1" /> {isEn ? 'Mark resolved' : 'Marquer résolu'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <ViewAsUserBanner />
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Business Insights</h1>
          <p className="text-gray-500 mt-1">{isEn ? 'Real-time analysis of your restaurants' : 'Analyse en temps réel de vos restaurants'}</p>
        </div>
        {(criticalCount > 0 || highCount > 0) && (
          <div className="flex items-center gap-3">
            {criticalCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 border border-red-300">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">{criticalCount} {isEn ? 'critical' : 'critique(s)'}</span>
              </div>
            )}
            {highCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">{highCount} {isEn ? 'important' : 'important(s)'}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 border border-gray-200">
          <TabsTrigger value="all">{isEn ? 'All' : 'Tous'} ({insights.length})</TabsTrigger>
          <TabsTrigger value="critical" className="text-red-600">
            {isEn ? 'Critical' : 'Critiques'} ({insights.filter(i => i.priority === 'critical').length})
          </TabsTrigger>
          <TabsTrigger value="high" className="text-amber-600">
            {isEn ? 'Important' : 'Importants'} ({insights.filter(i => i.priority === 'high').length})
          </TabsTrigger>
          <TabsTrigger value="medium">
            {isEn ? 'Medium' : 'Moyens'} ({insights.filter(i => i.priority === 'medium').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map(i => <div key={i} className="h-40 rounded-xl bg-gray-100 animate-pulse" />)}
            </div>
          ) : filteredInsights.length === 0 ? (
            <div className="text-center py-16">
              <Sparkles className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{isEn ? 'No insights' : 'Aucun insight'}</h3>
              <p className="text-gray-500">
                {isEn
                  ? <>Insights will appear automatically<br/>when we detect opportunities</>
                  : <>Les insights apparaîtront automatiquement<br/>lorsque nous détecterons des opportunités</>
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredInsights.map(insight => <InsightCard key={insight.id} insight={insight} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
