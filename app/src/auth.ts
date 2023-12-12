import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { NextAuthOptions, getServerSession } from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import YandexProvider from 'next-auth/providers/yandex';
import { redirect } from 'next/navigation';
import { ROUTES } from './constants/global';

export const prisma = new PrismaClient();

export const config = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'database',
    maxAge: 2 * 60 * 60, // 2 hours
    updateAge: 0,
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
    YandexProvider({
      clientId: process.env.YANDEX_ID || '',
      clientSecret: process.env.YANDEX_SECRET || '',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID || '',
      clientSecret: process.env.FACEBOOK_SECRET || '',
    }),
  ],
  callbacks: {
    session: ({ session, user }) => {
      session.user = user;

      return session;
    },
  },
} satisfies NextAuthOptions;

type GetSessionDataOptions = {
  allowRedirect: boolean;
};

export const getSessionData = async (options: GetSessionDataOptions = { allowRedirect: true }) => {
  const session = await getServerSession(config);

  if (!session && options.allowRedirect) {
    redirect(ROUTES.signIn);
  }

  return session;
};
