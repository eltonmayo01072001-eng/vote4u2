// src/pages/CreateVote.jsx
import React, { useState, useEffect } from "react";
import ChoiceInput from "../components/ChoiceInput";
import { translateText } from "../utils/translateText.js";

export default function CreateVote() {
  const [title, setTitle] = useState("");
  const [choices, setChoices] = useState([""]);
  const [labels, setLabels] = useState({
    header: "Create Vote",
    titlePlaceholder: "Vote Topic",
    addOption: "Add Option",
    submit: "Create Vote",
  });

  useEffect(() => {
    async function translateLabels() {
      setLabels({
        header: await translateText("Create Vote"),
        titlePlaceholder: await translateText("Vote Topic"),
        addOption: await translateText("Add Option"),
        submit: await translateText("Create Vote"),
      });
    }
    translateLabels();
  }, []);

  const handleChoiceChange = (index, value) => {
    const updated = [...choices];
    updated[index] = value;
    setChoices(updated);
  };

  const handleAddChoice = () => setChoices([...choices, ""]);
  const handleDeleteChoice = (index) => setChoices(choices.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call your backend to create the vote
    console.log({ title, choices });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{labels.header}</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={labels.titlePlaceholder}
        className="w-full p-2 mb-4 border rounded-lg"
      />
      {choices.map((choice, i) => (
        <ChoiceInput
          key={i}
          value={choice}
          onChange={(val) => handleChoiceChange(i, val)}
          onDelete={() => handleDeleteChoice(i)}
          canDelete={choices.length > 1}
        />
      ))}
      <button
        onClick={handleAddChoice}
        className="mt-2 mb-4 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
      >
        {labels.addOption}
      </button>
      <button
        onClick={handleSubmit}
        className="w-full bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600"
      >
        {labels.submit}
      </button>
    </div>
  );
}
