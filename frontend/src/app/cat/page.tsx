
"use client";
import React, { useState } from "react";
import CatForm from "./components/catForm";
import CatList from "./components/CatList";

const App: React.FC = () => {
  const [refreshCats, setRefreshCats] = useState(false);

  const handleCatAdded = () => {
    setRefreshCats((prev) => !prev); // toggle to trigger re-fetch
  };

  return (
    <div className="App">
      <h1>🐱 Cat Manager</h1>
      <CatForm onCatAdded={handleCatAdded} />
      <CatList refresh={refreshCats} />
    </div>
  );
};

export default App;
