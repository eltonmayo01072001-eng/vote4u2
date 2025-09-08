// src/components/ChoiceInput.jsx
import React, { useEffect, useState } from "react";
import { translateText } from "../utils/translateText.js";

export default function ChoiceInput({ value, onChange, onDelete, canDelete }) {
  const [placeholder, setPlaceholder] = useState("Option");
  const [deleteLabel, setDeleteLabel] = useState("Delete");

  useEffect(() => {
    async function translateLabels() {
      setPlaceholder(await translateText("Option"));
      setDeleteLabel(await translateText("Delete"));
    }
    translateLabels();
  }, []);

  return (
    <div className="flex items-center mb-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 p-2 border rounded-lg"
        placeholder={placeholder}
      />
      {canDelete && (
        <button
          onClick={onDelete}
          className="ml-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
        >
          {deleteLabel}
        </button>
      )}
    </div>
  );
}
