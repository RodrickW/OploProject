import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Building2,
  Star,
  TrendingUp,
  TrendingDown,
  Euro,
  Users,
  MapPin,
  Phone,
  Globe,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  Zap,
  Plus,
  Pencil,
  Trash2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const threatConfig = {
  critical: { label: 'Menace critique', color: 'bg-red-100 text-red-700 border-red-300', icon: AlertTriangle },
  high: { label: 'Menace élevée', color: 'bg-orange-100 text-orange-700 border-orange-300', icon: TrendingUp },
  medium: { label: 'Menace modérée', color: 'bg-amber-100 text-amber-700 border-amber-300', icon: Eye },
  low: { label: 'Menace faible', color: 'bg-emerald-100 text-emerald-700 border-emerald-300', icon: CheckCircle2 }
};

export default function CompetitorAnalysis() {
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCompetitor, setEditingCompetitor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    google_rating: '',
    review_count: '',
    price_range: '€€',
    cuisine_type: '',
    strengths: [],
    weaknesses: [],
    threat_level: 'medium',
    estimated_revenue: '',
    capacity: '',
    specialties: [],
    competitive_advantages: '',
    recent_changes: '',
    website: ''
  });
  const queryClient = useQueryClient();

  const { data: competitors = [], isLoading } = useQuery({
    queryKey: ['competitors'],
    queryFn: () => base44.entities.Competitor.list('-google_rating')
  });

  const updateData = async () => {
    setIsUpdating(true);
    try {
      await base44.functions.invoke('updateCompetitorData', {});
      queryClient.invalidateQueries(['competitors']);
    } catch (error) {
      console.error('Error updating:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const createCompetitorMutation = useMutation({
    mutationFn: (data) => base44.entities.Competitor.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['competitors']);
      setShowEditDialog(false);
      resetForm();
    }
  });

  const updateCompetitorMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Competitor.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['competitors']);
      setShowEditDialog(false);
      setSelectedCompetitor(null);
      resetForm();
    }
  });

  const deleteCompetitorMutation = useMutation({
    mutationFn: (id) => base44.entities.Competitor.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['competitors']);
      setSelectedCompetitor(null);
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      phone: '',
      google_rating: '',
      review_count: '',
      price_range: '€€',
      cuisine_type: '',
      strengths: [],
      weaknesses: [],
      threat_level: 'medium',
      estimated_revenue: '',
      capacity: '',
      specialties: [],
      competitive_advantages: '',
      recent_changes: '',
      website: ''
    });
    setEditingCompetitor(null);
  };

  const openEditDialog = (competitor = null) => {
    if (competitor) {
      setEditingCompetitor(competitor);
      setFormData({
        name: competitor.name || '',
        address: competitor.address || '',
        city: competitor.city || '',
        phone: competitor.phone || '',
        google_rating: competitor.google_rating || '',
        review_count: competitor.review_count || '',
        price_range: competitor.price_range || '€€',
        cuisine_type: competitor.cuisine_type || '',
        strengths: competitor.strengths || [],
        weaknesses: competitor.weaknesses || [],
        threat_level: competitor.threat_level || 'medium',
        estimated_revenue: competitor.estimated_revenue || '',
        capacity: competitor.capacity || '',
        specialties: competitor.specialties || [],
        competitive_advantages: competitor.competitive_advantages || '',
        recent_changes: competitor.recent_changes || '',
        website: competitor.website || ''
      });
    } else {
      resetForm();
    }
    setShowEditDialog(true);
  };

  const handleSave = () => {
    const data = {
      ...formData,
      google_rating: formData.google_rating ? parseFloat(formData.google_rating) : null,
      review_count: formData.review_count ? parseInt(formData.review_count) : null,
      estimated_revenue: formData.estimated_revenue ? parseInt(formData.estimated_revenue) : null,
      capacity: formData.capacity ? parseInt(formData.capacity) : null
    };

    if (editingCompetitor) {
      updateCompetitorMutation.mutate({ id: editingCompetitor.id, data });
    } else {
      createCompetitorMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce concurrent ?')) {
      deleteCompetitorMutation.mutate(id);
    }
  };

  const addArrayItem = (field, value) => {
    if (value.trim()) {
      setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
  };

  const CompetitorCard = ({ competitor }) => {
    const threat = threatConfig[competitor.threat_level] || threatConfig.medium;
    const ThreatIcon = threat.icon;
    const lastUpdate = competitor.last_updated 
      ? new Date(competitor.last_updated).toLocaleDateString('fr-FR')
      : 'Jamais';

    return (
      <div
        onClick={() => setSelectedCompetitor(competitor)}
        className="rounded-xl bg-white border border-gray-200 p-5 hover:border-blue-500 transition-all cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 font-bold text-lg">
              {competitor.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                {competitor.name}
              </h3>
              <p className="text-sm text-gray-600">{competitor.cuisine_type}</p>
              {competitor.city && (
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {competitor.city}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge className={cn("border whitespace-nowrap", threat.color)}>
              <ThreatIcon className="w-3 h-3 mr-1" />
              {threat.label}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 rounded-lg bg-gray-50">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-lg font-bold text-gray-900">{competitor.google_rating || '-'}</span>
            </div>
            <p className="text-xs text-gray-600">{(competitor.review_count || 0).toLocaleString()} avis</p>
          </div>

          <div className="text-center p-3 rounded-lg bg-gray-50">
            <p className="text-lg font-bold text-gray-900">{competitor.price_range || '-'}</p>
            <p className="text-xs text-gray-600">Gamme prix</p>
          </div>

          <div className="text-center p-3 rounded-lg bg-gray-50">
            <p className="text-lg font-bold text-emerald-600">€{Math.floor((competitor.estimated_revenue || 0) / 1000)}k</p>
            <p className="text-xs text-gray-600">CA/mois est.</p>
          </div>
        </div>

        {competitor.competitive_advantages && (
          <div className="p-3 rounded-lg bg-blue-100 border border-blue-300 mb-3">
            <p className="text-xs font-semibold text-blue-700 mb-1">🎯 Leur avantage</p>
            <p className="text-sm text-gray-700 line-clamp-2">{competitor.competitive_advantages}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Mis à jour : {lastUpdate}</span>
          <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </div>
      </div>
    );
  };

  const CompetitorDetailModal = ({ competitor }) => {
    if (!competitor) return null;

    const threat = threatConfig[competitor.threat_level] || threatConfig.medium;

    return (
      <Dialog open={!!competitor} onOpenChange={() => setSelectedCompetitor(null)}>
        <DialogContent className="bg-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 font-bold text-xl">
                  {competitor.name.charAt(0)}
                </div>
                <div>
                  <span className="text-gray-900">{competitor.name}</span>
                  <p className="text-sm text-gray-500 font-normal">{competitor.cuisine_type}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedCompetitor(null);
                    openEditDialog(competitor);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(competitor.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-3">
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-gray-500">Note</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{competitor.google_rating || '-'}</p>
                <p className="text-xs text-gray-500">{(competitor.review_count || 0).toLocaleString()} avis</p>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Euro className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs text-gray-500">CA estimé</span>
                </div>
                <p className="text-2xl font-bold text-emerald-600">€{Math.floor((competitor.estimated_revenue || 0) / 1000)}k</p>
                <p className="text-xs text-gray-500">par mois</p>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-gray-500">Capacité</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{competitor.capacity || '-'}</p>
                <p className="text-xs text-gray-500">couverts</p>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-xs text-gray-500">Menace</span>
                </div>
                <Badge className={cn("border mt-1", threat.color)}>{threat.label}</Badge>
              </div>
            </div>

            {/* Competitive Advantage */}
            {competitor.competitive_advantages && (
              <div className="p-5 rounded-xl bg-blue-50 border border-blue-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  Ce qui les rend meilleurs
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">{competitor.competitive_advantages}</p>
              </div>
            )}

            {/* Strengths & Weaknesses */}
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Points forts
                </h4>
                <div className="space-y-2">
                  {(competitor.strengths || []).length > 0 ? (
                    (competitor.strengths || []).map((strength, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Aucun point fort renseigné</p>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Points faibles
                </h4>
                <div className="space-y-2">
                  {(competitor.weaknesses || []).length > 0 ? (
                    (competitor.weaknesses || []).map((weakness, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>{weakness}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Aucun point faible renseigné</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Changes */}
            {competitor.recent_changes && (
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <h4 className="text-sm font-semibold text-amber-700 mb-2">📢 Changements récents</h4>
                <p className="text-sm text-gray-700">{competitor.recent_changes}</p>
              </div>
            )}

            {/* Specialties */}
            {competitor.specialties && competitor.specialties.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Spécialités</h4>
                <div className="flex flex-wrap gap-2">
                  {competitor.specialties.map((spec, i) => (
                    <Badge key={i} variant="outline" className="border-gray-300 text-gray-700">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="grid lg:grid-cols-3 gap-3">
              {competitor.address && (
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{competitor.address}</span>
                </div>
              )}
              {competitor.phone && (
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{competitor.phone}</span>
                </div>
              )}
              {competitor.website && (
                <a 
                  href={competitor.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-gray-50 border border-gray-200 flex items-center gap-2 hover:bg-gray-100 transition-colors"
                >
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-blue-600">Voir le site</span>
                </a>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const threatDistribution = {
    critical: competitors.filter(c => c.threat_level === 'critical').length,
    high: competitors.filter(c => c.threat_level === 'high').length,
    medium: competitors.filter(c => c.threat_level === 'medium').length,
    low: competitors.filter(c => c.threat_level === 'low').length
  };

  return (
    <div className="space-y-6">
      {/* Header with Action Buttons */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Analyse concurrentielle</h3>
          <p className="text-sm text-gray-600">Ajoutez et gérez vos concurrents</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => openEditDialog()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un concurrent
          </Button>
        </div>
      </div>

      {/* Threat Distribution */}
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(threatConfig).map(([key, config]) => (
          <div key={key} className={cn("p-4 rounded-xl border bg-white", config.color.split('text-')[0])}>
            <config.icon className={cn("w-5 h-5 mb-2", config.color.split(' ')[1])} />
            <p className="text-2xl font-bold text-gray-900">{threatDistribution[key]}</p>
            <p className="text-xs text-gray-600">{config.label}</p>
          </div>
        ))}
      </div>

      {/* Competitors Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : competitors.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Aucun concurrent enregistré</p>
          <Button onClick={updateData} className="mt-4 bg-blue-600 hover:bg-blue-700">
            Lancer l'analyse
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {competitors.map(competitor => (
            <CompetitorCard key={competitor.id} competitor={competitor} />
          ))}
        </div>
      )}

      {selectedCompetitor && <CompetitorDetailModal competitor={selectedCompetitor} />}

      {/* Edit/Create Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCompetitor ? 'Modifier le concurrent' : 'Ajouter un concurrent'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nom *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Le Bistrot Parisien"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Type de cuisine</label>
                <Input
                  value={formData.cuisine_type}
                  onChange={(e) => setFormData({ ...formData, cuisine_type: e.target.value })}
                  placeholder="Française, Italienne..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Ville</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Paris"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Adresse</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 rue de Rivoli"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Note Google</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.google_rating}
                  onChange={(e) => setFormData({ ...formData, google_rating: e.target.value })}
                  placeholder="4.5"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nb d'avis</label>
                <Input
                  type="number"
                  value={formData.review_count}
                  onChange={(e) => setFormData({ ...formData, review_count: e.target.value })}
                  placeholder="250"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Gamme de prix</label>
                <Select value={formData.price_range} onValueChange={(value) => setFormData({ ...formData, price_range: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="€">€</SelectItem>
                    <SelectItem value="€€">€€</SelectItem>
                    <SelectItem value="€€€">€€€</SelectItem>
                    <SelectItem value="€€€€">€€€€</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">CA estimé (€/mois)</label>
                <Input
                  type="number"
                  value={formData.estimated_revenue}
                  onChange={(e) => setFormData({ ...formData, estimated_revenue: e.target.value })}
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Capacité (couverts)</label>
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="80"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Niveau de menace</label>
                <Select value={formData.threat_level} onValueChange={(value) => setFormData({ ...formData, threat_level: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Modérée</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                    <SelectItem value="critical">Critique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Ce qui les rend meilleurs</label>
              <Textarea
                value={formData.competitive_advantages}
                onChange={(e) => setFormData({ ...formData, competitive_advantages: e.target.value })}
                placeholder="Leurs avantages concurrentiels..."
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Changements récents</label>
              <Textarea
                value={formData.recent_changes}
                onChange={(e) => setFormData({ ...formData, recent_changes: e.target.value })}
                placeholder="Nouveautés, changements observés..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Téléphone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Site web</label>
                <Input
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!formData.name || createCompetitorMutation.isPending || updateCompetitorMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {editingCompetitor ? 'Enregistrer' : 'Ajouter'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}