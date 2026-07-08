"use server";

import { createStartup } from "@/lib/startups";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${key} is required`);
  }

  return value.trim();
}

export async function submitStartup(formData: FormData) {
  const startup = await createStartup({
    title: getRequiredString(formData, "title"),
    description: getRequiredString(formData, "description"),
    category: getRequiredString(formData, "category"),
    image: getRequiredString(formData, "image"),
    pitch: getRequiredString(formData, "pitch"),
    authorName: getRequiredString(formData, "authorName"),
  });

  revalidatePath("/");
  revalidatePath(`/startup/${startup._id}`);
  revalidatePath(`/user/${startup.author._id}`);

  redirect(`/startup/${startup._id}`);
}
