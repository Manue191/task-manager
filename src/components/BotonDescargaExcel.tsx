import { useState } from "react";

interface Props {
  onDescargar: () => void;
}

function BotonDescargaExcel({ onDescargar }: Props) {
  const [descargando, setDescargando] = useState(false);
  const [contador, setContador] = useState(3);

  const iniciarDescargaConEspera = () => {
    setDescargando(true);
    setContador(3);

    // Ejecutar la descarga inmediatamente
    onDescargar();

    const intervalo = setInterval(() => {
      setContador((prev) => {
        if (prev === 1) {
          clearInterval(intervalo);
          setDescargando(false);
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <button
      className={`btn mb-4 ${descargando ? "btn-secondary" : "btn-success"}`}
      onClick={iniciarDescargaConEspera}
      disabled={descargando}
    >
      {descargando ? `Descargando en ${contador}...` : "Descargar Excel"}
    </button>
  );
}

export default BotonDescargaExcel;
