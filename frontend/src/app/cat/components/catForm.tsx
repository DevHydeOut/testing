// src/components/CatForm.tsx
import React, { useState } from "react";
import axios from "axios";
import { CatCreate } from "@/app/type"; // Adjust the import path as needed

const CatForm: React.FC<{ onCatAdded: () => void }> = ({ onCatAdded }) => {
  const [name, setName] = useState("");
  const [catId, setCatId] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newCat: CatCreate = { name, cat_id: catId };

    try {
      await axios.post("http://localhost:4000/crm/cats", newCat);
      alert("Cat added!");
      setName("");
      setCatId(0);
      onCatAdded(); // tell parent to refresh list
    } catch (error) {
      alert("Failed to add cat.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Add a New Cat</h2>
      <input
        type="text"
        placeholder="Cat name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Cat ID (parent)"
        value={catId}
        onChange={(e) => setCatId(Number(e.target.value))}
        required
      />
      <button type="submit">Add Cat</button>
    </form>
  );
};

export default CatForm;
