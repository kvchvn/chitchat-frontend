import { UserRelevant } from '~/types/users';

export const isUserSessionExpired = (session: UserRelevant['sessions'][0] | undefined) =>
  session ? Number(new Date(session.expires)) < Date.now() : true;
