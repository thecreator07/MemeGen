import { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
// import dbConnect from '@/lib/dbConnect';
// import UserModel, { User as DBUser } from '@/models/user.models';
import dbConnect from '@/db';
import UserModel, { User as DBUser } from '@/models/user.model';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined): Promise<NextAuthUser | null> {
        await dbConnect()
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password");
        }

        try {
          const user: DBUser | null = await UserModel.findOne({ email: credentials.email });

          if (!user) {
            throw new Error('No user found with this email/username');
          }

          // if (!user.isVerified) {
          //   throw new Error('Please verify your account before logging in');
          // }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return {
              id: user._id.toString(),
              // username: user.username,
              email: user.email,
            };
          } else {
            throw new Error('Incorrect password');
          }
        } catch (err: unknown) {
          let errorMessage = 'An error occurred during login.';
          if (err instanceof Error) {
            errorMessage = err.message;
          }
          throw new Error(errorMessage);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user.id;
        // token.username = user.username;
        token.email = user.email
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session?.user) {
        session.user._id = token._id as string;
        // session.user.username = token.username;
        session.user.email = token.email
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
};