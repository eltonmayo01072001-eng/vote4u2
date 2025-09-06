import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in environment variables!");
}

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  global._mongoClientPromise = client.connect()
    .then((c) => {
      console.log("✅ MongoDB connected (serverless mode)");
      return c;
    })
    .catch((err) => {
      console.error("❌ MongoDB connection failed:", err);
      throw err;
    });
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
