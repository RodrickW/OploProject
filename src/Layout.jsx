import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from './utils';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import LanguageSelector from '@/components/LanguageSelector';
import OnboardingBanner from '@/components/OnboardingBanner';
import OnboardingModal from '@/components/OnboardingModal';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  Lightbulb, 
  Users, 
  Settings as SettingsIcon, 
  Bell, 
  HelpCircle, 
  UserCircle,
  ChevronLeft,
  ChevronRight,
  Compass,
  Target,
  TrendingUp,
  ShoppingBag,
  UsersRound,
  Menu,
  X,
  Sparkles,
  Plug
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, page: 'Dashboard' },
  { name: 'Oplo.ai', icon: Sparkles, page: 'OploChat', highlight: true },
  { name: 'Insights', icon: Lightbulb, page: 'Insights' },
];

const compastNav = [
  { name: 'Customer Success', icon: Users, page: 'CustomerSuccess', letter: 'C' },
  { name: 'Operations', icon: SettingsIcon, page: 'Operations', letter: 'O' },
  { name: 'Market', icon: Compass, page: 'Market', letter: 'M' },
  { name: 'Product/Service', icon: ShoppingBag, page: 'Product', letter: 'P' },
  { name: 'Alignment', icon: Target, page: 'Alignment', letter: 'A' },
  { name: 'Sales', icon: TrendingUp, page: 'Sales', letter: 'S' },
  { name: 'Team', icon: UsersRound, page: 'Team', letter: 'T' },
];

const integrationsNav = [
  { name: 'Intégrations Oplo', icon: Plug, page: 'IntegrationsOplo' },
];

const bottomNav = [
  { name: 'Gestion Utilisateurs', icon: Users, page: 'AdminUsers', adminOnly: true },
  { name: 'Gestion d\'équipe', icon: Users, page: 'TeamManagement', hideForAdmin: true },
  { name: 'Paramètres', icon: SettingsIcon, page: 'Settings' },
  { name: 'Notifications', icon: Bell, page: 'Notifications' },
  { name: 'Aide', icon: HelpCircle, page: 'Help' },
  { name: 'Profil', icon: UserCircle, page: 'Profile' },
];

const MARKETING_PAGES = ['Home', 'AboutOplo', 'PricingPage', 'QuoteQualification', 'Careers', 'TeamAsAService', 'Contact', 'Affiliates', 'Partners', 'University', 'Search', 'Devs'];
const APP_PAGES = ['Dashboard', 'OploChat', 'Insights', 'CustomerSuccess', 'Operations', 'Market', 'Product', 'Alignment', 'Sales', 'Team', 'Settings', 'Notifications', 'Help', 'Profile', 'IntegrationsOplo', 'Restaurants', 'RestaurantDetail'];

function OnboardingGuard() {
  return null;
}

