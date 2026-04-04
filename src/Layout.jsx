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
  Plug,
  Boxes
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';

const MARKETING_PAGES = ['Home', 'AboutOplo', 'PricingPage', 'QuoteQualification', 'Careers', 'TeamAsAService', 'Contact', 'Affiliates', 'Partners', 'University', 'Search', 'Devs'];
const APP_PAGES = ['Dashboard', 'OploChat', 'Insights', 'Inventory', 'CustomerSuccess', 'Operations', 'Market', 'Product', 'Alignment', 'Sales', 'Team', 'Settings', 'Notifications', 'Help', 'Profile', 'IntegrationsOplo', 'Restaurants', 'RestaurantDetail'];

function OnboardingGuard() {
  return null;
}

const COMPAST_COLORS = {
  C: { bg: 'bg-blue-500', text: 'text-blue-500', glow: 'shadow-blue-500/40' },
  O: { bg: 'bg-amber-500', text: 'text-amber-500', glow: 'shadow-amber-500/40' },
  M: { bg: 'bg-violet-500', text: 'text-violet-500', glow: 'shadow-violet-500/40' },
  P: { bg: 'bg-emerald-500', text: 'text-emerald-500', glow: 'shadow-emerald-500/40' },
  A: { bg: 'bg-rose-500', text: 'text-rose-500', glow: 'shadow-rose-500/40' },
  S: { bg: 'bg-cyan-500', text: 'text-cyan-500', glow: 'shadow-cyan-500/40' },
  T: { bg: 'bg-orange-500', text: 'text-orange-500', glow: 'shadow-orange-500/40' },
};

