// Ejecuta las pruebas de la lógica y muestra cada una con ✓ o ✗.
// Cada tarea agrega su grupo con probarGrupo() antes de mostrarResultados().

const resultadosPorGrupo = [];

function evaluarCaso(caso) {
  const obtenido = JSON.stringify(caso.obtenido);
  const esperado = JSON.stringify(caso.esperado);
  return {
    descripcion: caso.descripcion,
    aprobado: obtenido === esperado,
    obtenido,
    esperado
  };
}

function probarGrupo(titulo, casos) {
  resultadosPorGrupo.push({ titulo, resultados: casos.map(evaluarCaso) });
}

function crearLineaResultado(resultado) {
  const linea = document.createElement('li');
  linea.textContent = resultado.aprobado
    ? '✓ ' + resultado.descripcion
    : '✗ ' + resultado.descripcion + ' — obtenido: ' + resultado.obtenido + ', esperado: ' + resultado.esperado;
  return linea;
}

function crearBloqueGrupo(grupo) {
  const bloque = document.createElement('section');
  const titulo = document.createElement('h2');
  const lista = document.createElement('ul');
  titulo.textContent = grupo.titulo;
  grupo.resultados.forEach((resultado) => lista.appendChild(crearLineaResultado(resultado)));
  bloque.appendChild(titulo);
  bloque.appendChild(lista);
  return bloque;
}

function mostrarResumen() {
  const todos = resultadosPorGrupo.flatMap((grupo) => grupo.resultados);
  const aprobados = todos.filter((resultado) => resultado.aprobado).length;
  document.getElementById('resumen-pruebas').textContent =
    aprobados + ' de ' + todos.length + ' pruebas aprobadas';
}

function mostrarResultados() {
  const contenedor = document.getElementById('resultados-pruebas');
  resultadosPorGrupo.forEach((grupo) => contenedor.appendChild(crearBloqueGrupo(grupo)));
  mostrarResumen();
}

// Aquí se agregan los grupos de pruebas de cada tarea (2 a 8 y 11).

// Tarea 2: Formatos (GEN-03, GEN-04).
probarGrupo('Formatos', [
  { descripcion: '630 min → 10:30', obtenido: formatearMinutos(630), esperado: '10:30' },
  { descripcion: '86 min → 1:26', obtenido: formatearMinutos(86), esperado: '1:26' },
  { descripcion: '5 min → 0:05', obtenido: formatearMinutos(5), esperado: '0:05' },
  { descripcion: '0 min → 0:00', obtenido: formatearMinutos(0), esperado: '0:00' },
  { descripcion: '1500 s → 0:25:00', obtenido: formatearSegundos(1500), esperado: '0:25:00' },
  { descripcion: '3661 s → 1:01:01', obtenido: formatearSegundos(3661), esperado: '1:01:01' },
  { descripcion: '0 s → 0:00:00', obtenido: formatearSegundos(0), esperado: '0:00:00' },
  { descripcion: 'Practicado 24 min 59 s → 25 min', obtenido: redondearSegundosAMinutos(1499), esperado: 25 },
  { descripcion: 'Practicado 24 min 30 s → 25 min', obtenido: redondearSegundosAMinutos(1470), esperado: 25 },
  { descripcion: 'Practicado 24 min 29 s → 24 min', obtenido: redondearSegundosAMinutos(1469), esperado: 24 },
  { descripcion: '2026-10-19 → 19-10-2026', obtenido: fechaGuardadaAVista('2026-10-19'), esperado: '19-10-2026' },
  { descripcion: '19-10-2026 → 2026-10-19', obtenido: fechaVistaAGuardada('19-10-2026'), esperado: '2026-10-19' },
  { descripcion: 'Hoy tiene formato AAAA-MM-DD', obtenido: /^\d{4}-\d{2}-\d{2}$/.test(obtenerFechaHoy()), esperado: true },
  { descripcion: 'Lunes de un lunes es el mismo día', obtenido: obtenerLunesDeSemana('2026-10-19'), esperado: '2026-10-19' },
  { descripcion: 'Lunes de un jueves', obtenido: obtenerLunesDeSemana('2026-10-22'), esperado: '2026-10-19' },
  { descripcion: 'Lunes de un domingo', obtenido: obtenerLunesDeSemana('2026-10-25'), esperado: '2026-10-19' },
  { descripcion: 'Lunes cruzando de mes', obtenido: obtenerLunesDeSemana('2026-11-01'), esperado: '2026-10-26' },
  { descripcion: 'Lunes cruzando de año', obtenido: obtenerLunesDeSemana('2027-01-01'), esperado: '2026-12-28' }
]);

