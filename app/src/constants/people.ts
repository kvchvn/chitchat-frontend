import { UserKeys } from '@/types';

export const TYPES_OF_USERS: { [Property in UserKeys]: string } = {
  allUsers: 'All',
  friends: 'Friends',
  incomingRequests: 'Incoming requests',
  outcomingRequests: 'Outcoming requests',
};
