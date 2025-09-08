import React, { useState, useEffect } from "react";
import { translateText } from "../utils/translate.js";

export default function ChoiceInput({ value, onChange, onDelete, canDelete }) {
  const [deleteLabel, setDeleteLabel] = useState("Delete");
  const [placeholder, setPlaceholder] = useState("Option");

  useEffect(() => {
    async function fetchLabels() {
      setDeleteLabel(await translateText("Delete"));
      setPlaceholder(await translateText("Option"));
    }
    fetchLabels();
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
