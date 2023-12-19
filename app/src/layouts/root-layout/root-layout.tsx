import { PropsWithChildren } from 'react';
import { Navigation } from './components/navigation';

export function RootLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex h-full">
      <Navigation />
      <div className="mx-auto w-[90vw] px-10 py-5">{children}</div>
    </main>
  );
}
