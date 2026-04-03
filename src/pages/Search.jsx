import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Download,
  Search as SearchIcon,
  BookOpen,
  Filter,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function Search() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const categories = [
    { id: 'all', name: 'Tous', count: 24 },
    { id: 'operations', name: 'Opérations', count: 8 },
    { id: 'finance', name: 'Finance', count: 6 },
    { id: 'marketing', name: 'Marketing', count: 5 },
    { id: 'hr', name: 'RH', count: 5 }
  ];

  const ebooks = [
    {
      id: 1,
      title: "Le Guide Complet du Pilotage Opérationnel",
      category: "operations",
      pages: 87,
      downloads: 3421,
      rating: 4.9,
      description: "Tout ce qu'il faut savoir pour piloter vos restaurants avec excellence",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/bdb6631f9_Screenshot2026-02-03at93542PM.png"
    },
    {
      id: 2,
      title: "10 Façons de Gérer les Pénuries de Personnel",
      category: "hr",
      pages: 42,
      downloads: 2891,
      rating: 4.8,
      description: "Solutions pratiques pour maintenir votre service malgré le manque de personnel",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/bdb6631f9_Screenshot2026-02-03at93542PM.png"
    },
    {
      id: 3,
      title: "Comment Diversifier les Revenus de votre Restaurant",
      category: "finance",
      pages: 28,
      downloads: 2654,
      rating: 4.7,
      description: "Nouvelles sources de revenus pour optimiser votre rentabilité",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/54590bb5a_Screenshot2026-02-03at93607PM.png"
    },
    {
      id: 4,
      title: "The Restaurant Opening Blueprint",
      category: "operations",
      pages: 35,
      downloads: 2143,
      rating: 5.0,
      description: "Le guide étape par étape pour une ouverture réussie",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/cf3a8c8aa_Screenshot2026-02-03at93720PM.png"
    },
    {
      id: 5,
      title: "30 KPIs Essentiels pour Restaurants",
      category: "operations",
      pages: 52,
      downloads: 3876,
      rating: 4.9,
      description: "Les indicateurs clés pour piloter votre performance",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/bdb6631f9_Screenshot2026-02-03at93542PM.png"
    },
    {
      id: 6,
      title: "Framework COMPAST en Action",
      category: "operations",
      pages: 64,
      downloads: 1987,
      rating: 4.8,
      description: "Structurez vos 7 piliers opérationnels pour scaler",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/54590bb5a_Screenshot2026-02-03at93607PM.png"
    },
    {
      id: 7,
      title: "Revenue Management: Le Guide Ultime",
      category: "finance",
      pages: 73,
      downloads: 2456,
      rating: 4.9,
      description: "Optimisez votre CA avec les techniques des pros",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/cf3a8c8aa_Screenshot2026-02-03at93720PM.png"
    },
    {
      id: 8,
      title: "Marketing Digital pour Restaurants",
      category: "marketing",
      pages: 48,
      downloads: 3124,
      rating: 4.7,
      description: "Attirez plus de clients avec le marketing digital",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/bdb6631f9_Screenshot2026-02-03at93542PM.png"
    },
    {
      id: 9,
      title: "Réseaux Sociaux: Stratégies Gagnantes",
      category: "marketing",
      pages: 39,
      downloads: 2789,
      rating: 4.6,
      description: "Développez votre présence en ligne efficacement",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/54590bb5a_Screenshot2026-02-03at93607PM.png"
    },
    {
      id: 10,
      title: "Gestion des Stocks et Approvisionnement",
      category: "operations",
      pages: 56,
      downloads: 2341,
      rating: 4.8,
      description: "Optimisez vos stocks et réduisez le gaspillage",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/cf3a8c8aa_Screenshot2026-02-03at93720PM.png"
    },
    {
      id: 11,
      title: "Formation et Développement d'Équipe",
      category: "hr",
      pages: 61,
      downloads: 1876,
      rating: 4.9,
      description: "Créez une équipe performante et motivée",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/bdb6631f9_Screenshot2026-02-03at93542PM.png"
    },
    {
      id: 12,
      title: "Analyse Financière pour Restaurateurs",
      category: "finance",
      pages: 68,
      downloads: 2198,
      rating: 4.8,
      description: "Comprenez vos chiffres et prenez de meilleures décisions",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/54590bb5a_Screenshot2026-02-03at93607PM.png"
    },
    {
      id: 13,
      title: "Expérience Client: Excellence et Fidélisation",
      category: "marketing",
      pages: 44,
      downloads: 2654,
      rating: 4.9,
      description: "Créez des expériences mémorables qui fidélisent",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/cf3a8c8aa_Screenshot2026-02-03at93720PM.png"
    },
    {
      id: 14,
      title: "Expansion et Ouverture de Nouveaux Sites",
      category: "operations",
      pages: 79,
      downloads: 1543,
      rating: 5.0,
      description: "Scalez votre groupe sans perdre le contrôle",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/bdb6631f9_Screenshot2026-02-03at93542PM.png"
    },
    {
      id: 15,
      title: "Pricing Stratégique et Menu Engineering",
      category: "finance",
      pages: 51,
      downloads: 2876,
      rating: 4.8,
      description: "Optimisez vos prix pour maximiser vos marges",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/54590bb5a_Screenshot2026-02-03at93607PM.png"
    },
    {
      id: 16,
      title: "Recrutement et Rétention de Talents",
      category: "hr",
      pages: 47,
      downloads: 2134,
      rating: 4.7,
      description: "Attirez et gardez les meilleurs talents",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/cf3a8c8aa_Screenshot2026-02-03at93720PM.png"
    },
    {
      id: 17,
      title: "Rituals de Gouvernance et Réunions Efficaces",
      category: "operations",
      pages: 38,
      downloads: 1765,
      rating: 4.9,
      description: "Structurez vos rituels pour une exécution parfaite",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/bdb6631f9_Screenshot2026-02-03at93542PM.png"
    },
    {
      id: 18,
      title: "Technologies et Digitalisation",
      category: "operations",
      pages: 55,
      downloads: 2432,
      rating: 4.8,
      description: "Adoptez les bonnes technologies pour votre restaurant",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/54590bb5a_Screenshot2026-02-03at93607PM.png"
    },
    {
      id: 19,
      title: "SEO Local pour Restaurants",
      category: "marketing",
      pages: 33,
      downloads: 2987,
      rating: 4.7,
      description: "Apparaissez en premier sur Google Maps",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/cf3a8c8aa_Screenshot2026-02-03at93720PM.png"
    },
    {
      id: 20,
      title: "Culture d'Entreprise et Leadership",
      category: "hr",
      pages: 58,
      downloads: 1923,
      rating: 4.9,
      description: "Créez une culture forte qui attire et retient",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/bdb6631f9_Screenshot2026-02-03at93542PM.png"
    },
    {
      id: 21,
      title: "Coûts et Optimisation des Marges",
      category: "finance",
      pages: 62,
      downloads: 2567,
      rating: 4.8,
      description: "Maîtrisez vos coûts et améliorez votre rentabilité",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/54590bb5a_Screenshot2026-02-03at93607PM.png"
    },
    {
      id: 22,
      title: "Résilience et Gestion de Crise",
      category: "operations",
      pages: 49,
      downloads: 1654,
      rating: 4.9,
      description: "Préparez-vous et réagissez efficacement aux crises",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/cf3a8c8aa_Screenshot2026-02-03at93720PM.png"
    },
    {
      id: 23,
      title: "Programmes de Fidélité qui Fonctionnent",
      category: "marketing",
      pages: 36,
      downloads: 2345,
      rating: 4.7,
      description: "Créez des programmes qui génèrent de vraies ventes",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/bdb6631f9_Screenshot2026-02-03at93542PM.png"
    },
    {
      id: 24,
      title: "Développement Durable en Restauration",
      category: "operations",
      pages: 41,
      downloads: 1876,
      rating: 4.8,
      description: "Intégrez la durabilité dans votre modèle économique",
      cover: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697eb4155191533bbd0c5542/54590bb5a_Screenshot2026-02-03at93607PM.png"
    }
  ];

  const filteredEbooks = ebooks.filter(ebook => {
    const matchesSearch = ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ebook.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ebook.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (ebook) => {
    const email = prompt('Entrez votre email pour télécharger le ebook :');
    if (email) {
      alert(`✅ "${ebook.title}" sera envoyé à ${email}`);
    }
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

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-300 px-4 py-1">
              📚 Bibliothèque de Ressources
            </Badge>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Plus de 20 ebooks gratuits
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Téléchargez nos guides experts pour optimiser votre gestion de restaurant
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher un ebook..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500"
              />
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-12"
          >
            {categories.map((category, idx) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2.5 rounded-full font-medium transition ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Ebooks Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 text-sm text-gray-600">
            {filteredEbooks.length} ebook{filteredEbooks.length > 1 ? 's' : ''} trouvé{filteredEbooks.length > 1 ? 's' : ''}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {filteredEbooks.map((ebook, idx) => (
              <motion.div
                key={ebook.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="rounded-xl bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition group"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-gray-50 relative overflow-hidden">
                  <img 
                    src={ebook.cover} 
                    alt={ebook.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">
                      {ebook.pages} pages
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-blue-100 text-blue-700 text-xs">
                      {categories.find(c => c.id === ebook.category)?.name}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-600 ml-auto">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-medium">{ebook.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {ebook.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {ebook.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      {ebook.downloads.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {ebook.pages} pages
                    </div>
                  </div>

                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 group-hover:shadow-lg transition"
                    onClick={() => handleDownload(ebook)}
                  >
                    Télécharger
                    <Download className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredEbooks.length === 0 && (
            <div className="text-center py-20">
              <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Aucun résultat trouvé
              </h3>
              <p className="text-gray-600">
                Essayez avec d'autres mots-clés ou catégories
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Besoin d'aide personnalisée ?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Notre équipe d'experts est là pour vous accompagner
            </p>
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              onClick={() => window.location.href = createPageUrl('Contact')}
            >
              Contactez-nous
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