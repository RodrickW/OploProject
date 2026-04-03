import React from 'react';
import { 
  Euro, 
  Users, 
  Building2, 
  TrendingUp,
  MapPin,
  Utensils,
  Target,
  Zap,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const marketData = {
  total: 2.8,
  breakdown: [
    {
      category: 'Restauration traditionnelle',
      value: 1.2,
      percentage: 42.8,
      growth: '+3.2%',
      color: 'from-violet-600 to-purple-600',
      bgColor: 'bg-violet-500/10',
      textColor: 'text-violet-400'
    },
    {
      category: 'Fast-casual & Bistrot',
      value: 0.8,
      percentage: 28.6,
      growth: '+6.8%',
      color: 'from-cyan-600 to-blue-600',
      bgColor: 'bg-cyan-500/10',
      textColor: 'text-cyan-400'
    },
    {
      category: 'Gastronomie',
      value: 0.5,
      percentage: 17.8,
      growth: '+2.1%',
      color: 'from-amber-600 to-orange-600',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-400'
    },
    {
      category: 'Autres (Traiteur, Événementiel)',
      value: 0.3,
      percentage: 10.8,
      growth: '+8.5%',
      color: 'from-emerald-600 to-green-600',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-400'
    }
  ],
  sources: [
    { name: 'INSEE - Statistiques restauration 2025', weight: 40 },
    { name: 'Étude Gira Conseil', weight: 30 },
    { name: 'Analyse concurrentielle locale', weight: 20 },
    { name: 'Données internes & projections', weight: 10 }
  ],
  methodology: [
    'Population zone de chalandise: 850,000 habitants',
    'Fréquence moyenne resto/habitant: 2.4x/mois',
    'Ticket moyen zone: €42',
    'Taux de captation estimé: 65%'
  ]
};

const conquestStrategy = {
  phases: [
    {
      id: 1,
      name: 'Consolidation (0-6 mois)',
      target: '+2.5% part de marché',
      revenue: '+€180k',
      status: 'active',
      actions: [
        { text: 'Optimiser expérience client actuelle', done: true },
        { text: 'Programme fidélité premium', done: true },
        { text: 'Augmenter capacité 15%', done: false },
        { text: 'Formation équipe excellence', done: false }
      ]
    },
    {
      id: 2,
      name: 'Expansion (6-18 mois)',
      target: '+5% part de marché',
      revenue: '+€420k',
      status: 'planned',
      actions: [
        { text: 'Ouverture 2ème emplacement stratégique', done: false },
        { text: 'Lancement service traiteur entreprises', done: false },
        { text: 'Partenariats hôtels de luxe', done: false },
        { text: 'Développement carte événementiel', done: false }
      ]
    },
    {
      id: 3,
      name: 'Domination (18-36 mois)',
      target: '+8% part de marché',
      revenue: '+€850k',
      status: 'future',
      actions: [
        { text: '3ème restaurant zone premium', done: false },
        { text: 'Concept restaurant éphémère', done: false },
        { text: 'Franchise modèle éprouvé', done: false },
        { text: 'Position leader segment haut de gamme', done: false }
      ]
    }
  ],
  tactics: [
    {
      category: 'Acquisition',
      icon: Users,
      color: 'text-cyan-400',
      items: [
        'Campagnes Google Ads ciblées quartier premium',
        'Partenariat influenceurs locaux gastronomie',
        'Événements découverte mensuel',
        'Offre parrainage récompense double'
      ]
    },
    {
      category: 'Différenciation',
      icon: Zap,
      color: 'text-violet-400',
      items: [
        'Expérience gastronomique immersive unique',
        'Menu dégustation chef signature',
        'Cave à vins exceptionnelle 300+ références',
        'Service personnalisé haut de gamme'
      ]
    },
    {
      category: 'Territoire',
      icon: MapPin,
      color: 'text-amber-400',
      items: [
        'Couverture complète arrondissements 1-8',
        'Présence événements business quartier',
        'Partenariats entreprises locales',
        'Visibilité maximale zones de passage'
      ]
    }
  ]
};

export default function MarketSizeBreakdown({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200 max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600">
              <Euro className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-gray-900">Taille du marché : €2.8Md</span>
              <p className="text-sm text-gray-600 font-normal">Analyse détaillée et stratégie de conquête</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Market Breakdown */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Répartition par segment</h3>
            <div className="space-y-3">
              {marketData.breakdown.map((segment, i) => (
                <div key={i} className={cn("p-4 rounded-xl border bg-white", segment.bgColor, "border-gray-200")}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-gray-900">{segment.category}</h4>
                        <Badge className={segment.textColor + ' bg-opacity-20'}>
                          {segment.growth}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">Part du marché total</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">€{segment.value}Md</p>
                      <p className="text-sm text-gray-600">{segment.percentage}%</p>
                    </div>
                  </div>
                  <Progress value={segment.percentage} className="h-2 bg-gray-200" />
                </div>
              ))}
            </div>
          </div>

          {/* Methodology */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Sources de données
              </h4>
              <div className="space-y-2">
                {marketData.sources.map((source, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{source.name}</p>
                      <Progress value={source.weight} className="h-1 bg-gray-200 mt-1" />
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{source.weight}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-600" />
                Méthodologie de calcul
              </h4>
              <div className="space-y-2">
                {marketData.methodology.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Conquest Strategy */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Stratégie de conquête du marché
            </h3>

            {/* Phases */}
            <div className="space-y-4 mb-6">
              {conquestStrategy.phases.map((phase, i) => (
                <div 
                  key={phase.id}
                  className={cn(
                    "p-5 rounded-xl border bg-white",
                    phase.status === 'active' ? 'border-blue-300' :
                    phase.status === 'planned' ? 'border-cyan-300' :
                    'border-gray-200'
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={cn(
                          "text-2xl font-bold",
                          phase.status === 'active' ? 'text-blue-600' :
                          phase.status === 'planned' ? 'text-cyan-600' :
                          'text-gray-500'
                        )}>
                          Phase {phase.id}
                        </span>
                        <h4 className="text-lg font-semibold text-gray-900">{phase.name}</h4>
                        {phase.status === 'active' && (
                          <Badge className="bg-emerald-100 text-emerald-700">En cours</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-gray-700">
                          <Target className="w-3 h-3" />
                          {phase.target}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-600">
                          <Euro className="w-3 h-3" />
                          {phase.revenue} revenus additionnels
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2">
                    {phase.actions.map((action, j) => (
                      <div 
                        key={j}
                        className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 text-sm"
                      >
                        {action.done ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded border-2 border-gray-400 flex-shrink-0" />
                        )}
                        <span className={cn(
                          action.done ? 'text-gray-500 line-through' : 'text-gray-700'
                        )}>
                          {action.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Tactics */}
            <div className="grid lg:grid-cols-3 gap-4">
              {conquestStrategy.tactics.map((tactic, i) => {
                const Icon = tactic.icon;
                return (
                  <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className={cn("w-4 h-4", tactic.color)} />
                      <h4 className="text-sm font-semibold text-gray-900">{tactic.category}</h4>
                    </div>
                    <div className="space-y-2">
                      {tactic.items.map((item, j) => (
                        <div key={j} className="flex items-start gap-2 text-xs text-gray-700">
                          <ArrowRight className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="p-5 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-4">
              <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Potentiel de croissance</h4>
                <p className="text-sm text-gray-700 mb-3">
                  En suivant cette stratégie sur 3 ans, votre groupe peut capturer <span className="text-blue-600 font-semibold">+15.5% de parts de marché supplémentaires</span>, 
                  représentant <span className="text-emerald-600 font-semibold">€1.45M de revenus additionnels annuels</span> et une position de <span className="text-cyan-600 font-semibold">leader dans le segment premium</span>.
                </p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Télécharger le plan complet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}