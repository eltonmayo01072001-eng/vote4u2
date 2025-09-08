// api/translate.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { text, targetLang = "en" } = req.body;

  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: targetLang,
        format: "text"
      }),
    });

    const data = await response.json();
    res.status(200).json({ translatedText: data.translatedText });
  } catch (err) {
    console.error("Translation API error:", err);
    res.status(500).json({ translatedText: text });
  }
}
