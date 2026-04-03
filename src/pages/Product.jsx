import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Layers, 
  MessageSquare, 
  BarChart3,
  TrendingUp,
  Star,
  Euro,
  ThumbsUp,
  ThumbsDown,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const subPages = [
  { id: 'overview', label: 'Overview', icon: ShoppingBag },
  { id: 'roadmap', label: 'Évolution Carte', icon: Layers },
  { id: 'feedback', label: 'Retours clients', icon: MessageSquare },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
];

const topProducts = [
  { name: 'Côte de bœuf maturée', category: 'Plat', margin: 68, sales: 1250, rating: 4.8 },
  { name: 'Plateau fruits de mer', category: 'Entrée', margin: 72, sales: 890, rating: 4.7 },
  { name: 'Tarte Tatin', category: 'Dessert', margin: 78, sales: 1540, rating: 4.9 },
  { name: 'Magret de canard', category: 'Plat', margin: 65, sales: 720, rating: 4.6 },
  { name: 'Soupe à l\'oignon', category: 'Entrée', margin: 82, sales: 980, rating: 4.4 },
];

const menuCategories = [
  { name: 'Entrées', items: 12, avgMargin: 75, contribution: 18 },
  { name: 'Plats', items: 18, avgMargin: 62, contribution: 52 },
  { name: 'Desserts', items: 8, avgMargin: 78, contribution: 15 },
  { name: 'Boissons', items: 24, avgMargin: 85, contribution: 15 },
];

export default function Product() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalItems: 62,
    avgMargin: 68,
    topPerformer: 'Tarte Tatin',
    underperforming: 3
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-blue-100 border border-blue-300">
          <span className="text-xl font-bold text-blue-600">P</span>
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Product/Service</h1>
          <p className="text-gray-500">Analysez et optimisez votre carte</p>
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
          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-500">Produits actifs</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Euro className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-gray-500">Marge moyenne</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.avgMargin}%</p>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-amber-600" />
                <span className="text-sm text-gray-500">Top performer</span>
              </div>
              <p className="text-lg font-bold text-gray-900 truncate">{stats.topPerformer}</p>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-red-600 rotate-180" />
                <span className="text-sm text-gray-500">Sous-performants</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.underperforming}</p>
            </div>
          </div>

          {/* Categories & Top Products */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Categories */}
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <h3 className="text-sm font-medium text-gray-600 mb-4">Catégories</h3>
              <div className="space-y-4">
                {menuCategories.map((cat, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-900 font-medium">{cat.name}</span>
                      <span className="text-sm text-gray-500">{cat.items} items · {cat.avgMargin}% marge</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
                        style={{ width: `${cat.contribution}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{cat.contribution}% du CA</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <h3 className="text-sm font-medium text-gray-600 mb-4">Top produits</h3>
              <div className="space-y-3">
                {topProducts.map((product, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-gray-300 text-gray-600 text-xs">
                          {product.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{product.sales} ventes</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-emerald-600">{product.margin}%</p>
                      <p className="text-xs text-amber-600">{product.rating}★</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="mt-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-500">Total retours</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">847</p>
              <p className="text-xs text-gray-500 mt-1">Ce mois</p>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <ThumbsUp className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-gray-500">Positifs</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">742</p>
              <p className="text-xs text-emerald-600 mt-1">88% du total</p>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <ThumbsDown className="w-5 h-5 text-red-600" />
                <span className="text-sm text-gray-500">Négatifs</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">105</p>
              <p className="text-xs text-red-600 mt-1">12% du total</p>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-amber-600" />
                <span className="text-sm text-gray-500">Note moyenne</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">4.6/5</p>
              <p className="text-xs text-emerald-600 mt-1">+0.2 vs mois dernier</p>
            </div>
          </div>

          {/* Retours par plat */}
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Retours clients par plat</h3>
            <div className="space-y-4">
              {[
                { 
                  name: 'Côte de bœuf maturée', 
                  positive: 156, 
                  negative: 8, 
                  rating: 4.8,
                  comments: [
                    { type: 'positive', text: 'Cuisson parfaite, viande fondante !' },
                    { type: 'positive', text: 'Meilleure viande que j\'ai mangée' },
                    { type: 'negative', text: 'Un peu trop salée' }
                  ]
                },
                { 
                  name: 'Tarte Tatin', 
                  positive: 189, 
                  negative: 5, 
                  rating: 4.9,
                  comments: [
                    { type: 'positive', text: 'Caramel incroyable, texture parfaite' },
                    { type: 'positive', text: 'Le meilleur dessert du restaurant' }
                  ]
                },
                { 
                  name: 'Plateau fruits de mer', 
                  positive: 124, 
                  negative: 18, 
                  rating: 4.5,
                  comments: [
                    { type: 'positive', text: 'Très frais, belle présentation' },
                    { type: 'negative', text: 'Huîtres un peu petites' },
                    { type: 'negative', text: 'Prix élevé pour la quantité' }
                  ]
                },
                { 
                  name: 'Magret de canard', 
                  positive: 98, 
                  negative: 22, 
                  rating: 4.3,
                  comments: [
                    { type: 'positive', text: 'Sauce excellente' },
                    { type: 'negative', text: 'Trop cuit, manque de juteux' },
                    { type: 'negative', text: 'Portion un peu petite' }
                  ]
                },
                { 
                  name: 'Soupe à l\'oignon', 
                  positive: 76, 
                  negative: 31, 
                  rating: 3.9,
                  comments: [
                    { type: 'positive', text: 'Gratinage parfait' },
                    { type: 'negative', text: 'Manque de goût, trop fade' },
                    { type: 'negative', text: 'Fromage pas assez fondu' }
                  ]
                }
              ].map((dish, i) => (
                <div key={i} className="rounded-xl bg-gray-50 border border-gray-200 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-gray-900 font-semibold mb-1">{dish.name}</h4>
...
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-5 h-5 fill-amber-500" />
                        <span className="text-lg font-bold text-gray-900">{dish.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {dish.comments.map((comment, idx) => (
                      <div 
                        key={idx} 
                        className={`text-sm p-3 rounded-lg ${
                          comment.type === 'positive' 
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
                            : 'bg-red-50 border border-red-200 text-red-700'
                        }`}
                      >
                        "{comment.text}"
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6 space-y-6">
          {/* Stats essais */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-500">Plats testés</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-xs text-gray-500 mt-1">Ce trimestre</p>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-gray-500">Ajoutés à la carte</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-xs text-emerald-600 mt-1">Taux succès: 42%</p>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <span className="text-sm text-gray-500">Abandonnés</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">7</p>
              <p className="text-xs text-gray-500 mt-1">Performances faibles</p>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span className="text-sm text-gray-500">En test actuellement</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">4</p>
              <p className="text-xs text-gray-500 mt-1">Résultats en cours</p>
            </div>
          </div>

          {/* Essais de plats du jour */}
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Essais de plats du jour en cours</h3>
            <div className="space-y-4">
              {[
                {
                  name: 'Risotto safran & Saint-Jacques',
                  testDays: 8,
                  orders: 47,
                  rating: 4.7,
                  revenue: 1645,
                  cost: 14.20,
                  price: 35,
                  margin: 59.4,
                  feedback: { positive: 42, negative: 5 },
                  status: 'success',
                  recommendation: 'Excellent retour clients - À ajouter à la carte permanente',
                  insights: ['Demande forte le week-end', 'Meilleure vente des plats testés', 'Marge très bonne']
                },
                {
                  name: 'Pavé de saumon teriyaki',
                  testDays: 6,
                  orders: 34,
                  rating: 4.2,
                  revenue: 1020,
                  cost: 11.50,
                  price: 30,
                  margin: 61.7,
                  feedback: { positive: 28, negative: 6 },
                  status: 'promising',
                  recommendation: 'Bon potentiel - Continuer les tests 2 semaines',
                  insights: ['Sauce appréciée', 'Cuisson à améliorer', 'Prix compétitif']
                },
                {
                  name: 'Tajine d\'agneau aux pruneaux',
                  testDays: 10,
                  orders: 18,
                  rating: 3.8,
                  revenue: 540,
                  cost: 16.80,
                  price: 32,
                  margin: 47.5,
                  feedback: { positive: 11, negative: 7 },
                  status: 'warning',
                  recommendation: 'Performances moyennes - Revoir recette ou abandonner',
                  insights: ['Demande faible', 'Retours mitigés sur épices', 'Coût élevé vs ventes']
                },
                {
                  name: 'Tartare de thon avocat',
                  testDays: 4,
                  orders: 29,
                  rating: 4.8,
                  revenue: 754,
                  cost: 9.40,
                  price: 26,
                  margin: 63.8,
                  feedback: { positive: 27, negative: 2 },
                  status: 'success',
                  recommendation: 'Excellent démarrage - Fort potentiel pour carte d\'été',
                  insights: ['Très bien reçu', 'Présentation appréciée', 'Excellente marge']
                }
              ].map((dish, i) => (
                <div 
                  key={i} 
                  className={`rounded-xl border p-5 ${
                    dish.status === 'success' 
                      ? 'bg-emerald-500/10 border-emerald-500/30' 
                      : dish.status === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-cyan-500/10 border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-1">{dish.name}</h4>
                      <div className="flex items-center gap-3">
                        <Badge className={`${
                          dish.status === 'success' 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                            : dish.status === 'warning'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                        } border`}>
                          {dish.testDays} jours de test
                        </Badge>
                        <span className="text-sm text-zinc-400">{dish.orders} commandes</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-400 mb-1">
                        <Star className="w-5 h-5 fill-amber-400" />
                        <span className="text-lg font-bold text-white">{dish.rating}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-emerald-400">{dish.feedback.positive} 👍</span>
                        <span className="text-red-400">{dish.feedback.negative} 👎</span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">CA généré</p>
                      <p className="text-lg font-bold text-gray-900">€{dish.revenue}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Prix vente</p>
                      <p className="text-lg font-bold text-gray-900">€{dish.price}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Coût revient</p>
                      <p className="text-lg font-bold text-gray-900">€{dish.cost}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Marge</p>
                      <p className="text-lg font-bold text-emerald-600">{dish.margin}%</p>
                    </div>
                  </div>

                  {/* Insights */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-500 mb-2">Points clés:</p>
                    <ul className="space-y-1">
                      {dish.insights.map((insight, idx) => (
                        <li key={idx} className="text-sm text-gray-700">• {insight}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendation */}
                  <div className={`rounded-lg p-3 ${
                    dish.status === 'success' 
                      ? 'bg-emerald-50 border border-emerald-200' 
                      : dish.status === 'warning'
                      ? 'bg-amber-50 border border-amber-200'
                      : 'bg-cyan-50 border border-cyan-200'
                  }`}>
                    <p className="text-xs text-gray-500 mb-1">
                      <strong className={
                        dish.status === 'success' 
                          ? 'text-emerald-600' 
                          : dish.status === 'warning'
                          ? 'text-amber-600'
                          : 'text-cyan-600'
                      }>Recommandation:</strong>
                    </p>
                    <p className="text-sm text-gray-900">{dish.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plats abandonnés */}
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Plats retirés après tests</h3>
            <div className="space-y-4">
              {[
                {
                  name: 'Carpaccio de bœuf wasabi',
                  testDays: 15,
                  orders: 23,
                  rating: 3.2,
                  revenue: 644,
                  cost: 15.60,
                  price: 28,
                  margin: 44.3,
                  feedback: { positive: 8, negative: 15 },
                  reason: 'Rejeté par les clients',
                  issues: ['Wasabi trop fort selon 65% des retours', 'Présentation peu appétissante', 'Coût élevé pour les ventes réalisées']
                },
                {
                  name: 'Ravioles épinards-ricotta',
                  testDays: 12,
                  orders: 31,
                  rating: 3.5,
                  revenue: 558,
                  cost: 8.90,
                  price: 18,
                  margin: 50.6,
                  feedback: { positive: 14, negative: 17 },
                  reason: 'Cannibalise plat existant',
                  issues: ['Trop similaire aux pâtes maison', 'Clients préfèrent les autres options', 'Pas de différenciation claire']
                },
                {
                  name: 'Steak tartare épicé',
                  testDays: 9,
                  orders: 19,
                  rating: 3.0,
                  revenue: 513,
                  cost: 12.40,
                  price: 27,
                  margin: 54.1,
                  feedback: { positive: 6, negative: 13 },
                  reason: 'Performance insuffisante',
                  issues: ['Ventes trop faibles', 'Épices mal dosées selon retours', 'Concurrence forte sur ce segment']
                },
                {
                  name: 'Curry de légumes maison',
                  testDays: 18,
                  orders: 27,
                  rating: 3.6,
                  revenue: 486,
                  cost: 7.20,
                  price: 18,
                  margin: 60.0,
                  feedback: { positive: 12, negative: 15 },
                  reason: 'Positionnement flou',
                  issues: ['Ni assez gastronomique ni assez casual', 'Clients végétariens préfèrent autres options', 'Marque mal avec image restaurant']
                },
                {
                  name: 'Tarte fine champignons truffe',
                  testDays: 14,
                  orders: 34,
                  rating: 3.8,
                  revenue: 782,
                  cost: 11.80,
                  price: 23,
                  margin: 48.7,
                  feedback: { positive: 16, negative: 18 },
                  reason: 'Coûts trop élevés',
                  issues: ['Prix truffe volatile - marge instable', 'Clients trouvent le prix élevé', 'Difficile à sourcer en continu']
                }
              ].map((dish, i) => (
                <div 
                  key={i} 
                  className="rounded-xl bg-red-50 border border-red-200 p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-gray-900 font-semibold text-lg mb-1">{dish.name}</h4>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-red-100 text-red-600 border-red-200 border">
                          ❌ Retiré après {dish.testDays} jours
                        </Badge>
                        <span className="text-sm text-gray-500">{dish.orders} commandes seulement</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-500 mb-1">
                        <Star className="w-5 h-5 fill-amber-500" />
                        <span className="text-lg font-bold text-gray-900">{dish.rating}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-emerald-600">{dish.feedback.positive} 👍</span>
                        <span className="text-red-600">{dish.feedback.negative} 👎</span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">CA total</p>
                      <p className="text-lg font-bold text-gray-900">€{dish.revenue}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Prix</p>
                      <p className="text-lg font-bold text-gray-900">€{dish.price}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Coût</p>
                      <p className="text-lg font-bold text-gray-900">€{dish.cost}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Marge</p>
                      <p className="text-lg font-bold text-red-600">{dish.margin}%</p>
                    </div>
                  </div>

                  {/* Raison du retrait */}
                  <div className="bg-red-100 border border-red-200 rounded-lg p-3 mb-3">
                    <p className="text-xs text-red-600 font-semibold mb-2">❌ {dish.reason}</p>
                    <ul className="space-y-1">
                      {dish.issues.map((issue, idx) => (
                        <li key={idx} className="text-sm text-gray-700">• {issue}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Leçons apprises */}
                  <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
                    <p className="text-xs text-cyan-600 mb-1">💡 Leçon retenue:</p>
                    <p className="text-sm text-gray-700">
                      {i === 0 && 'Tester les épices progressivement - Les clients français préfèrent saveurs subtiles'}
                      {i === 1 && 'Analyser positionnement vs carte existante avant lancement'}
                      {i === 2 && 'Minimum 40-50 commandes sur 15j requis pour valider un plat'}
                      {i === 3 && 'Aligner nouveaux plats avec identité restaurant établie'}
                      {i === 4 && 'Éviter ingrédients premium volatils sauf si prix permet marge sécurisée'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {subPages.slice(2, 3).map(page => (
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