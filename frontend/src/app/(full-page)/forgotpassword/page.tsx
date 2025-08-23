"use client";

import React, { useState } from "react";
import { ForgotPasswordRequest } from "@/types/auth";
import { forgotPassword } from "@/services/authService";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LogoLogin from "@/assets/images/LogoLogin.png";
import { showAutoAlert } from "@/utils/showAlert";
import { motion, useReducedMotion } from "framer-motion";
import { Button, Card, Form, Input, Typography } from "antd";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState<ForgotPasswordRequest>({ email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const reduceMotion = useReducedMotion();

  const emailRegex = /^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/;

  const validateEmail = (value: string) => {
    if (!value.trim()) return "El correo es obligatorio.";
    if (!emailRegex.test(value)) return "Formato de correo inválido.";
    return "";
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailError = validateEmail(form.email);
    if (emailError) newErrors.email = emailError;
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      const res = await forgotPassword(form);
      await showAutoAlert(
        res.success ? "Correo enviado" : "Error",
        res.message ||
          (res.success
            ? "Se ha enviado un correo de recuperación. Revisa tu bandeja de entrada."
            : "No se pudo enviar el correo de recuperación."),
        res.success ? "success" : "error",
        2200,
        "top-end-auth",
      );
      if (res.success) router.push("/login");
    } catch {
      setIsSubmitting(false);
      alert("Ocurrió un error. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="flex min-h-screen w-full items-center justify-center p-4 sm:p-10"
      initial={reduceMotion ? undefined : { opacity: 0, y: 32, filter: "blur(8px)" }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={reduceMotion ? undefined : { duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card
        className="w-[445px] max-w-full shadow-[0_5px_6px_#2F3167,6px_6px_4px_rgba(14,16,70,0.25)]"
        styles={{ body: { padding: 32, display: "flex", flexDirection: "column", gap: 16 } }}
      >
        <div className="flex w-full flex-col items-center gap-2 text-center">
          <Image src={LogoLogin} alt="Logo IncaCore" className="h-[96px] w-auto" priority />
          <Typography.Title level={1} style={{ margin: 0, color: "var(--color-primary-500)" }}>
            Recupera tu contraseña
          </Typography.Title>
          <Typography.Paragraph style={{ marginTop: 4 }}>
            Introduce tu correo registrado para recibir el enlace de recuperación y vuelve a bordo
            de INCACORE.
          </Typography.Paragraph>
        </div>

        <Form layout="vertical" onFinish={handleSubmit} requiredMark={false} autoComplete="off">
          <Form.Item
            label="Correo"
            validateStatus={errors.email ? "error" : ""}
            help={errors.email}
          >
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              autoComplete="email"
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              size="large"
              placeholder="Ingresa tu email"
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
                    d="M2.125 4.86547C2.125 4.16636 2.125 3.81681 2.30304 3.57177C2.36053 3.49263 2.43013 3.42303 2.50927 3.36554C2.75431 3.1875 3.10386 3.1875 3.80297 3.1875H13.197C13.8961 3.1875 14.2457 3.1875 14.4907 3.36554C14.5699 3.42303 14.6395 3.49263 14.697 3.57177C14.875 3.81681 14.875 4.16636 14.875 4.86547V12.1345C14.875 12.8336 14.875 13.1832 14.697 13.4282C14.6395 13.5074 14.5699 13.577 14.4907 13.6345C14.2457 13.8125 13.8961 13.8125 13.197 13.8125H3.80297C3.10386 13.8125 2.75431 13.8125 2.50927 13.6345C2.43013 13.577 2.36053 13.5074 2.30304 13.4282C2.125 13.1832 2.125 12.8336 2.125 12.1345V4.86547Z"
                    stroke="#49649B"
                    strokeWidth="0.279661"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.125 5.66669L7.47011 9.8238C7.90817 10.1645 8.12721 10.3349 8.3774 10.3681C8.45897 10.379 8.54161 10.379 8.62318 10.3681C8.87337 10.3348 9.0924 10.1645 9.53045 9.82375L14.875 5.66669"
                    stroke="#49649B"
                    strokeWidth="0.279661"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={isSubmitting} block size="large">
            {isSubmitting ? "Enviando..." : "Enviar email"}
          </Button>

          <div className="flex w-full justify-start">
            <Button type="link" onClick={() => router.push("/login")}>
              Volver al inicio de sesión
            </Button>
          </div>
        </Form>
      </Card>
    </motion.div>
  );
}
