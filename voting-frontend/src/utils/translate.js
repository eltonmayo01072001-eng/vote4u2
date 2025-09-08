import axios from "axios";

export async function translateText(text, targetLang = navigator.language.slice(0,2)) {
  try {
    const res = await axios.post("https://libretranslate.de/translate", {
      q: text,
      source: "en",
      target: targetLang,
      format: "text",
    });
    return res.data.translatedText;
  } catch (err) {
    console.error("Translation error:", err);
    return text;
  }
}