export default function Layout({ children, currentPageName }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language] || translations.fr;

  const navigation = [
    { name: t.nav.dashboard, icon: LayoutDashboard, page: 'Dashboard' },
    { name: t.nav.oploAI, icon: Sparkles, page: 'OploChat', highlight: true },
    { name: t.nav.insights, icon: Lightbulb, page: 'Insights' },
    { name: t.nav.inventory, icon: Boxes, page: 'Inventory' },
  ];

  const compastNav = [
    { name: t.nav.customerSuccess, icon: Users, page: 'CustomerSuccess', letter: 'C' },
    { name: t.nav.operations, icon: SettingsIcon, page: 'Operations', letter: 'O' },
    { name: t.nav.market, icon: Compass, page: 'Market', letter: 'M' },
    { name: t.nav.productService, icon: ShoppingBag, page: 'Product', letter: 'P' },
    { name: t.nav.alignment, icon: Target, page: 'Alignment', letter: 'A' },
    { name: t.nav.sales, icon: TrendingUp, page: 'Sales', letter: 'S' },
    { name: t.nav.team, icon: UsersRound, page: 'Team', letter: 'T' },
  ];

  const integrationsNav = [
    { name: t.nav.integrations_oplo, icon: Plug, page: 'IntegrationsOplo' },
  ];

  const bottomNav = [
    { name: t.nav.userManagement, icon: Users, page: 'AdminUsers', adminOnly: true },
    { name: t.nav.teamManagement, icon: Users, page: 'TeamManagement', hideForAdmin: true },
    { name: t.nav.settings, icon: SettingsIcon, page: 'Settings' },
    { name: t.nav.notifications, icon: Bell, page: 'Notifications' },
    { name: t.nav.help, icon: HelpCircle, page: 'Help' },
    { name: t.nav.profile, icon: UserCircle, page: 'Profile' },
  ];

  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

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
    const letterColor = item.letter ? COMPAST_COLORS[item.letter] : null;

    return (
      <Link
        to={createPageUrl(item.page)}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative",
          isActive
            ? "bg-white/10 text-white shadow-lg"
            : "text-white/50 hover:text-white/90 hover:bg-white/5",
        )}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full" />
        )}

        {showLetter && item.letter ? (
          <span className={cn(
            "w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all",
            isActive
              ? `${letterColor?.bg} text-white shadow-md ${letterColor?.glow}`
              : "bg-white/10 text-white/50 group-hover:bg-white/15 group-hover:text-white/80"
          )}>
            {item.letter}
          </span>
        ) : item.highlight ? (
          <div className={cn(
            "w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-all",
            isActive
              ? "bg-gradient-to-br from-violet-500 to-blue-500 shadow-md shadow-violet-500/40"
              : "bg-gradient-to-br from-violet-500/30 to-blue-500/30 group-hover:from-violet-500/50 group-hover:to-blue-500/50"
          )}>
            <item.icon className="w-3.5 h-3.5 text-white" />
          </div>
        ) : (
          <item.icon className={cn(
            "w-4.5 h-4.5 flex-shrink-0 transition-all",
            isActive ? "text-white" : "text-white/40 group-hover:text-white/70"
          )} style={{ width: '18px', height: '18px' }} />
        )}

        {!collapsed && (
          <span className={cn(
            "text-sm font-medium truncate flex-1 transition-all",
            isActive ? "text-white" : ""
          )}>
            {item.name}
          </span>
        )}

        {item.highlight && !collapsed && (
          <span className="ml-auto px-1.5 py-0.5 text-[9px] font-bold bg-gradient-to-r from-violet-500 to-blue-500 text-white rounded-md tracking-wide">
            AI
          </span>
        )}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 flex-shrink-0">
        <Link to={createPageUrl('Dashboard')} className="flex items-center gap-3">
          <div className="relative w-9 h-9 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl opacity-90 shadow-lg shadow-blue-500/30" />
            <svg className="absolute inset-0 w-full h-full p-1.5" viewBox="0 0 200 200" fill="none">
              <rect x="20" y="40" width="75" height="130" rx="18" transform="rotate(-20 60 105)" fill="white" opacity="0.6"/>
              <rect x="90" y="30" width="75" height="130" rx="18" transform="rotate(20 127 95)" fill="white"/>
            </svg>
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-none">Oplo.ai</h1>
              <p className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">Restaurant Intelligence</p>
            </div>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 scrollbar-none">
        {/* Main Navigation */}
        <div className="space-y-0.5">
          {navigation.map(item => (
            <NavLink key={item.page} item={item} />
          ))}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-white/5" />

        {/* COMPAST Section */}
        <div>
          {!collapsed && (
            <div className="px-3 mb-2">
              <h2 className="text-[9px] font-bold text-white/25 uppercase tracking-widest">{t.nav.compastFramework}</h2>
            </div>
          )}
          <div className="space-y-0.5">
            {compastNav.map(item => (
              <NavLink key={item.page} item={item} showLetter />
            ))}
          </div>
        </div>

        {/* Integrations Section */}
        <div className="mt-4">
          {!collapsed && (
            <div className="px-3 mb-2">
              <h2 className="text-[9px] font-bold text-white/25 uppercase tracking-widest">{t.nav.integrations}</h2>
            </div>
          )}
          <div className="space-y-0.5">
            {integrationsNav.map(item => (
              <NavLink key={item.page} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="px-3 pb-3 border-t border-white/5 pt-3 space-y-0.5 flex-shrink-0">
        {bottomNav.filter(item => {
          if (item.adminOnly && currentUser?.role !== 'admin') return false;
          if (item.hideForAdmin && currentUser?.role === 'admin') return false;
          return true;
        }).map(item => (
          <NavLink key={item.page} item={item} />
        ))}
        {!collapsed && (
          <div className="px-3 py-2">
            <LanguageSelector />
          </div>
        )}
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex mx-3 mb-4 items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/30 hover:text-white/70 transition-all flex-shrink-0 border border-white/5"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        {!collapsed && <span className="text-xs">{t.nav.collapse}</span>}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F7FC] overflow-hidden">
      <OnboardingGuard currentPageName={currentPageName} />
      <style>{`
        html, body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          padding-top: env(safe-area-inset-top);
          overscroll-behavior-y: none;
        }

        body {
          background: #F5F7FC;
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
          width: 4px;
          height: 4px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.12);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.2);
        }

        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

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
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#0A0E1A] transform transition-transform duration-300 border-r border-white/5",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:block fixed top-0 left-0 bottom-0 bg-[#0A0E1A] border-r border-white/5 transition-all duration-300 z-40",
        collapsed ? "w-20" : "w-64"
      )}>
        <SidebarContent />
      </div>

      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-[#0A0E1A] border-b border-white/5 flex items-center justify-between px-4 h-14">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition"
          data-testid="button-mobile-menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link to={createPageUrl('Dashboard')} className="flex items-center gap-2">
          <div className="relative w-7 h-7">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg opacity-90" />
            <svg className="absolute inset-0 w-full h-full p-1" viewBox="0 0 200 200" fill="none">
              <rect x="20" y="40" width="75" height="130" rx="18" transform="rotate(-20 60 105)" fill="white" opacity="0.6"/>
              <rect x="90" y="30" width="75" height="130" rx="18" transform="rotate(20 127 95)" fill="white"/>
            </svg>
          </div>
          <span className="text-sm font-bold text-white">Oplo.ai</span>
        </Link>
        <LanguageSelector />
      </div>

      {/* Onboarding Banner */}
      <div className={cn("fixed z-30 transition-all duration-300 right-0", collapsed ? "lg:left-20" : "lg:left-64", "left-0 top-14 lg:top-0")}>
        <OnboardingBanner />
      </div>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 min-h-screen",
        collapsed ? "lg:pl-20" : "lg:pl-64",
        "pb-20 lg:pb-0",
        "pt-14 lg:pt-0"
      )}>
        <main className="p-4 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
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
