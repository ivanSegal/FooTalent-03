"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/services/authService";
import { ResetPasswordRequest } from "@/types/auth";
import Button from "@/components/UI/Button";
import { showAlert, showAutoAlert } from "@/utils/showAlert";

export default function VerifyEmailResetPasswordPage() {
  const router = useRouter();
  const search = useSearchParams();
  const token = useMemo(() => search.get("token") || "", [search]);

  const [form, setForm] = useState<{ newPassword: string; confirmPassword: string }>({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const passwordRegex =
    /^(?=.*[A-ZÑ])(?=.*[a-zñ])(?=.*\d)(?=.*[-@#$%^&*.,()_+{}|;:'"<>\/!¡¿?])[A-ZÑa-zñ\d-@#$%^&*.,()_+{}|;:'"<>\/!¡¿?]{6,}$/;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!token) e.token = "Token inválido o ausente";
    if (!form.newPassword) e.newPassword = "Contraseña nueva requerida";
    else if (form.newPassword.length < 8 || form.newPassword.length > 64)
      e.newPassword = "Debe tener entre 8 y 64 caracteres";
    else if (!passwordRegex.test(form.newPassword))
      e.newPassword = "Debe incluir mayúscula, minúscula, número y carácter especial";
    if (form.confirmPassword !== form.newPassword)
      e.confirmPassword = "Las contraseñas no coinciden";
    return e;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const payload: ResetPasswordRequest = { token, newPassword: form.newPassword };
      const res = await resetPassword(payload);
      await showAutoAlert(
        res.success ? "Contraseña actualizada" : "No se pudo actualizar",
        res.message,
        res.success ? "success" : "error",
        2200,
        "top-end-auth",
      );
      if (res.success) router.push("/login");
    } catch {
      showAlert("Error", "Ocurrió un error inesperado. Intenta nuevamente.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow"
        noValidate
      >
        <h1 className="mb-4 text-center text-2xl font-semibold text-[color:var(--color-primary-500)]">
          Restablecer contraseña
        </h1>
        {!token && (
          <p className="mb-4 text-sm text-red-600">El enlace es inválido o no incluye token.</p>
        )}

        <div className="mb-3">
          <input
            type="password"
            name="newPassword"
            placeholder="Nueva contraseña"
            value={form.newPassword}
            onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
            className={`w-full rounded border px-3 py-2 ring-2 focus:outline-none ${
              errors.newPassword ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.newPassword && <p className="mt-1 text-xs text-red-600">{errors.newPassword}</p>}
        </div>

        <div className="mb-6">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            value={form.confirmPassword}
            onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
            className={`w-full rounded border px-3 py-2 ring-2 focus:outline-none ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        <Button type="submit" severity="tertiary" appearance="solid" loading={submitting} fullWidth>
          {submitting ? "Enviando..." : "Restablecer contraseña"}
        </Button>
      </form>
    </div>
  );
}
