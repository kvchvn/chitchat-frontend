import { UserKeys } from '@/types';
import React, { useCallback, useState } from 'react';

type UsersListContextValue = {
  listName: UserKeys;
  toggleList: (newList: UserKeys) => void;
};

export const UsersListContext = React.createContext<UsersListContextValue>({
  listName: 'all',
  toggleList: () => {},
});

export function UsersListProvider({ children }: React.PropsWithChildren) {
  const [selectedListName, setSelectedListName] = useState<UserKeys>('all');

  const toggleList = useCallback((newList: UserKeys) => {
    setSelectedListName(newList);
  }, []);

  return (
    <UsersListContext.Provider value={{ listName: selectedListName, toggleList }}>
      {children}
    </UsersListContext.Provider>
  );
}
