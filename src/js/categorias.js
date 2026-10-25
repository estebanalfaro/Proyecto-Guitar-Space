// Agregar, editar y eliminar categorías (CAT-01 a CAT-10, BOR-03, BOR-04, BOR-11 a BOR-14).
// Las funciones reciben minutos ya validados con validarDuracion (BOR-01, BOR-02, BOR-10).
// Devuelven { estado } si el cambio es válido, o { error, campo } sin modificar nada (BOR-14).

const PATRON_TILDES = /[̀-ͯ]/g;
const PATRON_ESPACIOS = /\s+/g;

// BOR-12: sin distinguir mayúsculas, tildes ni espacios al inicio o al final.
function normalizarNombre(nombre) {
  return nombre.trim().toLowerCase().normalize('NFD').replace(PATRON_TILDES, '');
}

// Contrato: minúsculas, sin tildes, espacios cambiados por guiones y -2, -3… si el ID ya existe.
function generarIdCategoria(nombre, categorias) {
  const idBase = normalizarNombre(nombre).replace(PATRON_ESPACIOS, '-');
  const idsExistentes = categorias.map((categoria) => categoria.id);
  let id = idBase;
  let sufijo = 2;
  while (idsExistentes.includes(id)) {
    id = idBase + '-' + sufijo;
    sufijo += 1;
  }
  return id;
}

function obtenerCategoriasActivas(estado) {
  return estado.categorias.filter((categoria) => categoria.activa);
}

// BOR-11, BOR-12: devuelve el texto de error o null si el nombre es válido.
function validarNombreCategoria(nombre, categorias) {
  const nombreNormalizado = normalizarNombre(nombre);
  if (nombreNormalizado === '') {
    return MENSAJES_ERROR.nombreVacio;
  }
  const estaRepetido = categorias.some(
    (categoria) => categoria.activa && normalizarNombre(categoria.nombre) === nombreNormalizado
  );
  return estaRepetido ? MENSAJES_ERROR.nombreDuplicado : null;
}

// CAT-04, BOR-03, BOR-04: ajusta la diferencia con la meta diaria en la categoría más grande.
// Devuelve la lista ajustada o null si alguna categoría queda por debajo de 0.
function ajustarAMetaDiaria(minutosPorCategoria, metaDiaria) {
  const ajustados = minutosPorCategoria.map((item) => ({ ...item }));
  const diferencia = metaDiaria - ajustados.reduce((suma, item) => suma + item.minutos, 0);
  const indiceMasGrande = obtenerIndiceMasGrande(ajustados.map((item) => item.minutos));
  ajustados[indiceMasGrande].minutos += diferencia;
  return ajustados[indiceMasGrande].minutos < 0 ? null : ajustados;
}

// CAT-08, CAT-04: agrega la categoría a la lista y a la semana actual.
function agregarCategoria(estado, semanaId, nombre, minutosPorDefecto, minutosDiarios) {
  const errorNombre = validarNombreCategoria(nombre, estado.categorias);
  if (errorNombre !== null) {
    return { error: errorNombre, campo: 'nombre' };
  }
  const semana = obtenerSemana(estado, semanaId);
  const id = generarIdCategoria(nombre, estado.categorias);
  const minutosAjustados = ajustarAMetaDiaria(
    [...semana.minutosDiariosPorCategoria, { categoriaId: id, minutos: minutosDiarios }],
    calcularMetaDiaria(semana.metaSemanalMinutos)
  );
  if (minutosAjustados === null) {
    return { error: MENSAJES_ERROR.ajusteImposible, campo: 'agregar' };
  }
  const nuevoEstado = copiarEstado(estado);
  nuevoEstado.categorias.push({ id, nombre: nombre.trim(), minutosPorDefecto, activa: true });
  obtenerSemana(nuevoEstado, semanaId).minutosDiariosPorCategoria = minutosAjustados;
  return { estado: nuevoEstado };
}

// CAT-03, CAT-04: guarda los minutos diarios editados de la semana actual.
function editarMinutosDiarios(estado, semanaId, minutosPorCategoria) {
  const semana = obtenerSemana(estado, semanaId);
  const minutosAjustados = ajustarAMetaDiaria(
    minutosPorCategoria,
    calcularMetaDiaria(semana.metaSemanalMinutos)
  );
  if (minutosAjustados === null) {
    return { error: MENSAJES_ERROR.ajusteImposible, campo: 'guardar' };
  }
  const nuevoEstado = copiarEstado(estado);
  obtenerSemana(nuevoEstado, semanaId).minutosDiariosPorCategoria = minutosAjustados;
  return { estado: nuevoEstado };
}

// CAT-09, CAT-10, BOR-13: marca la categoría como inactiva y reparte sus minutos en la semana actual.
function eliminarCategoria(estado, semanaId, categoriaId) {
  if (obtenerCategoriasActivas(estado).length === 1) {
    return { error: MENSAJES_ERROR.ultimaCategoria, campo: categoriaId };
  }
  const nuevoEstado = copiarEstado(estado);
  const semana = obtenerSemana(nuevoEstado, semanaId);
  nuevoEstado.categorias.find((categoria) => categoria.id === categoriaId).activa = false;
  semana.minutosDiariosPorCategoria = repartirEnProporcion(
    semana.minutosDiariosPorCategoria.filter((item) => item.categoriaId !== categoriaId),
    calcularMetaDiaria(semana.metaSemanalMinutos)
  );
  return { estado: nuevoEstado };
}
