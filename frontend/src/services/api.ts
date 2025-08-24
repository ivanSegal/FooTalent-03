import axios from "axios";
import Cookies from "js-cookie";
import type { NormalizedApiError } from "@/types/api";

const api = axios.create({
  baseURL: "https://footalent-03.onrender.com/api",
  // timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Evita múltiples redirecciones simultáneas
let isLoggingOut = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const buildFieldErrors = (val: unknown) => {
      if (!val) return undefined;
      // Already a record
      if (typeof val === "object" && !Array.isArray(val)) {
        return val as Record<string, string>;
      }
      if (Array.isArray(val)) {
        const out: Record<string, string> = {};
        for (const item of val) {
          if (!item) continue;
          if (typeof item === "object") {
            // Support shapes: { field, message } | { param, msg } | { property, constraints }
            const obj = item as Record<string, unknown>;
            const key = (obj.field ?? obj.param ?? obj.property) as string | undefined;
            const constraints = obj.constraints as Record<string, string> | undefined;
            const msg = (obj.message ??
              obj.msg ??
              (constraints ? Object.values(constraints).join("; ") : undefined)) as
              | string
              | undefined;
            if (key && msg) out[String(key)] = String(msg);
            continue;
          }
          if (typeof item === "string") {
            // Support strings like "field: message" or "field mensaje..."
            const s = item.trim();
            const m = s.match(/^([A-Za-z_][A-Za-z0-9_\.\-]*)\s*[:\-]?\s*(.*)$/);
            if (m) {
              const key = m[1];
              const msg = m[2] || s;
              // avoid mapping the whole string if key looks too generic
              if (key && key.length <= 64) {
                out[key] = msg;
              }
            }
          }
        }
        return Object.keys(out).length ? out : undefined;
      }
      return undefined;
    };

    const err: NormalizedApiError = {
      name: "ApiError",
      message: "Error en la solicitud",
      status: error?.response?.status,
      code: error?.code,
      fieldErrors: undefined,
      raw: error,
    };

    const data = error?.response?.data;
    // Logout automático si el backend envía errorCode AUTH_ERROR
    try {
      const serverErrorCode = data?.errorCode || data?.code || data?.error?.code;
      if (serverErrorCode === "AUTH_ERROR" && typeof window !== "undefined" && !isLoggingOut) {
        isLoggingOut = true;
        try {
          Cookies.remove("token");
          // Limpia datos básicos de sesión si los hubiera
          try {
            window.localStorage?.removeItem?.("user");
          } catch {}
        } finally {
          // Redirige a login con motivo
          setTimeout(() => {
            window.location.href = "/login?reason=auth_error";
          }, 10);
        }
      }
    } catch {
      // noop
    }

    // Common backend shapes: {message, success, errors}, {error: {message}}, or validation map
    if (data) {
      if (typeof data.message === "string") err.message = data.message;
      if (typeof data.error === "string") err.message = data.error;
      if (typeof data.error?.message === "string") err.message = data.error.message;
      // Field errors: support object or array shapes
      const fe = data.errors ?? data.fieldErrors ?? data.details ?? data.validationErrors;
      const mapped = buildFieldErrors(fe);
      if (mapped) err.fieldErrors = mapped;
      // If details is an array of strings and not mapped to fields, append to message
      try {
        const details = data.details;
        if (Array.isArray(details)) {
          const stringDetails = details.filter((d: unknown) => typeof d === "string") as string[];
          if (stringDetails.length) {
            const joined = stringDetails.join(" | ");
            if (!err.message || err.message === "Error en la solicitud") {
              err.message = joined;
            } else if (!String(err.message).includes(joined)) {
              err.message = `${err.message} — ${joined}`;
            }
          }
        }
      } catch {}
      // Some APIs place detail at data.detail or data.title
      if (
        typeof data.detail === "string" &&
        (!err.message || err.message === "Error en la solicitud")
      ) {
        err.message = data.detail;
      }
      if (
        typeof data.title === "string" &&
        (!err.message || err.message === "Error en la solicitud")
      ) {
        err.message = data.title;
      }
    }
    return Promise.reject(err);
  },
);
export default api;
