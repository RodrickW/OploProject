import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail,
  Users,
  Euro,
  Star,
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar,
  Settings,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const revenueData = [
  { day: 'Lun', revenue: 8500 },
  { day: 'Mar', revenue: 7200 },
  { day: 'Mer', revenue: 9100 },
  { day: 'Jeu', revenue: 8800 },
  { day: 'Ven', revenue: 12500 },
  { day: 'Sam', revenue: 15200 },
  { day: 'Dim', revenue: 11800 },
];

export default function RestaurantDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const restaurantId = urlParams.get('id');

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: async () => {
      const restaurants = await base44.entities.Restaurant.filter({ id: restaurantId });
      return restaurants[0];
    },
    enabled: !!restaurantId
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse" />
        <div className="h-64 bg-zinc-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-500">Restaurant non trouvé</p>
        <Link to={createPageUrl('Restaurants')}>
          <Button className="mt-4">Retour aux restaurants</Button>
        </Link>
      </div>
    );
  }

  const typeLabels = {
    casual: 'Casual',
    fine_dining: 'Gastronomique',
    fast_casual: 'Fast Casual',
    bistro: 'Bistro',
    brasserie: 'Brasserie'
  };

  // Demo data
  const stats = {
    monthlyRevenue: restaurant.monthly_revenue || 85000,
    monthlyCustomers: restaurant.monthly_customers || 2400,
    averageTicket: restaurant.average_ticket || 35.50,
    conversionRate: restaurant.conversion_rate || 28.5,
    satisfaction: restaurant.satisfaction_score || 4.6,
    revenueGrowth: 8.5,
    customerGrowth: 12.3
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={createPageUrl('Restaurants')}>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{restaurant.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            {restaurant.city && (
              <span className="text-gray-500 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {restaurant.city}
              </span>
            )}
            <Badge className="bg-blue-100 text-blue-700 border-blue-300">
              {typeLabels[restaurant.type] || 'Restaurant'}
            </Badge>
          </div>
        </div>
        <Button variant="outline" className="border-gray-200">
          <Settings className="w-4 h-4 mr-2" /> Paramètres
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-xl bg-white border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Euro className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-500">Revenu mensuel</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">€{stats.monthlyRevenue.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2 text-emerald-600 text-sm">
            <TrendingUp className="w-4 h-4" /> +{stats.revenueGrowth}%
          </div>
        </div>

        <div className="rounded-xl bg-white border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-cyan-600" />
            <span className="text-sm text-gray-500">Clients/mois</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.monthlyCustomers.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2 text-emerald-600 text-sm">
            <TrendingUp className="w-4 h-4" /> +{stats.customerGrowth}%
          </div>
        </div>

        <div className="rounded-xl bg-white border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Euro className="w-5 h-5 text-emerald-600" />
            <span className="text-sm text-gray-500">Ticket moyen</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">€{stats.averageTicket.toFixed(2)}</p>
        </div>

        <div className="rounded-xl bg-white border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-gray-500">Conversion</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
        </div>

        <div className="rounded-xl bg-white border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-gray-500">Satisfaction</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.satisfaction}/5</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="bg-gray-100 border border-gray-200">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="customer">Customer Success</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="queue">Market</TabsTrigger>
          <TabsTrigger value="alignment">Sales</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="service">Service</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="team">Équipe</TabsTrigger>
          <TabsTrigger value="feedback">Avis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Revenue Chart */}
          <div className="rounded-xl bg-white border border-gray-200 p-5">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Revenu cette semaine</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="day" stroke="#52525b" fontSize={12} />
                  <YAxis stroke="#52525b" fontSize={12} tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                    formatter={(value) => [`€${value.toLocaleString()}`, 'Revenu']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <h3 className="text-sm font-medium text-gray-600 mb-4">Informations</h3>
              <div className="space-y-4">
                {restaurant.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900">{restaurant.address}</span>
                  </div>
                )}
                {restaurant.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900">{restaurant.phone}</span>
                  </div>
                )}
                {restaurant.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900">{restaurant.email}</span>
                  </div>
                )}
                {restaurant.capacity && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900">{restaurant.capacity} couverts</span>
                  </div>
                )}
                {restaurant.opening_date && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900">
                      Ouvert depuis {new Date(restaurant.opening_date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <h3 className="text-sm font-medium text-gray-600 mb-4">Heures de pointe</h3>
              <div className="space-y-3">
                {[
                  { time: '12h-14h', percent: 85 },
                  { time: '19h-21h', percent: 95 },
                  { time: '21h-22h', percent: 70 },
                ].map((peak, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">{peak.time}</span>
                      <span className="text-gray-900">{peak.percent}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                        style={{ width: `${peak.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="customer" className="mt-6">
          <div className="rounded-xl bg-white border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Customer Success - {restaurant.name}</h3>
              <a 
                href="https://solemn-queue-flow-pro.base44.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition"
              >
                Ouvrir dans un nouvel onglet
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="w-full h-[800px] bg-zinc-950">
              <iframe 
                src="https://solemn-queue-flow-pro.base44.app"
                className="w-full h-full"
                title="Customer Success App"
                frameBorder="0"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="mt-6">
          <div className="rounded-xl bg-white border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Operations - {restaurant.name}</h3>
            <Tabs defaultValue="costing" className="w-full">
              <TabsList className="bg-gray-100 border border-gray-200">
                <TabsTrigger value="costing">Coût Plats</TabsTrigger>
                <TabsTrigger value="margins">Marges</TabsTrigger>
                <TabsTrigger value="payments">Paiements</TabsTrigger>
              </TabsList>

              <TabsContent value="costing" className="mt-4">
                <div className="rounded-xl bg-white border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700">Calcul Coût des Plats</h4>
                    <a 
                      href="https://dish-cost-calc.base44.app" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-violet-400 hover:text-violet-300 transition"
                    >
                      Ouvrir <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="w-full h-[700px] bg-zinc-950">
                    <iframe 
                      src="https://dish-cost-calc.base44.app"
                      className="w-full h-full"
                      title="Dish Cost Calculator"
                      frameBorder="0"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="margins" className="mt-4">
                <div className="rounded-xl bg-white border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700">Gestion des Marges</h4>
                    <a 
                      href="https://dish-cost-pro.base44.app" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-violet-400 hover:text-violet-300 transition"
                    >
                      Ouvrir <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="w-full h-[700px] bg-zinc-950">
                    <iframe 
                      src="https://dish-cost-pro.base44.app"
                      className="w-full h-full"
                      title="Dish Cost Pro"
                      frameBorder="0"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payments" className="mt-4">
                <div className="rounded-xl bg-white border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700">Gestion des Paiements</h4>
                    <a 
                      href="https://resto-pay-easy.base44.app" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-violet-400 hover:text-violet-300 transition"
                    >
                      Ouvrir <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="w-full h-[700px] bg-zinc-950">
                    <iframe 
                      src="https://resto-pay-easy.base44.app"
                      className="w-full h-full"
                      title="Resto Pay Easy"
                      frameBorder="0"
                    />
                  </div>
                </div>
              </TabsContent>

            </Tabs>
          </div>
        </TabsContent>

        <TabsContent value="queue" className="mt-6">
          <div className="rounded-xl bg-white border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Market - {restaurant.name}</h3>
              <a 
                href="https://solemn-queue-flow-pro.base44.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition"
              >
                Ouvrir dans un nouvel onglet
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="w-full h-[800px] bg-zinc-950">
              <iframe 
                src="https://solemn-queue-flow-pro.base44.app"
                className="w-full h-full"
                title="Queue Flow Pro App"
                frameBorder="0"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="alignment" className="mt-6">
          <div className="rounded-xl bg-white border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Sales - {restaurant.name}</h3>
              <a 
                href="https://restaurant-pay-easy.base44.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition"
              >
                Ouvrir dans un nouvel onglet
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="w-full h-[800px] bg-zinc-950">
              <iframe 
                src="https://restaurant-pay-easy.base44.app"
                className="w-full h-full"
                title="Sales App"
                frameBorder="0"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stock" className="mt-6">
          <div className="rounded-xl bg-white border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Gestion de Stock - {restaurant.name}</h3>
              <a 
                href="https://passionate-resto-stock-pro.base44.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition"
              >
                Ouvrir dans un nouvel onglet
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="w-full h-[800px] bg-zinc-950">
              <iframe 
                src="https://passionate-resto-stock-pro.base44.app"
                className="w-full h-full"
                title="Stock Management App"
                frameBorder="0"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="service" className="mt-6">
          <div className="rounded-xl bg-white border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Service - {restaurant.name}</h3>
              <a 
                href="https://live-flow-waiter.base44.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition"
              >
                Ouvrir dans un nouvel onglet
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="w-full h-[800px] bg-zinc-950">
              <iframe 
                src="https://live-flow-waiter.base44.app"
                className="w-full h-full"
                title="Service App"
                frameBorder="0"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <div className="rounded-xl bg-white border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Formation & Développement - {restaurant.name}</h3>
              <a 
                href="https://align-learn-grow.base44.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition"
              >
                Ouvrir dans un nouvel onglet
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="w-full h-[800px] bg-zinc-950">
              <iframe 
                src="https://align-learn-grow.base44.app"
                className="w-full h-full"
                title="Team Training & Development"
                frameBorder="0"
              />
            </div>
          </div>
        </TabsContent>

        {['analytics', 'feedback'].map(tab => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <div className="rounded-xl bg-white border border-gray-200 p-12 text-center">
              <p className="text-gray-500">Cette section sera bientôt disponible</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}