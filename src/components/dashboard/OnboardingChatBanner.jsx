import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles, ArrowRight, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';

export default function OnboardingChatBanner({ onDismiss }) {
  const { language } = useLanguage();
  const t = translations[language] || translations.fr;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl p-5 text-white flex items-center justify-between gap-4 border border-white/10"
      style={{ background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 40%, #0369a1 80%, #0891b2 100%)' }}
    >
      {/* Decorative */}
      <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute right-32 bottom-0 w-20 h-20 bg-cyan-400/10 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center gap-4 relative">
        <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">{t.onboardingChatBanner.title}</h3>
          <p className="text-blue-100/80 text-xs mt-0.5 leading-relaxed">
            {t.onboardingChatBanner.subtitle}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 relative">
        <Link to={createPageUrl('OploChat') + '?onboarding=1'}>
          <Button className="bg-white text-blue-700 hover:bg-blue-50 gap-1.5 font-bold text-xs h-8 shadow-lg shadow-black/15">
            {t.onboardingChatBanner.cta} <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
        <button onClick={onDismiss} className="p-1.5 rounded-lg hover:bg-white/15 transition-colors text-white/60 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
