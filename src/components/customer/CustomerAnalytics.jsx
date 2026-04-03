import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Heart,
  ShoppingBag,
  Clock,
  Star,
  Euro,
  Eye,
  MessageCircle,
  BarChart3,
  Activity,
  Users
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const segmentConfig = {
  vip: { label: 'VIP', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30', icon: '👑' },
  regular: { label: 'Régulier', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30', icon: '⭐' },
  occasional: { label: 'Occasionnel', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', icon: '💫' },
  new: { label: 'Nouveau', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: '🎉' },
  at_risk: { label: 'À risque', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: '⚠️' }
};

// Demo visit history data
const generateVisitHistory = (total) => {
  return Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'][i],
    visits: Math.floor(Math.random() * (total / 6)) + 1,
    spending: Math.floor(Math.random() * 500) + 100
  }));
};

const generateRecentOrders = () => {
  const items = ['Côte de bœuf', 'Plateau fruits de mer', 'Magret de canard', 'Tarte Tatin', 'Burger gourmet', 'Risotto'];
  return Array.from({ length: 8 }, (_, i) => ({
    date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
    items: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => items[Math.floor(Math.random() * items.length)]),
    amount: Math.floor(Math.random() * 100) + 30,
    rating: Math.floor(Math.random() * 2) + 4
  }));
};

