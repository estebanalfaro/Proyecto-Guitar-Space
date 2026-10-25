// Progreso, colores, racha y comparación (PRO-01 a PRO-09, BOR-07, BOR-08).
// Todo se calcula a partir de los registros y nunca se guarda (GEN-07).
// Lo practicado se redondea al minuto más cercano y los porcentajes hacia abajo (contrato).

const PORCENTAJE_COMPLETO = 100;
const PORCENTAJE_AMARILLO = 50;

const COLORES_PROGRESO = {
  verde: 'verde',
  amarillo: 'amarillo',
  rojo: 'rojo',
  gris: 'gris'
};

function calcularPorcentaje(minutosPracticados, minutosMeta) {
  return Math.floor(minutosPracticados * PORCENTAJE_COMPLETO / minutosMeta);
}

// PRO-03: verde con 100 % o más, amarillo de 50 % a 99 %, rojo con menos de 50 %.
function obtenerColorDePorcentaje(porcentaje) {
  if (porcentaje >= PORCENTAJE_COMPLETO) {
    return COLORES_PROGRESO.verde;
  }
  return porcentaje >= PORCENTAJE_AMARILLO ? COLORES_PROGRESO.amarillo : COLORES_PROGRESO.rojo;
}

function sumarSegundos(registros) {
  return registros.reduce((suma, registro) => suma + registro.segundosPracticados, 0);
}

function obtenerMinutosDelDia(estado, fecha) {
  const registrosDelDia = estado.registrosPractica.filter((registro) => registro.fecha === fecha);
  return redondearSegundosAMinutos(sumarSegundos(registrosDelDia));
}

// PRO-02, PRO-09: total practicado de una semana.
function obtenerMinutosDeSemana(estado, semanaId) {
  const registrosDeSemana = estado.registrosPractica.filter((registro) => registro.semanaId === semanaId);
  return redondearSegundosAMinutos(sumarSegundos(registrosDeSemana));
}

// PRO-01, DIS-08: porcentaje de la semana respecto a su meta semanal (puede pasar de 100).
function calcularPorcentajeSemanal(estado, semanaId) {
  const semana = obtenerSemana(estado, semanaId);
  return calcularPorcentaje(obtenerMinutosDeSemana(estado, semanaId), semana.metaSemanalMinutos);
}

function obtenerMetaDiariaDeFecha(estado, fecha) {
  const semana = obtenerSemana(estado, obtenerLunesDeSemana(fecha));
  return calcularMetaDiaria(semana.metaSemanalMinutos);
}

// PRO-03: color del día según la meta diaria de su semana.
function obtenerColorDelDia(estado, fecha) {
  const metaDiaria = obtenerMetaDiariaDeFecha(estado, fecha);
  return obtenerColorDePorcentaje(calcularPorcentaje(obtenerMinutosDelDia(estado, fecha), metaDiaria));
}

// CRO-08 y contrato: lo que falta para la meta del día, con lo practicado ya redondeado (igual que la tarjeta "Hoy").
function calcularMinutosQueFaltanDelDia(estado, fecha) {
  return Math.max(0, obtenerMetaDiariaDeFecha(estado, fecha) - obtenerMinutosDelDia(estado, fecha));
}

// PRO-03, PRO-04: los 7 días de la semana. Los días futuros van sin total ni color.
function obtenerDiasDeSemana(estado, semanaId, fechaHoy) {
  return Array.from({ length: DIAS_POR_SEMANA }, (_, indice) => {
    const fecha = sumarDiasAFecha(semanaId, indice);
    if (fecha > fechaHoy) {
      return { fecha, minutos: null, color: null };
    }
    return { fecha, minutos: obtenerMinutosDelDia(estado, fecha), color: obtenerColorDelDia(estado, fecha) };
  });
}

// PRO-05, BOR-07: compara los días ya terminados con la meta diaria por la cantidad de esos días.
function obtenerColorEstimadoSemanal(estado, semanaId, fechaHoy) {
  const diasTerminados = obtenerDiasDeSemana(estado, semanaId, fechaHoy).filter((dia) => dia.fecha < fechaHoy);
  if (diasTerminados.length === 0) {
    return COLORES_PROGRESO.gris;
  }
  const minutosPracticados = diasTerminados.reduce((suma, dia) => suma + dia.minutos, 0);
  const metaDiaria = calcularMetaDiaria(obtenerSemana(estado, semanaId).metaSemanalMinutos);
  return obtenerColorDePorcentaje(calcularPorcentaje(minutosPracticados, metaDiaria * diasTerminados.length));
}

// PRO-07 y contrato: un día de una semana que no existe cuenta como no cumplido.
function estaDiaCumplido(estado, fecha) {
  const semana = obtenerSemana(estado, obtenerLunesDeSemana(fecha));
  if (semana === undefined) {
    return false;
  }
  return obtenerMinutosDelDia(estado, fecha) >= calcularMetaDiaria(semana.metaSemanalMinutos);
}

// PRO-07, PRO-08: días seguidos cumplidos hacia atrás desde ayer; hoy suma si ya cumplió.
function calcularRacha(estado, fechaHoy) {
  let racha = estaDiaCumplido(estado, fechaHoy) ? 1 : 0;
  let fecha = sumarDiasAFecha(fechaHoy, -1);
  while (estaDiaCumplido(estado, fecha)) {
    racha += 1;
    fecha = sumarDiasAFecha(fecha, -1);
  }
  return racha;
}

// PRO-09, BOR-08: total de la semana anterior, o null si no existe ("Sin datos").
function obtenerMinutosSemanaAnterior(estado, semanaId) {
  const semanaAnteriorId = sumarDiasAFecha(semanaId, -DIAS_POR_SEMANA);
  if (obtenerSemana(estado, semanaAnteriorId) === undefined) {
    return null;
  }
  return obtenerMinutosDeSemana(estado, semanaAnteriorId);
}
