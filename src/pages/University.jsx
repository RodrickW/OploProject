import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Zap,
  Target,
  Users,
  Clock,
  BookOpen,
  Globe,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function University() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const benefits = [
    {
      icon: Users,
      title: "Autonomie",
      description: "Que vous formiez des nouvelles recrues ou des employés plus expérimentés, offrez à votre personnel la liberté d'acquérir de nouvelles compétences à leur rythme, où et quand ils le souhaitent."
    },
    {
      icon: Zap,
      title: "Rentabilité",
      description: "Les nouveaux membres du personnel se forment en autonomie via les modules d'apprentissage en ligne. Vous n'avez plus besoin de mobiliser des employés déjà bien occupés, ce qui réduisait leur productivité."
    },
    {
      icon: Target,
      title: "Adaptation",
      description: "Cours interactifs en direct, démonstrations, vidéos, quiz ou encore mises en pratiques concrètes, il y en a pour tous les goûts et chaque apprenant y trouve son compte."
    }
  ];

  const programFeatures = [
    {
      icon: Clock,
      title: "Cours rapides et efficaces",
      description: "Votre temps est précieux. C'est pourquoi les parcours d'apprentissage basés sur les fonctions proposent des cours en ligne qui durent moins de 30 minutes en moyenne, ainsi que des sessions en direct facultatives pour aller plus loin."
    },
    {
      icon: Lightbulb,
      title: "Formation ciblée",
      description: "Les modules se concentrent sur 90 % de vos tâches, afin que votre personnel soit compétent et serein dans ses activités."
    },
    {
      icon: Globe,
      title: "Plateforme multilingue",
      description: "Formez-vous dans votre langue. Les cours sont disponibles en cinq langues : français, anglais, allemand, espagnol et néerlandais."
    }
  ];

  const easyToUseFeatures = [
    {
      icon: Lightbulb,
      title: "Prise en compte des commentaires",
      description: "Votre expérience est notre priorité et peut influencer la conception des futurs modules. Évaluez les cours et donnez votre avis au fur et à mesure de votre progression."
    },
    {
      icon: Users,
      title: "Fini les équipes surchargées",
      description: "Grâce à nos cours à suivre en autonomie, le personnel se forme à son rythme, quand il le souhaite. Vous n'avez plus besoin de mobiliser vos employés expérimentés pendant leur service."
    },
    {
      icon: AlertCircle,
      title: "Réduction des erreurs humaines",
      description: "Les erreurs surviennent lorsque les employés ne savent pas comment utiliser un logiciel. Avec Oplo.ai University, plus de place au doute : vos équipes savent ce qu'elles font et commettent moins d'erreurs."
    },
    {
      icon: CheckCircle,
      title: "Empowerment des équipes",
      description: "Donnez les moyens à vos équipes de réussir avec une formation ludique et ciblée sur son poste, afin qu'ils se sentent bien préparés dès le départ."
    }
  ];

  const autonomousLearning = [
    {
      icon: Clock,
      title: "Flexibilité",
      description: "Accédez au contenu en ligne sur n'importe quel appareil, à tout moment. Même le personnel de nuit peut se former pendant ses heures de travail ou à distance."
    },
    {
      icon: Users,
      title: "Formation à son rythme",
      description: "Nous n'apprenons pas tous de la même manière, c'est pourquoi Oplo.ai University s'adapte à la diversité des besoins. Chacun peut suivre ses parcours à son rythme."
    },
    {
      icon: Lightbulb,
      title: "Sessions en direct facultatives",
      description: "Si vous avez des questions, nos experts animent des cours en direct facultatifs pour vous apporter une assistance immédiate, des réponses et des conseils."
    },
    {
      icon: BookOpen,
      title: "Intuitivité",
      description: "Oplo.ai University est tellement simple à utiliser que le personnel sait exactement comment avancer dans la formation et reprendre là où il s'est arrêté, sans supervision."
    }
  ];

  const testimonials = [
    {
      quote: "J'adore la façon dont Oplo.ai University explique les choses. Un point très important : les instructions étape par étape sont parfaites pour les débutants.",
      author: "Marco Metge",
      role: "Directeur senior des opérations, District Living"
    },
    {
      quote: "Nous apprécions vraiment Oplo.ai University. Apprendre depuis chez soi, c'est l'idéal : on peut se plonger dans les cours bien installé, une boisson à la main.",
      author: "Aziz Chaer",
      role: "Fondateur, Grend"
    },
    {
      quote: "Nous avons travaillé avec plusieurs fournisseurs PMS, et Oplo.ai University offre la meilleure formation. C'est tellement simple que nos employés n'avaient presque pas de questions.",
      author: "Daniel Schleser",
      role: "Expert des processus hôteliers numériques"
    }
  ];

  const updatesFeatures = [
    {
      icon: RotateCcw,
      title: "Mises à jour régulières",
      description: "Les cours d'Oplo.ai University suivent le rythme des nouvelles fonctionnalités produit. Ainsi, vous maîtrisez tous les processus, même les plus récents."
    },
    {
      icon: Bookmark,
      title: "Formation continue",
      description: "Accessible à tout moment, Oplo.ai University est votre guide de référence. Que vous souhaitiez suivre de nouveaux cours ou rafraîchir vos connaissances, une seule adresse : Oplo.ai University."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
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

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight"
          >
            Oplo.ai University
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl text-gray-700 mb-4"
          >
            Formez votre personnel et libérez son potentiel
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Si vous souhaitez que vos employés offrent des expériences remarquables aux clients, il faut leur en donner les moyens. Avec Oplo.ai University, vos équipes prennent en main la plateforme rapidement. Elles passent donc moins de temps sur les écrans, mais plus de temps avec les clients.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              Demander une démo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-gray-300">
              Connexion client
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-blue-50/30 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-black text-gray-900 mb-4 text-center"
          >
            Avantages de Oplo.ai University
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 mb-16 text-center max-w-3xl mx-auto"
          >
            Oplo.ai University facilite l'intégration et la formation des employés, quel que soit leur niveau d'expérience, afin que vos équipes soient toujours prêtes à offrir un service impeccable.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="rounded-2xl border border-blue-200 bg-white p-8 shadow-sm hover:shadow-md transition"
              >
                <benefit.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-black mb-6"
          >
            Connectez-vous à Oplo.ai University
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg mb-10 leading-relaxed opacity-95"
          >
            Vous voulez démarrer (ou reprendre là où vous en étiez) ? Connectez-vous à votre compte pour continuer votre apprentissage, découvrir de nouveaux modules ou les dernières mises à jour. Nous ajoutons de nouveaux contenus en permanence afin de vous aider à tirer le meilleur parti d'Oplo.ai.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Accéder à Oplo.ai University
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4">Programmes basés sur les fonctions</h2>
            <p className="text-xl text-gray-700">Maîtrisez Oplo.ai en un rien de temps</p>
            <p className="text-lg text-gray-600 mt-4">Vos nouveaux employés sont rapidement opérationnels grâce à une formation basée sur leurs fonctions, accessible sans frais supplémentaires. Avec nos parcours d'apprentissage sur mesure, les équipes deviennent rapidement expertes de la plateforme. Confiantes dans leurs capacités, elles peuvent offrir des expériences exceptionnelles aux clients.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {programFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition"
              >
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-3xl mx-auto">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border-l-4 border-blue-600 bg-white p-8 shadow-sm"
          >
            <p className="text-xl text-gray-900 mb-6 leading-relaxed font-medium">
              "Oplo.ai University est une ressource formidable. Selon moi, la satisfaction d'un utilisateur de logiciel dépend bien souvent de sa capacité à savoir l'utiliser. Il est donc dans notre intérêt de veiller à ce que les employés maîtrisent Oplo.ai sur le bout des doigts, et c'est exactement ce que permet Oplo.ai University."
            </p>
            <footer className="text-gray-600">
              <strong>Fredrik Ternsjö</strong><br/>
              <span className="text-sm">Ligula Hospitality Group</span>
            </footer>
          </motion.blockquote>
        </div>
      </section>

      {/* Easy to Use Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4">Plateforme conçue pour être facile à utiliser</h2>
            <p className="text-lg text-gray-600 mt-4">Saviez-vous que les employés ayant vécu une expérience positive lors de leur intégration étaient 18 fois plus engagés envers leur entreprise et 38 % plus efficaces dans leur travail ? Oplo.ai University offre à votre personnel une formation ludique et ciblée sur son poste, afin qu'il se sente bien préparé dès le départ.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {easyToUseFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition"
              >
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-black text-gray-900 mb-4 text-center"
          >
            Ne nous croyez pas sur parole
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 text-center mb-16 max-w-3xl mx-auto"
          >
            Lisez les témoignages des clients d'Oplo.ai.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition"
              >
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                <footer>
                  <strong className="text-gray-900">{testimonial.author}</strong><br/>
                  <span className="text-sm text-gray-600">{testimonial.role}</span>
                </footer>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Autonomous Learning */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4">Cours en autonomie</h2>
            <p className="text-xl text-gray-700">Apprenez à votre rythme</p>
            <p className="text-lg text-gray-600 mt-4">Développez vos connaissances à tout moment, où que vous soyez. Tous les contenus sont disponibles en ligne, afin que les employés puissent se former à leur rythme et reprendre là où ils se sont arrêtés.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {autonomousLearning.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition"
              >
                <item.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Updates Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4">Mises à jour régulières</h2>
            <p className="text-xl text-gray-700">Suivez l'évolution des produits</p>
            <p className="text-lg text-gray-600 mt-4">La formation ne se limite pas à la période d'intégration. Actualisée en permanence, Oplo.ai University est votre ressource de référence pour les dernières sorties produit, les nouveaux services et développements d'Oplo.ai. Vous y trouverez toutes les explications.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {updatesFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="rounded-2xl border border-blue-200 bg-white p-8 shadow-sm hover:shadow-md transition"
              >
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-black mb-4"
          >
            Make it remarkable.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg mb-10 opacity-95"
          >
            Vous voulez adopter une approche de l'hôtellerie plus efficace, plus flexible et centrée sur le client ?
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Demander une démo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}