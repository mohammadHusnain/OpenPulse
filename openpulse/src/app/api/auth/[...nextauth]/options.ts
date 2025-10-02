import { NextAuthOptions , DefaultUser, Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import UserModel, { User } from '@/models/User.model'
import dbConnect from '@/lib/dbConnect'


type CredentialsType = {
  email: string;
  password: string;
};

type CustomUser = DefaultUser & {
  _id?: string;
  isVerified?: boolean;
  isAcceptingMessage?: boolean;
  username?: string;
};

type authorize = (credentials: CredentialsType | undefined) => Promise<CustomUser | null>;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Husnain" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: CredentialsType | undefined): Promise<CustomUser | null> {
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        await dbConnect();

        const user = await UserModel.findOne({ email: credentials.email }) as User | null;
        if (!user) {
          throw new Error("User not found with this email");
        }

        if (!user.isVerified) {
          throw new Error("Verify your account before login");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordCorrect) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id?.toString() || "", // Required by DefaultUser
          _id: user._id?.toString(),
          email: user.email,
          isVerified: user.isVerified,
          isAcceptingMessage: user.isAcceptingMessage,
          username: user.username,
        };
      }
    })
  ],

  callbacks: {
    async session({ session, token }) {
        if (token) {
          session.user._id = token._id as string;
          session.user.isVerified = token.isVerified as boolean;
        }
      return session;
    },

    async jwt({ token, user }) { 
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },
  },

  pages: {
    signIn: '/sign-in',
},

    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },

      secret: process.env.NEXTAUTH_SECRET,
}