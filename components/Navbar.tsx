import { auth, signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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
            <Link href="/login" className="login px-5 py-2">
              Login / Sign Up
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
