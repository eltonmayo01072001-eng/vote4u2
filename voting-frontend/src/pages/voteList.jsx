import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { translateText } from "../api/translate";

export default function cVoteListPage() {
  const [votes, setVotes] = useState([]);
  const [translatedTitles, setTranslatedTitles] = useState([]);

  const fetchVotes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/getVotes`);
      const data = await res.json();
      setVotes(data);

      const translations = await Promise.all(data.map(v => translateText(v.topic)));
      setTranslatedTitles(translations);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchVotes(); }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold mb-4 text-center">All Votes</h1>
      {votes.length === 0 ? (
        <p className="text-center text-gray-500">No votes found</p>
      ) : (
        votes.map((vote, idx) => (
          <Link key={vote.id} to={`/vote/${vote.id}`} className="block p-4 mb-2 border rounded hover:bg-gray-100 transition">
            {translatedTitles[idx] || vote.topic}
          </Link>
        ))
      )}
    </div>
  );
}
