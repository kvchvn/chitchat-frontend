import { Session } from 'next-auth';
import { ErrorResponse } from './api';

export type IconId =
  | 'chat'
  | 'users'
  | 'sign-out'
  | 'chevron-left'
  | 'moon'
  | 'sun'
  | 'user'
  | 'error'
  | 'close'
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

export type SessionWithToken = Session & {
  sessionToken?: string;
};

export type PageProps = {
  session: Nullable<SessionWithToken>;
};

export type BasicServerSideProps = {
  session: Session;
  error: Nullable<ErrorResponse>;
};

export type ServerError = {
  status: number;
  message: string;
};

export type LocalStorage = {
  theme: 'dark' | 'light';
};
