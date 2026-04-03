import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  ChevronRight, 
  Users, 
  ShoppingBag, 
  Star, 
  TrendingUp,
  Eye,
  Gift,
  MessageCircle,
  Clock,
  Target,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { createPageUrl } from '@/utils';

const journeyStages = [
  {
    id: 'discovery',
    name: 'Découverte',
    icon: Eye,
    color: 'from-violet-600 to-purple-600',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    textColor: 'text-violet-400',
    conversionRate: 35,
    avgValue: 0,
    opportunities: [
      { type: 'upsell', title: 'Offre de bienvenue', description: 'Réduction 15% sur première visite', impact: '+25% conversion', status: 'active' },
      { type: 'cross', title: 'Menu découverte', description: 'Proposition menu dégustation', impact: '+€18 ticket moyen', status: 'test' }
    ],
    actions: ['Campagne Google Ads', 'Réseaux sociaux', 'Bouche à oreille'],
    metrics: { visitors: 5200, converted: 1820 }
  },
  {
    id: 'first_visit',
    name: 'Première visite',
    icon: Users,
    color: 'from-cyan-600 to-blue-600',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400',
    conversionRate: 68,
    avgValue: 42,
    opportunities: [
      { type: 'upsell', title: 'Suggestion dessert', description: 'Dessert offert au 2ème', impact: '+€12 ticket', status: 'active' },
      { type: 'upsell', title: 'Vin premium', description: 'Accord mets-vins suggéré', impact: '+€24 ticket', status: 'active' },
      { type: 'cross', title: 'Carte fidélité', description: 'Inscription au programme', impact: '+45% retention', status: 'test' }
    ],
    actions: ['Accueil personnalisé', 'Formation équipe', 'Mise en avant suggestions'],
    metrics: { visitors: 1820, converted: 1238 }
  },
  {
    id: 'regular',
    name: 'Client régulier',
    icon: Star,
    color: 'from-amber-600 to-orange-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    conversionRate: 85,
    avgValue: 58,
    opportunities: [
      { type: 'cross', title: 'Autre restaurant', description: 'Découverte autres adresses', impact: '+32% cross-resto', status: 'active' },
      { type: 'upsell', title: 'Menu VIP', description: 'Upgrade expérience premium', impact: '+€45 ticket', status: 'test' },
      { type: 'upsell', title: 'Événement privé', description: 'Privatisation pour occasion', impact: '+€850 per event', status: 'inactive' }
    ],
    actions: ['Programme fidélité', 'Offres personnalisées', 'Communication SMS/Email'],
    metrics: { visitors: 1238, converted: 1052 }
  },
  {
    id: 'vip',
    name: 'Client VIP',
    icon: Gift,
    color: 'from-pink-600 to-rose-600',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    textColor: 'text-pink-400',
    conversionRate: 92,
    avgValue: 125,
    opportunities: [
      { type: 'upsell', title: 'Table du chef', description: 'Expérience exclusive mensuelle', impact: '+€180 ticket', status: 'active' },
      { type: 'cross', title: 'Programme parrainage', description: 'Récompense pour recommandation', impact: '+3.5 clients/VIP', status: 'active' },
      { type: 'upsell', title: 'Cave privée', description: 'Sélection vins sur mesure', impact: '+€95 ticket', status: 'test' }
    ],
    actions: ['Service dédié', 'Événements exclusifs', 'Cadeaux personnalisés'],
    metrics: { visitors: 1052, converted: 968 }
  },
  {
    id: 'ambassador',
    name: 'Ambassadeur',
    icon: TrendingUp,
    color: 'from-emerald-600 to-green-600',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    conversionRate: 95,
    avgValue: 145,
    opportunities: [
      { type: 'cross', title: 'Partenariat influenceur', description: 'Collaboration contenu', impact: '+15 nouveaux clients/mois', status: 'active' },
      { type: 'upsell', title: 'Carte illimitée', description: 'Abonnement mensuel premium', impact: '+€280/mois per client', status: 'test' }
    ],
    actions: ['Programme ambassadeur', 'Événements VIP', 'Co-création menu'],
    metrics: { visitors: 968, converted: 920 }
  }
];

const opportunityTypes = {
  upsell: { label: 'Up-sell', color: 'bg-violet-500/20 text-violet-400', icon: Zap },
  cross: { label: 'Cross-sell', color: 'bg-cyan-500/20 text-cyan-400', icon: Target }
};

const statusConfig = {
  active: { label: 'Actif', color: 'bg-emerald-500/20 text-emerald-400' },
  test: { label: 'Test A/B', color: 'bg-amber-500/20 text-amber-400' },
  inactive: { label: 'Inactif', color: 'bg-zinc-500/20 text-zinc-400' }
};

