import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Calendar, Clock, Users, FileText, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ritualConfig = {
  daily_ops: { 
    label: 'Daily Ops Review', 
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: '📅',
    description: '15min pour identifier les problèmes immédiats'
  },
  weekly_review: { 
    label: 'Weekly Performance', 
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    icon: '📊',
    description: 'Revue hebdo des KPIs et décisions'
  },
  monthly_deep_dive: { 
    label: 'Monthly Deep Dive', 
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    icon: '🔍',
    description: 'Analyse approfondie mensuelle'
  }
};

export default function GovernanceRituals() {
  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const { data: rituals = [] } = useQuery({
    queryKey: ['operational-rituals', currentUser?.email],
    queryFn: () => base44.entities.OperationalRitual.filter({ created_by: currentUser.email }),
    enabled: !!currentUser?.email
  });

  const RitualCard = ({ ritual }) => {
    const config = ritualConfig[ritual.type] || ritualConfig.daily_ops;
    const lastSession = ritual.last_session_date 
      ? new Date(ritual.last_session_date).toLocaleDateString('fr-FR')
      : 'Jamais';

    return (
      <div className="p-5 rounded-xl bg-white border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{config.icon}</span>
              <h4 className="font-semibold text-gray-900">{ritual.name}</h4>
            </div>
            <p className="text-xs text-gray-600">{config.description}</p>
          </div>
          <Badge className={cn("border", config.color)}>
            {config.label}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-gray-50">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-xs text-gray-600">Planification</span>
            </div>
            <p className="text-sm text-gray-900 font-medium">{ritual.schedule}</p>
          </div>

          <div className="p-3 rounded-lg bg-gray-50">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-xs text-gray-600">Durée</span>
            </div>
            <p className="text-sm text-gray-900 font-medium">{ritual.duration} min</p>
          </div>
        </div>

        {ritual.participants && ritual.participants.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-semibold text-gray-700">Participants</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ritual.participants.map((p, i) => (
                <Badge key={i} variant="outline" className="border-gray-300 text-gray-700">
                  {p}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {ritual.agenda && ritual.agenda.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-semibold text-gray-700">Agenda</span>
            </div>
            <ul className="space-y-1">
              {ritual.agenda.map((item, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {ritual.last_session_notes && (
          <div className="p-3 rounded-lg bg-blue-100 border border-blue-300">
            <p className="text-xs font-semibold text-blue-700 mb-1">
              📝 Dernière session: {lastSession}
            </p>
            <p className="text-xs text-gray-700">{ritual.last_session_notes}</p>
          </div>
        )}

        {ritual.actions_decided && ritual.actions_decided.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">Actions décidées</span>
            </div>
            <ul className="space-y-1">
              {ritual.actions_decided.map((action, i) => (
                <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                  <span className="text-emerald-600">✓</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Système de gouvernance</h3>
        <p className="text-sm text-gray-600">
          Un bon dashboard sans rituels = inutile. Actions écrites + suivi.
        </p>
      </div>

      <div className="p-5 rounded-xl bg-red-50 border border-red-200">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-gray-900">⚠️ Règle d'or :</span> Chaque KPI doit avoir un propriétaire. 
          Chaque réunion doit produire des actions concrètes avec deadlines.
        </p>
      </div>

      {rituals.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Aucun rituel configuré</p>
          <p className="text-xs mt-2">Configurez vos daily ops, weekly reviews et monthly deep dives</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {rituals.map(ritual => (
            <RitualCard key={ritual.id} ritual={ritual} />
          ))}
        </div>
      )}
    </div>
  );
}