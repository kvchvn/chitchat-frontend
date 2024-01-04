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
import { UserRelevantWithStatus, UsersCategoriesCount, UsersCategoriesName } from '~/types/users';
import { getAllUsers, getUserCategoriesCount } from '~/utils/api';
import { getSessionData } from '~/utils/get-session-data';
import { gsspRedirectToSignIn } from '~/utils/gssp-redirect';
import { logError } from '~/utils/log-error';
import { NextPageWithLayout } from '../_app';

type ServerSideProps = BasicServerSideProps & {
  allUsers: Nullable<UserRelevantWithStatus[]>;
  categoriesCount: Nullable<UsersCategoriesCount>;
};

const AllCommunityPage: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ allUsers: allUsersFromProps, categoriesCount, error }) => {
  const allUsers = useUsersListSelector();
  const { setUsersList, resetUsersList, setCategoriesCount, resetCategoriesCount } =
    useCommunityActionsSelector();

  useEffect(() => {
    if (allUsersFromProps) {
      setUsersList(allUsersFromProps);

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
    allUsersFromProps,
    setCategoriesCount,
    resetCategoriesCount,
    categoriesCount,
  ]);

  return (
    <>
      <Head>
        <title>All Users | Community | Chit-Chat</title>
      </Head>
      <ServerErrorFallback error={error}>
        {allUsersFromProps && (
          <UsersList users={allUsers ?? allUsersFromProps} category={UsersCategoriesName.All} />
        )}
      </ServerErrorFallback>
    </>
  );
};

AllCommunityPage.getLayout = function getLayout(page) {
  return <CommunityLayout>{page}</CommunityLayout>;
};

export const getServerSideProps = (async ({ req, res }) => {
  const session = await getSessionData(req, res);

  if (!session) {
    return gsspRedirectToSignIn();
  }

  const props: ServerSideProps = { session, allUsers: null, categoriesCount: null, error: null };

  try {
    const allUsersPromise = getAllUsers({ userId: session.user.id, cookies: req.cookies });
    const categoriesCountPromise = getUserCategoriesCount({
      userId: session.user.id,
      cookies: req.cookies,
    });

    const [allUsers, categoriesCount] = await Promise.allSettled([
      allUsersPromise,
      categoriesCountPromise,
    ]);

    if (allUsers.status === 'fulfilled') {
      if (!allUsers.value) {
        throw new Error(
          `Failed to load all users (userId=${session.user.id}) in getServerSideProps on AllCommunityPage.`
        );
      }

      props.allUsers = allUsers.value;
    }
    if (categoriesCount.status === 'fulfilled') {
      props.categoriesCount = categoriesCount.value;
    }
  } catch (err) {
    logError('AllCommunityPage (getServerSideProps)', err);
    props.error = isErrorResponse(err) ? err : DEFAULT_ERROR_RESPONSE;
  }

  return { props };
}) satisfies GetServerSideProps<ServerSideProps>;

export default AllCommunityPage;
