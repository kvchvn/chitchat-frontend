'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCommunityActionsSelector } from '~/store/selectors/community-selectors';
import { UserStatus } from '~/types/users';
import { sendFriendRequest } from '~/utils/api';

type DefaultStatusControlsProps = {
  userId: string;
};

export function DefaultStatusControls({ userId }: DefaultStatusControlsProps) {
  const { data: session } = useSession();
  const { updateUserStatus, increaseCategoryCount } = useCommunityActionsSelector();

  const router = useRouter();

  const handleClick = async () => {
    try {
      // TODO: aggregate errors in const
      if (!session) throw 'Session is missing';

      const operationResult = await sendFriendRequest({
        requestSenderId: session.user.id,
        requestReceiverId: userId,
      });

      if (operationResult?.isOperationPerformed) {
        updateUserStatus({ userId, newStatus: UserStatus.FriendRequestFromMeReceiver });
        increaseCategoryCount('outcomingRequests');
      }
    } catch (err) {
      router.refresh();
      console.log('Error when sendFriendRequest: ', err);
      // TODO: show error toast
    }
  };

  return <button onClick={handleClick}>Send FR</button>;
}
