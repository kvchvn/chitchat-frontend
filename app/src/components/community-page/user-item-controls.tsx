import { Nullable } from '~/types/global';
import { UserStatus, UsersCategoriesName } from '~/types/users';
import { DefaultStatusControls } from './controls-variants/default-status-controls';
import { FriendStatusControls } from './controls-variants/friend-status-controls';
import { IncomingRequestStatusControls } from './controls-variants/incoming-requests-status-controls';
import { MeStatusControls } from './controls-variants/me-status-controls';
import { OutcomingRequestStatusControls } from './controls-variants/outcoming-requests-status-controls';

type UserItemControlsProps = {
  userId: string;
  category: UsersCategoriesName;
  status?: UserStatus;
};

const CONTROLS_VARIANTS: Record<UserStatus, (props: { userId: string }) => JSX.Element> = {
  [UserStatus.Default]: DefaultStatusControls,
  [UserStatus.Me]: MeStatusControls,
  [UserStatus.Friend]: FriendStatusControls,
  [UserStatus.FriendRequestToMeSender]: IncomingRequestStatusControls,
  [UserStatus.FriendRequestFromMeReceiver]: OutcomingRequestStatusControls,
};

export function UserItemControls({ status, category, userId }: UserItemControlsProps) {
  let Controls: Nullable<(props: { userId: string }) => JSX.Element> = null;

  switch (category) {
    case UsersCategoriesName.All:
      Controls = status ? CONTROLS_VARIANTS[status] : null;
      break;
    case UsersCategoriesName.Friends:
      Controls = CONTROLS_VARIANTS[UserStatus.Friend];
      break;
    case UsersCategoriesName.IncomingRequests:
      Controls = CONTROLS_VARIANTS[UserStatus.FriendRequestToMeSender];
      break;
    case UsersCategoriesName.OutcomingRequests:
      Controls = CONTROLS_VARIANTS[UserStatus.FriendRequestFromMeReceiver];
      break;
  }

  return Controls && <Controls userId={userId} />;
}