// Tarea 3: Almacenamiento (GEN-01, GEN-02, GEN-07).
// Respalda los datos reales de la app y los restaura al terminar.
function probarAlmacenamiento() {
  const respaldo = localStorage.getItem(CLAVE_ALMACENAMIENTO);
  localStorage.removeItem(CLAVE_ALMACENAMIENTO);

  const estadoNuevo = cargarEstado();
  const estadoGuardadoAlCrear = leerEstado();
  const cronometroDePrueba = { categoriaId: 'tecnica', fecha: '2026-10-22', estado: 'pausado' };
  guardarEstado({ ...estadoNuevo, cronometroActivo: cronometroDePrueba });
  const estadoRecargado = cargarEstado();

  if (respaldo === null) {
    localStorage.removeItem(CLAVE_ALMACENAMIENTO);
  } else {
    localStorage.setItem(CLAVE_ALMACENAMIENTO, respaldo);
  }

  probarGrupo('Almacenamiento', [
    { descripcion: 'Sin datos: crea la meta 10:30', obtenido: estadoNuevo.configuracion.metaSemanalPorDefectoMinutos, esperado: 630 },
    {
      descripcion: 'Sin datos: crea Técnica 0:25, Repertorio 0:50 y Lectura 0:15',
      obtenido: estadoNuevo.categorias.map((categoria) => [categoria.id, categoria.nombre, categoria.minutosPorDefecto, categoria.activa]),
      esperado: [['tecnica', 'Técnica', 25, true], ['repertorio', 'Repertorio', 50, true], ['lectura', 'Lectura', 15, true]]
    },
    { descripcion: 'Sin datos: sin semanas, registros ni cronómetro', obtenido: [estadoNuevo.semanas, estadoNuevo.registrosPractica, estadoNuevo.cronometroActivo], esperado: [[], [], null] },
    { descripcion: 'El estado inicial queda guardado en localStorage', obtenido: estadoGuardadoAlCrear, esperado: estadoNuevo },
    {
      descripcion: 'Solo guarda los campos del contrato',
      obtenido: Object.keys(estadoGuardadoAlCrear),
      esperado: ['app', 'configuracion', 'categorias', 'semanas', 'registrosPractica', 'cronometroActivo']
    },
    { descripcion: 'Con datos guardados: los lee sin reiniciarlos', obtenido: estadoRecargado.cronometroActivo, esperado: cronometroDePrueba },
    { descripcion: 'Los datos reales se restauran después de probar', obtenido: localStorage.getItem(CLAVE_ALMACENAMIENTO), esperado: respaldo }
  ]);
}

probarAlmacenamiento();

// Tarea 4: Semanas y metas (SEM-01 a SEM-08).
function crearEstadoConSemanas(semanas) {
  return { ...crearEstadoInicial(), semanas };
}

function crearSemanaDePrueba(lunes, metaSemanalMinutos, minutos) {
  return {
    id: lunes,
    fechaInicio: lunes,
    fechaFin: sumarDiasAFecha(lunes, 6),
    metaSemanalMinutos,
    minutosDiariosPorCategoria: [
      { categoriaId: 'tecnica', minutos: minutos[0] },
      { categoriaId: 'repertorio', minutos: minutos[1] },
      { categoriaId: 'lectura', minutos: minutos[2] }
    ]
  };
}

function obtenerMinutos(semana) {
  return semana.minutosDiariosPorCategoria.map((item) => item.minutos);
}

