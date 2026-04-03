const API_BASE = '/api';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

function buildParams(filters = {}, sort = '-created_date', limit = null) {
  const params = new URLSearchParams();
  const normalizedSort = sort.replace('created_date', 'created_at');
  params.set('sort', normalizedSort);
  if (limit) params.set('limit', String(limit));
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null) {
      params.set(`filter_${key}`, String(value));
    }
  }
  return params.toString();
}

function createEntityApi(name) {
  return {
    list: async (sort = '-created_date') => {
      const params = buildParams({}, sort);
      return apiFetch(`/entities/${name}?${params}`);
    },
    filter: async (filters = {}, sort = '-created_date', limit = null) => {
      const params = buildParams(filters, sort, limit);
      return apiFetch(`/entities/${name}?${params}`);
    },
    get: async (id) => {
      return apiFetch(`/entities/${name}/${id}`);
    },
    create: async (data) => {
      return apiFetch(`/entities/${name}`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id, data) => {
      return apiFetch(`/entities/${name}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    delete: async (id) => {
      return apiFetch(`/entities/${name}/${id}`, { method: 'DELETE' });
    },
  };
}

export const base44 = {
  auth: {
    me: async () => {
      return apiFetch('/auth/me');
    },
    updateMe: async (data) => {
      return apiFetch('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    isAuthenticated: async () => {
      const result = await apiFetch('/auth/is-authenticated');
      return result.authenticated;
    },
    logout: (redirectUrl) => {
      if (redirectUrl) window.location.href = redirectUrl;
    },
    redirectToLogin: () => {
      console.log('redirectToLogin — using server auth');
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
    logUserInApp: async () => ({ success: true }),
  },
};
