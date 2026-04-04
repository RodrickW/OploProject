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
  Paperclip,
  X,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import ViewAsUserBanner from '@/components/admin/ViewAsUserBanner';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';

const SUGGESTED_QUESTIONS = {
  fr: [
    { icon: TrendingUp, text: "Comment augmenter mon chiffre d'affaires de 20% ?" },
    { icon: Users, text: "Comment fidéliser mes clients VIP ?" },
    { icon: Target, text: "Quels sont mes points faibles opérationnels ?" },
    { icon: ChefHat, text: "Comment optimiser ma carte pour maximiser les marges ?" },
  ],
  en: [
    { icon: TrendingUp, text: "How can I increase my revenue by 20%?" },
    { icon: Users, text: "How can I retain my VIP customers?" },
    { icon: Target, text: "What are my main operational weaknesses?" },
    { icon: ChefHat, text: "How can I optimise my menu to maximise margins?" },
  ],
};

const ONBOARDING_QUESTIONS = {
  fr: [
    "Parfait ! Pour commencer, quel est le **nom de votre groupe** de restaurants et dans quelle(s) **ville(s) ou pays** êtes-vous présents ?",
    "Combien de **restaurants** comptez-vous dans votre groupe, et quel est le **concept** (type de cuisine, ambiance) ?",
    "Parlez-moi de vos **chiffres clés** : quel est votre **CA mensuel moyen** par restaurant, votre **ticket moyen** et le nombre de **couverts par jour** en moyenne ?",
    "Combien d'**employés** avez-vous au total ? Et quelle est la répartition approximative entre cuisine, salle et management (en %) ?",
    "Quels **logiciels** utilisez-vous ? (caisse/POS, planning, comptabilité, stock) Avez-vous la **livraison** ou le **click & collect** actifs ?",
    "Quels sont vos **3 principaux objectifs** pour les 12 prochains mois, et quels sont vos **best-sellers** ?",
  ],
  en: [
    "Great! To start, what is the **name of your restaurant group** and in which **city or country** are you based?",
    "How many **restaurants** are in your group, and what is your **concept** (cuisine type, ambiance)?",
    "Tell me about your **key figures**: what is your **average monthly revenue** per restaurant, your **average ticket**, and **average covers per day**?",
    "How many **employees** do you have in total? What is the approximate split between kitchen, floor, and management (%)?",
    "What **software** do you use? (POS, scheduling, accounting, stock) Do you have **delivery** or **click & collect** active?",
    "What are your **3 main objectives** for the next 12 months, and what are your **best-sellers**?",
  ],
};

const UI_TEXT = {
  fr: {
    title: 'Oplo.ai',
    subtitle: 'Votre consultant IA personnel',
    subtitleEnrich: '📊 Mode enrichissement des données dashboard',
    subtitleOnboarding: (step, total) => `Configuration de votre profil (${step}/${total})`,
    welcome: 'Bienvenue sur Oplo.ai',
    welcomeSub: "Je suis votre consultant IA avec l'expertise des meilleurs cabinets de conseil. Posez-moi n'importe quelle question sur votre business.",
    newConversation: 'Nouvelle conversation',
    thinking: 'Oplo réfléchit...',
    placeholder: 'Posez votre question à Oplo...',
    placeholderOnboarding: 'Votre réponse...',
    placeholderEnrich: 'Décrivez vos données ou joignez un fichier (Excel, CSV, PDF)...',
    profileDone: "✅ **Parfait ! Votre profil est configuré.**\n\nJ'ai mis à jour votre tableau de bord avec vos données réelles. Vous pouvez maintenant consulter vos métriques personnalisées.\n\nMaintenant que je vous connais mieux, posez-moi n'importe quelle question sur votre business !",
    error: "Désolé, une erreur s'est produite. Veuillez réessayer.",
    introOnboarding: (q) => `Bonjour ! 👋 Je suis **Oplo.ai**, votre consultant IA pour la restauration.\n\nPour personnaliser votre tableau de bord avec vos **vraies données**, je vais vous poser quelques questions rapides (environ 2 minutes).\n\n${q}`,
    introEnrich: `Bonjour ! 👋 Je suis prêt à **enrichir votre tableau de bord** avec vos vraies données.\n\nPartagez vos **exports de caisse, fichiers Excel ou CSV** et je mettrai automatiquement à jour votre dashboard.\n\nCommencez par **joindre un fichier** ou **décrire vos données**.`,
    switchLang: 'English',
  },
  en: {
    title: 'Oplo.ai',
    subtitle: 'Your personal AI consultant',
    subtitleEnrich: '📊 Dashboard data enrichment mode',
    subtitleOnboarding: (step, total) => `Setting up your profile (${step}/${total})`,
    welcome: 'Welcome to Oplo.ai',
    welcomeSub: 'I am your AI consultant with the expertise of the world\'s top consulting firms. Ask me anything about your business.',
    newConversation: 'New conversation',
    thinking: 'Oplo is thinking...',
    placeholder: 'Ask Oplo a question...',
    placeholderOnboarding: 'Your answer...',
    placeholderEnrich: 'Describe your data or attach a file (Excel, CSV, PDF)...',
    profileDone: "✅ **Perfect! Your profile is set up.**\n\nI've updated your dashboard with your real data. You can now view your personalised metrics.\n\nNow that I know you better, ask me anything about your business!",
    error: 'Sorry, an error occurred. Please try again.',
    introOnboarding: (q) => `Hello! 👋 I'm **Oplo.ai**, your AI consultant for the restaurant industry.\n\nTo personalise your dashboard with your **real data**, I'll ask you a few quick questions (about 2 minutes).\n\n${q}`,
    introEnrich: `Hello! 👋 I'm ready to **enrich your dashboard** with your real data.\n\nShare your **POS exports, Excel or CSV files** and I'll automatically update your dashboard.\n\nStart by **attaching a file** or **describing your data**.`,
    switchLang: 'Français',
  },
};

