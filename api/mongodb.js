import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI not defined");
}

const client = new MongoClient(process.env.MONGODB_URI);
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Production: always create a fresh connection (Vercel serverless)
  clientPromise = client.connect();
}

export default clientPromise;
