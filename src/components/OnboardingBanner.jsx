import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';

export default function OnboardingBanner() {
  const [show, setShow] = useState(false);
  const { language } = useLanguage();
  const t = translations[language] || translations.fr;

  useEffect(() => {
    if (localStorage.getItem('oplo_onboarding_dismissed')) return;
    base44.auth.me().then(user => {
      if (!user) return;
      base44.entities.OnboardingProfile.filter({ created_by: user.email, status: 'completed' }, '-created_date', 1).then(profiles => {
        if (profiles.length === 0) setShow(true);
      });
    }).catch(() => {});
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem('oplo_onboarding_dismissed', '1');
  };

  if (!show) return null;

  return (
    <div
      className="text-white px-4 py-2.5 flex items-center justify-between gap-4 text-sm"
      style={{ background: 'linear-gradient(90deg, #1d4ed8 0%, #0891b2 100%)' }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="p-1 rounded-md bg-white/15 flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <span className="truncate text-xs font-medium text-white/90">{t.onboardingBanner.text}</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <Link
          to={createPageUrl('Onboarding')}
          className="flex items-center gap-1.5 text-xs font-bold whitespace-nowrap bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg transition-all border border-white/20"
        >
          {t.onboardingBanner.cta} <ArrowRight className="w-3 h-3" />
        </Link>
        <button onClick={dismiss} className="opacity-60 hover:opacity-100 transition p-1">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
