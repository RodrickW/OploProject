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
    <div
      className="fixed bottom-0 left-0 right-0 lg:hidden select-none bg-white border-t border-gray-100"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
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
                'flex-1 flex flex-col items-center justify-center py-2.5 px-2 transition-all duration-200 relative',
                isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              )}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
              )}
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-200",
                isActive ? "bg-blue-50" : ""
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-[10px] font-semibold mt-0.5",
                isActive ? "text-blue-600" : "text-gray-400"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
