import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchTasksByUser,
  createTask,
  updateTaskCompleted,
  updateTaskTerminado,
  generarYDescargarExcel,
  Task,
} from "../services/taskService";

interface Usuario {
  nombre: string;
  correo: string;
}

export function useTareas() {
  const [tareas, setTareas] = useState<Task[]>([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarTareas = async () => {
      try {
        const tareasCargadas = await fetchTasksByUser();
        setTareas(tareasCargadas);
      } catch (error) {
        console.error("Error al cargar tareas:", error);
      }
    };

    const userData = localStorage.getItem("usuario");
    if (userData) {
      setUsuario(JSON.parse(userData));
    }

    cargarTareas();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  async function handleAgregarTarea(e: React.FormEvent) {
    e.preventDefault();
    if (nuevaTarea.trim() === "") return;

    try {
      const nueva = await createTask(nuevaTarea);
      setTareas((prev) => [...prev, nueva]);
      setNuevaTarea("");
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  }

  async function handleCompletarTarea(id: string, estadoActual: boolean) {
    try {
      const tareaActualizada = await updateTaskCompleted(id, !estadoActual);
      setTareas((prev) =>
        prev.map((t) => (t.id === id ? tareaActualizada : t))
      );
    } catch (error) {
      console.error("Error al completar tarea:", error);
    }
  }

  async function handleTerminarTarea(id: string) {
    try {
      const tareaActualizada = await updateTaskTerminado(id);
      setTareas((prev) =>
        prev.map((t) => (t.id === id ? tareaActualizada : t))
      );
    } catch (error) {
      console.error("Error al terminar tarea:", error);
    }
  }

  const handleGenerarExcel = async () => {
    try {
      await generarYDescargarExcel();
    } catch (error) {
      console.error(
        "❌ Error al generar/descargar Excel desde el hook:",
        error
      );
    }
  };
  return {
    tareas,
    nuevaTarea,
    setNuevaTarea,
    usuario,
    mostrarMenu,
    setMostrarMenu,
    handleLogout,
    handleAgregarTarea,
    handleCompletarTarea,
    handleTerminarTarea,
    handleGenerarExcel,
  };
}
