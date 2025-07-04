// src/components/CatList.tsx
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Cat } from "@/app/type";

const CatList: React.FC<{ refresh: boolean }> = ({ refresh }) => {
  const [cats, setCats] = useState<Cat[]>([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await axios.get("http://localhost:4000/crm/cats");
        setCats(response.data);
      } catch (error) {
        console.error("Error fetching cats:", error);
      }
    };

    fetchCats();
  }, [refresh]);

  return (
    <div className="cat-list">
      <h2>All Cats</h2>
      <ul>
        {cats.map((cat) => (
          <li key={cat.id}>
            ID: {cat.id} | Name: {cat.name} | Parent ID: {cat.cat_id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CatList;
