import { auth, signOut, signIn } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const hasGitHubAuth =
  !!process.env.GITHUB_CLIENT_ID && !!process.env.GITHUB_CLIENT_SECRET;
const hasGoogleAuth =
  !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="px-5 py-3 bg-white shadow-md font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={144} height={30} />
        </Link>
        <div className="flex items-center gap-5 text-black">
          {session && session?.user ? (
            <>
              <Link href="/startup/create">
                <span>Create</span>
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({redirectTo: "/"});
                }}
              >
                <button type="submit">Log Out</button>
              </form>
              <span>{session?.user?.name}</span>
            </>
          ) : (
            <>
              {hasGitHubAuth ? (
                <form
                  action={async () => {
                    "use server";
                    await signIn("github");
                  }}
                >
                  <button type="submit">Login with GitHub</button>
                </form>
              ) : null}
              {hasGoogleAuth ? (
                <form
                  action={async () => {
                    "use server";
                    await signIn("google");
                  }}
                >
                  <button type="submit">Login with Google</button>
                </form>
              ) : null}
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
