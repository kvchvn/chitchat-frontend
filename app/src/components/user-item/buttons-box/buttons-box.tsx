import { API_ENDPOINTS } from '@/constants';
import { customKy } from '@/ky';
import { UsersListVariant } from '@/types';
import { logError } from '@/utils';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

type ButtonsBoxProps = {
  listVariant: UsersListVariant;
  isFriendOrRequested: boolean;
  currentUserId: string;
};

export function ButtonsBox({ listVariant, isFriendOrRequested, currentUserId }: ButtonsBoxProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const refreshPage = () => {
    router.replace(router.asPath);
  };

  const sendRequestToAddToFriends = async () => {
    try {
      if (session && session.user) {
        await customKy.post(
          `${API_ENDPOINTS.user.sendFriendRequest({ from: session.user.id, to: currentUserId })}`
        );
      } else {
        throw new Error('Session is not found.');
      }
    } catch (err) {
      logError('ButtonsBox component (sendRequestToAddToFriends)', err);
    } finally {
      refreshPage();
    }
  };

  const removeFromFriends = async () => {
    try {
      if (session && session.user) {
        await customKy.delete(
          `${API_ENDPOINTS.user.removeFriend({
            userId: session.user.id,
            friendId: currentUserId,
          })}`
        );
      } else {
        throw new Error('Session is not found.');
      }
    } catch (err) {
      logError('ButtonsBox component (removeFromFriends)', err);
    } finally {
      refreshPage();
    }
  };

  const respondToFriendRequest = async (response: 'accept' | 'refuse') => {
    try {
      if (session?.user) {
        await customKy.post(
          `${API_ENDPOINTS.user.getFriendResponse({ from: session.user.id, to: currentUserId })}`,
          { json: { isAccepted: response === 'accept' } }
        );
      } else {
        throw new Error('Session is not found.');
      }
    } catch (err) {
      logError('ButtonsBox component (respondToFriendRequest)', err);
    } finally {
      refreshPage();
    }
  };

  return (
    <div className="flex gap-2">
      {listVariant === 'all' && !isFriendOrRequested && (
        <button
          onClick={sendRequestToAddToFriends}
          className="rounded-2xl border-2 border-sky-700 bg-sky-300 px-4 py-1 font-semibold text-sky-900 hover:bg-sky-400"
        >
          Add to Friends
        </button>
      )}
      {listVariant === 'friends' && (
        <>
          <button
            onClick={removeFromFriends}
            className="rounded-2xl border-2 border-sky-700 bg-gray-100 px-4 py-1 font-semibold text-sky-900 hover:bg-gray-300"
          >
            Remove from Friends
          </button>
        </>
      )}
      {listVariant === 'incoming' && (
        <>
          <button
            onClick={() => respondToFriendRequest('accept')}
            className="rounded-2xl border-2 border-sky-700 bg-sky-300 px-4 py-1 font-semibold text-sky-900 hover:bg-sky-400"
          >
            Accept
          </button>
          <button
            onClick={() => respondToFriendRequest('refuse')}
            className="rounded-2xl border-2 border-sky-700 bg-gray-100 px-4 py-1 font-semibold text-sky-900 hover:bg-gray-300"
          >
            Refuse
          </button>
        </>
      )}
    </div>
  );
}
