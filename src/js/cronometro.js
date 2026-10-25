// Lógica del cronómetro (CRO-01 a CRO-16, BOR-05, BOR-06, BOR-09).
// El conteo cada segundo lo hace la interfaz. Aquí solo se calculan tiempos y estados
// y se guardan las sesiones. La sesión en curso vive en memoria hasta que se pausa o se detiene.

const MILISEGUNDOS_POR_SEGUNDO = 1000;

const ESTADOS_CATEGORIA = {
  sinIniciar: 'sinIniciar',
  corriendo: 'corriendo',
  pausado: 'pausado',
  cumplida: 'cumplida',
  bloqueada: 'bloqueada'
};

function obtenerSegundosPracticados(estado, fecha, categoriaId) {
  const registro = buscarRegistro(estado.registrosPractica, fecha, categoriaId);
  return registro === undefined ? 0 : registro.segundosPracticados;
}

function obtenerMetaCategoriaMinutos(estado, fecha, categoriaId) {
  const semana = obtenerSemana(estado, obtenerLunesDeSemana(fecha));
  return semana.minutosDiariosPorCategoria.find((item) => item.categoriaId === categoriaId).minutos;
}

// CRO-01, CRO-06: lo que le falta a la categoría en el día.
// Si la meta bajó por debajo de lo practicado, no falta nada.
function calcularSegundosRestantes(estado, fecha, categoriaId) {
  const metaSegundos = obtenerMetaCategoriaMinutos(estado, fecha, categoriaId) * SEGUNDOS_POR_MINUTO;
  return Math.max(0, metaSegundos - obtenerSegundosPracticados(estado, fecha, categoriaId));
}

// CRO-12 y contrato: se cumple con lo practicado redondeado al minuto más cercano.
function estaCumplida(estado, fecha, categoriaId) {
  const minutosPracticados = redondearSegundosAMinutos(obtenerSegundosPracticados(estado, fecha, categoriaId));
  return minutosPracticados >= obtenerMetaCategoriaMinutos(estado, fecha, categoriaId);
}

// CRO-02, CRO-13, CRO-15: hay un cronómetro corriendo o en pausa.
function hayCronometroActivo(estado) {
  return estado.cronometroActivo !== null;
}

// DIS-14, CRO-14: estado visual de una categoría.
function obtenerEstadoCategoria(estado, fecha, categoriaId) {
  const activo = estado.cronometroActivo;
  if (activo !== null && activo.categoriaId === categoriaId) {
    return activo.estado;
  }
  if (estaCumplida(estado, fecha, categoriaId)) {
    return ESTADOS_CATEGORIA.cumplida;
  }
  return hayCronometroActivo(estado) ? ESTADOS_CATEGORIA.bloqueada : ESTADOS_CATEGORIA.sinIniciar;
}

// CRO-02, CRO-06: inicia una categoría sin iniciar o reanuda la que está en pausa.
// En cualquier otro estado no cambia nada.
function iniciarCronometro(estado, fecha, categoriaId) {
  const estadoCategoria = obtenerEstadoCategoria(estado, fecha, categoriaId);
  if (estadoCategoria !== ESTADOS_CATEGORIA.sinIniciar && estadoCategoria !== ESTADOS_CATEGORIA.pausado) {
    return estado;
  }
  const nuevoEstado = copiarEstado(estado);
  nuevoEstado.cronometroActivo = { categoriaId, fecha, estado: ESTADOS_CATEGORIA.corriendo };
  return nuevoEstado;
}

// CRO-04, BOR-05: guarda la sesión en el día del cronómetro y lo deja en pausa.
function pausarCronometro(estado, segundosSesion) {
  const activo = estado.cronometroActivo;
  const nuevoEstado = registrarPractica(estado, activo.fecha, activo.categoriaId, segundosSesion);
  nuevoEstado.cronometroActivo.estado = ESTADOS_CATEGORIA.pausado;
  return nuevoEstado;
}

// CRO-05, CRO-07, CRO-13: guarda la sesión y libera el cronómetro.
function detenerCronometro(estado, segundosSesion) {
  const activo = estado.cronometroActivo;
  const nuevoEstado = registrarPractica(estado, activo.fecha, activo.categoriaId, segundosSesion);
  nuevoEstado.cronometroActivo = null;
  return nuevoEstado;
}

// CRO-03: segundos completos transcurridos desde el inicio de la sesión.
function calcularSegundosTranscurridos(inicioMilisegundos, ahoraMilisegundos) {
  return Math.floor((ahoraMilisegundos - inicioMilisegundos) / MILISEGUNDOS_POR_SEGUNDO);
}

// CRO-07: la sesión nunca pasa de lo que faltaba al iniciarla (sin tiempo extra).
function calcularSegundosSesion(segundosRestantesAlIniciar, segundosTranscurridos) {
  return Math.min(segundosTranscurridos, segundosRestantesAlIniciar);
}

function haLlegadoACero(segundosRestantesAlIniciar, segundosTranscurridos) {
  return segundosTranscurridos >= segundosRestantesAlIniciar;
}

// BOR-09: al abrir la app, un cronómetro guardado como "corriendo" queda en pausa.
// La sesión que no se guardó se pierde (contrato, opción A).
function pausarCronometroAlAbrir(estado) {
  const activo = estado.cronometroActivo;
  if (activo === null || activo.estado !== ESTADOS_CATEGORIA.corriendo) {
    return estado;
  }
  const nuevoEstado = copiarEstado(estado);
  nuevoEstado.cronometroActivo.estado = ESTADOS_CATEGORIA.pausado;
  return nuevoEstado;
}

// BOR-06: al empezar un día nuevo, guarda la sesión en el día en que se hizo y libera el cronómetro.
// segundosSesion es 0 si el cronómetro estaba en pausa (su tiempo ya está guardado).
function liberarCronometroDeDiaAnterior(estado, fechaHoy, segundosSesion) {
  const activo = estado.cronometroActivo;
  if (activo === null || activo.fecha === fechaHoy) {
    return estado;
  }
  return detenerCronometro(estado, segundosSesion);
}
