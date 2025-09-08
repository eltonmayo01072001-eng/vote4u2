import React, { useEffect, useState } from "react";
import ChoiceInput from "../components/ChoiceInput.jsx";
import { translateText } from "../utils/translate.js";
import axios from "axios";

export default function CreateVote() {
  const [topic, setTopic] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [labels, setLabels] = useState({
    createVote: "Create Vote",
    addOption: "Add Option",
    topicPlaceholder: "Topic",
    voteCreated: "Vote Created!",
    copyLink: "Copy Link"
  });
  const [voteLink, setVoteLink] = useState("");

  useEffect(() => {
    async function translateUI() {
      setLabels({
        createVote: await translateText("Create Vote"),
        addOption: await translateText("Add Option"),
        topicPlaceholder: await translateText("Topic"),
        voteCreated: await translateText("Vote Created!"),
        copyLink: await translateText("Copy Link")
      });
    }
    translateUI();
  }, []);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  const addOption = () => setOptions([...options, ""]);
  const deleteOption = (index) => setOptions(options.filter((_, i) => i !== index));

  const handleCreateVote = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/createVote`, { topic, options });
      setVoteLink(`${import.meta.env.VITE_API_URL}/vote/${res.data.voteId}`);
    } catch (err) {
      console.error(err);
      alert("Error creating vote");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(voteLink);
    alert(labels.copyLink);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded mt-10">
      <h1 className="text-2xl font-bold mb-4">{labels.createVote}</h1>
      <input
        type="text"
        placeholder={labels.topicPlaceholder}
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      {options.map((opt, i) => (
        <ChoiceInput
          key={i}
          value={opt}
          onChange={(val) => handleOptionChange(i, val)}
          canDelete={i >= 2}
          onDelete={() => deleteOption(i)}
        />
      ))}

      <button onClick={addOption} className="mb-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        {labels.addOption}
      </button>

      <button onClick={handleCreateVote} className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600">
        {labels.createVote}
      </button>

      {voteLink && (
        <div className="mt-4 p-3 bg-gray-100 rounded flex flex-col gap-2">
          <span className="text-gray-700">{labels.voteCreated}</span>
          <a href={voteLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline break-all">{voteLink}</a>
          <button onClick={copyLink} className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
            {labels.copyLink}
          </button>
        </div>
      )}
    </div>
  );
}
