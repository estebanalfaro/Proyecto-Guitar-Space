# Guitar-Space — Design

Estado: aprobado por el usuario (23-10-2026). Última actualización: 24-10-2026.
Referencias: `requirements.md` (IDs entre paréntesis), `contrato de datos.md`, wireframe de ejemplo.
Uso: solo computadora.

> **Nota sobre los IDs.** Cada ID va en la sección de su tema. Los IDs no se renumeran, porque el código y los demás documentos los citan; por eso los que se agregaron después (DIS-29 a DIS-33) no quedan en orden. DIS-28 ya no aplica, pero se conserva para no romper las referencias.

| Sección | IDs |
|---|---|
| 1. Estilo general | DIS-01 a DIS-05, DIS-32, DIS-33 |
| 2. Pantalla principal | DIS-06 a DIS-13 |
| 3. Estados visuales | DIS-14, DIS-15 |
| 4. Mensajes y avisos | DIS-16 a DIS-19 |
| 5. Configuración | DIS-20 a DIS-24, DIS-29, DIS-30 |
| 6. Ventana | DIS-25 a DIS-28, DIS-31 |

## 1. Estilo general

- **DIS-01** Solo tema oscuro.
- **DIS-02** Paleta de colores:

| Uso | Color | Fondo suave |
|---|---|---|
| Fondo de la app | Carbón `#141414`, con brillos vino y los dibujos de DIS-32 | — |
| Tarjetas y botones | `#222222` al 18 %, borde `#F2F2F2` al 10 % (DIS-33) | — |
| Texto principal / secundario | `#F2F2F2` / `#A0A0A0` | — |
| Verde (meta cumplida) | `#22C55E` | `#14301C` |
| Amarillo (de 50 % a 99 %) | `#F5B921` | `#3A2A0A` |
| Rojo (menos de 50 %) | `#EF4444` | `#3A1414` |
| Azul (racha, cronómetro corriendo) | `#3B82F6` | `#0F2A4A` |
| Gris (círculo sin datos, días futuros) | `#4A4A4A` | — |

- **DIS-03** Tipografía: la fuente del sistema, sin fuentes externas. Los cronómetros usan una fuente monoespaciada. Los títulos ("Guitar-Space" y "Configuración") van en mayúsculas, con letras espaciadas (0.12 em) y peso 800. Tamaños: título 18 px, texto 14 px, texto secundario 12 px, porcentaje del círculo 28 px, cronómetro 18 px.
- **DIS-04** Espaciado en múltiplos de 8 px. Las tarjetas llevan un borde de 1 px y esquinas redondeadas de 8 px.
- **DIS-05** El color nunca va solo: siempre lleva un texto o un número al lado.
- **DIS-32 Fondo musical.** El fondo es gris carbón `#141414`, con dos brillos vino muy leves (degradados radiales que llegan al 55 % de la pantalla): arriba a la izquierda `rgba(130, 30, 60, 0.22)` y abajo a la derecha `rgba(110, 26, 52, 0.18)`. Encima se repite un patrón de dibujos en línea fina, de estilo rockero y elegante: pentagramas ondulados con notas, guitarra, bajo, batería, saxofón y micrófono, en `#F2F2F2` al 8 %. Todo es fijo (no se mueve con el scroll), va en todas las pantallas y está dibujado en CSS y SVG dentro de `estilos.css`, sin archivos ni recursos externos.
- **DIS-33 Estilo vidrio.** Las tarjetas, los botones y los campos tienen un fondo semitransparente al 18 % con un desenfoque leve de 2 px (los dibujos del fondo se ven a través) y un borde `#F2F2F2` al 10 %:
  - tarjetas y botones: `#222222`;
  - campos: el color del fondo de la app.

  Los bordes de estado (corriendo, en pausa y hoy) y el hover `#3A3A3A` (DIS-15) no cambian. Los botones cambian de fondo con una transición de 150 ms. Las esquinas siguen en 8 px (DIS-04). Las casillas de los días no son de vidrio, para que se distingan del fondo (DIS-09).

## 2. Pantalla principal

- **DIS-06 Encabezado.** "Guitar-Space" a la izquierda. A la derecha, la insignia de racha (fondo azul suave, emoji de llama: "🔥 Racha: 3 días", "🔥 Racha: 1 día" o "🔥 Racha: 0 días") y el botón "⋯".
- **DIS-07 Tarjeta de resumen.** El círculo va a la izquierda, con el porcentaje en el centro. A la derecha van tres datos con su etiqueta en texto secundario:
  - Semana: 19-10-2026 al 25-10-2026
  - Llevas: 5:05 de 10:30
  - Semana anterior: 9:45, o "Sin datos" (BOR-08)
