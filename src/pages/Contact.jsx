import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin,
  Send,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulation d'envoi
    setTimeout(() => {
      setSubmitted(true);
    }, 500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "contact@oplo.ai",
      link: "mailto:contact@oplo.ai"
    },
    {
      icon: Phone,
      title: "Téléphone",
      content: "+33 1 84 80 12 34",
      link: "tel:+33184801234"
    },
    {
      icon: MapPin,
      title: "Adresse",
      content: "24 Rue du Sentier, 75002 Paris",
      link: "https://maps.google.com"
    }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Message envoyé !</h2>
          <p className="text-gray-600 mb-8">
            Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.
          </p>
          <Button 
            onClick={() => setSubmitted(false)}
            variant="outline"
            className="border-2 border-blue-600 text-blue-600"
          >
            Envoyer un autre message
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-300">
              Contactez-nous
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Parlons de votre projet
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Notre équipe d'experts est à votre écoute pour répondre à toutes vos questions 
              et vous accompagner dans votre transformation digitale.
            </p>
          </motion.div>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {contactInfo.map((info, idx) => {
              const Icon = info.icon;
              return (
                <motion.a
                  key={idx}
                  href={info.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="rounded-xl bg-white border border-gray-200 p-6 text-center hover:border-blue-300 hover:shadow-lg transition group"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-sm text-gray-600">{info.content}</p>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-white border border-gray-200 p-8 shadow-lg"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Envoyez-nous un message
            </h2>
            <p className="text-gray-600 mb-8">
              Remplissez le formulaire ci-dessous et nous vous répondrons dans les 24 heures
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <Input
                    required
                    placeholder="Jean"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <Input
                    required
                    placeholder="Dupont"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="jean.dupont@exemple.fr"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <Input
                    placeholder="+33 6 12 34 56 78"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entreprise
                </label>
                <Input
                  placeholder="Nom de votre entreprise"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet *
                </label>
                <Input
                  required
                  placeholder="Comment pouvons-nous vous aider ?"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <Textarea
                  required
                  placeholder="Décrivez votre projet ou vos besoins..."
                  className="h-32"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <div className="flex items-center gap-4">
                <Button 
                  type="submit"
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Envoyer le message
                  <Send className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-xs text-gray-500">
                  * Champs obligatoires
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-gray-600">
              Trouvez rapidement les réponses à vos questions
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                question: "Quel est le délai de réponse moyen ?",
                answer: "Nous répondons généralement sous 24 heures ouvrées à tous les messages reçus."
              },
              {
                question: "Proposez-vous des démonstrations personnalisées ?",
                answer: "Oui, nous offrons des démonstrations gratuites et personnalisées de notre plateforme selon vos besoins spécifiques."
              },
              {
                question: "Comment puis-je obtenir un devis ?",
                answer: "Utilisez notre formulaire de qualification ou contactez-nous directement pour recevoir un devis personnalisé sous 48h."
              },
              {
                question: "Avez-vous un support technique disponible ?",
                answer: "Oui, notre équipe support est disponible par email, téléphone et chat du lundi au vendredi de 9h à 18h."
              }
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-xl bg-white border border-gray-200 p-6"
              >
                <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}