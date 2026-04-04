import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ViewAsUserBanner from '@/components/admin/ViewAsUserBanner';
import { 
  Users, 
  BarChart3, 
  MessageSquare, 
  HeadphonesIcon,
  Route,
  ClipboardList,
  TrendingUp,
  Star,
  UserPlus,
  UserMinus
} from 'lucide-react';
import CustomerJourneyMap from '@/components/customer/CustomerJourneyMap';
import CustomerAnalytics from '@/components/customer/CustomerAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { createPageUrl } from '@/utils';

const subPages = [
  { id: 'overview', label: 'Overview', icon: Users },
  { id: 'analytics', label: 'Customer Analytics', icon: BarChart3 },
  { id: 'feedback', label: 'Feedback Tracker', icon: MessageSquare },
  { id: 'tickets', label: 'Support Tickets', icon: HeadphonesIcon },
  { id: 'journey', label: 'Customer Journey', icon: Route },
  { id: 'questionnaire', label: 'Questionnaire', icon: ClipboardList },
];

export default function CustomerSuccess() {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  // Vérifier si admin mode visualisation
  const viewAsEmail = localStorage.getItem('admin_view_as_user');
  const effectiveUserEmail = viewAsEmail || currentUser?.email;

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers', effectiveUserEmail],
    queryFn: () => base44.entities.Customer.filter({ created_by: effectiveUserEmail }, '-created_date'),
    enabled: !!effectiveUserEmail
  });

  const { data: feedbacks = [] } = useQuery({
    queryKey: ['feedbacks', effectiveUserEmail],
    queryFn: () => base44.entities.Feedback.filter({ created_by: effectiveUserEmail }, '-created_date', 10),
    enabled: !!effectiveUserEmail
  });

  const hasCustomerData = customers.length > 0;

  const stats = hasCustomerData ? {
    total: customers.length,
    new: customers.filter(c => c.segment === 'new').length,
    vip: customers.filter(c => c.segment === 'vip').length,
    atRisk: customers.filter(c => c.segment === 'at_risk').length,
    avgSatisfaction: (customers.reduce((acc, c) => acc + (c.satisfaction_score || 0), 0) / customers.length).toFixed(1),
    nps: 0
  } : null;

  return (
    <div className="space-y-6">
      <ViewAsUserBanner />
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-blue-100 border border-blue-300">
          <span className="text-xl font-bold text-blue-600">C</span>
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Customer Success</h1>
          <p className="text-gray-500">Gérez la satisfaction et la fidélité de vos clients</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 border border-gray-200 h-auto flex-wrap gap-1 p-1">
          {subPages.map(page => (
            <TabsTrigger 
              key={page.id} 
              value={page.id}
              className="data-[state=active]:bg-blue-600 gap-2"
            >
              <page.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{page.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {!hasCustomerData ? (
            <div className="rounded-xl bg-white border border-gray-200 p-12 text-center">
              <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connectez votre système de caisse</h3>
              <p className="text-gray-500 mb-6">
                Les données clients proviennent de votre POS ou CRM intégré.<br/>
                Rendez-vous dans <strong>Intégrations Oplo</strong> pour connecter votre système.
              </p>
              <Button 
                onClick={() => window.location.href = createPageUrl('IntegrationsOplo')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Configurer les intégrations
              </Button>
            </div>
          ) : (
            <>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-500">Total clients</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.total.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-2 text-emerald-600 text-sm">
                <TrendingUp className="w-4 h-4" /> +8.3%
              </div>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <UserPlus className="w-5 h-5 text-cyan-600" />
                <span className="text-sm text-gray-500">Nouveaux (30j)</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.new.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-2 text-emerald-600 text-sm">
                <TrendingUp className="w-4 h-4" /> +12%
              </div>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-amber-600" />
                <span className="text-sm text-gray-500">Clients VIP</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.vip.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">Top 5% des dépenses</p>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <UserMinus className="w-5 h-5 text-red-600" />
                <span className="text-sm text-gray-500">À risque</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.atRisk.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">Dernière visite &gt; 60j</p>
            </div>
          </div>

          {/* Satisfaction & NPS */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <h3 className="text-sm font-medium text-gray-600 mb-4">Satisfaction client</h3>
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                    <circle 
                      cx="64" cy="64" r="56" fill="none" 
                      stroke="url(#gradient)" strokeWidth="12"
                      strokeDasharray={`${(stats.avgSatisfaction / 5) * 352} 352`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900">{stats.avgSatisfaction}</p>
                      <p className="text-xs text-gray-500">/5</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-4">{rating}★</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-violet-600 to-cyan-600 rounded-full"
                          style={{ width: `${rating === 5 ? 65 : rating === 4 ? 25 : rating === 3 ? 7 : 3}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{rating === 5 ? 65 : rating === 4 ? 25 : rating === 3 ? 7 : 3}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <h3 className="text-sm font-medium text-gray-600 mb-4">Net Promoter Score (NPS)</h3>
              <div className="flex items-center justify-center py-4">
                <div className="text-center">
                  <p className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    {stats.nps}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Excellent</p>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-4">
                <span>Détracteurs: 8%</span>
                <span>Passifs: 12%</span>
                <span>Promoteurs: 80%</span>
              </div>
            </div>
          </div>

          {/* Recent Feedbacks */}
          <div className="rounded-xl bg-white border border-gray-200 p-5">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Derniers avis</h3>
            <div className="space-y-3">
              {feedbacks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucun feedback récent</p>
              ) : (
                feedbacks.slice(0, 5).map(feedback => (
                  <div key={feedback.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                      feedback.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-600' :
                      feedback.sentiment === 'negative' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-600'
                    )}>
                      {feedback.rating}★
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{feedback.comment || 'Pas de commentaire'}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="border-gray-200 text-gray-600 text-xs">
                          {feedback.category || 'Général'}
                        </Badge>
                        <span className="text-xs text-gray-500">{feedback.source}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          </>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
          <CustomerAnalytics />
        </TabsContent>

        {/* Journey Tab */}
        <TabsContent value="journey" className="mt-6">
          <CustomerJourneyMap />
        </TabsContent>

        {/* Other tabs - placeholder content */}
        {subPages.slice(1).filter(p => !['analytics', 'journey'].includes(p.id)).map(page => (
          <TabsContent key={page.id} value={page.id} className="mt-6">
            <div className="rounded-xl bg-white border border-gray-200 p-12 text-center">
              <page.icon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{page.label}</h3>
              <p className="text-gray-500">Cette section sera bientôt disponible</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}