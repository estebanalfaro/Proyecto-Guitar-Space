# Guitar-Space — Tasks

Estado: aprobado por el usuario (23-10-2026)
Referencias: `requirements.md`, `design.md`, `contrato de datos.md`.

## Reglas de trabajo

- La app se abre con doble clic en `src/index.html`, sin servidor ni instalación.
- Los JS se cargan con `<script>` en el orden de la estructura (sin `import`/`export`).
- Las tareas se hacen en orden. Una tarea se marca `[x]` solo cuando se cumple su "Hecho cuando".
- La lógica (tareas 2 a 8) se prueba en `pruebas.html` antes de pasar a la interfaz.

## Estructura de archivos

```
guitar-space/
├── README.md
├── claude.md
├── REFLECTION.md
├── docs/
│   ├── propuesta.md
│   ├── wireframe.png
│   ├── contrato de datos.md
│   ├── requirements.md
│   ├── design.md
│   └── tasks.md
└── src/
    ├── index.html
    ├── pruebas.html
    ├── estilos.css
    └── js/
        ├── formatos.js
        ├── almacenamiento.js
        ├── semanas.js
        ├── categorias.js
        ├── registros.js
        ├── cronometro.js
        ├── progreso.js
        ├── vista-principal.js
        ├── vista-configuracion.js
        ├── app.js
        └── pruebas.js
```

## Tareas

### 1. Estructura
- [x] Crear los archivos de la estructura, vacíos.
- [x] `index.html` carga `estilos.css` y los JS en orden (de `formatos.js` a `app.js`).
- [x] `pruebas.html` carga los JS de lógica (de `formatos.js` a `progreso.js`) y `pruebas.js`, y muestra cada prueba con ✓ o ✗.

**Hecho cuando:** `index.html` y `pruebas.html` abren con doble clic sin errores en la consola.

### 2. Formatos (GEN-03, GEN-04)
- [x] Convertir minutos a h:mm y segundos a h:mm:ss.
- [x] Convertir fechas entre AAAA-MM-DD y DD-MM-AAAA.
- [x] Obtener la fecha de hoy y el lunes de la semana de una fecha.

**Hecho cuando:** las pruebas de formatos pasan en `pruebas.html`.

### 3. Almacenamiento (GEN-01, GEN-02, GEN-07)
- [x] Leer y guardar el estado completo en localStorage según el contrato.
- [x] Crear los datos iniciales si no hay nada guardado.
- [x] No guardar valores calculados.

**Hecho cuando:** al borrar localStorage y recargar, se crean la meta 10:30 y las categorías 0:25 / 0:50 / 0:15.

### 4. Semanas y metas (SEM-01 a SEM-08)
- [x] Crear la semana actual si no existe, copiando la última semana guardada.
- [x] Calcular la meta diaria (meta semanal / 7, redondeada al minuto siguiente).
- [x] Cambiar la meta semanal de la semana actual y repartir los minutos en proporción (el minuto de redondeo va a la categoría más grande, con el desempate de BOR-04).
- [x] No modificar las semanas pasadas.
- [x] Validar la meta semanal: vacía o no entera, negativa, en 0 o con minutos fuera de 0 a 59 (BOR-01, BOR-02, BOR-10, DIS-21).

**Hecho cuando:** las pruebas pasan, incluido el ejemplo 600 → 1:26 diaria y 7 h → 17 / 33 / 10.

### 5. Categorías (CAT-01 a CAT-10, BOR-01 a BOR-04, BOR-10 a BOR-14)
- [x] Agregar una categoría con nombre, minutos por defecto y minutos diarios, con su ID generado del nombre (CAT-08).
- [x] Eliminar: marcar como inactiva, conservar su tiempo y repartir sus minutos en proporción (CAT-09, CAT-10).
- [x] Editar los minutos diarios con el ajuste en la categoría más grande (CAT-04) y el desempate (BOR-04).
- [x] Validar tiempos negativos, en 0, vacíos o no enteros (BOR-01, BOR-02, BOR-10) y el ajuste imposible (BOR-03).
- [x] Validar nombre vacío, nombre duplicado y eliminar la última categoría (BOR-11 a BOR-13).
- [x] Validar antes de guardar: si un valor se rechaza, no se modifica ningún dato guardado (BOR-14).

**Hecho cuando:** las pruebas de agregar, eliminar, ajuste, desempate y validaciones pasan.

### 6. Registros de práctica (CRO-04, CRO-05, CRO-11)
- [x] Sumar los segundos a un único registro por fecha y categoría.
- [x] Registrar solo en el día actual.

**Hecho cuando:** dos sesiones de la misma categoría en el mismo día quedan en un solo registro con la suma.

### 7. Cronómetro (CRO-01 a CRO-16, BOR-05, BOR-06, BOR-09)
- [x] Iniciar, pausar, detener y retomar, con un solo cronómetro activo.
- [x] Calcular el tiempo restante y detener solo al llegar a 0, sin tiempo extra (CRO-07).
- [x] Guardar al pausar, al detener y al cerrar la pestaña (`pagehide`), y dejarlo en pausa al volver, también si quedó guardado como "corriendo" (BOR-09).
- [x] Al empezar un día nuevo (a medianoche o al abrir la app otro día), guardar la sesión en su día y liberar el cronómetro (BOR-06).
- [x] Bloquear la configuración mientras haya un cronómetro activo (CRO-15).

