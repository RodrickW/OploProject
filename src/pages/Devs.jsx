import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Code,
  Terminal,
  Book,
  Zap,
  Lock,
  Cloud,
  FileText,
  ExternalLink,
  Calendar,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Devs() {
  const apiEndpoints = [
    {
      name: "Restaurants API",
      method: "GET",
      endpoint: "/api/v1/restaurants",
      description: "Récupérer la liste de tous les restaurants",
      icon: Code
    },
    {
      name: "Create Restaurant",
      method: "POST",
      endpoint: "/api/v1/restaurants",
      description: "Créer un nouveau restaurant",
      icon: Zap
    },
    {
      name: "KPIs API",
      method: "GET",
      endpoint: "/api/v1/kpis",
      description: "Accéder aux KPIs en temps réel",
      icon: Terminal
    },
    {
      name: "Insights API",
      method: "GET",
      endpoint: "/api/v1/insights",
      description: "Récupérer les insights générés par l'IA",
      icon: Cloud
    }
  ];

  const resources = [
    {
      title: "Documentation Complète",
      description: "Guide complet de notre API REST avec exemples",
      icon: Book,
      link: "#docs"
    },
    {
      title: "SDKs & Libraries",
      description: "Bibliothèques officielles pour Node.js, Python, PHP",
      icon: Code,
      link: "#sdks"
    },
    {
      title: "Authentification",
      description: "Guides sur OAuth 2.0 et gestion des tokens",
      icon: Lock,
      link: "#auth"
    },
    {
      title: "Webhooks",
      description: "Configuration et utilisation des webhooks",
      icon: Zap,
      link: "#webhooks"
    }
  ];

  const blogPosts = [
    {
      title: "Building Real-time Analytics with Oplo.ai API",
      excerpt: "Comment construire un tableau de bord temps réel avec notre API",
      date: "2026-02-01",
      author: "Nicolas Delbois",
      category: "Tutorial"
    },
    {
      title: "Best Practices for API Rate Limiting",
      excerpt: "Optimisez vos appels API et gérez les limites efficacement",
      date: "2026-01-28",
      author: "Tech Team",
      category: "Best Practices"
    },
    {
      title: "New: Batch Operations API",
      excerpt: "Effectuez plusieurs opérations en une seule requête",
      date: "2026-01-25",
      author: "Product Team",
      category: "Release"
    },
    {
      title: "Securing Your Integration",
      excerpt: "Guide complet sur la sécurisation de vos intégrations",
      date: "2026-01-20",
      author: "Security Team",
      category: "Security"
    }
  ];

  const apiDocs = [
    {
      title: "Connector API",
      description: "Pour les applications et les systèmes externes"
    },
    {
      title: "Channel manager API",
      description: "Synchronisation des données relatives à la disponibilité, aux tarifs et à l'inventaire sur les canaux de vente, et prise de réservations issues des canaux de vente"
    },
    {
      title: "Booking Engine API",
      description: "Guide pour intégrer Mews Booking Engine à votre site web"
    }
  ];

  const getMethodColor = (method) => {
    const colors = {
      GET: "bg-green-100 text-green-700",
      POST: "bg-blue-100 text-blue-700",
      PUT: "bg-amber-100 text-amber-700",
      DELETE: "bg-red-100 text-red-700"
    };
    return colors[method] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
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

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 bg-blue-900 text-blue-200 border-blue-700 px-4 py-1">
                 💻 Oplo.ai Developer Platform
               </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl font-normal text-white mb-6 leading-tight"
            >
              Ressources pour les<br/>
              <span className="text-white">développeurs</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-300 mb-10 leading-relaxed"
            >
              Intégrez Oplo.ai à vos systèmes grâce à nos APIs modernes et complètes. Découvrez la documentation technique, les guides d'intégration et les meilleures pratiques pour construire des solutions innovantes.
            </motion.p>



            {/* Code Sample */}
            <div className="mt-12 relative">
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  opacity: [0.5, 0.7, 0.5]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -inset-20 bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-purple-500/20 blur-3xl rounded-3xl"
              />
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                animate={{
                  rotateX: -10,
                  rotateY: 8,
                  rotateZ: 2,
                  translateZ: 20
                }}
                className="relative rounded-2xl bg-gradient-to-b from-gray-800 to-gray-950 p-6 text-left overflow-hidden border border-gray-700"
                style={{
                  perspective: '1200px',
                  transformStyle: 'preserve-3d',
                  boxShadow: `
                    0 25px 50px rgba(0, 0, 0, 0.5),
                    inset 0 1px 0 rgba(255, 255, 255, 0.05),
                    0 0 60px rgba(34, 211, 238, 0.15),
                    0 0 120px rgba(59, 130, 246, 0.1)
                  `
                }}
              >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none rounded-2xl" />
              <div className="absolute top-0 left-1/2 w-1/2 h-1/2 bg-gradient-to-b from-blue-400/10 to-transparent blur-2xl pointer-events-none rounded-full -translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                  <span className="ml-auto text-xs text-gray-400">Node.js</span>
                </div>
                <pre className="text-sm text-green-400 overflow-x-auto font-mono">
{`const oplo = require('@oplo/sdk');

// Initialize client
const client = new oplo.Client({
  apiKey: 'your_api_key'
});

// Get restaurants
const restaurants = await client.restaurants.list();

// Get real-time KPIs
const kpis = await client.kpis.get({
  restaurantId: 'rest_123',
  period: 'today'
});`}
                </pre>
              </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation */}
      <section className="py-20 px-6 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-normal text-white mb-4">
                Documentation
              </h2>
              <p className="text-base text-gray-300 mb-8">
                Accédez à notre documentation complète pour intégrer Oplo.ai dans vos applications :
              </p>

              <div className="space-y-0 divide-y divide-gray-700">
                {apiDocs.map((doc, idx) => (
                  <motion.a
                    key={idx}
                    href="#"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex items-center justify-between py-4 hover:opacity-80 transition group"
                  >
                    <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition">
                      {doc.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-white flex-shrink-0" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-8 h-full"
            >
              <div className="text-center">
                <Code className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Prêt à intégrer ?</h3>
                <p className="text-sm text-gray-400">Commencez à construire avec nos APIs dès aujourd'hui</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GitHub Section */}
      <section className="py-20 px-6 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end">
              {/* GitHub */}
              <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-right max-w-md ml-auto"
            >
              <h2 className="text-3xl font-normal text-white mb-2">
                Découvrez nos Repositories
              </h2>
              <p className="text-base text-gray-300 mb-4 leading-relaxed">
                Explorez nos exemples de code, SDKs officiels et projets open-source sur GitHub. Trouvez des ressources, des templates et des bonnes pratiques pour vos intégrations.
              </p>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white border-b border-white hover:text-gray-300 hover:border-gray-300 transition"
              >
                Visiter GitHub
                <ArrowRight className="w-4 h-4" />
              </a>
              </motion.div>
              </div>
        </div>
      </section>



      {/* Developer Blog */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-normal text-white mb-4">
              Blog Développeurs
            </h2>
            <p className="text-lg text-gray-400">
              Actualités, tutoriels et bonnes pratiques
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto divide-y divide-gray-800">
            {blogPosts.map((post, idx) => (
              <motion.article
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="py-8 cursor-pointer group"
              >
                <Badge className="bg-blue-900 text-blue-300 mb-4">
                  {post.category}
                </Badge>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition">
                  {post.title}
                </h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-black border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-normal text-white mb-4">
              Scale Without Limits
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Découvrez comment Oplo.ai transforme des groupe de restaurants
            </p>
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              onClick={() => window.location.href = createPageUrl('QuoteQualification')}
            >
              Demander une démo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800 bg-black">
         <div className="max-w-7xl mx-auto text-center">
           <div className="flex items-center justify-center gap-2 mb-6">
             <svg width="32" height="32" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
               <rect x="20" y="40" width="75" height="130" rx="18" transform="rotate(-20 60 105)" fill="#7B8CFF"/>
               <rect x="90" y="30" width="75" height="130" rx="18" transform="rotate(20 127 95)" fill="#9EAFFF"/>
             </svg>
             <span className="text-xl font-bold text-white">Oplo.ai</span>
           </div>
           <p className="text-sm text-gray-500">
             © 2026 Oplo.ai · Restaurant Operating System
           </p>
         </div>
       </footer>
    </div>
  );
}