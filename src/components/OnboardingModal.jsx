import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import StepGroup from './onboarding/StepGroup';
import StepRestaurants from './onboarding/StepRestaurants';
import StepOperations from './onboarding/StepOperations';
import StepTechStack from './onboarding/StepTechStack';
import StepObjectives from './onboarding/StepObjectives';
import StepCOMPAST from './onboarding/StepCOMPAST';

const STEPS = [
  { id: 1, title: 'Votre Groupe', desc: 'Informations générales', emoji: '🏢' },
  { id: 2, title: 'Vos Restaurants', desc: 'Configuration des sites', emoji: '🍽️' },
  { id: 3, title: 'Opérations', desc: 'Données clés', emoji: '📊' },
  { id: 4, title: 'Stack Tech', desc: 'Outils existants', emoji: '⚙️' },
  { id: 5, title: 'Objectifs', desc: 'Priorités business', emoji: '🎯' },
  { id: 6, title: 'COMPAST', desc: 'Intelligence stratégique', emoji: '🧠' },
];

const INITIAL_DATA = {
  group_name: '', owner_name: '', contact_name: '', contact_email: '',
  contact_phone: '', countries: '', total_restaurants: 1, group_concept: '',
  restaurants: [],
  avg_monthly_revenue: '', avg_ticket: '', avg_covers_per_day: '',
  total_employees: '', kitchen_staff_pct: 33, floor_staff_pct: 50, manager_staff_pct: 17,
  has_delivery: false, has_takeaway: false, delivery_platforms: [],
  pos_system: '', planning_software: '', accounting_software: '', stock_software: '', other_tools: '',
  main_objectives: [], current_kpis: '', difficult_decisions: '',
  catchment_area: '', main_competitors: '', best_sellers: '',
  current_sop: '', sales_channels: [], current_marketing: '',
  staff_structure: '', turnover_rate: 'inconnu',
};

const TYPE_MAP = { brasserie: 'brasserie', bistro: 'bistro', fine_dining: 'fine_dining', fast_casual: 'fast_casual', casual: 'casual' };

export default function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [data, setData] = useState(INITIAL_DATA);

  const update = (updates) => setData(prev => ({ ...prev, ...updates }));

  const handleComplete = async () => {
    setSaving(true);
    await base44.entities.OnboardingProfile.create({
      group_name: data.group_name,
      owner_name: data.owner_name,
      contact_name: data.contact_name,
      contact_email: data.contact_email,
      contact_phone: data.contact_phone,
      countries: data.countries,
      total_restaurants: data.total_restaurants,
      group_concept: data.group_concept,
      restaurants_json: JSON.stringify(data.restaurants),
      avg_monthly_revenue: parseFloat(data.avg_monthly_revenue) || 0,
      avg_ticket: parseFloat(data.avg_ticket) || 0,
      avg_covers_per_day: parseFloat(data.avg_covers_per_day) || 0,
      total_employees: parseFloat(data.total_employees) || 0,
      kitchen_staff_pct: data.kitchen_staff_pct,
      floor_staff_pct: data.floor_staff_pct,
      manager_staff_pct: data.manager_staff_pct,
      has_delivery: data.has_delivery,
      has_takeaway: data.has_takeaway,
      delivery_platforms: (data.delivery_platforms || []).join(', '),
      pos_system: data.pos_system,
      planning_software: data.planning_software,
      accounting_software: data.accounting_software,
      stock_software: data.stock_software,
      other_tools: data.other_tools,
      main_objectives: (data.main_objectives || []).join(', '),
      current_kpis: data.current_kpis,
      difficult_decisions: data.difficult_decisions,
      catchment_area: data.catchment_area,
      main_competitors: data.main_competitors,
      best_sellers: data.best_sellers,
      current_sop: data.current_sop,
      sales_channels: (data.sales_channels || []).join(', '),
      current_marketing: data.current_marketing,
      staff_structure: data.staff_structure,
      turnover_rate: data.turnover_rate,
      status: 'completed',
    });

    for (const r of data.restaurants) {
      await base44.entities.Restaurant.create({
        name: r.name || 'Restaurant',
        address: r.address || '',
        city: r.city || '',
        type: TYPE_MAP[r.type] || 'casual',
        status: 'active',
        capacity: parseInt(r.capacity) || 0,
        opening_date: r.opening_date || '',
      });
    }

    setDone(true);
    setTimeout(() => { if (onClose) onClose(); }, 2500);
  };

  if (done) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center px-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Bienvenue sur Oplo.ai, {data.group_name} !</h2>
          <p className="text-gray-500">Votre dashboard personnalisé est en cours de préparation...</p>
          <div className="mt-6 flex justify-center gap-1">
            {[0, 1, 2].map(i => (
              <motion.div key={i} animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  const stepProps = {
    data, onChange: update,
    onNext: () => setStep(s => Math.min(s + 1, 6)),
    onBack: () => setStep(s => Math.max(s - 1, 1)),
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-white flex flex-col"
      style={{ '--foreground': '0 0% 8%', '--background': '0 0% 98%', '--input': '0 0% 95%', '--muted-foreground': '0 0% 45%', '--border': '0 0% 85%', color: 'hsl(0 0% 8%)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 200 200" fill="none">
            <rect x="20" y="40" width="75" height="130" rx="18" transform="rotate(-20 60 105)" fill="#7B8CFF"/>
            <rect x="90" y="30" width="75" height="130" rx="18" transform="rotate(20 127 95)" fill="#9EAFFF"/>
          </svg>
          <span className="text-lg font-bold text-gray-900">Oplo.ai</span>
        </div>
        <span className="text-sm text-gray-400">Configuration de votre espace · Étape {step}/{STEPS.length}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 flex-shrink-0">
        <motion.div className="h-1.5 bg-blue-600" animate={{ width: `${(step / 6) * 100}%` }} transition={{ duration: 0.4 }} />
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Steps sidebar — desktop */}
        <div className="hidden lg:flex w-72 bg-gray-50 border-r border-gray-200 flex-col p-8 flex-shrink-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Étapes de configuration</p>
          <div className="space-y-4">
            {STEPS.map(s => (
              <div key={s.id} className={`flex items-center gap-3 transition-opacity ${step >= s.id ? 'opacity-100' : 'opacity-35'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition
                  ${step > s.id ? 'bg-green-500 text-white' : step === s.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step > s.id ? '✓' : s.id}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${step === s.id ? 'text-blue-600' : 'text-gray-700'}`}>{s.emoji} {s.title}</p>
                  <p className="text-xs text-gray-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
            >
              {step === 1 && <StepGroup {...stepProps} />}
              {step === 2 && <StepRestaurants {...stepProps} />}
              {step === 3 && <StepOperations {...stepProps} />}
              {step === 4 && <StepTechStack {...stepProps} />}
              {step === 5 && <StepObjectives {...stepProps} />}
              {step === 6 && <StepCOMPAST {...stepProps} onComplete={handleComplete} saving={saving} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}