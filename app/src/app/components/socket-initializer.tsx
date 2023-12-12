'use client';

import React from 'react';
import { useSocketInitialization } from '~/hooks/use-socket-initialization';

type SocketInitializerProps = React.PropsWithChildren & {
  userId: string | undefined;
};

export function SocketInitializer({ userId }: SocketInitializerProps) {
  useSocketInitialization({ userId });
  return null;
}
