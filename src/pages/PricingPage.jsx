import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import Navbar from '@/components/Navbar';
import { 
        CheckCircle, 
        ArrowRight,
        Heart,
        Zap,
        Copy,
        ChevronLeft,
        ChevronRight,
        Trophy
      } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Directrice Groupe - 12 restaurants",
      quote: "Avant, je ne savais jamais vraiment l'état réel de mes restaurants. Maintenant, j'ai une visibilité totale en temps réel. Mon équipe gère les opérations avec 80% moins de stress.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
    },
    {
      name: "Jean-Pierre Martin",
      role: "Chef d'exploitation",
      quote: "Les SOPs centralisées ont transformé notre façon de travailler. Toute l'équipe suit les mêmes process. Fini les variations d'un restaurant à l'autre.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    },
    {
      name: "Sophie Laurent",
      role: "Manager Groupe Finance",
      quote: "Les insights de l'IA nous permettent de prendre des décisions data-driven en quelques clics. J'ai gagné des jours entiers chaque mois sur les reporting.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
    },
    {
      name: "Thomas Blanc",
      role: "Responsable Développement",
      quote: "Lever des fonds ? Les outils de reporting Oplo.ai ont transformé ma capacité à pitcher aux investisseurs. Les chiffres parlent d'eux-mêmes.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
    },
    {
      name: "Céline Rossi",
      role: "Responsable RH",
      quote: "L'équipe est motivée par la transparence et les rituals de gouvernance. Les collaborateurs comprennent enfin comment leurs actions impactent les KPIs.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const displayedTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length]
  ];

  return (
    <div className="my-20">
      <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
        Pourquoi <span className="text-blue-600 font-bold">94%</span> de nos clients ne peuvent plus se passer de Oplo.ai
      </h2>

      <div className="relative">
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {displayedTestimonials.map((testimonial, idx) => (
            <div key={idx} className="rounded-xl bg-white border border-gray-200 p-8 hover:shadow-lg transition">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                />
                <div>
                  <p className="text-gray-900 font-semibold">{testimonial.name}</p>
                  <p className="text-blue-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prevSlide}
            className="p-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-200 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition ${
                  idx === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="p-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-200 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const plans = [
    {
      name: "Essentiel",
      icon: Heart,
      price: null,
      period: "Tarifs sur demande",
      description: "Pour structurer, piloter et décider avec clarté.",
      idealFor: "Idéal pour : 1-3 restaurants cherchant à professionnaliser leur pilotage",
      color: "cyan",
      features: [
        "Accès complet à la plateforme Oplo.ai",
        "Support email 24/7 assisté par IA",
        "Accès à 10+ outils technologiques développés par Oplo.ai"
      ],
      cta: "Demander un devis",
      highlighted: false
    },
    {
      name: "Avancé",
      icon: Zap,
      price: null,
      period: "Tarifs sur demande",
      description: "Pour accélérer la croissance avec accompagnement stratégique.",
      idealFor: "Idéal pour : Groupes de 3-10 restaurants en phase de structuration ou levée de fonds",
      color: "violet",
      features: [
        "Tout ce qui est inclus dans Essentiel, plus :",
        "Accompagnement levée de fonds",
        "Formation et onboarding à la plateforme",
        "Account Manager dédié",
        "Support prioritaire"
      ],
      cta: "Demander un devis",
      highlighted: true,
      badge: "Le plus populaire"
    },
    {
      name: "Expansion",
      icon: Copy,
      price: null,
      period: "Tarifs sur demande",
      description: "Pour exécuter, déployer et scaler sans friction.",
      idealFor: "Idéal pour : Groupes établis (+10 restaurants) visant l'expansion rapide et l'excellence opérationnelle",
      color: "emerald",
      features: [
        "Tout ce qui est inclus dans Avancé, plus :",
        "Team as a Service",
        "(mise à disposition de talents formés par Oplo.ai)",
        "Accès aux meilleurs fournisseurs locaux",
        "Social Media Management",
        "Ouverture, expansion et lancement de concepts",
        "Redesign & optimisation opérationnelle",
        "Recrutement et formation des équipes"
      ],
      cta: "Demander un devis",
      highlighted: false
    }
  ];

  const faq = [
    {
      q: "Combien de temps prend le déploiement ?",
      a: "En moyenne 48h pour être opérationnel. Notre équipe vous accompagne pour importer vos données et former vos équipes."
    },
    {
      q: "Puis-je changer de plan plus tard ?",
      a: "Oui, à tout moment. Vous pouvez upgrader ou downgrader votre abonnement selon vos besoins."
    },
    {
      q: "Y a-t-il des frais cachés ?",
      a: "Non, tout est transparent. Le prix affiché inclut toutes les fonctionnalités du plan, sans surprise."
    },
    {
      q: "Proposez-vous une période d'essai ?",
      a: "Oui, 14 jours gratuits sur tous les plans, sans carte bancaire requise."
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      cyan: {
        border: "border-blue-500/30",
        bg: "bg-blue-600/20",
        text: "text-blue-400",
        button: "bg-blue-600 hover:bg-blue-700"
      },
      violet: {
        border: "border-blue-500/30",
        bg: "bg-blue-600/20",
        text: "text-blue-400",
        button: "bg-blue-600 hover:bg-blue-700"
      },
      emerald: {
        border: "border-blue-500/30",
        bg: "bg-blue-600/20",
        text: "text-blue-400",
        button: "bg-blue-600 hover:bg-blue-700"
      }
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-300 px-4 py-1">
              Plans tarifaires Oplo.ai
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Choisissez votre plan
            </h1>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-tight">
              Chaque groupe de restaurants est unique.<br />
              Un seul système ne peut pas convenir à tous.<br />
              Découvrez la configuration adaptée à vos enjeux opérationnels et rentabilisez votre investissement en quelques mois.*
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {plans.map((plan, idx) => {
              const colors = getColorClasses(plan.color);
              return (
                <div
                  key={idx}
                  className={`relative rounded-2xl p-6 flex flex-col ${
                    plan.highlighted 
                      ? 'bg-gradient-to-br from-blue-50 to-blue-50 border-2 border-blue-200 scale-105' 
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white border-0 px-4 py-1 shadow-lg">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  <div className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-3`}>
                    <plan.icon className={`w-6 h-6 ${colors.text}`} />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-3 text-sm">{plan.description}</p>

                  <div className={`mb-4 px-3 py-2 rounded-lg ${colors.bg} border ${colors.border}`}>
                    <p className="text-xs font-medium text-gray-700">{plan.idealFor}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-base text-gray-600 font-semibold">{plan.period}</p>
                  </div>

                  <Link to={createPageUrl('QuoteQualification')}>
                    <Button className={`w-full ${colors.button} mb-4`}>
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>

                  <div className="space-y-2 flex-grow">
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2">
                         <CheckCircle className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
                         <span className={`text-sm ${feature.includes(':') ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Logos des marques */}
          <div className="my-20 border-t border-gray-200 pt-12">
            <div className="flex items-center justify-center gap-2 mb-8 text-gray-600">
              <Trophy className="w-5 h-5 text-blue-600" />
              <span className="text-sm">Expertise forgée au sein de marques de référence</span>
            </div>

            <div className="flex items-center justify-center gap-12 mb-16 flex-wrap">
                {[
                  { src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/ca6b05214_a47e9b_cb1f13aa26dd4012a0a47835140b0b4dmv2.png', alt: 'JLM' },
                  { src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/3470407d6_FR4963720.jpg', alt: 'Arpège Paris' },
                  { src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/d2e2a1808_RH-b5862da2.png', alt: 'RH Paris' },
                  { src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/e595a3d39_images.png', alt: 'N' }
                ].map((logo, idx) => (
                  <img
                    key={idx}
                    src={logo.src}
                    alt={logo.alt}
                    className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                ))}
                </div>
                </div>





          {/* CTA Section */}
          <div className="my-20 text-center rounded-2xl bg-blue-600 p-12">
            <h2 className="text-4xl font-normal text-white mb-4">
              Déployez vos concepts à grande échelle,<br />sans friction.
            </h2>
            <Link to={createPageUrl('QuoteQualification')}>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 mt-4">
                Demander un devis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Questions Fréquentes
            </h2>
            
            <div className="space-y-6">
              {faq.map((item, idx) => (
                <div key={idx} className="rounded-xl bg-white border border-gray-200 p-6 hover:shadow-lg transition">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.q}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Final Section from Home */}
          <div className="mt-20 flex flex-col items-center justify-center">
            <div className="mb-12 flex flex-col items-center">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-3xl font-normal text-gray-900">
                  Déployez vos concepts à grande échelle,
                </h2>
                <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="90" y="30" width="75" height="130" rx="18" transform="rotate(20 127 95)" fill="#3B82F6" opacity="0.4"/>
                  <rect x="20" y="40" width="75" height="130" rx="18" transform="rotate(-20 60 105)" fill="#2563EB"/>
                </svg>
              </div>
              <h2 className="text-3xl font-normal text-gray-900">
                sans friction.
              </h2>
            </div>
            <Link to={createPageUrl('QuoteQualification')}>
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow"
              >
                Demander une démo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

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