import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  Building2, 
  Euro, 
  TrendingUp,
  Calendar,
  Mail,
  Shield,
  ChevronRight,
  BarChart3,
  FileText,
  Eye,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewAsUser, setViewAsUser] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem('admin_users_unlocked') === 'true';
  });

  // Vérifier que l'utilisateur actuel est admin
  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  // Récupérer tous les utilisateurs
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const allUsers = await base44.entities.User.list();
      return allUsers;
    },
    enabled: currentUser?.role === 'admin'
  });

  // Récupérer les profils d'onboarding
  const { data: allProfiles = [] } = useQuery({
    queryKey: ['all-profiles'],
    queryFn: () => base44.entities.OnboardingProfile.list(),
    enabled: currentUser?.role === 'admin'
  });

  // Récupérer tous les restaurants
  const { data: allRestaurants = [] } = useQuery({
    queryKey: ['all-restaurants'],
    queryFn: () => base44.entities.Restaurant.list(),
    enabled: currentUser?.role === 'admin'
  });

  // Récupérer les insights
  const { data: allInsights = [] } = useQuery({
    queryKey: ['all-insights'],
    queryFn: () => base44.entities.Insight.list(),
    enabled: currentUser?.role === 'admin'
  });

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Accès refusé</h2>
              <p className="text-gray-600">Cette page est réservée aux administrateurs.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vérification mot de passe
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const ADMIN_PASSWORD = 'oplo2024'; // Changez ce mot de passe
    const OWNER_EMAIL = 'nicolasdls@oplo.ai'; // Owner avec accès direct
    
    // Owner a accès direct sans mot de passe
    if (currentUser?.email === OWNER_EMAIL) {
      setIsUnlocked(true);
      sessionStorage.setItem('admin_users_unlocked', 'true');
      return;
    }
    
    if (passwordInput === ADMIN_PASSWORD) {
      setIsUnlocked(true);
      sessionStorage.setItem('admin_users_unlocked', 'true');
      setPasswordInput('');
    } else {
      alert('Mot de passe incorrect');
      setPasswordInput('');
    }
  };

  if (!isUnlocked) {
    const OWNER_EMAIL = 'nicolasdls@oplo.ai';
    const isOwner = currentUser?.email === OWNER_EMAIL;
    
    // Owner accède directement
    if (isOwner) {
      setIsUnlocked(true);
      sessionStorage.setItem('admin_users_unlocked', 'true');
      return null; // Render va se réinitialiser avec isUnlocked = true
    }
    
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle>Gestion Utilisateurs - Accès sécurisé</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe admin
                </label>
                <Input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Entrez le mot de passe"
                  className="w-full"
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Déverrouiller
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Cette page contient des données sensibles de tous les utilisateurs
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  // Données de l'utilisateur sélectionné
  const userProfile = selectedUser ? allProfiles.find(p => p.created_by === selectedUser.email) : null;
  const userRestaurants = selectedUser ? allRestaurants.filter(r => r.created_by === selectedUser.email) : [];
  const userInsights = selectedUser ? allInsights.filter(i => i.created_by === selectedUser.email) : [];

  const UserDetailView = () => {
    if (!selectedUser) return null;

    const totalRevenue = userRestaurants.reduce((sum, r) => sum + (r.monthly_revenue || 0), 0);
    const totalCustomers = userRestaurants.reduce((sum, r) => sum + (r.monthly_customers || 0), 0);
    const avgTicket = totalCustomers > 0 ? totalRevenue / totalCustomers : userProfile?.avg_ticket || 0;

    return (
      <div className="space-y-6">
        {/* Header utilisateur */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {selectedUser.full_name?.[0]?.toUpperCase() || selectedUser.email[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedUser.full_name || 'Utilisateur'}</h2>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={selectedUser.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}>
                      {selectedUser.role === 'admin' ? 'Admin' : 'User'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Inscrit le {new Date(selectedUser.created_date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => {
                    localStorage.setItem('admin_view_as_user', selectedUser.email);
                    setViewAsUser(selectedUser);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir comme utilisateur
                </Button>
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  Retour à la liste
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Métriques clés */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Restaurants</p>
                  <p className="text-2xl font-bold text-gray-900">{userRestaurants.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                  <Euro className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">CA total/mois</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalRevenue.toLocaleString('fr-FR')}€
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ticket moyen</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {avgTicket.toFixed(0)}€
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Insights</p>
                  <p className="text-2xl font-bold text-gray-900">{userInsights.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets détails */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            {userProfile ? (
              <Card>
                <CardHeader>
                  <CardTitle>Profil d'onboarding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Nom du groupe</p>
                      <p className="font-medium text-gray-900">{userProfile.group_name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Concept</p>
                      <p className="font-medium text-gray-900">{userProfile.group_concept || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pays/Villes</p>
                      <p className="font-medium text-gray-900">{userProfile.countries || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nombre de restaurants</p>
                      <p className="font-medium text-gray-900">{userProfile.total_restaurants || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CA mensuel moyen</p>
                      <p className="font-medium text-gray-900">
                        {userProfile.avg_monthly_revenue ? `${userProfile.avg_monthly_revenue.toLocaleString('fr-FR')}€` : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Employés total</p>
                      <p className="font-medium text-gray-900">{userProfile.total_employees || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Système de caisse</p>
                      <p className="font-medium text-gray-900">{userProfile.pos_system || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Statut</p>
                      <Badge variant={userProfile.status === 'completed' ? 'default' : 'secondary'}>
                        {userProfile.status}
                      </Badge>
                    </div>
                  </div>
                  {userProfile.main_objectives && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Objectifs principaux</p>
                      <p className="text-gray-900">{userProfile.main_objectives}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                  Aucun profil d'onboarding complété
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="restaurants" className="space-y-4">
            {userRestaurants.length > 0 ? (
              <div className="grid gap-4">
                {userRestaurants.map(restaurant => (
                  <Card key={restaurant.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{restaurant.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{restaurant.address}, {restaurant.city}</p>
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                              <p className="text-xs text-gray-500">CA mensuel</p>
                              <p className="font-medium text-gray-900">
                                {restaurant.monthly_revenue ? `${restaurant.monthly_revenue.toLocaleString('fr-FR')}€` : '-'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Ticket moyen</p>
                              <p className="font-medium text-gray-900">
                                {restaurant.average_ticket ? `${restaurant.average_ticket}€` : '-'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Couverts</p>
                              <p className="font-medium text-gray-900">{restaurant.capacity || '-'}</p>
                            </div>
                          </div>
                        </div>
                        <Badge variant={restaurant.status === 'active' ? 'default' : 'secondary'}>
                          {restaurant.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                  Aucun restaurant créé
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            {userInsights.length > 0 ? (
              <div className="grid gap-3">
                {userInsights.map(insight => (
                  <Card key={insight.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={cn(
                              insight.priority === 'critical' ? 'bg-red-100 text-red-700' :
                              insight.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                              insight.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                            )}>
                              {insight.priority}
                            </Badge>
                            <Badge variant="outline">{insight.category}</Badge>
                          </div>
                          <h4 className="font-medium text-gray-900">{insight.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                        </div>
                        <Badge variant={
                          insight.status === 'resolved' ? 'default' :
                          insight.status === 'in_progress' ? 'secondary' :
                          'outline'
                        }>
                          {insight.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                  Aucun insight généré
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  // Mode visualisation utilisateur
  if (viewAsUser) {
    return (
      <div className="space-y-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">Mode visualisation</p>
                  <p className="text-sm text-gray-600">Vous consultez le compte de {viewAsUser.full_name || viewAsUser.email}</p>
                </div>
              </div>
              <Button 
                onClick={() => {
                  localStorage.removeItem('admin_view_as_user');
                  setViewAsUser(null);
                  setSelectedUser(null);
                }}
                variant="outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour admin
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to={createPageUrl('Dashboard')}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <p className="font-semibold text-gray-900">Dashboard</p>
                  <p className="text-xs text-gray-500 mt-1">Vue d'ensemble</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl('Insights')}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="text-center">
                  <FileText className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                  <p className="font-semibold text-gray-900">Insights</p>
                  <p className="text-xs text-gray-500 mt-1">Recommandations AI</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl('OploChat')}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Mail className="w-8 h-8 mx-auto text-green-600 mb-2" />
                  <p className="font-semibold text-gray-900">Oplo.ai</p>
                  <p className="text-xs text-gray-500 mt-1">Conversations</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl('CustomerSuccess')}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="w-8 h-8 mx-auto text-amber-600 mb-2" />
                  <p className="font-semibold text-gray-900">COMPAST</p>
                  <p className="text-xs text-gray-500 mt-1">Framework complet</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Cliquez sur une section ci-dessus pour naviguer dans l'application en tant que <strong>{viewAsUser.full_name || viewAsUser.email}</strong>.
            </p>
            <p className="text-sm text-gray-500">
              Note : Les données affichées seront filtrées pour cet utilisateur (profil, restaurants, insights, etc.).
              Le mode visualisation sera maintenu jusqu'à ce que vous cliquiez sur "Retour admin".
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
          <p className="text-gray-600 mt-1">Vue admin de tous les comptes utilisateurs</p>
          {currentUser?.email === 'nicolasdls@oplo.ai' && (
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mt-2">
              👑 Owner Access
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-600">{users.length} utilisateurs</span>
        </div>
      </div>

      {selectedUser ? (
        <UserDetailView />
      ) : (
        <>
          {/* Recherche */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par email ou nom..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Liste des utilisateurs */}
          <div className="grid gap-4">
            {isLoading ? (
              <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                  Chargement...
                </CardContent>
              </Card>
            ) : filteredUsers.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                  Aucun utilisateur trouvé
                </CardContent>
              </Card>
            ) : (
              filteredUsers.map(user => {
                const profile = allProfiles.find(p => p.created_by === user.email);
                const restaurants = allRestaurants.filter(r => r.created_by === user.email);
                const insights = allInsights.filter(i => i.created_by === user.email);

                return (
                  <Card key={user.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedUser(user)}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                            {user.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{user.full_name || 'Utilisateur'}</h3>
                              <Badge className={user.role === 'admin' ? 'bg-blue-600 text-white text-xs' : 'bg-gray-100 text-gray-700 text-xs'}>
                                {user.role === 'admin' ? 'Admin' : 'User'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {restaurants.length} restaurant{restaurants.length > 1 ? 's' : ''}
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {insights.length} insight{insights.length > 1 ? 's' : ''}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Inscrit le {new Date(user.created_date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {profile && (
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">{profile.group_name}</p>
                              <Badge variant="outline" className="text-xs mt-1">
                                {profile.status}
                              </Badge>
                            </div>
                          )}
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}