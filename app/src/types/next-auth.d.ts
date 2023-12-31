import 'next-auth';
import { AdapterUser } from 'next-auth/adapters';

declare module 'next-auth' {
  interface Session {
    user: AdapterUser;
  }
}
