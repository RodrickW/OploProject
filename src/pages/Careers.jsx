import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  MapPin, 
  Clock, 
  Briefcase,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Careers() {
  const jobs = [
    {
      id: 1,
      title: "Senior Product Manager",
      department: "Product",
      location: "Remote",
      type: "Full time",
      experience: "5+ ans",
      description: "Nous recherchons un Product Manager pour piloter notre roadmap et collaborer avec nos équipes tech et design.",
      skills: ["Product Strategy", "Agile", "Data Analysis", "UX/UI"]
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full time",
      experience: "3+ ans",
      description: "Nous recherchons un développeur pour concevoir et développer notre plateforme avec React, Node.js et AWS.",
      skills: ["React", "Node.js", "PostgreSQL", "AWS"]
    },
    {
      id: 3,
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full time",
      experience: "2+ ans",
      description: "Nous recherchons un CSM pour accompagner nos clients dans leur transformation digitale et assurer leur succès.",
      skills: ["Account Management", "SaaS", "Restaurant Industry", "Communication"]
    },
    {
      id: 4,
      title: "Sales Development Representative",
      department: "Sales",
      location: "Remote",
      type: "Full time",
      experience: "1+ an",
      description: "Nous recherchons un SDR pour identifier et qualifier de nouvelles opportunités commerciales dans la restauration.",
      skills: ["Prospection", "CRM", "Communication", "B2B Sales"]
    },
    {
      id: 5,
      title: "Head of Marketing",
      department: "Marketing",
      location: "Remote",
      type: "Full time",
      experience: "7+ ans",
      description: "Nous recherchons un Head of Marketing pour définir et exécuter notre stratégie de croissance en France et en Europe.",
      skills: ["Growth Marketing", "Brand Strategy", "Content Marketing", "Analytics"]
    },
    {
      id: 6,
      title: "Data Analyst",
      department: "Data",
      location: "Remote",
      type: "Part time",
      experience: "2+ ans",
      description: "Nous recherchons un Data Analyst pour analyser nos données clients et générer des insights actionnables.",
      skills: ["SQL", "Python", "Data Visualization", "Statistics"]
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "Croissance rapide",
      description: "Rejoignez une scale-up en forte croissance"
    },
    {
      icon: Users,
      title: "Équipe passionnée",
      description: "Travaillez avec des experts du secteur"
    },
    {
      icon: Zap,
      title: "Impact direct",
      description: "Vos contributions ont un impact immédiat"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-6 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-300">
              Nous recrutons
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Rejoignez l'aventure Oplo.ai
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Nous transformons l'industrie de la restauration avec l'intelligence artificielle. 
              Rejoignez une équipe ambitieuse et contribuez à façonner l'avenir de la gestion opérationnelle.
            </p>
          </motion.div>

          {/* Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-3">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200"
                >
                  <Icon className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">{benefit.title}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="pt-4 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Postes ouverts
            </h2>
            <p className="text-gray-600">
              {jobs.length} opportunités disponibles
            </p>
          </motion.div>

          <div className="space-y-4">
            {jobs.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="rounded-xl bg-white border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition group"
              >
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                      {job.title}
                    </h3>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 -ml-1">
                      Voir offre
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.department}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.type}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {job.experience}
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, skillIdx) => (
                    <Badge key={skillIdx} variant="outline" className="text-xs bg-gray-50">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-normal text-gray-900 mb-4">
              Vous ne trouvez pas le poste idéal ?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Envoyez-nous votre candidature spontanée, nous sommes toujours à la recherche de talents exceptionnels.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Candidature spontanée
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}