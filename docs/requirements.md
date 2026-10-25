# Guitar-Space — Requirements (EARS)

Estado: aprobado por el usuario (23-10-2026). Última actualización: 24-10-2026.
Fuente de datos: `contrato de datos.md`

> **Nota sobre los IDs.** Los IDs no se reutilizan ni se renumeran, porque el código, las pruebas y los demás documentos los citan. Los que faltan (GEN-05, GEN-06, CAT-05, CAT-07, CRO-09, CRO-10 y PRO-06) corresponden a requisitos que se eliminaron durante la especificación.

## Formato

| Tipo | Plantilla |
|---|---|
| Ubicuo | El sistema debe `<respuesta>`. |
| Evento | Cuando `<evento>`, el sistema debe `<respuesta>`. |
| Estado | Mientras `<estado>`, el sistema debe `<respuesta>`. |
| No deseado | Si `<condición>`, entonces el sistema debe `<respuesta>`. |
| Combinado (formato del proyecto) | WHEN `<evento>` IF `<condición>` THEN the system SHALL `<respuesta>`. |

## 1. General

- **GEN-01** El sistema debe guardar todos los datos en localStorage.
- **GEN-02** Cuando el usuario abre la app y no hay datos en localStorage, el sistema debe crear la meta semanal de 10:30 y las categorías Técnica 0:25, Repertorio 0:50 y Lectura 0:15.
- **GEN-03** El sistema debe guardar las fechas en formato AAAA-MM-DD y mostrarlas en formato DD-MM-AAAA.
- **GEN-04** El sistema debe mostrar todas las duraciones en formato h:mm, excepto el cronómetro, que debe mostrarse en formato h:mm:ss.
- **GEN-07** El sistema debe calcular el progreso, los colores, la racha, la comparación y el tiempo restante, sin guardarlos.

## 2. Semana y metas

- **SEM-01** El sistema debe definir cada semana de lunes a domingo, con 7 días.
- **SEM-02** WHEN el usuario abre la app o empieza un día nuevo IF no existe la semana actual THEN the system SHALL crearla con la meta y los minutos por categoría de la última semana guardada, o con los valores por defecto si no hay ninguna.
- **SEM-03** El sistema debe mostrar las fechas de inicio y fin de la semana actual sin permitir editarlas.
- **SEM-04** El sistema debe permitir que el usuario edite la meta semanal en formato h:mm.
- **SEM-05** El sistema debe calcular la meta diaria como la meta semanal dividida entre 7, redondeada al minuto siguiente.
- **SEM-06** Cuando el usuario cambia la meta semanal, el sistema debe reajustar los minutos de las categorías de la semana actual, manteniendo su proporción y asignando el minuto de redondeo a la categoría más grande.
- **SEM-07** El sistema debe conservar sin cambios la meta y los minutos de las semanas pasadas.
- **SEM-08** Cuando el usuario cambia la meta semanal, el sistema debe aplicarla a la semana actual completa.

## 3. Categorías

- **CAT-01** El sistema debe permitir que el usuario agregue y elimine categorías, sin permitir renombrarlas.
- **CAT-02** El sistema debe mostrar cada categoría activa con su nombre y su meta diaria.
- **CAT-03** El sistema debe permitir que el usuario edite los minutos diarios de cada categoría activa.
- **CAT-04** WHEN el usuario agrega una categoría o edita los minutos IF la suma de las categorías activas no da la meta diaria THEN the system SHALL guardar los valores ingresados y ajustar la diferencia en la categoría más grande.
- **CAT-06** El sistema debe mostrar siempre el valor por defecto de cada categoría, tanto en la pantalla principal como al editarla.
- **CAT-08** Cuando el usuario agrega una categoría, el sistema debe pedirle el nombre, los minutos por defecto y los minutos diarios, y agregarla a la semana actual.
- **CAT-09** Cuando el usuario elimina una categoría, el sistema debe marcarla como inactiva y conservar su tiempo practicado.
- **CAT-10** WHEN el usuario elimina una categoría IF quedan otras categorías activas THEN the system SHALL repartir sus minutos entre ellas en proporción y asignar el minuto de redondeo a la más grande.

## 4. Cronómetro

