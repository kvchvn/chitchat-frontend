import { UserKeys } from '@/types';

export const TYPES_OF_USERS: { [Property in UserKeys]: string } = {
  all: 'All',
  friends: 'Friends',
  incomingRequests: 'Incoming requests',
  outcomingRequests: 'Outcoming requests',
};
