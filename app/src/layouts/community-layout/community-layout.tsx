import { PropsWithChildren } from 'react';
import { Header } from './components/header';

export function CommunityLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <section className="mt-2">{children}</section>
    </>
  );
}
