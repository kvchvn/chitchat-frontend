import { Session } from 'next-auth';

export type IconId =
  | 'chat'
  | 'users'
  | 'sign-out'
  | 'user'
  | 'close-md'
  | 'return'
  | 'basket'
  | 'paper-plane'
  | 'pencil'
  | 'save'
  | 'heart'
  | 'warning'
  | 'user-add'
  | 'user-remove'
  | 'user-outcoming-request'
  | 'user-incoming-request'
  | 'friend'
  | 'check';

export type Nullable<T> = T | null;

export type PageProps = {
  session: Nullable<Session>;
};
