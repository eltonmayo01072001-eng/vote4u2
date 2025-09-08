// api/translate.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { text, targetLang } = req.body;

  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: targetLang || "en",
        format: "text",
      }),
    });

    if (!response.ok) throw new Error("Translation failed");
    const data = await response.json();
    res.status(200).json({ translatedText: data.translatedText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ translatedText: text }); // fallback
  }
}
