// Formatos de duraciones y fechas (GEN-03, GEN-04).

const SEGUNDOS_POR_MINUTO = 60;
const MINUTOS_POR_HORA = 60;
const DIAS_POR_SEMANA = 7;

function completarDosDigitos(numero) {
  return String(numero).padStart(2, '0');
}

// GEN-04: duraciones en h:mm.
function formatearMinutos(minutos) {
  const horas = Math.floor(minutos / MINUTOS_POR_HORA);
  return horas + ':' + completarDosDigitos(minutos % MINUTOS_POR_HORA);
}

// GEN-04: el cronómetro se muestra en h:mm:ss.
function formatearSegundos(segundos) {
  const minutosCompletos = Math.floor(segundos / SEGUNDOS_POR_MINUTO);
  return formatearMinutos(minutosCompletos) + ':' + completarDosDigitos(segundos % SEGUNDOS_POR_MINUTO);
}

// Contrato: lo practicado se redondea al minuto más cercano.
function redondearSegundosAMinutos(segundos) {
  return Math.round(segundos / SEGUNDOS_POR_MINUTO);
}

// GEN-03: AAAA-MM-DD (guardada) a DD-MM-AAAA (vista).
function fechaGuardadaAVista(fechaGuardada) {
  const [anio, mes, dia] = fechaGuardada.split('-');
  return dia + '-' + mes + '-' + anio;
}

// GEN-03: DD-MM-AAAA (vista) a AAAA-MM-DD (guardada).
function fechaVistaAGuardada(fechaVista) {
  const [dia, mes, anio] = fechaVista.split('-');
  return anio + '-' + mes + '-' + dia;
}

// Usa la hora local de la computadora, no UTC.
function convertirDateAFechaGuardada(fecha) {
  return fecha.getFullYear() + '-' +
    completarDosDigitos(fecha.getMonth() + 1) + '-' +
    completarDosDigitos(fecha.getDate());
}

function convertirFechaGuardadaADate(fechaGuardada) {
  const [anio, mes, dia] = fechaGuardada.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

function sumarDiasAFecha(fechaGuardada, dias) {
  const fecha = convertirFechaGuardadaADate(fechaGuardada);
  fecha.setDate(fecha.getDate() + dias);
  return convertirDateAFechaGuardada(fecha);
}

function obtenerFechaHoy() {
  return convertirDateAFechaGuardada(new Date());
}

// SEM-01: la semana va de lunes a domingo. getDay() devuelve 0 para domingo.
function obtenerLunesDeSemana(fechaGuardada) {
  const diaDeLaSemana = convertirFechaGuardadaADate(fechaGuardada).getDay();
  const diasDesdeLunes = (diaDeLaSemana + DIAS_POR_SEMANA - 1) % DIAS_POR_SEMANA;
  return sumarDiasAFecha(fechaGuardada, -diasDesdeLunes);
}
