"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import fondo from "@/assets/images/fondo.png";
import { login } from "../../services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const usernameRegex = /^[a-zA-Z0-9._]{4,20}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      document.cookie = `token=${data.token}; path=/; samesite=Lax;`;
      router.push("/dashboard");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative grid min-h-screen grid-rows-[20px_auto_20px] items-start justify-items-center bg-cover bg-center px-8 pt-20 pb-20 sm:px-10 sm:pt-36 sm:pb-36"
      style={{ backgroundImage: `url(${fondo.src})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="z-10 row-start-2 -mt-12 w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
      >
        <h2 className="mb-6 text-center text-2xl font-bold text-[#0b1839]">Iniciar sesión</h2>

        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={formData.username}
          onChange={handleChange}
          className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-[#2375AC] focus:outline-none ${errors.username ? "border-red-500" : "border-gray-300"} mb-1`}
        />
        {errors.username && <p className="mb-3 text-xs text-red-500">{errors.username}</p>}

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-[#2375AC] focus:outline-none ${errors.password ? "border-red-500" : "border-gray-300"} mb-4`}
        />
        {errors.password && <p className="mb-3 text-xs text-red-500">{errors.password}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full cursor-pointer rounded-lg bg-[#2375AC] py-2 text-white transition hover:bg-[#1e6b94] ${isSubmitting ? "cursor-not-allowed opacity-50" : ""} `}
        >
          {isSubmitting ? "Iniciando..." : "Iniciar sesión"}
        </button>
      </form>

      {isSubmitting && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
          <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="font-medium text-blue-900">Iniciando sesión...</p>
          </div>
        </div>
      )}
    </div>
  );
}