function probarSemanas() {
  const primeraSemana = crearSemanaActual(crearEstadoInicial(), '2026-10-22').semanas[0];

  const semanaPasada = crearSemanaDePrueba('2026-10-12', 420, [17, 33, 10]);
  const semanaAntigua = crearSemanaDePrueba('2026-10-05', 630, [25, 50, 15]);
  const estadoConPasadas = crearEstadoConSemanas([semanaPasada, semanaAntigua]);
  const estadoConActual = crearSemanaActual(estadoConPasadas, '2026-10-22');
  const semanaCopiada = obtenerSemana(estadoConActual, '2026-10-19');
  const estadoSinCambios = crearSemanaActual(estadoConActual, '2026-10-25');

  const estadoActual = crearEstadoConSemanas([semanaPasada, crearSemanaDePrueba('2026-10-19', 630, [25, 50, 15])]);
  const copiaAntesDeCambiar = JSON.stringify(estadoActual);
  const estadoCon7Horas = cambiarMetaSemanal(estadoActual, '2026-10-19', 420);
  const estadoCon10Horas = cambiarMetaSemanal(estadoActual, '2026-10-19', 600);

  probarGrupo('Semanas y metas', [
    { descripcion: 'Meta diaria de 10:30 → 1:30', obtenido: formatearMinutos(calcularMetaDiaria(630)), esperado: '1:30' },
    { descripcion: 'Meta diaria de 600 min → 1:26', obtenido: formatearMinutos(calcularMetaDiaria(600)), esperado: '1:26' },
    { descripcion: 'Meta diaria de 7 h → 1:00', obtenido: formatearMinutos(calcularMetaDiaria(420)), esperado: '1:00' },
    { descripcion: 'Sin semanas: crea la semana del lunes al domingo', obtenido: [primeraSemana.id, primeraSemana.fechaInicio, primeraSemana.fechaFin], esperado: ['2026-10-19', '2026-10-19', '2026-10-25'] },
    { descripcion: 'Sin semanas: usa la meta y los minutos por defecto', obtenido: [primeraSemana.metaSemanalMinutos, obtenerMinutos(primeraSemana)], esperado: [630, [25, 50, 15]] },
    { descripcion: 'Copia la meta y los minutos de la última semana guardada', obtenido: [semanaCopiada.metaSemanalMinutos, obtenerMinutos(semanaCopiada)], esperado: [420, [17, 33, 10]] },
    { descripcion: 'Si la semana actual ya existe, no crea otra', obtenido: estadoSinCambios.semanas.length, esperado: 3 },
    { descripcion: 'Crear la semana no modifica el estado original', obtenido: estadoConPasadas.semanas.length, esperado: 2 },
    { descripcion: 'Meta 7 h → 17 / 33 / 10', obtenido: obtenerMinutos(obtenerSemana(estadoCon7Horas, '2026-10-19')), esperado: [17, 33, 10] },
    { descripcion: 'Meta 7 h se guarda en la semana actual', obtenido: obtenerSemana(estadoCon7Horas, '2026-10-19').metaSemanalMinutos, esperado: 420 },
    { descripcion: 'Meta 600 min → 24 / 48 / 14 (suma 86)', obtenido: obtenerMinutos(obtenerSemana(estadoCon10Horas, '2026-10-19')), esperado: [24, 48, 14] },
    { descripcion: 'Cambiar la meta no modifica la semana pasada', obtenido: obtenerSemana(estadoCon7Horas, '2026-10-12'), esperado: semanaPasada },
    { descripcion: 'Cambiar la meta no modifica el estado original', obtenido: JSON.stringify(estadoActual), esperado: copiaAntesDeCambiar },
    {
      descripcion: 'Empate: el minuto de redondeo va a la primera',
      obtenido: repartirEnProporcion([{ categoriaId: 'a', minutos: 30 }, { categoriaId: 'b', minutos: 30 }, { categoriaId: 'c', minutos: 30 }], 100).map((item) => item.minutos),
      esperado: [34, 33, 33]
    },
    { descripcion: 'Duración válida 10 h 30 min', obtenido: validarDuracion('10', '30', false), esperado: { minutos: 630 } },
    { descripcion: 'Duración con espacios', obtenido: validarDuracion(' 2 ', '05', false), esperado: { minutos: 125 } },
    { descripcion: 'Campo vacío', obtenido: validarDuracion('', '30', false), esperado: { error: 'Ingresa un número entero.' } },
    { descripcion: 'Número con decimales', obtenido: validarDuracion('1.5', '0', false), esperado: { error: 'Ingresa un número entero.' } },
    { descripcion: 'Texto que no es número', obtenido: validarDuracion('abc', '0', false), esperado: { error: 'Ingresa un número entero.' } },
    { descripcion: 'Tiempo negativo', obtenido: validarDuracion('-1', '0', false), esperado: { error: 'El tiempo no puede ser negativo.' } },
    { descripcion: 'Minutos fuera de rango', obtenido: validarDuracion('0', '60', false), esperado: { error: 'Los minutos deben estar entre 0 y 59.' } },
    { descripcion: 'Meta en 0', obtenido: validarDuracion('0', '0', false), esperado: { error: 'El tiempo debe ser mayor a 0.' } },
    { descripcion: '0 permitido cuando el campo lo acepta', obtenido: validarDuracion('0', '0', true), esperado: { minutos: 0 } }
  ]);
}

