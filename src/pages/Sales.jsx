import React, { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Megaphone,
  Euro,
  Users,
  ShoppingCart,
  ArrowUpRight
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const subPages = [
  { id: 'overview', label: 'Overview', icon: TrendingUp },
  { id: 'leads', label: 'Lead Scoring', icon: Target },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'campaigns', label: 'Campagnes', icon: Megaphone },
];

const salesData = [
  { month: 'Jan', ventes: 185000, reservations: 2400, takeaway: 45000 },
  { month: 'Fév', ventes: 195000, reservations: 2600, takeaway: 48000 },
  { month: 'Mar', ventes: 210000, reservations: 2850, takeaway: 52000 },
  { month: 'Avr', ventes: 225000, reservations: 3100, takeaway: 55000 },
  { month: 'Mai', ventes: 240000, reservations: 3300, takeaway: 58000 },
  { month: 'Juin', ventes: 265000, reservations: 3600, takeaway: 62000 },
];

const campaigns = [
  { name: 'Menu Saint-Valentin', status: 'active', roi: 340, revenue: 45000 },
  { name: 'Brunch du dimanche', status: 'active', roi: 280, revenue: 32000 },
  { name: 'Happy Hour', status: 'active', roi: 220, revenue: 18000 },
  { name: 'Soirée dégustation', status: 'completed', roi: 180, revenue: 25000 },
];

export default function Sales() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalSales: 3150000,
    salesGrowth: 12.5,
    conversionRate: 24.5,
    avgOrderValue: 68.50,
    totalOrders: 46000
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-blue-100 border border-blue-300">
          <span className="text-xl font-bold text-blue-600">S</span>
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Sales</h1>
          <p className="text-gray-500">Analysez et boostez vos ventes</p>
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
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Euro className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-500">CA Total</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">€{(stats.totalSales / 1000000).toFixed(2)}M</p>
              <div className="flex items-center gap-1 mt-2 text-emerald-600 text-sm">
                <ArrowUpRight className="w-4 h-4" /> +{stats.salesGrowth}%
              </div>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingCart className="w-5 h-5 text-cyan-600" />
                <span className="text-sm text-gray-500">Commandes</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">Cette année</p>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Euro className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-gray-500">Panier moyen</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">€{stats.avgOrderValue}</p>
              <div className="flex items-center gap-1 mt-2 text-emerald-600 text-sm">
                <ArrowUpRight className="w-4 h-4" /> +3.2%
              </div>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-amber-600" />
                <span className="text-sm text-gray-500">Conversion</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
              <p className="text-xs text-gray-500 mt-2">Visiteurs → Clients</p>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-500">Réservations</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">18.5K</p>
              <div className="flex items-center gap-1 mt-2 text-emerald-600 text-sm">
                <ArrowUpRight className="w-4 h-4" /> +15%
              </div>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="rounded-xl bg-white border border-gray-200 p-5">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Évolution des ventes</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="month" stroke="#52525b" fontSize={12} />
                  <YAxis stroke="#52525b" fontSize={12} tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                    formatter={(value) => [`€${value.toLocaleString()}`, '']}
                  />
                  <Area type="monotone" dataKey="ventes" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorVentes)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Campaigns */}
          <div className="rounded-xl bg-white border border-gray-200 p-5">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Campagnes marketing</h3>
            <div className="space-y-3">
              {campaigns.map((campaign, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{campaign.name}</p>
                    <Badge className={campaign.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'}>
                      {campaign.status === 'active' ? 'Active' : 'Terminée'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">€{campaign.revenue.toLocaleString()}</p>
                    <p className="text-sm text-emerald-600">ROI: {campaign.roi}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {subPages.slice(1).map(page => (
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