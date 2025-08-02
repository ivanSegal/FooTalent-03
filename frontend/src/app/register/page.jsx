"use client";
import { useState } from "react";
import { register } from "../../services/authService";
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!formData.email.includes("@")) newErrors.email = "El correo no es válido.";
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
      const data = await register(formData);
      console.log("Respuesta del registro:", data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative mx-auto mt-10 max-w-sm">
      <form onSubmit={handleSubmit} className="relative">
        <h2 className="mb-4 text-center text-2xl font-bold">Registrate</h2>

        <input
          type="text"
          name="name"
          placeholder="Nombre"
          onChange={handleChange}
          className="mb-1 w-full rounded border p-2"
        />
        {errors.name && <p className="mb-3 text-xs text-red-500">{errors.name}</p>}

        <input
          type="email"
          name="email"
          placeholder="Correo"
          onChange={handleChange}
          className="mb-1 w-full rounded border p-2"
        />
        {errors.email && <p className="mb-3 text-xs text-red-500">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          className="mb-1 w-full rounded border p-2"
        />
        {errors.password && <p className="mb-3 text-xs text-red-500">{errors.password}</p>}

        <button className="w-full rounded bg-blue-950 py-2 text-white">Registrarme</button>
      </form>

      {isLoading && (
        <div className="bg-opacity-30 absolute inset-0 z-20 flex items-center justify-center">
          <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="font-medium text-blue-900">Registrando...</p>
          </div>
        </div>
      )}
    </div>
  );
}
