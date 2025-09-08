import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function VotePage() {
  const { id } = useParams();
  const [vote, setVote] = useState(null);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  // Fetch vote from API
  const fetchVote = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/getVote?id=${id}`);
      if (!res.ok) throw new Error("Vote not found");
      const data = await res.json();
      setVote(data);

      if (new Date(data.expiresAt) <= new Date()) setShowResults(true);
    } catch (err) {
      console.error("Error fetching vote:", err);
      setMessage("Failed to load vote");
    }
  };

  useEffect(() => {
    fetchVote();
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (!vote) return;

    const updateTimer = () => {
      const now = new Date();
      const expires = new Date(vote.expiresAt);
      const diff = expires - now;

      if (diff <= 0) {
        setTimeLeft("Voting ended");
        setShowResults(true);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [vote]);

  // Generate simple fingerprint
  const getFingerprint = () =>
    btoa(
      navigator.userAgent +
        navigator.language +
        screen.width +
        screen.height +
        screen.colorDepth +
        new Date().getTimezoneOffset()
    );

  // Handle option selection
  const handleOptionChange = (opt) => {
    if (vote.type === "single") {
      setSelected([opt]);
    } else {
      setSelected((prev) =>
        prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
      );
    }
  };

  // Submit vote
  const handleSubmit = async () => {
    if (!selected.length) {
      alert("Select at least one option");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/submitVote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteId: id, choice: selected, fingerprint: getFingerprint() }),
      });
      const data = await res.json();
      setMessage(data.message);
      await fetchVote();
      setShowResults(true);
    } catch (err) {
      console.error("Error submitting vote:", err);
      setMessage("Error submitting vote");
    }
  };

  if (!vote) return <p className="text-center mt-10">Loading...</p>;

  const optionCounts = vote.options.map(
    (opt) =>
      vote.responses.filter((r) =>
        Array.isArray(r.choices) ? r.choices.includes(opt) : r.choices === opt
      ).length
  );

  const votingEnded = new Date(vote.expiresAt) <= new Date();

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">{vote.topic}</h1>
      <p className="text-center mb-4 text-gray-600 font-medium">{timeLeft}</p>

      {!showResults && !votingEnded && (
        <div className="mb-4">
          {vote.options.map((opt) => (
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
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mt-2"
          >
            Submit Vote
          </button>

          <button
            onClick={() => setShowResults(true)}
            className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 mt-2"
          >
            Show Results
          </button>
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
