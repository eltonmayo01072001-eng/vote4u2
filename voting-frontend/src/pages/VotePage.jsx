import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function VotePage() {
  const { id } = useParams();
  const [vote, setVote] = useState(null);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  const fetchVote = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/getVote/${id}`);
      const data = await res.json();
      setVote(data);
      if (data.responses.some(r => r.fingerprint === getFingerprint()) || new Date(data.expiresAt) <= new Date()) {
        setShowResults(true);
      }
    } catch (err) {
      console.error("Error fetching vote:", err);
      setMessage("Failed to load vote");
    }
  };

  useEffect(() => {
    fetchVote();
  }, [id]);


  useEffect(() => {
    if (!vote) return;
    const interval = setInterval(() => {
      const now = new Date();
      const diff = new Date(vote.expiresAt) - now;
      setTimeLeft(diff > 0 ? `${Math.floor(diff/3600000)}h ${Math.floor((diff%3600000)/60000)}m ${Math.floor((diff%60000)/1000)}s` : "Voting ended");
    }, 1000);
    return () => clearInterval(interval);
  }, [vote]);

  const getFingerprint = () =>
    btoa(
      navigator.userAgent +
      navigator.language +
      screen.width +
      screen.height +
      screen.colorDepth +
      new Date().getTimezoneOffset()
    );

  const handleOptionChange = (opt) => {
    if (vote.type === "single") {
      setSelected([opt]);
    } else {
      setSelected(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]);
    }
  };

  const handleSubmit = async () => {
    if (!selected.length) {
      alert("Select at least one option");
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/submitVote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteId: id, choice: selected, fingerprint: getFingerprint() })
      });
      const data = await res.json();
      setMessage(data.message);
      setShowResults(true); 
      await fetchVote();
    } catch (err) {
      console.error("Error submitting vote:", err);
      setMessage("Error submitting vote");
    }
  };

  if (!vote) return <p className="text-center mt-10">Loading...</p>;

  const optionCounts = vote.options.map(
    opt => vote.responses.filter(r => Array.isArray(r.choices) ? r.choices.includes(opt) : r.choices === opt).length
  );

  const votingEnded = new Date(vote.expiresAt) <= new Date();

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">{vote.topic}</h1>
      <p className="text-center mb-4 text-gray-600 font-medium">{timeLeft}</p>

      {!showResults && !votingEnded && (
        <div className="mb-4">
          {vote.options.map(opt => (
            <label key={opt} className="flex items-center mb-2 cursor-pointer">
              <input
                type={vote.type === "single" ? "radio" : "checkbox"}
                name="voteOption"
                value={opt}
                checked={selected.includes(opt)}
                onChange={() => handleOptionChange(opt)}
                className="mr-2"
              />
              <span className="text-lg">{opt}</span>
            </label>
          ))}

          <button
            onClick={handleSubmit}
            className={`w-full py-2 mt-2 rounded ${showResults ? 'hidden' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          >
            Submit Vote
          </button>

          {!showResults && (
            <button
              onClick={() => setShowResults(true)}
              className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 mt-2"
            >
              Show Results
            </button>
          )}
        </div>
      )}

      {(showResults || votingEnded) && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-center">Results</h2>
          {vote.options.map((opt, idx) => (
            <div key={opt} className="flex justify-between mb-2">
              <span>{opt}</span>
              <span>{optionCounts[idx]} votes</span>
            </div>
          ))}
        </div>
      )}

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
}
