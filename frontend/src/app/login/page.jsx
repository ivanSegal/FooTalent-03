"use client";
import { useState } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log("Respuesta del login:", data);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>

      <input
        type="email"
        name="email"
        placeholder="Correo"
        onChange={handleChange}
        required
        className="w-full border p-2 mb-4 rounded"
      />

      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        onChange={handleChange}
        required
        className="w-full border p-2 mb-4 rounded"
      />

      <button className="w-full bg-blue-600 text-white py-2 rounded">
        Iniciar sesión
      </button>
    </form>
  );
}
