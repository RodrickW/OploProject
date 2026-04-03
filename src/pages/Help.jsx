import React, { useState } from 'react';
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

const faqItems = [
  {
    question: "Comment ajouter un nouveau restaurant ?",
    answer: "Rendez-vous dans la section 'Mes Restaurants' depuis le dashboard, puis cliquez sur 'Ajouter un restaurant'. Remplissez les informations requises et validez."
  },
  {
    question: "Comment fonctionne l'IA Oplo.ai ?",
    answer: "Oplo.ai est votre consultant IA personnel. Il analyse vos données en temps réel et vous fournit des conseils stratégiques basés sur les meilleures pratiques de cabinets comme McKinsey."
  },
  {
    question: "Comment interpréter les insights ?",
    answer: "Les insights sont classés par priorité (critique, important, moyen, info). Concentrez-vous d'abord sur les insights critiques qui ont le plus d'impact sur votre business."
  },
  {
    question: "Puis-je exporter mes données ?",
    answer: "Oui, vous pouvez exporter vos données au format CSV ou PDF depuis chaque section. Cliquez sur le bouton 'Exporter' en haut à droite des tableaux."
  },
  {
    question: "Comment contacter le support ?",
    answer: "Vous pouvez nous contacter via le chat en direct, par email à support@oplo.ai, ou en planifiant un appel avec notre équipe."
  }
];

const resources = [
  { icon: Book, title: "Documentation", description: "Guides complets et tutoriels", href: "#" },
  { icon: Video, title: "Vidéos", description: "Tutoriels vidéo pas à pas", href: "#" },
  { icon: MessageCircle, title: "Communauté", description: "Échangez avec d'autres utilisateurs", href: "#" },
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Aide & Support</h1>
        <p className="text-gray-500 mt-1">Comment pouvons-nous vous aider ?</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Rechercher dans l'aide..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button className="rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 border border-blue-300 p-5 text-left hover:border-blue-400 transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-200">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Demander à Oplo.ai</h3>
          </div>
          <p className="text-sm text-gray-600">Notre IA peut répondre à vos questions instantanément</p>
          <ChevronRight className="w-5 h-5 text-gray-400 mt-3 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </button>

        <button className="rounded-xl bg-white border border-gray-200 p-5 text-left hover:border-gray-300 transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-cyan-100">
              <MessageCircle className="w-5 h-5 text-cyan-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Chat en direct</h3>
          </div>
          <p className="text-sm text-gray-600">Parlez à un conseiller en temps réel</p>
          <ChevronRight className="w-5 h-5 text-gray-400 mt-3 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" />
        </button>

        <button className="rounded-xl bg-white border border-gray-200 p-5 text-left hover:border-gray-300 transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-emerald-100">
              <Phone className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Planifier un appel</h3>
          </div>
          <p className="text-sm text-gray-600">Réservez un créneau avec notre équipe</p>
          <ChevronRight className="w-5 h-5 text-gray-400 mt-3 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      {/* FAQ */}
      <div className="rounded-xl bg-white border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Questions fréquentes</h2>
        <Accordion type="single" collapsible className="space-y-2">
          {faqItems.map((item, i) => (
            <AccordionItem 
              key={i} 
              value={`item-${i}`}
              className="border border-gray-200 rounded-lg px-4 data-[state=open]:bg-gray-50"
            >
              <AccordionTrigger className="text-gray-900 hover:no-underline py-4">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Resources */}
      <div className="rounded-xl bg-white border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ressources</h2>
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

      {/* Contact */}
      <div className="rounded-xl bg-white border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Nous contacter</h2>
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