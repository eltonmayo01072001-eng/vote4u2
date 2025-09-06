import { MongoClient } from "mongodb";

const uri = "mongodb+srv://eltonmayo01072001:Trip2%23ell@cluster0.84fj99m.mongodb.net/voting";
const client = new MongoClient(uri);

async function test() {
  try {
    await client.connect();
    const db = client.db("voting");
    const collections = await db.listCollections().toArray();
    console.log("Connected! Collections:", collections);
  } catch (err) {
    console.error("Mongo connection error:", err);
  } finally {
    await client.close();
  }
}

test();
