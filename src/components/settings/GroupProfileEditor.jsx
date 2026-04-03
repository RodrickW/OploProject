import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Save, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const Section = ({ title, children }) => (
  <div className="rounded-xl bg-white border border-gray-200 p-6 space-y-4">
    <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">{title}</h3>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <Label className="text-sm text-gray-600">{label}</Label>
    {children}
  </div>
);

export default function GroupProfileEditor() {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(null);

  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ['onboarding', currentUser?.email],
    queryFn: () => base44.entities.OnboardingProfile.filter({ created_by: currentUser.email }, '-created_date', 1),
    enabled: !!currentUser?.email
  });

  const profile = profiles[0] || null;

  useEffect(() => {
    if (profile && !form) {
      setForm({ ...profile });
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: (data) => {
      if (profile?.id) {
        return base44.entities.OnboardingProfile.update(profile.id, data);
      } else {
        return base44.entities.OnboardingProfile.create({ ...data, status: 'completed' });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  if (isLoading) return <div className="text-center py-12 text-gray-400">Chargement...</div>;

  if (!form) return (
    <div className="rounded-xl bg-white border border-gray-200 p-12 text-center">
      <p className="text-gray-500 mb-4">Aucun profil groupe trouvé. Complétez l'onboarding pour configurer votre groupe.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Groupe */}
      <Section title="Informations du groupe">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nom du groupe">
            <Input value={form.group_name || ''} onChange={e => set('group_name', e.target.value)} />
          </Field>
          <Field label="Propriétaire">
            <Input value={form.owner_name || ''} onChange={e => set('owner_name', e.target.value)} />
          </Field>
          <Field label="Pays / Villes">
            <Input value={form.countries || ''} onChange={e => set('countries', e.target.value)} />
          </Field>
          <Field label="Concept du groupe">
            <Input value={form.group_concept || ''} onChange={e => set('group_concept', e.target.value)} />
          </Field>
          <Field label="Nombre de restaurants">
            <Input type="number" value={form.total_restaurants || ''} onChange={e => set('total_restaurants', Number(e.target.value))} />
          </Field>
        </div>
      </Section>

      {/* Contact */}
      <Section title="Contact principal">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Nom">
            <Input value={form.contact_name || ''} onChange={e => set('contact_name', e.target.value)} />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.contact_email || ''} onChange={e => set('contact_email', e.target.value)} />
          </Field>
          <Field label="Téléphone">
            <Input value={form.contact_phone || ''} onChange={e => set('contact_phone', e.target.value)} />
          </Field>
        </div>
      </Section>

      {/* Financier */}
      <Section title="Données financières">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="CA mensuel moyen (€)">
            <Input type="number" value={form.avg_monthly_revenue || ''} onChange={e => set('avg_monthly_revenue', Number(e.target.value))} />
          </Field>
          <Field label="Ticket moyen (€)">
            <Input type="number" value={form.avg_ticket || ''} onChange={e => set('avg_ticket', Number(e.target.value))} />
          </Field>
          <Field label="Couverts / jour">
            <Input type="number" value={form.avg_covers_per_day || ''} onChange={e => set('avg_covers_per_day', Number(e.target.value))} />
          </Field>
        </div>
      </Section>

      {/* Équipe */}
      <Section title="Équipe">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="Total employés">
            <Input type="number" value={form.total_employees || ''} onChange={e => set('total_employees', Number(e.target.value))} />
          </Field>
          <Field label="% Cuisine">
            <Input type="number" min="0" max="100" value={form.kitchen_staff_pct || ''} onChange={e => set('kitchen_staff_pct', Number(e.target.value))} />
          </Field>
          <Field label="% Salle">
            <Input type="number" min="0" max="100" value={form.floor_staff_pct || ''} onChange={e => set('floor_staff_pct', Number(e.target.value))} />
          </Field>
          <Field label="% Management">
            <Input type="number" min="0" max="100" value={form.manager_staff_pct || ''} onChange={e => set('manager_staff_pct', Number(e.target.value))} />
          </Field>
        </div>
        <Field label="Turnover">
          <Select value={form.turnover_rate || 'inconnu'} onValueChange={v => set('turnover_rate', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="faible">Faible</SelectItem>
              <SelectItem value="moyen">Moyen</SelectItem>
              <SelectItem value="eleve">Élevé</SelectItem>
              <SelectItem value="inconnu">Inconnu</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </Section>

      {/* Opérations */}
      <Section title="Opérations">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Logiciel POS / Caisse">
            <Input value={form.pos_system || ''} onChange={e => set('pos_system', e.target.value)} />
          </Field>
          <Field label="Logiciel planning">
            <Input value={form.planning_software || ''} onChange={e => set('planning_software', e.target.value)} />
          </Field>
          <Field label="Logiciel comptabilité">
            <Input value={form.accounting_software || ''} onChange={e => set('accounting_software', e.target.value)} />
          </Field>
          <Field label="Logiciel stock">
            <Input value={form.stock_software || ''} onChange={e => set('stock_software', e.target.value)} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-6 pt-2">
          <div className="flex items-center gap-3">
            <Switch checked={!!form.has_delivery} onCheckedChange={v => set('has_delivery', v)} />
            <Label>Livraison active</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={!!form.has_takeaway} onCheckedChange={v => set('has_takeaway', v)} />
            <Label>À emporter actif</Label>
          </div>
        </div>
        {form.has_delivery && (
          <Field label="Plateformes de livraison">
            <Input value={form.delivery_platforms || ''} onChange={e => set('delivery_platforms', e.target.value)} placeholder="Ex: Uber Eats, Deliveroo..." />
          </Field>
        )}
      </Section>

      {/* Stratégie */}
      <Section title="Stratégie & marché">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Objectifs principaux (séparés par virgule)">
            <Textarea value={form.main_objectives || ''} onChange={e => set('main_objectives', e.target.value)} rows={2} />
          </Field>
          <Field label="Best-sellers">
            <Textarea value={form.best_sellers || ''} onChange={e => set('best_sellers', e.target.value)} rows={2} />
          </Field>
          <Field label="Concurrents principaux">
            <Textarea value={form.main_competitors || ''} onChange={e => set('main_competitors', e.target.value)} rows={2} />
          </Field>
          <Field label="Zone de chalandise">
            <Textarea value={form.catchment_area || ''} onChange={e => set('catchment_area', e.target.value)} rows={2} />
          </Field>
        </div>
      </Section>

      <Button
        className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
        onClick={() => mutation.mutate(form)}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Enregistrement...</>
        ) : saved ? (
          <><CheckCircle className="w-4 h-4 mr-2" /> Enregistré !</>
        ) : (
          <><Save className="w-4 h-4 mr-2" /> Enregistrer les modifications</>
        )}
      </Button>
    </div>
  );
}