probarSemanas();

// Tarea 5: Categorías (CAT-01 a CAT-10, BOR-01 a BOR-04, BOR-10 a BOR-14).
function crearEstadoDeCategorias() {
  const semanaPasada = crearSemanaDePrueba('2026-10-12', 630, [25, 50, 15]);
  return crearEstadoConSemanas([semanaPasada, crearSemanaDePrueba('2026-10-19', 630, [25, 50, 15])]);
}

function obtenerMinutosDeSemanaActual(estado) {
  return obtenerMinutos(obtenerSemana(estado, '2026-10-19'));
}

function crearMinutosEditados(minutos) {
  return ['tecnica', 'repertorio', 'lectura'].map((categoriaId, indice) => ({ categoriaId, minutos: minutos[indice] }));
}

function probarCategorias() {
  const estado = crearEstadoDeCategorias();
  const copiaOriginal = JSON.stringify(estado);

  const conArmonia = agregarCategoria(estado, '2026-10-19', '  Armonía  ', 10, 10).estado;
  const armonia = conArmonia.categorias[3];
  const conNuevaMasGrande = agregarCategoria(estado, '2026-10-19', 'Improvisación', 0, 60).estado;
  const conNombreVacio = agregarCategoria(estado, '2026-10-19', '   ', 10, 10);
  const conNombreRepetido = agregarCategoria(estado, '2026-10-19', ' TECNICA ', 10, 10);

  const sinLectura = eliminarCategoria(estado, '2026-10-19', 'lectura').estado;
  const lecturaDeNuevo = agregarCategoria(sinLectura, '2026-10-19', 'Lectura', 15, 15).estado;
  const soloTecnica = eliminarCategoria(eliminarCategoria(estado, '2026-10-19', 'lectura').estado, '2026-10-19', 'repertorio').estado;
  const eliminarUltima = eliminarCategoria(soloTecnica, '2026-10-19', 'tecnica');

  const editada = editarMinutosDiarios(estado, '2026-10-19', crearMinutosEditados([30, 50, 15])).estado;
  const editadaConEmpate = editarMinutosDiarios(estado, '2026-10-19', crearMinutosEditados([20, 20, 20])).estado;
  const editadaImposible = editarMinutosDiarios(estado, '2026-10-19', crearMinutosEditados([60, 60, 60]));

  const estadoConCeros = crearEstadoConSemanas([crearSemanaDePrueba('2026-10-19', 630, [90, 0, 0])]);
  const sinTecnicaConCeros = eliminarCategoria(estadoConCeros, '2026-10-19', 'tecnica').estado;

  probarGrupo('Categorías', [
    { descripcion: 'ID con tildes y espacios', obtenido: generarIdCategoria('Lectura a Primera Vista', []), esperado: 'lectura-a-primera-vista' },
    { descripcion: 'ID repetido → -2', obtenido: generarIdCategoria('Técnica', estado.categorias), esperado: 'tecnica-2' },
    { descripcion: 'ID repetido dos veces → -3', obtenido: generarIdCategoria('Técnica', [{ id: 'tecnica' }, { id: 'tecnica-2' }]), esperado: 'tecnica-3' },
    { descripcion: 'Agregar: guarda nombre sin espacios, ID y minutos por defecto', obtenido: armonia, esperado: { id: 'armonia', nombre: 'Armonía', minutosPorDefecto: 10, activa: true } },
    { descripcion: 'Agregar: el ajuste va a la más grande (25 / 40 / 15 / 10)', obtenido: obtenerMinutosDeSemanaActual(conArmonia), esperado: [25, 40, 15, 10] },
    { descripcion: 'Agregar: la nueva puede recibir el ajuste (25 / 50 / 15 / 0)', obtenido: obtenerMinutosDeSemanaActual(conNuevaMasGrande), esperado: [25, 50, 15, 0] },
    { descripcion: 'Agregar: no cambia la semana pasada', obtenido: obtenerMinutos(obtenerSemana(conArmonia, '2026-10-12')), esperado: [25, 50, 15] },
    { descripcion: 'Nombre vacío', obtenido: conNombreVacio, esperado: { error: 'La categoría necesita un nombre.', campo: 'nombre' } },
    { descripcion: 'Nombre repetido sin distinguir mayúsculas, tildes ni espacios', obtenido: conNombreRepetido, esperado: { error: 'Ya existe una categoría con ese nombre.', campo: 'nombre' } },
    { descripcion: 'Nombre de una categoría eliminada se puede volver a usar', obtenido: lecturaDeNuevo.categorias.map((categoria) => categoria.id), esperado: ['tecnica', 'repertorio', 'lectura', 'lectura-2'] },
    { descripcion: 'Eliminar: queda inactiva y se conserva', obtenido: sinLectura.categorias[2], esperado: { id: 'lectura', nombre: 'Lectura', minutosPorDefecto: 15, activa: false } },
    { descripcion: 'Eliminar: reparte en proporción (30 / 60)', obtenido: obtenerMinutosDeSemanaActual(sinLectura), esperado: [30, 60] },
    { descripcion: 'Eliminar: no cambia la semana pasada', obtenido: obtenerMinutos(obtenerSemana(sinLectura, '2026-10-12')), esperado: [25, 50, 15] },
    { descripcion: 'Eliminar: con 2 categorías, la que queda recibe toda la meta', obtenido: obtenerMinutosDeSemanaActual(soloTecnica), esperado: [90] },
    { descripcion: 'Eliminar la última categoría', obtenido: eliminarUltima, esperado: { error: 'Debe quedar al menos una categoría.', campo: 'tecnica' } },
    { descripcion: 'Eliminar si las demás están en 0: el total va a la primera', obtenido: obtenerMinutosDeSemanaActual(sinTecnicaConCeros), esperado: [90, 0] },
    { descripcion: 'Editar: el ajuste va a la más grande (30 / 45 / 15)', obtenido: obtenerMinutosDeSemanaActual(editada), esperado: [30, 45, 15] },
    { descripcion: 'Editar: empate, el ajuste va a la primera (50 / 20 / 20)', obtenido: obtenerMinutosDeSemanaActual(editadaConEmpate), esperado: [50, 20, 20] },
    { descripcion: 'Editar: ajuste imposible', obtenido: editadaImposible, esperado: { error: 'Los minutos no alcanzan para la meta diaria.', campo: 'guardar' } },
    { descripcion: 'Minutos de categoría en 0 son válidos', obtenido: validarDuracion('0', '0', true), esperado: { minutos: 0 } },
    { descripcion: 'BOR-14: ninguna operación modifica el estado original', obtenido: JSON.stringify(estado), esperado: copiaOriginal }
  ]);
}

