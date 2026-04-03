import React from 'react';
import { Target, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function WhatToFixToday({ priorities }) {
  const defaultPriorities = [
    {
      id: 1,
      priority: 1,
      title: 'Réduire le food waste',
      description: 'Waste alimentaire détecté à 8% (objectif: 4%)',
      impact: 'high',
      effort: 'medium',
      expectedGain: '€450/mois',
      actions: [
        'Revoir les portions servies',
        'Former l\'équipe sur le FIFO',
        'Optimiser les commandes fournisseurs'
      ],
      completed: false
    },
    {
      id: 2,
      priority: 2,
      title: 'Augmenter l\'upsell boissons',
      description: 'Seulement 32% des clients prennent une boisson (benchmark: 65%)',
      impact: 'high',
      effort: 'low',
      expectedGain: '€1200/mois',
      actions: [
        'Former l\'équipe à la suggestion active',
        'Créer un combo plat + boisson',
        'Mettre en avant les boissons premium'
      ],
      completed: false
    },
    {
      id: 3,
      priority: 3,
      title: 'Ajouter du staff entre 12h et 14h',
      description: 'Temps de service trop long pendant le rush (+6min vs objectif)',
      impact: 'medium',
      effort: 'medium',
      expectedGain: '+15 couverts/jour',
      actions: [
        'Recruter 1 extra pour le service midi',
        'Optimiser la mise en place cuisine',
        'Simplifier le menu déjeuner'
      ],
      completed: false
    }
  ];

  const priorityList = priorities || defaultPriorities;

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="rounded-xl bg-white border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">"What should I fix today?"</h3>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Priorisé par impact business · Généré par l'IA Oplo
      </p>

      <div className="space-y-4">
        {priorityList.map((item) => (
          <div 
            key={item.id}
            className={cn(
              "rounded-xl border p-5 transition-all hover:shadow-md",
              item.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0",
                item.completed ? "bg-green-500 text-white" : "bg-blue-600 text-white"
              )}>
                {item.completed ? <Check className="w-5 h-5" /> : item.priority}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className={cn(
                      "font-semibold text-gray-900 mb-1",
                      item.completed && "line-through text-gray-500"
                    )}>
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-xs font-semibold border",
                      getImpactColor(item.impact)
                    )}>
                      Impact {item.impact}
                    </span>
                  </div>
                </div>

                {!item.completed && (
                  <>
                    <div className="flex items-center gap-4 mt-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Gain estimé:</span>
                        <span className="text-sm font-bold text-green-600">{item.expectedGain}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Effort:</span>
                        <span className="text-sm font-semibold text-gray-700 capitalize">{item.effort}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mt-3">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Actions à réaliser :</p>
                      <ul className="space-y-1.5">
                        {item.actions.map((action, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-end mt-3">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Marquer comme fait
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}