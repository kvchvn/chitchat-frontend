import {
  AllUsersResponse,
  ChatResponse,
  Response,
  UserChatsResponse,
  UserOperationResponse,
  UsersCategoriesCountResponse,
  UsersResponse,
} from '~/types/api';
import { isErrorResponse } from '~/types/guards';

const baseFetch = async <T extends Response<unknown>>(input: RequestInfo, init?: RequestInit) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/${input}`, init);
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

export const getUserChats = async (userId: string = '') => {
  const chats = await baseFetch<UserChatsResponse>(`users/${userId}/chats`);
  return chats.data;
};

export const getChat = async (chatId: string = '') => {
  const chat = await baseFetch<ChatResponse>(`chats/${chatId}`);
  return chat.data;
};

export const getAllUsers = async (userId: string = '') => {
  const allUsers = await baseFetch<AllUsersResponse>(`users/${userId}/all`, { cache: 'no-store' });
  return allUsers.data;
};

export const getGroupOfUsers = async (
  userId: string = '',
  group: 'friends' | 'incoming-requests' | 'outcoming-requests'
) => {
  const usersGroup = await baseFetch<UsersResponse>(`users/${userId}/${group}`, {
    cache: 'no-store',
  });
  return usersGroup.data;
};

export const getUserCategoriesCount = async (userId: string = '') => {
  const categoriesCount = await baseFetch<UsersCategoriesCountResponse>(
    `users/${userId}/categories-count`
  );
  return categoriesCount.data;
};

export const sendFriendRequest = async ({
  requestSenderId,
  requestReceiverId,
}: {
  requestSenderId: string;
  requestReceiverId: string;
}) => {
  const res = await baseFetch<UserOperationResponse>(
    `users/${requestSenderId}/friend-request?requestReceiverId=${requestReceiverId}`,
    { method: 'POST' }
  );
  return res.data;
};

export const cancelFriendRequest = async ({
  requestSenderId,
  requestReceiverId,
}: {
  requestSenderId: string;
  requestReceiverId: string;
}) => {
  const res = await baseFetch<UserOperationResponse>(
    `users/${requestSenderId}/friend-request-cancelling?requestReceiverId=${requestReceiverId}`,
    { method: 'DELETE' }
  );
  return res.data;
};

export const removeFriend = async ({ userId, friendId }: { userId: string; friendId: string }) => {
  const res = await baseFetch<UserOperationResponse>(
    `users/${userId}/friend-removing?friendId=${friendId}`,
    {
      method: 'DELETE',
    }
  );
  return res.data;
};

export const respondToFriendRequest = async ({
  requestSenderId,
  requestReceiverId,
  accept,
}: {
  requestSenderId: string;
  requestReceiverId: string;
  accept: boolean;
}) => {
  const endpoint = accept
    ? `users/${requestReceiverId}/accept-friend-request?requestSenderId=${requestSenderId}`
    : `users/${requestReceiverId}/refuse-friend-request?requestSenderId=${requestSenderId}`;

  const res = await baseFetch<UserOperationResponse>(endpoint, {
    method: 'POST',
  });

  return res.data;
};
