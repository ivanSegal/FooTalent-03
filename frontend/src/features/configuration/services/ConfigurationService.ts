import { User, ChangePasswordRequest, UpdateProfileRequest, ApiResponse } from "../types/configuration.types";
import api from "@/services/api";

class ConfigurationService {
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("authToken");
    }
    return null;
  }

  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      // Si la respuesta no es ok, intentar extraer error del body
      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Si no se puede parsear el JSON, usar el mensaje por defecto
        }
        
        return {
          success: false,
          message: errorMessage,
          data: undefined
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error processing response:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error de red',
        data: undefined
      };
    }
  }

  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    if (!token) return false;

    try {
      // Verificar que el token no esté expirado
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        this.logout(); // Token expirado, limpiar
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      this.logout(); // Token inválido, limpiar
      return false;
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      // Opcional: redirigir a login
      // window.location.href = '/login';
    }
  }

  async getCurrentUser(userId: string): Promise<ApiResponse<User>> {
  try {
    const response = await api.get<ApiResponse<User>>(`/users/${userId}`);

    // Adaptar handleResponse para axios
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching current user:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error de conexión',
      data: undefined,
    };
  }
}
  async updateProfile(userId: string, data: UpdateProfileRequest): Promise<ApiResponse<User>> {
    if (!userId) {
      return {
        success: false,
        message: 'ID de usuario requerido',
        data: undefined
      };
    }

    if (!data.firstName || !data.lastName) {
      return {
        success: false,
        message: 'Nombre y apellido son requeridos',
        data: undefined
      };
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: this.getHeaders(true),
        body: JSON.stringify(data),
      });

      return await this.handleResponse<User>(response);
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error de conexión',
        data: undefined
      };
    }
  }

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<null>> {
    if (!data.currentPassword || !data.newPassword || !data.confirmPassword) {
      return {
        success: false,
        message: 'Todos los campos de contraseña son requeridos',
        data: null
      };
    }

    if (data.newPassword !== data.confirmPassword) {
      return {
        success: false,
        message: 'Las contraseñas no coinciden',
        data: null
      };
    }

    try {
      const response = await fetch(`/api/users/change-password`, {
        method: "POST",
        headers: this.getHeaders(true),
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        }),
      });

      return await this.handleResponse<null>(response);
    } catch (error) {
      console.error('Error changing password:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error de conexión',
        data: null
      };
    }
  }

  async resetPassword(email: string): Promise<ApiResponse<null>> {
    if (!email || !email.includes('@')) {
      return {
        success: false,
        message: 'Email válido requerido',
        data: null
      };
    }

    try {
      const response = await fetch(`/api/auth/reset-password`, {
        method: "POST",
        headers: this.getHeaders(false), // No incluir auth para reset
        body: JSON.stringify({ email }),
      });

      return await this.handleResponse<null>(response);
    } catch (error) {
      console.error('Error resetting password:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error de conexión',
        data: null
      };
    }
  }
}

// Exportar una instancia única del servicio
export const configurationService = new ConfigurationService();