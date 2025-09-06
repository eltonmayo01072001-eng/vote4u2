// api/submitVote.js
import clientPromise from "./mongodb.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { voteId, choice, fingerprint } = req.body;
    console.log("📤 SubmitVote payload:", { voteId, choice, fingerprint });

    if (!voteId || !choice || !fingerprint) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const client = await clientPromise;
    const db = client.db("voting");
    const votes = db.collection("votes");

    const vote = await votes.findOne({ voteId });
    if (!vote) return res.status(404).json({ message: "Vote not found" });

    if (new Date() > new Date(vote.expiresAt)) {
      return res.status(403).json({ message: "Voting has ended." });
    }

    if (vote.responses.find((r) => r.fingerprint === fingerprint)) {
      return res.status(403).json({ message: "Already voted from this device." });
    }

    vote.responses.push({ choice, fingerprint, timestamp: new Date() });
    await votes.updateOne({ voteId }, { $set: { responses: vote.responses } });

    console.log("✅ Vote submitted successfully");
    res.status(200).json({ message: "Vote submitted successfully" });
  } catch (err) {
    console.error("❌ submitVote Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
