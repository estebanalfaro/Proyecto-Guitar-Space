// Coordina la app: carga el estado, lleva la sesión del cronómetro y responde a los eventos.
// (SEM-02, SEM-04, CRO-03 a CRO-08, CRO-13, CRO-15, CRO-16, CAT-03 a CAT-10, BOR-01 a BOR-14)

const INTERVALO_CONTEO_MILISEGUNDOS = 1000;

let estadoApp = null;
let fechaActual = null;
// Sesión en curso del cronómetro que está corriendo: { inicioMilisegundos, segundosRestantesAlIniciar }.
let sesionActual = null;
// CRO-08, CRO-16: el mensaje "Aún te faltan h:mm" vive solo en memoria (GEN-07).
// Se activa al pausar o detener y no aparece al abrir la app (contrato).
let mensajeFaltanActivo = false;
// DIS-20: si la pantalla de configuración está abierta.
let configuracionAbierta = false;

function obtenerSegundosSesionActual() {
  if (sesionActual === null) {
    return 0;
  }
  const transcurridos = calcularSegundosTranscurridos(sesionActual.inicioMilisegundos, Date.now());
  return calcularSegundosSesion(sesionActual.segundosRestantesAlIniciar, transcurridos);
}

// Para mostrar, la sesión en curso se suma a lo guardado sin guardarla (GEN-07).
function obtenerEstadoParaMostrar() {
  const activo = estadoApp.cronometroActivo;
  if (sesionActual === null) {
    return estadoApp;
  }
  return registrarPractica(estadoApp, activo.fecha, activo.categoriaId, obtenerSegundosSesionActual());
}

function mostrar() {
  mostrarPantallaPrincipal(obtenerEstadoParaMostrar(), fechaActual, mensajeFaltanActivo);
}

function guardarYMostrar(nuevoEstado) {
  estadoApp = nuevoEstado;
  guardarEstado(estadoApp);
  mostrar();
}

// CRO-01, CRO-02, CRO-06, CRO-16
function iniciar(categoriaId) {
  const nuevoEstado = iniciarCronometro(estadoApp, fechaActual, categoriaId);
  if (nuevoEstado === estadoApp) {
    return;
  }
  mensajeFaltanActivo = false;
  sesionActual = {
    inicioMilisegundos: Date.now(),
    segundosRestantesAlIniciar: calcularSegundosRestantes(estadoApp, fechaActual, categoriaId)
  };
  guardarYMostrar(nuevoEstado);
}

// Cierra la sesión en curso y devuelve el estado con la acción del cronómetro aplicada.
function cerrarSesion(accionCronometro) {
  const segundosSesion = obtenerSegundosSesionActual();
  sesionActual = null;
  return accionCronometro(estadoApp, segundosSesion);
}

// CRO-04, CRO-08
function pausar() {
  mensajeFaltanActivo = true;
  guardarYMostrar(cerrarSesion(pausarCronometro));
}

// CRO-05, CRO-07, CRO-08, CRO-13
function detener() {
  mensajeFaltanActivo = true;
  guardarYMostrar(cerrarSesion(detenerCronometro));
}

// BOR-06, SEM-02: a medianoche guarda la sesión en su día, libera el cronómetro y crea la semana si hace falta.
// El mensaje "Aún te faltan h:mm" se oculta en el día nuevo (contrato).
// DIS-20: si empieza otra semana con la configuración abierta, se vuelve a mostrar con la semana nueva.
function revisarCambioDeDia() {
  const fechaHoy = obtenerFechaHoy();
  if (fechaHoy === fechaActual) {
    return;
  }
  const semanaAnteriorId = obtenerSemanaActualId();
  const segundosSesion = obtenerSegundosSesionActual();
  sesionActual = null;
  mensajeFaltanActivo = false;
  fechaActual = fechaHoy;
  estadoApp = crearSemanaActual(liberarCronometroDeDiaAnterior(estadoApp, fechaHoy, segundosSesion), fechaHoy);
  guardarEstado(estadoApp);
  if (configuracionAbierta && obtenerSemanaActualId() !== semanaAnteriorId) {
    mostrarConfiguracionActual();
  }
}

// CRO-03, CRO-07: cada segundo actualiza la pantalla y detiene al llegar a 0.
function contarSegundo() {
  revisarCambioDeDia();
  if (sesionActual !== null) {
    const transcurridos = calcularSegundosTranscurridos(sesionActual.inicioMilisegundos, Date.now());
    if (haLlegadoACero(sesionActual.segundosRestantesAlIniciar, transcurridos)) {
      detener();
      return;
    }
  }
  mostrar();
}

function obtenerSemanaActualId() {
  return obtenerLunesDeSemana(fechaActual);
}

function mostrarConfiguracionActual() {
  mostrarConfiguracion(estadoApp, obtenerSemana(estadoApp, obtenerSemanaActualId()));
}

// DIS-20, CRO-15: "⋯" solo está habilitado sin un cronómetro activo (DIS-24).
function abrirConfiguracion() {
  configuracionAbierta = true;
  mostrarConfiguracionActual();
  cambiarVista(true);
}

