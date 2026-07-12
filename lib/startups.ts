import { getMongoDb } from "./mongodb";

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

type CounterDocument = {
  _id: string;
  sequenceValue: number;
};

const STARTUPS_COLLECTION = "startups";
const COUNTERS_COLLECTION = "counters";

async function getNextSequence(sequenceName: string) {
  const db = await getMongoDb();
  const result = await db.collection<CounterDocument>(COUNTERS_COLLECTION).findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequenceValue: 1 } },
    { upsert: true, returnDocument: "after" },
  );

  return result?.sequenceValue ?? 1;
}

async function getStartupsCollection() {
  const db = await getMongoDb();
  return db.collection<Startup>(STARTUPS_COLLECTION);
}

export async function getStartups(query?: string) {
  const startups = await getStartupsCollection();
  const sortedStartups = await startups
    .find({})
    .sort({ _createdAt: -1 })
    .toArray();

  if (!query) {
    return sortedStartups;
  }

  const normalizedQuery = query.toLowerCase();

  return sortedStartups.filter((startup) =>
    [
      startup.title,
      startup.description,
      startup.category,
      startup.author.name,
      startup.pitch,
    ].some((value) => value.toLowerCase().includes(normalizedQuery)),
  );
}

export async function getStartupById(id: number) {
  const startups = await getStartupsCollection();
  return (await startups.findOne({ _id: id })) ?? null;
}

export async function getAuthorById(id: number) {
  const startups = await getStartupsCollection();
  const startup = await startups.findOne(
    { "author._id": id },
    { projection: { author: 1 } },
  );

  return startup?.author ?? null;
}

export async function getStartupsByAuthor(id: number) {
  const startups = await getStartupsCollection();
  return startups.find({ "author._id": id }).sort({ _createdAt: -1 }).toArray();
}

export async function createStartup(input: StartupInput) {
  const startups = await getStartupsCollection();
  const existingAuthorStartup = await startups.findOne(
    { "author.name": new RegExp(`^${escapeRegExp(input.authorName)}$`, "i") },
    { projection: { author: 1 } },
  );

  const startupId = await getNextSequence("startupId");
  const authorId = existingAuthorStartup?.author._id ?? (await getNextSequence("authorId"));
  const now = new Date();

  const startup: Startup = {
    _id: startupId,
    _createdAt: now.toISOString(),
    views: 0,
    author: existingAuthorStartup?.author ?? {
      _id: authorId,
      name: input.authorName,
    },
    description: input.description,
    image: input.image,
    category: input.category,
    title: input.title,
    pitch: input.pitch,
  };

  await startups.insertOne(startup);

  return startup;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
