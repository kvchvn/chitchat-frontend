export const ROUTES = {
  home: '/',
  about: '/about',
  signIn: '/sign-in',
  profile: '/profile',
  people: '/people',
  chats: '/chats',
  chat: (id: string) => `/chats/${id}`,
} as const;

const API_ENDPOINTS_ENTITIES = {
  users: 'users',
  chats: 'chats',
} as const;

export const API_ENDPOINTS = {
  user: {
    getById: (userId: string) => `${API_ENDPOINTS_ENTITIES.users}/${userId}`,
    getAll: (userId: string) => `${API_ENDPOINTS_ENTITIES.users}/${userId}/all`,
    getChatsOf: (userId: string) => `${API_ENDPOINTS_ENTITIES.users}/${userId}/chats`,
    sendFriendRequest: ({ from, to }: { from: string; to: string }) =>
      `${API_ENDPOINTS_ENTITIES.users}/${from}/friend-request?receiverId=${to}`,
    getFriendResponse: ({ from, to }: { from: string; to: string }) =>
      `${API_ENDPOINTS_ENTITIES.users}/${from}/friend-response?requestSenderId=${to}`,
    removeFriend: ({ userId, friendId }: { userId: string; friendId: string }) =>
      `${API_ENDPOINTS_ENTITIES.users}/${userId}/friend-removal?friendId=${friendId}`,
  },
  chat: {
    getChat: (id: string) => `${API_ENDPOINTS_ENTITIES.chats}/${id}`,
    sendMessage: ({ chatId, senderId }: { chatId: string; senderId: string }) =>
      `${API_ENDPOINTS_ENTITIES.chats}/${chatId}?senderId=${senderId}`,
  },
} as const;

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
