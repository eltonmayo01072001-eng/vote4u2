import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    // Path to the built index.html
    const indexPath = path.resolve("./voting-frontend/dist/index.html");
    const html = fs.readFileSync(indexPath, "utf-8");

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (err) {
    console.error("❌ Fallback Error:", err);
    res.status(500).send("Server error");
  }
}
