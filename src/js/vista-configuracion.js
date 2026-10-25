// Pantalla de configuración (DIS-16, DIS-17, DIS-20 a DIS-23, DIS-29, DIS-30).
// Solo muestra datos, lee lo que el usuario escribe y muestra los errores. app.js valida y guarda.
// Usa obtenerElemento y crearElemento de vista-principal.js.

// Bloques de DIS-16: un error de botón desaparece al cambiar cualquier campo de su bloque.
const BLOQUES_CONFIGURACION = {
  meta: 'meta',
  categorias: 'categorias',
  agregar: 'agregar'
};

// Claves de los errores. 'nombre', 'agregar' y 'guardar' coinciden con el campo que devuelve la lógica.
const CLAVES_CONFIGURACION = {
  meta: 'meta',
  guardar: 'guardar',
  nombre: 'nombre',
  porDefecto: 'por-defecto',
  diarios: 'diarios',
  agregar: 'agregar'
};

const TIPOS_ERROR = {
  campo: 'campo',
  boton: 'boton'
};

const PARTES_DURACION = {
  horas: 'horas',
  minutos: 'minutos'
};

// Meta diaria guardada de la semana que se configura (DIS-23: "Suma: 1:30 de 1:30").
let metaDiariaConfigurada = 0;
// DIS-30: solo una fila puede estar en "¿Eliminar? Sí / No" a la vez.
let categoriaEnConfirmacion = null;

function crearClaveMinutos(categoriaId) {
  return 'minutos-' + categoriaId;
}

function crearClaveEliminar(categoriaId) {
  return 'eliminar-' + categoriaId;
}

function buscarEnConfiguracion(selector) {
  return obtenerElemento('vista-configuracion').querySelector(selector);
}

// DIS-16: el error va debajo del campo o del botón que lo causó.
function crearError(clave, bloque, tipo) {
  const error = crearElemento('div', 'mensaje-error');
  error.hidden = true;
  error.dataset.error = clave;
  error.dataset.bloque = bloque;
  error.dataset.tipo = tipo;
  return error;
}

function crearCasillaNumero(clave, bloque, parte, valor) {
  const casilla = crearElemento('input', 'casilla-numero');
  casilla.type = 'number';
  casilla.min = '0';
  casilla.step = '1';
  if (parte === PARTES_DURACION.minutos) {
    casilla.max = String(MINUTOS_POR_HORA - 1);
  }
  casilla.value = valor;
  casilla.dataset.clave = clave;
  casilla.dataset.bloque = bloque;
  casilla.dataset.parte = parte;
  casilla.setAttribute('aria-label', parte === PARTES_DURACION.horas ? 'Horas' : 'Minutos');
  return casilla;
}

// DIS-21: dos casillas, horas y minutos, en formato h:mm (SEM-04). Sin minutos, las casillas empiezan vacías.
function crearCampoDuracion(clave, bloque, minutosGuardados) {
  const tieneValor = minutosGuardados !== null;
  const horas = tieneValor ? String(Math.floor(minutosGuardados / MINUTOS_POR_HORA)) : '';
  const minutos = tieneValor ? String(minutosGuardados % MINUTOS_POR_HORA) : '';
  const campo = crearElemento('div', '');
  const casillas = crearElemento('div', 'campo-duracion');
  casillas.append(
    crearCasillaNumero(clave, bloque, PARTES_DURACION.horas, horas),
    crearElemento('span', '', ':'),
    crearCasillaNumero(clave, bloque, PARTES_DURACION.minutos, minutos)
  );
  campo.append(casillas, crearError(clave, bloque, TIPOS_ERROR.campo));
  return campo;
}

function leerCasilla(clave, parte) {
  return buscarEnConfiguracion(
    'input[data-clave="' + CSS.escape(clave) + '"][data-parte="' + parte + '"]'
  ).value;
}

function leerDuracion(clave) {
  return {
    clave,
    horas: leerCasilla(clave, PARTES_DURACION.horas),
    minutos: leerCasilla(clave, PARTES_DURACION.minutos)
  };
}

// DIS-22: la meta diaria se recalcula si lo escrito es válido; si no, queda el último valor válido.
function actualizarMetaDiaria() {
  const duracion = leerDuracion(CLAVES_CONFIGURACION.meta);
  const resultado = validarDuracion(duracion.horas, duracion.minutos, false);
  if (resultado.error === undefined) {
    obtenerElemento('meta-diaria').textContent = 'Meta diaria: ' + formatearMinutos(calcularMetaDiaria(resultado.minutos));
  }
}

function leerMinutosCategorias() {
  return Array.from(obtenerElemento('filas-categorias').querySelectorAll('.fila-configuracion'))
    .map((fila) => ({ categoriaId: fila.dataset.categoria, ...leerDuracion(crearClaveMinutos(fila.dataset.categoria)) }));
}

