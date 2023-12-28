import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  useCommunityActionsSelector,
  useCurrentCommunityCategorySelector,
} from '~/store/selectors/community-selectors';
import { UserStatus } from '~/types/users';
import { respondToFriendRequest } from '~/utils/api';

type IncomingRequestStatusControlsProps = {
  userId: string;
};

export function IncomingRequestStatusControls({ userId }: IncomingRequestStatusControlsProps) {
  const { data: session } = useSession();
  const currentCategory = useCurrentCommunityCategorySelector();
  const { updateUserStatus, decreaseCategoryCount, increaseCategoryCount, removeUserFromList } =
    useCommunityActionsSelector();

  const router = useRouter();

  const handleCLick =
    ({ accept }: { accept: boolean }) =>
    async () => {
      try {
        if (!session) throw 'Session is missing';

        const operationResult = await respondToFriendRequest({
          requestSenderId: userId,
          requestReceiverId: session.user.id,
          accept,
        });

        if (operationResult?.isOperationPerformed) {
          updateUserStatus({ userId, newStatus: accept ? UserStatus.Friend : UserStatus.Default });
          decreaseCategoryCount('incomingRequests');
          if (accept) {
            increaseCategoryCount('friends');
          }

          if (currentCategory === 'incomingRequests') {
            removeUserFromList(userId);
          }
        }
      } catch (err) {
        router.reload();
        console.log('Error in respondToFriendRequest: ', err);
        // TODO: show error toast
      }
    };

  return (
    <>
      <button onClick={handleCLick({ accept: true })} className="text-green-600">
        Accept
      </button>
      <button onClick={handleCLick({ accept: false })} className="text-red-600">
        Refuse
      </button>
    </>
  );
}
