"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import fondo from "@/assets/images/fondo.png";
import { register } from "../../services/authService";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const usernameRegex = /^[a-zA-Z0-9._]{4,20}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!usernameRegex.test(formData.username)) {
      newErrors.username = "Usuario: 4–20 caracteres (letras, números, puntos o _).";
    }

    if (formData.password.length < 8 || formData.password.length > 30) {
      newErrors.password = "Contraseña: entre 8 y 30 caracteres.";
    } else if (
      !/[A-Z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password) ||
      !/[!@#$%^&*]/.test(formData.password)
    ) {
      newErrors.password = "Debe incluir mayúscula, número y carácter especial.";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    if (!formData.role) {
      newErrors.role = "Debes seleccionar un rol.";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await register(formData);
      setSuccessMessage("¡Registro exitoso!");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al intentar registrar";
      setErrors({ form: message });
    } finally {
      setIsLoading(false);
    }
  };

  // Concatenamos el texto del botón según el estado
  const buttonText = isLoading ? "Registrando..." : successMessage || "Registrarme";

  return (
    <div
      className="relative grid min-h-screen grid-rows-[20px_auto_20px] items-start justify-items-center bg-cover bg-center px-8 pt-20 pb-20 sm:px-10 sm:pt-36 sm:pb-36"
      style={{ backgroundImage: `url(${fondo.src})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="z-10 row-start-2 -mt-12 w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
      >
        <h2 className="mb-6 text-center text-2xl font-bold text-[#0b1839]">Regístrate</h2>

        {errors.form && <p className="mb-4 text-center text-sm text-red-500">{errors.form}</p>}

        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          onChange={handleChange}
          className={`mb-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-[#2375AC] focus:outline-none ${errors.username ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.username && <p className="mb-3 text-xs text-red-500">{errors.username}</p>}

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          className={`mb-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-[#2375AC] focus:outline-none ${errors.password ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.password && <p className="mb-3 text-xs text-red-500">{errors.password}</p>}

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          onChange={handleChange}
          className={`mb-4 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-[#2375AC] focus:outline-none ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.confirmPassword && (
          <p className="mb-3 text-xs text-red-500">{errors.confirmPassword}</p>
        )}

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className={`mb-6 w-full rounded-lg border bg-white px-4 py-2 focus:ring-2 focus:ring-[#2375AC] focus:outline-none ${errors.role ? "border-red-500" : "border-gray-300"}`}
        >
          <option value="">Selecciona un rol</option>
          <option value="ADMIN">ADMIN</option>
          <option value="OPERATIONS_MANAGER">OPERATIONS_MANAGER</option>
          <option value="WAREHOUSE_STAFF">WAREHOUSE_STAFF</option>
        </select>
        {errors.role && <p className="mb-3 text-xs text-red-500">{errors.role}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full cursor-pointer rounded-lg bg-[#2375AC] py-2 text-white transition hover:bg-[#1e6b94] ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {buttonText}
        </button>
      </form>

      {(isLoading || successMessage) && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
          <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-xl">
            {isLoading && (
              <div className="mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            )}
            {!isLoading && successMessage && (
              <p className="text-lg font-medium text-[#0b1839]">{successMessage}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