probarCategorias();

// Tarea 6: Registros de práctica (CRO-04, CRO-05, CRO-11).
function probarRegistros() {
  const estado = crearEstadoInicial();
  const unaSesion = registrarPractica(estado, '2026-10-22', 'tecnica', 1200);
  const dosSesiones = registrarPractica(unaSesion, '2026-10-22', 'tecnica', 300);
  const otraCategoria = registrarPractica(dosSesiones, '2026-10-22', 'lectura', 600);
  const otroDia = registrarPractica(otraCategoria, '2026-10-25', 'tecnica', 900);

  probarGrupo('Registros de práctica', [
    {
      descripcion: 'Primera sesión crea el registro con su semana',
      obtenido: unaSesion.registrosPractica,
      esperado: [{ fecha: '2026-10-22', semanaId: '2026-10-19', categoriaId: 'tecnica', segundosPracticados: 1200 }]
    },
    {
      descripcion: 'Dos sesiones de la misma categoría y día quedan en un solo registro con la suma',
      obtenido: dosSesiones.registrosPractica,
      esperado: [{ fecha: '2026-10-22', semanaId: '2026-10-19', categoriaId: 'tecnica', segundosPracticados: 1500 }]
    },
    { descripcion: 'Otra categoría el mismo día crea otro registro', obtenido: otraCategoria.registrosPractica.length, esperado: 2 },
    { descripcion: 'Otro día crea otro registro (domingo, misma semana)', obtenido: otroDia.registrosPractica[2], esperado: { fecha: '2026-10-25', semanaId: '2026-10-19', categoriaId: 'tecnica', segundosPracticados: 900 } },
    { descripcion: 'No modifica el estado original', obtenido: [estado.registrosPractica.length, unaSesion.registrosPractica[0].segundosPracticados], esperado: [0, 1200] }
  ]);
}

probarRegistros();