- **CRO-01** El sistema debe mostrar un cronómetro descendente por cada categoría activa, que empiece en el tiempo que le falta a esa categoría en el día.
- **CRO-02** Mientras haya un cronómetro corriendo o en pausa, el sistema debe impedir que se inicie otro.
- **CRO-03** Mientras un cronómetro está corriendo, el sistema debe descontar el tiempo cada segundo.
- **CRO-04** Cuando el usuario pausa un cronómetro, el sistema debe detener el conteo y sumar el tiempo de la sesión al registro del día de esa categoría.
- **CRO-05** Cuando el usuario detiene un cronómetro, el sistema debe sumar el tiempo de la sesión al registro del día y liberar el cronómetro para que se pueda usar otro.
- **CRO-06** Cuando el usuario retoma un cronómetro, el sistema debe continuar desde el tiempo que le falta a esa categoría en el día.
- **CRO-07** Cuando un cronómetro llega a 0, el sistema debe detenerlo, sumar el tiempo de la sesión al registro del día y liberarlo, sin contar tiempo extra.
- **CRO-08** Cuando un cronómetro se pausa o se detiene (incluido CRO-07) y no se cumplió la meta del día, el sistema debe mostrar el mensaje "Aún te faltan h:mm".
- **CRO-11** El sistema debe registrar práctica solo en el día actual.
- **CRO-12** Mientras una categoría tenga su meta del día cumplida, el sistema debe mostrar "Cumplida" sin botones.
- **CRO-13** Cuando el usuario presiona "Terminar práctica", el sistema debe detener el cronómetro activo. Si no hay ninguno, el botón debe quedar deshabilitado.
- **CRO-14** El sistema debe mostrar en cada categoría solo los botones que correspondan a su estado: sin iniciar (iniciar), corriendo (pausar y detener), en pausa (reanudar y detener).
- **CRO-15** Mientras haya un cronómetro corriendo o en pausa, el sistema debe impedir que se abra la configuración.
- **CRO-16** Cuando el usuario inicia o reanuda un cronómetro, guarda un cambio válido en la configuración o se cumple la meta del día, el sistema debe ocultar el mensaje de CRO-08.

## 5. Progreso, racha y comparación

- **PRO-01** El sistema debe mostrar un círculo con el porcentaje que lleva practicado la semana actual respecto a la meta semanal.
- **PRO-02** El sistema debe mostrar el total practicado de la semana junto a la meta semanal, en h:mm.
- **PRO-03** El sistema debe mostrar cada día de la semana con su total practicado y un color según la meta diaria: verde con 100 % o más, amarillo de 50 % a 99 % y rojo con menos de 50 %.
- **PRO-04** El sistema debe mostrar los días futuros sin color y sin total.
- **PRO-05** El sistema debe calcular el estimado semanal comparando lo practicado en los días ya terminados con la meta diaria multiplicada por la cantidad de esos días, y pintar el círculo con los colores de PRO-03.
- **PRO-07** El sistema debe mostrar la racha actual como la cantidad de días seguidos que llegaron a la meta diaria, contando hacia atrás desde ayer. Hoy también cuenta si ya llegó a la meta.
- **PRO-08** Cuando termina un día que no llegó a la meta diaria, el sistema debe poner la racha en 0.
- **PRO-09** El sistema debe mostrar el total de la semana actual junto al total de la semana anterior.

## 6. Casos borde

- **BOR-01** Si el usuario ingresa un tiempo negativo, entonces el sistema debe rechazarlo y mostrar un mensaje de error.
- **BOR-02** Si el usuario ingresa 0 en un tiempo editable que no sea el de una categoría, entonces el sistema debe rechazarlo y mostrar un mensaje de error.
- **BOR-03** Si el ajuste de CAT-04 deja una categoría por debajo de 0, entonces el sistema debe rechazar el cambio y mostrar un mensaje de error.
- **BOR-04** Cuando dos o más categorías empatan como la más grande (SEM-06, CAT-04, CAT-10), el sistema debe usar la primera en el orden en que se muestran.
- **BOR-05** Cuando el usuario cierra la pestaña con un cronómetro corriendo, el sistema debe guardar el tiempo de la sesión y dejar el cronómetro en pausa.
- **BOR-06** WHEN empieza un día nuevo, a medianoche o al abrir la app otro día, IF hay un cronómetro corriendo o en pausa THEN the system SHALL guardar la sesión en el día en que se hizo, liberar el cronómetro y dejar todos los cronómetros del día nuevo en su meta completa.
- **BOR-07** Si no hay días terminados en la semana, entonces el sistema debe mostrar el círculo en gris.
- **BOR-08** Si no existe la semana anterior, entonces el sistema debe mostrar "Sin datos" en la comparación.
- **BOR-09** Si al abrir la app el cronómetro guardado está "corriendo" (porque el navegador se cerró de golpe), entonces el sistema debe dejarlo en pausa.
- **BOR-10** Si el usuario deja vacío un campo de duración o ingresa algo que no es un número entero, entonces el sistema debe rechazarlo y mostrar un mensaje de error.
- **BOR-11** WHEN el usuario agrega una categoría IF el nombre está vacío THEN the system SHALL rechazarla y mostrar un mensaje de error.
- **BOR-12** WHEN el usuario agrega una categoría IF ya existe una categoría activa con el mismo nombre, sin distinguir mayúsculas, tildes ni espacios al inicio o al final, THEN the system SHALL rechazarla y mostrar un mensaje de error.
- **BOR-13** WHEN el usuario intenta eliminar una categoría IF es la última categoría activa THEN the system SHALL rechazarlo y mostrar un mensaje de error.
- **BOR-14** Si el sistema rechaza un valor (BOR-01, BOR-02, BOR-03, BOR-10, BOR-11, BOR-12 o BOR-13), entonces el sistema debe conservar sin cambios los datos guardados y lo que el usuario ya escribió en los demás campos.
