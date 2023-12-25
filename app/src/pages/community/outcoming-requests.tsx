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
  outcomingRequests: Nullable<UserRelevant[]>;
  categoriesCount: Nullable<UsersCategoriesCount>;
};

const OutcomingRequestsPage: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ outcomingRequests, categoriesCount }) => {
  const storedOutcomingRequests = useUsersListSelector();
  const { setUsersList, resetUsersList, setCategoriesCount, resetCategoriesCount } =
    useCommunityActionsSelector();

  useEffect(() => {
    if (outcomingRequests) {
      setUsersList(outcomingRequests);

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
    outcomingRequests,
    setCategoriesCount,
    resetCategoriesCount,
    categoriesCount,
  ]);

  return outcomingRequests ? (
    <UsersList
      users={storedOutcomingRequests ?? outcomingRequests}
      category={UsersCategoriesName.OutcomingRequests}
    />
  ) : (
    <p>Error</p>
  );
};

OutcomingRequestsPage.getLayout = (page) => <CommunityLayout>{page}</CommunityLayout>;

export const getServerSideProps = (async ({ req, res }) => {
  const session = await getSessionData(req, res);

  if (!session) {
    return gsspRedirectToSignIn();
  }

  const props: ServerSideProps = {
    session,
    outcomingRequests: null,
    categoriesCount: null,
  };

  try {
    const outcomingRequestsPromise = getGroupOfUsers(
      session.user.id,
      'outcoming-requests',
      req.cookies
    );
    const categoriesCountPromise = getUserCategoriesCount(session.user.id, req.cookies);

    const [outcomingRequests, categoriesCount] = await Promise.allSettled([
      outcomingRequestsPromise,
      categoriesCountPromise,
    ]);

    if (outcomingRequests.status === 'fulfilled') {
      props.outcomingRequests = outcomingRequests.value;
    }
    if (categoriesCount.status === 'fulfilled') {
      props.categoriesCount = categoriesCount.value;
    }
  } catch (err) {
    logError('HomePage (getServerSideProps)', err);
  }

  return { props };
}) satisfies GetServerSideProps;

export default OutcomingRequestsPage;
