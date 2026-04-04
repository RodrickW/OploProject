import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/LanguageContext';
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

export default function Market() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [activeTab, setActiveTab] = useState('overview');
  const [showMarketBreakdown, setShowMarketBreakdown] = useState(false);

  const subPages = [
    { id: 'overview', label: isEn ? 'Overview' : 'Vue d\'ensemble', icon: Compass },
    { id: 'competitors', label: isEn ? 'Competitors' : 'Concurrents', icon: Building2 },
    { id: 'trends', label: isEn ? 'Trends' : 'Tendances', icon: TrendingUp },
  ];

  const trends = [
    { name: isEn ? 'Plant-based cuisine' : 'Cuisine végétale', growth: '+34%', status: 'emerging' },
    { name: isEn ? 'Premium delivery' : 'Livraison premium', growth: '+28%', status: 'growing' },
    { name: isEn ? 'Immersive experience' : 'Expérience immersive', growth: '+22%', status: 'emerging' },
    { name: isEn ? 'Local & Organic' : 'Local & Bio', growth: '+18%', status: 'mature' },
    { name: isEn ? 'Sunday brunch' : 'Brunch dominical', growth: '+15%', status: 'growing' },
  ];

  const threatLevelMap = {
    critical: isEn ? 'Critical threat' : 'Menace critique',
    high: isEn ? 'High threat' : 'Forte menace',
    medium: isEn ? 'Moderate' : 'Modéré',
    low: isEn ? 'Low' : 'Faible'
  };

  const trendStatusLabel = {
    emerging: isEn ? 'Emerging' : 'Émergent',
    growing: isEn ? 'Growing' : 'En croissance',
    mature: isEn ? 'Mature' : 'Mature'
  };

  const dishes = [
    {
      name: isEn ? 'Wild mushroom creamy risotto' : 'Risotto crémeux aux champignons sauvages',
      restaurants: ['Le Gourmet', 'Chez Antoine', 'La Table'],
      avgPrice: 28, rating: 4.8, orders: 1240, growth: '+68%', margin: '65-72%',
      insights: isEn ? 'Popular in autumn/winter, excellent margin, Instagram-friendly presentation' : 'Plébiscité en automne/hiver, excellente marge, présentation Instagram-friendly',
      recommendations: isEn ? 'Truffle version for premium range, vegetarian option appreciated' : 'Version truffe pour gamme premium, option végé appréciée'
    },
    {
      name: isEn ? 'Red tuna tataki sesame-soy' : 'Tataki de thon rouge sésame-soja',
      restaurants: ['Sakura', 'L\'Asiatique', 'Tokyo Fusion'],
      avgPrice: 32, rating: 4.7, orders: 980, growth: '+54%', margin: '68-75%',
      insights: isEn ? 'High demand among 25-40 demographic, excellent margins, fast turnover' : 'Forte demande clientèle jeune 25-40 ans, marges excellentes, rotation rapide',
      recommendations: isEn ? 'Focus on visual presentation, offer as starter and main course' : 'Soigner présentation visuelle, proposer en entrée et plat'
    },
    {
      name: isEn ? 'Pavlova red fruits & basil' : 'Pavlova fruits rouges & basilic',
      restaurants: ['Sweet Table', 'La Pâtisserie', 'Délices'],
      avgPrice: 12, rating: 4.9, orders: 1540, growth: '+71%', margin: '78-82%',
      insights: isEn ? 'Signature dessert highly shared on social media, exceptional margin' : 'Dessert signature très partagé sur réseaux sociaux, marge exceptionnelle',
      recommendations: isEn ? 'Individual and sharing portions, seasonal variations' : 'Version individuelle et à partager, déclinaisons saisonnières'
    },
    {
      name: isEn ? 'Wagyu beef gourmet burger' : 'Burger gourmet bœuf Wagyu bacon',
      restaurants: ['Burger Lab', 'The Meat House', 'Premium Grill'],
      avgPrice: 26, rating: 4.6, orders: 2180, growth: '+48%', margin: '58-64%',
      insights: isEn ? 'High weekend and brunch demand, elevated ticket accepted if quality delivered' : 'Forte demande week-end et brunch, ticket élevé accepté si qualité au rendez-vous',
      recommendations: isEn ? 'House brioche bun, artisan fries included' : 'Pain brioche maison, frites artisanales incluses'
    },
    {
      name: isEn ? 'Salmon avocado edamame poke bowl' : 'Poke bowl saumon avocat edamame',
      restaurants: ['Poké Paradise', 'Fresh Bowl', 'Aloha Kitchen'],
      avgPrice: 16, rating: 4.5, orders: 1820, growth: '+62%', margin: '72-78%',
      insights: isEn ? 'Health-conscious customers, regular orders, good margin' : 'Clientèle santé/fitness, commandes régulières, bonne marge',
      recommendations: isEn ? 'Customisation (bases, proteins, toppings) = higher perceived value' : 'Personnalisation (bases, protéines, toppings) = valeur perçue ++'
    },
    {
      name: isEn ? 'Veal Milanese escalope' : 'Côte de veau Milanese escalope',
      restaurants: ['Trattoria Roma', 'Bella Italia', 'Da Marco'],
      avgPrice: 34, rating: 4.7, orders: 840, growth: '+38%', margin: '62-68%',
      insights: isEn ? 'Italian signature dish, very photogenic, loyal customer base' : 'Plat signature italien, très photogénique, clientèle fidèle',
      recommendations: isEn ? 'Tableside lemon dressing = experience, generous portion expected' : 'Arrosage citron en salle = expérience, portion généreuse attendue'
    },
    {
      name: isEn ? 'Bourbon vanilla crème brûlée' : 'Crème brûlée vanille bourbon',
      restaurants: ['Le Français', 'Brasserie du Parc', 'L\'Épicurien'],
      avgPrice: 9, rating: 4.8, orders: 2340, growth: '+44%', margin: '82-88%',
      insights: isEn ? 'Timeless classic dessert, huge margin, easy to produce at scale' : 'Dessert classique indémodable, marge énorme, facile à produire en série',
      recommendations: isEn ? 'Tableside caramelisation = theatre for guests' : 'Caramélisation minute devant client = théâtralisation'
    },
    {
      name: isEn ? 'Hand-cut beef tartare' : 'Tartare de bœuf couteau',
      restaurants: ['Le Boucher', 'Meat & Co', 'Bistrot Carnivore'],
      avgPrice: 24, rating: 4.6, orders: 1120, growth: '+52%', margin: '64-70%',
      insights: isEn ? 'Favourite among connoisseurs, minute preparation valued by customers' : 'Plat vedette clientèle connaisseur, préparation minute valorisée',
      recommendations: isEn ? 'Offer premium sides (house fries, rocket salad)' : 'Proposer accompagnements premium (frites maison, salade roquette)'
    }
  ];

  const emergingTrends = [
    { name: isEn ? 'Revamped comfort food' : 'Comfort food revisité', growth: '+89%', desc: isEn ? 'Comforting dishes with gastronomic twist (truffle mac & cheese, premium grilled cheese)' : 'Plats réconfortants avec twist gastronomique (mac & cheese truffe, grilled cheese premium)' },
    { name: isEn ? 'Premium plant-based' : 'Cuisine plant-based premium', growth: '+76%', desc: isEn ? 'High-end vegetarian/vegan (aubergine caviar, beetroot tartare)' : 'Végétarien/végétalien haut de gamme (caviar d\'aubergine, tartare de betterave)' },
    { name: isEn ? 'Sharing & conviviality' : 'Partage & convivialité', growth: '+64%', desc: isEn ? 'Sharing platters, mixed boards, table pots (fondue, hot stone)' : 'Plats à partager, planches mixtes, pots de table (fondue, pierrade)' },
    { name: isEn ? 'Asia-Mediterranean fusion' : 'Fusion Asie-Méditerranée', growth: '+58%', desc: isEn ? 'Bold pairings (yuzu ceviche, miso lamb, soy burrata)' : 'Mariages audacieux (ceviche yuzu, agneau miso, burrata soja)' }
  ];

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
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-blue-100 border border-blue-300">
          <span className="text-xl font-bold text-blue-600">M</span>
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{isEn ? 'Market' : 'Marché'}</h1>
          <p className="text-gray-500">{isEn ? 'Analyse your market and competitors' : 'Analysez votre marché et vos concurrents'}</p>
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              onClick={() => setShowMarketBreakdown(true)}
              className="rounded-xl bg-white border border-gray-200 p-5 cursor-pointer hover:border-blue-400 hover:scale-[1.02] transition-all group"
            >
              <div className="flex items-center gap-2 mb-3">
                <Euro className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-gray-500">{isEn ? 'Market size' : 'Taille du marché'}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">€{marketStats.marketSize}Md</p>
              <p className="text-xs text-blue-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{isEn ? 'Click for breakdown →' : 'Cliquez pour voir le détail →'}</p>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-gray-500">{isEn ? 'Market growth' : 'Croissance marché'}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">+{marketStats.growth}%</p>
              <p className="text-xs text-gray-500 mt-1">{isEn ? 'Year over year' : 'Année sur année'}</p>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-cyan-600" />
                <span className="text-sm text-gray-500">{isEn ? 'Market share' : 'Part de marché'}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{marketStats.share}%</p>
              <p className="text-xs text-gray-500 mt-1">{isEn ? 'Estimated' : 'Estimée'}</p>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-5 h-5 text-amber-600" />
                <span className="text-sm text-gray-500">{isEn ? 'Direct competitors' : 'Concurrents directs'}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{marketStats.competitorCount}</p>
              <p className="text-xs text-gray-500 mt-1">{isEn ? 'In your area' : 'Dans votre zone'}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <h3 className="text-sm font-medium text-gray-600 mb-4">{isEn ? 'Top competitors' : 'Principaux concurrents'}</h3>
              <div className="space-y-3">
                {competitors.length > 0 ? (
                  competitors.map((comp, i) => (
                    <div key={comp.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 font-bold">
                        {comp.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{comp.name}</p>
                        <p className="text-xs text-gray-500">{comp.price_range || '€€'} · {comp.cuisine_type || (isEn ? 'Restaurant' : 'Restaurant')}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <p className="text-sm font-medium text-gray-900">{comp.google_rating || '-'}★</p>
                        <Badge className={cn("border text-xs whitespace-nowrap",
                          comp.threat_level === 'critical' || comp.threat_level === 'high' ? 'bg-red-100 text-red-700 border-red-200' :
                          comp.threat_level === 'medium' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                          'bg-emerald-100 text-emerald-700 border-emerald-200'
                        )}>
                          {threatLevelMap[comp.threat_level] || (isEn ? 'Moderate' : 'Modéré')}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">{isEn ? 'No competitors registered' : 'Aucun concurrent enregistré'}</p>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <h3 className="text-sm font-medium text-gray-600 mb-4">{isEn ? 'Market trends' : 'Tendances du marché'}</h3>
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
                        {trendStatusLabel[trend.status]}
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-gray-500">{isEn ? 'Trending dishes' : 'Plats tendance'}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">28</p>
              <p className="text-xs text-gray-500 mt-1">{isEn ? 'Identified this month' : 'Identifiés ce mois'}</p>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-500">{isEn ? 'Restaurants analysed' : 'Restaurants analysés'}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">87</p>
              <p className="text-xs text-gray-500 mt-1">{isEn ? 'Same niche' : 'Même niche'}</p>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-amber-600" />
                <span className="text-sm text-gray-500">{isEn ? 'Avg. rating trending dishes' : 'Note moy. plats tendance'}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">4.7/5</p>
              <p className="text-xs text-emerald-600 mt-1">{isEn ? 'Very well received' : 'Très bien reçus'}</p>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-gray-500">{isEn ? 'Avg. growth' : 'Croissance moy.'}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">+42%</p>
              <p className="text-xs text-gray-500 mt-1">{isEn ? 'Sales vs rest of menu' : 'Ventes vs reste carte'}</p>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <ChefHat className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">{isEn ? 'Successful dishes in your niche' : 'Plats à succès dans votre niche'}</h3>
            </div>
            <div className="space-y-4">
              {dishes.map((dish, i) => (
                <div key={i} className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 p-5 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        <h4 className="text-lg font-bold text-gray-900">{dish.name}</h4>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                          {dish.restaurants.length} {isEn ? 'restaurants' : 'restaurants'}
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
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">{isEn ? 'Avg. price' : 'Prix moyen'}</p>
                      <p className="text-lg font-bold text-gray-900">€{dish.avgPrice}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">{isEn ? 'Orders' : 'Commandes'}</p>
                      <p className="text-lg font-bold text-gray-900">{dish.orders}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">{isEn ? 'Growth' : 'Croissance'}</p>
                      <p className="text-lg font-bold text-emerald-600">{dish.growth}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">{isEn ? 'Margin' : 'Marge'}</p>
                      <p className="text-lg font-bold text-emerald-600">{dish.margin}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                    <p className="text-xs text-blue-600 font-semibold mb-2">📊 {isEn ? 'Market analysis' : 'Analyse marché'}</p>
                    <p className="text-sm text-gray-700">{dish.insights}</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <p className="text-xs text-emerald-700 font-semibold mb-2">💡 {isEn ? 'Recommendations for your menu' : 'Recommandations pour votre carte'}</p>
                    <p className="text-sm text-gray-700">{dish.recommendations}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 {isEn ? 'Emerging trends to watch' : 'Tendances émergentes à surveiller'}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {emergingTrends.map((trend, i) => (
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
