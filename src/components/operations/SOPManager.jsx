import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { FileText, Clock, User, ChevronRight, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const categoryConfig = {
  opening: { label: 'Ouverture', color: 'bg-blue-500/20 text-blue-400' },
  closing: { label: 'Fermeture', color: 'bg-indigo-500/20 text-indigo-400' },
  ordering: { label: 'Commandes', color: 'bg-blue-100 text-blue-700' },
  rush: { label: 'Gestion rush', color: 'bg-orange-500/20 text-orange-400' },
  complaints: { label: 'Réclamations', color: 'bg-red-500/20 text-red-400' },
  inventory: { label: 'Inventaire', color: 'bg-emerald-500/20 text-emerald-400' },
  onboarding: { label: 'Onboarding', color: 'bg-cyan-500/20 text-cyan-400' },
  hygiene: { label: 'Hygiène', color: 'bg-amber-500/20 text-amber-400' }
};

const frequencyConfig = {
  daily: { label: 'Quotidien', icon: '📅' },
  weekly: { label: 'Hebdomadaire', icon: '📆' },
  monthly: { label: 'Mensuel', icon: '🗓️' },
  as_needed: { label: 'À la demande', icon: '🔔' }
};

export default function SOPManager() {
  const [selectedSOP, setSelectedSOP] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newSOP, setNewSOP] = useState({
    title: '',
    description: '',
    category: 'opening',
    frequency: 'daily',
    estimated_time: '',
    responsible_role: '',
    steps: ['']
  });

  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const { data: sops = [] } = useQuery({
    queryKey: ['sops', currentUser?.email],
    queryFn: () => base44.entities.SOP.filter({ created_by: currentUser.email }),
    enabled: !!currentUser?.email
  });

  const createSOPMutation = useMutation({
    mutationFn: (sopData) => base44.entities.SOP.create(sopData),
    onSuccess: () => {
      queryClient.invalidateQueries(['sops']);
      setShowCreateDialog(false);
      setNewSOP({
        title: '',
        description: '',
        category: 'opening',
        frequency: 'daily',
        estimated_time: '',
        responsible_role: '',
        steps: ['']
      });
    }
  });

  const handleCreateSOP = () => {
    const sopData = {
      ...newSOP,
      steps: newSOP.steps.filter(s => s.trim() !== ''),
      estimated_time: newSOP.estimated_time ? parseInt(newSOP.estimated_time) : null
    };
    createSOPMutation.mutate(sopData);
  };

  const addStep = () => {
    setNewSOP({ ...newSOP, steps: [...newSOP.steps, ''] });
  };

  const updateStep = (index, value) => {
    const updatedSteps = [...newSOP.steps];
    updatedSteps[index] = value;
    setNewSOP({ ...newSOP, steps: updatedSteps });
  };

  const removeStep = (index) => {
    const updatedSteps = newSOP.steps.filter((_, i) => i !== index);
    setNewSOP({ ...newSOP, steps: updatedSteps });
  };

  const filteredSOPs = filterCategory === 'all' 
    ? sops 
    : sops.filter(s => s.category === filterCategory);

  const SOPCard = ({ sop }) => {
    const category = categoryConfig[sop.category] || categoryConfig.opening;
    const frequency = frequencyConfig[sop.frequency] || frequencyConfig.as_needed;

    return (
      <div
        onClick={() => setSelectedSOP(sop)}
        className="p-4 rounded-xl bg-white border border-gray-200 hover:border-blue-500 cursor-pointer transition-all group"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {sop.title}
            </h4>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{sop.description}</p>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={category.color}>{category.label}</Badge>
          <Badge variant="outline" className="border-gray-300 text-gray-700">
            {frequency.icon} {frequency.label}
          </Badge>
          {sop.estimated_time && (
            <Badge variant="outline" className="border-gray-300 text-gray-700">
              <Clock className="w-3 h-3 mr-1" />
              {sop.estimated_time}min
            </Badge>
          )}
        </div>
      </div>
    );
  };

  const SOPDetailModal = ({ sop }) => {
    if (!sop) return null;

    const category = categoryConfig[sop.category];
    const frequency = frequencyConfig[sop.frequency];

    return (
      <Dialog open={!!sop} onOpenChange={() => setSelectedSOP(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <span className="text-white">{sop.title}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="flex flex-wrap gap-2">
              <Badge className={category.color}>{category.label}</Badge>
              <Badge variant="outline" className="border-zinc-700">
                {frequency.icon} {frequency.label}
              </Badge>
              {sop.estimated_time && (
                <Badge variant="outline" className="border-zinc-700">
                  <Clock className="w-3 h-3 mr-1" />
                  {sop.estimated_time} minutes
                </Badge>
              )}
            </div>

            {sop.description && (
              <div className="p-4 rounded-lg bg-zinc-800/30">
                <p className="text-sm text-zinc-300">{sop.description}</p>
              </div>
            )}

            {sop.responsible_role && (
              <div className="p-4 rounded-lg bg-blue-100 border border-blue-300">
                <p className="text-xs font-semibold text-blue-700 mb-1">👤 Responsable</p>
                <p className="text-sm text-white">{sop.responsible_role}</p>
              </div>
            )}

            {sop.steps && sop.steps.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">📋 Étapes à suivre</h4>
                <div className="space-y-2">
                  {sop.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/30">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                        {i + 1}
                      </div>
                      <p className="text-sm text-zinc-300 pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const categoryStats = Object.keys(categoryConfig).reduce((acc, cat) => {
    acc[cat] = sops.filter(s => s.category === cat).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Procédures standardisées</h3>
          <p className="text-sm text-gray-600">
            Tout ce qui se répète doit être documenté. Sans ça, le dashboard ment.
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle SOP
        </Button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterCategory('all')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            filterCategory === 'all' 
              ? "bg-blue-600 text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          Tous ({sops.length})
        </button>
        {Object.entries(categoryConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setFilterCategory(key)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              filterCategory === key
                ? cn("border", config.color)
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {config.label} ({categoryStats[key] || 0})
          </button>
        ))}
      </div>

      {/* SOPs Grid */}
      {filteredSOPs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Aucune procédure dans cette catégorie</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredSOPs.map(sop => (
            <SOPCard key={sop.id} sop={sop} />
          ))}
        </div>
      )}

      {selectedSOP && <SOPDetailModal sop={selectedSOP} />}

      {/* Create SOP Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Créer une nouvelle SOP
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Titre *</label>
              <Input
                value={newSOP.title}
                onChange={(e) => setNewSOP({ ...newSOP, title: e.target.value })}
                placeholder="Ex: Procédure d'ouverture du matin"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
              <Textarea
                value={newSOP.description}
                onChange={(e) => setNewSOP({ ...newSOP, description: e.target.value })}
                placeholder="Description détaillée de la procédure"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Catégorie *</label>
                <Select value={newSOP.category} onValueChange={(value) => setNewSOP({ ...newSOP, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Fréquence *</label>
                <Select value={newSOP.frequency} onValueChange={(value) => setNewSOP({ ...newSOP, frequency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(frequencyConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.icon} {config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Temps estimé (minutes)</label>
                <Input
                  type="number"
                  value={newSOP.estimated_time}
                  onChange={(e) => setNewSOP({ ...newSOP, estimated_time: e.target.value })}
                  placeholder="Ex: 15"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Responsable</label>
                <Input
                  value={newSOP.responsible_role}
                  onChange={(e) => setNewSOP({ ...newSOP, responsible_role: e.target.value })}
                  placeholder="Ex: Manager de service"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Étapes</label>
              <div className="space-y-2">
                {newSOP.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-600 mt-2">
                      {index + 1}
                    </div>
                    <Input
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      placeholder={`Étape ${index + 1}`}
                      className="flex-1"
                    />
                    {newSOP.steps.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(index)}
                        className="flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={addStep}
                className="mt-2 w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une étape
              </Button>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleCreateSOP}
                disabled={!newSOP.title || createSOPMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createSOPMutation.isPending ? 'Création...' : 'Créer la SOP'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}