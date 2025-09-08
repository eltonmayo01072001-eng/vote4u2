// voting-frontend/src/utils/translate.js
import axios from "axios";

let translationsCache = {};

/**
 * Translate text to browser language using LibreTranslate API.
 * Returns original text immediately, updates async translations later.
 */
export default function translateText(text) {
  const lang = navigator.language.slice(0, 2);
  if (!translationsCache[lang]) translationsCache[lang] = {};
  if (translationsCache[lang][text]) return translationsCache[lang][text];

  // Async translation (does not block rendering)
  axios
    .post("https://libretranslate.de/translate", {
      q: text,
      source: "en",
      target: lang,
      format: "text",
    })
    .then((res) => {
      translationsCache[lang][text] = res.data.translatedText;
      // Trigger a re-render if needed (can be handled via context or state)
    })
    .catch((err) => {
      console.error("Translation error:", err);
      translationsCache[lang][text] = text; // fallback
    });

  return text; // immediate fallback
}
