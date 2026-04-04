import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { 
  Bell, 
  Check, 
  Trash2, 
  AlertTriangle, 
  TrendingUp, 
  Users,
  Sparkles,
  Settings,
  CheckCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const typeConfig = {
  insight: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
  goal: { icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  team: { icon: Users, color: 'text-cyan-600', bg: 'bg-cyan-100' },
  ai: { icon: Sparkles, color: 'text-blue-600', bg: 'bg-blue-100' },
};

export default function Notifications() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const demoNotifications = [
    { 
      id: '1', 
      type: 'insight', 
      title: isEn ? 'New critical insight' : 'Nouvel insight critique', 
      message: isEn
        ? 'Conversion rate dropped 15% this week at Le Bistrot restaurant'
        : 'Le taux de conversion a chuté de 15% cette semaine au restaurant Le Bistrot',
      time: isEn ? '5 min ago' : 'Il y a 5 min',
      read: false,
      priority: 'high'
    },
    { 
      id: '2', 
      type: 'goal', 
      title: isEn ? 'Goal reached!' : 'Objectif atteint !', 
      message: isEn
        ? 'You reached 90% of your monthly revenue goal'
        : 'Vous avez atteint 90% de votre objectif de chiffre d\'affaires mensuel',
      time: isEn ? '1h ago' : 'Il y a 1h',
      read: false,
      priority: 'medium'
    },
    { 
      id: '3', 
      type: 'team', 
      title: isEn ? 'New team member' : 'Nouveau membre', 
      message: isEn
        ? 'Sophie Martin joined the La Belle Assiette team'
        : 'Sophie Martin a rejoint l\'équipe de La Belle Assiette',
      time: isEn ? '3h ago' : 'Il y a 3h',
      read: true,
      priority: 'low'
    },
    { 
      id: '4', 
      type: 'ai', 
      title: isEn ? 'Oplo.ai recommendation' : 'Recommandation Oplo.ai', 
      message: isEn
        ? 'Based on your data, we recommend raising the tasting menu price by 5%'
        : 'Basé sur vos données, nous recommandons d\'augmenter le prix du menu dégustation de 5%',
      time: isEn ? 'Yesterday' : 'Hier',
      read: true,
      priority: 'medium'
    },
  ];

  const [notifications, setNotifications] = useState(demoNotifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filters = [
    { id: 'all', label: isEn ? 'All' : 'Toutes' },
    { id: 'unread', label: isEn ? 'Unread' : 'Non lues' },
    { id: 'insight', label: 'Insights' },
    { id: 'goal', label: isEn ? 'Goals' : 'Objectifs' },
    { id: 'ai', label: 'Oplo.ai' },
  ];

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{isEn ? 'Notifications' : 'Notifications'}</h1>
          <p className="text-gray-500 mt-1">
            {unreadCount > 0 
              ? `${unreadCount} ${isEn ? 'unread' : 'non lue(s)'}`
              : isEn ? 'All caught up' : 'Toutes lues'
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllAsRead}
              className="border-gray-200 text-gray-600 hover:text-gray-900"
            >
              <CheckCheck className="w-4 h-4 mr-2" /> {isEn ? 'Mark all as read' : 'Tout marquer comme lu'}
            </Button>
          )}
          <Button variant="ghost" size="icon" className="text-gray-400">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map(f => (
          <Button
            key={f.id}
            variant={filter === f.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f.id)}
            className={cn(
              filter === f.id 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'border-gray-200 text-gray-600 hover:text-gray-900'
            )}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="rounded-xl bg-white border border-gray-200 p-12 text-center">
            <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{isEn ? 'No notifications' : 'Aucune notification'}</h3>
            <p className="text-gray-500">{isEn ? 'You are all caught up!' : 'Vous êtes à jour !'}</p>
          </div>
        ) : (
          filteredNotifications.map(notification => {
            const config = typeConfig[notification.type] || typeConfig.insight;
            const Icon = config.icon;
            return (
              <div 
                key={notification.id}
                className={cn("rounded-xl border p-4 transition-all", notification.read ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200")}
              >
                <div className="flex items-start gap-4">
                  <div className={cn("p-2.5 rounded-xl", config.bg)}>
                    <Icon className={cn("w-5 h-5", config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn("font-medium", notification.read ? "text-gray-500" : "text-gray-900")}>
                        {notification.title}
                      </h4>
                      {!notification.read && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {!notification.read && (
                      <Button 
                        variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
