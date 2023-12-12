import { getSessionData } from '~/auth';
import { getUserCategoriesCount } from '~/utils/api';
import { CommunityHeaderTabs } from './community-header-tabs';

export async function CommunityHeader() {
  const session = await getSessionData();
  const categoriesCount = await getUserCategoriesCount(session?.user.id);

  return (
    <>
      <h1 className="text-2xl font-semibold">Community</h1>
      <CommunityHeaderTabs categories={categoriesCount} />
    </>
  );
}
