import { API_ENDPOINTS } from '@/constants';
import { customKy } from '@/ky';
import { ChatRelevant, Nullable } from '@/types';
import { logError } from '.';

export const getChatById = async (id?: string): Promise<Nullable<ChatRelevant>> => {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('id is not defined or its definition is wrong.');
    }
    return await customKy.get(API_ENDPOINTS.chat.getChat(id) + 'a').json();
  } catch (err) {
    logError('getChatById', err);
    return null;
  }
};