// DIS-23: la suma compara lo escrito con la meta diaria guardada y se recalcula como en DIS-22.
function actualizarSuma() {
  const resultados = leerMinutosCategorias()
    .map((campo) => validarDuracion(campo.horas, campo.minutos, true));
  if (resultados.some((resultado) => resultado.error !== undefined)) {
    return;
  }
  const suma = resultados.reduce((total, resultado) => total + resultado.minutos, 0);
  obtenerElemento('suma-categorias').textContent =
    'Suma: ' + formatearMinutos(suma) + ' de ' + formatearMinutos(metaDiariaConfigurada);
}

function crearBotonConfiguracion(texto, accion, categoriaId) {
  const boton = crearElemento('button', 'boton-texto', texto);
  boton.type = 'button';
  boton.dataset.accionConfiguracion = accion;
  if (categoriaId !== undefined) {
    boton.dataset.categoria = categoriaId;
  }
  return boton;
}

// DIS-30: "Eliminar" o "¿Eliminar? Sí / No" en la misma fila.
function crearBotonesEliminar(categoriaId) {
  if (categoriaId !== categoriaEnConfirmacion) {
    return [crearBotonConfiguracion('Eliminar', 'eliminar', categoriaId)];
  }
  return [
    crearElemento('span', '', '¿Eliminar?'),
    crearBotonConfiguracion('Sí', 'confirmar-eliminar', categoriaId),
    crearBotonConfiguracion('No', 'cancelar-eliminar', categoriaId)
  ];
}

function actualizarBotonesEliminar() {
  obtenerElemento('filas-categorias').querySelectorAll('.acciones-eliminar').forEach((acciones) => {
    acciones.replaceChildren(...crearBotonesEliminar(acciones.dataset.categoria));
  });
}

// DIS-23, CAT-03, CAT-06: nombre (solo lectura), minutos diarios, "Por defecto 0:25" y "Eliminar".
function crearFilaCategoria(datos) {
  const fila = crearElemento('div', 'fila-configuracion');
  const eliminar = crearElemento('div', '');
  const acciones = crearElemento('div', 'acciones-eliminar');
  fila.dataset.categoria = datos.id;
  acciones.dataset.categoria = datos.id;
  acciones.append(...crearBotonesEliminar(datos.id));
  eliminar.append(acciones, crearError(crearClaveEliminar(datos.id), BLOQUES_CONFIGURACION.categorias, TIPOS_ERROR.boton));
  fila.append(
    crearElemento('strong', 'nombre-configuracion alineado-con-campo', datos.nombre),
    crearCampoDuracion(crearClaveMinutos(datos.id), BLOQUES_CONFIGURACION.categorias, datos.minutos),
    crearElemento('span', 'texto-secundario alineado-con-campo', 'Por defecto ' + formatearMinutos(datos.porDefecto)),
    eliminar
  );
  return fila;
}

function obtenerDatosConfiguracion(estado, semana) {
  return semana.minutosDiariosPorCategoria.map((item) => {
    const categoria = estado.categorias.find((elemento) => elemento.id === item.categoriaId);
    return { id: categoria.id, nombre: categoria.nombre, minutos: item.minutos, porDefecto: categoria.minutosPorDefecto };
  });
}

function crearCampoConEtiqueta(etiqueta, campo) {
  const contenedor = crearElemento('div', '');
  contenedor.append(crearElemento('div', 'texto-secundario', etiqueta), campo);
  return contenedor;
}

function crearCampoNombre() {
  const campo = crearElemento('div', '');
  const casilla = crearElemento('input', '');
  casilla.type = 'text';
  casilla.dataset.clave = CLAVES_CONFIGURACION.nombre;
  casilla.dataset.bloque = BLOQUES_CONFIGURACION.agregar;
  casilla.setAttribute('aria-label', 'Nombre');
  campo.append(casilla, crearError(CLAVES_CONFIGURACION.nombre, BLOQUES_CONFIGURACION.agregar, TIPOS_ERROR.campo));
  return campo;
}

// DIS-29, CAT-08: nombre, minutos por defecto, minutos diarios y "Agregar".
function abrirFilaAgregar() {
  const fila = crearElemento('div', 'fila-configuracion');
  const botonAgregar = crearElemento('div', '');
  botonAgregar.append(
    crearBotonConfiguracion('Agregar', 'agregar'),
    crearError(CLAVES_CONFIGURACION.agregar, BLOQUES_CONFIGURACION.agregar, TIPOS_ERROR.boton)
  );
  fila.append(
    crearCampoConEtiqueta('Nombre', crearCampoNombre()),
    crearCampoConEtiqueta('Minutos por defecto', crearCampoDuracion(CLAVES_CONFIGURACION.porDefecto, BLOQUES_CONFIGURACION.agregar, null)),
    crearCampoConEtiqueta('Minutos diarios', crearCampoDuracion(CLAVES_CONFIGURACION.diarios, BLOQUES_CONFIGURACION.agregar, null)),
    botonAgregar
  );
  obtenerElemento('fila-agregar').replaceChildren(fila);
  obtenerElemento('fila-agregar').hidden = false;
  obtenerElemento('boton-abrir-agregar').hidden = true;
}

