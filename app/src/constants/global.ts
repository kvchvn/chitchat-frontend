export const ROUTES = {
  home: '/',
  about: '/about',
  signIn: '/sign-in',
  profile: '/profile',
  search: '/search',
} as const;

export const API_ENDPOINTS = {
  users: {
    base: 'users',
    friendRequest: 'users/friend-request',
    friendResponse: 'users/friend-response',
    friendRemoving: 'users/friend-removing',
  },
} as const;
