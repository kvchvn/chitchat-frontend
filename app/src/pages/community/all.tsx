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
import { UserRelevantWithStatus, UsersCategoriesCount, UsersCategoriesName } from '~/types/users';
import { getAllUsers, getUserCategoriesCount } from '~/utils/api';
import { getSessionData } from '~/utils/get-session-data';
import { gsspRedirectToSignIn } from '~/utils/gssp-redirect';
import { logError } from '~/utils/log-error';
import { NextPageWithLayout } from '../_app';

type ServerSideProps = {
  session: Session;
  allUsers: Nullable<UserRelevantWithStatus[]>;
  categoriesCount: Nullable<UsersCategoriesCount>;
};

const AllCommunityPage: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ allUsers, categoriesCount }) => {
  const storedAllUsers = useUsersListSelector();
  const { setUsersList, resetUsersList, setCategoriesCount, resetCategoriesCount } =
    useCommunityActionsSelector();

  useEffect(() => {
    if (allUsers) {
      setUsersList(allUsers);

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
    allUsers,
    setCategoriesCount,
    resetCategoriesCount,
    categoriesCount,
  ]);

  return allUsers ? (
    <UsersList users={storedAllUsers ?? allUsers} category={UsersCategoriesName.All} />
  ) : (
    <p>Error</p>
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

  const props: ServerSideProps = {
    session,
    allUsers: null,
    categoriesCount: null,
  };

  try {
    const allUsersPromise = getAllUsers(session.user.id, req.cookies);
    const categoriesCountPromise = getUserCategoriesCount(session.user.id, req.cookies);

    const [allUsers, categoriesCount] = await Promise.allSettled([
      allUsersPromise,
      categoriesCountPromise,
    ]);

    if (allUsers.status === 'fulfilled') {
      props.allUsers = allUsers.value;
    }
    if (categoriesCount.status === 'fulfilled') {
      props.categoriesCount = categoriesCount.value;
    }
  } catch (err) {
    logError('AllUsersPage (getServerSideProps)', err);
  }

  return { props };
}) satisfies GetServerSideProps;

export default AllCommunityPage;