export default function CustomerAnalytics() {
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers', currentUser?.email],
    queryFn: () => base44.entities.Customer.filter({ created_by: currentUser.email }, '-total_spent'),
    enabled: !!currentUser?.email
  });

  const { data: restaurants = [] } = useQuery({
    queryKey: ['restaurants', currentUser?.email],
    queryFn: () => base44.entities.Restaurant.filter({ created_by: currentUser.email }),
    enabled: !!currentUser?.email
  });

  const hasCustomerData = customers.length > 0;

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = !searchQuery || 
      customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSegment = segmentFilter === 'all' || customer.segment === segmentFilter;
    
    return matchesSearch && matchesSegment;
  });

  // Segment distribution
  const segmentStats = {
    vip: customers.filter(c => c.segment === 'vip').length,
    regular: customers.filter(c => c.segment === 'regular').length,
    occasional: customers.filter(c => c.segment === 'occasional').length,
    new: customers.filter(c => c.segment === 'new').length,
    at_risk: customers.filter(c => c.segment === 'at_risk').length
  };

  const CustomerCard = ({ customer }) => {
    const segment = segmentConfig[customer.segment] || segmentConfig.new;
    const avgTicket = customer.total_visits > 0 ? (customer.total_spent / customer.total_visits) : 0;
    const daysSinceLastVisit = customer.last_visit 
      ? Math.floor((Date.now() - new Date(customer.last_visit).getTime()) / (1000 * 60 * 60 * 24))
      : null;

    return (
      <div 
        onClick={() => setSelectedCustomer(customer)}
        className="rounded-xl bg-white border border-gray-200 p-4 hover:border-blue-500 transition-all cursor-pointer group"
      >
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 border-2 border-gray-200 group-hover:border-blue-500 transition-colors">
            <AvatarImage src={customer.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold text-lg">
              {customer.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {customer.name}
              </h4>
              <Badge className={cn("text-xs border", segment.color)}>
                {segment.icon} {segment.label}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {customer.email && (
                <span className="flex items-center gap-1 truncate">
                  <Mail className="w-3 h-3" /> {customer.email}
                </span>
              )}
              {customer.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {customer.phone}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2 mt-3">
              <div className="text-center p-2 rounded-lg bg-gray-50">
                <p className="text-lg font-bold text-gray-900">{customer.total_visits || 0}</p>
                <p className="text-[10px] text-gray-500">Visites</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-gray-50">
                <p className="text-lg font-bold text-emerald-600">€{(customer.total_spent || 0).toLocaleString()}</p>
                <p className="text-[10px] text-gray-500">Total</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-gray-50">
                <p className="text-lg font-bold text-cyan-600">€{avgTicket.toFixed(0)}</p>
                <p className="text-[10px] text-gray-500">Ticket moy.</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-gray-50">
                <p className="text-lg font-bold text-amber-600">{customer.satisfaction_score || '-'}</p>
                <p className="text-[10px] text-gray-500">Note</p>
              </div>
            </div>

            {daysSinceLastVisit !== null && (
              <div className="mt-2 flex items-center gap-2 text-xs">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className={cn(
                  daysSinceLastVisit > 60 ? 'text-red-500' :
                  daysSinceLastVisit > 30 ? 'text-amber-500' :
                  'text-gray-500'
                )}>
                  Dernière visite il y a {daysSinceLastVisit}j
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const CustomerDetailModal = ({ customer }) => {
    if (!customer) return null;

    const segment = segmentConfig[customer.segment] || segmentConfig.new;
    const visitHistory = generateVisitHistory(customer.total_visits || 5);
    const recentOrders = generateRecentOrders();
    const favoriteRestaurant = restaurants.find(r => r.id === customer.favorite_restaurant_id);

    return (
      <Dialog open={!!customer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-violet-500/50">
                <AvatarImage src={customer.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-violet-600 to-cyan-500 text-white font-bold text-xl">
                  {customer.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white">{customer.name}</span>
                  <Badge className={cn("border", segment.color)}>
                    {segment.icon} {segment.label}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-500 font-normal">{customer.email}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="overview" className="mt-4">
            <TabsList className="bg-zinc-800/50 border border-zinc-700/50">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
              <TabsTrigger value="preferences">Préférences</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="space-y-4 mt-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-5 gap-3">
                <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="w-4 h-4 text-violet-400" />
                    <span className="text-xs text-zinc-500">Total visites</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{customer.total_visits || 0}</p>
                </div>

                <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Euro className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-zinc-500">Total dépensé</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-400">€{(customer.total_spent || 0).toLocaleString()}</p>
                </div>

                <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-zinc-500">Ticket moyen</span>
                  </div>
                  <p className="text-2xl font-bold text-cyan-400">
                    €{((customer.total_spent || 0) / (customer.total_visits || 1)).toFixed(0)}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-zinc-500">Satisfaction</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-400">{customer.satisfaction_score || 'N/A'}</p>
                </div>

                <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs text-zinc-500">Dernière visite</span>
                  </div>
                  <p className="text-sm font-bold text-white">
                    {customer.last_visit 
                      ? new Date(customer.last_visit).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                      : 'Jamais'}
                  </p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                  <h4 className="text-sm font-semibold text-white mb-4">Fréquence de visite</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={visitHistory}>
                        <defs>
                          <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="month" stroke="#52525b" fontSize={11} />
                        <YAxis stroke="#52525b" fontSize={11} />
                        <Tooltip 
                          contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                        />
                        <Area type="monotone" dataKey="visits" stroke="#8b5cf6" fill="url(#visitGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                  <h4 className="text-sm font-semibold text-white mb-4">Dépenses mensuelles</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={visitHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="month" stroke="#52525b" fontSize={11} />
                        <YAxis stroke="#52525b" fontSize={11} />
                        <Tooltip 
                          contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                          formatter={(value) => [`€${value}`, 'Dépenses']}
                        />
                        <Bar dataKey="spending" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                  <h4 className="text-sm font-semibold text-white mb-3">Informations</h4>
                  <div className="space-y-3">
                    {customer.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-zinc-500" />
                        <span className="text-zinc-300">{customer.phone}</span>
                      </div>
                    )}
                    {customer.email && (
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-zinc-500" />
                        <span className="text-zinc-300">{customer.email}</span>
                      </div>
                    )}
                    {customer.source && (
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-zinc-500" />
                        <span className="text-zinc-300">Source: {customer.source}</span>
                      </div>
                    )}
                    {favoriteRestaurant && (
                      <div className="flex items-center gap-3 text-sm">
                        <Heart className="w-4 h-4 text-pink-400" />
                        <span className="text-zinc-300">Restaurant préféré: {favoriteRestaurant.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                  <h4 className="text-sm font-semibold text-white mb-3">Plats favoris</h4>
                  <div className="space-y-2">
                    {(customer.favorite_items || ['Côte de bœuf', 'Tarte Tatin', 'Plateau fruits de mer']).map((item, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded bg-zinc-700/30">
                        <Star className="w-3 h-3 text-amber-400" />
                        <span className="text-sm text-zinc-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* History */}
            <TabsContent value="history" className="mt-4">
              <div className="space-y-3">
                {recentOrders.map((order, i) => (
                  <div key={i} className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-zinc-400">{order.date}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">€{order.amount}</span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: order.rating }).map((_, j) => (
                            <Star key={j} className="w-3 h-3 text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {order.items.map((item, j) => (
                        <Badge key={j} variant="outline" className="border-zinc-700 text-zinc-400">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Preferences */}
            <TabsContent value="preferences" className="mt-4">
              <div className="p-8 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-center">
                <MessageCircle className="w-12 h-12 mx-auto text-zinc-600 mb-3" />
                <p className="text-zinc-500">Données de préférences détaillées</p>
              </div>
            </TabsContent>

            {/* Insights */}
            <TabsContent value="insights" className="mt-4">
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
                  <p className="text-sm text-violet-400 font-medium mb-1">💡 Opportunité cross-sell</p>
                  <p className="text-sm text-zinc-300">
                    Client fidèle au Bistrot Parisien. Proposer découverte de La Belle Assiette avec -20%
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <p className="text-sm text-emerald-400 font-medium mb-1">📈 Tendance positive</p>
                  <p className="text-sm text-zinc-300">
                    Fréquence de visite en hausse de 35% sur les 3 derniers mois
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {!hasCustomerData ? (
        <div className="rounded-xl bg-white border border-gray-200 p-12 text-center">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune donnée client disponible</h3>
          <p className="text-gray-500 mb-6">
            Les analytics clients nécessitent l'intégration de votre POS/CRM.<br/>
            Rendez-vous dans <strong>Intégrations Oplo</strong> pour synchroniser vos données.
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
      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            placeholder="Rechercher par nom, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
        </div>
        <Select value={segmentFilter} onValueChange={setSegmentFilter}>
          <SelectTrigger className="lg:w-48 bg-white border-gray-200">
            <SelectValue placeholder="Tous les segments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les segments</SelectItem>
            {Object.entries(segmentConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.icon} {config.label} ({segmentStats[key]})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Segment Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {Object.entries(segmentConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setSegmentFilter(segmentFilter === key ? 'all' : key)}
            className={cn(
              "p-4 rounded-xl border transition-all text-left",
              segmentFilter === key ? config.color : "bg-white border-gray-200 hover:border-gray-300"
            )}
          >
            <div className="text-2xl mb-2">{config.icon}</div>
            <p className="text-2xl font-bold text-gray-900">{segmentStats[key]}</p>
            <p className="text-xs text-gray-500">{config.label}</p>
          </button>
        ))}
      </div>

      {/* Customer List */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 rounded-xl bg-white border border-gray-200 animate-pulse" />
          ))}
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Aucun client trouvé</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map(customer => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedCustomer && <CustomerDetailModal customer={selectedCustomer} />}
      </>
      )}
    </div>
  );
}