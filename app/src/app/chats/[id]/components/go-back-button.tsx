'use client';

import { useRouter } from 'next/navigation';
import { Icon } from '~/ui/icon';

export function GoBackButton() {
  const router = useRouter();

  return (
    <button
      onClick={router.back}
      className="hover: h-8 w-8 rounded-full border border-black p-1 hover:bg-slate-100"
    >
      <Icon id="return" />
    </button>
  );
}
