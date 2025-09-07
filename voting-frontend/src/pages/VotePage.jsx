import React from "react";
import { useParams } from "react-router-dom";

export default function VotePage() {
  const { id } = useParams(); // read the :id from URL

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg text-center">
      <h1 className="text-2xl font-bold mb-4">Vote Page</h1>
      <p className="text-lg">Vote ID: <span className="text-blue-500">{id}</span></p>
    </div>
  );
}
