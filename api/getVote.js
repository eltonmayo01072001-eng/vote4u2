import clientPromise from "./mongodb.js";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  const { id } = req.query; // Vercel sends dynamic params via req.query
  try {
    const client = await clientPromise;
    const db = client.db("voting");
    const vote = await db.collection("votes").findOne({ _id: id });

    if (!vote) return res.status(404).json({ message: "Vote not found" });
    res.status(200).json(vote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
