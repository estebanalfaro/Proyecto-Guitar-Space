// Semanas, metas, reparto proporcional y validación de duraciones (SEM-01 a SEM-08).
// Las funciones que cambian datos reciben el estado y devuelven uno nuevo, sin modificar el original (BOR-14).

// DIS-17: textos de error de la app.
const MENSAJES_ERROR = {
  noEntero: 'Ingresa un número entero.',
  negativo: 'El tiempo no puede ser negativo.',
  minutosFueraDeRango: 'Los minutos deben estar entre 0 y 59.',
  enCero: 'El tiempo debe ser mayor a 0.',
  ajusteImposible: 'Los minutos no alcanzan para la meta diaria.',
  nombreVacio: 'La categoría necesita un nombre.',
  nombreDuplicado: 'Ya existe una categoría con ese nombre.',
  ultimaCategoria: 'Debe quedar al menos una categoría.'
};

const MINUTOS_MAXIMOS_DEL_CAMPO = 59;
const PATRON_NUMERO_ENTERO = /^-?\d+$/;

function copiarEstado(estado) {
  return JSON.parse(JSON.stringify(estado));
}

// DIS-21, BOR-01, BOR-02, BOR-10: valida el campo de duración (horas y minutos).
// Devuelve { minutos } si es válido o { error } con el texto de DIS-17.
function validarDuracion(textoHoras, textoMinutos, permiteCero) {
  const textos = [String(textoHoras).trim(), String(textoMinutos).trim()];
  if (!textos.every((texto) => PATRON_NUMERO_ENTERO.test(texto))) {
    return { error: MENSAJES_ERROR.noEntero };
  }
  const [horas, minutos] = textos.map(Number);
  if (horas < 0 || minutos < 0) {
    return { error: MENSAJES_ERROR.negativo };
  }
  if (minutos > MINUTOS_MAXIMOS_DEL_CAMPO) {
    return { error: MENSAJES_ERROR.minutosFueraDeRango };
  }
  const totalMinutos = horas * MINUTOS_POR_HORA + minutos;
  if (totalMinutos === 0 && !permiteCero) {
    return { error: MENSAJES_ERROR.enCero };
  }
  return { minutos: totalMinutos };
}

// SEM-05: meta semanal / 7, redondeada al minuto siguiente.
function calcularMetaDiaria(metaSemanalMinutos) {
  return Math.ceil(metaSemanalMinutos / DIAS_POR_SEMANA);
}

// BOR-04: con empate, gana la primera en el orden en que se muestran.
function obtenerIndiceMasGrande(valores) {
  return valores.indexOf(Math.max(...valores));
}

// SEM-06, CAT-10: reparte el total en proporción a los minutos actuales.
// Redondea cada uno al más cercano y ajusta la diferencia en la categoría más grande.
// Si todas están en 0 no hay proporción: el total va a la primera por el empate de BOR-04 (contrato, CAT-10).
function repartirEnProporcion(minutosPorCategoria, totalNuevo) {
  const sumaActual = minutosPorCategoria.reduce((suma, item) => suma + item.minutos, 0);
  const proporcion = sumaActual === 0 ? 0 : totalNuevo / sumaActual;
  const repartidos = minutosPorCategoria.map((item) => ({
    categoriaId: item.categoriaId,
    minutos: Math.round(item.minutos * proporcion)
  }));
  const diferencia = totalNuevo - repartidos.reduce((suma, item) => suma + item.minutos, 0);
  const indiceMasGrande = obtenerIndiceMasGrande(repartidos.map((item) => item.minutos));
  repartidos[indiceMasGrande].minutos += diferencia;
  return repartidos;
}

function obtenerSemana(estado, semanaId) {
  return estado.semanas.find((semana) => semana.id === semanaId);
}

function obtenerUltimaSemana(estado) {
  return estado.semanas.reduce(
    (ultima, semana) => (ultima === undefined || semana.id > ultima.id ? semana : ultima),
    undefined
  );
}

// SEM-02: sin semanas guardadas se usan la meta y los minutos por defecto.
function crearValoresPorDefecto(estado) {
  return {
    metaSemanalMinutos: estado.configuracion.metaSemanalPorDefectoMinutos,
    minutosDiariosPorCategoria: estado.categorias
      .filter((categoria) => categoria.activa)
      .map((categoria) => ({ categoriaId: categoria.id, minutos: categoria.minutosPorDefecto }))
  };
}

// SEM-01, SEM-02: crea la semana de la fecha dada si no existe, copiando la última guardada.
function crearSemanaActual(estado, fechaHoy) {
  const lunes = obtenerLunesDeSemana(fechaHoy);
  if (obtenerSemana(estado, lunes) !== undefined) {
    return estado;
  }
  const ultimaSemana = obtenerUltimaSemana(estado);
  const valoresBase = ultimaSemana === undefined ? crearValoresPorDefecto(estado) : ultimaSemana;
  const nuevoEstado = copiarEstado(estado);
  nuevoEstado.semanas.push(copiarEstado({
    id: lunes,
    fechaInicio: lunes,
    fechaFin: sumarDiasAFecha(lunes, DIAS_POR_SEMANA - 1),
    metaSemanalMinutos: valoresBase.metaSemanalMinutos,
    minutosDiariosPorCategoria: valoresBase.minutosDiariosPorCategoria
  }));
  return nuevoEstado;
}

// SEM-04, SEM-06, SEM-07, SEM-08: cambia la meta solo de la semana indicada y reparte sus minutos.
function cambiarMetaSemanal(estado, semanaId, metaSemanalMinutos) {
  const nuevoEstado = copiarEstado(estado);
  const semana = obtenerSemana(nuevoEstado, semanaId);
  semana.metaSemanalMinutos = metaSemanalMinutos;
  semana.minutosDiariosPorCategoria = repartirEnProporcion(
    semana.minutosDiariosPorCategoria,
    calcularMetaDiaria(metaSemanalMinutos)
  );
  return nuevoEstado;
}
