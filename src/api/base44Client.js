const STORAGE_PREFIX = 'oplo_';
const USER_KEY = `${STORAGE_PREFIX}current_user`;

const defaultUser = {
  id: 'local-user-1',
  email: 'user@oplo.ai',
  full_name: 'Utilisateur Oplo',
  role: 'admin',
  created_date: new Date().toISOString(),
};

function getStoredUser() {
  try {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

function setStoredUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getCollection(name) {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${name}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function setCollection(name, items) {
  localStorage.setItem(`${STORAGE_PREFIX}${name}`, JSON.stringify(items));
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createEntityApi(name) {
  return {
    list: async () => {
      return getCollection(name);
    },
    filter: async (filters = {}, sort = '-created_date', limit = null) => {
      let items = getCollection(name);
      items = items.filter(item => {
        return Object.entries(filters).every(([key, value]) => item[key] === value);
      });
      if (sort) {
        const desc = sort.startsWith('-');
        const field = desc ? sort.slice(1) : sort;
        items.sort((a, b) => {
          const av = a[field] ?? '';
          const bv = b[field] ?? '';
          return desc ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1);
        });
      }
      if (limit) items = items.slice(0, limit);
      return items;
    },
    get: async (id) => {
      const items = getCollection(name);
      const item = items.find(i => i.id === id);
      if (!item) throw new Error(`${name} not found: ${id}`);
      return item;
    },
    create: async (data) => {
      const items = getCollection(name);
      const user = getStoredUser() || defaultUser;
      const newItem = {
        id: generateId(),
        created_date: new Date().toISOString(),
        created_by: user.email,
        ...data,
      };
      items.push(newItem);
      setCollection(name, items);
      return newItem;
    },
    update: async (id, data) => {
      const items = getCollection(name);
      const idx = items.findIndex(i => i.id === id);
      if (idx === -1) throw new Error(`${name} not found: ${id}`);
      items[idx] = { ...items[idx], ...data, id };
      setCollection(name, items);
      return items[idx];
    },
    delete: async (id) => {
      const items = getCollection(name);
      const filtered = items.filter(i => i.id !== id);
      setCollection(name, filtered);
      return { success: true };
    },
  };
}

export const base44 = {
  auth: {
    me: async () => {
      const user = getStoredUser();
      if (user) return user;
      setStoredUser(defaultUser);
      return defaultUser;
    },
    updateMe: async (data) => {
      const user = getStoredUser() || defaultUser;
      const updated = { ...user, ...data };
      setStoredUser(updated);
      return updated;
    },
    isAuthenticated: async () => {
      return true;
    },
    logout: (redirectUrl) => {
      localStorage.removeItem(USER_KEY);
      if (redirectUrl) window.location.href = redirectUrl;
    },
    redirectToLogin: (returnUrl) => {
      console.log('redirectToLogin called — using local auth');
    },
  },

  entities: {
    Restaurant: createEntityApi('Restaurant'),
    Customer: createEntityApi('Customer'),
    TeamMember: createEntityApi('TeamMember'),
    Problem: createEntityApi('Problem'),
    SOP: createEntityApi('SOP'),
    KPIMetric: createEntityApi('KPIMetric'),
    Competitor: createEntityApi('Competitor'),
    OnboardingProfile: createEntityApi('OnboardingProfile'),
    OperationalRitual: createEntityApi('OperationalRitual'),
    Insight: createEntityApi('Insight'),
    Feedback: createEntityApi('Feedback'),
    Goal: createEntityApi('Goal'),
    User: createEntityApi('User'),
  },

  appLogs: {
    logUserInApp: async (pageName) => {
      return { success: true };
    },
  },
};
