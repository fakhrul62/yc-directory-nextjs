"use server";

import { signIn } from "@/auth";
import { getMongoDb } from "@/lib/mongodb";
import { hashPassword } from "@/lib/password";

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${key} is required`);
  }

  return value.trim();
}

function getEmail(formData: FormData) {
  return getRequiredString(formData, "email").toLowerCase();
}

export async function loginWithEmail(formData: FormData) {
  await signIn("credentials", {
    email: getEmail(formData),
    password: getRequiredString(formData, "password"),
    redirectTo: "/",
  });
}

export async function signUpWithEmail(formData: FormData) {
  const name = getRequiredString(formData, "name");
  const email = getEmail(formData);
  const password = getRequiredString(formData, "password");

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const db = await getMongoDb();
  const users = db.collection("users");
  const existingUser = await users.findOne({ email });

  if (!existingUser) {
    await users.insertOne({
      name,
      email,
      emailVerified: null,
      image: null,
      passwordHash: await hashPassword(password),
    });
  }

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/",
  });
}

export async function loginWithGitHub() {
  await signIn("github", { redirectTo: "/" });
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/" });
}
