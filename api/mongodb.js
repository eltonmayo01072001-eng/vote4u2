// mongodb.js
import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in environment variables!");
}

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable to reuse client across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    global._mongoClientPromise = client.connect()
      .then(() => console.log("✅ MongoDB connected (development mode)"))
      .catch((err) => {
        console.error("❌ MongoDB connection failed:", err);
        throw err;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production (serverless), create a new client per deployment instance
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  clientPromise = client.connect()
    .then(() => console.log("✅ MongoDB connected (production mode)"))
    .catch((err) => {
      console.error("❌ MongoDB connection failed:", err);
      throw err;
    });
}

export default clientPromise;
