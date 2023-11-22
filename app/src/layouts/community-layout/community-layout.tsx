import { PropsWithChildren } from 'react';
import { CommunityHeader } from './community-header';

export function CommunityLayout({ children }: PropsWithChildren) {
  return (
    <>
      <CommunityHeader />
      <section className="mt-2">{children}</section>
    </>
  );
}
