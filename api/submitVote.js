import clientPromise from "./mongodb.js";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const { voteId, choice, fingerprint } = req.body;
    if (!voteId || !choice || !fingerprint) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const client = await clientPromise;
    const db = client.db("voting");
    const votes = db.collection("votes");
    const vote = await votes.findOne({ _id: voteId });

    if (!vote) return res.status(404).json({ message: "Vote not found" });
    if (new Date() > new Date(vote.expiresAt)) return res.status(403).json({ message: "Voting has ended." });
    if (vote.responses.find((r) => r.fingerprint === fingerprint)) return res.status(403).json({ message: "Already voted from this device." });

    vote.responses.push({ choice, fingerprint, timestamp: new Date() });
    await votes.updateOne({ _id: voteId }, { $set: { responses: vote.responses } });

    res.status(200).json({ message: "Vote submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
