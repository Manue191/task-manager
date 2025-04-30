export interface RegistroRequest {
  nombre: string;
  correo: string;
  password: string;
}

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  nombre: string;
  correo: string;
}

// Registrar usuario y guardar token + datos
export async function registrarUsuario(
  datos: RegistroRequest
): Promise<AuthResponse> {
  const response = await fetch("http://localhost:8080/api/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al registrar usuario");
  }

  const data: AuthResponse = await response.json();
  localStorage.setItem("token", data.token);
  localStorage.setItem(
    "usuario",
    JSON.stringify({ nombre: data.nombre, correo: data.correo })
  );
  return data;
}

export async function obtenerUsuarioPorCredenciales(
  datos: LoginRequest
): Promise<AuthResponse> {
  const response = await fetch("http://localhost:8080/api/users/get-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    let mensaje = "Error al obtener el usuario";
    try {
      const errorData = await response.json();
      mensaje = errorData.message || mensaje;
    } catch {}

    if (response.status === 404) {
      throw new Error("Usuario no encontrado");
    } else if (response.status === 401) {
      throw new Error("Contraseña incorrecta");
    } else {
      throw new Error(mensaje);
    }
  }

  const data = await response.json();

  // ✅ Guardar en localStorage
  localStorage.setItem("token", data.token);
  localStorage.setItem(
    "usuario",
    JSON.stringify({ nombre: data.nombre, correo: data.correo })
  );

  return data;
}

export async function actualizarUsuario(
  correo: string,
  datos: RegistroRequest
): Promise<any> {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:8080/api/users/${correo}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al actualizar el usuario");
  }

  return await response.json();
}

export async function eliminarUsuario(correo: string): Promise<any> {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:8080/api/users/${correo}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al eliminar el usuario");
  }

  return await response.json();
}