// DIS-20: "← Volver" descarta lo que no se guardó y muestra la principal actualizada.
function volver() {
  configuracionAbierta = false;
  cambiarVista(false);
  mostrar();
}

// CRO-16, DIS-20: guarda un cambio válido, oculta el mensaje y vuelve a mostrar toda la configuración.
function guardarCambioConfiguracion(nuevoEstado) {
  mensajeFaltanActivo = false;
  estadoApp = nuevoEstado;
  guardarEstado(estadoApp);
  mostrarConfiguracionActual();
}

// BOR-14: si la lógica rechaza el cambio, muestra el error y no guarda nada.
function aplicarResultadoConfiguracion(resultado, claveError) {
  if (resultado.error !== undefined) {
    mostrarErroresConfiguracion([{ clave: claveError, texto: resultado.error }]);
    return;
  }
  guardarCambioConfiguracion(resultado.estado);
}

// DIS-16, DIS-21, BOR-01, BOR-02, BOR-10: valida todos los campos de duración a la vez.
// campos: [{ clave, horas, minutos }]. Devuelve los errores y los minutos de cada campo.
function validarCampos(campos, permiteCero) {
  const resultados = campos.map((campo) => validarDuracion(campo.horas, campo.minutos, permiteCero));
  return {
    errores: resultados
      .map((resultado, indice) => ({ clave: campos[indice].clave, texto: resultado.error }))
      .filter((error) => error.texto !== undefined),
    minutos: resultados.map((resultado) => resultado.minutos)
  };
}

// DIS-22, SEM-04, SEM-06, SEM-08
function guardarMeta(campoMeta) {
  const validacion = validarCampos([campoMeta], false);
  if (validacion.errores.length > 0) {
    mostrarErroresConfiguracion(validacion.errores);
    return;
  }
  guardarCambioConfiguracion(cambiarMetaSemanal(estadoApp, obtenerSemanaActualId(), validacion.minutos[0]));
}

// DIS-23, CAT-03, CAT-04, BOR-03. campos: [{ clave, categoriaId, horas, minutos }].
function guardarMinutos(campos) {
  const validacion = validarCampos(campos, true);
  if (validacion.errores.length > 0) {
    mostrarErroresConfiguracion(validacion.errores);
    return;
  }
  const minutosPorCategoria = campos.map((campo, indice) => ({
    categoriaId: campo.categoriaId,
    minutos: validacion.minutos[indice]
  }));
  const resultado = editarMinutosDiarios(estadoApp, obtenerSemanaActualId(), minutosPorCategoria);
  aplicarResultadoConfiguracion(resultado, resultado.campo);
}

// DIS-29, CAT-08, CAT-04, BOR-03, BOR-11, BOR-12. Con duraciones inválidas también muestra el error del nombre.
function agregar(fila) {
  const validacion = validarCampos([fila.porDefecto, fila.diarios], true);
  if (validacion.errores.length > 0) {
    const errorNombre = validarNombreCategoria(fila.nombre, estadoApp.categorias);
    const errorDelNombre = errorNombre === null ? [] : [{ clave: CLAVES_CONFIGURACION.nombre, texto: errorNombre }];
    mostrarErroresConfiguracion([...errorDelNombre, ...validacion.errores]);
    return;
  }
  const [minutosPorDefecto, minutosDiarios] = validacion.minutos;
  const resultado = agregarCategoria(estadoApp, obtenerSemanaActualId(), fila.nombre, minutosPorDefecto, minutosDiarios);
  aplicarResultadoConfiguracion(resultado, resultado.campo);
}

// DIS-30, CAT-09, CAT-10, BOR-13
function eliminar(categoriaId) {
  const resultado = eliminarCategoria(estadoApp, obtenerSemanaActualId(), categoriaId);
  aplicarResultadoConfiguracion(resultado, crearClaveEliminar(categoriaId));
}

// BOR-05: al cerrar la pestaña con el cronómetro corriendo, guarda la sesión y lo deja en pausa.
// No activa el mensaje: al volver a abrir la app no aparece (contrato).
function guardarAlCerrar() {
  if (sesionActual !== null) {
    guardarYMostrar(cerrarSesion(pausarCronometro));
  }
}

// GEN-02, SEM-02, BOR-09, BOR-06: prepara el estado al abrir la app.
function iniciarApp() {
  fechaActual = obtenerFechaHoy();
  const estadoAlAbrir = pausarCronometroAlAbrir(cargarEstado());
  const estadoDelDia = liberarCronometroDeDiaAnterior(estadoAlAbrir, fechaActual, 0);
  estadoApp = crearSemanaActual(estadoDelDia, fechaActual);
  guardarEstado(estadoApp);
  configurarEventosPantallaPrincipal({ iniciar, pausar, detener, terminar: detener, abrirConfiguracion });
  configurarEventosConfiguracion({ volver, guardarMeta, guardarMinutos, agregar, eliminar });
  window.addEventListener('pagehide', guardarAlCerrar);
  setInterval(contarSegundo, INTERVALO_CONTEO_MILISEGUNDOS);
  mostrar();
}

iniciarApp();
