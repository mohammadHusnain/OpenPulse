import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import UserModel, { User } from '@/models/User.model'
import dbConnect from '@/lib/dbConnect'


type CredentialsType = {
  email: string;
  password: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Husnain" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: CredentialsType | undefined): Promise<User | null> {
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        await dbConnect();

        const user = await UserModel.findOne({ email: credentials.email });
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

        return user;
      }
    })
  ],

  callbacks: {
    async session({ session, token }) {
      return session;
    },

    async jwt({ token, user }) { 
    if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
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