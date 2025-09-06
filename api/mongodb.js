// mongodb.js
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in environment variables!");
}

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Reuse client in dev to prevent multiple connections
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect()
      .then(() => console.log("✅ MongoDB connected (development)"))
      .catch((err) => {
        console.error("❌ MongoDB connection failed:", err);
        throw err;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production (serverless) create new client for each invocation
  client = new MongoClient(uri);
  clientPromise = client.connect()
    .then(() => console.log("✅ MongoDB connected (production)"))
    .catch((err) => {
      console.error("❌ MongoDB connection failed:", err);
      throw err;
    });
}

export default clientPromise;
