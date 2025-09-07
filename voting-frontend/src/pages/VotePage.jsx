import React from "react";
import { useParams } from "react-router-dom";

export default function VotePage() {
  const { id } = useParams();

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg text-center">
      <h1 className="text-2xl font-bold mb-4">Vote Page</h1>
      <p>Your Vote ID is: <strong>{id}</strong></p>
    </div>
  );
}