// Tarea 7: Cronómetro (CRO-01 a CRO-16, BOR-05, BOR-06, BOR-09).
function probarCronometro() {
  const hoy = '2026-10-22';
  const estado = crearEstadoConSemanas([crearSemanaDePrueba('2026-10-19', 630, [25, 50, 0])]);
  const copiaOriginal = JSON.stringify(estado);

  const corriendo = iniciarCronometro(estado, hoy, 'tecnica');
  const intentoDeOtro = iniciarCronometro(corriendo, hoy, 'repertorio');
  const pausado = pausarCronometro(corriendo, 300);
  const intentoMientrasPausado = iniciarCronometro(pausado, hoy, 'repertorio');
  const reanudado = iniciarCronometro(pausado, hoy, 'tecnica');
  const detenido = detenerCronometro(reanudado, 200);
  const casiCumplida = registrarPractica(estado, hoy, 'tecnica', 1470);
  const intentoEnCumplida = iniciarCronometro(casiCumplida, hoy, 'tecnica');
  const conMetaMenor = registrarPractica(estado, hoy, 'tecnica', 1800);

  const cerradoDeGolpe = pausarCronometroAlAbrir(corriendo);
  const diaSiguienteCorriendo = liberarCronometroDeDiaAnterior(corriendo, '2026-10-23', 120);
  const diaSiguientePausado = liberarCronometroDeDiaAnterior(pausado, '2026-10-23', 0);
  const mismoDia = liberarCronometroDeDiaAnterior(corriendo, hoy, 120);

  probarGrupo('Cronómetro', [
    { descripcion: 'Empieza en la meta de la categoría (0:25:00)', obtenido: formatearSegundos(calcularSegundosRestantes(estado, hoy, 'tecnica')), esperado: '0:25:00' },
    { descripcion: 'Sin cronómetro activo: sin iniciar', obtenido: obtenerEstadoCategoria(estado, hoy, 'tecnica'), esperado: 'sinIniciar' },
    { descripcion: 'Iniciar: queda corriendo', obtenido: corriendo.cronometroActivo, esperado: { categoriaId: 'tecnica', fecha: hoy, estado: 'corriendo' } },
    { descripcion: 'Con otro corriendo, las demás quedan bloqueadas', obtenido: obtenerEstadoCategoria(corriendo, hoy, 'repertorio'), esperado: 'bloqueada' },
    { descripcion: 'CRO-02: no se inicia otro mientras uno corre', obtenido: intentoDeOtro, esperado: corriendo },
    { descripcion: 'Pausar: guarda la sesión y queda en pausa', obtenido: [obtenerSegundosPracticados(pausado, hoy, 'tecnica'), pausado.cronometroActivo.estado], esperado: [300, 'pausado'] },
    { descripcion: 'CRO-02: no se inicia otro mientras uno está en pausa', obtenido: intentoMientrasPausado, esperado: pausado },
    { descripcion: 'Reanudar: continúa desde lo que falta (0:20:00)', obtenido: [reanudado.cronometroActivo.estado, formatearSegundos(calcularSegundosRestantes(reanudado, hoy, 'tecnica'))], esperado: ['corriendo', '0:20:00'] },
    { descripcion: 'Detener: suma al mismo registro y libera el cronómetro', obtenido: [obtenerSegundosPracticados(detenido, hoy, 'tecnica'), detenido.cronometroActivo, detenido.registrosPractica.length], esperado: [500, null, 1] },
    { descripcion: 'Hay cronómetro activo corriendo, en pausa y no después de detener', obtenido: [hayCronometroActivo(corriendo), hayCronometroActivo(pausado), hayCronometroActivo(detenido)], esperado: [true, true, false] },
    { descripcion: 'Cumplida con lo practicado redondeado (24 min 30 s)', obtenido: obtenerEstadoCategoria(casiCumplida, hoy, 'tecnica'), esperado: 'cumplida' },
    { descripcion: 'No se inicia una categoría cumplida', obtenido: intentoEnCumplida, esperado: casiCumplida },
    { descripcion: 'Categoría con meta 0 está cumplida desde el inicio', obtenido: obtenerEstadoCategoria(estado, hoy, 'lectura'), esperado: 'cumplida' },
    { descripcion: 'Si la meta quedó por debajo de lo practicado, faltan 0 s', obtenido: calcularSegundosRestantes(conMetaMenor, hoy, 'tecnica'), esperado: 0 },
    { descripcion: 'Segundos transcurridos completos', obtenido: calcularSegundosTranscurridos(1000, 3999), esperado: 2 },
    { descripcion: 'CRO-07: la sesión no pasa de lo que faltaba', obtenido: calcularSegundosSesion(900, 905), esperado: 900 },
    { descripcion: 'CRO-07: llega a 0 solo al completar lo que faltaba', obtenido: [haLlegadoACero(900, 899), haLlegadoACero(900, 900)], esperado: [false, true] },
    { descripcion: 'BOR-09: corriendo al abrir queda en pausa sin sumar tiempo', obtenido: [cerradoDeGolpe.cronometroActivo.estado, cerradoDeGolpe.registrosPractica], esperado: ['pausado', []] },
    { descripcion: 'BOR-09: en pausa al abrir no cambia', obtenido: pausarCronometroAlAbrir(pausado), esperado: pausado },
    {
      descripcion: 'BOR-06: día nuevo con uno corriendo guarda en su día y libera',
      obtenido: [obtenerSegundosPracticados(diaSiguienteCorriendo, hoy, 'tecnica'), obtenerSegundosPracticados(diaSiguienteCorriendo, '2026-10-23', 'tecnica'), diaSiguienteCorriendo.cronometroActivo],
      esperado: [120, 0, null]
    },
    { descripcion: 'BOR-06: día nuevo con uno en pausa lo libera sin sumar', obtenido: [obtenerSegundosPracticados(diaSiguientePausado, hoy, 'tecnica'), diaSiguientePausado.cronometroActivo], esperado: [300, null] },
    { descripcion: 'BOR-06: el mismo día no cambia nada', obtenido: mismoDia, esperado: corriendo },
    { descripcion: 'No modifica el estado original', obtenido: JSON.stringify(estado), esperado: copiaOriginal }
  ]);
}

