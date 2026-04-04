import React, { useCallback, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PullToRefresh from '@/components/PullToRefresh';
import ViewAsUserBanner from '@/components/admin/ViewAsUserBanner';
import { 
  Euro, 
  Users, 
  TrendingUp, 
  Percent, 
  ShoppingCart, 
  Clock,
  ArrowRight,
  Sparkles,
  Store
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MetricCard from '@/components/dashboard/MetricCard';
import SmartInsightCard from '@/components/dashboard/SmartInsightCard';
import TrafficSourceChart from '@/components/dashboard/TrafficSourceChart';
import RevenueChart from '@/components/dashboard/RevenueChart';
import RestaurantMiniCard from '@/components/dashboard/RestaurantMiniCard';
import TopProductsCard from '@/components/dashboard/TopProductsCard';
import MenuEvolutionCard from '@/components/dashboard/MenuEvolutionCard';
import WelcomeCard from '@/components/dashboard/WelcomePopup';
import OnboardingChatBanner from '@/components/dashboard/OnboardingChatBanner';
import EnrichDataCTA from '@/components/dashboard/EnrichDataCTA';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const t = translations[language] || translations.fr;

  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  // Vérifier si admin mode visualisation
  const viewAsEmail = localStorage.getItem('admin_view_as_user');
  const effectiveUserEmail = viewAsEmail || currentUser?.email;

  const { data: restaurants = [], isLoading: restaurantsLoading } = useQuery({
    queryKey: ['restaurants', effectiveUserEmail],
    queryFn: () => base44.entities.Restaurant.filter({ created_by: effectiveUserEmail }, '-created_date'),
    enabled: !!effectiveUserEmail
  });

  const { data: insights = [], isLoading: insightsLoading } = useQuery({
    queryKey: ['insights', effectiveUserEmail],
    queryFn: () => base44.entities.Insight.filter({ created_by: effectiveUserEmail, status: 'new' }, '-created_date', 5),
    enabled: !!effectiveUserEmail
  });

  const { data: onboardingProfiles = [] } = useQuery({
    queryKey: ['onboarding', effectiveUserEmail],
    queryFn: () => base44.entities.OnboardingProfile.filter({ created_by: effectiveUserEmail }, '-created_date', 1),
    enabled: !!effectiveUserEmail
  });

  const profile = onboardingProfiles[0] || null;
  const [bannerDismissed, setBannerDismissed] = React.useState(() => localStorage.getItem('onboarding_banner_dismissed') === '1');
  const dismissBanner = () => { localStorage.setItem('onboarding_banner_dismissed', '1'); setBannerDismissed(true); };
  const [enrichCtaDismissed, setEnrichCtaDismissed] = React.useState(() => localStorage.getItem('enrich_cta_dismissed') === '1');
  const dismissEnrichCta = () => { localStorage.setItem('enrich_cta_dismissed', '1'); setEnrichCtaDismissed(true); };

  // Parse enriched dashboard data from profile
  const revenueChartData = React.useMemo(() => {
    if (!profile?.revenue_chart_data) return null;
    try { return JSON.parse(profile.revenue_chart_data); } catch { return null; }
  }, [profile]);

  const trafficSourcesData = React.useMemo(() => {
    if (!profile?.traffic_sources_data) return null;
    try { return JSON.parse(profile.traffic_sources_data); } catch { return null; }
  }, [profile]);

  const topProductsData = React.useMemo(() => {
    if (!profile?.top_products_data) return null;
    try { return JSON.parse(profile.top_products_data); } catch { return null; }
  }, [profile]);

  const menuItemsData = React.useMemo(() => {
    if (!profile?.menu_items_data) return null;
    try { return JSON.parse(profile.menu_items_data); } catch { return null; }
  }, [profile]);

  const hasEnrichedData = !!(revenueChartData && trafficSourcesData && topProductsData && menuItemsData);
  const isOnboardingCompleted = profile?.status === 'completed';

  // Parse restaurants from onboarding JSON if no Restaurant entities exist
  const onboardingRestaurants = React.useMemo(() => {
    if (!profile?.restaurants_json) return [];
    try { return JSON.parse(profile.restaurants_json); } catch { return []; }
  }, [profile]);

  const allRestaurants = restaurants.length > 0 ? restaurants : onboardingRestaurants;

  const handleRefresh = useCallback(async () => {
    await Promise.all([
      queryClient.refetchQueries({ queryKey: ['restaurants'] }),
      queryClient.refetchQueries({ queryKey: ['insights'] }),
      queryClient.refetchQueries({ queryKey: ['onboarding'] }),
    ]);
  }, [queryClient]);

  // Metrics calculés depuis le profil d'onboarding
  const nbRestaurants = profile?.total_restaurants || restaurants.length || 1;
  const avgRevenue = profile?.avg_monthly_revenue || 0;
  const metrics = {
    totalRevenue: avgRevenue * nbRestaurants,
    averageTicket: profile?.avg_ticket || 0,
    avgCoversPerDay: profile?.avg_covers_per_day || 0,
    totalCustomers: (profile?.avg_covers_per_day || 0) * 30 * nbRestaurants,
    totalEmployees: profile?.total_employees || 0,
    hasDelivery: profile?.has_delivery || false,
    hasTakeaway: profile?.has_takeaway || false,
    deliveryPlatforms: profile?.delivery_platforms || '',
    posSystem: profile?.pos_system || '',
    turnoverRate: profile?.turnover_rate || '',
    mainObjectives: profile?.main_objectives ? profile.main_objectives.split(',').map(s => s.trim()) : [],
    bestSellers: profile?.best_sellers || '',
    countries: profile?.countries || '',
    groupName: profile?.group_name || '',
  };

  return (
    <PullToRefresh onRefresh={handleRefresh} isLoading={restaurantsLoading || insightsLoading}>
      <div className="space-y-6">
      <ViewAsUserBanner />
      <WelcomeCard />
      {!profile && !bannerDismissed && (
        <OnboardingChatBanner onDismiss={dismissBanner} />
      )}

      {/* CTA flottant d'enrichissement post-onboarding */}
      <AnimatePresence>
        {isOnboardingCompleted && !hasEnrichedData && !enrichCtaDismissed && (
          <EnrichDataCTA onDismiss={dismissEnrichCta} />
        )}
      </AnimatePresence>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            {metrics.groupName ? `${metrics.groupName}` : t.dashboard.title}
          </h1>
          <p className="text-gray-500 mt-1">
            {t.dashboard.subtitle} {metrics.groupName ? nbRestaurants : (allRestaurants.length || '...')} {t.dashboard.restaurants}
            {metrics.countries ? ` · ${metrics.countries}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to={createPageUrl('OploChat')}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Sparkles className="w-4 h-4" />
              {t.dashboard.askOplo}
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title={t.dashboard.metrics.monthlyRevenue}
          value={metrics.totalRevenue > 0 ? metrics.totalRevenue : '—'}
          valuePrefix={metrics.totalRevenue > 0 ? "€" : ""}
          changeLabel={metrics.totalRevenue > 0 ? `${nbRestaurants} restaurant(s)` : t.dashboard.metrics.completeOnboarding}
          icon={Euro}
        />
        <MetricCard
          title={t.dashboard.metrics.coversPerDay}
          value={metrics.avgCoversPerDay > 0 ? metrics.avgCoversPerDay * nbRestaurants : '—'}
          changeLabel={metrics.avgCoversPerDay > 0 ? `${t.dashboard.metrics.avgPerResto} ${metrics.avgCoversPerDay}/resto` : t.dashboard.metrics.notProvided}
          icon={Users}
        />
        <MetricCard
          title={t.dashboard.metrics.averageTicket}
          value={metrics.averageTicket > 0 ? metrics.averageTicket : '—'}
          valuePrefix={metrics.averageTicket > 0 ? "€" : ""}
          changeLabel={metrics.averageTicket > 0 ? t.dashboard.metrics.perCover : t.dashboard.metrics.notProvided}
          icon={ShoppingCart}
        />
        <MetricCard
          title={t.dashboard.metrics.customersPerMonth}
          value={metrics.totalCustomers > 0 ? metrics.totalCustomers : '—'}
          changeLabel={metrics.totalCustomers > 0 ? t.dashboard.metrics.groupEstimate : t.dashboard.metrics.notProvided}
          icon={Percent}
        />
        <MetricCard
          title={t.dashboard.metrics.totalStaff}
          value={metrics.totalEmployees > 0 ? metrics.totalEmployees : '—'}
          changeLabel={metrics.totalEmployees > 0 ? t.dashboard.metrics.employees : t.dashboard.metrics.notProvided}
          icon={TrendingUp}
        />
        <MetricCard
          title={t.dashboard.metrics.restaurants}
          value={nbRestaurants}
          changeLabel={metrics.countries || t.dashboard.metrics.group}
          icon={Clock}
        />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RevenueChart chartData={revenueChartData} />
        </div>

        {/* Traffic Sources */}
        <TrafficSourceChart trafficData={trafficSourcesData} />
      </div>

      {/* Smart Insights & Restaurants */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Smart Insights */}
        <div className="rounded-2xl bg-white border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">{t.dashboard.insights.title}</h3>
            </div>
            <Link to={createPageUrl('Insights')}>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
                {t.dashboard.insights.seeAll} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {insightsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24 bg-gray-100" />
              ))}
            </div>
          ) : insights.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>{t.dashboard.insights.noInsights}</p>
              <p className="text-sm mt-1">{t.dashboard.insights.insightsAppear}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {insights.map(insight => (
                <SmartInsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          )}
        </div>

        {/* Restaurants Overview */}
        <div className="rounded-2xl bg-white border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-cyan-600" />
              <h3 className="font-semibold text-gray-900">{t.dashboard.myRestaurants}</h3>
            </div>
            <Link to={createPageUrl('Restaurants')}>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
                {t.dashboard.manage} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {restaurantsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-28 bg-gray-100" />
              ))}
            </div>
          ) : allRestaurants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Store className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>{t.dashboard.noRestaurants}</p>
              <Link to={createPageUrl('Restaurants')}>
                <Button className="mt-3" size="sm">{t.dashboard.addRestaurant}</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {allRestaurants.slice(0, 3).map((restaurant, i) => (
                restaurant.id
                  ? <RestaurantMiniCard key={restaurant.id} restaurant={restaurant} />
                  : (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-sm">
                        {restaurant.name?.[0] || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{restaurant.name}</p>
                        <p className="text-xs text-gray-500">{restaurant.city || restaurant.type || '—'}</p>
                      </div>
                    </div>
                  )
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Évolution de la Carte */}
      <MenuEvolutionCard data={menuItemsData} />

      {/* Top Products */}
      <div className="grid lg:grid-cols-3 gap-6">
        <TopProductsCard productsData={topProductsData} />
        
        {/* Profil opérationnel depuis onboarding */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-200 p-5">
          <h3 className="text-sm font-medium text-gray-600 mb-4">{t.dashboard.operationalProfile}</h3>
          {!profile ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">{t.dashboard.completeOnboardingPrompt}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Canaux */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`rounded-xl p-3 border text-center ${metrics.hasDelivery ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
                  <p className="text-lg mb-1">{metrics.hasDelivery ? '✅' : '❌'}</p>
                  <p className="text-xs font-medium text-gray-700">{t.dashboard.delivery}</p>
                </div>
                <div className={`rounded-xl p-3 border text-center ${metrics.hasTakeaway ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
                  <p className="text-lg mb-1">{metrics.hasTakeaway ? '✅' : '❌'}</p>
                  <p className="text-xs font-medium text-gray-700">{t.dashboard.takeaway}</p>
                </div>
                <div className="rounded-xl p-3 border bg-blue-50 border-blue-100 text-center col-span-2">
                  <p className="text-xs text-gray-500 mb-1">{t.dashboard.posSystem}</p>
                  <p className="text-sm font-semibold text-gray-800">{metrics.posSystem || '—'}</p>
                </div>
              </div>

              {/* Répartition équipe */}
              {profile.kitchen_staff_pct && (
                <div>
                  <h4 className="text-xs text-gray-500 mb-2">{t.dashboard.teamDistribution} ({metrics.totalEmployees} {t.dashboard.people})</h4>
                  <div className="space-y-1.5">
                    {[
                      { name: t.dashboard.kitchen, pct: profile.kitchen_staff_pct, color: 'bg-amber-500' },
                      { name: t.dashboard.floor, pct: profile.floor_staff_pct, color: 'bg-blue-500' },
                      { name: t.dashboard.management, pct: profile.manager_staff_pct, color: 'bg-purple-500' },
                    ].filter(s => s.pct > 0).map(segment => (
                      <div key={segment.name} className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-20">{segment.name}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${segment.color} rounded-full`} style={{ width: `${segment.pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-8 text-right">{segment.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Objectifs */}
              {metrics.mainObjectives.length > 0 && (
                <div>
                  <h4 className="text-xs text-gray-500 mb-2">{t.dashboard.mainObjectives}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {metrics.mainObjectives.map((obj, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700">{obj}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Best sellers */}
              {metrics.bestSellers && (
                <div>
                  <h4 className="text-xs text-gray-500 mb-1">{t.dashboard.bestSellers}</h4>
                  <p className="text-sm text-gray-700">{metrics.bestSellers}</p>
                </div>
              )}

              {/* Plateformes livraison */}
              {metrics.deliveryPlatforms && (
                <div>
                  <h4 className="text-xs text-gray-500 mb-1">{t.dashboard.deliveryPlatforms}</h4>
                  <p className="text-sm text-gray-700">{metrics.deliveryPlatforms}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </PullToRefresh>
  );
}