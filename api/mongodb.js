// api/mongodb.js
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set in environment variables");
  throw new Error("Add MONGODB_URI to .env");
}

console.log("MongoDB URI loaded from environment");

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let clientPromise = null;

async function connectClient() {
  if (!clientPromise) {
    try {
      console.log("Connecting to MongoDB...");
      clientPromise = await client.connect();
      console.log("MongoDB connected successfully!");
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
      throw err;
    }
  } else {
    console.log("Reusing existing MongoDB client connection");
  }
  return clientPromise;
}

export default connectClient();
