// api/createVote.js
import clientPromise from "./mongodb.js"; // Use your existing MongoDB client promise
import { nanoid } from "nanoid";

export default async function handler(req, res) {
  console.log("Request received:", req.method, req.body);

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    console.log("Method not allowed:", req.method);
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { topic, type, options, durationHours } = req.body;
    console.log("Received data:", { topic, type, options, durationHours });

    // Basic validation
    if (!topic || !type || !options || options.length < 2 || !durationHours) {
      console.log("Invalid request data");
      return res.status(400).json({ message: "Invalid request data" });
    }

    const client = await clientPromise;
    console.log("Mongo client connected");

    const db = client.db("voting");
    const votes = db.collection("votes");

    const voteId = nanoid(8);
    const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);

    console.log("Inserting vote into DB with ID:", voteId);
    await votes.insertOne({
      _id: voteId, // use _id for consistency with other handlers
      topic,
      type,
      options,
      expiresAt,
      responses: [],
    });

    const link = `${process.env.VITE_API_URL}/vote/${voteId}`;
    console.log("Vote created successfully. Link:", link);

    return res.status(200).json({ link });
  } catch (err) {
    console.error("CreateVote Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
