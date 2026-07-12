import { MongoClient } from "mongodb";

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

export function getMongoClient() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  const client =
    globalForMongo.mongoClientPromise ??
    new MongoClient(uri).connect();

  if (process.env.NODE_ENV !== "production") {
    globalForMongo.mongoClientPromise = client;
  }

  return client;
}

export async function getMongoDb() {
  const mongoClient = await getMongoClient();
  const databaseName = process.env.MONGODB_DB ?? "yc-directory";

  return mongoClient.db(databaseName);
}
