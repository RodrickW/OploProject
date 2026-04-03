import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { 
  Target,
  Users,
  TrendingUp,
  Settings,
  ShoppingBag,
  Compass,
  UsersRound,
  ArrowRight,
  Brain,
  BarChart3,
  Workflow,
  CheckCircle,
  Trophy,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AboutOplo() {
  const problems = [
    {
      title: "Visibilité fragmentée",
      description: "Données éparpillées entre Excel, notes et emails. Impossible d'avoir une vue d'ensemble."
    },
    {
      title: "Décisions au feeling",
      description: "Manque de data fiable pour prendre des décisions éclairées rapidement."
    },
    {
      title: "Process non standardisés",
      description: "Chaque site fonctionne différemment. Difficile de garantir la qualité partout."
    },
    {
      title: "Scaling impossible",
      description: "Ouvrir un nouveau restaurant = perdre le contrôle sur les autres."
    }
  ];

  const compastModules = [
    {
      letter: "C",
      name: "Customer Success",
      icon: Users,
      color: "cyan",
      description: "Analytics clients, segmentation, journey mapping, satisfaction et fidélisation."
    },
    {
      letter: "O",
      name: "Operations",
      icon: Settings,
      color: "violet",
      description: "KPIs temps réel, SOPs, rituals de gouvernance, problèmes tracking."
    },
    {
      letter: "M",
      name: "Market",
      icon: Compass,
      color: "emerald",
      description: "Intelligence concurrentielle, trends, positionnement, opportunités marché."
    },
    {
      letter: "P",
      name: "Product/Service",
      icon: ShoppingBag,
      color: "amber",
      description: "Analyse offre, pricing, performance produits, innovation menu."
    },
    {
      letter: "A",
      name: "Alignment",
      icon: Target,
      color: "rose",
      description: "Vision, objectifs, OKRs, roadmap, suivi stratégique et exécution."
    },
    {
      letter: "S",
      name: "Sales",
      icon: TrendingUp,
      color: "blue",
      description: "Pipeline réservations, conversions, revenue optimization, prévisions."
    },
    {
      letter: "T",
      name: "Team",
      icon: UsersRound,
      color: "purple",
      description: "Performance équipe, skills matrix, onboarding, culture et engagement."
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "Intelligence Artificielle",
      description: "Insights automatiques, prédictions, recommandations actionnables générées par IA."
    },
    {
      icon: BarChart3,
      title: "Dashboard Temps Réel",
      description: "KPIs actualisés en live, alertes proactives, visualisations claires."
    },
    {
      icon: Workflow,
      title: "Rituals de Gouvernance",
      description: "Daily ops, weekly reviews, monthly deep-dives structurés et automatisés."
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      cyan: "bg-cyan-600/20 border-cyan-500/30 text-cyan-400",
      violet: "bg-violet-600/20 border-violet-500/30 text-violet-400",
      emerald: "bg-emerald-600/20 border-emerald-500/30 text-emerald-400",
      amber: "bg-amber-600/20 border-amber-500/30 text-amber-400",
      rose: "bg-rose-600/20 border-rose-500/30 text-rose-400",
      blue: "bg-blue-600/20 border-blue-500/30 text-blue-400",
      purple: "bg-purple-600/20 border-purple-500/30 text-purple-400"
    };
    return colors[color];
  };

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

      <section className="pt-32 pb-4 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6">À propos d'Oplo.ai</h1>
            <p className="text-sm text-gray-600 max-w-xs mx-auto leading-snug">
              Découvrez l'avenir des opérations pour les groupes de restaurants. Centralisez vos données, prenez de meilleures décisions, améliorez votre cash-flow et augmentez vos marges grâce à une plateforme unique pilotée par la donnée.
            </p>
          </motion.div>
        </div>
        <div className="w-[500px] h-px bg-gray-300 mx-auto mt-12 mb-12" />
      </section>

            {/* Notre histoire & Key Strengths Section */}
            <section className="pt-0 pb-6 px-6 bg-white">
              <div className="max-w-xs mx-auto mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-2.5 text-sm text-gray-700 leading-snug"
                >
                  <div>
                    <p>Fondé en 2025 et enregistré à Dubaï, Oplo.ai est né d'une conviction portée par son fondateur, Nicolas Delbois, ancien cuisinier devenu entrepreneur. Formé dans des environnements où l'exigence, la précision et la rapidité d'exécution ne sont pas négociables, il a ensuite évolué aux côtés d'opérateurs à Paris, Sydney et Dubaï, construisant des systèmes à grande échelle.</p>
                  </div>

                  <div className="pl-3 border-l border-blue-500">
                    <p className="italic text-gray-600">Cette double culture — terrain et leadership — façonne profondément l'ADN d'Oplo.ai.</p>
                  </div>

                  <div>
                    <p>Cette exposition internationale et opérationnelle a fait émerger un constat clair : les entreprises les plus ambitieuses sont freinées par des outils qui manquent de vitesse et de contrôle. La technologie existe, mais elle ne parle pas le langage de ceux qui pilotent réellement la performance.</p>
                  </div>

                  <div>
                    <p>C'est pour combler ce fossé qu'Oplo.ai a été créé. Une plateforme moderne, pilotée par l'IA, conçue pour les décideurs. Parce que nous parlons votre langage, nous avons partagé vos contraintes : pression de l'exécution, arbitrages permanents et nécessité de transformer la complexité opérationnelle en avantage compétitif durable.</p>
                  </div>
                </motion.div>
              </div>
              <div className="w-[500px] h-px bg-gray-300 mx-auto mt-12" />

              <div className="max-w-7xl mx-auto mt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Professionnels de la restauration",
                      description: "qui maîtrisent la croissance rapide.",
                      icon: Users
                    },
                    {
                      title: "Experts tech / consulting",
                      description: "qui transforment rapidement les besoins des dirigeants en solutions concrètes.",
                      icon: Lightbulb
                    },
                    {
                      title: "Spécialistes des équipes",
                      description: "avec des années d'expérience terrain et un réseau international étendu.",
                      icon: TrendingUp
                    }
                  ].map((strength, idx) => {
                    const Icon = strength.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="text-center"
                      >
                        <Icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                        <h3 className="font-bold text-gray-900 mb-1">{strength.title}</h3>
                        <p className="text-sm text-gray-600">{strength.description}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <div className="w-[500px] h-px bg-gray-300 mx-auto mt-12" />
              </section>

              {/* Platform Section */}
              <section className="py-12 px-6 bg-white">
              <div className="max-w-xs mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-2.5 text-sm text-gray-700 leading-snug"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Oplo.ai, bien plus qu'un simple logiciel
                </h2>

                <p>
                  Notre plateforme allie rigueur stratégique et intelligence opérationnelle, pensée pour fonctionner comme une équipe de conseil haut niveau intégrée à votre quotidien. Nous avons massivement investi dans nos infrastructures et systèmes intelligents pour éliminer les goulets d'étranglement classiques dans les opérations, permettant aux gérants de restaurants de travailler mieux, plus vite et plus efficacement.
                </p>

                <p>
                  Avec une équipe interne de 3 développeurs, Oplo.ai repose sur une technologie maison de pointe. Parce que nous comprenons en profondeur le fonctionnement opérationnel des restaurants et que nous savons exactement ce dont ils ont besoin, nous avons conçu des fonctionnalités inédites au niveau mondial qui produisent un impact réel.
                </p>
              </motion.div>
              </div>
              <div className="w-[500px] h-px bg-gray-300 mx-auto mt-12" />
              </section>

              {/* How it works */}
                    <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-normal text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-gray-600">
              Simple, rapide et sans friction
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Onboarding Express",
                description: "Import de vos données en quelques clics. Formation de vos équipes en 2 semaines."
              },
              {
                step: "02",
                title: "Configuration Intelligente",
                description: "L'IA vous suggère les KPIs, SOPs et rituals adaptés à votre business."
              },
              {
                step: "03",
                title: "Pilotage Autonome",
                description: "Tableaux de bord en temps réel, alertes proactives, insights automatiques."
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative"
              >
                <div className="rounded-2xl bg-white border border-gray-200 p-8 h-full hover:shadow-lg transition">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-2xl font-bold text-blue-600">{step.step}</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-600 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl font-normal text-gray-900 mb-6">
              Prêt à transformer votre gestion ?
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Rejoignez les restaurateurs qui pilotent avec intelligence
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base shadow-lg hover:shadow-xl transition-shadow"
                  onClick={() => window.location.href = createPageUrl('QuoteQualification')}
                >
                  Demander une démo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white border-2 border-gray-300 text-gray-900 hover:bg-gray-50 px-8 py-3 text-base"
                >
                  Voir les Résultats
                </Button>
              </motion.div>
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