"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!formData.email.includes("@"))
      newErrors.email = "El correo no es válido.";
    if (formData.password.length < 6)
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log("Respuesta del registro:", data);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Registrate</h2>

      <input
        type="text"
        name="name"
        placeholder="Nombre"
        onChange={handleChange}
        className="w-full border p-2 mb-1 rounded"
      />
      {errors.name && <p className="text-red-500 text-xs mb-3">{errors.name}</p>}

      <input
        type="email"
        name="email"
        placeholder="Correo"
        onChange={handleChange}
        className="w-full border p-2 mb-1 rounded"
      />
      {errors.email && <p className="text-red-500 text-xs mb-3">{errors.email}</p>}

      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        onChange={handleChange}
        className="w-full border p-2 mb-1 rounded"
      />
      {errors.password && (
        <p className="text-red-500 text-xs mb-3">{errors.password}</p>
      )}

      <button className="w-full bg-blue-950 text-white py-2 rounded">
        Registrarme
      </button>
    </form>
  );
}
