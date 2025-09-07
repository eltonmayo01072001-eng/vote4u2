// api/getVote.js
import clientPromise from "./mongodb.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const id = req.query.id || req.query?.voteId;
  if (!id) {
    return res.status(400).json({ message: "Vote ID is required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("voting");
    const vote = await db.collection("votes").findOne({ voteId: id });

    if (!vote) {
      console.log("❌ Vote not found:", id);
      return res.status(404).json({ message: "Vote not found" });
    }

    console.log("✅ Vote fetched:", vote.voteId);
    res.status(200).json(vote);
  } catch (err) {
    console.error("❌ getVote Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}
