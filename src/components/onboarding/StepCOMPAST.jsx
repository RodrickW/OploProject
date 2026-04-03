import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SALES_CHANNELS = ['Sur place', 'Livraison', 'Click & Collect', 'Traiteur', 'Événementiel', 'B2B'];

const Section = ({ emoji, label, children }) => (
  <div className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{emoji} {label}</p>
    {children}
  </div>
);

export default function StepCOMPAST({ data, onChange, onBack, onComplete, saving }) {
  const toggleChannel = (ch) => {
    const current = data.sales_channels || [];
    onChange({ sales_channels: current.includes(ch) ? current.filter(c => c !== ch) : [...current, ch] });
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <span className="text-4xl mb-4 block">🧠</span>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Framework COMPAST</h2>
        <p className="text-gray-500">Ces données permettent à l'IA d'Oplo de générer des recommandations précises sur vos 7 axes stratégiques.</p>
      </div>

      <div className="space-y-4">
        <Section emoji="🗺️" label="Market">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Zone de chalandise</label>
              <Input value={data.catchment_area} onChange={e => onChange({ catchment_area: e.target.value })} placeholder="Ex: 2e arrondissement Paris" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Concurrents principaux</label>
              <Input value={data.main_competitors} onChange={e => onChange({ main_competitors: e.target.value })} placeholder="Ex: Café de Flore, Brasserie Lipp" />
            </div>
          </div>
        </Section>

        <Section emoji="🍽️" label="Product / Service">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Best sellers</label>
            <Input value={data.best_sellers} onChange={e => onChange({ best_sellers: e.target.value })} placeholder="Ex: Entrecôte sauce béarnaise, Crème brûlée, Cocktail maison" />
          </div>
        </Section>

        <Section emoji="⚡" label="Sales">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Canaux de vente actifs</label>
            <div className="flex flex-wrap gap-2">
              {SALES_CHANNELS.map(ch => (
                <button
                  key={ch}
                  onClick={() => toggleChannel(ch)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition font-medium ${
                    (data.sales_channels || []).includes(ch)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}
                >{ch}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Marketing actuel</label>
            <Input value={data.current_marketing} onChange={e => onChange({ current_marketing: e.target.value })} placeholder="Ex: Instagram, Google Ads, emailing, influenceurs..." />
          </div>
        </Section>

        <Section emoji="👥" label="Team">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Structure de l'équipe</label>
              <Input value={data.staff_structure} onChange={e => onChange({ staff_structure: e.target.value })} placeholder="Ex: 1 manager, 3 serveurs, 2 cuisiniers" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Taux de turnover</label>
              <Select value={data.turnover_rate} onValueChange={v => onChange({ turnover_rate: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="faible">Faible (&lt;10%)</SelectItem>
                  <SelectItem value="moyen">Moyen (10–30%)</SelectItem>
                  <SelectItem value="eleve">Élevé (&gt;30%)</SelectItem>
                  <SelectItem value="inconnu">Inconnu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Section>

        <Section emoji="📋" label="Alignment – SOPs & Standards">
          <Textarea
            value={data.current_sop}
            onChange={e => onChange({ current_sop: e.target.value })}
            placeholder="Ex: Checklist ouverture/fermeture, procédure formation nouveaux employés, protocole réclamations..."
            className="h-20 resize-none"
          />
        </Section>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <Button variant="outline" onClick={onBack} className="px-6"><ArrowLeft className="w-4 h-4 mr-2" /> Retour</Button>
        <Button onClick={onComplete} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-8 gap-2 text-sm font-semibold">
          {saving
            ? <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Création de votre dashboard...</>
            : <><Sparkles className="w-4 h-4" /> Finaliser et lancer Oplo.ai</>}
        </Button>
      </div>
    </div>
  );
}