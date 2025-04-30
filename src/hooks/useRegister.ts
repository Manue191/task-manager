import { useState } from "react";
import { registrarUsuario } from "../services/userService";

export function useRegister() {
  const [mensaje, setMensaje] = useState("");

  async function register(
    nombre: string,
    correo: string,
    password: string,
    confirmar: string
  ) {
    if (password !== confirmar) {
      setMensaje("Las contraseñas no coinciden");
      return false;
    }

    try {
      await registrarUsuario({ nombre, correo, password });
      return true;
    } catch (error) {
      console.error(error);
      setMensaje("Hubo un error al registrar el usuario");
      return false;
    }
  }

  return { mensaje, register };
}
