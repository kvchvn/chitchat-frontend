import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { SESSION_TOKEN_COOKIE } from '~/constants/global';
import { authConfig } from '~/pages/api/auth/[...nextauth]';
import { Nullable, SessionWithToken } from '~/types/global';

export const getSessionData = async (
  req: GetServerSidePropsContext['req'],
  res: GetServerSidePropsContext['res']
): Promise<Nullable<SessionWithToken>> => {
  const session = await getServerSession(req, res, authConfig);
  const sessionToken = req.cookies[SESSION_TOKEN_COOKIE];

  const sessionWithToken = session ? { ...session, sessionToken } : null;
  return sessionWithToken;
};
