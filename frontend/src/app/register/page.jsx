"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const usernameRegex = /^[a-zA-Z0-9._]{4,20}$/;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!usernameRegex.test(formData.username)) {
      newErrors.username =
        "El nombre de usuario solo puede contener letras, números, puntos o guiones bajos (4-20 caracteres).";
    }
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
    setIsLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Respuesta del registro:", data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative max-w-sm mx-auto mt-10">
      <form onSubmit={handleSubmit} className="relative">
        <h2 className="text-2xl font-bold mb-4 text-center">Registrate</h2>

        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          onChange={handleChange}
          className="w-full border p-2 mb-1 rounded"
        />
        {errors.username && (
          <p className="text-red-500 text-xs mb-3">{errors.username}</p>
        )}

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

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar Contraseña"
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

      {isLoading && (
        <div className="absolute inset-0  bg-opacity-30 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-blue-900 font-medium">Registrando...</p>
          </div>
        </div>
      )}
    </div>
  );
}
