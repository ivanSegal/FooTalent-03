import Swal from "sweetalert2";

export const showAlert = (title: string, text: string, icon: "success" | "error" | "warning") => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonColor: "#2375AC",
    confirmButtonText: "Aceptar",
  });
};
