import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/LanguageContext';
import { 
  Settings, 
  ListTodo, 
  AlertCircle, 
  FlaskConical,
  Calendar,
  Bell,
  TrendingUp,
  Clock,
  CheckCircle,
  Circle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ProblemManager from '@/components/operations/ProblemManager';
import ProblemCalendar from '@/components/operations/ProblemCalendar';
import SOPManager from '@/components/operations/SOPManager';
import KPIDashboard from '@/components/operations/KPIDashboard';
import GovernanceRituals from '@/components/operations/GovernanceRituals';

const priorityColors = {
  critical: 'bg-red-100 text-red-700 border-red-300',
  high: 'bg-amber-100 text-amber-700 border-amber-300',
  medium: 'bg-blue-100 text-blue-700 border-blue-300',
  low: 'bg-cyan-100 text-cyan-700 border-cyan-300'
};

const statusIcons = {
  identified: Circle,
  analyzing: Clock,
  solving: TrendingUp,
  resolved: CheckCircle
};

export default function Operations() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [activeTab, setActiveTab] = useState('governance');
  const queryClient = useQueryClient();

  const subPages = [
    { id: 'governance', label: isEn ? 'Reviews' : 'Revues', icon: Calendar },
    { id: 'kpis', label: 'KPIs', icon: TrendingUp },
    { id: 'sops', label: 'SOPs', icon: ListTodo },
    { id: 'problems', label: isEn ? 'Issues' : 'Problèmes', icon: AlertCircle },
  ];

  const { data: problems = [], isLoading } = useQuery({
    queryKey: ['problems'],
    queryFn: () => base44.entities.Problem.list('-created_date')
  });

  const updateProblem = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Problem.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['problems'])
  });

  const stats = {
    openProblems: problems.filter(p => p.status !== 'resolved').length,
    critical: problems.filter(p => p.priority === 'critical' && p.status !== 'resolved').length,
    avgResolutionTime: 4.2,
    efficiency: 87
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-blue-100 border border-blue-300">
          <span className="text-xl font-bold text-blue-600">O</span>
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Restaurant Operating System</h1>
          <p className="text-gray-500">
            {isEn
              ? 'Standardise • Manage • Scale • Delegate without losing control'
              : 'Standardiser • Piloter • Scaler • Déléguer sans perdre le contrôle'}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 border border-gray-200 h-auto flex-wrap gap-1 p-1">
          {subPages.map(page => (
            <TabsTrigger 
              key={page.id} 
              value={page.id}
              className="data-[state=active]:bg-blue-600 gap-2"
            >
              <page.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{page.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span className="text-sm text-gray-500">{isEn ? 'Open issues' : 'Problèmes ouverts'}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.openProblems}</p>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-gray-500">{isEn ? 'Critical' : 'Critiques'}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.critical}</p>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-500">{isEn ? 'Avg. resolution time' : 'Temps résolution moy.'}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.avgResolutionTime}{isEn ? 'd' : 'j'}</p>
            </div>
            
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-gray-500">{isEn ? 'Operational efficiency' : 'Efficacité opé.'}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.efficiency}%</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="kpis" className="mt-6">
          <KPIDashboard />
        </TabsContent>

        <TabsContent value="sops" className="mt-6">
          <SOPManager />
        </TabsContent>

        <TabsContent value="problems" className="mt-6 space-y-6">
          <ProblemManager />
          <ProblemCalendar />
        </TabsContent>

        <TabsContent value="governance" className="mt-6">
          <GovernanceRituals />
        </TabsContent>
      </Tabs>
    </div>
  );
}
