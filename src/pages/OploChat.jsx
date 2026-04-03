import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Send, 
  Sparkles, 
  RotateCcw, 
  Lightbulb,
  TrendingUp,
  Users,
  Target,
  ChefHat,
  Loader2,
  CheckCircle,
  Paperclip,
  X,
  BarChart2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import ViewAsUserBanner from '@/components/admin/ViewAsUserBanner';

const suggestedQuestions = [
  { icon: TrendingUp, text: "Comment augmenter mon chiffre d'affaires de 20% ?" },
  { icon: Users, text: "Comment fidéliser mes clients VIP ?" },
  { icon: Target, text: "Quels sont mes points faibles opérationnels ?" },
  { icon: ChefHat, text: "Comment optimiser ma carte pour maximiser les marges ?" },
];

const ONBOARDING_QUESTIONS = [
  "Parfait ! Pour commencer, quel est le **nom de votre groupe** de restaurants et dans quelle(s) **ville(s) ou pays** êtes-vous présents ?",
  "Combien de **restaurants** comptez-vous dans votre groupe, et quel est le **concept** (type de cuisine, ambiance) ?",
  "Parlez-moi de vos **chiffres clés** : quel est votre **CA mensuel moyen** par restaurant, votre **ticket moyen** et le nombre de **couverts par jour** en moyenne ?",
  "Combien d'**employés** avez-vous au total ? Et quelle est la répartition approximative entre cuisine, salle et management (en %) ?",
  "Quels **logiciels** utilisez-vous ? (caisse/POS, planning, comptabilité, stock) Avez-vous la **livraison** ou le **click & collect** actifs ?",
  "Quels sont vos **3 principaux objectifs** pour les 12 prochains mois, et quels sont vos **best-sellers** ?",
];

