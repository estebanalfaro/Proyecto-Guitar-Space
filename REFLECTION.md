# REFLECTION — Guitar-Space

Autoevaluación de alineación del proyecto final.

## A. Matriz de Alineación de Intención (Visión vs. Realidad)

| Dimensión de la App | Visión Inicial en mi Mente (Semana 1) | Nivel de Satisfacción Percibido sobre el resultado | Justificación sobre el resultado |
|---|---|---|---|
| Lógica de Negocio | Una app que me ayudara a llevar el control de cuánto practico y a ponerme una meta diaria, para crear constancia, porque hay semanas en las que no practico. Debía tener cronómetros. | **Muy Satisfecho** | Sí pude materializar lo que tenía en mente, porque mi visión no era tan ambiciosa: la app debía permitirme practicar y guardar un registro, y eso es lo que hace. Incluso la racha no resultó tan ambiciosa para una app sencilla. |
| Experiencia de Usuario (UI/UX) | Sencilla, con un tiempo especificado y un círculo que se fuera llenando con el progreso semanal, con los días de la semana y las categorías a practicar con sus cronómetros. | **Satisfecho** | Primero se hizo en dos columnas, pero no me gustó el resultado y volvió a una sola columna, como mi boceto. Al final resultó como mi visión inicial. |
| Persistencia de Datos | Como es para guardar registros, quería que los datos no se perdieran al cerrar el navegador; por eso elegí almacenamiento local (localStorage). | **Satisfecho** | Sí se alinean, ya que los datos persisten al cerrar la app y volverla a abrir. |

## B. Cuestionario de Reflexión de Cierre

### 1. Autonomía de la IA: ¿En qué momentos la IA tomó decisiones "por su cuenta" sin habérselo solicitado? ¿Fueron aciertos o fallos de arquitectura?

En general, la IA siempre me preguntó antes de tomar alguna decisión. También me hizo propuestas, sobre todo en temas de lógica del código, como el redondeo de los segundos: por ejemplo, qué pasaba si un día quedaba en 99,8 % y se mostraba en amarillo en vez de verde solo por unos segundos. Se decidió redondear lo practicado al minuto más cercano antes de calcular los colores, la racha y "Cumplida", para que unos segundos no cambien el resultado. Fue un acierto: sentí que estaba bien hacerlo de esa manera.

### 2. Calidad de Especificación: Analizando tu `requirements.md` inicial, ¿dónde fuiste ambiguo y causaste "alucinaciones" o parches frágiles por parte de la IA?

Fui ambiguo en el mensaje "Aún te faltan h:mm" (CRO-08): el requisito no decía cómo calcular el tiempo que falta, y el contrato tenía una regla de redondeo ("lo que falta se redondea al minuto siguiente") que no coincidía con lo que mostraba la tarjeta "Hoy". Tuve que decidir a mitad de la implementación, y esa regla quedó sin usarse: la función que la aplicaba se volvió código muerto y hubo que eliminarla del contrato, del código y de las pruebas durante la revisión final.

### 3. Rol de Head Chef: ¿Te sientes 100% dueño y responsable del código fuente generado o existen componentes que consideras "caja negra"?

Siento que hice un buen papel como Head Chef, ya que la IA no asumió nada por sí sola: siempre propuso los cambios pertinentes, y yo los audité o le indiqué cómo quería que fueran. Las partes que para mí eran "caja negra" eran de dónde tomaba realmente el tiempo el cronómetro y cómo lo calculaba, cómo hacía la app para cambiar de día automáticamente, y qué era el SVG y por qué se usaba. Al revisarlas, las entendí: el cronómetro compara la hora de inicio con la hora de la PC; a medianoche la app revisa cada segundo si cambió la fecha, guarda la sesión en el día en que se hizo y empieza el día nuevo en cero; y el fondo está dibujado en SVG dentro del CSS porque las reglas del proyecto no permiten recursos externos.

### 4. Satisfacción del Cliente: Si el docente fuera un cliente real que pagó por este software, ¿qué tan alineado está el producto final con la visión original?

Siento que el producto sí está alineado con lo que se solicitó y con el propósito que tenía. Como cliente, se solicitó una app para llevar el control del tiempo practicado en un instrumento musical, con cronómetros, días y un resumen, y creo que el producto lo cumple. Para que la app fuera más completa, se podría usar desde el celular, pero en general creo que cumple la petición del cliente.
