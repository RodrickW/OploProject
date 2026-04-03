import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { LayoutDashboard, MessageSquareText, Lightbulb, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';

export default function MobileNav({ currentPageName }) {
  const { language } = useLanguage();
  const t = translations[language] || translations.fr;

  const navItems = [
    { name: t.mobileNav.dashboard, icon: LayoutDashboard, page: 'Dashboard' },
    { name: t.mobileNav.chat, icon: MessageSquareText, page: 'OploChat' },
    { name: t.mobileNav.insights, icon: Lightbulb, page: 'Insights' },
    { name: t.mobileNav.profile, icon: UserCircle, page: 'Profile' },
  ];

  const location = useLocation();
  const lastClickRef = useRef({});

  const handleNavClick = (page) => {
    const now = Date.now();
    const lastClick = lastClickRef.current[page] || 0;
    if (currentPageName === page && now - lastClick < 300) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    lastClickRef.current[page] = now;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 select-none" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPageName === item.page;
          return (
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              onClick={() => handleNavClick(item.page)}
              className={cn(
                'flex-1 flex flex-col items-center justify-center py-3 px-2 transition-colors',
                isActive
                  ? 'text-violet-600 border-t-2 border-violet-600'
                  : 'text-gray-500'
              )}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
