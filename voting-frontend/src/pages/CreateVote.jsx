import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { translateText } from "../utils/translate.js";

export default function VotePage() {
  const { id } = useParams();
  const [vote, setVote] = useState(null);
  const [translatedTopic, setTranslatedTopic] = useState("");
  const [translatedOptions, setTranslatedOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [labels, setLabels] = useState({
    submitVote: "Submit Vote",
    showResults: "Show Results",
    results: "Results",
    votes: "votes",
    loading: "Loading...",
    votingEnded: "Voting ended",
  });

  const fingerprint = btoa(
    navigator.userAgent +
      navigator.language +
      screen.width +
      screen.height +
      screen.colorDepth +
      new Date().getTimezoneOffset()
  );

  // Fetch and translate vote
  const fetchVote = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/getVote?id=${id}`);
      if (!res.ok) throw new Error("Vote not found");
      const data = await res.json();
      setVote(data);

      const tTopic = await translateText(data.topic);
      const tOptions = await Promise.all(data.options.map(opt => translateText(opt)));
      setTranslatedTopic(tTopic);
      setTranslatedOptions(tOptions);

      if (data.responses.find(r => r.fingerprint === fingerprint)) {
        setHasVoted(true);
        setShowResults(true);
      }
      if (new Date(data.expiresAt) <= new Date()) setShowResults(true);
    } catch (err) {
      console.error("Error fetching vote:", err);
      setMessage(await translateText("Failed to load vote"));
    }
  };

  // Translate UI labels
  useEffect(() => {
    async function translateLabels() {
      setLabels({
        submitVote: await translateText("Submit Vote"),
        showResults: await translateText("Show Results"),
        results: await translateText("Results"),
        votes: await translateText("votes"),
        loading: await translateText("Loading..."),
        votingEnded: await translateText("Voting ended"),
      });
    }
    translateLabels();
  }, []);

  useEffect(() => { fetchVote(); }, [id]);

  // Countdown timer
  useEffect(() => {
    if (!vote) return;
    const interval = setInterval(() => {
      const diff = new Date(vote.expiresAt) - new Date();
      setTimeLeft(diff > 0
        ? `${Math.floor(diff / 3600000)}h ${Math.floor((diff % 3600000) / 60000)}m ${Math.floor((diff % 60000) / 1000)}s`
        : labels.votingEnded
      );
      if (diff <= 0) setShowResults(true);
    }, 1000);
    return () => clearInterval(interval);
  }, [vote, labels.votingEnded]);

  const handleOptionChange = (opt) => {
    setSelected(vote.type === "single" 
      ? [opt] 
      : selected.includes(opt) 
        ? selected.filter(o => o !== opt) 
        : [...selected, opt]
    );
  };

  const handleSubmit = async () => {
    if (!selected.length) { alert(await translateText("Select at least one option")); return; }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/submitVote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteId: id, choice: selected, fingerprint }),
      });
      const data = await res.json();
      setMessage(data.message);
      setHasVoted(true);
      setShowResults(true);
      await fetchVote();
    } catch (err) {
      console.error("Error submitting vote:", err);
      setMessage(await translateText("Error submitting vote"));
    }
  };

  if (!vote) return <p className="text-center mt-10 text-gray-600">{labels.loading}</p>;

  const optionCounts = vote.options.map(opt =>
    vote.responses.filter(r => Array.isArray(r.choices) ? r.choices.includes(opt) : r.choices === opt).length
  );

  const maxVotes = Math.max(...optionCounts, 1); // avoid division by zero

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-gray-50 shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">{translatedTopic}</h1>
      <p className="text-center mb-6 text-gray-500 font-medium">{timeLeft}</p>

      {!showResults && !hasVoted && (
        <div className="mb-6">
          {translatedOptions.map((opt, idx) => (
            <label key={opt} className={`flex items-center mb-3 p-3 border rounded-lg cursor-pointer transition
              ${selected.includes(opt) ? "bg-blue-100 border-blue-400" : "bg-white border-gray-300"}
              hover:bg-blue-50`}>
              <input
                type={vote.type === "single" ? "radio" : "checkbox"}
                name="voteOption"
                value={opt}
                checked={selected.includes(opt)}
                onChange={() => handleOptionChange(opt)}
                className="mr-3 w-5 h-5"
              />
              <span className="text-lg text-gray-700">{opt}</span>
            </label>
          ))}

          <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700 transition mt-2">
            {labels.submitVote}
          </button>
          <button onClick={() => setShowResults(true)} className="w-full bg-gray-400 text-white py-2 rounded-lg shadow hover:bg-gray-500 transition mt-2">
            {labels.showResults}
          </button>
        </div>
      )}

      {(showResults || hasVoted) && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-center text-gray-800">{labels.results}</h2>
          {translatedOptions.map((opt, idx) => (
            <div key={opt} className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">{opt}</span>
                <span className="font-semibold text-gray-800">{optionCounts[idx]} {labels.votes}</span>
              </div>
              <div className="h-4 bg-gray-300 rounded-full overflow-hidden">
                <div className="h-4 bg-blue-500 rounded-full transition-all duration-500"
                     style={{ width: `${(optionCounts[idx] / maxVotes) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
}
