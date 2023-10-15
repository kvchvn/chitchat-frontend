export const ROUTES = {
  home: '/',
  about: '/about',
  signIn: '/sign-in',
  profile: '/profile',
  people: '/people',
  chats: '/chats',
  chat: (id: string) => `/chats/${id}`,
} as const;

const API_ENDPOINTS_BASES = {
  user: 'user',
  chat: 'chat',
} as const;

export const API_ENDPOINTS = {
  user: {
    getById: (userId: string) => `${API_ENDPOINTS_BASES.user}/${userId}`,
    getAll: (userId: string) => `${API_ENDPOINTS_BASES.user}/${userId}/all`,
    getChatsOf: (userId: string) => `${API_ENDPOINTS_BASES.user}/${userId}/chats`,
    sendFriendRequest: ({ from, to }: { from: string; to: string }) =>
      `${API_ENDPOINTS_BASES.user}/${from}/friend-request?receiverId=${to}`,
    getFriendResponse: ({ from, to }: { from: string; to: string }) =>
      `${API_ENDPOINTS_BASES.user}/${from}/friend-response?requestSenderId=${to}`,
    removeFriend: ({ userId, friendId }: { userId: string; friendId: string }) =>
      `${API_ENDPOINTS_BASES.user}/${userId}/friend-removal?friendId=${friendId}`,
  },
  chat: {
    getChat: (id: string) => `${API_ENDPOINTS_BASES.chat}/${id}`,
    sendMessage: ({ chatId, senderId }: { chatId: string; senderId: string }) =>
      `${API_ENDPOINTS_BASES.chat}/${chatId}?senderId=${senderId}`,
  },
} as const;
