import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function OnboardingChatBanner({ onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-5 text-white flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white">Finalisez votre onboarding avec Oplo.ai</h3>
          <p className="text-blue-100 text-sm mt-0.5">
            Répondez à quelques questions pour personnaliser votre tableau de bord avec vos vraies données.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link to={createPageUrl('OploChat') + '?onboarding=1'}>
          <Button className="bg-white text-blue-600 hover:bg-blue-50 gap-2 font-semibold">
            Commencer <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <button onClick={onDismiss} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
          <X className="w-5 h-5 text-white/70" />
        </button>
      </div>
    </motion.div>
  );
}