function cerrarFilaAgregar() {
  obtenerElemento('fila-agregar').replaceChildren();
  obtenerElemento('fila-agregar').hidden = true;
  obtenerElemento('boton-abrir-agregar').hidden = false;
}

// DIS-20: muestra toda la configuración con los datos guardados de la semana.
function mostrarConfiguracion(estado, semana) {
  metaDiariaConfigurada = calcularMetaDiaria(semana.metaSemanalMinutos);
  categoriaEnConfirmacion = null;
  obtenerElemento('campo-meta').replaceChildren(
    crearCampoDuracion(CLAVES_CONFIGURACION.meta, BLOQUES_CONFIGURACION.meta, semana.metaSemanalMinutos)
  );
  obtenerElemento('filas-categorias').replaceChildren(...obtenerDatosConfiguracion(estado, semana).map(crearFilaCategoria));
  obtenerElemento('error-guardar').replaceChildren(
    crearError(CLAVES_CONFIGURACION.guardar, BLOQUES_CONFIGURACION.categorias, TIPOS_ERROR.boton)
  );
  cerrarFilaAgregar();
  actualizarMetaDiaria();
  actualizarSuma();
}

// DIS-20: la configuración reemplaza a toda la pantalla principal.
function cambiarVista(configuracionVisible) {
  obtenerElemento('vista-principal').hidden = configuracionVisible;
  obtenerElemento('vista-configuracion').hidden = !configuracionVisible;
}

// DIS-16, DIS-17: errores en rojo debajo del campo o del botón. errores: [{ clave, texto }].
function mostrarErroresConfiguracion(errores) {
  errores.forEach((error) => {
    const elemento = buscarEnConfiguracion('[data-error="' + CSS.escape(error.clave) + '"]');
    elemento.textContent = error.texto;
    elemento.hidden = false;
  });
}

function ocultarErrores(selector) {
  obtenerElemento('vista-configuracion').querySelectorAll(selector).forEach((error) => {
    error.hidden = true;
  });
}

// DIS-16: el error del campo y los errores de botón de su bloque desaparecen al cambiar el campo.
// DIS-22, DIS-23: la meta diaria y la suma se recalculan mientras se escribe.
function responderAlEscribir(evento) {
  const { clave, bloque } = evento.target.dataset;
  ocultarErrores('[data-error="' + CSS.escape(clave) + '"]');
  ocultarErrores('[data-bloque="' + bloque + '"][data-tipo="' + TIPOS_ERROR.boton + '"]');
  if (bloque === BLOQUES_CONFIGURACION.meta) {
    actualizarMetaDiaria();
  }
  if (bloque === BLOQUES_CONFIGURACION.categorias) {
    actualizarSuma();
  }
}

function leerFilaAgregar() {
  return {
    nombre: buscarEnConfiguracion('input[data-clave="' + CLAVES_CONFIGURACION.nombre + '"]').value,
    porDefecto: leerDuracion(CLAVES_CONFIGURACION.porDefecto),
    diarios: leerDuracion(CLAVES_CONFIGURACION.diarios)
  };
}

// DIS-30: cambia la fila a "¿Eliminar? Sí / No"; con "No" vuelve a "Eliminar" y quita su error.
function cambiarConfirmacionEliminar(categoriaId) {
  if (categoriaEnConfirmacion !== null) {
    ocultarErrores('[data-error="' + CSS.escape(crearClaveEliminar(categoriaEnConfirmacion)) + '"]');
  }
  categoriaEnConfirmacion = categoriaId;
  actualizarBotonesEliminar();
}

// acciones: { volver, guardarMeta, guardarMinutos, agregar, eliminar } definidas en app.js.
function configurarEventosConfiguracion(acciones) {
  const vista = obtenerElemento('vista-configuracion');
  const accionesDeBotones = {
    'eliminar': (boton) => cambiarConfirmacionEliminar(boton.dataset.categoria),
    'cancelar-eliminar': () => cambiarConfirmacionEliminar(null),
    'confirmar-eliminar': (boton) => acciones.eliminar(boton.dataset.categoria),
    'agregar': () => acciones.agregar(leerFilaAgregar())
  };
  obtenerElemento('boton-volver').addEventListener('click', acciones.volver);
  obtenerElemento('boton-guardar-meta').addEventListener('click', () => acciones.guardarMeta(leerDuracion(CLAVES_CONFIGURACION.meta)));
  obtenerElemento('boton-guardar-minutos').addEventListener('click', () => acciones.guardarMinutos(leerMinutosCategorias()));
  obtenerElemento('boton-abrir-agregar').addEventListener('click', abrirFilaAgregar);
  vista.addEventListener('input', responderAlEscribir);
  vista.addEventListener('click', (evento) => {
    const boton = evento.target.closest('button[data-accion-configuracion]');
    if (boton !== null) {
      accionesDeBotones[boton.dataset.accionConfiguracion](boton);
    }
  });
}
