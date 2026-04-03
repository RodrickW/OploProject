import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const greetings = [
  "Bienvenue",
  "Bonjour",
  "Ravi de vous voir",
  "Content de vous revoir",
  "Heureux de vous retrouver",
  "Salutations",
  "Hello"
];

export default function WelcomeCard() {
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState(greetings[0]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        // Check if card was closed permanently
        const cardClosed = localStorage.getItem('welcomeCardClosed');
        
        if (!cardClosed) {
          // Random greeting
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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-6 relative overflow-hidden shadow-lg"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-white mb-1">
            {greeting} {user.full_name?.split(' ')[0] || 'Chef'} ! 👋
          </h2>
          <p className="text-blue-100 mb-4">
            Prêt à optimiser vos opérations aujourd'hui ?
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3 flex-1">
              <div className="bg-white rounded-lg p-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">
                  Besoin d'aide ?
                </h3>
                <p className="text-sm text-blue-100 mb-3">
                  Notre assistant IA est disponible 24/7
                </p>
                <Link to={createPageUrl('OploChat')}>
                  <Button
                    size="sm"
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    Discuter avec Oplo.ai
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