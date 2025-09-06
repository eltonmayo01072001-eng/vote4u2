// api/mongodb.js
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI not found in environment");

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let clientPromise;

try {
  clientPromise = client.connect().then(() => {
    console.log("✅ MongoDB connected successfully");
    return client;
  });
} catch (err) {
  console.error("❌ MongoDB connection error:", err);
  throw err;
}

export default clientPromise;
