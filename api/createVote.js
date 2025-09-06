import clientPromise from "./mongodb.js";
import { nanoid } from "nanoid";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // Replace '*' with your frontend URL if needed
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { topic, type, options, durationHours } = req.body;
    if (!topic || !type || !options || options.length < 2) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const client = await clientPromise;
    const db = client.db("voting");
    const votes = db.collection("votes");

    const id = nanoid(8);
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + durationHours * 60 * 60 * 1000);

    await votes.insertOne({ _id: id, topic, type, options, responses: [], createdAt, expiresAt });

    res.status(200).json({ voteId: id, link: `/vote/${id}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