probarCronometro();

// Tarea 8: Progreso (PRO-01 a PRO-09, BOR-07, BOR-08).
function registrarVarios(estado, sesiones) {
  return sesiones.reduce(
    (estadoActual, sesion) => registrarPractica(estadoActual, sesion[0], 'tecnica', sesion[1] * SEGUNDOS_POR_MINUTO),
    estado
  );
}

function probarProgreso() {
  const semanaPasada = crearSemanaDePrueba('2026-10-12', 630, [25, 50, 15]);
  const semanaActual = crearSemanaDePrueba('2026-10-19', 630, [25, 50, 15]);
  const soloActual = crearEstadoConSemanas([semanaActual]);
  const conPasada = crearEstadoConSemanas([semanaPasada, semanaActual]);

  // Meta diaria 90 min. Dom 18 cumplido; Lun 19 a Mié 21 cumplidos; Jue 22 (hoy) a medias.
  const estado = registrarVarios(conPasada, [
    ['2026-10-18', 90], ['2026-10-19', 90], ['2026-10-20', 90], ['2026-10-21', 95], ['2026-10-22', 45]
  ]);
  const hoyCumplido = registrarVarios(estado, [['2026-10-22', 45]]);
  const miercolesSinCumplir = registrarVarios(conPasada, [['2026-10-19', 90], ['2026-10-20', 90], ['2026-10-21', 89]]);
  const sinSemanaPasada = registrarVarios(soloActual, [['2026-10-18', 90], ['2026-10-19', 90]]);
  const parcial = registrarVarios(soloActual, [['2026-10-19', 90], ['2026-10-20', 45]]);
  const dias = obtenerDiasDeSemana(estado, '2026-10-19', '2026-10-22');
  const conMetaBajada = cambiarMetaSemanal(registrarVarios(soloActual, [['2026-10-19', 470]]), '2026-10-19', 420);

  probarGrupo('Progreso', [
    { descripcion: 'Color con 49 % → rojo', obtenido: obtenerColorDePorcentaje(49), esperado: 'rojo' },
    { descripcion: 'Color con 50 % → amarillo', obtenido: obtenerColorDePorcentaje(50), esperado: 'amarillo' },
    { descripcion: 'Color con 99 % → amarillo', obtenido: obtenerColorDePorcentaje(99), esperado: 'amarillo' },
    { descripcion: 'Color con 100 % → verde', obtenido: obtenerColorDePorcentaje(100), esperado: 'verde' },
    { descripcion: 'Color con 112 % → verde', obtenido: obtenerColorDePorcentaje(112), esperado: 'verde' },
    { descripcion: 'Porcentaje redondeado hacia abajo (89.6 de 90 → 99)', obtenido: calcularPorcentaje(89.6, 90), esperado: 99 },
    { descripcion: 'Total de la semana (Llevas 5:20)', obtenido: formatearMinutos(obtenerMinutosDeSemana(estado, '2026-10-19')), esperado: '5:20' },
    { descripcion: 'Porcentaje semanal (320 de 630 → 50)', obtenido: calcularPorcentajeSemanal(estado, '2026-10-19'), esperado: 50 },
    { descripcion: 'DIS-08: con la meta bajada pasa de 100 % (470 de 420 → 111)', obtenido: calcularPorcentajeSemanal(conMetaBajada, '2026-10-19'), esperado: 111 },
    {
      descripcion: 'Días: colores hasta hoy y futuros sin total ni color',
      obtenido: dias.map((dia) => [dia.minutos, dia.color]),
      esperado: [[90, 'verde'], [90, 'verde'], [95, 'verde'], [45, 'amarillo'], [null, null], [null, null], [null, null]]
    },
    { descripcion: 'Estimado: lunes sin días terminados → gris', obtenido: obtenerColorEstimadoSemanal(estado, '2026-10-19', '2026-10-19'), esperado: 'gris' },
    { descripcion: 'Estimado: solo días terminados (275 de 270 → verde)', obtenido: obtenerColorEstimadoSemanal(estado, '2026-10-19', '2026-10-22'), esperado: 'verde' },
    { descripcion: 'Estimado: 135 de 270 → 50 % amarillo', obtenido: obtenerColorEstimadoSemanal(parcial, '2026-10-19', '2026-10-22'), esperado: 'amarillo' },
    { descripcion: 'Racha: desde ayer, cruzando a la semana pasada (hoy sin cumplir)', obtenido: calcularRacha(estado, '2026-10-22'), esperado: 4 },
    { descripcion: 'Racha: hoy cuenta si ya cumplió', obtenido: calcularRacha(hoyCumplido, '2026-10-22'), esperado: 5 },
    { descripcion: 'Racha: un día sin cumplir la pone en 0', obtenido: calcularRacha(miercolesSinCumplir, '2026-10-22'), esperado: 0 },
    { descripcion: 'Racha: un día de una semana que no existe no cuenta', obtenido: calcularRacha(sinSemanaPasada, '2026-10-20'), esperado: 1 },
    { descripcion: 'Racha: sin práctica es 0', obtenido: calcularRacha(conPasada, '2026-10-22'), esperado: 0 },
    { descripcion: 'Semana anterior con datos', obtenido: obtenerMinutosSemanaAnterior(estado, '2026-10-19'), esperado: 90 },
    { descripcion: 'BOR-08: sin semana anterior → null (Sin datos)', obtenido: obtenerMinutosSemanaAnterior(soloActual, '2026-10-19'), esperado: null }
  ]);
}

