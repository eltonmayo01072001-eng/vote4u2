import clientPromise from "./mongodb.js";
import { nanoid } from "nanoid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { topic, type, options, durationHours } = req.body;

    if (!topic || !type || !options || options.length < 2 || !durationHours) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const client = await clientPromise;
    const db = client.db("voting");
    const votes = db.collection("votes");

    const voteId = nanoid(8);
    const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);

    const voteDoc = { voteId, topic, type, options, expiresAt, responses: [] };
    await votes.insertOne(voteDoc);

    const link = `${process.env.VITE_API_URL}/vote/${voteId}`;
    res.status(200).json({ link });
  } catch (err) {
    console.error("CreateVote Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}
