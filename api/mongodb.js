// mongodb.js
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("❌ MONGO_URI is not defined in environment variables!");
}

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In dev mode, reuse client to prevent creating too many connections
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    global._mongoClientPromise = client.connect()
      .then((c) => {
        console.log("✅ MongoDB connected (development mode)");
        return c;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection failed:", err);
        throw err;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production (serverless deployment)
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  clientPromise = client.connect()
    .then((c) => {
      console.log("✅ MongoDB connected (production mode)");
      return c;
    })
    .catch((err) => {
      console.error("❌ MongoDB connection failed:", err);
      throw err;
    });
}

export default clientPromise;
