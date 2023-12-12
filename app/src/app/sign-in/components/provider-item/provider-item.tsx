'use client';

import { ClientSafeProvider, signIn } from 'next-auth/react';

type ProviderItemProps = {
  provider: ClientSafeProvider;
};

export function ProviderItem({ provider }: ProviderItemProps) {
  return (
    <li className="w-1/3 border-2 border-gray-800 px-4 py-1 hover:bg-gray-300">
      <button onClick={() => signIn(provider.id)}>{`Sign In with ${provider.name}`}</button>
    </li>
  );
}
