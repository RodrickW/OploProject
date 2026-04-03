import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const OBJECTIVES = [
  { id: 'increase_revenue', label: '📈 Augmenter le chiffre d\'affaires' },
  { id: 'open_more', label: '🚀 Ouvrir de nouveaux restaurants' },
  { id: 'improve_margins', label: '💰 Améliorer les marges' },
  { id: 'reduce_costs', label: '✂️ Réduire les coûts' },
  { id: 'control_ops', label: '🎯 Mieux contrôler les opérations' },
  { id: 'improve_customer', label: '⭐ Améliorer la satisfaction client' },
  { id: 'reduce_turnover', label: '👥 Réduire le turnover' },
  { id: 'fundraising', label: '💼 Préparer une levée de fonds' },
  { id: 'standardize', label: '📋 Standardiser les process' },
];

export default function StepObjectives({ data, onChange, onNext, onBack }) {
  const selected = data.main_objectives || [];

  const toggle = (id) => {
    onChange({ main_objectives: selected.includes(id) ? selected.filter(o => o !== id) : [...selected, id] });
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <span className="text-4xl mb-4 block">🎯</span>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Objectifs Business</h2>
        <p className="text-gray-500">Vos objectifs configurent les KPIs prioritaires, les alertes IA et les recommandations de votre dashboard.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Quels sont vos objectifs principaux ? <span className="text-gray-400 font-normal">(plusieurs choix)</span></label>
          <div className="grid grid-cols-1 gap-2">
            {OBJECTIVES.map(obj => {
              const isSelected = selected.includes(obj.id);
              return (
                <button
                  key={obj.id}
                  onClick={() => toggle(obj.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition ${
                    isSelected ? 'bg-blue-50 border-blue-300 text-blue-800' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition ${
                    isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium">{obj.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Quels KPIs regardez-vous aujourd'hui ?</label>
          <Textarea
            value={data.current_kpis}
            onChange={e => onChange({ current_kpis: e.target.value })}
            placeholder="Ex: CA quotidien, ticket moyen, nombre de couverts, ratio food cost, masse salariale..."
            className="h-24 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Quelles décisions sont difficiles à prendre aujourd'hui ?</label>
          <Textarea
            value={data.difficult_decisions}
            onChange={e => onChange({ difficult_decisions: e.target.value })}
            placeholder="Ex: Savoir si je dois recruter, anticiper les périodes creuses, comparer la performance entre mes restaurants..."
            className="h-24 resize-none"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack} className="px-6"><ArrowLeft className="w-4 h-4 mr-2" /> Retour</Button>
        <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700 text-white px-8">Continuer <ArrowRight className="w-4 h-4 ml-2" /></Button>
      </div>
    </div>
  );
}