import clientPromise from "./mongodb.js";
import { nanoid } from "nanoid";



export default async function handler(req, res) {
  console.log("📌 MONGODB_URI:", process.env.MONGODB_URI);
  try {
    
   
  } catch (err) {
    console.error("❌ CreateVote Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
