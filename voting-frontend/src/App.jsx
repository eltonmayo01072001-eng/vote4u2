import React from "react";
import { Routes, Route } from "react-router-dom";
import CreateVote from "./pages/CreateVote.jsx";
import VotePage from "./pages/VotePage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CreateVote />} />
      <Route path="/vote/:id" element={<VotePage />} />
    </Routes>
  );
}

export default App;
