const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper to make authenticated requests
const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth API
export const authApi = {
  signup: async (email: string, password: string, fullName: string) => {
    const data = await authFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
    if (data.data?.token) {
      localStorage.setItem('token', data.data.token);
    }
    return data;
  },

  login: async (email: string, password: string) => {
    const data = await authFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.data?.token) {
      localStorage.setItem('token', data.data.token);
    }
    return data;
  },

  getMe: async () => {
    return authFetch('/auth/me');
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  forgotPassword: async (email: string) => {
    return authFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// Profile API
export const profileApi = {
  get: async () => {
    return authFetch('/profile');
  },

  getProfile: async () => {
    const response = await authFetch('/profile');
    return response.data || response;
  },

  update: async (data: { fullName?: string; avatarUrl?: string; bio?: string }) => {
    return authFetch('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Carbon Footprint API
export const carbonApi = {
  getAll: async (limit = 10) => {
    return authFetch(`/carbon?limit=${limit}`);
  },

  create: async (data: {
    electricityKwh: number;
    transportationKm: number;
    transportationType: string;
    wasteKg: number;
    totalCo2Kg: number;
    category: string;
  }) => {
    return authFetch('/carbon', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Daily Challenges API
export const challengesApi = {
  getAll: async (limit = 30) => {
    return authFetch(`/challenges?limit=${limit}`);
  },

  create: async (challengeName: string, challengeDate?: Date) => {
    return authFetch('/challenges', {
      method: 'POST',
      body: JSON.stringify({ challengeName, challengeDate }),
    });
  },

  update: async (id: string, completed: boolean) => {
    return authFetch(`/challenges/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ completed }),
    });
  },

  delete: async (id: string) => {
    return authFetch(`/challenges/${id}`, {
      method: 'DELETE',
    });
  },
};

// Community API
export const communityApi = {
  getPosts: async () => {
    return authFetch('/community/posts');
  },

  createPost: async (content: string) => {
    return authFetch('/community/posts', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  likePost: async (id: string) => {
    return authFetch(`/community/posts/${id}/like`, {
      method: 'PUT',
    });
  },

  deletePost: async (id: string) => {
    return authFetch(`/community/posts/${id}`, {
      method: 'DELETE',
    });
  },

  getComments: async (postId: string) => {
    return authFetch(`/community/posts/${postId}/comments`);
  },

  addComment: async (postId: string, content: string) => {
    return authFetch(`/community/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
};

// Blog API
export const blogApi = {
  getAll: async () => {
    return authFetch('/blog');
  },

  getOne: async (id: string) => {
    return authFetch(`/blog/${id}`);
  },
};

// Quiz API
export const quizApi = {
  getQuestions: async (limit = 10) => {
    return authFetch(`/quiz/questions?limit=${limit}`);
  },

  getAllQuestions: async () => {
    return authFetch('/quiz/questions/all');
  },

  createQuestion: async (data: {
    questionText: string;
    difficulty: string;
    category: string;
    points: number;
    explanation: string;
    answers: { answerText: string; isCorrect: boolean; orderIndex: number }[];
  }) => {
    return authFetch('/quiz/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateQuestion: async (id: string, data: any) => {
    return authFetch(`/quiz/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteQuestion: async (id: string) => {
    return authFetch(`/quiz/questions/${id}`, {
      method: 'DELETE',
    });
  },

  submitAttempt: async (data: {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeTaken: number;
    answers: { questionId: string; answerId: string; isCorrect: boolean }[];
  }) => {
    return authFetch('/quiz/attempts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAttempts: async (limit = 10) => {
    return authFetch(`/quiz/attempts?limit=${limit}`);
  },
};

// Badges API
export const badgesApi = {
  getAll: async () => {
    return authFetch('/badges');
  },

  getUserBadges: async () => {
    return authFetch('/badges/user');
  },

  checkAndAward: async () => {
    return authFetch('/badges/check', {
      method: 'POST',
    });
  },
};

// Eco Locations API
export const ecoLocationsApi = {
  getAll: async (category?: string, city?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (city) params.append('city', city);
    return authFetch(`/eco-locations?${params.toString()}`);
  },

  getOne: async (id: string) => {
    return authFetch(`/eco-locations/${id}`);
  },
};

// Eco Events API
export const ecoEventsApi = {
  getAll: async (filters?: { eventType?: string; district?: string; division?: string }) => {
    const params = new URLSearchParams();
    if (filters?.eventType) params.append('eventType', filters.eventType);
    if (filters?.district) params.append('district', filters.district);
    if (filters?.division) params.append('division', filters.division);
    return authFetch(`/eco-events?${params.toString()}`);
  },

  getOne: async (id: string) => {
    return authFetch(`/eco-events/${id}`);
  },
};

// Planting API
export const plantingApi = {
  getAreas: async () => {
    return authFetch('/planting/areas');
  },

  getArea: async (id: string) => {
    return authFetch(`/planting/areas/${id}`);
  },

  getTrees: async (plantingAreaId?: string) => {
    const params = plantingAreaId ? `?plantingAreaId=${plantingAreaId}` : '';
    return authFetch(`/planting/trees${params}`);
  },

  plantTree: async (data: { plantingAreaId: string; treeType: string; notes?: string }) => {
    return authFetch('/planting/trees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getUserTrees: async () => {
    return authFetch('/planting/trees/user');
  },
};

// Leaderboard API
export const leaderboardApi = {
  get: async () => {
    return authFetch('/leaderboard');
  },
};

// Admin API
export const adminApi = {
  getStats: async () => {
    const response = await authFetch('/admin/stats');
    return response.data || response;
  },
};

export default {
  auth: authApi,
  profile: profileApi,
  carbon: carbonApi,
  challenges: challengesApi,
  community: communityApi,
  blog: blogApi,
  quiz: quizApi,
  badges: badgesApi,
  ecoLocations: ecoLocationsApi,
  ecoEvents: ecoEventsApi,
  planting: plantingApi,
  leaderboard: leaderboardApi,
  admin: adminApi,
};

