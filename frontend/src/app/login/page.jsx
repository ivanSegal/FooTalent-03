"use client";
import { useState } from "react";
import { login } from "../../services/authService";

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const usernameRegex = /^[a-zA-Z0-9._]{4,20}$/;
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "El username es obligatorio.";
    } else if (!usernameRegex.test(formData.username)) {
      newErrors.username = "El username no tiene un formato válido.";
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
      const data = await login(formData);
      console.log("Respuesta del login:", data);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative mx-auto mt-10 max-w-sm">
      <form onSubmit={handleSubmit} className="relative rounded bg-white p-4 shadow">
        <h2 className="mb-4 text-center text-2xl font-bold">Iniciar sesión</h2>

        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={formData.username}
          onChange={handleChange}
          className="mb-1 w-full rounded border p-2"
        />
        {errors.username && <p className="mb-3 text-xs text-red-500">{errors.username}</p>}

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="mb-1 w-full rounded border p-2"
        />
        {errors.password && <p className="mb-3 text-xs text-red-500">{errors.password}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full rounded bg-blue-950 py-2 text-white ${
            isSubmitting ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          Iniciar sesión
        </button>
      </form>

      {isSubmitting && (
        <div className="bg-opacity-30 absolute inset-0 z-20 flex items-center justify-center">
          <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="font-medium text-blue-900">Iniciando sesión...</p>
          </div>
        </div>
      )}
    </div>
  );
}
