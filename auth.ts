import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { getMongoClient, getMongoDb } from "@/lib/mongodb";
import { verifyPassword } from "@/lib/password";

const providers = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email =
        typeof credentials?.email === "string"
          ? credentials.email.toLowerCase().trim()
          : "";
      const password =
        typeof credentials?.password === "string" ? credentials.password : "";

      if (!email || !password) {
        return null;
      }

      const db = await getMongoDb();
      const user = await db.collection("users").findOne<{
        _id: { toString(): string };
        name?: string;
        email?: string;
        image?: string;
        passwordHash?: string;
      }>({ email });

      if (!user?.passwordHash) {
        return null;
      }

      const isValidPassword = await verifyPassword(password, user.passwordHash);

      if (!isValidPassword) {
        return null;
      }

      return {
        id: user._id.toString(),
        name: user.name ?? user.email ?? email,
        email: user.email ?? email,
        image: user.image,
      };
    },
  }),
  process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? GitHub({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      })
    : null,
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    : null,
].filter((provider): provider is NonNullable<typeof provider> => provider !== null);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(getMongoClient()),
  providers,
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});
