"use client";
import { useState } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El correo no tiene un formato válido.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Respuesta del login:", data);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative max-w-sm mx-auto mt-10">
      <form onSubmit={handleSubmit} className="relative bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>

        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 mb-1 rounded"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mb-3">{errors.email}</p>
        )}

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-2 mb-1 rounded"
        />
        {errors.password && (
          <p className="text-red-500 text-xs mb-3">{errors.password}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-950 text-white py-2 rounded ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Enviando..." : "Iniciar sesión"}
        </button>
      </form>

      {isSubmitting && (
        <div className="absolute inset-0 bg-opacity-30 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-blue-900 font-medium">Iniciando sesión...</p>
          </div>
        </div>
      )}
    </div>

  );
}

