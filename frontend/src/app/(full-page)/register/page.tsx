"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import fondo from "@/assets/images/fondo.png";
import { register } from "@/services/authService";
import { showAutoAlert, showAlert } from "@/utils/showAlert";

import { RegisterRequest } from "@/types/auth";

export default function RegisterPage() {
  const router = useRouter();
  const DEPARTMENTS = ["INVENTORY", "MAINTENANCE", "VESSEL"] as const;
  type Department = (typeof DEPARTMENTS)[number];
  const [formData, setFormData] = useState<RegisterRequest>({
    email: "",
    role: "",
    firstName: "",
    lastName: "",
    department: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const emailRegex =
    /^(?:[a-zA-Z0-9_'^&\/+-])+(?:\.(?:[a-zA-Z0-9_'^&\/+-])+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  const nameRegex = /^[A-Za-zñáéíóúÁÉÍÓÚ]+(?: [A-Za-zñáéíóúÁÉÍÓÚ]+)*$/;

  useEffect(() => {
    setSuccessMessage("");
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName || !nameRegex.test(formData.firstName)) {
      newErrors.firstName = "Nombre requerido. Solo letras y espacios.";
    }
    if (!formData.lastName || !nameRegex.test(formData.lastName)) {
      newErrors.lastName = "Apellido requerido. Solo letras y espacios.";
    }
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Debe ingresar un correo válido.";
    }

    if (!formData.role) {
      newErrors.role = "Debes seleccionar un rol.";
    }
    if (!formData.department || !DEPARTMENTS.includes(formData.department as Department)) {
      newErrors.department = "Debes seleccionar un departamento válido.";
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
      await showAutoAlert(
        "¡Registro exitoso!",
        "Hemos enviado la contraseña a tu correo. Revisa tu bandeja de entrada.",
        "success",
        2200,
        "top-end-auth",
      );
      router.push("/login");
    } catch {
      const message = "Ha ocurrido un error inesperado. Intenta nuevamente.";
      showAlert("Registro fallido", message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Concatenamos el texto del botón según el estado
  const buttonText = isLoading ? "Registrando..." : successMessage || "Registrarme";

  return (
    <div
      className="relative grid min-h-screen grid-rows-[20px_auto_20px] items-start justify-items-center bg-cover bg-center px-8 pt-20 pb-20 sm:px-10 sm:pt-36 sm:pb-36"
      // style={{ backgroundImage: `url(${fondo.src})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="z-10 row-start-2 -mt-12 w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
      >
        <h2 className="mb-6 text-center text-2xl font-bold text-[#0b1839]">Regístrate</h2>

        {errors.form && <p className="mb-4 text-center text-sm text-red-500">{errors.form}</p>}

        <input
          type="text"
          name="firstName"
          placeholder="Nombre"
          onChange={handleChange}
          className={`mb-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-[#2375AC] focus:outline-none ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.firstName && <p className="mb-3 text-xs text-red-500">{errors.firstName}</p>}

        <input
          type="text"
          name="lastName"
          placeholder="Apellido"
          onChange={handleChange}
          className={`mb-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-[#2375AC] focus:outline-none ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.lastName && <p className="mb-3 text-xs text-red-500">{errors.lastName}</p>}

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          onChange={handleChange}
          className={`mb-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-[#2375AC] focus:outline-none ${errors.email ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.email && <p className="mb-3 text-xs text-red-500">{errors.email}</p>}

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

        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className={`mb-4 w-full rounded-lg border bg-white px-4 py-2 focus:ring-2 focus:ring-[#2375AC] focus:outline-none ${errors.department ? "border-red-500" : "border-gray-300"}`}
        >
          <option value="">Selecciona un departamento</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {errors.department && <p className="mb-3 text-xs text-red-500">{errors.department}</p>}

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
