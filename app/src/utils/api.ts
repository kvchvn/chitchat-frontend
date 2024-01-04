import {
  AllUsersResponse,
  ChatResponse,
  Response,
  UserChatsResponse,
  UserOperationResponse,
  UsersCategoriesCountResponse,
  UsersResponse,
} from '~/types/api';
import { Nullable } from '~/types/global';
import { isErrorResponse } from '~/types/guards';

type Cookies = Partial<Record<string, string | number | boolean>>;

const baseFetch = async <T extends Response<unknown>>({
  urlPathname,
  cookies = {},
  options = {},
}: {
  urlPathname: RequestInfo;
  cookies?: Cookies;
  options?: RequestInit;
}) => {
  try {
    const CookieHeader = Object.entries(cookies)
      .map(([key, value]) => `${key}=${value};`)
      .join('');
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/${urlPathname}`, {
      credentials: 'include',
      headers: { Cookie: CookieHeader, ...options.headers },
      ...options,
    });
    const parsedResponse = (await response.json()) as T;

    if (!response.ok) {
      throw parsedResponse;
    }

    return parsedResponse;
  } catch (err) {
    if (isErrorResponse(err)) {
      console.log('Error in baseFetch: ', err);
    }
    throw err;
  }
};

export const getUserChats = async ({
  userId = '',
  cookies,
}: {
  userId?: string;
  cookies: Cookies;
}) => {
  const chats = await baseFetch<UserChatsResponse>({
    urlPathname: `users/${userId}/chats`,
    cookies,
  });
  return chats.data;
};

export const getChat = async ({ chatId = '', cookies }: { chatId?: string; cookies: Cookies }) => {
  const chat = await baseFetch<ChatResponse>({ urlPathname: `chats/${chatId}`, cookies });
  return chat.data;
};

export const getAllUsers = async ({
  userId = '',
  cookies,
}: {
  userId?: string;
  cookies: Cookies;
}) => {
  const allUsers = await baseFetch<AllUsersResponse>({
    urlPathname: `users/${userId}/all`,
    cookies,
  });
  return allUsers.data;
};

export const getGroupOfUsers = async ({
  userId = '',
  group,
  cookies,
}: {
  userId?: string;
  group: 'friends' | 'incoming-requests' | 'outcoming-requests';
  cookies: Cookies;
}) => {
  const usersGroup = await baseFetch<UsersResponse>({
    urlPathname: `users/${userId}/${group}`,
    cookies,
  });
  return usersGroup.data;
};

export const getUserCategoriesCount = async ({
  userId = '',
  cookies,
}: {
  userId?: string;
  cookies: Cookies;
}) => {
  const categoriesCount = await baseFetch<UsersCategoriesCountResponse>({
    urlPathname: `users/${userId}/categories-count`,
    cookies,
  });
  return categoriesCount.data;
};

export const sendFriendRequest = async ({
  requestSenderId = '',
  requestReceiverId = '',
}: {
  requestSenderId: string;
  requestReceiverId: string;
}) => {
  const res = await baseFetch<UserOperationResponse>({
    urlPathname: `users/${requestSenderId}/friend-request?requestReceiverId=${requestReceiverId}`,
    options: { method: 'POST' },
  });
  return res.data;
};

export const cancelFriendRequest = async ({
  requestSenderId = '',
  requestReceiverId = '',
}: {
  requestSenderId: string;
  requestReceiverId: string;
}) => {
  const res = await baseFetch<UserOperationResponse>({
    urlPathname: `users/${requestSenderId}/friend-request-cancelling?requestReceiverId=${requestReceiverId}`,
    options: { method: 'DELETE' },
  });
  return res.data;
};

export const removeFriend = async ({
  userId = '',
  friendId = '',
}: {
  userId: string;
  friendId: string;
}) => {
  const res = await baseFetch<UserOperationResponse>({
    urlPathname: `users/${userId}/friend-removing?friendId=${friendId}`,
    options: { method: 'DELETE' },
  });
  return res.data;
};

export const respondToFriendRequest = async ({
  requestSenderId = '',
  requestReceiverId = '',
  accept,
}: {
  requestSenderId: string;
  requestReceiverId: string;
  accept: boolean;
}) => {
  const urlPathname = accept
    ? `users/${requestReceiverId}/accept-friend-request?requestSenderId=${requestSenderId}`
    : `users/${requestReceiverId}/refuse-friend-request?requestSenderId=${requestSenderId}`;

  const res = await baseFetch<
  const res = await baseFetch<UserOperationResponse>(endpoint, {
    method: 'POST',
  >({
    urlPathname,
    options: { method: 'POST' },
  });

  return res.data;
};
