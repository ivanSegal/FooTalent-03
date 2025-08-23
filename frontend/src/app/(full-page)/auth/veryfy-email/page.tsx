"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/services/authService";
import { ResetPasswordRequest } from "@/types/auth";
import { showAlert, showAutoAlert } from "@/utils/showAlert";
import type { NormalizedApiError } from "@/types/api";
import { Button, Card, Form, Input, Typography } from "antd";
import Image from "next/image";
import LogoLogin from "@/assets/images/LogoLogin.png";

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

  const onSubmit = async () => {
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
    } catch (err: unknown) {
      const apiErr = err as NormalizedApiError;
      if (apiErr?.fieldErrors) {
        const map: Record<string, string> = {};
        for (const [key, msg] of Object.entries(apiErr.fieldErrors)) {
          const localKey = key === "password" ? "newPassword" : key;
          if (localKey === "newPassword" || localKey === "confirmPassword") map[localKey] = msg;
        }
        if (Object.keys(map).length) setErrors(map);
      }
      showAlert(
        "Error",
        apiErr?.message || "Ocurrió un error inesperado. Intenta nuevamente.",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 sm:p-10">
      <Card className="w-[520px] max-w-full" styles={{ body: { padding: 32 } }}>
        <div className="mb-4 flex w-full flex-col items-center gap-2 text-center">
          <Image src={LogoLogin} alt="Logo IncaCore" className="h-[96px] w-auto" priority />
          <Typography.Title level={1} style={{ margin: 0, color: "var(--color-primary-500)" }}>
            Restablecer contraseña
          </Typography.Title>
        </div>

        {!token && (
          <Typography.Text type="danger" style={{ marginBottom: 12, display: "block" }}>
            El enlace es inválido o no incluye token.
          </Typography.Text>
        )}

        <Form layout="vertical" onFinish={onSubmit} requiredMark={false} autoComplete="off">
          <Form.Item
            label="Nueva contraseña"
            validateStatus={errors.newPassword ? "error" : ""}
            help={errors.newPassword}
          >
            <Input.Password
              name="newPassword"
              placeholder="Nueva contraseña"
              value={form.newPassword}
              onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
              size="large"
              prefix={
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M7.82421 9.17291V9.17291C6.57957 7.92774 4.56056 7.92822 3.31592 9.17339V9.17339C2.0715 10.4183 2.07102 12.4367 3.31544 13.6817V13.6817C4.56062 14.9274 6.58 14.9274 7.82517 13.6817V13.6817C9.06959 12.4367 9.06863 10.4179 7.82421 9.17291V9.17291ZM7.82421 9.17291L12.332 4.66319M14.5859 2.40833L13.8346 3.15995M13.8346 3.15995L14.8364 4.16211M13.8346 3.15995L12.332 4.66319M12.332 4.66319L14.085 6.41697"
                    stroke="#49649B"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
          </Form.Item>

          <Form.Item
            label="Confirmar contraseña"
            validateStatus={errors.confirmPassword ? "error" : ""}
            help={errors.confirmPassword}
          >
            <Input.Password
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={form.confirmPassword}
              onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
              size="large"
              prefix={
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M7.82421 9.17291V9.17291C6.57957 7.92774 4.56056 7.92822 3.31592 9.17339V9.17339C2.0715 10.4183 2.07102 12.4367 3.31544 13.6817V13.6817C4.56062 14.9274 6.58 14.9274 7.82517 13.6817V13.6817C9.06959 12.4367 9.06863 10.4179 7.82421 9.17291V9.17291ZM7.82421 9.17291L12.332 4.66319M14.5859 2.40833L13.8346 3.15995M13.8346 3.15995L14.8364 4.16211M13.8346 3.15995L12.332 4.66319M12.332 4.66319L14.085 6.41697"
                    stroke="#49649B"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={submitting} block size="large">
            {submitting ? "Enviando..." : "Restablecer contraseña"}
          </Button>
        </Form>
      </Card>
    </div>
  );
}