export default function Layout({ children, currentPageName }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Récupérer l'utilisateur actuel pour vérifier le rôle admin
  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  // Pages marketing sans sidebar
  if (MARKETING_PAGES.includes(currentPageName)) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-16">
          {children}
        </div>
      </div>
    );
  }

  const NavLink = ({ item, showLetter }) => {
    const isActive = currentPageName === item.page;
    return (
      <Link
        to={createPageUrl(item.page)}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
          isActive 
            ? "bg-gradient-to-r from-blue-600/20 to-cyan-600/10 text-blue-600 border border-blue-500/30" 
            : "text-gray-500 hover:text-gray-900 hover:bg-blue-50",
          item.highlight && !isActive && "text-blue-600"
        )}
      >
        {showLetter && item.letter ? (
          <span className={cn(
            "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold",
            isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
          )}>
            {item.letter}
          </span>
        ) : (
          <item.icon className={cn(
            "w-5 h-5 flex-shrink-0",
            item.highlight && "text-violet-400"
          )} />
        )}
        {!collapsed && (
          <span className="text-sm font-medium truncate">{item.name}</span>
        )}
        {item.highlight && !collapsed && (
          <span className="ml-auto px-2 py-0.5 text-[10px] font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full">AI</span>
        )}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Logo */}
      <div className="p-6 pb-4 flex-shrink-0">
        <Link to={createPageUrl('Dashboard')} className="flex items-center gap-3">
          <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="40" width="75" height="130" rx="18" transform="rotate(-20 60 105)" fill="#7B8CFF"/>
            <rect x="90" y="30" width="75" height="130" rx="18" transform="rotate(20 127 95)" fill="#9EAFFF"/>
          </svg>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Oplo.ai</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Restaurant Intelligence</p>
            </div>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigation.map(item => (
            <NavLink key={item.name} item={item} />
          ))}
        </div>

        {/* Divider */}
        <div className="mt-6 mb-6 border-t border-gray-200" />

        {/* COMPAST Section */}
        <div className="mt-6">
          {!collapsed && (
            <div className="px-3 mb-3">
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">COMPAST Framework</h2>
            </div>
            )}
            <div className="space-y-1">
            {compastNav.map(item => (
              <NavLink key={item.name} item={item} showLetter />
            ))}
            </div>
            </div>

            {/* Integrations Section */}
            <div className="mt-6">
            {!collapsed && (
            <div className="px-3 mb-3">
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Intégrations</h2>
            </div>
            )}
            <div className="space-y-1">
            {integrationsNav.map(item => (
              <NavLink key={item.name} item={item} />
            ))}
            </div>
            </div>

            {/* Bottom Navigation */}
            <div className="mt-6 space-y-1 border-t border-gray-200 pt-4">
              {bottomNav.filter(item => {
                if (item.adminOnly && currentUser?.role !== 'admin') return false;
                if (item.hideForAdmin && currentUser?.role === 'admin') return false;
                return true;
              }).map(item => (
                <NavLink key={item.name} item={item} />
              ))}
              <div className="px-3 py-2">
                <LanguageSelector />
              </div>
            </div>
      </div>

      {/* Collapse Button - Desktop only */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex mx-3 my-4 items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all flex-shrink-0"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        {!collapsed && <span className="text-xs">Réduire</span>}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <OnboardingGuard currentPageName={currentPageName} />
      <style>{`
              :root {
                --background: 0 0% 98%;
                --foreground: 0 0% 8%;
                --card: 0 0% 100%;
                --card-foreground: 0 0% 8%;
                --popover: 0 0% 100%;
                --popover-foreground: 0 0% 8%;
                --primary: 217 91% 60%;
                --primary-foreground: 0 0% 100%;
                --secondary: 0 0% 90%;
                --secondary-foreground: 0 0% 8%;
                --muted: 0 0% 85%;
                --muted-foreground: 0 0% 45%;
                --accent: 217 91% 60%;
                --accent-foreground: 0 0% 100%;
                --destructive: 0 62% 30%;
                --destructive-foreground: 0 0% 100%;
                --border: 0 0% 85%;
                --input: 0 0% 95%;
                --ring: 217 91% 60%;
              }

              @media (prefers-color-scheme: dark) {
                :root {
                  --background: 0 0% 8%;
                  --foreground: 0 0% 98%;
                  --card: 0 0% 12%;
                  --card-foreground: 0 0% 98%;
                  --popover: 0 0% 12%;
                  --popover-foreground: 0 0% 98%;
                  --secondary: 0 0% 15%;
                  --secondary-foreground: 0 0% 98%;
                  --muted: 0 0% 25%;
                  --muted-foreground: 0 0% 65%;
                  --border: 0 0% 20%;
                  --input: 0 0% 15%;
                }
              }

              html, body {
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                padding-top: env(safe-area-inset-top);
                overscroll-behavior-y: none;
              }

              body {
                background: #FFFFFF;
              }

              @media (prefers-color-scheme: dark) {
                body {
                  background: #0a0a0a;
                }
              }

              * {
                -webkit-user-select: none;
                user-select: none;
                -webkit-tap-highlight-color: transparent;
              }

              input, textarea, select {
                -webkit-user-select: text;
                user-select: text;
              }

        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        /* Mobile scrollbar hiding */
        @media (max-width: 768px) {
          main {
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          main::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-white/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:block fixed top-0 left-0 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 z-40",
        collapsed ? "w-20" : "w-64"
      )}>
        <SidebarContent />
      </div>

      {/* Onboarding Banner */}
      <div className={cn("fixed top-0 right-0 z-30 transition-all duration-300", collapsed ? "lg:left-20" : "lg:left-64", "left-0")}>
        <OnboardingBanner />
      </div>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 min-h-screen",
        collapsed ? "lg:pl-20" : "lg:pl-64",
        "pb-20 lg:pb-0"
      )}>
        <main className="p-4 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <MobileNav currentPageName={currentPageName} />
    </div>
  );
}