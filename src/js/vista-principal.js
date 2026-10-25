// Pantalla principal (DIS-06 a DIS-14). Solo muestra datos y avisa a app.js de los clics.

const ABREVIATURAS_DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// CRO-14, DIS-14: botones de cada estado.
const BOTONES_POR_ESTADO = {
  sinIniciar: ['iniciar'],
  corriendo: ['pausar', 'detener'],
  pausado: ['iniciar', 'detener'],
  bloqueada: ['iniciar']
};

const BOTONES_CATEGORIA = {
  iniciar: { icono: '▶', etiqueta: 'Iniciar o reanudar' },
  pausar: { icono: '❚❚', etiqueta: 'Pausar' },
  detener: { icono: '■', etiqueta: 'Detener' }
};

// Las tarjetas solo se reconstruyen cuando cambia el estado de alguna categoría;
// cada segundo solo se actualiza el texto de los cronómetros.
let firmaCategorias = '';
const elementosCronometro = new Map();

function obtenerElemento(id) {
  return document.getElementById(id);
}

function crearElemento(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  elemento.className = clase;
  if (texto !== undefined) {
    elemento.textContent = texto;
  }
  return elemento;
}

function formatearRacha(racha) {
  return '🔥 Racha: ' + racha + (racha === 1 ? ' día' : ' días');
}

// DIS-06
function mostrarRacha(estado, fechaHoy) {
  obtenerElemento('insignia-racha').textContent = formatearRacha(calcularRacha(estado, fechaHoy));
}

// DIS-08, PRO-01, PRO-05, BOR-07: el anillo se llena hasta 100 % y muestra el número real.
function mostrarCirculo(estado, semana, fechaHoy) {
  const porcentaje = calcularPorcentajeSemanal(estado, semana.id);
  const anillo = obtenerElemento('anillo-progreso');
  const circunferencia = 2 * Math.PI * anillo.r.baseVal.value;
  const porcentajeVisible = Math.min(porcentaje, PORCENTAJE_COMPLETO);
  anillo.style.strokeDasharray = circunferencia;
  anillo.style.strokeDashoffset = circunferencia * (1 - porcentajeVisible / PORCENTAJE_COMPLETO);
  obtenerElemento('circulo-progreso').className =
    'circulo-progreso estado-' + obtenerColorEstimadoSemanal(estado, semana.id, fechaHoy);
  obtenerElemento('porcentaje-semanal').textContent = porcentaje + '%';
}

// DIS-07, SEM-03, PRO-02, PRO-09, BOR-08
function mostrarDatosResumen(estado, semana) {
  const minutosAnterior = obtenerMinutosSemanaAnterior(estado, semana.id);
  obtenerElemento('dato-semana').textContent =
    fechaGuardadaAVista(semana.fechaInicio) + ' al ' + fechaGuardadaAVista(semana.fechaFin);
  obtenerElemento('dato-llevas').textContent =
    formatearMinutos(obtenerMinutosDeSemana(estado, semana.id)) + ' de ' + formatearMinutos(semana.metaSemanalMinutos);
  obtenerElemento('dato-semana-anterior').textContent =
    minutosAnterior === null ? 'Sin datos' : formatearMinutos(minutosAnterior);
}

// DIS-09, PRO-03, PRO-04: los días futuros van en gris con "-".
function crearCasillaDia(dia, indice, fechaHoy) {
  const color = dia.color === null ? COLORES_PROGRESO.gris : dia.color;
  const claseHoy = dia.fecha === fechaHoy ? ' casilla-hoy' : '';
  const casilla = crearElemento('div', 'casilla-dia estado-' + color + claseHoy);
  casilla.append(
    crearElemento('span', '', ABREVIATURAS_DIAS[indice]),
    crearElemento('strong', '', dia.minutos === null ? '-' : formatearMinutos(dia.minutos))
  );
  return casilla;
}

function mostrarFilaDias(estado, semana, fechaHoy) {
  const casillas = obtenerDiasDeSemana(estado, semana.id, fechaHoy)
    .map((dia, indice) => crearCasillaDia(dia, indice, fechaHoy));
  obtenerElemento('fila-dias').replaceChildren(...casillas);
}

// DIS-10
function mostrarHoy(estado, semana, fechaHoy) {
  const metaDiaria = calcularMetaDiaria(semana.metaSemanalMinutos);
  const minutosHoy = obtenerMinutosDelDia(estado, fechaHoy);
  const porcentajeHoy = Math.min(calcularPorcentaje(minutosHoy, metaDiaria), PORCENTAJE_COMPLETO);
  const barra = obtenerElemento('barra-hoy');
  obtenerElemento('titulo-hoy').textContent = 'Hoy ' + fechaGuardadaAVista(fechaHoy);
  obtenerElemento('progreso-hoy').textContent = formatearMinutos(minutosHoy) + ' de ' + formatearMinutos(metaDiaria);
  barra.className = 'barra-relleno estado-' + obtenerColorDelDia(estado, fechaHoy);
  barra.style.width = porcentajeHoy + '%';
}

