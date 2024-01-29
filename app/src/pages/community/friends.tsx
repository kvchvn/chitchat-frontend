import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { ServerErrorFallback } from '~/components/community-page/server-error-fallback';
import { UsersList } from '~/components/community-page/users-list';
import { DEFAULT_ERROR_RESPONSE } from '~/constants/global';
import { CommunityLayout } from '~/layouts/community-layout';
import {
  useCommunityActionsSelector,
  useUsersListSelector,
} from '~/store/selectors/community-selectors';
import { BasicServerSideProps, Nullable } from '~/types/global';
import { isErrorResponse } from '~/types/guards';
import { UserRelevant, UsersCategoriesCount, UsersCategoriesName } from '~/types/users';
import { getGroupOfUsers, getUserCategoriesCount } from '~/utils/api';
import { getSessionData } from '~/utils/get-session-data';
import { gsspRedirectToSignIn } from '~/utils/gssp-redirect';
import { logError } from '~/utils/log-error';
import { NextPageWithLayout } from '../_app';

type ServerSideProps = BasicServerSideProps & {
  friends: Nullable<UserRelevant[]>;
  categoriesCount: Nullable<UsersCategoriesCount>;
};

const FriendsPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  friends: friendsFromProps,
  categoriesCount,
  error,
}) => {
  const storedFriends = useUsersListSelector();
  const { setUsersList, resetUsersList, setCategoriesCount, resetCategoriesCount } =
    useCommunityActionsSelector();

  useEffect(() => {
    if (friendsFromProps) {
      setUsersList(friendsFromProps);

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
    friendsFromProps,
    setCategoriesCount,
    resetCategoriesCount,
    categoriesCount,
  ]);

  return (
    <>
      <Head>
        <title>Friends | Community | Chit-Chat</title>
      </Head>
      <ServerErrorFallback error={error}>
        {friendsFromProps && (
          <UsersList
            users={storedFriends ?? friendsFromProps}
            category={UsersCategoriesName.Friends}
          />
        )}
      </ServerErrorFallback>
    </>
  );
};

FriendsPage.getLayout = (page) => <CommunityLayout>{page}</CommunityLayout>;

export const getServerSideProps = (async ({ req, res }) => {
  const session = await getSessionData(req, res);

  if (!session) {
    return gsspRedirectToSignIn();
  }

  const props: ServerSideProps = { session, friends: null, categoriesCount: null, error: null };

  try {
    const friendsPromise = getGroupOfUsers({
      userId: session.user.id,
      group: 'friends',
      cookies: req.cookies,
    });
    const categoriesCountPromise = getUserCategoriesCount({
      userId: session.user.id,
      cookies: req.cookies,
    });

    const [friends, categoriesCount] = await Promise.allSettled([
      friendsPromise,
      categoriesCountPromise,
    ]);

    if (friends.status === 'fulfilled') {
      if (!friends.value) {
        throw new Error(
          `Failed to load user's friends (userId=${session.user.id}) in getServerSideProps on FriendsPage.`
        );
      }

      props.friends = friends.value;
    }
    if (categoriesCount.status === 'fulfilled') {
      props.categoriesCount = categoriesCount.value;
    }
  } catch (err) {
    logError('FriendsPage (getServerSideProps)', err);
    props.error = isErrorResponse(err) ? err : DEFAULT_ERROR_RESPONSE;
  }

  return { props };
}) satisfies GetServerSideProps<ServerSideProps>;

export default FriendsPage;