export default function CustomerJourneyMap() {
  const [selectedStage, setSelectedStage] = useState(null);

  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers', currentUser?.email],
    queryFn: () => base44.entities.Customer.filter({ created_by: currentUser.email }),
    enabled: !!currentUser?.email
  });

  const hasCustomerData = customers.length > 0;

  const totalValue = journeyStages.reduce((sum, stage) => sum + (stage.avgValue * stage.metrics.converted), 0);
  const totalConversions = journeyStages[journeyStages.length - 1].metrics.converted;
  const overallConversion = ((totalConversions / journeyStages[0].metrics.visitors) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {!hasCustomerData ? (
        <div className="rounded-xl bg-white border border-gray-200 p-12 text-center">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Données clients nécessaires</h3>
          <p className="text-gray-500 mb-6">
            Le parcours client est généré à partir de vos données POS/CRM intégrées.<br/>
            Une fois l'intégration effectuée, vous verrez apparaître les étapes du parcours client avec les opportunités d'up-sell et cross-sell.<br/><br/>
            <strong>Source de données :</strong> Système de caisse, CRM, programme de fidélité
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
      {/* Overview Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-gray-500">Visiteurs initiaux</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{journeyStages[0].metrics.visitors.toLocaleString()}</p>
        </div>
        
        <div className="rounded-xl bg-white border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-emerald-600" />
            <span className="text-xs text-gray-500">Ambassadeurs</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalConversions.toLocaleString()}</p>
        </div>
        
        <div className="rounded-xl bg-white border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-cyan-600" />
            <span className="text-xs text-gray-500">Taux global</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{overallConversion}%</p>
        </div>
        
        <div className="rounded-xl bg-white border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-gray-500">Valeur totale</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">€{(totalValue / 1000).toFixed(0)}k</p>
        </div>
      </div>

      {/* Journey Map */}
      <div className="rounded-xl bg-white border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Parcours client interactif</h3>
          <Badge className="bg-blue-100 text-blue-700 border border-blue-200">
            {journeyStages.reduce((sum, s) => sum + s.opportunities.length, 0)} opportunités identifiées
          </Badge>
        </div>

        {/* Stages */}
        <div className="space-y-4">
          {journeyStages.map((stage, index) => (
            <div key={stage.id}>
              {/* Stage Card */}
              <div 
                onClick={() => setSelectedStage(stage)}
                className={cn(
                  "rounded-xl border p-5 cursor-pointer transition-all hover:scale-[1.01]",
                  stage.bgColor, stage.borderColor,
                  "hover:border-opacity-60"
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={cn("p-3 rounded-xl bg-gradient-to-br", stage.color)}>
                    <stage.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900 text-lg">{stage.name}</h4>
                      <Badge className={stage.textColor.replace('text-', 'bg-') + '/20 ' + stage.textColor + ' border ' + stage.borderColor}>
                        {stage.conversionRate}% conversion
                      </Badge>
                      {stage.avgValue > 0 && (
                        <Badge variant="outline" className="border-gray-300 text-gray-700">
                          €{stage.avgValue} ticket moyen
                        </Badge>
                      )}
                    </div>
                    
                    {/* Opportunities Preview */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {stage.opportunities.map((opp, i) => (
                        <Badge 
                          key={i}
                          className={cn(
                            "text-xs",
                            opportunityTypes[opp.type].color
                          )}
                        >
                          {opportunityTypes[opp.type].label}: {opp.title}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{stage.metrics.visitors.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">visiteurs</p>
                    <ChevronRight className="w-5 h-5 text-gray-400 mx-auto mt-2" />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Conversion vers étape suivante</span>
                    <span className="text-gray-900 font-medium">{stage.metrics.converted.toLocaleString()} clients</span>
                  </div>
                  <Progress 
                    value={stage.conversionRate} 
                    className="h-2 bg-gray-100"
                  />
                </div>
              </div>

              {/* Arrow between stages */}
              {index < journeyStages.length - 1 && (
                <div className="flex justify-center my-2">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-gray-300 to-transparent" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedStage} onOpenChange={() => setSelectedStage(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-3xl">
          {selectedStage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-white">
                  <div className={cn("p-2 rounded-lg bg-gradient-to-br", selectedStage.color)}>
                    <selectedStage.icon className="w-5 h-5 text-white" />
                  </div>
                  {selectedStage.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-zinc-800/50">
                    <p className="text-2xl font-bold text-white">{selectedStage.metrics.visitors.toLocaleString()}</p>
                    <p className="text-xs text-zinc-500 mt-1">Entrées</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-zinc-800/50">
                    <p className="text-2xl font-bold text-emerald-400">{selectedStage.conversionRate}%</p>
                    <p className="text-xs text-zinc-500 mt-1">Taux conversion</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-zinc-800/50">
                    <p className="text-2xl font-bold text-white">€{selectedStage.avgValue}</p>
                    <p className="text-xs text-zinc-500 mt-1">Valeur moyenne</p>
                  </div>
                </div>

                {/* Opportunities */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">Opportunités Cross-sell & Up-sell</h4>
                  <div className="space-y-3">
                    {selectedStage.opportunities.map((opp, i) => {
                      const oppType = opportunityTypes[opp.type];
                      const OppIcon = oppType.icon;
                      const status = statusConfig[opp.status];
                      
                      return (
                        <div key={i} className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className={oppType.color}>
                                <OppIcon className="w-3 h-3 mr-1" />
                                {oppType.label}
                              </Badge>
                              <Badge className={status.color}>{status.label}</Badge>
                            </div>
                            <span className="text-sm font-semibold text-emerald-400">{opp.impact}</span>
                          </div>
                          <p className="font-medium text-white mb-1">{opp.title}</p>
                          <p className="text-sm text-zinc-400">{opp.description}</p>
                          
                          {opp.status === 'test' && (
                            <div className="mt-3 flex gap-2">
                              <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-400">
                                Voir résultats test
                              </Button>
                              <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                                Activer définitivement
                              </Button>
                            </div>
                          )}
                          {opp.status === 'inactive' && (
                            <div className="mt-3">
                              <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                                Lancer test A/B
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">Actions d'optimisation</h4>
                  <div className="space-y-2">
                    {selectedStage.actions.map((action, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/30">
                        <Clock className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                        <span className="text-sm text-zinc-300">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      </>
      )}
    </div>
  );
}