async function streamChat(messages, systemPrompt, onChunk, onDone) {
  const response = await fetch('/api/chat/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, systemPrompt }),
  });

  if (!response.ok) throw new Error('Chat API error');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullContent = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      try {
        const event = JSON.parse(line.slice(6));
        if (event.content) {
          fullContent += event.content;
          onChunk(fullContent);
        }
        if (event.done) onDone(fullContent);
      } catch {}
    }
  }
}

async function extractProfile(collectedData, language) {
  const langNote = language === 'en' ? 'The answers are in English.' : 'Les réponses sont en français.';
  const prompt = `${langNote} From these restaurateur onboarding answers, extract structured data. If a value is not clearly mentioned, use null.

Answers:
${Object.entries(collectedData).map(([q, a]) => `Q: ${q}\nA: ${a}`).join('\n\n')}

Return JSON with: group_name, countries, total_restaurants, group_concept, avg_monthly_revenue, avg_ticket, avg_covers_per_day, total_employees, kitchen_staff_pct, floor_staff_pct, manager_staff_pct, pos_system, planning_software, accounting_software, stock_software, has_delivery, has_takeaway, main_objectives, best_sellers`;

  const res = await fetch('/api/chat/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  return res.ok ? res.json() : {};
}

export default function OploChat() {
  const urlParams = new URLSearchParams(window.location.search);
  const isOnboardingMode = urlParams.get('onboarding') === '1';
  const isEnrichMode = urlParams.get('mode') === 'enrich';

  const { language, changeLanguage } = useLanguage();
  const [chatLang, setChatLang] = useState(language);

  const ui = UI_TEXT[chatLang] || UI_TEXT.fr;
  const onboardingQuestions = ONBOARDING_QUESTIONS[chatLang] || ONBOARDING_QUESTIONS.fr;
  const suggestedQuestions = SUGGESTED_QUESTIONS[chatLang] || SUGGESTED_QUESTIONS.fr;

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
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
  }, [messages, streamingContent]);

  useEffect(() => {
    if (isOnboardingMode && !existingProfile && messages.length === 0) {
      const intro = ui.introOnboarding(onboardingQuestions[0]);
      setMessages([{ role: 'assistant', content: intro }]);
      setOnboardingStep(1);
    }
  }, [isOnboardingMode, existingProfile, chatLang]);

  useEffect(() => {
    if (isEnrichMode && existingProfile && messages.length === 0) {
      setMessages([{ role: 'assistant', content: ui.introEnrich }]);
    }
  }, [isEnrichMode, existingProfile, chatLang]);

  const toggleChatLang = () => {
    const next = chatLang === 'fr' ? 'en' : 'fr';
    setChatLang(next);
    changeLanguage(next);
  };

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

  const buildSystemPrompt = () => {
    const langInstruction = chatLang === 'en'
      ? 'Always respond in English.'
      : 'Réponds TOUJOURS en français.';

    const profileContext = existingProfile
      ? `Group: ${existingProfile.group_name || 'N/A'} | Restaurants: ${existingProfile.total_restaurants || restaurants.length}
Avg monthly revenue: ${existingProfile.avg_monthly_revenue ? `€${existingProfile.avg_monthly_revenue}` : 'N/A'} | Avg ticket: ${existingProfile.avg_ticket ? `€${existingProfile.avg_ticket}` : 'N/A'}
Covers/day: ${existingProfile.avg_covers_per_day || 'N/A'} | Employees: ${existingProfile.total_employees || 'N/A'}
POS: ${existingProfile.pos_system || 'N/A'} | Objectives: ${existingProfile.main_objectives || 'N/A'}`
      : `Restaurants on file: ${restaurants.map(r => r.name).join(', ') || 'None'}`;

    return `You are Oplo, an elite AI consultant for the restaurant industry, with the combined expertise of McKinsey, BCG and Bain. ${langInstruction}

Client data:
${profileContext}

Rules:
1. ${langInstruction}
2. Be concise but strategic
3. Give actionable, quantified advice where possible
4. Use the COMPAST framework (Customer, Operations, Market, Product, Alignment, Sales, Team)
5. Be proactive: suggest additional analyses`;
  };

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = { role: 'user', content: messageText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    setStreamingContent('');

    // ONBOARDING MODE
    if (isOnboardingMode && !onboardingDone && onboardingStep > 0) {
      const currentQuestion = onboardingQuestions[onboardingStep - 1];
      const newData = { ...onboardingData, [currentQuestion]: messageText };
      setOnboardingData(newData);

      const nextStep = onboardingStep + 1;

      if (nextStep <= onboardingQuestions.length) {
        setOnboardingStep(nextStep);
        const nextQ = onboardingQuestions[nextStep - 1];
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'assistant', content: nextQ }]);
          setIsTyping(false);
        }, 600);
      } else {
        setOnboardingDone(true);
        try {
          const extracted = await extractProfile(newData, chatLang);
          const profileData = { ...extracted, status: 'completed', contact_email: currentUser?.email };
          Object.keys(profileData).forEach(k => { if (profileData[k] === null) delete profileData[k]; });
          if (existingProfile?.id) {
            await base44.entities.OnboardingProfile.update(existingProfile.id, profileData);
          } else {
            await base44.entities.OnboardingProfile.create(profileData);
          }
          queryClient.invalidateQueries({ queryKey: ['onboarding'] });
        } catch {}
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'assistant', content: ui.profileDone }]);
          setIsTyping(false);
        }, 1000);
      }
      return;
    }

    // STANDARD & ENRICH MODE — use real OpenAI streaming
    try {
      const historyMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const systemPrompt = buildSystemPrompt();

      let assistantMessage = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, assistantMessage]);

      await streamChat(
        historyMessages,
        systemPrompt,
        (fullSoFar) => {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'assistant', content: fullSoFar };
            return updated;
          });
        },
        (finalContent) => {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'assistant', content: finalContent };
            return updated;
          });
        }
      );
    } catch (error) {
      setMessages(prev => {
        const updated = [...prev];
        if (updated[updated.length - 1]?.role === 'assistant' && !updated[updated.length - 1].content) {
          updated[updated.length - 1] = { role: 'assistant', content: ui.error };
        } else {
          updated.push({ role: 'assistant', content: ui.error });
        }
        return updated;
      });
    } finally {
      setIsTyping(false);
      setStreamingContent('');
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
    setStreamingContent('');
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
              <h1 className="text-xl font-bold text-gray-900">{ui.title}</h1>
              <p className="text-sm text-gray-500">
                {isEnrichMode
                  ? ui.subtitleEnrich
                  : isOnboardingMode && !onboardingDone
                    ? ui.subtitleOnboarding(Math.min(onboardingStep, onboardingQuestions.length), onboardingQuestions.length)
                    : ui.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleChatLang}
              data-testid="button-toggle-language"
              className="flex items-center gap-1.5 text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-medium">{ui.switchLang}</span>
            </Button>

            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetChat}
                data-testid="button-reset-chat"
                className="text-gray-400 hover:text-gray-900"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {ui.newConversation}
              </Button>
            )}
          </div>
        </div>

        {/* Progress bar for onboarding */}
        {isOnboardingMode && !onboardingDone && onboardingStep > 0 && (
          <div className="mb-4">
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500"
                style={{ width: `${(Math.min(onboardingStep, onboardingQuestions.length) / onboardingQuestions.length) * 100}%` }}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{ui.welcome}</h2>
              <p className="text-gray-600 text-center max-w-md mb-8">{ui.welcomeSub}</p>
              <div className="grid sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    data-testid={`button-suggested-question-${i}`}
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
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={cn(
                    "max-w-[80%] rounded-2xl px-5 py-3",
                    message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                  )}>
                    {message.role === 'assistant' ? (
                      message.content ? (
                        <ReactMarkdown className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:marker:text-blue-600">
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-500">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">{ui.thinking}</span>
                        </div>
                      )
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-5 py-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">{ui.thinking}</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
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
                data-testid="input-chat-message"
                placeholder={
                  isEnrichMode
                    ? ui.placeholderEnrich
                    : isOnboardingMode && !onboardingDone
                      ? ui.placeholderOnboarding
                      : ui.placeholder
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
                  data-testid="button-send-message"
                  className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40"
                >
                  {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
