import axios from "axios";

const API_URL = "http://localhost:8080/api/tasks";
const API_URL_EXCEL = "http://localhost:8080/api/excel";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export interface Task {
  id: string;
  usuario: string;
  nombre: string;
  fechaCreacion: string;
  fechaCompletado?: string;
  estadoCompletado: boolean;
  estadoTerminado: boolean;
}

export const fetchTasksByUser = async (): Promise<Task[]> => {
  const response = await axios.get(`${API_URL}/usuario`, authHeaders());
  return response.data;
};

export const fetchAllTasksByUser = async (): Promise<Task[]> => {
  const response = await axios.get(`${API_URL}/usuario2`, authHeaders());
  return response.data;
};

export const createTask = async (nombre: string): Promise<Task> => {
  const response = await axios.post(`${API_URL}`, { nombre }, authHeaders());
  if (response.status === 201) {
    return response.data;
  } else {
    throw new Error("Error al crear la tarea");
  }
};

export const getTaskById = async (id: string): Promise<Task> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, authHeaders());
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error("Acceso denegado");
    } else if (error.response?.status === 404) {
      throw new Error("Tarea no encontrada");
    }
    throw new Error("Error al obtener la tarea");
  }
};

export const updateTaskCompleted = async (
  id: string,
  estadoCompletado: boolean
): Promise<Task> => {
  try {
    const response = await axios.put(
      `${API_URL}/${id}/completado?estadoCompletado=${estadoCompletado}`,
      null,
      authHeaders()
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error("Acceso denegado");
    } else if (error.response?.status === 404) {
      throw new Error("Tarea no encontrada");
    }
    throw new Error("Error al actualizar la tarea");
  }
};

export const updateTaskTerminado = async (id: string): Promise<Task> => {
  try {
    const response = await axios.put(
      `${API_URL}/${id}/terminado`,
      null,
      authHeaders()
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error("Acceso denegado");
    } else if (error.response?.status === 404) {
      throw new Error("Tarea no encontrada");
    }
    throw new Error("Error al actualizar la tarea");
  }
};

export const generarYDescargarExcel = async (): Promise<void> => {
  try {
    // 1. Solicitar generación del Excel
    const generarResponse = await axios.post(
      `${API_URL_EXCEL}/generate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const { filename } = generarResponse.data;

    // Espera 3 segundos antes de descargar
    setTimeout(async () => {
      try {
        const downloadResponse = await axios.get(
          `${API_URL_EXCEL}/download/${encodeURIComponent(filename)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            responseType: "blob",
          }
        );

        const blob = downloadResponse.data;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename!;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error("❌ Error al descargar el Excel:", error);
      }
    }, 3000); // 3 segundos de espera
  } catch (error) {
    console.error("❌ Error en la generación/descarga del Excel:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};
