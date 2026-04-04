import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X, ArrowRight, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/LanguageContext';

export default function EnrichDataCTA({ onDismiss }) {
  const { language } = useLanguage();
  const isEn = language === 'en';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-24 right-4 lg:bottom-8 lg:right-6 z-50 w-72"
    >
      <div className="relative bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl shadow-2xl p-5 text-white overflow-hidden">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />

        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10"
          aria-label={isEn ? 'Close' : 'Fermer'}
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <BarChart2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Oplo.ai</span>
          </div>

          <h4 className="font-bold text-base mb-1.5">
            {isEn ? 'Enrich your data 📊' : 'Enrichissez vos données 📊'}
          </h4>
          <p className="text-xs opacity-85 mb-4 leading-relaxed">
            {isEn
              ? 'Share your POS exports to display your real performance (revenue, products, traffic) on the dashboard.'
              : 'Partagez vos exports de caisse pour afficher vos vraies performances (revenus, produits, trafic) sur le dashboard.'
            }
          </p>

          <Link to={`${createPageUrl('OploChat')}?mode=enrich`}>
            <Button
              size="sm"
              className="w-full bg-white text-blue-700 hover:bg-blue-50 font-semibold gap-2 shadow-none"
            >
              {isEn ? 'Talk to Oplo' : 'Parler à Oplo'} <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
