import React, { useState } from "react";
import axios from "axios";

export default function CreateVote() {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("single"); // single/multiple
  const [options, setOptions] = useState(["", ""]); // at least 2
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [voteLink, setVoteLink] = useState("");

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, ""]);

  const handleCreateVote = async () => {
    const durationHours = hours + minutes / 60 + seconds / 3600;

    const payload = { topic, type, options, durationHours };
    console.log("VITE_API_URL value:", import.meta.env.VITE_API_URL);
    console.log("Sending payload:", payload);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/createVote`,
        payload
      );
      console.log("Response received:", res.data);
      setVoteLink(res.data.link);
    } catch (err) {
      console.error("Error creating vote:", err);
      alert("Error creating vote. Check console for details.");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(voteLink);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded mt-10">
      <h1 className="text-2xl font-bold mb-4">Create a New Vote</h1>

      <input
        type="text"
        placeholder="Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      >
        <option value="single">Single Choice</option>
        <option value="multiple">Multiple Choice</option>
      </select>

      {options.map((opt, i) => (
        <input
          key={i}
          type="text"
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={(e) => handleOptionChange(i, e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
      ))}

      <button
        onClick={addOption}
        className="mb-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Option
      </button>

      <div className="mb-4">
        <h2 className="font-semibold mb-1">Select Duration</h2>
        <div className="flex gap-2">
          <select
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="p-2 border rounded"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>{i} Hours</option>
            ))}
          </select>
          <select
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="p-2 border rounded"
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>{i} Minutes</option>
            ))}
          </select>
          <select
            value={seconds}
            onChange={(e) => setSeconds(Number(e.target.value))}
            className="p-2 border rounded"
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>{i} Seconds</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleCreateVote}
        className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Create Vote
      </button>

      {voteLink && (
        <div className="mt-4 p-3 bg-gray-100 rounded flex flex-col gap-2">
          <span className="text-gray-700">Vote Created!</span>
          <a
            href={voteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline break-all"
          >
            {voteLink}
          </a>
          <button
            onClick={copyLink}
            className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Copy Link
          </button>
        </div>
      )}
    </div>
  );
}
