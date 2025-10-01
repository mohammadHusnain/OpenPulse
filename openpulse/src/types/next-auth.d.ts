import 'next-auth'

declare module 'next-auth' {
  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
  },

  interface PromisedUser {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
  }
}