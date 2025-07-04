"use client";

import axios from "axios";
import { useState, useEffect } from "react";

interface Social {
  id: number;
  name: string;
}

const SocialPage: React.FC = () => {
  const [name, setName] = useState("");
  const [socials, setSocials] = useState<Social[]>([]);

  // Fetch socials from backend
  const fetchSocials = async () => {
    try {
      const res = await axios.get("http://localhost:4000/crm/socials");
      setSocials(res.data);
    } catch (err) {
      console.error("Failed to fetch socials", err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSocials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newSocial = { name };

    try {
      const res = await axios.post("http://localhost:4000/crm/socials", newSocial);
      if (res.status === 200) {
        alert("Social added!");
        setName("");
        fetchSocials(); // 🔁 refresh list after adding
      } else {
        alert("Failed to add social");
      }
    } catch (err) {
      console.error("Error adding social:", err);
      alert("Failed to add social");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Add New Social</h3>
        <input
          type="text"
          value={name}
          placeholder="Enter social name"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Add Social</button>
      </form>

      <hr />

      <h3>All Socials</h3>
      <ul>
        {socials.map((item, index) => (
          <li key={item.id}>
            {index + 1}. {item.name}
          </li>
        ))}
      </ul>

    </div>
  );
};

export default SocialPage;
