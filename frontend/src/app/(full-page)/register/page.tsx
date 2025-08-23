"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import fondo from "@/assets/images/fondo.png";
import { register } from "@/services/authService";
import { showAutoAlert, showAlert } from "@/utils/showAlert";

import { RegisterRequest } from "@/types/auth";
import { Button, Card, Form, Input, Select, Typography } from "antd";
import Image from "next/image";
import LogoLogin from "@/assets/images/LogoLogin.png";

export default function RegisterPage() {
  const router = useRouter();
  const DEPARTMENTS = ["INVENTORY", "MAINTENANCE", "VESSEL"] as const;
  type Department = (typeof DEPARTMENTS)[number];
  const ROLE_LABELS: Record<string, string> = {
    ADMIN: "Administrador",
    OPERATIONS_MANAGER: "Jefe de Operaciones",
    WAREHOUSE_STAFF: "Personal de Almacén",
  };
  const DEPT_LABELS: Record<Department, string> = {
    INVENTORY: "Inventario",
    MAINTENANCE: "Mantenimiento",
    VESSEL: "Embarcaciones",
  };
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

  const handleSubmit = async () => {
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

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 sm:p-10">
      <Card
        className="w-[520px] max-w-full shadow-[0_5px_6px_#2F3167,6px_6px_4px_rgba(14,16,70,0.25)]"
        styles={{ body: { padding: 32 } }}
      >
        <div className="mb-4 flex w-full flex-col items-center gap-2 text-center">
          <Image src={LogoLogin} alt="Logo IncaCore" className="h-[96px] w-auto" priority />
          <Typography.Title level={1} style={{ margin: 0, color: "var(--color-primary-500)" }}>
            Regístrate
          </Typography.Title>
        </div>

        <Form layout="vertical" onFinish={handleSubmit} requiredMark={false} autoComplete="off">
          {errors.form && (
            <Typography.Text type="danger" style={{ marginBottom: 12, display: "block" }}>
              {errors.form}
            </Typography.Text>
          )}

          <Form.Item validateStatus={errors.firstName ? "error" : ""} help={errors.firstName}>
            <Input
              name="firstName"
              placeholder="Nombre"
              onChange={handleChange}
              size="large"
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

          <Form.Item validateStatus={errors.lastName ? "error" : ""} help={errors.lastName}>
            <Input
              name="lastName"
              placeholder="Apellido"
              onChange={handleChange}
              size="large"
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

          <Form.Item validateStatus={errors.email ? "error" : ""} help={errors.email}>
            <Input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              onChange={handleChange}
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

          <Form.Item validateStatus={errors.role ? "error" : ""} help={errors.role}>
            <Select
              value={formData.role || undefined}
              onChange={(value) => setFormData((p) => ({ ...p, role: value }))}
              placeholder="Selecciona un rol"
              size="large"
              showSearch
              optionFilterProp="label"
              options={[
                { value: "ADMIN", label: ROLE_LABELS["ADMIN"] },
                { value: "OPERATIONS_MANAGER", label: ROLE_LABELS["OPERATIONS_MANAGER"] },
                { value: "WAREHOUSE_STAFF", label: ROLE_LABELS["WAREHOUSE_STAFF"] },
              ]}
            />
          </Form.Item>

          <Form.Item validateStatus={errors.department ? "error" : ""} help={errors.department}>
            <Select
              value={formData.department || undefined}
              onChange={(value) => setFormData((p) => ({ ...p, department: value }))}
              placeholder="Selecciona un departamento"
              size="large"
              showSearch
              optionFilterProp="label"
              options={DEPARTMENTS.map((d) => ({ value: d, label: DEPT_LABELS[d] }))}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={isLoading} block size="large">
            {isLoading ? "Registrando..." : successMessage || "Registrarme"}
          </Button>

          <div className="flex w-full justify-start">
            <Button type="link" onClick={() => router.push("/login")}>
              Ya tengo cuenta
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
