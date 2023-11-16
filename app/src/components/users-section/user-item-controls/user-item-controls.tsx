import { UserCounts, UserKeys } from '@/types';
import { useContext } from 'react';
import { UsersListContext } from '../users-list-provider';
import { AnyUserItemControls } from './any-user-item-controls';
import { FriendItemControls } from './friend-item-controls';
import { IncomingRequestControls } from './incoming-request-controls';
import { OutcomingRequestControls } from './outcoming-request-controls';

type UserItemControlsProps = {
  status?: UserCounts;
};

type ControlsProps = UserItemControlsProps & {
  toggleList: (newList: UserKeys) => void;
};

const CONTROLS: { [Property in UserKeys]: (props: ControlsProps) => JSX.Element } = {
  all: AnyUserItemControls,
  friends: FriendItemControls,
  incomingRequests: IncomingRequestControls,
  outcomingRequests: OutcomingRequestControls,
};

export function UserItemControls({ status }: UserItemControlsProps) {
  const { listName, toggleList } = useContext(UsersListContext);
  const View = CONTROLS[listName] ?? null;

  return (
    <div className="ml-auto flex h-10 items-center gap-1">
      <View status={status} toggleList={toggleList} />
    </div>
  );
}
