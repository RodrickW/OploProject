export const translations = {
  fr: {
    // Navigation - Sidebar
    nav: {
      dashboard: 'Dashboard',
      oploAI: 'Oplo.ai',
      insights: 'Insights',
      compastFramework: 'COMPAST Framework',
      customerSuccess: 'Customer Success',
      operations: 'Opérations',
      market: 'Marché',
      productService: 'Produit/Service',
      alignment: 'Alignement',
      sales: 'Ventes',
      team: 'Équipe',
      integrations: 'Intégrations',
      integrations_oplo: 'Intégrations Oplo',
      userManagement: 'Gestion Utilisateurs',
      teamManagement: "Gestion d'équipe",
      settings: 'Paramètres',
      notifications: 'Notifications',
      help: 'Aide',
      profile: 'Profil',
      collapse: 'Réduire',
      inventory: 'Inventaire',
    },

    // Navbar
    navbar: {
      solutions: 'Solutions',
      platform: 'Plateforme',
      resources: 'Ressources',
      about: 'À propos',
      pricing: 'Tarifs',
      login: 'Se connecter',
      requestDemo: 'Demander une démo',
      home: 'Accueil',
      contact: 'Contact',
      products: 'Produits',
      overview: 'Vue d\'ensemble',
      features: 'Fonctionnalités',
      explore: 'Explorer',
      company: 'Entreprise',
      discoverPlatform: 'Découvrez la plateforme',
      solutions_list: {
        generalManagers: 'Directeurs Généraux',
        generalManagersDesc: 'Pilotage global du groupe',
        revenueManagers: 'Revenue Managers',
        revenueManagersDesc: 'Optimisation du CA',
        itManagers: 'Responsables IT',
        itManagersDesc: 'Infrastructure & intégrations',
        fbManagers: 'Responsables F&B',
        fbManagersDesc: 'Pilotage opérationnel',
      },
      platform_products: [
        { name: "Gestion hôtelière (PMS)", icon: "🏨" },
        { name: "Revenue Management (RMS)", icon: "💰" },
        { name: "Point of Sale (POS)", icon: "💳" },
      ],
      platform_integrations: [
        { name: "Marketplace", icon: "🏪" },
        { name: "Open API", icon: "⚙️" },
      ],
      pmsOverview: 'Oplo.ai PMS',
      pmsDesc: "Découvrez la puissance et le potentiel de notre système de gestion hôtelière primé",
      resources_explore: [
        { name: "Blog", icon: "📝" },
        { name: "Recherche", icon: "🔍", page: "Search" },
        { name: "Oplo.ai University", icon: "🎓", page: "University" },
        { name: "Team As a Service", icon: "👥", page: "TeamAsAService" },
        { name: "Développeurs", icon: "💻", page: "Devs" },
      ],
      company_links: [
        { name: "À propos", icon: "ℹ️", page: "AboutOplo" },
        { name: "Partenariats", icon: "🤝", page: "Partners" },
        { name: "Carrières", icon: "💼", page: "Careers" },
        { name: "Contacts", icon: "📧", page: "Contact" },
        { name: "Affiliates", icon: "🌟", page: "Affiliates" },
      ],
    },

    // Mobile Nav
    mobileNav: {
      dashboard: 'Dashboard',
      chat: 'Chat',
      insights: 'Insights',
      profile: 'Profil',
    },

    // Dashboard
    dashboard: {
      title: 'Tableau de bord',
      subtitle: 'Vue d\'ensemble de vos',
      restaurants: 'restaurants',
      askOplo: 'Demander à Oplo.ai',
      metrics: {
        monthlyRevenue: 'CA mensuel estimé',
        coversPerDay: 'Couverts / jour',
        averageTicket: 'Ticket moyen',
        customersPerMonth: 'Clients / mois',
        totalStaff: 'Équipe totale',
        restaurants: 'Restaurants',
        perCover: 'Par couvert',
        completeOnboarding: "Complétez l'onboarding",
        avgPerResto: 'moy.',
        notProvided: 'Non renseigné',
        groupEstimate: 'Estimation groupe',
        employees: 'Employés',
        group: 'Groupe',
      },
      insights: {
        title: 'Smart Insights',
        seeAll: 'Voir tout',
        noInsights: 'Aucun insight pour le moment',
        insightsAppear: 'Les insights apparaîtront ici automatiquement',
      },
      myRestaurants: 'Mes restaurants',
      manage: 'Gérer',
      noRestaurants: 'Aucun restaurant ajouté',
      addRestaurant: 'Ajouter un restaurant',
      operationalProfile: 'Profil opérationnel',
      completeOnboardingPrompt: "Complétez l'onboarding pour voir vos données ici",
      delivery: 'Livraison',
      takeaway: 'À emporter',
      posSystem: 'POS / Caisse',
      teamDistribution: 'Répartition équipe',
      people: 'pers.',
      kitchen: 'Cuisine',
      floor: 'Salle',
      management: 'Management',
      mainObjectives: 'Objectifs principaux',
      bestSellers: 'Best-sellers déclarés',
      deliveryPlatforms: 'Plateformes livraison',
    },

    // Language Selector
    language: {
      label: 'Langue',
      fr: 'Français',
      en: 'English',
    },

    // Common
    common: {
      loading: 'Chargement...',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      add: 'Ajouter',
      search: 'Rechercher',
      seeAll: 'Voir tout',
      noData: 'Aucune donnée',
      error: 'Erreur',
      success: 'Succès',
      confirm: 'Confirmer',
      back: 'Retour',
    },

    // Onboarding Banner
    onboardingBanner: {
      text: 'Configurez Oplo.ai pour personnaliser votre dashboard selon votre groupe et vos restaurants',
      cta: 'Configurer maintenant',
    },

    // Welcome Popup
    welcome: {
      greeting: 'Ravi de vous voir',
      subtitle: 'Prêt à optimiser vos opérations aujourd\'hui ?',
      needHelp: 'Besoin d\'aide ?',
      assistantAvailable: 'Notre assistant IA est disponible 24/7',
      chatWithOplo: 'Discuter avec Oplo.ai',
    },

    // Onboarding Chat Banner
    onboardingChatBanner: {
      title: 'Finalisez votre onboarding avec Oplo.ai',
      subtitle: 'Répondez à quelques questions pour personnaliser votre tableau de bord avec vos vraies données.',
      cta: 'Commencer',
    },
  },

  en: {
    // Navigation - Sidebar
    nav: {
      dashboard: 'Dashboard',
      oploAI: 'Oplo.ai',
      insights: 'Insights',
      compastFramework: 'COMPAST Framework',
      customerSuccess: 'Customer Success',
      operations: 'Operations',
      market: 'Market',
      productService: 'Product/Service',
      alignment: 'Alignment',
      sales: 'Sales',
      team: 'Team',
      integrations: 'Integrations',
      integrations_oplo: 'Oplo Integrations',
      userManagement: 'User Management',
      teamManagement: 'Team Management',
      settings: 'Settings',
      notifications: 'Notifications',
      help: 'Help',
      profile: 'Profile',
      collapse: 'Collapse',
      inventory: 'Inventory',
    },

    // Navbar
    navbar: {
      solutions: 'Solutions',
      platform: 'Platform',
      resources: 'Resources',
      about: 'About',
      pricing: 'Pricing',
      login: 'Sign in',
      requestDemo: 'Request a demo',
      home: 'Home',
      contact: 'Contact',
      products: 'Products',
      overview: 'Overview',
      features: 'Features',
      explore: 'Explore',
      company: 'Company',
      discoverPlatform: 'Discover the platform',
      solutions_list: {
        generalManagers: 'General Managers',
        generalManagersDesc: 'Group-wide management',
        revenueManagers: 'Revenue Managers',
        revenueManagersDesc: 'Revenue optimisation',
        itManagers: 'IT Managers',
        itManagersDesc: 'Infrastructure & integrations',
        fbManagers: 'F&B Managers',
        fbManagersDesc: 'Operational management',
      },
      platform_products: [
        { name: "Hotel Management (PMS)", icon: "🏨" },
        { name: "Revenue Management (RMS)", icon: "💰" },
        { name: "Point of Sale (POS)", icon: "💳" },
      ],
      platform_integrations: [
        { name: "Marketplace", icon: "🏪" },
        { name: "Open API", icon: "⚙️" },
      ],
      pmsOverview: 'Oplo.ai PMS',
      pmsDesc: "Discover the power and potential of our award-winning hotel management system",
      resources_explore: [
        { name: "Blog", icon: "📝" },
        { name: "Search", icon: "🔍", page: "Search" },
        { name: "Oplo.ai University", icon: "🎓", page: "University" },
        { name: "Team As a Service", icon: "👥", page: "TeamAsAService" },
        { name: "Developers", icon: "💻", page: "Devs" },
      ],
      company_links: [
        { name: "About", icon: "ℹ️", page: "AboutOplo" },
        { name: "Partnerships", icon: "🤝", page: "Partners" },
        { name: "Careers", icon: "💼", page: "Careers" },
        { name: "Contact", icon: "📧", page: "Contact" },
        { name: "Affiliates", icon: "🌟", page: "Affiliates" },
      ],
    },

    // Mobile Nav
    mobileNav: {
      dashboard: 'Dashboard',
      chat: 'Chat',
      insights: 'Insights',
      profile: 'Profile',
    },

    // Dashboard
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Overview of your',
      restaurants: 'restaurants',
      askOplo: 'Ask Oplo.ai',
      metrics: {
        monthlyRevenue: 'Est. monthly revenue',
        coversPerDay: 'Covers / day',
        averageTicket: 'Average ticket',
        customersPerMonth: 'Customers / month',
        totalStaff: 'Total staff',
        restaurants: 'Restaurants',
        perCover: 'Per cover',
        completeOnboarding: 'Complete onboarding',
        avgPerResto: 'avg.',
        notProvided: 'Not provided',
        groupEstimate: 'Group estimate',
        employees: 'Employees',
        group: 'Group',
      },
      insights: {
        title: 'Smart Insights',
        seeAll: 'See all',
        noInsights: 'No insights yet',
        insightsAppear: 'Insights will appear here automatically',
      },
      myRestaurants: 'My restaurants',
      manage: 'Manage',
      noRestaurants: 'No restaurants added',
      addRestaurant: 'Add a restaurant',
      operationalProfile: 'Operational profile',
      completeOnboardingPrompt: 'Complete onboarding to see your data here',
      delivery: 'Delivery',
      takeaway: 'Takeaway',
      posSystem: 'POS / Cash register',
      teamDistribution: 'Team breakdown',
      people: 'people',
      kitchen: 'Kitchen',
      floor: 'Floor',
      management: 'Management',
      mainObjectives: 'Main objectives',
      bestSellers: 'Declared best-sellers',
      deliveryPlatforms: 'Delivery platforms',
    },

    // Language Selector
    language: {
      label: 'Language',
      fr: 'Français',
      en: 'English',
    },

    // Common
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      seeAll: 'See all',
      noData: 'No data',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      back: 'Back',
    },

    // Onboarding Banner
    onboardingBanner: {
      text: 'Configure Oplo.ai to personalise your dashboard for your group and restaurants',
      cta: 'Configure now',
    },

    // Welcome Popup
    welcome: {
      greeting: 'Great to see you',
      subtitle: 'Ready to optimise your operations today?',
      needHelp: 'Need help?',
      assistantAvailable: 'Our AI assistant is available 24/7',
      chatWithOplo: 'Chat with Oplo.ai',
    },

    // Onboarding Chat Banner
    onboardingChatBanner: {
      title: 'Complete your onboarding with Oplo.ai',
      subtitle: 'Answer a few questions to personalise your dashboard with your real data.',
      cta: 'Start',
    },
  },
};

export function useT(language) {
  const t = translations[language] || translations.fr;
  return (key) => {
    const keys = key.split('.');
    let val = t;
    for (const k of keys) {
      val = val?.[k];
    }
    return val ?? key;
  };
}
