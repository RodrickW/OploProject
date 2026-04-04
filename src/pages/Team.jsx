import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/LanguageContext';
import { 
  UsersRound, 
  Award, 
  GraduationCap, 
  BarChart3,
  MessagesSquare,
  TrendingUp,
  Star,
  Clock,
  UserPlus
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const roleColors = {
  manager: 'bg-violet-500/20 text-violet-400',
  chef: 'bg-amber-500/20 text-amber-400',
  sous_chef: 'bg-amber-500/20 text-amber-400',
  server: 'bg-cyan-500/20 text-cyan-400',
  bartender: 'bg-pink-500/20 text-pink-400',
  host: 'bg-emerald-500/20 text-emerald-400',
  kitchen_staff: 'bg-orange-500/20 text-orange-400',
};

export default function Team() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [activeTab, setActiveTab] = useState('overview');

  const subPages = [
    { id: 'overview', label: isEn ? 'Overview' : 'Vue d\'ensemble', icon: UsersRound },
    { id: 'performance', label: 'Performance', icon: Award },
    { id: 'skills', label: isEn ? 'Skills' : 'Compétences', icon: GraduationCap },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'collaboration', label: 'Collaboration', icon: MessagesSquare },
  ];

  const roleLabels = {
    manager: 'Manager',
    chef: 'Chef',
    sous_chef: isEn ? 'Sous chef' : 'Sous-chef',
    server: isEn ? 'Server' : 'Serveur',
    bartender: isEn ? 'Bartender' : 'Barman',
    host: isEn ? 'Host' : 'Hôte',
    kitchen_staff: isEn ? 'Kitchen' : 'Cuisine',
  };

  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ['team', currentUser?.email],
    queryFn: () => base44.entities.TeamMember.filter({ created_by: currentUser.email }, '-created_date'),
    enabled: !!currentUser?.email
  });

  const displayTeam = teamMembers.length > 0 ? teamMembers : [
    { id: '1', name: 'Marie Dupont', role: 'manager', performance_score: 4.8, status: 'active' },
    { id: '2', name: 'Jean-Pierre Martin', role: 'chef', performance_score: 4.9, status: 'active' },
    { id: '3', name: 'Sophie Bernard', role: 'sous_chef', performance_score: 4.5, status: 'active' },
    { id: '4', name: 'Lucas Petit', role: 'server', performance_score: 4.3, status: 'active' },
    { id: '5', name: 'Emma Moreau', role: 'server', performance_score: 4.6, status: 'active' },
    { id: '6', name: 'Thomas Laurent', role: 'bartender', performance_score: 4.7, status: 'active' },
  ];

  const stats = {
    total: displayTeam.length || 45,
    active: displayTeam.filter(m => m.status === 'active').length || 42,
    avgPerformance: 4.5,
    turnoverRate: 12,
    avgTenure: 2.3
  };

  const roleDistribution = [
    { role: 'manager', count: 6, percent: 13 },
    { role: 'chef', count: 8, percent: 18 },
    { role: 'server', count: 18, percent: 40 },
    { role: 'bartender', count: 6, percent: 13 },
    { role: 'kitchen_staff', count: 7, percent: 16 },
  ];

  const improvements = [
    {
      priority: isEn ? 'Critical' : 'Critique',
      priorityColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      title: isEn ? 'Urgent service training needed' : 'Formation urgente nécessaire en service',
      description: isEn
        ? 'Analysis: 35% of servers score <4/5. Direct impact on customer satisfaction (-12% last quarter).'
        : 'Analyse: 35% des serveurs ont un score <4/5. Impact direct sur satisfaction client (-12% sur le dernier trimestre).',
      metrics: isEn
        ? ['Service time: +25% vs target', 'Order errors: 8.5%', 'Customer satisfaction: 3.8/5']
        : ['Temps de service: +25% vs objectif', 'Erreurs commandes: 8.5%', 'Satisfaction client: 3.8/5'],
      action: isEn
        ? 'Set up an intensive 2-week training on service standards and order management'
        : 'Mettre en place une formation intensive de 2 semaines sur les standards de service et gestion des commandes',
      impact: isEn ? 'Estimated 15% increase in customer satisfaction' : 'Hausse estimée de 15% de la satisfaction client'
    },
    {
      priority: isEn ? 'High' : 'Haute',
      priorityColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      title: isEn ? 'Improve kitchen-service coordination' : 'Améliorer coordination cuisine-service',
      description: isEn
        ? 'Analysis: Average dish exit time +18% during rush. 45% of complaints about wait times.'
        : 'Analyse: Délai moyen de sortie de plats +18% en rush. 45% des plaintes concernent les temps d\'attente.',
      metrics: isEn
        ? ['Dish exit time: 22min (target: 15min)', 'Communication: 6.2/10', 'Team stress: High']
        : ['Temps sortie plats: 22min (objectif: 15min)', 'Communication: 6.2/10', 'Stress équipe: Élevé'],
      action: isEn
        ? 'Implement digital ticketing and daily kitchen-service brief before each service'
        : 'Implémenter système de tickets digitaux et brief quotidien cuisine-service avant chaque service',
      impact: isEn ? 'Estimated 30% reduction in wait times' : 'Réduction estimée de 30% des délais d\'attente'
    },
    {
      priority: isEn ? 'Medium' : 'Moyenne',
      priorityColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      title: isEn ? 'Develop upselling skills' : 'Développer compétences en upselling',
      description: isEn
        ? 'Analysis: Average ticket stagnating at €35 when potential is €45. Only 12% wine/dessert suggestions.'
        : 'Analyse: Ticket moyen stagne à 35€ alors que potentiel à 45€. Seulement 12% de suggestions de vins/desserts.',
      metrics: isEn
        ? ['Upselling rate: 12%', 'Avg ticket: €35', 'Lost potential: €2,400/week']
        : ['Taux upselling: 12%', 'Ticket moyen: 35€', 'Potentiel perdu: 2400€/semaine'],
      action: isEn
        ? 'Sales training and incentives on suggestions (5% bonus on upsells)'
        : 'Formation commerciale et mise en place d\'incentives sur suggestions (bonus 5% sur upsells)',
      impact: isEn ? 'Estimated 8-10% revenue increase' : 'Augmentation estimée du CA de 8-10%'
    },
  ];

  const depts = [
    { dept: isEn ? 'Service' : 'Service', score: 4.3, trend: -0.2 },
    { dept: isEn ? 'Kitchen' : 'Cuisine', score: 4.8, trend: +0.1 },
    { dept: 'Bar', score: 4.7, trend: +0.3 },
    { dept: 'Management', score: 4.9, trend: +0.1 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-blue-100 border border-blue-300">
          <span className="text-xl font-bold text-blue-600">T</span>
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{isEn ? 'Team' : 'Équipe'}</h1>
          <p className="text-gray-500">{isEn ? 'Manage and develop your team' : 'Gérez et développez votre équipe'}</p>
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
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <UsersRound className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-500">{isEn ? 'Total employees' : 'Total employés'}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-gray-500">{isEn ? 'Active' : 'Actifs'}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-amber-600" />
                <span className="text-sm text-gray-500">{isEn ? 'Avg. performance' : 'Performance moy.'}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.avgPerformance}/5</p>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-red-600 rotate-180" />
                <span className="text-sm text-gray-500">Turnover</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.turnoverRate}%</p>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-cyan-600" />
                <span className="text-sm text-gray-500">{isEn ? 'Avg. tenure' : 'Ancienneté moy.'}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.avgTenure} {isEn ? 'yrs' : 'ans'}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <h3 className="text-sm font-medium text-gray-600 mb-4">{isEn ? 'Distribution by role' : 'Répartition par rôle'}</h3>
              <div className="space-y-4">
                {roleDistribution.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={roleColors[item.role]}>{roleLabels[item.role]}</Badge>
                      <span className="text-sm text-gray-500">{item.count} {isEn ? 'people' : 'personnes'}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <h3 className="text-sm font-medium text-gray-600 mb-4">{isEn ? 'Top performers' : 'Top performers'}</h3>
              <div className="space-y-3">
                {displayTeam.sort((a, b) => (b.performance_score || 0) - (a.performance_score || 0)).slice(0, 5).map((member, i) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">{i + 1}</div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar_url} />
                      <AvatarFallback className="bg-gray-200 text-gray-700">{member.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{member.name}</p>
                      <Badge className={cn("text-xs", roleColors[member.role])}>{roleLabels[member.role] || member.role}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="font-semibold text-gray-900">{member.performance_score || '—'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6 space-y-6">
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-amber-600" />
                <span className="text-sm text-gray-500">{isEn ? 'Overall score' : 'Score Global'}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">4.5/5</p>
              <div className="mt-2 flex items-center gap-1 text-emerald-600 text-sm">
                <TrendingUp className="w-4 h-4" /> +0.3 {isEn ? 'vs last month' : 'vs mois dernier'}
              </div>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <UsersRound className="w-5 h-5 text-violet-600" />
                <span className="text-sm text-gray-500">{isEn ? 'To develop' : 'À développer'}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">8</p>
              <p className="mt-2 text-xs text-gray-500">{isEn ? 'Members below 4/5' : 'Membres sous 4/5'}</p>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-cyan-600" />
                <span className="text-sm text-gray-500">{isEn ? 'Excellence' : 'Excellence'}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">12</p>
              <p className="mt-2 text-xs text-gray-500">{isEn ? 'Members above 4.5/5' : 'Membres au-dessus de 4.5/5'}</p>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-600" />
              {isEn ? 'Identified improvement areas' : 'Axes d\'amélioration identifiés'}
            </h3>
            <div className="space-y-4">
              {improvements.map((item, i) => (
                <div key={i} className="rounded-xl bg-gray-50 border border-gray-200 p-5 hover:border-violet-300 transition">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={cn("text-xs border", item.priorityColor)}>{item.priority}</Badge>
                    <h4 className="text-gray-900 font-semibold">{item.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                    {item.metrics.map((metric, idx) => (
                      <div key={idx} className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-2">
                        <span className="text-gray-600">• {metric}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                    <p className="text-xs text-gray-500 mb-1">
                      <strong className="text-blue-600">{isEn ? 'Recommended action:' : 'Action recommandée:'}</strong>
                    </p>
                    <p className="text-sm text-gray-900">{item.action}</p>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">{item.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{isEn ? 'Performance by department' : 'Performance par département'}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {depts.map((dept, i) => (
                <div key={i} className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                  <h4 className="text-sm text-gray-500 mb-2">{dept.dept}</h4>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{dept.score}/5</p>
                  <div className={cn("flex items-center gap-1 text-sm", dept.trend >= 0 ? "text-emerald-600" : "text-red-600")}>
                    <TrendingUp className={cn("w-4 h-4", dept.trend < 0 && "rotate-180")} />
                    {dept.trend > 0 ? '+' : ''}{dept.trend}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {subPages.slice(2).map(page => (
          <TabsContent key={page.id} value={page.id} className="mt-6">
            <div className="rounded-xl bg-white border border-gray-200 p-12 text-center">
              <page.icon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{page.label}</h3>
              <p className="text-gray-500">{isEn ? 'This section is coming soon' : 'Cette section sera bientôt disponible'}</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
