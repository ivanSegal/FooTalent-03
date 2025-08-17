"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
// import fondo from "@/assets/images/fondo.png";
import { login } from "@/services/authService";
import { showAlert, showAutoAlert } from "@/utils/showAlert";
import { AxiosError } from "axios";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/UI/Button";
import Image from "next/image";
import LogoLogin from "@/assets/images/LogoLogin.png";

export default function LoginPage() {
  const router = useRouter();
  const { setUsername } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remember, setRemember] = useState(false);
  const usernameRegex = /^[a-zA-Z0-9._]{4,20}$/;

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("rememberedUsername");
      if (stored) {
        setFormData((d) => ({ ...d, username: stored }));
        setRemember(true);
      }
    } catch {}
  }, []);

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
      const { username } = await login(formData);
      if (remember) {
        try {
          localStorage.setItem("rememberedUsername", formData.username);
        } catch {}
      } else {
        try {
          localStorage.removeItem("rememberedUsername");
        } catch {}
      }
      setUsername(username ?? null);
      document.cookie = "loggedIn=true; path=/;";
      await showAutoAlert("¡Bienvenido!", "Inicio de sesión exitoso", "success", 2000);
      router.push("/dashboard?logged=true");
    } catch (err: unknown) {
      setIsSubmitting(false);

      let message = "Ha ocurrido un error inesperado. Intenta nuevamente.";

      if ((err as AxiosError).response?.status === 400) {
        // const backendMessage = (err as AxiosError<{ message?: string }>)?.response?.data?.message;
        message = "Nombre de usuario o contraseña incorrectos.";
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
    <div className="flex min-h-screen w-full items-center justify-center p-10">
      <form
        onSubmit={handleSubmit}
        aria-busy={isSubmitting || undefined}
        className="flex w-[445px] max-w-full flex-col items-center justify-start gap-4 rounded-[14px] bg-white px-[56px] pt-[40px] pb-[40px] shadow-[0_5px_6px_#2F3167,6px_6px_4px_rgba(14,16,70,0.25)]"
      >
        <Image src={LogoLogin} alt="Logo IncaCore" className="bottom-0 h-[119px] w-auto" priority />
        <h1 className="text-center text-[34px] leading-[44px] font-normal text-[color:var(--color-primary-500)]">
          Bienvenido
        </h1>
        {/* Usuario */}
        <div className="flex w-full flex-col gap-2">
          <div className="relative w-full">
            <span className="pointer-events-none absolute top-1/2 left-3 inline-flex -translate-y-1/2 items-center justify-center">
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
                  stroke="#292556"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 4C6 2.34315 7.34315 1 9 1C10.6569 1 12 2.34315 12 4C12 5.65685 10.6569 7 9 7C7.34315 7 6 5.65685 6 4Z"
                  stroke="#292556"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              aria-invalid={!!errors.username || undefined}
              aria-describedby={errors.username ? "username-error" : undefined}
              className={`box-border h-[36px] w-full rounded-[3px] border bg-[#FAFBFC] pr-3 pl-[38px] text-[14px] leading-[20px] font-normal text-[color:var(--color-primary-500)] outline-none placeholder:leading-[20px] placeholder:font-[var(--font-secondary)] placeholder:text-[#97A0AF] focus:ring-2 focus:ring-[color:var(--color-primary-500)] ${
                errors.username ? "border-red-500" : "border-[#DFE1E6]"
              }`}
              placeholder="Ingresa tu usuario"
            />
          </div>
          {errors.username && (
            <p id="username-error" className="text-xs font-medium text-red-500" role="alert">
              {errors.username}
            </p>
          )}
        </div>

        {/* Contraseña */}
        <div className="flex w-full flex-col gap-2">
          <div className="relative w-full">
            <span className="pointer-events-none absolute top-1/2 left-3 inline-flex -translate-y-1/2 items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M11.0459 12.95V12.95C9.2888 11.1921 6.43844 11.1928 4.6813 12.9507V12.9507C2.92447 14.7083 2.9238 17.5578 4.68063 19.3153V19.3153C6.43851 21.074 9.28941 21.074 11.0473 19.3153V19.3153C12.8041 17.5578 12.8028 14.7076 11.0459 12.95V12.95ZM11.0459 12.95L17.4099 6.58336M20.5919 3.40002L19.5312 4.46114M19.5312 4.46114L20.9454 5.87595M19.5312 4.46114L17.4099 6.58336M17.4099 6.58336L19.8848 9.05928"
                  stroke="#292556"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              aria-invalid={!!errors.password || undefined}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`box-border h-[36px] w-full rounded-[3px] border bg-[#FAFBFC] pr-3 pl-[44px] text-[14px] leading-[20px] font-normal text-[color:var(--color-primary-500)] outline-none placeholder:leading-[20px] placeholder:font-[var(--font-secondary)] placeholder:text-[#97A0AF] focus:ring-2 focus:ring-[color:var(--color-primary-500)] ${
                errors.password ? "border-red-500" : "border-[#DFE1E6]"
              }`}
              placeholder="Ingresa tu contraseña"
            />
          </div>
          {errors.password && (
            <p id="password-error" className="text-xs font-medium text-red-500" role="alert">
              {errors.password}
            </p>
          )}
        </div>

        {/* Recuérdame */}
        <label className="flex w-full items-center gap-2 text-[16px] leading-[24px] font-normal text-[color:var(--color-primary-500)] select-none">
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-[color:var(--color-primary-500)] text-[color:var(--color-primary-500)] focus:ring-2 focus:ring-[color:var(--color-primary-500)]"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Recuérdame
        </label>

        {/* Botón */}
        <Button
          severity="tertiary"
          appearance="solid"
          type="submit"
          disabled={isSubmitting}
          // className="flex h-[46px] w-full items-center justify-center rounded-[6px] bg-[#07093A] text-[18px] leading-[25px] font-bold shadow-none transition hover:bg-[#06082f] active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60"
          loading={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Iniciando..." : "Iniciar sesión"}
        </Button>

        {/* ¿Olvidaste tu contraseña? */}
        <button
          type="button"
          onClick={() => {
            /* TODO: navegación a recuperación */
          }}
          className="self-start text-[16px] leading-[25px] font-normal text-[color:var(--color-tertiary-500)] underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary-500)]"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </form>
    </div>
  );
}
