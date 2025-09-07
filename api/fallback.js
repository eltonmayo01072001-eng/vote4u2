import { readFile } from "fs/promises";
import { join } from "path";

export default async function handler(req, res) {
  try {
    const indexPath = join(process.cwd(), "voting-frontend", "dist", "index.html");
    const html = await readFile(indexPath, "utf-8");
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (err) {
    console.error("❌ Fallback Error:", err);
    res.status(500).send("Server Error");
  }
}
