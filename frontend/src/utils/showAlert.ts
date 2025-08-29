import Swal from "sweetalert2";

export const showAlert = (
  title: string,
  text: string,
  icon: "success" | "error" | "warning" | "info" | "question",
) => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText: "Aceptar",
  });
};

export const showAutoAlert = (
  title: string,
  text: string,
  icon: "success" | "error" | "warning" | "info" | "question",
  timer: number = 2000,
  position:
    | "top"
    | "top-start"
    | "top-end"
    | "center"
    | "center-start"
    | "center-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "top-end-auth" = "top-end",
) => {
  const isCustomAuth = position === "top-end-auth";
  return Swal.fire({
    toast: true,
    position: isCustomAuth ? "top-end" : position,
    title,
    text,
    icon,
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    customClass: isCustomAuth ? { container: "swal2-top-end-auth" } : undefined,
  });
};

export const showConfirmAlert = async (
  title: string,
  text: string,
  confirmButtonText: string = "Sí, confirmar",
  cancelButtonText: string = "Cancelar",
  options?: {
    icon?: "success" | "error" | "warning" | "info" | "question";
    iconColor?: string;
  },
) => {
  const result = await Swal.fire({
    title,
    text,
    icon: options?.icon ?? "warning",
    iconColor: options?.iconColor,
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText,
    cancelButtonText,
  });

  return result.isConfirmed;
};

// CSS esperado (ya añadido en globals.css):
// .swal2-container.swal2-top-end.swal2-top-end-auth { top:32px !important; right:36px !important; }
