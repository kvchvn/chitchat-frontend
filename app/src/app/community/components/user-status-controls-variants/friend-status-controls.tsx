'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  useCommunityActionsSelector,
  useCurrentCommunityCategorySelector,
} from '~/store/selectors/community-selectors';
import { UserStatus } from '~/types/users';
import { removeFriend } from '~/utils/api';

type FriendStatusControlsProps = {
  userId: string;
};

export function FriendStatusControls({ userId }: FriendStatusControlsProps) {
  const { data: session } = useSession();
  const currentCategory = useCurrentCommunityCategorySelector();
  const { updateUserStatus, decreaseCategoryCount, removeUserFromList } =
    useCommunityActionsSelector();

  const router = useRouter();

  const handleClick = async () => {
    try {
      if (!session) throw 'Session is missing';

      const operationResult = await removeFriend({ userId: session.user.id, friendId: userId });

      if (operationResult?.isOperationPerformed) {
        updateUserStatus({ userId, newStatus: UserStatus.Default });
        decreaseCategoryCount('friends');

        if (currentCategory === 'friends') {
          removeUserFromList(userId);
        }
      }
    } catch (err) {
      router.refresh();
      console.log('Error in removeFromFriends: ', err);
      // TODO: show error toast
    }
  };

  return <button onClick={handleClick}>Remove from Friends</button>;
}
