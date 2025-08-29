// "use client";
// import React, { useState } from "react";
// import { LoadingOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

// interface CreateUserModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onUserCreated?: () => void;
// }

// interface CreateUserData {
//   username: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   role: string;
//   department: string;
// }

// interface ApiError {
//   message: string;
//   field?: string;
// }

// export const CreateUserModal: React.FC<CreateUserModalProps> = ({
//   isOpen,
//   onClose,
//   onUserCreated,
// }) => {
//   const [formData, setFormData] = useState<CreateUserData>({
//     username: "",
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     role: "",
//     department: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [apiError, setApiError] = useState<string>("");

//   const departments = [
//     { value: "INVENTORY", label: "Inventario" },
//     { value: "MAINTENANCE", label: "Mantenimiento" },
//     { value: "VESSEL", label: "Embarcaciones" },
//   ];

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.firstName.trim()) {
//       newErrors.firstName = "El nombre es requerido";
//     }

//     if (!formData.lastName.trim()) {
//       newErrors.lastName = "El apellido es requerido";
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "El correo electrónico es requerido";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "El correo electrónico no es válido";
//     }

//     if (!formData.password.trim()) {
//       newErrors.password = "La contraseña es requerida";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "La contraseña debe tener al menos 6 caracteres";
//     }

//     if (!formData.role) {
//       newErrors.role = "Debe seleccionar un rol";
//     }

//     if (!formData.department) {
//       newErrors.department = "Debe seleccionar un departamento";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const createUser = async (userData: CreateUserData): Promise<void> => {
//     try {
//       const response = await fetch("https://footalent-03.onrender.com/api/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         if (data.errors && Array.isArray(data.errors)) {
//           const fieldErrors: Record<string, string> = {};
//           data.errors.forEach((error: ApiError) => {
//             if (error.field) {
//               fieldErrors[error.field] = error.message;
//             }
//           });
//           setErrors(fieldErrors);
//         } else {
//           setApiError(data.message || "Error al crear el usuario");
//         }
//         throw new Error(data.message || "Error al crear el usuario");
//       }

//       console.log("Usuario creado exitosamente:", data);
//       if (onUserCreated) {
//         onUserCreated();
//       }
//     } catch (error) {
//       console.error("Error creating user:", error);
//       if (!apiError && Object.keys(errors).length === 0) {
//         setApiError("Error de conexión. Por favor, intente nuevamente.");
//       }
//       throw error;
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     setErrors({});
//     setApiError("");

//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       await createUser(formData);
//       handleClose();
//     } catch (error) {
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setFormData({
//       username: "",
//       firstName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       role: "",
//       department: "",
//     });
//     setErrors({});
//     setApiError("");
//     setShowPassword(false);
//     onClose();
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: "" }));
//     }
//     if (apiError) {
//       setApiError("");
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
//       <div className="mx-4 w-full max-w-md rounded-lg bg-white shadow-xl">
//         <form onSubmit={handleSubmit}>
//           {/* Header */}
//           <div className="p-6 pb-4">
//             <h2 className="mb-6 text-xl font-semibold text-gray-900">
//               Añadir nuevo usuario
//             </h2>

//             {/* Error general de API */}
//             {apiError && (
//               <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
//                 {apiError}
//               </div>
//             )}

//             {/* Nombre */}
//             <div className="mb-4">
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Nombre
//               </label>
//               <input
//                 type="text"
//                 value={formData.firstName}
//                 onChange={(e) => handleInputChange("firstName", e.target.value)}
//                 placeholder="Juan José"
//                 className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
//                   errors.firstName ? "border-red-300" : "border-gray-300"
//                 }`}
//                 disabled={loading}
//               />
//               {errors.firstName && (
//                 <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
//               )}
//             </div>

//             {/* Apellido */}
//             <div className="mb-4">
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Apellido
//               </label>
//               <input
//                 type="text"
//                 value={formData.lastName}
//                 onChange={(e) => handleInputChange("lastName", e.target.value)}
//                 placeholder="Pérez Gómez"
//                 className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
//                   errors.lastName ? "border-red-300" : "border-gray-300"
//                 }`}
//                 disabled={loading}
//               />
//               {errors.lastName && (
//                 <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
//               )}
//             </div>

//             {/* Email */}
//             <div className="mb-4">
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Correo Electrónico
//               </label>
//               <input
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => handleInputChange("email", e.target.value)}
//                 placeholder="juan.perez@example.com"
//                 className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
//                   errors.email ? "border-red-300" : "border-gray-300"
//                 }`}
//                 disabled={loading}
//               />
//               {errors.email && (
//                 <p className="mt-1 text-xs text-red-500">{errors.email}</p>
//               )}
//             </div>

//             {/* Password */}
//             <div className="mb-4">
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Contraseña
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={formData.password}
//                   onChange={(e) => handleInputChange("password", e.target.value)}
//                   placeholder="********"
//                   className={`w-full rounded-lg border px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
//                     errors.password ? "border-red-300" : "border-gray-300"
//                   }`}
//                   disabled={loading}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? (
//                     <EyeInvisibleOutlined className="h-5 w-5" />
//                   ) : (
//                     <EyeTwoTone className="h-5 w-5" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="mt-1 text-xs text-red-500">{errors.password}</p>
//               )}
//             </div>

//             {/* Rol */}
//             <div className="mb-4">
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Rol del usuario
//               </label>
//               <select
//                 value={formData.role}
//                 onChange={(e) => handleInputChange("role", e.target.value)}
//                 className={`w-full rounded-lg border bg-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
//                   errors.role ? "border-red-300" : "border-gray-300"
//                 }`}
//                 disabled={loading}
//               >
//                 <option value="">Seleccionar un rol...</option>
//                 <option value="ADMIN">Administrador</option>
//                 <option value="SUPERVISOR">Encargado</option>
//                 <option value="OPERATOR">Personal</option>
//               </select>
//               {errors.role && (
//                 <p className="mt-1 text-xs text-red-500">{errors.role}</p>
//               )}
//             </div>

//             {/* Departamento */}
//             <div className="mb-6">
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Departamento
//               </label>
//               <select
//                 value={formData.department}
//                 onChange={(e) => handleInputChange("department", e.target.value)}
//                 className={`w-full rounded-lg border bg-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
//                   errors.department ? "border-red-300" : "border-gray-300"
//                 }`}
//                 disabled={loading}
//               >
//                 <option value="">Seleccionar un departamento...</option>
//                 {departments.map((department) => (
//                   <option key={department.value} value={department.value}>
//                     {department.label}
//                   </option>
//                 ))}
//               </select>
//               {errors.department && (
//                 <p className="mt-1 text-xs text-red-500">{errors.department}</p>
//               )}
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="flex gap-3 rounded-b-lg bg-gray-50 px-6 py-4">
//             <button
//               type="button"
//               onClick={handleClose}
//               disabled={loading}
//               className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               Cancelar
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
//               style={{ backgroundColor: "#496490" }}
//             >
//               {loading && <LoadingOutlined spin />}
//               {loading ? "Creando..." : "Añadir usuario"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };
