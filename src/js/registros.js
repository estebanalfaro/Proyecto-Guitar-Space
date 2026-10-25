// Registros de práctica (CRO-04, CRO-05, CRO-11).
// Un solo registro por fecha y categoría; cada sesión suma sus segundos.
// La fecha es la del día en que se hizo la sesión (BOR-06). La interfaz solo registra el día actual (CRO-11).

function buscarRegistro(registros, fecha, categoriaId) {
  return registros.find((registro) => registro.fecha === fecha && registro.categoriaId === categoriaId);
}

function registrarPractica(estado, fecha, categoriaId, segundos) {
  const nuevoEstado = copiarEstado(estado);
  const registro = buscarRegistro(nuevoEstado.registrosPractica, fecha, categoriaId);
  if (registro === undefined) {
    nuevoEstado.registrosPractica.push({
      fecha,
      semanaId: obtenerLunesDeSemana(fecha),
      categoriaId,
      segundosPracticados: segundos
    });
  } else {
    registro.segundosPracticados += segundos;
  }
  return nuevoEstado;
}
