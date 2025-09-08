// src/utils/translateText.js
export async function translateText(text, targetLang = navigator.language || "en") {
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLang }),
    });

    const data = await res.json();
    return data.translatedText || text;
  } catch (err) {
    console.error("Translation error:", err);
    return text; // fallback
  }
}