- **DIS-08 Círculo.** Tiene un anillo fino de 6 px. El fondo del anillo es una línea translúcida (`#F2F2F2` al 8 %). El arco de progreso tiene extremos redondeados y un brillo suave de su propio color (3 px al 60 %). El porcentaje va en trazo fino (peso 300). El arco se llena según el porcentaje (PRO-01). Su color sigue el estimado semanal (PRO-05) y es gris cuando no hay días terminados (BOR-07). Si pasa de 100 % (por ejemplo, al bajar la meta a mitad de semana), el anillo queda lleno y muestra el número real. El porcentaje se escribe sin espacio, por ejemplo "50%".
- **DIS-09 Fila de días.** Son 7 casillas iguales, cada una con la abreviatura (Lun…Dom) y el total en h:mm. Llevan el fondo suave de su estado al 90 %, un borde del color de su estado al 35 % y el texto del color de su estado (PRO-03), para que se distingan del fondo. Los días futuros van en gris con "-" (PRO-04). Hoy se resalta con un borde `#F2F2F2`.
- **DIS-10 Tarjeta "Hoy".** Arriba van "Hoy 23-10-2026" a la izquierda y "0:45 de 1:30" a la derecha. Debajo va una barra de progreso con el color del estado del día.
- **DIS-11 Mensaje.** "⚠ Aún te faltan 0:45" va dentro de la tarjeta "Hoy", debajo de la barra, con texto amarillo `#F5B921` sobre fondo amarillo suave `#3A2A0A`, un relleno de 8 px y esquinas redondeadas de 8 px. Aparece al pausar o detener un cronómetro (también cuando se detiene solo al llegar a 0) si no se cumplió la meta del día (CRO-08), y desaparece al iniciar o reanudar un cronómetro, al guardar un cambio válido en la configuración o al cumplir la meta (CRO-16).
- **DIS-12 Tarjetas de categoría.**
  - **A la izquierda:** el nombre en negrita y, debajo, "Meta 0:25 · Por defecto 0:25 · En pausa" (CAT-06). El estado solo aparece cuando aplica.
  - **A la derecha:** el cronómetro y los botones de ícono (▶ iniciar o reanudar, ❚❚ pausar, ■ detener).
  - **Categoría cumplida:** se muestra la insignia verde "✓ Cumplida" (CRO-12).
- **DIS-13 Botón "Terminar práctica".** Ocupa la mitad del ancho de la columna y va centrado, como en el wireframe. Cuando no hay un cronómetro activo, se ve deshabilitado (CRO-13).

## 3. Estados visuales

**DIS-14 Estados de una categoría** (CRO-14)

| Estado | Tarjeta | Cronómetro | Botones |
|---|---|---|---|
| Sin iniciar | Borde normal | Texto principal, tiempo restante | ▶ |
| Corriendo | Borde azul `#3B82F6` | Texto principal, descontando | ❚❚ ■ |
| En pausa | Borde gris claro `#6A6A6A` y la etiqueta "En pausa" | Texto secundario | ▶ ■ |
| Cumplida | Borde normal | No se muestra | Insignia "✓ Cumplida" |
| Bloqueada (hay otro cronómetro activo) | Borde normal | Texto secundario | ▶ deshabilitado |

- **DIS-15 Botones de ícono.** Miden 32 × 32 px y llevan un borde de 1 px y esquinas redondeadas de 6 px. Al pasar el mouse por encima, su fondo cambia a `#3A3A3A`. Deshabilitados se ven al 50 % de opacidad.

## 4. Mensajes y avisos

- **DIS-16 Errores de validación** (BOR-01, BOR-02, BOR-03, BOR-10 a BOR-13). Van en texto rojo, debajo del campo o del botón que los causó. Al presionar un botón se validan todos los campos de su bloque y se muestran todos los errores a la vez. El error de un campo desaparece cuando el usuario cambia ese campo. El error de un botón ("Los minutos no alcanzan…" o "Debe quedar al menos una categoría.") desaparece cuando el usuario cambia cualquier campo de su bloque o presiona "No". Los demás campos conservan lo que el usuario escribió y no se guarda nada (BOR-14).
- **DIS-17 Textos de error:**
  - Tiempo negativo: "El tiempo no puede ser negativo."
  - Tiempo en 0: "El tiempo debe ser mayor a 0."
  - Ajuste imposible: "Los minutos no alcanzan para la meta diaria."
  - Minutos fuera de rango (DIS-21): "Los minutos deben estar entre 0 y 59."
  - Campo vacío o no entero (BOR-10): "Ingresa un número entero."
  - Nombre vacío (BOR-11): "La categoría necesita un nombre."
  - Nombre duplicado (BOR-12): "Ya existe una categoría con ese nombre."
  - Última categoría (BOR-13): "Debe quedar al menos una categoría."
