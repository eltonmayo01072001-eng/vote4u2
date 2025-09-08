import React from "react";
import translateText from "../utils/translateText.js"; // your translation function

export default function ChoiceInput({ value, onChange, onDelete, canDelete }) {
  return (
    <div className="flex items-center mb-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 p-2 border rounded-lg"
        placeholder={translateText("Option")}
      />
      {canDelete && (
        <button
          onClick={onDelete}
          className="ml-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
        >
          {translateText("Delete")}
        </button>
      )}
    </div>
  );
}