probarProgreso();

// Tarea 11: Mensajes (CRO-08, CRO-16). Meta diaria 90 min; hoy es 2026-10-22.
function probarMensajes() {
  const soloActual = crearEstadoConSemanas([crearSemanaDePrueba('2026-10-19', 630, [25, 50, 15])]);
  const conMedia = registrarVarios(soloActual, [['2026-10-22', 45]]);
  const conSegundos = registrarPractica(soloActual, '2026-10-22', 'tecnica', 44 * SEGUNDOS_POR_MINUTO + 40);
  const cumplido = registrarVarios(soloActual, [['2026-10-22', 90]]);
  const conMetaBajada = cambiarMetaSemanal(registrarVarios(soloActual, [['2026-10-22', 80]]), '2026-10-19', 420);

  probarGrupo('Mensajes', [
    { descripcion: 'Sin práctica faltan 1:30', obtenido: formatearMinutos(calcularMinutosQueFaltanDelDia(soloActual, '2026-10-22')), esperado: '1:30' },
    { descripcion: 'Con 0:45 de 1:30 faltan 0:45', obtenido: formatearMinutos(calcularMinutosQueFaltanDelDia(conMedia, '2026-10-22')), esperado: '0:45' },
    { descripcion: 'Usa lo practicado redondeado (44 min 40 s → faltan 0:45, no 0:46)', obtenido: formatearMinutos(calcularMinutosQueFaltanDelDia(conSegundos, '2026-10-22')), esperado: '0:45' },
    { descripcion: 'Día cumplido: no falta nada', obtenido: calcularMinutosQueFaltanDelDia(cumplido, '2026-10-22'), esperado: 0 },
    { descripcion: 'Con la meta bajada por debajo de lo practicado no falta nada', obtenido: calcularMinutosQueFaltanDelDia(conMetaBajada, '2026-10-22'), esperado: 0 }
  ]);
}

probarMensajes();

mostrarResultados();
