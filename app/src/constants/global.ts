export const ROUTES = {
  home: '/',
  about: '/about',
  signIn: '/sign-in',
  profile: '/profile',
  community: {
    base: '/community',
    all: '/community/all',
    friends: '/community/friends',
    incomingRequests: '/community/incoming-requests',
    outcomingRequests: '/community/outcoming-requests',
  },
  chats: '/chats',
  chat: (id: string) => `/chats/${id}`,
} as const;

export const SESSION_TOKEN_COOKIE = 'next-auth.session-token';