**Hecho cuando:** las pruebas de estados pasan y, en prueba manual, cerrar la pestaña con el cronómetro corriendo conserva el tiempo.

### 8. Progreso (PRO-01 a PRO-09, BOR-07, BOR-08)
- [x] Porcentaje semanal.
- [x] Color por día y días futuros sin color.
- [x] Estimado semanal con días terminados, y gris si no hay ninguno.
- [x] Racha actual (hoy cuenta si ya cumplió) y reinicio al terminar un día sin cumplir.
- [x] Comparación con la semana anterior o "Sin datos".

**Hecho cuando:** las pruebas de colores (49 %, 50 %, 99 %, 100 %, 112 %) y de racha pasan.

### 9. Estilos base (DIS-01 a DIS-05, DIS-15)
- [x] Variables CSS con la paleta, la tipografía y el espaciado.
- [x] Estilos de tarjetas, botones de ícono, estado hover y deshabilitado.

**Hecho cuando:** los colores y tamaños coinciden con `design.md`.

### 10. Pantalla principal (DIS-06 a DIS-14)
- [x] Encabezado con racha y "⋯".
- [x] Tarjeta de resumen con círculo, semana, "Llevas" y semana anterior.
- [x] Fila de días y tarjeta "Hoy" con su barra.
- [x] Tarjetas de categoría con los 5 estados de DIS-14.
- [x] Botón "Terminar práctica".

**Hecho cuando:** la pantalla muestra los datos reales y cada estado se ve como en DIS-14.

### 11. Mensajes (DIS-11, DIS-18, DIS-19)
- [x] Mensaje "Aún te faltan h:mm": aparece al pausar o detener (también cuando se detiene solo al llegar a 0) y se oculta al iniciar, reanudar o cumplir la meta (CRO-08, CRO-16).

**Hecho cuando:** el mensaje aparece y desaparece en el momento correcto.

### 12. Configuración (DIS-16, DIS-17, DIS-20 a DIS-24, DIS-29, DIS-30)
- [x] Pantalla con "← Volver", campo de duración (horas y minutos de 0 a 59) y meta diaria calculada.
- [x] Lista de categorías activas con edición de minutos, suma y "Guardar cambios".
- [x] "+ Agregar categoría" y "¿Eliminar? Sí / No".
- [x] "⋯" deshabilitado con un cronómetro activo.
- [x] Errores de validación en rojo, debajo del campo, con los textos de DIS-17.
- [x] Ocultar el mensaje "Aún te faltan h:mm" al guardar un cambio válido en la configuración (CRO-16).

**Hecho cuando:** todos los cambios se guardan y se reflejan al volver a la pantalla principal, y cada error aparece y desaparece en el momento correcto.

### 13. Ventana (DIS-25 a DIS-28, DIS-31)
> Nota (24-10-2026): el usuario cambió la ventana a una sola columna centrada de 960 px, como el wireframe. DIS-13, DIS-20, DIS-25, DIS-26, DIS-28 y DIS-31 están actualizados en `design.md`. Los puntos de abajo describen la versión anterior, de dos columnas.

- [x] Toda la ventana, dos columnas y círculo de 160 px.
- [x] Columnas apiladas con menos de 900 px.
- [x] Scroll solo en la columna derecha cuando las categorías no caben.

**Hecho cuando:** se ve bien a pantalla completa y con la ventana angosta.

### 14. Verificación final
- [x] Revisar cada ID de `requirements.md` y `design.md`.
- [x] Probar los casos borde: primer uso, un cronómetro llegando a 0, medianoche, abrir la app otro día con un cronómetro en pausa, cerrar la pestaña con el cronómetro corriendo, cerrar el navegador de golpe, lunes sin días terminados y cambiar la meta a mitad de semana, agregar una categoría con nombre repetido y eliminar una categoría con tiempo practicado, e ingresar un valor inválido y comprobar que nada cambió (BOR-14).

**Hecho cuando:** todos los IDs están cumplidos y todas las pruebas de `pruebas.html` pasan.

### 15. Ajustes de diseño (DIS-02, DIS-03, DIS-08, DIS-09, DIS-13, DIS-20, DIS-25 a DIS-28, DIS-31 a DIS-33)
Pedidos por el usuario después de la verificación final (24-10-2026). Solo cambian `estilos.css` e `index.html`; la lógica no cambia.
- [x] Fondo carbón con brillos vino leves y dibujos en línea fina: pentagramas ondulados, guitarra, bajo, batería, saxofón y micrófono (DIS-02, DIS-32).
- [x] Tarjetas, botones y campos de vidrio translúcido; casillas de los días con su color marcado (DIS-09, DIS-33).
- [x] Círculo fino con extremos redondeados, brillo suave y número en trazo fino (DIS-08).
- [x] Títulos en mayúsculas con letras espaciadas (DIS-03).
- [x] Una sola columna centrada de 960 px como el wireframe, con "Terminar práctica" a la mitad del ancho y centrado (DIS-13, DIS-20, DIS-25 a DIS-28, DIS-31).

**Hecho cuando:** la app se ve como en `design.md` y `pruebas.html`, los casos borde de la Tarea 14 y las mediciones de la columna siguen pasando sin errores en la consola.
