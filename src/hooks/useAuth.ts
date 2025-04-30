import { useState } from "react";
import { obtenerUsuarioPorCredenciales } from "../services/userService";

export const useAuth = () => {
  const [error, setError] = useState<string>("");

  const login = async (email: string, password: string) => {
    setError(""); // Limpiar error al intentar loguearse
    try {
      await obtenerUsuarioPorCredenciales({ correo: email, password });
      return true;
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError("Contraseña incorrecta");
      } else if (error.response?.status === 404) {
        setError("Usuario no encontrado");
      } else {
        setError("Error al iniciar sesión");
      }
      return false;
    }
  };

  return { error, login };
};
