import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Handshake,
  TrendingUp,
  Users,
  Target,
  Zap,
  Globe,
  Award,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Partners() {
  const [formData, setFormData] = React.useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    partnerType: '',
    message: ''
  });
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Partnership inquiry:', formData);
    setSubmitted(true);
  };

  const partnerTypes = [
    {
      type: "Intégrateur Technologique",
      icon: Zap,
      description: "Connectez vos solutions à notre plateforme",
      benefits: ["API complète", "Support technique dédié", "Co-marketing"]
    },
    {
      type: "Consultant",
      icon: Target,
      description: "Recommandez Oplo.ai à vos clients",
      benefits: ["Commission récurrente", "Accès prioritaire", "Formation exclusive"]
    },
    {
      type: "Revendeur",
      icon: TrendingUp,
      description: "Distribuez nos solutions",
      benefits: ["Marges attractives", "Support commercial", "Leads qualifiés"]
    },
    {
      type: "Fournisseur",
      icon: Globe,
      description: "Fournissez des services à notre écosystème",
      benefits: ["Visibilité accrue", "Accès au réseau", "Opportunités business"]
    }
  ];

  const benefits = [
    "Accès à un réseau de restaurateurs en croissance",
    "Outils de co-marketing et support commercial",
    "Formation et certification sur nos solutions",
    "API et documentation technique complète",
    "Support dédié et accompagnement personnalisé",
    "Opportunités de collaboration sur des projets innovants"
  ];

  const existingPartners = [
    { name: "TechFood Solutions", type: "Intégrateur", logo: "🔧" },
    { name: "RestauConsult", type: "Consultant", logo: "💼" },
    { name: "GlobalPOS", type: "Revendeur", logo: "🏪" },
    { name: "Supply Chain Pro", type: "Fournisseur", logo: "📦" }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Demande de partenariat reçue !
            </h1>
            <p className="text-gray-600 mb-8">
              Notre équipe partenariats vous contactera dans les 48h pour discuter des opportunités de collaboration.
            </p>
            <Button
              onClick={() => window.location.href = createPageUrl('Home')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <style>{`
        @keyframes grain {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(-20%, -5%); }
          60% { transform: translate(15%, 5%); }
          70% { transform: translate(0%, 10%); }
          80% { transform: translate(3%, 0%); }
          90% { transform: translate(-10%, -15%); }
          100% { transform: translate(0, 0); }
        }

        .grain {
          position: fixed;
          top: -100%;
          left: -100%;
          width: 200%;
          height: 200%;
          pointer-events: none;
          opacity: 0.03;
          mix-blend-mode: overlay;
          animation: grain 8s steps(10) infinite;
        }

        .grain svg {
          width: 100%;
          height: 100%;
        }
      `}</style>
      <div className="grain">
        <svg>
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="1" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ y: [0, 40, 0], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full opacity-20 blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-300 px-4 py-1">
                Programme Partenaires Oplo.ai
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight"
            >
              Construisons ensemble <br/>
              <span className="text-blue-600">l'avenir de la restauration</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600 mb-10 leading-relaxed"
            >
              Rejoignez notre écosystème de partenaires et créez de la valeur pour des milliers de restaurateurs
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })}
              >
                Devenir partenaire
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-gray-300"
                onClick={() => document.getElementById('partner-types').scrollIntoView({ behavior: 'smooth' })}
              >
                Découvrir les programmes
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="partner-types" className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Aidez les restaurants à se développer.<br/>Gagnez sur chaque commande.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Parrainez une fois, gagnez pour toujours. Le programme de parrainage d'oplo.ai vous offre des commissions à vie généreuses pour chaque marque que vous recommandez avec succès.
            </p>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto mb-20"
          >
            <div className="rounded-2xl bg-white border border-gray-200 shadow-xl p-8">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">Hi John Bennet!</h3>
                <p className="text-gray-600">Welcome back to your affiliate dashboard.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-200 p-6">
                  <p className="text-sm text-gray-600 mb-2">Revenue</p>
                  <p className="text-4xl font-bold text-gray-900 mb-2">$1,041.32</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +25% from last week
                  </p>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-green-50 to-white border border-green-200 p-6">
                  <p className="text-sm text-gray-600 mb-2">Active referrals</p>
                  <p className="text-4xl font-bold text-gray-900 mb-2">5</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +25% from last week
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 border border-gray-200 p-6">
                <h4 className="font-bold text-gray-900 mb-4">Referrals</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">R</div>
                      <div>
                        <p className="font-bold text-gray-900">RH Paris</p>
                        <p className="text-sm text-gray-600">1156 Orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">$1,041.32</p>
                      <p className="text-sm text-gray-600">$0.90 per order</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Monthly earnings</h4>
                <p className="text-sm text-gray-500">Your earnings based on the number of orders and your affiliate per store.</p>
              </div>
            </div>
          </motion.div>

          {/* How it works steps */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Comment ça marche :</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Postulez pour nous rejoindre</h4>
                <p className="text-gray-600">
                  Parlez-nous un peu de vous : qui vous êtes, ce que vous faites et pourquoi vous seriez un excellent partenaire. Nous examinons chaque candidature afin de nous assurer qu'il y a une bonne adéquation.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Soyez approuvé</h4>
                <p className="text-gray-600">
                  Une fois approuvé, vous recevez votre lien de parrainage personnel et accédez à notre formation : à qui nous nous adressons, ce qui nous différencie, ainsi que les meilleures pratiques pour maximiser vos revenus.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Commencez à parrainer</h4>
                <p className="text-gray-600">
                  Recommandez-nous des marques via votre lien ou par mise en relation directe. Dès qu'elles rejoignent oplo.ai, vous commencez à percevoir des commissions mensuelles récurrentes, et ce pendant toute la durée de vie du client.
                </p>
              </motion.div>
            </div>
          </div>


        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-normal text-gray-900 mb-4">
              Rejoignez le programme partenaire Oplo.ai
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Parrainez une fois. Gagnez pour toujours.<br />
              Rejoignez notre programme et percevez des commissions à vie pour chaque marque que vous recommandez.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              Devenir partenaire
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <svg width="32" height="32" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="40" width="75" height="130" rx="18" transform="rotate(-20 60 105)" fill="#7B8CFF"/>
              <rect x="90" y="30" width="75" height="130" rx="18" transform="rotate(20 127 95)" fill="#9EAFFF"/>
            </svg>
            <span className="text-xl font-bold text-gray-900">Oplo.ai</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2026 Oplo.ai · Restaurant Operating System
          </p>
        </div>
      </footer>
    </div>
  );
}