export default function OploChat() {
  const urlParams = new URLSearchParams(window.location.search);
  const isOnboardingMode = urlParams.get('onboarding') === '1';
  const isEnrichMode = urlParams.get('mode') === 'enrich';

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [onboardingData, setOnboardingData] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['onboarding', currentUser?.email],
    queryFn: () => base44.entities.OnboardingProfile.filter({ created_by: currentUser.email }, '-created_date', 1),
    enabled: !!currentUser?.email
  });

  const existingProfile = profiles[0] || null;

  const { data: restaurants = [] } = useQuery({
    queryKey: ['restaurants', currentUser?.email],
    queryFn: () => base44.entities.Restaurant.filter({ created_by: currentUser.email }, '-created_date'),
    enabled: !!currentUser?.email
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start onboarding flow on mount if mode is active and no profile yet
  useEffect(() => {
    if (isOnboardingMode && !existingProfile && messages.length === 0) {
      const intro = `Bonjour ! 👋 Je suis **Oplo.ai**, votre consultant IA pour la restauration.\n\nPour personnaliser votre tableau de bord avec vos **vraies données**, je vais vous poser quelques questions rapides (environ 2 minutes).\n\n${ONBOARDING_QUESTIONS[0]}`;
      setMessages([{ role: 'assistant', content: intro }]);
      setOnboardingStep(1);
    }
  }, [isOnboardingMode, existingProfile]);

  // Start enrich mode if requested
  useEffect(() => {
    if (isEnrichMode && existingProfile && messages.length === 0) {
      const intro = `Bonjour ! 👋 Je suis prêt à **enrichir votre tableau de bord** avec vos vraies données.\n\nPartagez vos **exports de caisse, fichiers Excel ou CSV** (revenus, ventes par produit, sources de trafic) et je mettrai automatiquement à jour :\n\n• 📈 **Évolution du revenu** (mensuelle/annuelle)\n• 🥧 **Sources de trafic** (Google, réseaux sociaux, walk-in...)\n• 🏆 **Produits les plus vendus**\n• 🍽️ **Évolution de la carte** (nouveaux plats, performances)\n• 💡 **Smart Insights** personnalisés\n\nCommencez par **joindre un fichier** ou **décrire vos données**.`;
      setMessages([{ role: 'assistant', content: intro }]);
    }
  }, [isEnrichMode, existingProfile]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setIsUploading(true);
    const uploaded = [];
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      uploaded.push({ name: file.name, url: file_url });
    }
    setUploadedFiles(prev => [...prev, ...uploaded]);
    setIsUploading(false);
  };

  const extractAndSaveDashboardData = async (conversationText, fileUrls) => {
    const extractionPrompt = `Tu es un expert en analyse de données de restauration. À partir des documents et conversations fournis, extrait les données structurées pour mettre à jour le tableau de bord.

Conversation et contexte :
${conversationText}

Extrait UNIQUEMENT les données clairement présentes dans les fichiers/conversation. Si une donnée n'est pas disponible, ne l'inclus pas (null).

Pour revenue_chart_data : tableau de 12 mois avec {month: "Jan", revenue: 12000, lastYear: 10000}
Pour traffic_sources_data : [{name: "Google", value: 35}, {name: "Réseaux sociaux", value: 25}...] (total = 100%)
Pour top_products_data : [{name: "...", sales: 120, revenue: 4800, trend: 12}...]
Pour menu_items_data : {new_dishes: 5, removed_dishes: 2, total_dishes: 42, top_performers: [{name, sales, growth, revenue}], underperformers: [{name, sales, growth, action}], ai_recommendations: ["..."]}`;

    const extracted = await base44.integrations.Core.InvokeLLM({
      prompt: extractionPrompt,
      file_urls: fileUrls,
      response_json_schema: {
        type: "object",
        properties: {
          revenue_chart_data: { type: "string" },
          traffic_sources_data: { type: "string" },
          top_products_data: { type: "string" },
          menu_items_data: { type: "string" }
        }
      }
    });

    const updates = {};
    if (extracted.revenue_chart_data) updates.revenue_chart_data = extracted.revenue_chart_data;
    if (extracted.traffic_sources_data) updates.traffic_sources_data = extracted.traffic_sources_data;
    if (extracted.top_products_data) updates.top_products_data = extracted.top_products_data;
    if (extracted.menu_items_data) updates.menu_items_data = extracted.menu_items_data;

    if (Object.keys(updates).length > 0 && existingProfile?.id) {
      await base44.entities.OnboardingProfile.update(existingProfile.id, updates);
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
    }
    return updates;
  };

  const extractAndSaveProfile = async (collectedData) => {
    try {
      const prompt = `À partir de ces réponses d'un restaurateur lors d'un onboarding, extrais les données structurées.

Réponses collectées :
${Object.entries(collectedData).map(([q, a]) => `Q: ${q}\nR: ${a}`).join('\n\n')}

Extrait les données suivantes. Si une valeur n'est pas clairement mentionnée, mets null.`;

      const extracted = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            group_name: { type: "string" },
            countries: { type: "string" },
            total_restaurants: { type: "number" },
            group_concept: { type: "string" },
            avg_monthly_revenue: { type: "number" },
            avg_ticket: { type: "number" },
            avg_covers_per_day: { type: "number" },
            total_employees: { type: "number" },
            kitchen_staff_pct: { type: "number" },
            floor_staff_pct: { type: "number" },
            manager_staff_pct: { type: "number" },
            pos_system: { type: "string" },
            planning_software: { type: "string" },
            accounting_software: { type: "string" },
            stock_software: { type: "string" },
            has_delivery: { type: "boolean" },
            has_takeaway: { type: "boolean" },
            main_objectives: { type: "string" },
            best_sellers: { type: "string" },
          }
        }
      });

      const profileData = { ...extracted, status: 'completed', contact_email: currentUser?.email };
      // Remove null values
      Object.keys(profileData).forEach(k => { if (profileData[k] === null) delete profileData[k]; });

      if (existingProfile?.id) {
        await base44.entities.OnboardingProfile.update(existingProfile.id, profileData);
      } else {
        await base44.entities.OnboardingProfile.create(profileData);
      }
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
    } catch (e) {
      // silent fail
    }
  };

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = { role: 'user', content: messageText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    // ONBOARDING MODE
    if (isOnboardingMode && !onboardingDone && onboardingStep > 0) {
      const currentQuestion = ONBOARDING_QUESTIONS[onboardingStep - 1];
      const newData = { ...onboardingData, [currentQuestion]: messageText };
      setOnboardingData(newData);

      const nextStep = onboardingStep + 1;

      if (nextStep <= ONBOARDING_QUESTIONS.length) {
        setOnboardingStep(nextStep);
        const nextQ = ONBOARDING_QUESTIONS[nextStep - 1];
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'assistant', content: nextQ }]);
          setIsTyping(false);
        }, 600);
      } else {
        // All questions answered - extract and save
        setOnboardingDone(true);
        await extractAndSaveProfile(newData);
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `✅ **Parfait ! Votre profil est configuré.**\n\nJ'ai mis à jour votre tableau de bord avec vos données réelles. Vous pouvez maintenant consulter vos métriques personnalisées.\n\nMaintenant que je vous connais mieux, posez-moi n'importe quelle question sur votre business !`
          }]);
          setIsTyping(false);
        }, 1000);
      }
      return;
    }

    // ENRICH MODE
    if (isEnrichMode) {
      try {
        const fileUrls = uploadedFiles.map(f => f.url);
        const conversationHistory = [...newMessages].map(m => `${m.role === 'user' ? 'User' : 'Oplo'}: ${m.content}`).join('\n');

        // Try to extract and save dashboard data
        let updatedSections = {};
        if (fileUrls.length > 0 || messageText.length > 50) {
          updatedSections = await extractAndSaveDashboardData(conversationHistory, fileUrls);
        }

        const profileCtx = existingProfile ? `Groupe: ${existingProfile.group_name}, ${existingProfile.total_restaurants} restaurant(s), CA moyen: €${existingProfile.avg_monthly_revenue || '?'}` : '';
        const enrichContext = `Tu es Oplo, assistant IA pour la restauration. Tu es en mode ENRICHISSEMENT DE DONNÉES DASHBOARD.
${profileCtx}

Sections mises à jour : ${Object.keys(updatedSections).join(', ') || 'aucune encore'}

Ton rôle :
1. Analyser les fichiers/données partagés par l'utilisateur
2. Confirmer ce que tu as extrait et mis à jour sur le dashboard
3. Demander les données manquantes de façon précise
4. Guider l'utilisateur vers un dashboard complet
5. Répondre TOUJOURS en français`;

        const response = await base44.integrations.Core.InvokeLLM({
          prompt: `${enrichContext}\n\nMessage utilisateur: ${messageText}`,
          file_urls: fileUrls.length > 0 ? fileUrls : undefined
        });

        const updatedNames = {
          revenue_chart_data: '📈 Évolution du revenu',
          traffic_sources_data: '🥧 Sources de trafic',
          top_products_data: '🏆 Produits les plus vendus',
          menu_items_data: '🍽️ Évolution de la carte'
        };

        let confirmMsg = response;
        if (Object.keys(updatedSections).length > 0) {
          const sections = Object.keys(updatedSections).map(k => updatedNames[k] || k).join(', ');
          confirmMsg = `✅ **Dashboard mis à jour !** J'ai enrichi les sections : ${sections}\n\n${response}`;
        }

        setMessages(prev => [...prev, { role: 'assistant', content: confirmMsg }]);
        setUploadedFiles([]);
      } catch (error) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Désolé, une erreur s'est produite lors de l'analyse. Réessayez." }]);
      } finally {
        setIsTyping(false);
      }
      return;
    }

    // STANDARD MODE
    try {
      const profileContext = existingProfile ? `
Groupe : ${existingProfile.group_name || 'N/A'} | Restaurants : ${existingProfile.total_restaurants || restaurants.length}
CA mensuel moyen : ${existingProfile.avg_monthly_revenue ? `€${existingProfile.avg_monthly_revenue}` : 'N/A'} | Ticket moyen : ${existingProfile.avg_ticket ? `€${existingProfile.avg_ticket}` : 'N/A'}
Couverts/jour : ${existingProfile.avg_covers_per_day || 'N/A'} | Employés : ${existingProfile.total_employees || 'N/A'}
POS : ${existingProfile.pos_system || 'N/A'} | Objectifs : ${existingProfile.main_objectives || 'N/A'}
` : `Restaurants en base : ${restaurants.map(r => r.name).join(', ') || 'Aucun'}`;

      const context = `Tu es Oplo, un consultant IA d'élite pour la restauration, avec l'expertise combinée de McKinsey, BCG et Bain.

Données client :
${profileContext}

Règles :
1. Réponds TOUJOURS en français
2. Sois concis mais stratégique
3. Donne des conseils actionnables et chiffrés quand possible
4. Utilise le framework COMPAST (Customer, Operations, Market, Product, Alignment, Sales, Team)
5. Sois proactif : suggère des analyses complémentaires`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${context}\n\nQuestion : ${messageText}`
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Désolé, une erreur s'est produite. Veuillez réessayer." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setOnboardingStep(0);
    setOnboardingDone(false);
    setOnboardingData({});
  };

  const showWelcome = messages.length === 0 && !isOnboardingMode && !isEnrichMode;

  return (
    <div className="space-y-6">
      <ViewAsUserBanner />
      <div className="h-[calc(100vh-10rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Oplo.ai</h1>
            <p className="text-sm text-gray-500">
              {isEnrichMode
                ? '📊 Mode enrichissement des données dashboard'
                : isOnboardingMode && !onboardingDone
                  ? `Configuration de votre profil (${Math.min(onboardingStep, ONBOARDING_QUESTIONS.length)}/${ONBOARDING_QUESTIONS.length})`
                  : 'Votre consultant IA personnel'}
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={resetChat} className="text-gray-400 hover:text-gray-900">
            <RotateCcw className="w-4 h-4 mr-2" />
            Nouvelle conversation
          </Button>
        )}
      </div>

      {/* Progress bar for onboarding */}
      {isOnboardingMode && !onboardingDone && onboardingStep > 0 && (
        <div className="mb-4">
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500"
              style={{ width: `${(Math.min(onboardingStep, ONBOARDING_QUESTIONS.length) / ONBOARDING_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 rounded-2xl bg-white border border-gray-200 overflow-hidden flex flex-col">
        {showWelcome ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue sur Oplo.ai</h2>
            <p className="text-gray-600 text-center max-w-md mb-8">
              Je suis votre consultant IA avec l'expertise des meilleurs cabinets de conseil.
              Posez-moi n'importe quelle question sur votre business.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 w-full max-w-2xl">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q.text)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                    <q.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{q.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message, i) => (
              <div key={i} className={cn("flex gap-4", message.role === 'user' ? 'justify-end' : 'justify-start')}>
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-5 py-3",
                  message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                )}>
                  {message.role === 'assistant' ? (
                    <ReactMarkdown className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:marker:text-blue-600">
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-5 py-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Oplo réfléchit...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          {/* Uploaded files preview */}
          {uploadedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {uploadedFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                  <Paperclip className="w-3 h-3" />
                  <span className="max-w-[120px] truncate">{f.name}</span>
                  <button onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))}>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isEnrichMode
                  ? "Décrivez vos données ou joignez un fichier (Excel, CSV, PDF)..."
                  : isOnboardingMode && !onboardingDone
                    ? "Votre réponse..."
                    : "Posez votre question à Oplo..."
              }
              className="min-h-[56px] max-h-[200px] resize-none bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-900 placeholder:text-gray-500"
              style={{ paddingRight: isEnrichMode ? '6rem' : '3.5rem' }}
              rows={1}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              {isEnrichMode && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls,.pdf,.jpg,.jpeg,.png"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    size="icon"
                    variant="ghost"
                    className="w-9 h-9 rounded-xl text-gray-400 hover:text-blue-600"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                  </Button>
                </>
              )}
              <Button
                onClick={() => sendMessage(input)}
                disabled={(!input.trim() && uploadedFiles.length === 0) || isTyping}
                size="icon"
                className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
          {isEnrichMode ? (
            <p className="text-xs text-blue-600 mt-2 text-center">
              📎 Joignez exports de caisse, Excel ou CSV pour enrichir automatiquement votre dashboard
            </p>
          ) : (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Oplo combine l'expertise McKinsey, BCG et Bain pour vos décisions stratégiques
            </p>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}