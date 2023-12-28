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
  outcomingRequests: Nullable<UserRelevant[]>;
  categoriesCount: Nullable<UsersCategoriesCount>;
};

const OutcomingRequestsPage: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ outcomingRequests: outcomingRequestsFromProps, categoriesCount, error }) => {
  const storedOutcomingRequests = useUsersListSelector();
  const { setUsersList, resetUsersList, setCategoriesCount, resetCategoriesCount } =
    useCommunityActionsSelector();

  useEffect(() => {
    if (outcomingRequestsFromProps) {
      setUsersList(outcomingRequestsFromProps);

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
    outcomingRequestsFromProps,
    setCategoriesCount,
    resetCategoriesCount,
    categoriesCount,
  ]);

  return (
    <>
      <Head>
        <title>Outcoming Requests | Community | Chit-Chat</title>
      </Head>
      <ServerErrorFallback error={error}>
        {outcomingRequestsFromProps && (
          <UsersList
            users={storedOutcomingRequests ?? outcomingRequestsFromProps}
            category={UsersCategoriesName.OutcomingRequests}
          />
        )}
      </ServerErrorFallback>
    </>
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
    error: null,
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
      if (!outcomingRequests.value) {
        throw new Error(
          `Failed to load user's outcoming requests (userId=${session.user.id}) in getServerSideProps on OutcomingRequestsPage.`
        );
      }

      props.outcomingRequests = outcomingRequests.value;
    }
    if (categoriesCount.status === 'fulfilled') {
      props.categoriesCount = categoriesCount.value;
    }
  } catch (err) {
    logError('OutcomingRequestsPage (getServerSideProps)', err);
    props.error = isErrorResponse(err) ? err : DEFAULT_ERROR_RESPONSE;
  }

  return { props };
}) satisfies GetServerSideProps<ServerSideProps>;

export default OutcomingRequestsPage;
