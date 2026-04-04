import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';

const greetingsByLang = {
  fr: ["Bienvenue", "Bonjour", "Ravi de vous voir", "Content de vous revoir", "Heureux de vous retrouver"],
  en: ["Welcome", "Hello", "Great to see you", "Good to have you back", "Nice to see you again"],
};

export default function WelcomeCard() {
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState('');
  const { language } = useLanguage();
  const t = translations[language] || translations.fr;

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        const cardClosed = localStorage.getItem('welcomeCardClosed');
        if (!cardClosed) {
          const greetings = greetingsByLang[language] || greetingsByLang.fr;
          setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('welcomeCardClosed', 'true');
  };

  if (!user || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-2xl p-6 shadow-xl shadow-blue-500/10"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 40%, #0891b2 80%, #06b6d4 100%)',
        }}
      >
        {/* Decorative orbs */}
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none" />
        <div className="absolute top-4 right-24 w-20 h-20 bg-cyan-400/10 rounded-full blur-lg pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-800/30 rounded-full blur-xl pointer-events-none" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2.5 py-1 rounded-md bg-white/15 border border-white/20 backdrop-blur-sm">
              <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider">Oplo.ai</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
            {greeting} {user.full_name?.split(' ')[0] || 'Chef'} 👋
          </h2>
          <p className="text-blue-100/80 mb-5 text-sm">
            {t.welcome.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3 flex-1 border border-white/10">
              <div className="bg-white/15 rounded-lg p-2 flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm mb-1">
                  {t.welcome.needHelp}
                </h3>
                <p className="text-xs text-blue-100/70 mb-3 leading-relaxed">
                  {t.welcome.assistantAvailable}
                </p>
                <Link to={createPageUrl('OploChat')}>
                  <Button
                    size="sm"
                    className="bg-white text-blue-700 hover:bg-blue-50 font-semibold text-xs h-8 shadow-lg shadow-black/10 gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {t.welcome.chatWithOplo}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
