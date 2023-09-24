export const ROUTES = {
  home: '/',
  about: '/about',
  signIn: '/sign-in',
  profile: '/profile',
  people: '/people',
} as const;

const API_USER_ENDPOINTS_BASE = 'users';

export const API_ENDPOINTS = {
  users: {
    all: (userId: string) => `${API_USER_ENDPOINTS_BASE}/${userId}`,
    friends: (userId: string) => `${API_USER_ENDPOINTS_BASE}/${userId}/friends`,
    friendRequest: `${API_USER_ENDPOINTS_BASE}/friend-request`,
    friendResponse: `${API_USER_ENDPOINTS_BASE}/friend-response`,
    friendRemoving: `${API_USER_ENDPOINTS_BASE}/friend-removing`,
  },
} as const;
