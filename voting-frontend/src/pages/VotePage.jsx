import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function VotePage() {
  const { id } = useParams();
  const [vote, setVote] = useState(null);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [hasVoted, setHasVoted] = useState(false);

  const fingerprint = btoa(
    navigator.userAgent +
      navigator.language +
      screen.width +
      screen.height +
      screen.colorDepth +
      new Date().getTimezoneOffset()
  );

  const fetchVote = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/getVote?id=${id}`);
      if (!res.ok) throw new Error("Vote not found");
      const data = await res.json();
      setVote(data);


      if (data.responses.find((r) => r.fingerprint === fingerprint)) {
        setHasVoted(true);
        setShowResults(true);
      }

      if (new Date(data.expiresAt) <= new Date()) setShowResults(true);
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


  const handleOptionChange = (opt) => {
    if (vote.type === "single") {
      setSelected([opt]);
    } else {
      setSelected((prev) =>
        prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
      );
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
        body: JSON.stringify({ voteId: id, choice: selected, fingerprint }),
      });
      const data = await res.json();
      setMessage(data.message);
      setHasVoted(true);
      setShowResults(true);
      await fetchVote();
    } catch (err) {
      console.error("Error submitting vote:", err);
      setMessage("Error submitting vote");
    }
  };

  if (!vote) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  const optionCounts = vote.options.map(
    (opt) =>
      vote.responses.filter((r) =>
        Array.isArray(r.choices) ? r.choices.includes(opt) : r.choices === opt
      ).length
  );

  const votingEnded = new Date(vote.expiresAt) <= new Date();

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-gray-50 shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">{vote.topic}</h1>
      <p className="text-center mb-6 text-gray-500 font-medium">{timeLeft}</p>

      {!showResults && !votingEnded && !hasVoted && (
        <div className="mb-6">
          {vote.options.map((opt) => (
            <label
              key={opt}
              className={`flex items-center mb-3 p-3 border rounded-lg cursor-pointer transition
              ${selected.includes(opt) ? "bg-blue-100 border-blue-400" : "bg-white border-gray-300"}
              hover:bg-blue-50`}
            >
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

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700 transition mt-2"
          >
            Submit Vote
          </button>

          <button
            onClick={() => setShowResults(true)}
            className="w-full bg-gray-400 text-white py-2 rounded-lg shadow hover:bg-gray-500 transition mt-2"
          >
            Show Results
          </button>
        </div>
      )}

      {(showResults || votingEnded || hasVoted) && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-center text-gray-800">Results</h2>
          {vote.options.map((opt, idx) => (
            <div key={opt} className="flex justify-between mb-2 p-2 border-b border-gray-200">
              <span className="text-gray-700">{opt}</span>
              <span className="font-semibold text-gray-800">{optionCounts[idx]} votes</span>
            </div>
          ))}
        </div>
      )}

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
}
