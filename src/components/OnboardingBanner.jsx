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
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex items-center justify-between gap-4 text-sm">
      <div className="flex items-center gap-2 min-w-0">
        <Sparkles className="w-4 h-4 flex-shrink-0" />
        <span className="truncate">{t.onboardingBanner.text}</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <Link
          to={createPageUrl('Onboarding')}
          className="flex items-center gap-1 font-semibold whitespace-nowrap bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition"
        >
          {t.onboardingBanner.cta} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <button onClick={dismiss} className="opacity-70 hover:opacity-100 transition">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
