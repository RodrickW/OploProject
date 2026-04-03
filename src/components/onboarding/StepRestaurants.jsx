import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Plus, Trash2, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TYPES = ['brasserie', 'bistro', 'pizza', 'burger', 'sushi', 'fine_dining', 'fast_casual', 'bar', 'cafe', 'autre'];
const EMPTY = { name: '', address: '', city: '', country: 'France', opening_date: '', type: '', capacity: '', hours: '', manager: '' };

export default function StepRestaurants({ data, onChange, onNext, onBack }) {
  const [showForm, setShowForm] = useState((data.restaurants || []).length === 0);
  const [form, setForm] = useState(EMPTY);
  const [editIdx, setEditIdx] = useState(null);

  const restaurants = data.restaurants || [];

  const handleAdd = () => {
    if (!form.name) return;
    const updated = editIdx !== null
      ? restaurants.map((r, i) => i === editIdx ? form : r)
      : [...restaurants, form];
    onChange({ restaurants: updated });
    setForm(EMPTY);
    setShowForm(false);
    setEditIdx(null);
  };

  const handleEdit = (idx) => { setForm(restaurants[idx]); setEditIdx(idx); setShowForm(true); };
  const handleDelete = (idx) => onChange({ restaurants: restaurants.filter((_, i) => i !== idx) });

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <span className="text-4xl mb-4 block">🍽️</span>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Vos Restaurants</h2>
        <p className="text-gray-500">Configurez chaque site pour activer la vue multi-restaurants et les comparaisons.</p>
      </div>

      {restaurants.length > 0 && (
        <div className="space-y-3 mb-5">
          {restaurants.map((r, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50 hover:border-gray-300 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                  {r.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {[r.city, r.country].filter(Boolean).join(', ')}
                    {r.type ? ` · ${r.type}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => handleEdit(idx)} className="text-xs text-blue-600 hover:underline">Modifier</button>
                <button onClick={() => handleDelete(idx)} className="text-gray-400 hover:text-red-500 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <div className="border border-blue-200 rounded-xl p-6 bg-blue-50/30 space-y-4">
          <h3 className="font-semibold text-gray-900 text-sm">{editIdx !== null ? 'Modifier le restaurant' : 'Ajouter un restaurant'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nom *</label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Le Bistro du Marais" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Ville</label>
              <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Paris" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Adresse</label>
              <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="12 Rue de la Paix" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Pays</label>
              <Input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} placeholder="France" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
              <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                <SelectTrigger><SelectValue placeholder="Type de restaurant" /></SelectTrigger>
                <SelectContent>
                  {TYPES.map(t => <SelectItem key={t} value={t}>{t.replace('_', ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Capacité (places)</label>
              <Input type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} placeholder="80" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Date d'ouverture</label>
              <Input type="date" value={form.opening_date} onChange={e => setForm(f => ({ ...f, opening_date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Manager responsable</label>
              <Input value={form.manager} onChange={e => setForm(f => ({ ...f, manager: e.target.value }))} placeholder="Prénom Nom" />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <Button onClick={handleAdd} disabled={!form.name} className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
              <Plus className="w-4 h-4 mr-1" />{editIdx !== null ? 'Mettre à jour' : 'Ajouter ce restaurant'}
            </Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setForm(EMPTY); setEditIdx(null); }} className="text-sm">Annuler</Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl p-4 text-gray-500 hover:text-blue-600 transition flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Ajouter un restaurant
        </button>
      )}

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack} className="px-6"><ArrowLeft className="w-4 h-4 mr-2" /> Retour</Button>
        <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
          Continuer <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}