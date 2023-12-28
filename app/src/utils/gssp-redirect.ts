import { ROUTES } from '~/constants/global';

type GsspRedirectArgs = {
  destination:
    | (typeof ROUTES)[Exclude<keyof typeof ROUTES, 'chat' | 'community'>]
    | (typeof ROUTES)['community'][keyof (typeof ROUTES)['community']];
};

export const gsspRedirect = (destination: GsspRedirectArgs['destination']) => ({
  redirect: {
    destination,
    permanent: false,
  },
});

export const gsspRedirectToHome = () => gsspRedirect(ROUTES.home);

export const gsspRedirectToSignIn = () => gsspRedirect(ROUTES.signIn);