// DIS-11, CRO-08, CRO-16: visible si se activó al pausar o detener y el día aún no está cumplido.
function mostrarMensajeFaltan(estado, fechaHoy, mensajeFaltanActivo) {
  const mensaje = obtenerElemento('mensaje-faltan');
  mensaje.hidden = !mensajeFaltanActivo || estaDiaCumplido(estado, fechaHoy);
  mensaje.textContent = '⚠ Aún te faltan ' + formatearMinutos(calcularMinutosQueFaltanDelDia(estado, fechaHoy));
}

function obtenerDatosCategorias(estado, semana, fechaHoy) {
  return semana.minutosDiariosPorCategoria.map((item) => {
    const categoria = estado.categorias.find((elemento) => elemento.id === item.categoriaId);
    return {
      id: categoria.id,
      nombre: categoria.nombre,
      meta: item.minutos,
      porDefecto: categoria.minutosPorDefecto,
      estado: obtenerEstadoCategoria(estado, fechaHoy, categoria.id),
      segundosRestantes: calcularSegundosRestantes(estado, fechaHoy, categoria.id)
    };
  });
}

// DIS-12, CAT-02, CAT-06: "Meta 0:25 · Por defecto 0:25 · En pausa".
function crearDetalleCategoria(datos) {
  const partes = ['Meta ' + formatearMinutos(datos.meta), 'Por defecto ' + formatearMinutos(datos.porDefecto)];
  if (datos.estado === ESTADOS_CATEGORIA.pausado) {
    partes.push('En pausa');
  }
  return crearElemento('div', 'texto-secundario', partes.join(' · '));
}

function crearBotonCategoria(accion, datos) {
  const boton = crearElemento('button', 'boton-icono', BOTONES_CATEGORIA[accion].icono);
  boton.type = 'button';
  boton.dataset.accion = accion;
  boton.dataset.categoria = datos.id;
  boton.setAttribute('aria-label', BOTONES_CATEGORIA[accion].etiqueta + ' ' + datos.nombre);
  boton.disabled = datos.estado === ESTADOS_CATEGORIA.bloqueada;
  return boton;
}

// DIS-12, DIS-14, CRO-12, CRO-14
function crearControlesCategoria(datos) {
  const controles = crearElemento('div', 'controles-categoria');
  if (datos.estado === ESTADOS_CATEGORIA.cumplida) {
    controles.append(crearElemento('span', 'insignia-cumplida', '✓ Cumplida'));
    return controles;
  }
  const cronometro = crearElemento('span', 'cronometro');
  elementosCronometro.set(datos.id, cronometro);
  controles.append(cronometro, ...BOTONES_POR_ESTADO[datos.estado].map((accion) => crearBotonCategoria(accion, datos)));
  return controles;
}

function crearTarjetaCategoria(datos) {
  const tarjeta = crearElemento('div', 'tarjeta tarjeta-categoria categoria-' + datos.estado);
  const informacion = crearElemento('div', 'informacion-categoria');
  informacion.append(crearElemento('strong', '', datos.nombre), crearDetalleCategoria(datos));
  tarjeta.append(informacion, crearControlesCategoria(datos));
  return tarjeta;
}

function mostrarCategorias(estado, semana, fechaHoy) {
  const datosCategorias = obtenerDatosCategorias(estado, semana, fechaHoy);
  const firmaNueva = JSON.stringify(datosCategorias.map((datos) => [datos.id, datos.meta, datos.porDefecto, datos.estado]));
  if (firmaNueva !== firmaCategorias) {
    firmaCategorias = firmaNueva;
    elementosCronometro.clear();
    obtenerElemento('lista-categorias').replaceChildren(...datosCategorias.map(crearTarjetaCategoria));
  }
  datosCategorias
    .filter((datos) => elementosCronometro.has(datos.id))
    .forEach((datos) => {
      elementosCronometro.get(datos.id).textContent = formatearSegundos(datos.segundosRestantes);
    });
}

// DIS-13, CRO-13
function mostrarBotonTerminar(estado) {
  obtenerElemento('boton-terminar').disabled = !hayCronometroActivo(estado);
}

// DIS-24, CRO-15
function mostrarBotonMenu(estado) {
  obtenerElemento('boton-menu').disabled = hayCronometroActivo(estado);
}

function mostrarPantallaPrincipal(estado, fechaHoy, mensajeFaltanActivo) {
  const semana = obtenerSemana(estado, obtenerLunesDeSemana(fechaHoy));
  mostrarRacha(estado, fechaHoy);
  mostrarCirculo(estado, semana, fechaHoy);
  mostrarDatosResumen(estado, semana);
  mostrarFilaDias(estado, semana, fechaHoy);
  mostrarHoy(estado, semana, fechaHoy);
  mostrarMensajeFaltan(estado, fechaHoy, mensajeFaltanActivo);
  mostrarCategorias(estado, semana, fechaHoy);
  mostrarBotonTerminar(estado);
  mostrarBotonMenu(estado);
}

// acciones: { iniciar, pausar, detener, terminar, abrirConfiguracion } definidas en app.js.
function configurarEventosPantallaPrincipal(acciones) {
  obtenerElemento('lista-categorias').addEventListener('click', (evento) => {
    const boton = evento.target.closest('button[data-accion]');
    if (boton !== null) {
      acciones[boton.dataset.accion](boton.dataset.categoria);
    }
  });
  obtenerElemento('boton-terminar').addEventListener('click', acciones.terminar);
  obtenerElemento('boton-menu').addEventListener('click', acciones.abrirConfiguracion);
}
