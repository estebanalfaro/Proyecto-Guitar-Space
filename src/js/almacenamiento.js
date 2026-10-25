// Lectura y guardado del estado completo en localStorage (GEN-01, GEN-02, GEN-07).
// Solo se guardan los campos del contrato de datos, nunca valores calculados.

const CLAVE_ALMACENAMIENTO = 'guitar-space';
const META_SEMANAL_POR_DEFECTO_MINUTOS = 630;

// GEN-02: categorías iniciales.
const CATEGORIAS_INICIALES = [
  { id: 'tecnica', nombre: 'Técnica', minutosPorDefecto: 25, activa: true },
  { id: 'repertorio', nombre: 'Repertorio', minutosPorDefecto: 50, activa: true },
  { id: 'lectura', nombre: 'Lectura', minutosPorDefecto: 15, activa: true }
];

function crearEstadoInicial() {
  return {
    app: 'Guitar-Space',
    configuracion: {
      metaSemanalPorDefectoMinutos: META_SEMANAL_POR_DEFECTO_MINUTOS,
      formatoDuracion: 'h:mm',
      formatoFechaVista: 'DD-MM-AAAA',
      formatoFechaGuardada: 'AAAA-MM-DD'
    },
    categorias: CATEGORIAS_INICIALES.map((categoria) => ({ ...categoria })),
    semanas: [],
    registrosPractica: [],
    cronometroActivo: null
  };
}

// Devuelve null si no hay nada guardado.
function leerEstado() {
  const textoGuardado = localStorage.getItem(CLAVE_ALMACENAMIENTO);
  return textoGuardado === null ? null : JSON.parse(textoGuardado);
}

function guardarEstado(estado) {
  localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(estado));
}

// GEN-02: si no hay datos, crea y guarda el estado inicial.
function cargarEstado() {
  const estadoGuardado = leerEstado();
  if (estadoGuardado !== null) {
    return estadoGuardado;
  }
  const estadoInicial = crearEstadoInicial();
  guardarEstado(estadoInicial);
  return estadoInicial;
}
