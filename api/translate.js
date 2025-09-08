// api/translate.js
export async function translateText(text, targetLang = navigator?.language || "en") {
  try {
    const res = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: targetLang.split("-")[0] || "en",
        format: "text"
      })
    });

    if (!res.ok) throw new Error("Translation failed");
    const data = await res.json();
    return data.translatedText;
  } catch (err) {
    console.error("Translation error:", err);
    return text; // fallback
  }
}
