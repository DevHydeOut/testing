'use client';

import { useEffect, useState } from "react";

export default function HomePage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/crm")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("API not reachable"));
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800">Message: {message}</h1>
    </main>
  );
}