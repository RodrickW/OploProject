import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const POS_SYSTEMS = ['Lightspeed', 'Square', 'Tiller', 'Toast', 'Zelty', 'L\'Addition', 'Trivec', 'Clover', 'Autre', 'Aucun'];

export default function StepTechStack({ data, onChange, onNext, onBack }) {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <span className="text-4xl mb-4 block">⚙️</span>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Stack Technologique</h2>
        <p className="text-gray-500">Oplo.ai s'intègre à vos outils existants pour automatiser vos dashboards.</p>
      </div>

      <div className="space-y-5">
        <div className="p-5 rounded-xl border border-gray-200 space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">🖥️ Logiciel de caisse (POS)</p>
          <Select value={data.pos_system} onValueChange={v => onChange({ pos_system: v })}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Sélectionner votre POS..." /></SelectTrigger>
            <SelectContent>
              {POS_SYSTEMS.map(p => <SelectItem key={p} value={p.toLowerCase().replace(/\s+/g, '_')}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="p-5 rounded-xl border border-gray-200 space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">📅 Planning & RH</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Logiciel de planning</label>
            <Input value={data.planning_software} onChange={e => onChange({ planning_software: e.target.value })} placeholder="Ex: Skello, Combo, Planday, Excel..." />
          </div>
        </div>

        <div className="p-5 rounded-xl border border-gray-200 space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">💰 Finance & Stocks</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Logiciel comptable</label>
              <Input value={data.accounting_software} onChange={e => onChange({ accounting_software: e.target.value })} placeholder="Sage, QuickBooks, Pennylane..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gestion des stocks</label>
              <Input value={data.stock_software} onChange={e => onChange({ stock_software: e.target.value })} placeholder="Yokitup, Koust, Marello..." />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Autres outils (CRM, réservation, marketing...)</label>
          <Textarea value={data.other_tools} onChange={e => onChange({ other_tools: e.target.value })} placeholder="Ex: TheFork, SevenRooms, Mailchimp, HubSpot..." className="h-24 resize-none" />
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack} className="px-6"><ArrowLeft className="w-4 h-4 mr-2" /> Retour</Button>
        <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700 text-white px-8">Continuer <ArrowRight className="w-4 h-4 ml-2" /></Button>
      </div>
    </div>
  );
}