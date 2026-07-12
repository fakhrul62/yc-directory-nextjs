import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not set");
}

const databaseName = process.env.MONGODB_DB ?? "yc-directory";
const startupsPath = path.join(projectRoot, "data", "startups.json");

const client = new MongoClient(uri);
await client.connect();

try {
  const db = client.db(databaseName);
  const startups = JSON.parse(await readFile(startupsPath, "utf-8"));

  if (!Array.isArray(startups)) {
    throw new Error("startups.json must contain an array");
  }

  if (startups.length > 0) {
    await db.collection("startups").deleteMany({});
    await db.collection("startups").insertMany(startups);
  }

  const maxStartupId = startups.reduce(
    (maxId, startup) => Math.max(maxId, startup._id ?? 0),
    0,
  );
  const maxAuthorId = startups.reduce(
    (maxId, startup) => Math.max(maxId, startup.author?._id ?? 0),
    0,
  );

  await db.collection("counters").updateMany(
    {},
    { $set: { sequenceValue: 0 } },
  );
  await db.collection("counters").updateOne(
    { _id: "startupId" },
    { $set: { sequenceValue: maxStartupId } },
    { upsert: true },
  );
  await db.collection("counters").updateOne(
    { _id: "authorId" },
    { $set: { sequenceValue: maxAuthorId } },
    { upsert: true },
  );

  console.log(`Seeded ${startups.length} startups into ${databaseName}.`);
} finally {
  await client.close();
}
