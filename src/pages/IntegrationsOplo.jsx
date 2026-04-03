import React from 'react';
import { Settings, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const integrations = [
  { name: 'TeamHub', description: 'Gestion d\'équipe et planning', icon: '👥' },
  { name: 'Nuvo', description: 'Import et gestion de données', icon: '📊' },
  { name: 'LiveFlow', description: 'Reporting financier en temps réel', icon: '💰' },
  { name: 'StaffFlow Kitchen', description: 'Gestion de la cuisine', icon: '👨‍🍳' },
  { name: 'Prepwise Inventory', description: 'Gestion des stocks', icon: '📦' },
  { name: 'Queue Master', description: 'Gestion de la file d\'attente', icon: '⏳' },
];

export default function IntegrationsOplo() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-blue-100 border border-blue-300">
          <Settings className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Intégrations Oplo</h1>
          <p className="text-gray-500">Applications connectées pour votre restaurant</p>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="rounded-xl bg-white border border-gray-200 p-6 hover:border-blue-300 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{integration.icon}</div>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-900">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{integration.name}</h3>
            <p className="text-sm text-gray-500">{integration.description}</p>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="inline-flex items-center gap-2 text-xs text-emerald-600">
                <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                Connecté
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}