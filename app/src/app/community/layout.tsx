import React, { Suspense } from 'react';
import { CommunityHeader } from './components/community-header';
import Loading from './loading';

export default function CommunityLayout({ children: page }: React.PropsWithChildren) {
  return (
    <>
      <CommunityHeader />
      <section>
        <Suspense fallback={<Loading />}>{page}</Suspense>
      </section>
    </>
  );
}
