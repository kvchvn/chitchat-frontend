import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authConfig } from '~/pages/api/auth/[...nextauth]';

export const getSessionData = async (
  req: GetServerSidePropsContext['req'],
  res: GetServerSidePropsContext['res']
) => await getServerSession(req, res, authConfig);
