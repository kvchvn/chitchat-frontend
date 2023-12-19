import { isUserRelevantWithStatus } from '~/types/guards';
import { UserRelevant, UserRelevantWithStatus } from '~/types/users';
import { CommunitySlice, ImmerStateCreator } from '../types';

export const communitySlice: ImmerStateCreator<CommunitySlice> = (set) => ({
  usersList: null,
  categoriesCount: null,
  currentCategory: null,
  communityActions: {
    setUsersList: (users) =>
      set((state) => {
        state.usersList = users;
      }),
    resetUsersList: () =>
      set((state) => {
        state.usersList = null;
      }),
    setCurrentCategory: (category) =>
      set((state) => {
        state.currentCategory = category;
      }),
    resetCurrentCategory: () =>
      set((state) => {
        state.currentCategory = null;
      }),
    setCategoriesCount: (categoriesCount) =>
      set((state) => {
        state.categoriesCount = categoriesCount;
      }),
    resetCategoriesCount: () =>
      set((state) => {
        state.categoriesCount = null;
      }),
    removeUserFromList: (userId) =>
      set(({ usersList }) => {
        if (usersList) {
          const userIndex = usersList.findIndex((user) => user.id === userId);

          if (userIndex !== -1) {
            usersList.splice(userIndex, 1);
          }
        }
      }),
    updateUserStatus: ({ userId, newStatus }) =>
      set(({ usersList }) => {
        if (usersList) {
          const user = usersList.find(
            (user: UserRelevant | UserRelevantWithStatus) => user.id === userId
          );

          if (user && isUserRelevantWithStatus(user)) {
            user.status = newStatus;
          }
        }
      }),
    increaseCategoryCount: (category) =>
      set(({ categoriesCount }) => {
        if (categoriesCount) {
          categoriesCount[category] += 1;
        }
      }),
    decreaseCategoryCount: (category) =>
      set(({ categoriesCount }) => {
        if (categoriesCount && categoriesCount[category] !== 0) {
          categoriesCount[category] -= 1;
        }
      }),
  },
});
