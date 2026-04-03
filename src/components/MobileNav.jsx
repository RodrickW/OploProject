import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { LayoutDashboard, MessageSquareText, Lightbulb, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MobileNav({ currentPageName }) {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, page: 'Dashboard' },
    { name: 'Chat', icon: MessageSquareText, page: 'OploChat' },
    { name: 'Insights', icon: Lightbulb, page: 'Insights' },
    { name: 'Profil', icon: UserCircle, page: 'Profile' },
  ];
  
  const location = useLocation();
  const lastClickRef = useRef({});

  const handleNavClick = (page) => {
    const now = Date.now();
    const lastClick = lastClickRef.current[page] || 0;
    
    // If clicking same tab within 300ms, scroll to top
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