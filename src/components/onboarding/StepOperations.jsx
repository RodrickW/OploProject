import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const PLATFORMS = ['Uber Eats', 'Deliveroo', 'Just Eat', 'En direct'];

export default function StepOperations({ data, onChange, onNext, onBack }) {
  const togglePlatform = (p) => {
    const current = data.delivery_platforms || [];
    onChange({ delivery_platforms: current.includes(p) ? current.filter(x => x !== p) : [...current, p] });
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <span className="text-4xl mb-4 block">📊</span>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Données Opérationnelles</h2>
        <p className="text-gray-500">Ces métriques permettent de calculer votre productivité, performance et revenue par site.</p>
      </div>

      <div className="space-y-7">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Métriques clés</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">CA moyen mensuel (€)</label>
              <Input type="number" value={data.avg_monthly_revenue} onChange={e => onChange({ avg_monthly_revenue: e.target.value })} placeholder="50 000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ticket moyen (€)</label>
              <Input type="number" value={data.avg_ticket} onChange={e => onChange({ avg_ticket: e.target.value })} placeholder="35" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Couverts / jour</label>
              <Input type="number" value={data.avg_covers_per_day} onChange={e => onChange({ avg_covers_per_day: e.target.value })} placeholder="120" />
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Équipe</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Total employés</label>
              <Input type="number" value={data.total_employees} onChange={e => onChange({ total_employees: e.target.value })} placeholder="15" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">% Cuisine</label>
              <Input type="number" min="0" max="100" value={data.kitchen_staff_pct} onChange={e => onChange({ kitchen_staff_pct: parseInt(e.target.value) || 0 })} placeholder="33" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">% Salle</label>
              <Input type="number" min="0" max="100" value={data.floor_staff_pct} onChange={e => onChange({ floor_staff_pct: parseInt(e.target.value) || 0 })} placeholder="50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">% Management</label>
              <Input type="number" min="0" max="100" value={data.manager_staff_pct} onChange={e => onChange({ manager_staff_pct: parseInt(e.target.value) || 0 })} placeholder="17" />
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Livraison & Emporté</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white">
              <div>
                <p className="text-sm font-medium text-gray-700">Livraison à domicile</p>
                <p className="text-xs text-gray-400">Livraison via plateformes ou en propre</p>
              </div>
              <Switch checked={data.has_delivery} onCheckedChange={v => onChange({ has_delivery: v })} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white">
              <div>
                <p className="text-sm font-medium text-gray-700">Click & Collect / Emporté</p>
              </div>
              <Switch checked={data.has_takeaway} onCheckedChange={v => onChange({ has_takeaway: v })} />
            </div>
          </div>

          {data.has_delivery && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Plateformes utilisées</label>
              <div className="flex gap-2 flex-wrap">
                {PLATFORMS.map(p => (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition font-medium ${
                      (data.delivery_platforms || []).includes(p)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                    }`}
                  >{p}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack} className="px-6"><ArrowLeft className="w-4 h-4 mr-2" /> Retour</Button>
        <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700 text-white px-8">Continuer <ArrowRight className="w-4 h-4 ml-2" /></Button>
      </div>
    </div>
  );
}