"use client";
import { useState } from "react";
import { register } from "../../services/authService";
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const usernameRegex = /^[a-zA-Z0-9._]{4,20}$/;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
          name="username"
          placeholder="Nombre de usuario"
          onChange={handleChange}
          className="mb-1 w-full rounded border p-2"
        />
        {errors.username && <p className="mb-3 text-xs text-red-500">{errors.username}</p>}

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          className="mb-1 w-full rounded border p-2"
        />
        {errors.password && <p className="mb-3 text-xs text-red-500">{errors.password}</p>}

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar Contraseña"
          onChange={handleChange}
          className="mb-1 w-full rounded border p-2"
        />
        {errors.password && <p className="mb-3 text-xs text-red-500">{errors.password}</p>}

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="mb-4 w-full rounded border bg-white p-2"
        >
          <option value="">Selecciona un rol</option>
          <option value="ADMIN">ADMIN</option>
          <option value="OPERATIONS_MANAGER">OPERATIONS_MANAGER</option>
          <option value="WAREHOUSE_STAFF">WAREHOUSE_STAFF</option>
        </select>

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
