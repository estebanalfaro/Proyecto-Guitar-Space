# Guitar-Space

## Contexto
App web para computadora para llevar el control del tiempo de práctica de un instrumento musical.

## Objetivo
Crear disciplina y constancia por medio de rachas, para mejorar la destreza musical.

## Rol y comportamiento
- Actúa como arquitecto de software senior aplicando Spec-Driven Development.
- Ve directo al grano. No expliques conceptos básicos a menos que se soliciten.
- Si algo es ambiguo o hay más de una forma de hacerlo, pregunta antes de decidir. No asumas.
- No cambies archivos sin confirmar antes con el usuario.
- Al terminar cada cambio, resume en pocas líneas qué cambiaste y por qué.
- Responde en español claro y directo.

## Stack tecnológico
Permitido: HTML5, CSS3 y JavaScript puro, con persistencia solo en localStorage según `contrato de datos.md`. La app se abre con doble clic en `src/index.html`.

Prohibido:
- Frameworks, librerías externas, CDN, npm o herramientas de build.
- `import`/`export` (los scripts se cargan con `<script>` en el orden de `tasks.md`).
- Otra persistencia distinta de localStorage (IndexedDB, cookies, servidor).

## Convenciones de código
Obligatorio:
- Variables, funciones y comentarios en español. Solo los términos técnicos en inglés (ejemplo: localStorage).
- camelCase para variables y funciones, MAYUSCULAS_CON_GUION para constantes, kebab-case para archivos.
- Indentación de 2 espacios, comillas simples y punto y coma.
- Funciones pequeñas con una sola responsabilidad.
- Colores y tamaños en variables CSS. Textos de error iguales a los de `design.md`.

Prohibido:
- Código duplicado o código muerto.
- Que los archivos de lógica (de `formatos.js` a `progreso.js`) usen el DOM.
- `alert`, `confirm` y `prompt`.
- Nombres en inglés o abreviados que no se entiendan (ejemplo: `tmp`, `x`, `data2`).

## Parches fuera de la especificación
Prohibido:
- Agregar funcionalidades, pantallas, campos, archivos o dependencias que no estén en la especificación.
- Parches para que algo "funcione": condiciones especiales, valores fijos o `try/catch` que oculten errores sin un requisito que los respalde.
- Modificar los documentos de especificación sin aprobación del usuario.

Obligatorio:
- Si un requisito no alcanza o es ambiguo, detenerse y preguntar. Primero se actualiza el documento y después el código.
- Cada cambio de código indica el ID que cumple (ejemplo: CRO-07).

## Fuente de verdad
- `contrato de datos.md`: estructura de datos y decisiones clave.
- `requirements.md`: requisitos de la app en formato EARS.
- `design.md`: estilo, pantallas y estados visuales.
- `tasks.md`: orden de implementación.

Si algo no está en estos documentos, pregunta.
