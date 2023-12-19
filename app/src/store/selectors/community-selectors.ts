import { useMergedStore } from '../store';

export const useUsersListSelector = () => useMergedStore((state) => state.usersList);

export const useCurrentCommunityCategorySelector = () =>
  useMergedStore((state) => state.currentCategory);

export const useCategoriesCountSelector = () => useMergedStore((state) => state.categoriesCount);

export const useCommunityActionsSelector = () => useMergedStore((state) => state.communityActions);
