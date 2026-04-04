import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/LanguageContext';
import { 
  Settings, 
  User, 
  Building2, 
  Bell, 
  Shield, 
  CreditCard,
  Globe,
  Palette,
  Save,
  Users
} from 'lucide-react';
import AssociatesManager from '@/components/settings/AssociatesManager';
import GroupProfileEditor from '@/components/settings/GroupProfileEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SettingsPage() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [activeTab, setActiveTab] = useState('group');

  const tabs = [
    { id: 'group', label: isEn ? 'My Group' : 'Mon Groupe', icon: Building2 },
    { id: 'associates', label: isEn ? 'Associates' : 'Associés', icon: Users },
    { id: 'general', label: isEn ? 'General' : 'Général', icon: Settings },
    { id: 'account', label: isEn ? 'Account' : 'Compte', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: isEn ? 'Security' : 'Sécurité', icon: Shield },
    { id: 'billing', label: isEn ? 'Billing' : 'Facturation', icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{isEn ? 'Settings' : 'Paramètres'}</h1>
        <p className="text-gray-500 mt-1">{isEn ? 'Configure your Oplo.ai workspace' : 'Configurez votre espace Oplo.ai'}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-100 border border-gray-200 h-auto flex-wrap gap-1 p-1">
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="data-[state=active]:bg-blue-600 gap-2">
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{isEn ? 'General preferences' : 'Préférences générales'}</h3>
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">{isEn ? 'Language' : 'Langue'}</Label>
                  <Select defaultValue="fr">
                    <SelectTrigger className="bg-white border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">{isEn ? 'Timezone' : 'Fuseau horaire'}</Label>
                  <Select defaultValue="europe_paris">
                    <SelectTrigger className="bg-white border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe_paris">Europe/Paris (UTC+1)</SelectItem>
                      <SelectItem value="europe_london">Europe/London (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">{isEn ? 'Currency' : 'Devise'}</Label>
                  <Select defaultValue="eur">
                    <SelectTrigger className="bg-white border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eur">Euro (€)</SelectItem>
                      <SelectItem value="usd">Dollar ($)</SelectItem>
                      <SelectItem value="gbp">{isEn ? 'Pound (£)' : 'Livre (£)'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateformat">{isEn ? 'Date format' : 'Format de date'}</Label>
                  <Select defaultValue="dd_mm_yyyy">
                    <SelectTrigger className="bg-white border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd_mm_yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm_dd_yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy_mm_dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{isEn ? 'Interface' : 'Interface'}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{isEn ? 'Dark mode' : 'Mode sombre'}</p>
                  <p className="text-sm text-gray-500">{isEn ? 'Enable dark theme' : 'Activer le thème sombre'}</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{isEn ? 'Animations' : 'Animations'}</p>
                  <p className="text-sm text-gray-500">{isEn ? 'Enable interface animations' : 'Activer les animations de l\'interface'}</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{isEn ? 'Compact sidebar' : 'Sidebar compacte'}</p>
                  <p className="text-sm text-gray-500">{isEn ? 'Reduce sidebar by default' : 'Réduire la barre latérale par défaut'}</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" /> {isEn ? 'Save changes' : 'Enregistrer les modifications'}
          </Button>
        </TabsContent>

        <TabsContent value="group">
          <GroupProfileEditor />
        </TabsContent>

        <TabsContent value="associates">
          <AssociatesManager />
        </TabsContent>

        {tabs.filter(t => !['general', 'associates', 'group'].includes(t.id)).map(tab => (
          <TabsContent key={tab.id} value={tab.id}>
            <div className="rounded-xl bg-white border border-gray-200 p-12 text-center">
              <tab.icon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{tab.label}</h3>
              <p className="text-gray-500">{isEn ? 'This section is coming soon' : 'Cette section sera bientôt disponible'}</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
