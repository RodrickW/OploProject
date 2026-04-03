import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  Plus,
  Search,
  User,
  Calendar,
  TrendingUp,
  Wrench,
  Scale,
  Euro,
  Users as UsersIcon,
  DoorOpen,
  FileText,
  Zap,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const categoryConfig = {
  customer: { label: 'Clients', icon: UsersIcon, color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  operations: { label: 'Opérations', icon: Wrench, color: 'bg-blue-100 text-blue-700 border-blue-300' },
  team: { label: 'Équipe', icon: User, color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  market: { label: 'Juridique', icon: Scale, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  product: { label: 'Fiscal', icon: Euro, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  alignment: { label: 'Accueil', icon: DoorOpen, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  sales: { label: 'Travaux', icon: Wrench, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' }
};

const priorityConfig = {
  critical: { label: 'Critique', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: AlertTriangle },
  high: { label: 'Haute', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: TrendingUp },
  medium: { label: 'Moyenne', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Target },
  low: { label: 'Basse', color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30', icon: FileText }
};

const statusConfig = {
  identified: { label: 'Identifié', color: 'bg-red-500/20 text-red-400', icon: AlertTriangle },
  analyzing: { label: 'En analyse', color: 'bg-amber-500/20 text-amber-400', icon: Eye },
  solving: { label: 'En résolution', color: 'bg-cyan-500/20 text-cyan-400', icon: Wrench },
  resolved: { label: 'Résolu', color: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle2 }
};

export default function ProblemManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const { data: problems = [], isLoading } = useQuery({
    queryKey: ['problems', currentUser?.email],
    queryFn: () => base44.entities.Problem.filter({ created_by: currentUser.email }, '-created_date'),
    enabled: !!currentUser?.email
  });

  const { data: restaurants = [] } = useQuery({
    queryKey: ['restaurants', currentUser?.email],
    queryFn: () => base44.entities.Restaurant.filter({ created_by: currentUser.email }),
    enabled: !!currentUser?.email
  });

  const updateProblemMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Problem.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['problems']);
      setSelectedProblem(null);
    }
  });

  const createProblemMutation = useMutation({
    mutationFn: (data) => base44.entities.Problem.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['problems']);
      setShowCreateModal(false);
    }
  });

  // Filter problems
  const filteredProblems = problems.filter(problem => {
    const matchesSearch = !searchQuery || 
      problem.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || problem.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || problem.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || problem.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  // Stats
  const stats = {
    total: problems.length,
    critical: problems.filter(p => p.priority === 'critical' && p.status !== 'resolved').length,
    inProgress: problems.filter(p => ['analyzing', 'solving'].includes(p.status)).length,
    resolved: problems.filter(p => p.status === 'resolved').length
  };

  const ProblemCard = ({ problem }) => {
    const priority = priorityConfig[problem.priority] || priorityConfig.medium;
    const status = statusConfig[problem.status] || statusConfig.identified;
    const category = categoryConfig[problem.category];
    const restaurant = restaurants.find(r => r.id === problem.restaurant_id);
    const PriorityIcon = priority.icon;
    const StatusIcon = status.icon;
    const CategoryIcon = category?.icon || FileText;

    const daysOpen = Math.floor((Date.now() - new Date(problem.created_date).getTime()) / (1000 * 60 * 60 * 24));

    return (
      <div
        onClick={() => setSelectedProblem(problem)}
        className={cn(
          "rounded-xl border p-4 cursor-pointer transition-all hover:scale-[1.01]",
          "bg-white border-gray-200 hover:border-blue-500"
        )}
      >
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-lg shrink-0", priority.color.split(' ')[0])}>
            <PriorityIcon className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-semibold text-gray-900 leading-tight">
                {problem.title}
              </h4>
              <StatusIcon className={cn("w-5 h-5 shrink-0", status.color.split(' ')[1])} />
            </div>

            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {problem.description}
            </p>

            <div className="flex items-center gap-2 flex-wrap mb-3">
              <Badge className={cn("text-xs border", priority.color)}>
                {priority.label}
              </Badge>
              <Badge className={cn("text-xs", status.color)}>
                {status.label}
              </Badge>
              {category && (
                <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                  <CategoryIcon className="w-3 h-3 mr-1" />
                  {category.label}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-gray-600">
                {restaurant && (
                  <span className="flex items-center gap-1">
                    <DoorOpen className="w-3 h-3" />
                    {restaurant.name}
                  </span>
                )}
                {problem.assigned_to && (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {problem.assigned_to}
                  </span>
                )}
              </div>
              <span className={cn(
                "flex items-center gap-1",
                daysOpen > 14 ? "text-red-600" : daysOpen > 7 ? "text-amber-600" : "text-gray-600"
              )}>
                <Clock className="w-3 h-3" />
                {daysOpen}j
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProblemDetailModal = ({ problem }) => {
    if (!problem) return null;

    const [editedProblem, setEditedProblem] = useState(problem);
    const priority = priorityConfig[problem.priority] || priorityConfig.medium;
    const status = statusConfig[problem.status] || statusConfig.identified;
    const category = categoryConfig[problem.category];
    const restaurant = restaurants.find(r => r.id === problem.restaurant_id);

    const handleSave = () => {
      updateProblemMutation.mutate({
        id: problem.id,
        data: editedProblem
      });
    };

    return (
      <Dialog open={!!problem} onOpenChange={() => setSelectedProblem(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", priority.color.split(' ')[0])}>
                {category && <category.icon className="w-5 h-5" />}
              </div>
              <span className="text-white">{problem.title}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Status Quick Actions */}
            <div className="flex gap-2">
              {Object.entries(statusConfig).map(([key, config]) => (
                <Button
                  key={key}
                  size="sm"
                  variant={editedProblem.status === key ? "default" : "outline"}
                  onClick={() => setEditedProblem({ ...editedProblem, status: key })}
                  className={cn(
                    editedProblem.status === key && config.color
                  )}
                >
                  <config.icon className="w-3 h-3 mr-1" />
                  {config.label}
                </Button>
              ))}
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-zinc-500">Priorité</Label>
                <Select
                  value={editedProblem.priority}
                  onValueChange={(value) => setEditedProblem({ ...editedProblem, priority: value })}
                >
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-zinc-500">Catégorie</Label>
                <Select
                  value={editedProblem.category}
                  onValueChange={(value) => setEditedProblem({ ...editedProblem, category: value })}
                >
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label className="text-xs text-zinc-500">Description</Label>
              <Textarea
                value={editedProblem.description || ''}
                onChange={(e) => setEditedProblem({ ...editedProblem, description: e.target.value })}
                className="bg-zinc-800/50 border-zinc-700 min-h-24"
              />
            </div>

            {/* Impact & Solution */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-zinc-500">Impact</Label>
                <Textarea
                  value={editedProblem.impact || ''}
                  onChange={(e) => setEditedProblem({ ...editedProblem, impact: e.target.value })}
                  placeholder="Quel est l'impact?"
                  className="bg-zinc-800/50 border-zinc-700"
                />
              </div>
              <div>
                <Label className="text-xs text-zinc-500">Solution proposée</Label>
                <Textarea
                  value={editedProblem.solution || ''}
                  onChange={(e) => setEditedProblem({ ...editedProblem, solution: e.target.value })}
                  placeholder="Comment résoudre?"
                  className="bg-zinc-800/50 border-zinc-700"
                />
              </div>
            </div>

            {/* Assignment */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-zinc-500">Assigné à</Label>
                <Input
                  value={editedProblem.assigned_to || ''}
                  onChange={(e) => setEditedProblem({ ...editedProblem, assigned_to: e.target.value })}
                  placeholder="Nom"
                  className="bg-zinc-800/50 border-zinc-700"
                />
              </div>
              <div>
                <Label className="text-xs text-zinc-500">Date limite</Label>
                <Input
                  type="date"
                  value={editedProblem.due_date || ''}
                  onChange={(e) => setEditedProblem({ ...editedProblem, due_date: e.target.value })}
                  className="bg-zinc-800/50 border-zinc-700"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
              <Button variant="outline" onClick={() => setSelectedProblem(null)}>
                Annuler
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={updateProblemMutation.isPending}
              >
                {updateProblemMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const CreateProblemModal = () => {
    const [newProblem, setNewProblem] = useState({
      title: '',
      description: '',
      category: 'operations',
      priority: 'medium',
      status: 'identified'
    });

    const handleCreate = () => {
      createProblemMutation.mutate(newProblem);
    };

    return (
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Nouveau problème</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-xs text-zinc-500">Titre</Label>
              <Input
                value={newProblem.title}
                onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                placeholder="Titre du problème"
                className="bg-zinc-800/50 border-zinc-700"
              />
            </div>

            <div>
              <Label className="text-xs text-zinc-500">Description</Label>
              <Textarea
                value={newProblem.description}
                onChange={(e) => setNewProblem({ ...newProblem, description: e.target.value })}
                placeholder="Décrivez le problème..."
                className="bg-zinc-800/50 border-zinc-700 min-h-24"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-zinc-500">Catégorie</Label>
                <Select
                  value={newProblem.category}
                  onValueChange={(value) => setNewProblem({ ...newProblem, category: value })}
                >
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
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
                <Label className="text-xs text-zinc-500">Priorité</Label>
                <Select
                  value={newProblem.priority}
                  onValueChange={(value) => setNewProblem({ ...newProblem, priority: value })}
                >
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs text-zinc-500">Restaurant</Label>
              <Select
                value={newProblem.restaurant_id || ''}
                onValueChange={(value) => setNewProblem({ ...newProblem, restaurant_id: value })}
              >
                <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {restaurants.map(r => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!newProblem.title || createProblemMutation.isPending}
              >
                Créer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-gray-600">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-red-600" />
            <span className="text-xs text-red-700">Critiques</span>
          </div>
          <p className="text-2xl font-bold text-red-700">{stats.critical}</p>
        </div>

        <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="w-4 h-4 text-cyan-600" />
            <span className="text-xs text-cyan-700">En cours</span>
          </div>
          <p className="text-2xl font-bold text-cyan-700">{stats.inProgress}</p>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs text-emerald-700">Résolus</span>
          </div>
          <p className="text-2xl font-bold text-emerald-700">{stats.resolved}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Rechercher un problème..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white border-gray-200"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="lg:w-40 bg-white border-gray-200">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>{config.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="lg:w-40 bg-white border-gray-200">
            <SelectValue placeholder="Priorité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {Object.entries(priorityConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>{config.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="lg:w-40 bg-white border-gray-200">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {Object.entries(statusConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>{config.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau
        </Button>
      </div>

      {/* Problem List */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Aucun problème trouvé</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProblems.map(problem => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      )}

      {/* Modals */}
      {selectedProblem && <ProblemDetailModal problem={selectedProblem} />}
      <CreateProblemModal />
    </div>
  );
}