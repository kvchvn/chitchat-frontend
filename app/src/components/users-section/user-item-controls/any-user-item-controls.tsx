import { UserCounts, UserKeys } from '@/types';
import { Icon } from '@/ui/icon';

type AnyUserItemControlsProps = {
  toggleList: (newList: UserKeys) => void;
  status?: UserCounts;
};

export function AnyUserItemControls({ status, toggleList }: AnyUserItemControlsProps) {
  const goToIncomingRequests = () => {
    if (toggleList) {
      toggleList('incomingRequests');
    }
  };

  if (status?.incomingRequests) {
    return (
      <span className="relative h-full w-10 p-1">
        <Icon id="user-incoming-request" />
      </span>
    );
  }

  if (status?.outcomingRequests) {
    return (
      <button
        onClick={goToIncomingRequests}
        className="relative h-full w-10 bg-stone-300 p-1 hover:bg-stone-400"
      >
        <Icon id="user-outcoming-request" />
      </button>
    );
  }

  if (status?.friends) {
    return (
      <span className="relative h-full w-10 p-1">
        <Icon id="friend" />
      </span>
    );
  }

  return (
    <button className="relative h-full w-10 bg-stone-300 p-1 hover:bg-stone-400">
      <Icon id="user-add" />
    </button>
  );
}
