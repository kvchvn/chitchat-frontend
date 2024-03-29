import { Session } from 'next-auth';
import { ErrorResponse } from './api';

export type IconId =
  | 'chat'
  | 'chat-unread'
  | 'users'
  | 'sign-out'
  | 'chevron-left'
  | 'moon'
  | 'sun'
  | 'user'
  | 'error'
  | 'close'
  | 'basket'
  | 'send'
  | 'pencil'
  | 'pencil-square'
  | 'save'
  | 'like'
  | 'like-outline'
  | 'dislike-outline'
  | 'copy'
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
