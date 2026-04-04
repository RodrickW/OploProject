import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/LanguageContext';
import { 
  User, 
  Trophy, 
  Star, 
  Target, 
  TrendingUp,
  Award,
  Zap,
  Crown,
  Medal,
  Flame,
  Edit2,
  Camera,
  LogOut,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

export default function Profile() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const achievements = [
    { id: 1, name: isEn ? 'First step' : 'Premier pas', description: isEn ? 'Create your first restaurant' : 'Créer votre premier restaurant', icon: Star, unlocked: true, color: 'text-amber-400' },
    { id: 2, name: 'Data Master', description: isEn ? 'Analyse 100 insights' : 'Analyser 100 insights', icon: Zap, unlocked: true, color: 'text-cyan-400' },
    { id: 3, name: isEn ? 'Strategist' : 'Stratège', description: isEn ? 'Reach 5 goals' : 'Atteindre 5 objectifs', icon: Target, unlocked: true, color: 'text-emerald-400' },
    { id: 4, name: 'Leader', description: isEn ? 'Manage a team of 20+' : 'Gérer une équipe de 20+', icon: Crown, unlocked: false, color: 'text-violet-400' },
    { id: 5, name: 'Oplo Expert', description: isEn ? '100 conversations with Oplo.ai' : '100 conversations avec Oplo.ai', icon: Medal, unlocked: false, color: 'text-pink-400' },
    { id: 6, name: isEn ? 'On fire!' : 'En feu !', description: isEn ? '30 consecutive days of use' : '30 jours consécutifs d\'utilisation', icon: Flame, unlocked: false, color: 'text-orange-400' },
  ];

  const activities = [
    { action: isEn ? 'Insight resolved' : 'Insight résolu', detail: isEn ? 'Menu optimisation' : 'Optimisation du menu', time: isEn ? '2h ago' : 'Il y a 2h', icon: Zap },
    { action: isEn ? 'Goal reached' : 'Objectif atteint', detail: isEn ? 'Monthly revenue +15%' : 'CA mensuel +15%', time: isEn ? 'Yesterday' : 'Hier', icon: Target },
    { action: isEn ? 'Oplo.ai conversation' : 'Conversation Oplo.ai', detail: isEn ? 'Expansion strategy' : 'Stratégie expansion', time: isEn ? '2 days ago' : 'Il y a 2j', icon: Star },
  ];

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  const stats = {
    level: 12,
    xp: 2450,
    nextLevelXp: 3000,
    totalInsights: 156,
    goalsAchieved: 8,
    daysActive: 45
  };

  const handleLogout = () => {
    base44.auth.logout('/home');
  };

  const handleDeleteAccount = async () => {
    try {
      await base44.auth.updateMe({ deleted_at: new Date().toISOString() });
      base44.auth.logout('/home');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{isEn ? 'My Profile' : 'Mon Profil'}</h1>
          <p className="text-gray-500 mt-1">{isEn ? 'Manage your account and rewards' : 'Gérez votre compte et vos récompenses'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" /> {isEn ? 'Log out' : 'Déconnexion'}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" /> {isEn ? 'Delete' : 'Supprimer'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{isEn ? 'Delete my account' : 'Supprimer mon compte'}</AlertDialogTitle>
                <AlertDialogDescription>
                  {isEn
                    ? 'This action is irreversible. Your account and all your data will be permanently deleted.'
                    : 'Cette action est irréversible. Votre compte et toutes vos données seront supprimées définitivement.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex gap-3 justify-end">
                <AlertDialogCancel>{isEn ? 'Cancel' : 'Annuler'}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                  {isEn ? 'Delete my account' : 'Supprimer mon compte'}
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <Avatar className="h-24 w-24 border-4 border-blue-300">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-2xl">
                    {user?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900">{user?.full_name || (isEn ? 'User' : 'Utilisateur')}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              
              <div className="mt-4 flex justify-center gap-2">
                <Badge className="bg-blue-100 text-blue-700">
                  <Crown className="w-3 h-3 mr-1" /> {isEn ? 'Level' : 'Niveau'} {stats.level}
                </Badge>
                <Badge className="bg-amber-500/20 text-amber-400">
                  <Trophy className="w-3 h-3 mr-1" /> {achievements.filter(a => a.unlocked).length} {isEn ? 'Trophies' : 'Trophées'}
                </Badge>
              </div>
            </div>

            {/* Level Progress */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">{isEn ? 'Experience' : 'Expérience'}</span>
                <span className="text-gray-900">{stats.xp} / {stats.nextLevelXp} XP</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all"
                  style={{ width: `${(stats.xp / stats.nextLevelXp) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {stats.nextLevelXp - stats.xp} XP {isEn ? `until level ${stats.level + 1}` : `jusqu'au niveau ${stats.level + 1}`}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg bg-gray-50">
                <p className="text-lg font-bold text-gray-900">{stats.totalInsights}</p>
                <p className="text-xs text-gray-500">Insights</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-gray-50">
                <p className="text-lg font-bold text-gray-900">{stats.goalsAchieved}</p>
                <p className="text-xs text-gray-500">{isEn ? 'Goals' : 'Objectifs'}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-gray-50">
                <p className="text-lg font-bold text-gray-900">{stats.daysActive}</p>
                <p className="text-xs text-gray-500">{isEn ? 'Active days' : 'Jours actifs'}</p>
              </div>
            </div>

            <Button 
              className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-900"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 className="w-4 h-4 mr-2" /> {isEn ? 'Edit profile' : 'Modifier le profil'}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Achievements */}
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                {isEn ? 'Achievements' : 'Récompenses'}
              </h3>
              <span className="text-sm text-gray-500">
                {achievements.filter(a => a.unlocked).length}/{achievements.length} {isEn ? 'unlocked' : 'débloquées'}
              </span>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-3">
              {achievements.map(achievement => (
                <div 
                  key={achievement.id}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border transition-all",
                    achievement.unlocked 
                      ? "bg-gray-50 border-gray-200" 
                      : "bg-white border-gray-200 opacity-50"
                  )}
                >
                  <div className={cn(
                    "p-2.5 rounded-xl",
                    achievement.unlocked ? "bg-gray-100" : "bg-gray-50"
                  )}>
                    <achievement.icon className={cn(
                      "w-5 h-5",
                      achievement.unlocked ? achievement.color : "text-gray-300"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium truncate",
                      achievement.unlocked ? "text-gray-900" : "text-gray-400"
                    )}>
                      {achievement.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <Award className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{isEn ? 'Recent activity' : 'Activité récente'}</h3>
            <div className="space-y-4">
              {activities.map((activity, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <activity.icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.detail}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
