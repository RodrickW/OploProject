import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Users, 
  Zap,
  Target,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TeamAsAService() {
  const services = [
    {
      icon: Users,
      title: "Équipe dédiée",
      description: "Une équipe complète de spécialistes à votre service, opérationnelle immédiatement"
    },
    {
      icon: Zap,
      title: "Déploiement rapide",
      description: "Lancez vos projets en quelques jours au lieu de plusieurs mois de recrutement"
    },
    {
      icon: Target,
      title: "Expertise sectorielle",
      description: "Des professionnels qui connaissent parfaitement l'industrie de la restauration"
    },
    {
      icon: TrendingUp,
      title: "Scalabilité",
      description: "Adaptez la taille de votre équipe selon vos besoins et votre croissance"
    },
    {
      icon: Shield,
      title: "Qualité garantie",
      description: "Tous nos talents sont rigoureusement sélectionnés et formés"
    },
    {
      icon: Clock,
      title: "Flexibilité",
      description: "Engagements flexibles sans les contraintes d'un recrutement permanent"
    }
  ];

  const roles = [
    {
      category: "Product & Tech",
      positions: [
        { title: "Product Manager", description: "Pilotage de la roadmap produit" },
        { title: "Développeur Full-Stack", description: "Développement et maintenance technique" },
        { title: "UX/UI Designer", description: "Conception d'expériences utilisateur" },
        { title: "Data Analyst", description: "Analyse et visualisation de données" }
      ]
    },
    {
      category: "Operations & Growth",
      positions: [
        { title: "Operations Manager", description: "Optimisation des process opérationnels" },
        { title: "Customer Success Manager", description: "Accompagnement client" },
        { title: "Growth Marketing Manager", description: "Acquisition et croissance" },
        { title: "Content Manager", description: "Création de contenu stratégique" }
      ]
    },
    {
      category: "Restaurant Expertise",
      positions: [
        { title: "Restaurant Consultant", description: "Conseil stratégique restaurant" },
        { title: "F&B Manager", description: "Gestion food & beverage" },
        { title: "Revenue Manager", description: "Optimisation du chiffre d'affaires" },
        { title: "Training Manager", description: "Formation des équipes" }
      ]
    }
  ];

  const packages = [
    {
      name: "Starter",
      price: "À partir de 5 000€/mois",
      description: "Pour démarrer avec un expert dédié",
      features: [
        "1 expert à temps partiel (20h/semaine)",
        "Accès à la plateforme Oplo.ai",
        "Support par email",
        "Rapports mensuels"
      ]
    },
    {
      name: "Growth",
      price: "À partir de 15 000€/mois",
      description: "Pour accélérer votre croissance",
      popular: true,
      features: [
        "Équipe de 2-3 experts dédiés",
        "Accès complet à la plateforme",
        "Support prioritaire 24/7",
        "Rapports hebdomadaires",
        "Account manager dédié",
        "Formation incluse"
      ]
    },
    {
      name: "Enterprise",
      price: "Sur mesure",
      description: "Pour transformer votre organisation",
      features: [
        "Équipe complète sur mesure",
        "Solution 100% personnalisée",
        "Support white-glove",
        "Rapports en temps réel",
        "C-level access",
        "Intégrations personnalisées",
        "SLA garanti"
      ]
    }
  ];

  const process = [
    {
      step: "01",
      title: "Découverte",
      description: "Nous analysons vos besoins et objectifs pour identifier les bons profils"
    },
    {
      step: "02",
      title: "Matching",
      description: "Nous sélectionnons les experts les plus adaptés à votre contexte"
    },
    {
      step: "03",
      title: "Onboarding",
      description: "Votre équipe est opérationnelle en moins de 2 semaines"
    },
    {
      step: "04",
      title: "Exécution",
      description: "Nous livrons les résultats avec des points réguliers"
    }
  ];

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
          <motion.div
            animate={{ y: [0, -40, 0], x: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full opacity-20 blur-3xl"
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
                Team as a Service
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight"
            >
              Là où se rencontrent<br/>
              <span className="text-blue-600">les bons talents et les bonnes opportunités</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600 mb-10 leading-relaxed"
            >
              Connectez-vous aux talents et aux opportunités du secteur, sans complications
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
                onClick={() => window.location.href = createPageUrl('QuoteQualification')}
              >
                Je suis une entreprise
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-gray-300"
                onClick={() => document.getElementById('roles').scrollIntoView({ behavior: 'smooth' })}
              >
                Je suis un candidat
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="max-w-5xl mx-auto">
          {/* Hero Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >

            <h2 className="text-5xl font-black text-gray-900 mb-6 leading-tight">
              <span className="text-blue-600">Service d'intérim d'Oplo.ai</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl">
              Que vous cherchiez des talents pour votre établissement ou des missions dans votre métier, Oplo.ai vous connecte aux bonnes opportunités.
            </p>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-blue-200 bg-white p-8 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Pour les Restaurateurs
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Trouvez des intérimaires qualifiés et expérimentés rapidement. Tous nos talents sont issus du secteur, rigoureusement sélectionnés et disponibles pour vos besoins urgents ou planifiés. Serveurs, cuisiniers, extras ou superviseurs - nous avons les profils qu'il vous faut.
                </p>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-white p-8 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Pour les Intérimaires
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Accédez à des missions variées et bien rémunérées dans toute la région. Flexibilité totale, horaires adaptés à vos disponibilités, et des établissements de qualité. Montez en compétences, construisez votre réseau professionnel et gagnez en expérience.
                </p>
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white shadow-xl h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-lg bg-white/20 flex items-center justify-center mb-6">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-6">
                    Pourquoi Oplo.ai ?
                  </h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-white/80 flex-shrink-0 mt-1" />
                      <span className="text-lg">Spécialisé 100% restauration</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-white/80 flex-shrink-0 mt-1" />
                      <span className="text-lg">Réactivité 7j/7 de 7h à 23h</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-white/80 flex-shrink-0 mt-1" />
                      <span className="text-lg">Pairing intelligent talentétablissement</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-white/80 flex-shrink-0 mt-1" />
                      <span className="text-lg">Transparence totale et sans frais cachés</span>
                    </div>
                  </div>
                </div>
                <p className="text-white/90">
                  Une communauté de professionnels engagés qui comprennent les défis du secteur.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Dual CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* For Restaurants */}
            <div className="rounded-2xl border border-blue-200 bg-white p-8 shadow-sm hover:shadow-md transition flex flex-col">
              <h4 className="text-xl font-bold text-gray-900 mb-3">Vous êtes restaurant ?</h4>
              <p className="text-gray-700 mb-6 flex-1">Trouvez les talents dont vous avez besoin en quelques clics.</p>
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Besoin d'un talent
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* For Interim Professionals */}
            <div className="rounded-2xl border border-blue-200 bg-white p-8 shadow-sm hover:shadow-md transition flex flex-col">
              <h4 className="text-xl font-bold text-gray-900 mb-3">Vous êtes intérimaire ?</h4>
              <p className="text-gray-700 mb-6 flex-1">Découvrez les missions disponibles dans votre secteur.</p>
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Chercher une mission
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
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