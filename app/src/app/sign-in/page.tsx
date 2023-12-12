import { getProviders } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { getSessionData } from '~/auth';
import { ROUTES } from '~/constants/global';
import { ProviderItem } from './components/provider-item';

export default async function SignInPage() {
  const session = await getSessionData({ allowRedirect: false });
  console.log({ session });
  if (session) {
    redirect(ROUTES.home);
  }

  const providers = await getProviders();

  // TODO: disconnect from the socket

  return (
    <>
      <h2 className="text-2xl font-semibold">Please, Sign In to use our app!</h2>
      {providers ? (
        <ul className="mt-5 flex flex-col gap-3">
          {Object.values(providers).map((provider) => (
            <ProviderItem key={provider.id} provider={provider} />
          ))}
        </ul>
      ) : (
        'Cannot fetch the providers'
      )}
    </>
  );
}
