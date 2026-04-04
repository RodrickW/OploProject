import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { 
  HelpCircle, 
  MessageCircle, 
  Book, 
  Video, 
  Mail,
  Phone,
  Search,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function Help() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [searchQuery, setSearchQuery] = useState('');

  const faqItems = [
    {
      question: isEn ? 'How do I add a new restaurant?' : 'Comment ajouter un nouveau restaurant ?',
      answer: isEn
        ? "Go to 'My Restaurants' from the dashboard, then click 'Add a restaurant'. Fill in the required information and confirm."
        : "Rendez-vous dans la section 'Mes Restaurants' depuis le dashboard, puis cliquez sur 'Ajouter un restaurant'. Remplissez les informations requises et validez."
    },
    {
      question: isEn ? 'How does Oplo.ai work?' : 'Comment fonctionne l\'IA Oplo.ai ?',
      answer: isEn
        ? 'Oplo.ai is your personal AI consultant. It analyses your data in real time and provides strategic advice based on best practices from top consultancies like McKinsey.'
        : 'Oplo.ai est votre consultant IA personnel. Il analyse vos données en temps réel et vous fournit des conseils stratégiques basés sur les meilleures pratiques de cabinets comme McKinsey.'
    },
    {
      question: isEn ? 'How do I interpret insights?' : 'Comment interpréter les insights ?',
      answer: isEn
        ? 'Insights are ranked by priority (critical, important, medium, info). Focus first on critical insights that have the greatest impact on your business.'
        : 'Les insights sont classés par priorité (critique, important, moyen, info). Concentrez-vous d\'abord sur les insights critiques qui ont le plus d\'impact sur votre business.'
    },
    {
      question: isEn ? 'Can I export my data?' : 'Puis-je exporter mes données ?',
      answer: isEn
        ? 'Yes, you can export your data in CSV or PDF format from each section. Click the \'Export\' button at the top right of tables.'
        : 'Oui, vous pouvez exporter vos données au format CSV ou PDF depuis chaque section. Cliquez sur le bouton \'Exporter\' en haut à droite des tableaux.'
    },
    {
      question: isEn ? 'How do I contact support?' : 'Comment contacter le support ?',
      answer: isEn
        ? 'You can contact us via live chat, by email at support@oplo.ai, or by scheduling a call with our team.'
        : 'Vous pouvez nous contacter via le chat en direct, par email à support@oplo.ai, ou en planifiant un appel avec notre équipe.'
    }
  ];

  const resources = [
    { icon: Book, title: isEn ? 'Documentation' : 'Documentation', description: isEn ? 'Complete guides and tutorials' : 'Guides complets et tutoriels', href: '#' },
    { icon: Video, title: isEn ? 'Videos' : 'Vidéos', description: isEn ? 'Step-by-step video tutorials' : 'Tutoriels vidéo pas à pas', href: '#' },
    { icon: MessageCircle, title: isEn ? 'Community' : 'Communauté', description: isEn ? 'Connect with other users' : 'Échangez avec d\'autres utilisateurs', href: '#' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{isEn ? 'Help & Support' : 'Aide & Support'}</h1>
        <p className="text-gray-500 mt-1">{isEn ? 'How can we help you?' : 'Comment pouvons-nous vous aider ?'}</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder={isEn ? 'Search the help center...' : 'Rechercher dans l\'aide...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button className="rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 border border-blue-300 p-5 text-left hover:border-blue-400 transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-200">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{isEn ? 'Ask Oplo.ai' : 'Demander à Oplo.ai'}</h3>
          </div>
          <p className="text-sm text-gray-600">{isEn ? 'Our AI can answer your questions instantly' : 'Notre IA peut répondre à vos questions instantanément'}</p>
          <ChevronRight className="w-5 h-5 text-gray-400 mt-3 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </button>

        <button className="rounded-xl bg-white border border-gray-200 p-5 text-left hover:border-gray-300 transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-cyan-100">
              <MessageCircle className="w-5 h-5 text-cyan-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{isEn ? 'Live chat' : 'Chat en direct'}</h3>
          </div>
          <p className="text-sm text-gray-600">{isEn ? 'Talk to an advisor in real time' : 'Parlez à un conseiller en temps réel'}</p>
          <ChevronRight className="w-5 h-5 text-gray-400 mt-3 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" />
        </button>

        <button className="rounded-xl bg-white border border-gray-200 p-5 text-left hover:border-gray-300 transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-emerald-100">
              <Phone className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{isEn ? 'Schedule a call' : 'Planifier un appel'}</h3>
          </div>
          <p className="text-sm text-gray-600">{isEn ? 'Book a slot with our team' : 'Réservez un créneau avec notre équipe'}</p>
          <ChevronRight className="w-5 h-5 text-gray-400 mt-3 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      <div className="rounded-xl bg-white border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{isEn ? 'Frequently asked questions' : 'Questions fréquentes'}</h2>
        <Accordion type="single" collapsible className="space-y-2">
          {faqItems.map((item, i) => (
            <AccordionItem 
              key={i} 
              value={`item-${i}`}
              className="border border-gray-200 rounded-lg px-4 data-[state=open]:bg-gray-50"
            >
              <AccordionTrigger className="text-gray-900 hover:no-underline py-4">{item.question}</AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-4">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="rounded-xl bg-white border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{isEn ? 'Resources' : 'Ressources'}</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {resources.map((resource, i) => (
            <a 
              key={i}
              href={resource.href}
              className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-gray-200">
                <resource.icon className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{resource.title}</p>
                <p className="text-xs text-gray-500">{resource.description}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{isEn ? 'Contact us' : 'Nous contacter'}</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3 text-gray-600">
            <Mail className="w-5 h-5" />
            <span>support@oplo.ai</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Phone className="w-5 h-5" />
            <span>+33 1 23 45 67 89</span>
          </div>
        </div>
      </div>
    </div>
  );
}
