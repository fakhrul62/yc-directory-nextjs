import { promises as fs } from "fs";
import path from "path";

export type StartupAuthor = {
  _id: number;
  name: string;
};

export type Startup = {
  _id: number;
  _createdAt: string;
  views: number;
  author: StartupAuthor;
  description: string;
  image: string;
  category: string;
  title: string;
  pitch: string;
};

export type StartupInput = {
  title: string;
  description: string;
  category: string;
  image: string;
  pitch: string;
  authorName: string;
};

const startupsPath = path.join(process.cwd(), "data", "startups.json");

async function readStartupsFile() {
  const file = await fs.readFile(startupsPath, "utf-8");
  return JSON.parse(file) as Startup[];
}

async function writeStartupsFile(startups: Startup[]) {
  await fs.writeFile(startupsPath, `${JSON.stringify(startups, null, 2)}\n`);
}

export async function getStartups(query?: string) {
  const startups = await readStartupsFile();
  const sortedStartups = startups.sort(
    (a, b) =>
      new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime(),
  );

  if (!query) {
    return sortedStartups;
  }

  const normalizedQuery = query.toLowerCase();

  return sortedStartups.filter((startup) => {
    return [
      startup.title,
      startup.description,
      startup.category,
      startup.author.name,
      startup.pitch,
    ].some((value) => value.toLowerCase().includes(normalizedQuery));
  });
}

export async function getStartupById(id: number) {
  const startups = await readStartupsFile();
  return startups.find((startup) => startup._id === id) ?? null;
}

export async function getAuthorById(id: number) {
  const startups = await readStartupsFile();
  return startups.find((startup) => startup.author._id === id)?.author ?? null;
}

export async function getStartupsByAuthor(id: number) {
  const startups = await getStartups();
  return startups.filter((startup) => startup.author._id === id);
}

export async function createStartup(input: StartupInput) {
  const startups = await readStartupsFile();
  const now = new Date();
  const existingAuthor = startups.find(
    (startup) =>
      startup.author.name.toLowerCase() === input.authorName.toLowerCase(),
  )?.author;
  const nextStartupId =
    startups.reduce((maxId, startup) => Math.max(maxId, startup._id), 0) + 1;
  const nextAuthorId =
    startups.reduce(
      (maxId, startup) => Math.max(maxId, startup.author._id),
      0,
    ) + 1;

  const startup: Startup = {
    _id: nextStartupId,
    _createdAt: now.toISOString(),
    views: 0,
    author: existingAuthor ?? {
      _id: nextAuthorId,
      name: input.authorName,
    },
    description: input.description,
    image: input.image,
    category: input.category,
    title: input.title,
    pitch: input.pitch,
  };

  await writeStartupsFile([startup, ...startups]);

  return startup;
}
