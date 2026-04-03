import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Compass, 
  Target, 
  TrendingUp, 
  Map,
  Search,
  Building2,
  Users,
  Euro,
  ChefHat,
  Star,
  Flame
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import MarketSizeBreakdown from '@/components/market/MarketSizeBreakdown';
import CompetitorAnalysis from '@/components/market/CompetitorAnalysis';

const subPages = [
  { id: 'overview', label: 'Overview', icon: Compass },
  { id: 'competitors', label: 'Concurrents', icon: Building2 },
  { id: 'trends', label: 'Tendances', icon: TrendingUp },
];

const trends = [
  { name: 'Cuisine végétale', growth: '+34%', status: 'emerging' },
  { name: 'Livraison premium', growth: '+28%', status: 'growing' },
  { name: 'Expérience immersive', growth: '+22%', status: 'emerging' },
  { name: 'Local & Bio', growth: '+18%', status: 'mature' },
  { name: 'Brunch dominical', growth: '+15%', status: 'growing' },
];

const threatLevelMap = {
  critical: 'Menace critique',
  high: 'Forte menace',
  medium: 'Modéré',
  low: 'Faible'
};

export default function Market() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showMarketBreakdown, setShowMarketBreakdown] = useState(false);

  const { data: competitors = [] } = useQuery({
    queryKey: ['competitors'],
    queryFn: () => base44.entities.Competitor.list('-google_rating', 4)
  });

  const marketStats = {
    marketSize: 2.8,
    growth: 4.5,
    share: 8.2,
    competitorCount: 45
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-blue-100 border border-blue-300">
          <span className="text-xl font-bold text-blue-600">M</span>
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Market</h1>
          <p className="text-gray-500">Analysez votre marché et vos concurrents</p>
        </div>
      </div>

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

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Market Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              onClick={() => setShowMarketBreakdown(true)}
              className="rounded-xl bg-white border border-gray-200 p-5 cursor-pointer hover:border-blue-400 hover:scale-[1.02] transition-all group"
            >
              <div className="flex items-center gap-2 mb-3">
                <Euro className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-gray-500">Taille du marché</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">€{marketStats.marketSize}Md</p>
              <p className="text-xs text-blue-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Cliquez pour voir le détail →</p>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-gray-500">Croissance marché</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">+{marketStats.growth}%</p>
              <p className="text-xs text-gray-500 mt-1">Année sur année</p>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-cyan-600" />
                <span className="text-sm text-gray-500">Part de marché</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{marketStats.share}%</p>
              <p className="text-xs text-gray-500 mt-1">Estimée</p>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-5 h-5 text-amber-600" />
                <span className="text-sm text-gray-500">Concurrents directs</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{marketStats.competitorCount}</p>
              <p className="text-xs text-gray-500 mt-1">Dans votre zone</p>
            </div>
          </div>

          {/* Competitors & Trends */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Competitors */}
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <h3 className="text-sm font-medium text-gray-600 mb-4">Principaux concurrents</h3>
              <div className="space-y-3">
                {competitors.length > 0 ? (
                  competitors.map((comp, i) => (
                    <div key={comp.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 font-bold">
                        {comp.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{comp.name}</p>
                        <p className="text-xs text-gray-500">
                          {comp.price_range || '€€'} · {comp.cuisine_type || 'Restaurant'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <p className="text-sm font-medium text-gray-900">{comp.google_rating || '-'}★</p>
                        <Badge className={cn(
                          "border text-xs whitespace-nowrap",
                          comp.threat_level === 'critical' || comp.threat_level === 'high' ? 'bg-red-100 text-red-700 border-red-200' :
                          comp.threat_level === 'medium' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                          'bg-emerald-100 text-emerald-700 border-emerald-200'
                        )}>
                          {threatLevelMap[comp.threat_level] || 'Modéré'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">Aucun concurrent enregistré</p>
                )}
              </div>
            </div>

            {/* Market Trends */}
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <h3 className="text-sm font-medium text-gray-600 mb-4">Tendances du marché</h3>
              <div className="space-y-3">
                {trends.map((trend, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{trend.name}</p>
                      <Badge className={
                        trend.status === 'emerging' ? 'bg-blue-100 text-blue-700' :
                        trend.status === 'growing' ? 'bg-cyan-100 text-cyan-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {trend.status === 'emerging' ? 'Émergent' : trend.status === 'growing' ? 'En croissance' : 'Mature'}
                      </Badge>
                    </div>
                    <p className="text-lg font-semibold text-emerald-600">{trend.growth}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="competitors" className="mt-6">
          <CompetitorAnalysis />
        </TabsContent>

        <TabsContent value="trends" className="mt-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-gray-500">Plats tendance</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">28</p>
              <p className="text-xs text-gray-500 mt-1">Identifiés ce mois</p>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-500">Restaurants analysés</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">87</p>
              <p className="text-xs text-gray-500 mt-1">Même niche</p>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-amber-600" />
                <span className="text-sm text-gray-500">Note moy. plats tendance</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">4.7/5</p>
              <p className="text-xs text-emerald-600 mt-1">Très bien reçus</p>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-gray-500">Croissance moy.</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">+42%</p>
              <p className="text-xs text-gray-500 mt-1">Ventes vs reste carte</p>
            </div>
          </div>

          {/* Plats qui marchent chez les concurrents */}
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <ChefHat className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Plats à succès dans votre niche</h3>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  name: 'Risotto crémeux aux champignons sauvages',
                  restaurants: ['Le Gourmet', 'Chez Antoine', 'La Table'],
                  avgPrice: 28,
                  rating: 4.8,
                  orders: 1240,
                  growth: '+68%',
                  margin: '65-72%',
                  insights: 'Plébiscité en automne/hiver, excellente marge, présentation Instagram-friendly',
                  recommendations: 'Version truffe pour gamme premium, option végé appréciée'
                },
                {
                  name: 'Tataki de thon rouge sésame-soja',
                  restaurants: ['Sakura', 'L\'Asiatique', 'Tokyo Fusion'],
                  avgPrice: 32,
                  rating: 4.7,
                  orders: 980,
                  growth: '+54%',
                  margin: '68-75%',
                  insights: 'Forte demande clientèle jeune 25-40 ans, marges excellentes, rotation rapide',
                  recommendations: 'Soigner présentation visuelle, proposer en entrée et plat'
                },
                {
                  name: 'Pavlova fruits rouges & basilic',
                  restaurants: ['Sweet Table', 'La Pâtisserie', 'Délices'],
                  avgPrice: 12,
                  rating: 4.9,
                  orders: 1540,
                  growth: '+71%',
                  margin: '78-82%',
                  insights: 'Dessert signature très partagé sur réseaux sociaux, marge exceptionnelle',
                  recommendations: 'Version individuelle et à partager, déclinaisons saisonnières'
                },
                {
                  name: 'Burger gourmet bœuf Wagyu bacon',
                  restaurants: ['Burger Lab', 'The Meat House', 'Premium Grill'],
                  avgPrice: 26,
                  rating: 4.6,
                  orders: 2180,
                  growth: '+48%',
                  margin: '58-64%',
                  insights: 'Forte demande week-end et brunch, ticket élevé accepté si qualité au rendez-vous',
                  recommendations: 'Pain brioche maison, frites artisanales incluses'
                },
                {
                  name: 'Poke bowl saumon avocat edamame',
                  restaurants: ['Poké Paradise', 'Fresh Bowl', 'Aloha Kitchen'],
                  avgPrice: 16,
                  rating: 4.5,
                  orders: 1820,
                  growth: '+62%',
                  margin: '72-78%',
                  insights: 'Clientèle santé/fitness, commandes régulières, bonne marge',
                  recommendations: 'Personnalisation (bases, protéines, toppings) = valeur perçue ++'
                },
                {
                  name: 'Côte de veau Milanese escalope',
                  restaurants: ['Trattoria Roma', 'Bella Italia', 'Da Marco'],
                  avgPrice: 34,
                  rating: 4.7,
                  orders: 840,
                  growth: '+38%',
                  margin: '62-68%',
                  insights: 'Plat signature italien, très photogénique, clientèle fidèle',
                  recommendations: 'Arrosage citron en salle = expérience, portion généreuse attendue'
                },
                {
                  name: 'Crème brûlée vanille bourbon',
                  restaurants: ['Le Français', 'Brasserie du Parc', 'L\'Épicurien'],
                  avgPrice: 9,
                  rating: 4.8,
                  orders: 2340,
                  growth: '+44%',
                  margin: '82-88%',
                  insights: 'Dessert classique indémodable, marge énorme, facile à produire en série',
                  recommendations: 'Caramélisation minute devant client = théâtralisation'
                },
                {
                  name: 'Tartare de bœuf couteau',
                  restaurants: ['Le Boucher', 'Meat & Co', 'Bistrot Carnivore'],
                  avgPrice: 24,
                  rating: 4.6,
                  orders: 1120,
                  growth: '+52%',
                  margin: '64-70%',
                  insights: 'Plat vedette clientèle connaisseur, préparation minute valorisée',
                  recommendations: 'Proposer accompagnements premium (frites maison, salade roquette)'
                }
              ].map((dish, i) => (
                <div 
                  key={i} 
                  className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 p-5 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        <h4 className="text-lg font-bold text-gray-900">{dish.name}</h4>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                          {dish.restaurants.length} restaurants
                        </Badge>
                        <span className="text-sm text-gray-600">
                          📍 {dish.restaurants.slice(0, 2).join(', ')}{dish.restaurants.length > 2 && ` +${dish.restaurants.length - 2}`}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-500 mb-1">
                        <Star className="w-5 h-5 fill-amber-500" />
                        <span className="text-xl font-bold text-gray-900">{dish.rating}</span>
                      </div>
                      <p className="text-sm text-emerald-600 font-semibold">{dish.growth}</p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Prix moyen</p>
                      <p className="text-lg font-bold text-gray-900">€{dish.avgPrice}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Commandes</p>
                      <p className="text-lg font-bold text-gray-900">{dish.orders}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Croissance</p>
                      <p className="text-lg font-bold text-emerald-600">{dish.growth}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Marge</p>
                      <p className="text-lg font-bold text-emerald-600">{dish.margin}</p>
                    </div>
                  </div>

                  {/* Insights */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                    <p className="text-xs text-blue-600 font-semibold mb-2">📊 Analyse marché</p>
                    <p className="text-sm text-gray-700">{dish.insights}</p>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <p className="text-xs text-emerald-700 font-semibold mb-2">💡 Recommandations pour votre carte</p>
                    <p className="text-sm text-gray-700">{dish.recommendations}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tendances émergentes */}
          <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Tendances émergentes à surveiller</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: 'Comfort food revisité', growth: '+89%', desc: 'Plats réconfortants avec twist gastronomique (mac & cheese truffe, grilled cheese premium)' },
                { name: 'Cuisine plant-based premium', growth: '+76%', desc: 'Végétarien/végétalien haut de gamme (caviar d\'aubergine, tartare de betterave)' },
                { name: 'Partage & convivialité', growth: '+64%', desc: 'Plats à partager, planches mixtes, pots de table (fondue, pierrade)' },
                { name: 'Fusion Asie-Méditerranée', growth: '+58%', desc: 'Mariages audacieux (ceviche yuzu, agneau miso, burrata soja)' }
              ].map((trend, i) => (
                <div key={i} className="bg-white rounded-lg border border-amber-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{trend.name}</h4>
                    <span className="text-sm font-bold text-orange-600">{trend.growth}</span>
                  </div>
                  <p className="text-sm text-gray-600">{trend.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>


      </Tabs>

      <MarketSizeBreakdown 
        open={showMarketBreakdown} 
        onClose={() => setShowMarketBreakdown(false)} 
      />
    </div>
  );
}