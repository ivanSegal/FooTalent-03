"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Divider,
  Spin,
  Avatar,
  Typography,
  Space,
  Tabs,
  App,
  Alert,
  Result,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  EditOutlined,
  SaveOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LoginOutlined,
} from "@ant-design/icons";
import { configurationService } from "../services/ConfigurationService";
import { User, UpdateProfileRequest, ChangePasswordRequest } from "../types/configuration.types";
import {
  updateProfileSchema,
  changePasswordSchema,
  UpdateProfileFormData,
  ChangePasswordFormData,
} from "../schemas/profile.schema";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface ProfileConfigurationProps {
  className?: string;
  usersService?: {
    generateAvatarUrl: (user: User) => string;
  };
  onLoginRedirect?: () => void; // Callback para redirigir al login
}

const ProfileConfiguration: React.FC<ProfileConfigurationProps> = ({
  className,
  usersService,
  onLoginRedirect,
}) => {
  const { message } = App.useApp();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm] = Form.useForm<UpdateProfileFormData>();
  const [passwordForm] = Form.useForm<ChangePasswordFormData>();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Generar URL del avatar
  const generateAvatarUrl = (user: User): string => {
    // Si se proporciona el servicio externo, usarlo
    if (usersService) {
      return usersService.generateAvatarUrl(user);
    }

    // Fallback: generar avatar usando la lógica interna
    const name = `${user.firstName} ${user.lastName}`.trim();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=496490&color=fff&size=120&rounded=true&bold=true`;
  };

  // Obtener ID del usuario desde el token o localStorage
  const getUserId = (): string | null => {
    if (typeof window !== "undefined") {
      console.log("Buscando userId en localStorage...");

      // Primero buscar en localStorage con diferentes keys posibles
      const possibleKeys = ["userId", "user_id", "id"];
      for (const key of possibleKeys) {
        const storedId = localStorage.getItem(key);
        if (storedId) {
          console.log(`UserId encontrado en localStorage[${key}]:`, storedId);
          return storedId;
        }
      }

      // Buscar en sessionStorage también
      for (const key of possibleKeys) {
        const storedId = sessionStorage.getItem(key);
        if (storedId) {
          console.log(`UserId encontrado en sessionStorage[${key}]:`, storedId);
          return storedId;
        }
      }

      // Buscar token en localStorage Y sessionStorage
      const possibleTokenKeys = ["authToken", "token", "accessToken", "auth_token"];
      let token: string | null = null;

      for (const key of possibleTokenKeys) {
        token = localStorage.getItem(key) || sessionStorage.getItem(key);
        if (token) {
          console.log(`Token encontrado en ${key}:`, token ? "Sí" : "No");
          break;
        }
      }

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          console.log("Payload del token:", payload);

          // El sub es el userId según tu descripción
          const userId =
            payload.sub || payload.id || payload.userId || payload.user_id || payload.uid;

          if (userId) {
            console.log("UserId extraído del token:", userId);
            // Guardar para futuras consultas
            localStorage.setItem("userId", userId);
            return userId;
          } else {
            console.log("No se encontró userId en el payload del token");
            console.log("Propiedades disponibles en el token:", Object.keys(payload));
          }
        } catch (error) {
          console.error("Error parsing token:", error);
        }
      } else {
        console.log("No se encontró ningún token");
      }

      // Mostrar todo el contenido de localStorage para debugging
      console.log("Contenido completo de localStorage:");
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          console.log(`${key}:`, localStorage.getItem(key));
        }
      }

      console.log("Contenido completo de sessionStorage:");
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          console.log(`${key}:`, sessionStorage.getItem(key));
        }
      }
    }
    return null;
  };

  // Cargar datos del usuario
  const loadUserData = async () => {
    try {
      setLoading(true);

      // Primero verificar si está autenticado
      const authStatus = configurationService.isAuthenticated();
      console.log("Estado de autenticación:", authStatus);

      if (!authStatus) {
        console.log("Usuario no autenticado");
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const userId = getUserId();
      console.log("UserID obtenido:", userId);

      if (!userId) {
        console.error("No se encontró userId pero el usuario parece estar autenticado");
        message.error("Error de autenticación: No se pudo obtener el ID del usuario");
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      console.log("Llamando a getCurrentUser con ID:", userId);
      const response = await configurationService.getCurrentUser(userId);

      console.log("Respuesta del servicio:", response);

      if (response.success && response.data) {
        console.log("Usuario cargado exitosamente:", response.data);
        setUser(response.data);
        profileForm.setFieldsValue({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
        });
      } else {
        console.error("Error en la respuesta:", response.message);
        message.error(response.message || "Error al cargar los datos del usuario");
      }
    } catch (error) {
      console.error("Error en loadUserData:", error);
      message.error("Error de conexión al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  // Manejar actualización de perfil
  const handleUpdateProfile = async (values: UpdateProfileFormData) => {
    try {
      // Validar con zod
      const validatedData = updateProfileSchema.parse(values);

      setProfileLoading(true);
      const userId = getUserId();

      if (!userId) {
        message.error("No se pudo obtener el ID del usuario");
        return;
      }

      const updateData: UpdateProfileRequest = {
        firstName: validatedData.firstName.trim(),
        lastName: validatedData.lastName.trim(),
      };

      const response = await configurationService.updateProfile(userId, updateData);

      if (response.success && response.data) {
        setUser(response.data);
        setIsEditingProfile(false);
        message.success("Perfil actualizado correctamente");
      } else {
        message.error(response.message || "Error al actualizar el perfil");
      }
    } catch (error: any) {
      if (error.errors) {
        // Errores de validación de zod
        error.errors.forEach((err: any) => {
          message.error(err.message);
        });
      } else {
        message.error("Error al actualizar el perfil");
        console.error("Error updating profile:", error);
      }
    } finally {
      setProfileLoading(false);
    }
  };

  // Manejar cambio de contraseña
  const handleChangePassword = async (values: ChangePasswordFormData) => {
    try {
      // Validar con zod
      const validatedData = changePasswordSchema.parse(values);

      setPasswordLoading(true);

      const passwordData: ChangePasswordRequest = {
        currentPassword: validatedData.currentPassword,
        newPassword: validatedData.newPassword,
        confirmPassword: validatedData.confirmPassword,
      };

      const response = await configurationService.changePassword(passwordData);

      if (response.success) {
        passwordForm.resetFields();
        message.success("Contraseña cambiada correctamente");
      } else {
        message.error(response.message || "Error al cambiar la contraseña");
      }
    } catch (error: any) {
      if (error.errors) {
        // Errores de validación de zod
        error.errors.forEach((err: any) => {
          message.error(err.message);
        });
      } else {
        message.error("Error al cambiar la contraseña");
        console.error("Error changing password:", error);
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  // Cancelar edición de perfil
  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    if (user) {
      profileForm.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
  };

  // Manejar redirección al login
  const handleLoginRedirect = () => {
    if (onLoginRedirect) {
      onLoginRedirect();
    } else {
      // Fallback: redirigir usando window.location
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  // Función para debugging - mostrar información de autenticación
  const debugAuthInfo = () => {
    console.log("=== DEBUG AUTH INFO ===");
    console.log("localStorage authToken:", localStorage.getItem("authToken"));
    console.log("localStorage userId:", localStorage.getItem("userId"));
    console.log("isAuthenticated:", configurationService.isAuthenticated());

    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("Token payload completo:", payload);
      } catch (e) {
        console.log("Error decodificando token:", e);
      }
    }
    console.log("=== END DEBUG ===");
  };

  // Si el usuario no está autenticado, mostrar mensaje de login
  if (!loading && !isAuthenticated) {
    return (
      <App>
        <Card className={className}>
          <Result
            status="403"
            title="Sesión requerida"
            subTitle="Debes iniciar sesión para ver tu perfil"
            extra={
              <Space direction="vertical" size="middle">
                <Button
                  type="primary"
                  icon={<LoginOutlined />}
                  onClick={handleLoginRedirect}
                  size="large"
                >
                  Iniciar Sesión
                </Button>
                <Button onClick={debugAuthInfo} type="link">
                  Debug Info
                </Button>
              </Space>
            }
          />
          <Alert
            message="Problema de Autenticación Detectado"
            description={
              <div>
                <p>
                  <strong>Diagnóstico:</strong>
                </p>
                <ul className="mt-2 ml-4">
                  <li>• No se encontró token de autenticación</li>
                  <li>• No se encontró ID de usuario</li>
                  <li>• Puede que el login no esté guardando correctamente la sesión</li>
                </ul>
                <p className="mt-3">
                  <strong>Solución:</strong> Verifica que después del login se guarden el authToken
                  y userId en localStorage
                </p>
              </div>
            }
            type="warning"
            showIcon
            className="mt-6"
          />
        </Card>
      </App>
    );
  }

  if (loading) {
    return (
      <App>
        <div className="flex min-h-[400px] items-center justify-center">
          <Spin size="large" />
        </div>
      </App>
    );
  }

  if (!user) {
    return (
      <App>
        <Card className={className}>
          <div className="py-8 text-center">
            <Text type="secondary">No se pudo cargar la información del usuario</Text>
            <div className="mt-4 space-x-3">
              <Button onClick={loadUserData} type="primary">
                Reintentar
              </Button>
              <Button onClick={debugAuthInfo} type="default">
                Debug Auth
              </Button>
            </div>
          </div>
        </Card>
      </App>
    );
  }

  return (
     <App>
      <div className={`mx-auto max-w-4xl ${className || ""}`}>
        <Card className="shadow-lg">
          <div className="mb-6">
            <Title level={2} className="mb-2 flex items-center gap-3">
              <UserOutlined className="text-blue-600" />
              Mi Perfil
            </Title>
            <Text type="secondary">
              Gestiona tu información personal y configuración de seguridad
            </Text>
          </div>

          <Tabs
            defaultActiveKey="profile"
            className="mt-6"
            items={[
              {
                key: "profile",
                label: (
                  <span className="flex items-center gap-2">
                    <UserOutlined />
                    Información Personal
                  </span>
                ),
                children: (
                  <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Avatar y información básica */}
                    <div className="lg:w-1/3">
                      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 text-center">
                        <img
                          src={generateAvatarUrl(user)}
                          alt={`Avatar de ${user.firstName} ${user.lastName}`}
                          className="mx-auto mb-4 h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                            )}&background=6b7280&color=fff&size=120&rounded=true&bold=true`;
                          }}
                        />
                        <Title level={4} className="mb-1">
                          {user.firstName} {user.lastName}
                        </Title>
                        <Text type="secondary" className="text-sm">
                          {user.email}
                        </Text>
                      </Card>
                    </div>

                    {/* Formulario de perfil */}
                    <div className="lg:w-2/3">
                      <Card title="Editar Información Personal" className="h-fit">
                        <Form
                          form={profileForm}
                          layout="vertical"
                          onFinish={handleUpdateProfile}
                          // disabled={!isEditingProfile}
                        >
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Form.Item
                              label="Nombre"
                              name="firstName"
                              rules={[
                                { required: true, message: "El nombre es requerido" },
                                { min: 2, message: "Mínimo 2 caracteres" },
                                { max: 50, message: "Máximo 50 caracteres" },
                                {
                                  pattern: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
                                  message: "Solo letras y espacios permitidos",
                                },
                              ]}
                            >
                              <Input
                                prefix={<UserOutlined />}
                                placeholder="Ingresa tu nombre"
                                className="h-10"
                              />
                            </Form.Item>

                            <Form.Item
                              label="Apellido"
                              name="lastName"
                              rules={[
                                { required: true, message: "El apellido es requerido" },
                                { min: 2, message: "Mínimo 2 caracteres" },
                                { max: 50, message: "Máximo 50 caracteres" },
                                {
                                  pattern: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
                                  message: "Solo letras y espacios permitidos",
                                },
                              ]}
                            >
                              <Input
                                prefix={<UserOutlined />}
                                placeholder="Ingresa tu apellido"
                                className="h-10"
                              />
                            </Form.Item>
                          </div>

                          <Form.Item label="Email">
                            <Input value={user.email} disabled className="h-10 bg-gray-50" />
                            <Text type="secondary" className="text-xs">
                              El email no puede ser modificado
                            </Text>
                          </Form.Item>

                          <div className="flex gap-3 mt-6" >
                            {!isEditingProfile ? (
                              <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => setIsEditingProfile(true)}
                                className="h-10"
                                style={{ backgroundColor: "#496490" }}
                              >
                                Editar Perfil
                              </Button>
                            ) : (
                              <Space>
                                <Button
                                  type="primary"
                                  icon={<SaveOutlined />}
                                  htmlType="submit"
                                  loading={profileLoading}
                                  className="h-10"
                                >
                                  Guardar Cambios
                                </Button>
                                <Button onClick={handleCancelEdit} className="h-10">
                                  Cancelar
                                </Button>
                              </Space>
                            )}
                          </div>
                        </Form>
                      </Card>
                    </div>
                  </div>
                ),
              },
              {
                key: "password",
                label: (
                  <span className="flex items-center gap-2" >
                    <LockOutlined />
                    Cambiar Contraseña
                  </span>
                ),
                children: (
                  <div className="max-w-md mx-auto">
                    <Card title="Cambiar Contraseña" className="shadow-sm">
                      <Form
                        form={passwordForm}
                        layout="vertical"
                        onFinish={handleChangePassword}
                      >
                        <Form.Item
                          label="Contraseña Actual"
                          name="currentPassword"
                          rules={[{ required: true, message: "La contraseña actual es requerida" }]}
                        >
                          <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Ingresa tu contraseña actual"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            className="h-10"
                          />
                        </Form.Item>

                        <Form.Item
                          label="Nueva Contraseña"
                          name="newPassword"
                          rules={[
                            { required: true, message: "La nueva contraseña es requerida" },
                            { min: 8, message: "Mínimo 8 caracteres" },
                            {
                              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                              message: "Debe contener: minúscula, mayúscula, número y carácter especial",
                            },
                          ]}
                        >
                          <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Ingresa tu nueva contraseña"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            className="h-10"
                          />
                        </Form.Item>

                        <Form.Item
                          label="Confirmar Nueva Contraseña"
                          name="confirmPassword"
                          dependencies={["newPassword"]}
                          rules={[
                            { required: true, message: "Confirma tu nueva contraseña" },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (!value || getFieldValue("newPassword") === value) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error("Las contraseñas no coinciden"));
                              },
                            }),
                          ]}
                        >
                          <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Confirma tu nueva contraseña"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            className="h-10"
                          />
                        </Form.Item>

                        <Form.Item className="mb-0 mt-6">
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={passwordLoading}
                            block
                            className="h-10"
                            style={{ backgroundColor: "#496490" }}
                          >
                            Cambiar Contraseña
                          </Button>
                        </Form.Item>
                      </Form>

                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <Text className="text-xs text-blue-700">
                          <strong>Requisitos de contraseña:</strong>
                          <br />
                          • Mínimo 8 caracteres
                          <br />
                          • Al menos una letra minúscula
                          <br />
                          • Al menos una letra mayúscula
                          <br />
                          • Al menos un número
                          <br />
                          • Al menos un carácter especial (@$!%*?&)
                        </Text>
                      </div>
                    </Card>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </App>
  );
};

export default ProfileConfiguration;
