import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Session } from 'next-auth';
import { useEffect } from 'react';
import { UsersList } from '~/components/community-page/users-list';
import { CommunityLayout } from '~/layouts/community-layout';
import {
  useCommunityActionsSelector,
  useUsersListSelector,
} from '~/store/selectors/community-selectors';
import { Nullable } from '~/types/global';
import { UserRelevant, UsersCategoriesCount, UsersCategoriesName } from '~/types/users';
import { getGroupOfUsers, getUserCategoriesCount } from '~/utils/api';
import { getSessionData } from '~/utils/get-session-data';
import { gsspRedirectToSignIn } from '~/utils/gssp-redirect';
import { logError } from '~/utils/log-error';
import { NextPageWithLayout } from '../_app';

type ServerSideProps = {
  session: Session;
  friends: Nullable<UserRelevant[]>;
  categoriesCount: Nullable<UsersCategoriesCount>;
};

const FriendsPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  friends,
  categoriesCount,
}) => {
  const storedFriends = useUsersListSelector();
  const { setUsersList, resetUsersList, setCategoriesCount, resetCategoriesCount } =
    useCommunityActionsSelector();

  useEffect(() => {
    if (friends) {
      setUsersList(friends);

      if (categoriesCount) {
        setCategoriesCount(categoriesCount);
      }
    }

    return () => {
      resetUsersList();
      resetCategoriesCount();
    };
  }, [
    setUsersList,
    resetUsersList,
    friends,
    setCategoriesCount,
    resetCategoriesCount,
    categoriesCount,
  ]);

  return friends ? (
    <UsersList users={storedFriends ?? friends} category={UsersCategoriesName.Friends} />
  ) : (
    <p>Error</p>
  );
};

FriendsPage.getLayout = (page) => <CommunityLayout>{page}</CommunityLayout>;

export const getServerSideProps = (async ({ req, res }) => {
  const session = await getSessionData(req, res);

  if (!session) {
    return gsspRedirectToSignIn();
  }

  const props: ServerSideProps = {
    session,
    friends: null,
    categoriesCount: null,
  };

  try {
    const friendsPromise = getGroupOfUsers(session.user.id, 'friends', req.cookies);
    const categoriesCountPromise = getUserCategoriesCount(session.user.id, req.cookies);

    const [friends, categoriesCount] = await Promise.allSettled([
      friendsPromise,
      categoriesCountPromise,
    ]);

    if (friends.status === 'fulfilled') {
      props.friends = friends.value;
    }
    if (categoriesCount.status === 'fulfilled') {
      props.categoriesCount = categoriesCount.value;
    }
  } catch (err) {
    logError('HomePage (getServerSideProps)', err);
  }

  return { props };
}) satisfies GetServerSideProps;

export default FriendsPage;
