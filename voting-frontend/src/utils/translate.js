// src/utils/translate.js
import axios from "axios";

/**
 * Translate text to browser language using LibreTranslate API.
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language (default: browser language)
 * @returns {string} Translated text
 */
export async function translateText(text, targetLang = navigator.language.slice(0, 2)) {
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
    return text; // fallback to original
  }
}
