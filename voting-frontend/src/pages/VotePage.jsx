import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function VotePage() {
  const { id } = useParams();
  const [vote, setVote] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchVote = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/getVote?id=${id}`);
        if (!res.ok) throw new Error("Vote not found");
        const data = await res.json();
        setVote(data);
      } catch (err) {
        setMessage(err.message);
      }
    };

    fetchVote();
  }, [id]);

  if (message) return <p className="text-center mt-10 text-red-500">{message}</p>;
  if (!vote) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">{vote.topic}</h1>
      <p className="text-center">Vote ID: {vote.voteId}</p>
      <p className="text-center">Expires At: {new Date(vote.expiresAt).toLocaleString()}</p>
      <ul className="mt-4">
        {vote.options.map((opt) => (
          <li key={opt} className="mb-2">
            {opt}
          </li>
        ))}
      </ul>
    </div>
  );
}
