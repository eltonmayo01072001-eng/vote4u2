// mongodb.js
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = "mongodb+srv://eltonmayo01072001:Trip2%23ell@cluster0.84fj99m.mongodb.net/voting?retryWrites=true&w=majority&appName=Cluster0";
if (!uri) throw new Error("Add MONGODB_URI to environment variables");

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;
export default clientPromise;
