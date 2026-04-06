import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Target,
  Zap,
  BarChart3,
  Shield,
  SkipForward,
  CheckCircle2,
  TrendingDown,
  AlertCircle,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const [checking, setChecking] = React.useState(true);

  useEffect(() => {
    base44.auth.isAuthenticated().then((authenticated) => {
      if (authenticated) {
        window.location.href = createPageUrl('Dashboard');
      } else {
        setChecking(false);
      }
    });
  }, []);

  if (checking) return null;


  const solutions = [
    {
      id: 'check',
      title: 'Check',
      icon: '🪑',
      description: 'Salle & Accueil',
      features: ['Gestion des tables', 'Réservations', 'Service client', 'Paiements']
    },
    {
      id: 'dash',
      title: 'Dash',
      icon: '🍳',
      description: 'Cuisine & Bar',
      features: ['Commandes cuisine', 'Gestion bar', 'Recettes', 'Temps de service']
    },
    {
      id: 'item',
      title: 'Item',
      icon: '📦',
      description: 'Stock & Logistique',
      features: ['Inventaire', 'Commandes fournisseurs', 'Traçabilité', 'Coûts matières']
    },
    {
      id: 'margin',
      title: 'Margin',
      icon: '📊',
      description: 'Direction',
      features: ['KPIs temps réel', 'Rapports financiers', 'Prévisions', 'Analyse performance']
    }
  ];

  const features = [
    {
      icon: BarChart3,
      title: "Pilotage en Temps Réel",
      description: "KPIs automatisés, tableaux de bord intelligents et alertes proactives pour ne jamais perdre le contrôle."
    },
    {
      icon: Users,
      title: "Framework COMPAST",
      description: "Méthode éprouvée pour structurer Customer Success, Operations, Market, Product, Alignment, Sales et Team."
    },
    {
      icon: Sparkles,
      title: "IA Générative Intégrée",
      description: "Insights automatiques, prédictions et recommandations actionnables générées par l'intelligence artificielle."
    },
    {
      icon: Target,
      title: "Rituals de Gouvernance",
      description: "Standardisez vos revues quotidiennes, hebdomadaires et mensuelles pour une exécution parfaite."
    },
    {
      icon: Zap,
      title: "SOPs Centralisées",
      description: "Toutes vos procédures standardisées au même endroit, accessibles instantanément par toute l'équipe."
    },
    {
      icon: Shield,
      title: "Analyse Concurrentielle",
      description: "Surveillez votre marché et vos concurrents en temps réel pour garder une longueur d'avance."
    }
  ];

  const stats = [
    { value: "+47%", label: "Croissance du CA" },
    { value: "4.2h", label: "Gestion opérationnelle économisées/jour" },
    { value: "-63%", label: "Moins d'erreurs opérationnelles" },
    { value: "< 48h", label: "Déploiement vs. 6 mois pour un ERP traditionnel" }
  ];

  const benefits = [
    "Décisions data-driven en quelques clics",
    "Standardisation des process opérationnels",
    "Visibilité totale sur vos restaurants",
    "Prédictions et alertes intelligentes",
    "Collaboration équipe facilitée",
    "Évolutivité sans perdre le contrôle"
  ];

  return (
      <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 relative overflow-hidden" style={{ background: 'radial-gradient(ellipse 120% 80% at 50% -10%, #dbeafe 0%, #e0e7ff 30%, #f8faff 60%, #ffffff 100%)' }}>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16">
            <div className="text-center max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="mb-8 inline-block border border-blue-200 bg-white/70 backdrop-blur-sm text-blue-700 px-5 py-1.5 rounded-full text-sm font-medium shadow-sm">
                  Plateforme d'Intelligence Opérationnelle
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight"
              >
                Pilotez votre groupe{' '}
                <span className="block bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500 bg-clip-text text-transparent">
                  comme une machine
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base text-gray-500 mb-10 leading-relaxed max-w-sm mx-auto"
              >
                La plateforme IA tout-en-un pour standardiser vos opérations et scaler sans limites
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col items-center gap-3 mb-16"
              >
                <Button
                  size="lg"
                  className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                  onClick={() => window.location.href = createPageUrl('QuoteQualification')}
                >
                  Demander une démo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full max-w-xs border border-gray-300 text-gray-700 hover:bg-gray-50 text-base font-semibold rounded-xl bg-white/80"
                  onClick={() => document.getElementById('plateforme')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  En savoir plus
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full flex justify-center mb-8"
          >
            <div className="flex flex-col items-center gap-2 text-gray-600">
              <Trophy className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-center">Expertise forgée au sein de marques de référence</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-12 mb-16 flex-wrap"
          >
            {[
              { src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/ca6b05214_a47e9b_cb1f13aa26dd4012a0a47835140b0b4dmv2.png', alt: 'JLM' },
              { src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/3470407d6_FR4963720.jpg', alt: 'Arpège Paris' },
              { src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/d2e2a1808_RH-b5862da2.png', alt: 'RH Paris' },
              { src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/e595a3d39_images.png', alt: 'N' }
            ].map((logo, idx) => (
              <motion.img
                key={idx}
                src={logo.src}
                alt={logo.alt}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-normal text-gray-900 mb-4">
              Pourquoi nos clients nous choisissent
            </h2>
            <p className="text-lg text-gray-600">
              Nous accélérons et simplifions drastiquement votre processus d'exécution.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                stat: "94%",
                label: "Taux de satisfaction",
                description: "Nos clients renouvelent leur abonnement avec nous"
              },
              {
                stat: "+47%",
                label: "Croissance du CA",
                description: "En moyenne après 6 mois d'utilisation"
              },
              {
                stat: "< 48h",
                label: "Déploiement",
                description: "vs. 6 mois pour un ERP traditionnel"
              },
              {
                stat: "-63%",
                label: "Erreurs opérationnelles",
                description: "Réduction des incidents liés aux process"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm flex flex-col"
              >
                <div className="text-4xl font-bold text-blue-600 mb-2 leading-none">{item.stat}</div>
                <h3 className="font-bold text-gray-900 text-base mb-1.5">{item.label}</h3>
                <p className="text-sm text-gray-500 leading-snug">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid / Solutions */}
      <section id="solutions" className="py-10 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-normal text-gray-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg text-gray-600">
              Une plateforme complète pour opérer et scaler intelligemment
            </p>
          </motion.div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
            >
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  className="flex-shrink-0 w-80 rounded-xl bg-white border border-gray-200 hover:border-blue-300 transition group cursor-pointer overflow-hidden flex flex-col snap-start"
                >
                  <div className="p-6 flex-1">
                    <motion.div
                      className="w-10 h-10 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center mb-3"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <feature.icon className="w-5 h-5 text-blue-600" />
                    </motion.div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          </div>
          </section>



          {/* Benefits Section / Plateforme */}
      <section id="plateforme" className="py-20 px-6 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-300">
                Pourquoi Oplo.ai
              </Badge>
              <h2 className="text-4xl font-normal text-gray-900 mb-6">
                Du chaos à l'excellence
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-4xl">
                Accélérez la croissance de vos restaurants grâce à un écosystème opérationnel. Exploitez des insights en temps réel via notre technologie, améliorez votre cash-flow, déployez vos concepts et ouvrez plus vite, avec une exécution maîtrisée dès les premiers jours.
              </p>
              
              <div className="space-y-3">
                {benefits.map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              {/* Mini Pop-in Produits & Intégrations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-12 p-6 rounded-2xl bg-white border border-gray-200 shadow-lg"
              >
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">L'écosystème Oplo</h3>
                
                <div className="space-y-3">
                  {/* Services d'accompagnement */}
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2">Nous accompagnons votre groupe</p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { name: "Operations", icon: "⚙️" },
                        { name: "Financement", icon: "💰" },
                        { name: "Fournisseurs", icon: "📦" },
                        { name: "Design", icon: "🎨" },
                        { name: "Expansion", icon: "🚀" },
                        { name: "Implantations", icon: "📍" },
                        { name: "Formation", icon: "🎓" },
                        { name: "Recrutement", icon: "👥" }
                      ].map((service, idx) => (
                        <div key={idx} className="text-center p-1.5 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col items-center justify-center">
                          <div className="text-lg mb-0.5">{service.icon}</div>
                          <div className="text-[9px] font-medium text-gray-700 leading-tight whitespace-nowrap text-center">{service.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl bg-gradient-to-br from-gray-50 via-white to-blue-50 border border-gray-200 shadow-xl p-6 overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    icon: SkipForward,
                    title: "Décisions plus rapides",
                    description: "Les données en temps réel éliminent l'intuition et les délais."
                  },
                  {
                    icon: CheckCircle2,
                    title: "Meilleure expérience client",
                    description: "Anticipez les problèmes et résolvez-les avant l'impact."
                  },
                  {
                    icon: TrendingDown,
                    title: "Coûts maîtrisés",
                    description: "Optimisez stocks et commandes fournisseurs."
                  },
                  {
                    icon: AlertCircle,
                    title: "Toujours sous contrôle",
                    description: "Alertes en temps réel pour éviter ruptures et dérives."
                  }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="rounded-xl bg-white border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-md transition group cursor-pointer"
                  >
                    <div className="p-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
                        <Icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm leading-tight mb-2">{item.title}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Témoignages Section */}
      <section id="temoignages" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-normal text-gray-900 mb-4">
              Ressources gratuites
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Guides, frameworks et templates pour optimiser vos opérations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "10 façons de gérer les pénuries de personnel en restauration",
                description: "Structurez vos 7 piliers opérationnels pour scaler",
                pages: "42 pages",
                coverImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/bdb6631f9_Screenshot2026-02-03at93542PM.png"
              },
              {
                title: "Comment diversifier les revenus de votre restaurant",
                description: "Les frameworks des meilleurs groupes",
                pages: "28 pages",
                coverImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/54590bb5a_Screenshot2026-02-03at93607PM.png"
              },
              {
                title: "The Restaurant Opening Blueprint",
                description: "Les 30 indicateurs clés essentiels",
                pages: "35 pages",
                coverImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/cf3a8c8aa_Screenshot2026-02-03at93720PM.png"
              }
            ].map((playbook, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="rounded-xl bg-white border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-lg transition group cursor-pointer flex flex-col"
                >
                {playbook.coverImage && (
                  <img src={playbook.coverImage} alt={playbook.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6 flex flex-col flex-1">
                  <Badge className="bg-blue-100 text-blue-700 border-blue-300 mb-4 w-fit">
                    {playbook.pages}
                  </Badge>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{playbook.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{playbook.description}</p>

                  <div className="mt-auto">
                    <Button 
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm font-medium p-0 h-auto"
                      onClick={() => {
                        const email = prompt('Entrez votre email pour recevoir le guide :');
                        if (email) {
                          alert('Merci ! Votre ressource sera envoyée par email.');
                        }
                      }}
                    >
                      Télécharger le guide →
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section id="apropos" className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-normal text-gray-900 mb-4">
              Commencez en 3 étapes
            </h2>
            <p className="text-lg text-gray-600">
              Déploiement en moins de 48h
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Réservez un appel",
                icon: "📞",
                description: "Réservez un appel de 30 minutes avec un expert Oplo.ai"
              },
              {
                step: "02",
                title: "Démo personnalisée",
                icon: "🎯",
                description: "Bénéficiez d'une démo personnalisée et découvrez tout ce que Oplo peut faire pour vous"
              },
              {
                step: "03",
                title: "Implémentation",
                icon: "🚀",
                description: "Nos experts orchestrent une implémentation sans friction pour vous offrir un pilotage centralisé de vos opérations"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative"
              >
                <div className="rounded-2xl bg-white border border-gray-200 p-8 h-full hover:shadow-lg transition">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-2xl font-bold text-blue-600">{item.step}</div>
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-600 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Button only */}
      <section id="tarifs" className="py-10 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="mb-12 flex flex-col items-center text-center">
              <h2 className="text-3xl font-normal text-gray-900 leading-tight">
                Déployez vos concepts à grande échelle,{' '}
                <svg width="32" height="32" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle">
                  <rect x="20" y="40" width="75" height="130" rx="18" transform="rotate(-20 60 105)" fill="#3B82F6" opacity="0.4"/>
                  <rect x="90" y="30" width="75" height="130" rx="18" transform="rotate(20 127 95)" fill="#2563EB"/>
                </svg>
              </h2>
              <h2 className="text-3xl font-normal text-gray-900">sans friction.</h2>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mb-12">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => window.location.href = createPageUrl('QuoteQualification')}
              >
                Demander une démo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <svg width="32" height="32" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="90" y="30" width="75" height="130" rx="18" transform="rotate(20 127 95)" fill="#3B82F6" opacity="0.4"/>
              <rect x="20" y="40" width="75" height="130" rx="18" transform="rotate(-20 60 105)" fill="#2563EB"/>
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