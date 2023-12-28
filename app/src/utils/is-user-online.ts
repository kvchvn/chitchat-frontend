import { UserRelevant } from '~/types/users';

export const isUserOnline = (user: UserRelevant) => {
  const freshestSession = user.sessions[0];

  if (!freshestSession) {
    return false;
  }

  const freshestSessionExpiresDate = new Date(freshestSession.expires);
  const isExpiredSession = Number(freshestSessionExpiresDate) < Date.now();

  return !isExpiredSession;
};
