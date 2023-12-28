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
  incomingRequests: Nullable<UserRelevant[]>;
  categoriesCount: Nullable<UsersCategoriesCount>;
};

const IncomingRequestsPage: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ incomingRequests: incomingRequestsFromProps, categoriesCount, error }) => {
  const storedIncomingRequests = useUsersListSelector();
  const { setUsersList, resetUsersList, setCategoriesCount, resetCategoriesCount } =
    useCommunityActionsSelector();

  useEffect(() => {
    if (incomingRequestsFromProps) {
      setUsersList(incomingRequestsFromProps);

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
    incomingRequestsFromProps,
    setCategoriesCount,
    resetCategoriesCount,
    categoriesCount,
  ]);

  return (
    <>
      <Head>
        <title>Incoming Requests | Community | Chit-Chat</title>
      </Head>
      <ServerErrorFallback error={error}>
        {incomingRequestsFromProps && (
          <UsersList
            users={storedIncomingRequests ?? incomingRequestsFromProps}
            category={UsersCategoriesName.IncomingRequests}
          />
        )}
      </ServerErrorFallback>
    </>
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
    error: null,
  };

  try {
    const incomingRequestsPromise = getGroupOfUsers(
      session.user.id,
      'incoming-requests',
      req.cookies
    );
    const categoriesCountPromise = getUserCategoriesCount(session.user.id, req.cookies);

    const [incomingRequests, categoriesCount] = await Promise.allSettled([
      incomingRequestsPromise,
      categoriesCountPromise,
    ]);

    if (incomingRequests.status === 'fulfilled') {
      if (!incomingRequests.value) {
        throw new Error(
          `Failed to load user's incoming requests (userId=${session.user.id}) in getServerSideProps on IncomingRequestsPage.`
        );
      }

      props.incomingRequests = incomingRequests.value;
    }
    if (categoriesCount.status === 'fulfilled') {
      props.categoriesCount = categoriesCount.value;
    }
  } catch (err) {
    logError('IncomingRequestsPage (getServerSideProps)', err);
    props.error = isErrorResponse(err) ? err : DEFAULT_ERROR_RESPONSE;
  }

  return { props };
}) satisfies GetServerSideProps<ServerSideProps>;

export default IncomingRequestsPage;
