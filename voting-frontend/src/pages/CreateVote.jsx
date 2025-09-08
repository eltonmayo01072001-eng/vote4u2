// src/pages/CreateVote.jsx
import React, { useState, useEffect } from "react";
import ChoiceInput from "../components/ChoiceInput.jsx";
import { translateText } from "../../../api/translate.js";

export default function CreateVote() {
  const [topic, setTopic] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [voteType, setVoteType] = useState("single");
  const [message, setMessage] = useState("");
  
  // Translated labels
  const [headingText, setHeadingText] = useState("Create Vote");
  const [topicPlaceholder, setTopicPlaceholder] = useState("Vote Topic");
  const [optionPlaceholderBase, setOptionPlaceholderBase] = useState("Option");
  const [addOptionText, setAddOptionText] = useState("Add Option");
  const [submitText, setSubmitText] = useState("Create Vote");
  const [singleText, setSingleText] = useState("Single Choice");
  const [multipleText, setMultipleText] = useState("Multiple Choice");

  useEffect(() => {
    async function translateLabels() {
      setHeadingText(await translateText("Create Vote"));
      setTopicPlaceholder(await translateText("Vote Topic"));
      setOptionPlaceholderBase(await translateText("Option"));
      setAddOptionText(await translateText("Add Option"));
      setSubmitText(await translateText("Create Vote"));
      setSingleText(await translateText("Single Choice"));
      setMultipleText(await translateText("Multiple Choice"));
    }
    translateLabels();
  }, []);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (index) => setOptions(options.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!topic.trim() || options.some(opt => !opt.trim())) {
      setMessage(await translateText("Please fill in all fields"));
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/createVote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, options, type: voteType }),
      });
      const data = await res.json();
      setMessage(await translateText(data.message || "Vote created!"));
      setTopic("");
      setOptions(["", ""]);
      setVoteType("single");
    } catch (err) {
      console.error(err);
      setMessage(await translateText("Error creating vote"));
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-gray-50 shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-4">{headingText}</h1>

      <input
        type="text"
        placeholder={topicPlaceholder}
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-2 mb-4 border rounded-lg"
      />

      <div className="mb-4">
        {options.map((opt, idx) => (
          <ChoiceInput
            key={idx}
            value={opt}
            onChange={(val) => handleOptionChange(idx, val)}
            onDelete={() => removeOption(idx)}
            canDelete={options.length > 2}
          />
        ))}
        <button
          onClick={addOption}
          className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          {addOptionText}
        </button>
      </div>

      <div className="mb-4">
        <label className="mr-4">
          <input
            type="radio"
            name="voteType"
            value="single"
            checked={voteType === "single"}
            onChange={() => setVoteType("single")}
            className="mr-2"
          />
          {singleText}
        </label>
        <label>
          <input
            type="radio"
            name="voteType"
            value="multiple"
            checked={voteType === "multiple"}
            onChange={() => setVoteType("multiple")}
            className="mr-2"
          />
          {multipleText}
        </label>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
      >
        {submitText}
      </button>

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
}
