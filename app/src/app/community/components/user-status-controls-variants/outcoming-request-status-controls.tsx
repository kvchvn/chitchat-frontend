'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  useCommunityActionsSelector,
  useCurrentCommunityCategorySelector,
} from '~/store/selectors/community-selectors';
import { UserStatus } from '~/types/users';
import { cancelFriendRequest } from '~/utils/api';

type OutcomingRequestStatusControlsProps = {
  userId: string;
};

export function OutcomingRequestStatusControls({ userId }: OutcomingRequestStatusControlsProps) {
  const { data: session } = useSession();
  const currentCategory = useCurrentCommunityCategorySelector();
  const { updateUserStatus, decreaseCategoryCount, removeUserFromList } =
    useCommunityActionsSelector();

  const router = useRouter();

  const handleClick = async () => {
    try {
      if (!session) throw 'Session is missing';

      const operationResult = await cancelFriendRequest({
        requestSenderId: session.user.id,
        requestReceiverId: userId,
      });

      if (operationResult?.isOperationPerformed) {
        updateUserStatus({ userId, newStatus: UserStatus.Default });
        decreaseCategoryCount('outcomingRequests');

        if (currentCategory === 'outcomingRequests') {
          removeUserFromList(userId);
        }
      }
    } catch (err) {
      router.refresh();
      console.log('Error in cancelFriendRequest: ', err);
    }
  };

  return <button onClick={handleClick}>Cancel</button>;
}
