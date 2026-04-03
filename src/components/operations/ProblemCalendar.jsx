import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Calendar as CalendarIcon, 
  User, 
  AlertTriangle,
  Clock,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format, startOfWeek, addDays, isSameDay, parseISO, isPast, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

const priorityConfig = {
  critical: { color: 'bg-red-500 border-red-600', textColor: 'text-red-400' },
  high: { color: 'bg-orange-500 border-orange-600', textColor: 'text-orange-400' },
  medium: { color: 'bg-amber-500 border-amber-600', textColor: 'text-amber-400' },
  low: { color: 'bg-blue-500 border-blue-600', textColor: 'text-blue-400' }
};

export default function ProblemCalendar() {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [selectedProblem, setSelectedProblem] = useState(null);
  const queryClient = useQueryClient();

  const { data: problems = [] } = useQuery({
    queryKey: ['problems'],
    queryFn: () => base44.entities.Problem.list()
  });

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['team-members'],
    queryFn: () => base44.entities.TeamMember.list()
  });

  const assignMutation = useMutation({
    mutationFn: ({ problemId, memberId }) => 
      base44.entities.Problem.update(problemId, { assigned_to: memberId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['problems']);
      setSelectedProblem(null);
    }
  });

  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getProblemsForDay = (day) => {
    return problems.filter(p => {
      if (!p.due_date) return false;
      return isSameDay(parseISO(p.due_date), day);
    });
  };

  const getUrgencyLevel = (dueDate) => {
    if (!dueDate) return 'none';
    const days = differenceInDays(parseISO(dueDate), new Date());
    if (days < 0) return 'overdue';
    if (days === 0) return 'today';
    if (days <= 3) return 'urgent';
    return 'normal';
  };

  const urgencyColors = {
    overdue: 'bg-red-500/20 border-red-500 text-red-400',
    today: 'bg-orange-500/20 border-orange-500 text-orange-400',
    urgent: 'bg-amber-500/20 border-amber-500 text-amber-400',
    normal: 'bg-zinc-800 border-zinc-700 text-zinc-300'
  };

  const ProblemCard = ({ problem, compact = false }) => {
    const urgency = getUrgencyLevel(problem.due_date);
    const assignedMember = teamMembers.find(m => m.id === problem.assigned_to);
    
    return (
      <div
        onClick={() => setSelectedProblem(problem)}
        className={cn(
          "p-2 rounded-lg border cursor-pointer hover:opacity-80 transition-all",
          urgencyColors[urgency],
          compact && "text-xs"
        )}
      >
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className={cn("font-medium line-clamp-1", compact ? "text-xs" : "text-sm")}>
            {problem.title}
          </span>
          <div className={cn("w-2 h-2 rounded-full flex-shrink-0", priorityConfig[problem.priority].color)} />
        </div>
        {assignedMember ? (
          <div className="flex items-center gap-1 mt-1">
            <User className="w-3 h-3" />
            <span className="text-xs opacity-70">{assignedMember.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 mt-1 text-zinc-500">
            <User className="w-3 h-3" />
            <span className="text-xs">Non assigné</span>
          </div>
        )}
      </div>
    );
  };

  const AssignModal = ({ problem }) => {
    const [selectedMember, setSelectedMember] = useState(problem?.assigned_to || '');
    
    if (!problem) return null;

    const handleAssign = () => {
      assignMutation.mutate({
        problemId: problem.id,
        memberId: selectedMember
      });
    };

    const urgency = getUrgencyLevel(problem.due_date);
    const isOverdue = urgency === 'overdue';
    const daysLeft = problem.due_date ? differenceInDays(parseISO(problem.due_date), new Date()) : null;

    return (
      <Dialog open={!!problem} onOpenChange={() => setSelectedProblem(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">{problem.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Urgency Alert */}
            {isOverdue && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-400">Problème en retard !</p>
                  <p className="text-sm text-zinc-300 mt-1">
                    Ce problème devait être résolu il y a {Math.abs(daysLeft)} jour(s). 
                    Résolution urgente nécessaire.
                  </p>
                </div>
              </div>
            )}

            {urgency === 'today' && (
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-orange-400">À résoudre aujourd'hui</p>
                  <p className="text-sm text-zinc-300 mt-1">
                    Ce problème doit être résolu avant la fin de la journée.
                  </p>
                </div>
              </div>
            )}

            {/* Problem Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-zinc-800/50">
                <p className="text-xs text-zinc-500 mb-1">Priorité</p>
                <Badge className={priorityConfig[problem.priority].color}>
                  {problem.priority}
                </Badge>
              </div>
              <div className="p-3 rounded-lg bg-zinc-800/50">
                <p className="text-xs text-zinc-500 mb-1">Catégorie</p>
                <p className="text-sm text-white capitalize">{problem.category}</p>
              </div>
            </div>

            {/* Description & Impact */}
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-zinc-800/30">
                <p className="text-xs font-semibold text-zinc-400 mb-2">Description</p>
                <p className="text-sm text-zinc-300">{problem.description || 'Aucune description'}</p>
              </div>

              {problem.impact && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Impact si non résolu
                  </p>
                  <p className="text-sm text-zinc-300">{problem.impact}</p>
                </div>
              )}
            </div>

            {/* Assign Team Member */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Assigner à un membre de l'équipe</label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Sélectionner un membre" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {teamMembers.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <span>{member.name}</span>
                        <span className="text-xs text-zinc-500">• {member.role}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleAssign}
              disabled={!selectedMember}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Assigner et confirmer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const overdueProblems = problems.filter(p => p.due_date && getUrgencyLevel(p.due_date) === 'overdue');
  const todayProblems = problems.filter(p => p.due_date && getUrgencyLevel(p.due_date) === 'today');
  const urgentProblems = problems.filter(p => p.due_date && getUrgencyLevel(p.due_date) === 'urgent');

  return (
    <div className="space-y-6">
      {/* Urgency Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <AlertTriangle className="w-5 h-5 text-red-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{overdueProblems.length}</p>
          <p className="text-sm text-red-700">En retard</p>
        </div>
        <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
          <Clock className="w-5 h-5 text-orange-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{todayProblems.length}</p>
          <p className="text-sm text-orange-700">Aujourd'hui</p>
        </div>
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
          <TrendingUp className="w-5 h-5 text-amber-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{urgentProblems.length}</p>
          <p className="text-sm text-amber-700">Urgent (3 jours)</p>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Calendrier de résolution
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedWeek(addDays(selectedWeek, -7))}
            className="border-zinc-700"
          >
            ←
          </Button>
          <span className="text-sm text-gray-600 min-w-[140px] text-center">
            {format(weekStart, 'dd MMM', { locale: fr })} - {format(addDays(weekStart, 6), 'dd MMM yyyy', { locale: fr })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedWeek(addDays(selectedWeek, 7))}
            className="border-zinc-700"
          >
            →
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedWeek(new Date())}
            className="border-zinc-700"
          >
            Aujourd'hui
          </Button>
        </div>
      </div>

      {/* Week Calendar */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, i) => {
          const dayProblems = getProblemsForDay(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={i}
              className={cn(
                "rounded-xl border p-3 min-h-[180px]",
                isToday ? "bg-blue-100 border-blue-300" : "bg-white border-gray-200"
              )}
            >
              <div className="text-center mb-3">
                <p className={cn(
                  "text-xs font-semibold uppercase mb-1",
                  isToday ? "text-blue-700" : "text-gray-600"
                )}>
                  {format(day, 'EEE', { locale: fr })}
                </p>
                <p className={cn(
                  "text-xl font-bold",
                  isToday ? "text-blue-700" : "text-gray-900"
                )}>
                  {format(day, 'd')}
                </p>
              </div>

              <div className="space-y-2">
                {dayProblems.length > 0 ? (
                  dayProblems.map(problem => (
                    <ProblemCard key={problem.id} problem={problem} compact />
                  ))
                ) : (
                  <p className="text-xs text-gray-500 text-center py-4">Aucun problème</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedProblem && <AssignModal problem={selectedProblem} />}
    </div>
  );
}