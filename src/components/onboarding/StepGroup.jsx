import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CONCEPTS = [
  { value: 'fast_casual', label: 'Fast Casual' },
  { value: 'bistro', label: 'Bistro' },
  { value: 'fine_dining', label: 'Fine Dining' },
  { value: 'brasserie', label: 'Brasserie' },
  { value: 'dark_kitchen', label: 'Dark Kitchen' },
  { value: 'pizza', label: 'Pizza' },
  { value: 'sushi', label: 'Sushi' },
  { value: 'burger', label: 'Burger' },
  { value: 'cafe', label: 'Café / Coffee Shop' },
  { value: 'autre', label: 'Autre' },
];

export default function StepGroup({ data, onChange, onNext }) {
  const canContinue = data.group_name && data.contact_email;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <span className="text-4xl mb-4 block">🏢</span>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Votre Groupe</h2>
        <p className="text-gray-500">Ces informations structurent votre espace multi-restaurants dans Oplo.ai.</p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom du groupe *</label>
            <Input value={data.group_name} onChange={e => onChange({ group_name: e.target.value })} placeholder="Ex: Groupe Lumière" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Propriétaire / CEO *</label>
            <Input value={data.owner_name} onChange={e => onChange({ owner_name: e.target.value })} placeholder="Ex: Nicolas Delbois" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact principal</label>
            <Input value={data.contact_name} onChange={e => onChange({ contact_name: e.target.value })} placeholder="Prénom Nom" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
            <Input type="email" value={data.contact_email} onChange={e => onChange({ contact_email: e.target.value })} placeholder="contact@groupe.com" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone</label>
            <Input value={data.contact_phone} onChange={e => onChange({ contact_phone: e.target.value })} placeholder="+33 6 12 34 56 78" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Pays / Villes</label>
            <Input value={data.countries} onChange={e => onChange({ countries: e.target.value })} placeholder="Paris, Lyon, Dubaï..." />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre de restaurants</label>
            <Input type="number" min="1" value={data.total_restaurants} onChange={e => onChange({ total_restaurants: parseInt(e.target.value) || 1 })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Concept principal</label>
            <Select value={data.group_concept} onValueChange={v => onChange({ group_concept: v })}>
              <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
              <SelectContent>
                {CONCEPTS.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={onNext} disabled={!canContinue} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
          Continuer <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}