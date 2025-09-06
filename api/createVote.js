import clientPromise from "./mongodb.js";
import { nanoid } from "nanoid";



export default async function handler(req, res) {
  try {
    console.log("📌 MONGODB_URI:", process.env.MONGODB_URI);
    const { topic, type, options, durationHours } = req.body;
    console.log("📤 Payload received:", { topic, type, options, durationHours });

   
  } catch (err) {
    console.error("❌ CreateVote Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
