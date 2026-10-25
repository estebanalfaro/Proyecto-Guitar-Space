# Guitar-Space — Propuesta

## El problema

Cuando practico guitarra me cuesta ser constante. Hay semanas en las que practico casi todos los días y otras en las que no toco el instrumento, y al final no sé cuánto tiempo practiqué ni en qué. Tampoco tengo algo que me motive a no "romper la cadena".

## La idea

Una app web sencilla para llevar el control de mi práctica. Me pongo una meta de tiempo por semana, la app la reparte entre los 7 días y entre las cosas que quiero trabajar (técnica, repertorio, lectura). Cada categoría tiene un cronómetro que va hacia atrás, y así sé exactamente cuánto me falta.

Para mantenerme motivado, la app lleva una **racha** de días seguidos en los que cumplí la meta, me muestra con colores cómo voy cada día y me compara con la semana anterior.

## ¿Para quién es?

Para mí, o para cualquier músico que quiera practicar con más disciplina. Es de un solo usuario y no necesita cuenta ni internet.

## Qué hace

- Meta semanal editable (por defecto 10 h 30 min, o sea 1 h 30 min al día).
- Categorías de práctica con sus minutos diarios. Se pueden agregar y eliminar.
- Un cronómetro por categoría que se puede iniciar, pausar, detener y retomar.
- Un círculo de progreso de la semana y los días en verde, amarillo o rojo según lo que practiqué.
- La racha de días cumplidos.
- La comparación con la semana anterior.
- Todo se guarda en el navegador, así que no pierdo nada al cerrar la app.

## Datos principales

- **Categoría:** qué practico (por ejemplo, Técnica) y cuántos minutos le dedico por defecto.
- **Semana:** sus fechas, su meta y los minutos diarios de cada categoría.
- **Registro de práctica:** cuánto practiqué de una categoría en un día.

Una semana tiene varias categorías con sus minutos, y cada registro pertenece a una categoría y a una semana.

## Cómo la voy a construir

HTML, CSS y JavaScript puro, guardando los datos en localStorage. Se abre con doble clic, sin instalar nada.

## Boceto de la interfaz

Ver `wireframe.png` (boceto low-fi hecho por mí).

> Este boceto es mi idea inicial, en una sola columna. Probé un diseño de dos columnas a pantalla completa, pero al final volví a una sola columna centrada, como en el boceto (ver `design.md`).

En el diseño final, la pantalla principal es una sola columna centrada. Arriba va el resumen de la semana con el círculo de progreso; después, los 7 días y lo que llevo hoy; y abajo, las categorías con sus cronómetros. El fondo es gris carbón con un toque vino y dibujos de línea fina (pentagramas ondulados, guitarra, bajo, batería, saxofón y micrófono), con un estilo rockero pero elegante. Las tarjetas son de vidrio translúcido. Desde un menú se entra a la configuración para cambiar la meta y las categorías.

## Documentos del proyecto

- `contrato de datos.md`: estructura de los datos.
- `requirements.md`: requisitos en formato EARS.
- `design.md`: diseño de las pantallas.
- `tasks.md`: orden en que voy a construir la app.
- `claude.md`: reglas para la IA.
