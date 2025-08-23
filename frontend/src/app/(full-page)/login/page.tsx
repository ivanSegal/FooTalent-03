"use client";

import React, { useEffect, useState } from "react";
import { LoginRequest } from "@/types/auth";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import { showAlert, showAutoAlert } from "@/utils/showAlert";
import { AxiosError } from "axios";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import LogoLogin from "@/assets/images/LogoLogin.png";
import { motion, useReducedMotion } from "framer-motion";
import { Button, Card, Checkbox, Form, Input, Typography } from "antd";

export default function LoginPage() {
  const router = useRouter();
  const { setEmail } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const emailRegex =
    /^(?:[a-zA-Z0-9_'^&\/+-])+(?:\.(?:[a-zA-Z0-9_'^&\/+-])+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("rememberedEmail");
      if (stored) {
        setFormData((d) => ({ ...d, email: stored }));
        setRemember(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (remember) {
      try {
        const stored = localStorage.getItem("rememberedEmail");
        if (stored) {
          setFormData((d) => ({ ...d, email: stored }));
        }
      } catch {}
    } else {
      setFormData((d) => ({ ...d, email: "", password: "" }));
    }
  }, [remember]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "El correo no tiene un formato válido.";
    }
    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const { email } = await login(formData);
      if (remember) {
        try {
          localStorage.setItem("rememberedEmail", formData.email);
        } catch {}
      } else {
        try {
          localStorage.removeItem("rememberedEmail");
        } catch {}
      }
      setEmail(email ?? null);
      document.cookie = "loggedIn=true; path=/;";
      await showAutoAlert(
        "¡Bienvenido!",
        "Inicio de sesión exitoso",
        "success",
        2000,
        "top-end-auth",
      );
      router.push("/dashboard?logged=true");
    } catch (err: unknown) {
      setIsSubmitting(false);

      let message = "Ha ocurrido un error inesperado. Intenta nuevamente.";

      if ((err as AxiosError).response?.status === 400) {
        message = "Correo o contraseña incorrectos.";
      } else if (err instanceof Error && err.message) {
        message = err.message;
      }

      showAlert("Error al iniciar sesión", message, "error");
      return;
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
        <div className="flex w-full flex-col items-center gap-2">
          <Image src={LogoLogin} alt="Logo IncaCore" className="h-[96px] w-auto" priority />
          <Typography.Title level={1} style={{ margin: 0, color: "var(--color-primary-500)" }}>
            Bienvenido
          </Typography.Title>
        </div>

        <Form
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          autoComplete="off"
          style={{ marginTop: 8 }}
        >
          <Form.Item
            // label="Correo"
            validateStatus={errors.email ? "error" : ""}
            help={errors.email}
          >
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              autoComplete="email"
              onChange={handleChange}
              size="large"
              placeholder="Ingresa tu correo"
              prefix={
                <svg
                  width="18"
                  height="20"
                  viewBox="0 0 18 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M1.16841 14.1211C2.2822 11.615 4.76737 10 7.50977 10H10.4902C13.2326 10 15.7178 11.615 16.8316 14.1211V14.1211C17.8514 16.4156 16.1718 19 13.6609 19H4.33909C1.82819 19 0.148637 16.4156 1.16841 14.1211V14.1211Z"
                    stroke="#49649B"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 4C6 2.34315 7.34315 1 9 1C10.6569 1 12 2.34315 12 4C12 5.65685 10.6569 7 9 7C7.34315 7 6 5.65685 6 4Z"
                    stroke="#49649B"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
          </Form.Item>

          <Form.Item
            // label="Contraseña"
            validateStatus={errors.password ? "error" : ""}
            help={errors.password}
          >
            <Input.Password
              id="password"
              name="password"
              value={formData.password}
              autoComplete="new-password"
              onChange={handleChange}
              size="large"
              placeholder="Ingresa tu contraseña"
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
              visibilityToggle={{ visible: showPassword, onVisibleChange: setShowPassword }}
              iconRender={(visible) =>
                visible ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.584 10.587a3 3 0 0 0 4.243 4.243" />
                    <path d="M9.88 5.082A9.956 9.956 0 0 1 12 5c6.5 0 10 7 10 7a21.228 21.228 0 0 1-1.67 2.88M6.16 6.157C3.27 7.94 2 12 2 12s3.5 7 10 7c1.008 0 1.973-.146 2.886-.418" />
                  </svg>
                )
              }
            />
          </Form.Item>

          <div className="flex w-full items-center justify-between">
            <Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)}>
              Recuérdame
            </Checkbox>
            <Button type="link" onClick={() => router.push("/forgotpassword")}>
              ¿Olvidaste tu contraseña?
            </Button>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            block
            size="large"
            onClick={() => void 0}
          >
            {isSubmitting ? "Iniciando..." : "Iniciar sesión"}
          </Button>
        </Form>
      </Card>
    </motion.div>
  );
}
