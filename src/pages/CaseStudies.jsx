import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Clock,
  Target,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CaseStudies() {
  const cases = [
    {
      restaurant: "La Brasserie Moderne",
      location: "Paris, 4 établissements",
      type: "Brasserie Casual Fine Dining",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
      challenge: "Groupe en forte croissance mais manque de visibilité opérationnelle. Pas de standardisation des process, KPIs suivis manuellement sur Excel, turnover élevé.",
      solution: "Déploiement complet d'Oplo.ai avec framework COMPAST, rituals hebdomadaires, SOPs digitalisées et dashboard temps réel.",
      results: [
        { metric: "+52%", label: "Croissance CA", icon: TrendingUp },
        { metric: "-35%", label: "Turnover équipe", icon: Users },
        { metric: "4.2h", label: "Gagnées/jour", icon: Clock },
        { metric: "92%", label: "Satisfaction client", icon: Target }
      ],
      quote: "Oplo.ai nous a permis de passer de 2 à 4 restaurants en 18 mois sans perdre le contrôle. C'est devenu notre tour de contrôle.",
      author: "Thomas Mercier",
      role: "CEO & Founder",
      details: [
        "Déploiement en 3 jours sur les 4 établissements",
        "ROI positif dès le 2ème mois",
        "Formation de 12 managers en 2 semaines",
        "Standardisation de 47 SOPs critiques"
      ]
    },
    {
      restaurant: "Sushi Master Group",
      location: "Lyon & Marseille, 6 restaurants",
      type: "Casual Dining Japonais",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800",
      challenge: "Multi-sites avec concepts différents, pas de vision consolidée, décisions basées sur le feeling, analyse concurrentielle inexistante.",
      solution: "Mise en place du framework COMPAST complet avec focus Market Intelligence et Customer Success Analytics. Rituals mensuels de deep-dive.",
      results: [
        { metric: "+67%", label: "Efficacité opé", icon: TrendingUp },
        { metric: "+43%", label: "Revenu/couvert", icon: Target },
        { metric: "-28%", label: "Coûts ops", icon: Clock },
        { metric: "4.6★", label: "Note Google", icon: Users }
      ],
      quote: "Nous avons enfin une vision data-driven de nos restaurants. Les insights IA nous font gagner des heures d'analyse chaque semaine.",
      author: "Sophie Chen",
      role: "Directrice Opérations",
      details: [
        "Analyse automatisée de 15 concurrents",
        "Prédictions de fréquentation à J+7",
        "Optimisation du staffing selon flux",
        "Dashboard unifié 6 restaurants"
      ]
    },
    {
      restaurant: "Gruppo Italiano",
      location: "Côte d'Azur, 3 restaurants",
      type: "Fine Dining Italien",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
      challenge: "Positionnement premium mais process inconsistants, qualité variable entre sites, pas de ritual de revue, coordination équipe difficile.",
      solution: "Focus sur SOPs et Rituals de gouvernance. Weekly reviews structurées, dashboard KPIs CEO, training standardisé via Oplo.ai.",
      results: [
        { metric: "+38%", label: "Marge nette", icon: TrendingUp },
        { metric: "98%", label: "Conformité SOPs", icon: CheckCircle },
        { metric: "-42%", label: "Incidents qualité", icon: Target },
        { metric: "15min", label: "Daily standup", icon: Clock }
      ],
      quote: "La standardisation nous a permis de garantir l'excellence partout. Nos clients retrouvent la même qualité, quel que soit le site.",
      author: "Marco Rossi",
      role: "Chef & Co-fondateur",
      details: [
        "62 SOPs créées et digitalisées",
        "Ritual quotidien 9h avec chaque chef",
        "Quality scoring automatique",
        "Formation continue via plateforme"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl('Home')} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Oplo.ai</h1>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Restaurant Intelligence</p>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to={createPageUrl('AboutOplo')} className="text-sm text-zinc-400 hover:text-white transition">
              Solution
            </Link>
            <Link to={createPageUrl('CaseStudies')} className="text-sm text-white font-medium">
              Études de Cas
            </Link>
            <Link to={createPageUrl('PricingPage')} className="text-sm text-zinc-400 hover:text-white transition">
              Tarifs
            </Link>
          </div>

          <Link to={createPageUrl('Dashboard')}>
            <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700">
              Démarrer
            </Button>
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-emerald-600/20 text-emerald-400 border-emerald-500/30 px-4 py-1">
              Résultats prouvés
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Ils ont transformé leurs restaurants
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Découvrez comment des restaurateurs visionnaires utilisent Oplo.ai 
              pour scaler tout en maintenant l'excellence opérationnelle.
            </p>
          </div>

          {/* Case Studies */}
          <div className="space-y-20">
            {cases.map((study, idx) => (
              <div key={idx} className="rounded-2xl bg-zinc-900/30 border border-zinc-800/50 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Image */}
                  <div className="relative h-64 md:h-auto">
                    <img 
                      src={study.image} 
                      alt={study.restaurant}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-8 md:py-12">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-violet-600/20 text-violet-400 border-violet-500/30">
                        {study.type}
                      </Badge>
                      <span className="text-sm text-zinc-500">{study.location}</span>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-4">
                      {study.restaurant}
                    </h2>

                    <div className="space-y-4 mb-6">
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                          Défi
                        </h3>
                        <p className="text-zinc-300">{study.challenge}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                          Solution
                        </h3>
                        <p className="text-zinc-300">{study.solution}</p>
                      </div>
                    </div>

                    {/* Results Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {study.results.map((result, rIdx) => (
                        <div key={rIdx} className="rounded-xl bg-zinc-800/50 p-4 border border-zinc-700/50">
                          <result.icon className="w-5 h-5 text-violet-400 mb-2" />
                          <div className="text-2xl font-bold text-white">{result.metric}</div>
                          <div className="text-sm text-zinc-400">{result.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Quote */}
                    <div className="rounded-xl bg-gradient-to-br from-violet-600/10 to-cyan-600/10 border border-violet-500/30 p-6 mb-6">
                      <p className="text-white italic mb-4">"{study.quote}"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {study.author[0]}
                        </div>
                        <div>
                          <div className="text-white font-semibold">{study.author}</div>
                          <div className="text-sm text-zinc-400">{study.role}</div>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2">
                      {study.details.map((detail, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2 text-sm text-zinc-400">
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center rounded-2xl bg-gradient-to-br from-violet-600/10 to-cyan-600/10 border border-violet-500/30 p-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Prêt à écrire votre success story ?
            </h2>
            <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
              Rejoignez les restaurateurs qui ont choisi de piloter leurs établissements 
              avec intelligence et data
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={createPageUrl('Dashboard')}>
                <Button size="lg" className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 px-8">
                  Essai Gratuit 14 jours
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl('PricingPage')}>
                <Button size="lg" variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800 px-8">
                  Voir les Tarifs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}