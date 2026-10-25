# Guitar-Space

App web para llevar el control del tiempo de práctica de guitarra (o de cualquier instrumento) y crear constancia por medio de metas y rachas.

Proyecto final del curso **Programación Intencional con IA Generativa** (Universidad CENFOTEC), desarrollado con Spec-Driven Development: primero la especificación, después el código.

## Qué hace

- **Meta semanal** editable (por defecto 10:30), repartida en 7 días y entre categorías de práctica.
- **Categorías** con sus minutos diarios (Técnica, Repertorio y Lectura de inicio). Se pueden agregar y eliminar.
- **Un cronómetro descendente por categoría**, que se puede iniciar, pausar, detener y reanudar, con un solo cronómetro activo a la vez.
- **Progreso:** círculo semanal, días en verde, amarillo o rojo, tarjeta del día de hoy y comparación con la semana anterior.
- **Racha** de días seguidos que cumplieron la meta.
- **Validaciones** con mensajes claros (campos vacíos, números negativos, nombres duplicados) que no modifican los datos guardados.
- **Persistencia** en `localStorage`: los datos se conservan al cerrar y volver a abrir.

## Cómo usarla

- **En línea:** https://estebanalfaro.github.io/Proyecto-Guitar-Space/
- **En tu computadora:** descarga o clona el repositorio y abre `index.html` con doble clic. No necesita servidor, instalación ni internet.
- **Pruebas de la lógica:** abre `src/pruebas.html` (122 pruebas).

## Tecnologías

HTML5, CSS3 y JavaScript puro, sin frameworks, librerías ni herramientas de build. Persistencia en `localStorage`.

## Estructura

```
├── README.md
├── claude.md              Reglas de proyecto para la IA (stack, convenciones, prohibiciones)
├── REFLECTION.md          Autoevaluación de alineación
├── index.html             La app
├── docs/
│   ├── propuesta.md       Problema e idea de la app
│   ├── wireframe.png      Boceto inicial de la interfaz
│   ├── contrato de datos.md   Estructura de datos y decisiones clave
│   ├── requirements.md    Requisitos en sintaxis EARS
│   ├── design.md          Estilo, pantallas y estados visuales
│   └── tasks.md           Orden de implementación
└── src/
    ├── pruebas.html       Pruebas de la lógica
    ├── estilos.css
    └── js/                Lógica (formatos.js a progreso.js), vistas y app.js
```
