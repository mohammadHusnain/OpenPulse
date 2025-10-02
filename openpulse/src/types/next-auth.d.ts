import 'next-auth'

declare module 'next-auth' {
  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
  }

}


declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string | null;
    isVerified?: boolean | null;
    isAcceptingMessage?: boolean | null;
    username?: string | NonNullable;
  }
}



// Extend the Session and User types to include custom properties
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessage?: boolean;
      username?: string;
    };
  }
}


export interface PromisedUser {
  _id?: string;
  isVerified?: boolean;
  isAcceptingMessage?: boolean;
  username?: string;
}



