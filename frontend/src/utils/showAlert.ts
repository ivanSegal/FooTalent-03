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
) => {
  return Swal.fire({
    title,
    text,
    icon,
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
  });
};
