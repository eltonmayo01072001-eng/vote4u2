// api/createVote.js
import { MongoClient } from "mongodb";
import { nanoid } from "nanoid";

console.log("VITE_API_URL:", process.env.VITE_API_URL);
console.log("MONGODB_URI:", process.env.MONGODB_URI);

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    console.log("Invalid method:", req.method);
    return res.status(405).json({ message: "Method not allowed" });
  }

  console.log("Request body received:", req.body);

  try {
    const { topic, type, options, durationHours } = req.body;

    // Basic validation
    if (!topic || !type || !options || options.length < 2 || !durationHours) {
      console.log("Validation failed:", { topic, type, options, durationHours });
      return res.status(400).json({ message: "Invalid request data" });
    }

    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("MongoDB connected");

    const db = client.db("voting");
    const votes = db.collection("votes");

    const voteId = nanoid(8);
    const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);

    console.log("Inserting vote:", { voteId, topic, type, options, expiresAt });

    const insertResult = await votes.insertOne({
      voteId,
      topic,
      type,
      options,
      expiresAt,
      responses: [],
    });

    console.log("Insert result:", insertResult);

    if (!process.env.VITE_API_URL) {
      console.log("VITE_API_URL is missing!");
      return res.status(500).json({ message: "Server config error: VITE_API_URL missing" });
    }

    const voteLink = `${process.env.VITE_API_URL}/vote/${voteId}`;
    console.log("Vote link:", voteLink);

    return res.status(200).json({ link: voteLink });
  } catch (err) {
    console.error("CreateVote Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
