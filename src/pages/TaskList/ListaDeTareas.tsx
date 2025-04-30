import { useTareas } from "../../hooks/useTareas";
import BotonDescargaExcel from "../../components/BotonDescargaExcel";

function ListaDeTareas() {
  const {
    tareas,
    nuevaTarea,
    usuario,
    mostrarMenu,
    setNuevaTarea,
    setMostrarMenu,
    handleAgregarTarea,
    handleCompletarTarea,
    handleTerminarTarea,
    handleLogout,
    handleGenerarExcel,
  } = useTareas();

  return (
    <div className="container mt-5 position-relative">
      {/* Menú de usuario */}
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        {usuario && (
          <div className="position-relative">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setMostrarMenu(!mostrarMenu)}
            >
              {usuario.nombre}
            </button>
            {mostrarMenu && (
              <div
                className="card p-2 shadow-sm"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "110%",
                  zIndex: 10,
                }}
              >
                <button
                  className="btn btn-sm btn-danger mt-2"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <h1 className="text-center mb-4">Lista de Tareas</h1>

      {/* Botón para generar y descargar el Excel */}
      <BotonDescargaExcel onDescargar={handleGenerarExcel} />

      <form onSubmit={handleAgregarTarea} className="d-flex mb-4">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Escribe una nueva tarea"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={nuevaTarea.trim() === ""}
        >
          Agregar
        </button>
      </form>

      <ul className="list-group">
        {tareas
          .filter((tarea) => !tarea.estadoTerminado)
          .map((tarea) => {
            const botonTerminarColor = tarea.estadoCompletado
              ? "#dc3545"
              : "#6c757d";

            return (
              <li
                key={tarea.id}
                className={`list-group-item d-flex justify-content-between align-items-center ${
                  tarea.estadoCompletado ? "list-group-item-success" : ""
                }`}
              >
                <span
                  style={{
                    textDecoration: tarea.estadoCompletado
                      ? "line-through"
                      : "none",
                  }}
                >
                  {tarea.nombre}
                </span>

                <div>
                  <button
                    className="btn btn-sm me-2"
                    style={{
                      backgroundColor: tarea.estadoCompletado
                        ? "#FFA500"
                        : "#198754",
                      color: "white",
                      border: "none",
                    }}
                    onClick={() =>
                      handleCompletarTarea(tarea.id, tarea.estadoCompletado)
                    }
                  >
                    {tarea.estadoCompletado ? "Deshacer" : "Completar"}
                  </button>

                  <button
                    className="btn btn-sm"
                    style={{
                      backgroundColor: botonTerminarColor,
                      color: "white",
                      border: "none",
                      cursor: tarea.estadoCompletado
                        ? "pointer"
                        : "not-allowed",
                    }}
                    onClick={() => handleTerminarTarea(tarea.id)}
                    disabled={!tarea.estadoCompletado}
                  >
                    Terminar
                  </button>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default ListaDeTareas;
