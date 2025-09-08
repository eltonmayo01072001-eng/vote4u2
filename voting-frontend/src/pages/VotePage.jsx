// src/pages/VotePage.jsx
import React, { useEffect, useState } from "react";
import { translateText } from "../utils/translateText.js";

export default function VotePage({ vote }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [labels, setLabels] = useState({
    loading: "Loading...",
    votingEnded: "Voting ended",
  });

  useEffect(() => {
    async function translateLabels() {
      setLabels({
        loading: await translateText("Loading..."),
        votingEnded: await translateText("Voting ended"),
      });
    }
    translateLabels();
  }, []);

  useEffect(() => {
    if (!vote) return;
    const timer = setInterval(() => {
      const diff = new Date(vote.endTime).getTime() - Date.now();
      setTimeLeft(
        diff > 0
          ? `${Math.floor(diff / 3600000)}h ${Math.floor((diff % 3600000) / 60000)}m ${Math.floor((diff % 60000) / 1000)}s`
          : labels.votingEnded
      );
      if (diff <= 0) setShowResults(true);
    }, 1000);
    return () => clearInterval(timer);
  }, [vote, labels.votingEnded]);

  if (!vote) return <p className="text-center mt-10 text-gray-600">{labels.loading}</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{vote.title}</h1>
      <p className="mb-4">{timeLeft}</p>
      {!showResults && (
        <div>
          {vote.options.map((opt, i) => (
            <button key={i} className="w-full mb-2 p-2 border rounded-lg">
              {opt}
            </button>
          ))}
        </div>
      )}
      {showResults && <div> {/* Render results here */} </div>}
    </div>
  );
}
