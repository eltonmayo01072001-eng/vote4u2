// api/createVote.js
import { MongoClient } from "mongodb";
import { nanoid } from "nanoid";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { topic, type, options, durationHours } = req.body;

    // Basic validation
    if (!topic || !type || !options || options.length < 2 || !durationHours) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    await client.connect();
    const db = client.db("voting");
    const votes = db.collection("votes");

    const voteId = nanoid(8);
    const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);

    await votes.insertOne({
      voteId,
      topic,
      type,
      options,
      expiresAt,
      responses: [],
    });

    return res.status(200).json({ link: `${process.env.VITE_API_URL}/vote/${voteId}` });
  } catch (err) {
    console.error("CreateVote Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
