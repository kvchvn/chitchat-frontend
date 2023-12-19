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
  incomingRequests: Nullable<UserRelevant[]>;
  categoriesCount: Nullable<UsersCategoriesCount>;
};

const IncomingRequestsPage: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ incomingRequests, categoriesCount }) => {
  const storedIncomingRequests = useUsersListSelector();
  const { setUsersList, resetUsersList, setCategoriesCount, resetCategoriesCount } =
    useCommunityActionsSelector();

  useEffect(() => {
    if (incomingRequests) {
      setUsersList(incomingRequests);

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
    incomingRequests,
    setCategoriesCount,
    resetCategoriesCount,
    categoriesCount,
  ]);

  return incomingRequests ? (
    <UsersList
      users={storedIncomingRequests ?? incomingRequests}
      category={UsersCategoriesName.IncomingRequests}
    />
  ) : (
    <p>Error</p>
  );
};

IncomingRequestsPage.getLayout = (page) => <CommunityLayout>{page}</CommunityLayout>;

export const getServerSideProps = (async ({ req, res }) => {
  const session = await getSessionData(req, res);

  if (!session) {
    return gsspRedirectToSignIn();
  }

  const props: ServerSideProps = {
    session,
    incomingRequests: null,
    categoriesCount: null,
  };

  try {
    const incomingRequestsPromise = getGroupOfUsers(session.user.id, 'incoming-requests');
    const categoriesCountPromise = getUserCategoriesCount(session.user.id);

    const [incomingRequests, categoriesCount] = await Promise.allSettled([
      incomingRequestsPromise,
      categoriesCountPromise,
    ]);

    if (incomingRequests.status === 'fulfilled') {
      props.incomingRequests = incomingRequests.value;
    }
    if (categoriesCount.status === 'fulfilled') {
      props.categoriesCount = categoriesCount.value;
    }
  } catch (err) {
    logError('HomePage (getServerSideProps)', err);
  }

  return { props };
}) satisfies GetServerSideProps;

export default IncomingRequestsPage;
