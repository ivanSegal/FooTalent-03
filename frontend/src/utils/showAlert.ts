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

export const showConfirmAlert = async (
  title: string,
  text: string,
  confirmButtonText: string = "Sí, confirmar",
  cancelButtonText: string = "Cancelar",
) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText,
    cancelButtonText,
  });

  return result.isConfirmed;
};
