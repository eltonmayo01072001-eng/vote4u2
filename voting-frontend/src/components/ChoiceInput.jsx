import React from "react";

export default function ChoiceInput({ value, onChange, onDelete }) {
  return (
    <div className="flex items-center mb-2">
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="border rounded p-2 flex-1"
      />
      <button
        onClick={onDelete}
        className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );
}
