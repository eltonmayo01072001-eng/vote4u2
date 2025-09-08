import React, { useState } from "react";
import ChoiceInput from "../components/ChoiceInput.jsx";
import { translateText } from "../../../api/translate.js";

export default function CreateVote() {
  const [topic, setTopic] = useState("");
  const [choices, setChoices] = useState(["", ""]);
  const [message, setMessage] = useState("");
  const [voteType, setVoteType] = useState("single");

  const lang = navigator.language || "en";

  const handleChoiceChange = (index, value) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const addChoice = () => setChoices([...choices, ""]);
  const removeChoice = (index) => setChoices(choices.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!topic.trim() || choices.some((c) => !c.trim())) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/createVote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, options: choices, type: voteType }),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      console.error(err);
      setMessage("Error creating vote");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-50 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Create Vote</h1>

      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Vote Topic"
        className="w-full p-2 mb-4 border rounded-lg"
      />

      {choices.map((choice, idx) => (
        <ChoiceInput
          key={idx}
          value={choice}
          onChange={(val) => handleChoiceChange(idx, val)}
          onDelete={() => removeChoice(idx)}
          canDelete={choices.length > 1}
        />
      ))}

      <button
        onClick={addChoice}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
      >
        Add Option
      </button>

      <div className="mt-4">
        <label>
          <input
            type="radio"
            value="single"
            checked={voteType === "single"}
            onChange={() => setVoteType("single")}
          />{" "}
          Single Choice
        </label>
        <label className="ml-4">
          <input
            type="radio"
            value="multiple"
            checked={voteType === "multiple"}
            onChange={() => setVoteType("multiple")}
          />{" "}
          Multiple Choice
        </label>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Create Vote
      </button>

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
}