- **DIS-18 "Aún te faltan h:mm"** (CRO-08, CRO-16). Está definido en DIS-11.
- **DIS-19 Aviso al llegar a 0** (CRO-07). La tarjeta cambia al estado "Cumplida" de DIS-14. No lleva sonido ni ventana emergente.

## 5. Configuración

- **DIS-20** La pantalla de configuración se abre desde "⋯" y reemplaza a toda la principal, incluido su encabezado. Arriba lleva el título "Configuración" y el botón "← Volver". Debajo van, en la misma columna centrada de DIS-26, el bloque "Meta semanal" y luego el bloque "Categorías" con "+ Agregar categoría".
  - "← Volver" descarta lo que no se guardó y muestra la principal con los datos actualizados.
  - Después de guardar algo con éxito, toda la configuración se vuelve a mostrar con los datos guardados; lo que no se guardó en los otros bloques se descarta.
  - Si a medianoche empieza otra semana con la configuración abierta, se vuelve a mostrar con la semana nueva.
- **DIS-21 Campo de duración.** Dos casillas numéricas (`type="number"`): horas y minutos (de 0 a 59). Empiezan con los valores guardados. Se usa en toda la configuración, también en los minutos por defecto y diarios de la fila de agregar.
- **DIS-22 Bloque "Meta semanal"** (SEM-04). Tiene el campo de duración, debajo el texto calculado "Meta diaria: 1:30" y un botón "Guardar". La meta diaria se recalcula mientras el usuario escribe si el valor es válido; si no lo es, queda el último valor válido.
- **DIS-23 Bloque "Categorías"** (CAT-03, CAT-04). Tiene una fila por cada categoría activa, con:
  - el nombre (solo lectura),
  - los minutos diarios (campo de duración),
  - el texto "Por defecto 0:25",
  - el botón "Eliminar" (DIS-30).

  Debajo van "Suma: 1:30 de 1:30" y el botón "Guardar cambios". La suma compara los minutos escritos con la meta diaria guardada y se recalcula como en DIS-22. Si no da la meta, al guardar se ajusta la categoría más grande (CAT-04).
- **DIS-24** (CRO-15) Mientras haya un cronómetro corriendo o en pausa, el botón "⋯" se ve deshabilitado.
- **DIS-29 Agregar categoría** (CAT-08). Debajo de la lista, el botón "+ Agregar categoría" abre una fila nueva con el nombre, los minutos por defecto, los minutos diarios y un botón "Agregar". Mientras la fila está abierta, "+ Agregar categoría" se oculta. La fila se cierra al agregar la categoría o al salir con "← Volver". La categoría nueva va al final de la lista.
- **DIS-30 Eliminar** (CAT-09, CAT-10). Al presionar "Eliminar", el botón cambia a "¿Eliminar? Sí / No" en la misma fila. Solo una fila puede estar en ese estado a la vez. El error de BOR-13 aparece al presionar "Sí", debajo de los botones de esa fila. No se usan ventanas emergentes del navegador.

## 6. Ventana

- **DIS-25** La app usa la ventana del navegador con un margen de 24 px. En las dos pantallas, si el contenido no cabe, la página hace scroll normal.
- **DIS-26** Todo va en una sola columna vertical centrada, como en el wireframe. Mide 960 px como máximo y es más angosta si la ventana es más pequeña. De arriba hacia abajo van el encabezado, el resumen, la fila de días, la tarjeta "Hoy", las categorías y "Terminar práctica". El encabezado va separado del resto por 24 px, y lo demás va separado por 16 px. La configuración usa la misma separación.
- **DIS-27** El círculo de progreso mide 160 px.
- **DIS-28** Ya no aplica: la app usa una sola columna en cualquier ancho de ventana (DIS-26).
- **DIS-31** Si las categorías no caben en la ventana, la página hace scroll normal. La columna no tiene scroll propio.
