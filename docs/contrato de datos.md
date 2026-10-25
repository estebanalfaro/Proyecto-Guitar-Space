# Guitar-Space — Contrato de datos

Estado: aprobado por el usuario (23-10-2026)

## Contrato (JSON)

```json
{
  "app": "Guitar-Space",
  "configuracion": {
    "metaSemanalPorDefectoMinutos": 630,
    "formatoDuracion": "h:mm",
    "formatoFechaVista": "DD-MM-AAAA",
    "formatoFechaGuardada": "AAAA-MM-DD"
  },
  "categorias": [
    { "id": "tecnica", "nombre": "Técnica", "minutosPorDefecto": 25, "activa": true },
    { "id": "repertorio", "nombre": "Repertorio", "minutosPorDefecto": 50, "activa": true },
    { "id": "lectura", "nombre": "Lectura", "minutosPorDefecto": 15, "activa": true }
  ],
  "semanas": [
    {
      "id": "2026-10-19",
      "fechaInicio": "2026-10-19",
      "fechaFin": "2026-10-25",
      "metaSemanalMinutos": 630,
      "minutosDiariosPorCategoria": [
        { "categoriaId": "tecnica", "minutos": 25 },
        { "categoriaId": "repertorio", "minutos": 50 },
        { "categoriaId": "lectura", "minutos": 15 }
      ]
    }
  ],
  "registrosPractica": [
    {
      "fecha": "2026-10-22",
      "semanaId": "2026-10-19",
      "categoriaId": "tecnica",
      "segundosPracticados": 1500
    }
  ],
  "cronometroActivo": {
    "categoriaId": "tecnica",
    "fecha": "2026-10-22",
    "estado": "pausado"
  }
}
```

- `categorias`: el `id` se genera a partir del nombre (minúsculas, sin tildes y con los espacios cambiados por guiones, por ejemplo `lectura-a-vista`; si ya existe, incluso entre las inactivas, se le agrega -2, -3…) y nunca cambia. Una categoría eliminada queda con `"activa": false`.
- `registrosPractica`: un solo registro por fecha y categoría; cada sesión suma a `segundosPracticados`.
- `cronometroActivo`: vale `null` si no hay cronómetro en uso. `estado` puede ser `"corriendo"` o `"pausado"`.

## Decisiones clave

**General**
- Todo en español, incluidos los campos. Un solo usuario, sin login. HTML, CSS y JS puro, con persistencia en localStorage.
- Fechas: se guardan en AAAA-MM-DD y se muestran en DD-MM-AAAA. Todas las duraciones se muestran en h:mm, excepto el cronómetro (h:mm:ss).
- Al mostrar segundos en h:mm, lo practicado se redondea al minuto más cercano (24 min 59 s → 0:25). Los colores, la racha, "Cumplida" y el tiempo del mensaje "Aún te faltan h:mm" se calculan con lo practicado ya redondeado al minuto más cercano.
- Los datos se guardan en localStorage con la clave `guitar-space`. En el primer uso se guardan la configuración y las categorías iniciales, sin semanas, registros ni cronómetro activo. La semana actual se crea al abrir la app (SEM-02).
- No se guarda nada que se pueda calcular: progreso, colores, racha, comparación, tiempo restante y mensajes.
- Todos los tiempos editables deben ser números enteros mayores a 0, excepto los minutos de una categoría (por defecto y diarios), que pueden ser 0. Los negativos siempre se rechazan.

**Semana y metas**
- La semana tiene 7 días, va de lunes a domingo y sus fechas son fijas. Al abrir la app solo se crea la semana actual.
- Meta semanal editable, por defecto 10:30 (630 min). Meta diaria = meta semanal / 7.
- Si la meta diaria tiene decimales, se redondea al minuto siguiente (ej. 10:00 semanal = 85.7 → 1:26 diaria). El círculo semanal siempre usa la meta semanal editada.
- Cada semana guarda su propia meta y sus minutos. Las semanas pasadas no cambian.

**Categorías**
- Categorías iniciales (minutos diarios): Técnica 0:25, Repertorio 0:50, Lectura 0:15. Siempre se muestra el valor por defecto de cada categoría.
- Se pueden agregar y eliminar, pero no renombrar. Al agregar, el usuario define el nombre, los minutos por defecto y los minutos diarios. El nombre no puede estar vacío ni repetirse entre las categorías activas.
- Al eliminar una categoría, su tiempo practicado se conserva (`activa: false`). Debe quedar al menos una categoría activa. Al eliminarla, se quita de los minutos de la semana actual y sus minutos se reparten entre las demás; las semanas pasadas la conservan. Si todas las que quedan tienen 0 minutos, la primera en el orden en que se muestran recibe todos los minutos.
- Las categorías activas siempre suman la meta diaria. Si cambia la meta o se elimina una categoría, los minutos se reparten en proporción. Si el usuario agrega una categoría o edita los minutos y no suman la meta diaria, la diferencia se ajusta en la categoría más grande según los valores ingresados (puede ser la nueva); con empate, la primera en el orden en que se muestran. El minuto de redondeo también va a la categoría más grande.

**Cronómetro**
- Descendente, uno por categoría y uno activo a la vez. Pausar, detener y retomar acumulan un solo tiempo por día y categoría.
- Al llegar a 0 se detiene solo, guarda el tiempo y la categoría queda cumplida. No hay tiempo extra.
- Guarda al pausar, al detener o al cerrar la pestaña. Al volver, queda en pausa. Si el navegador se cierra de golpe con el cronómetro corriendo, se pierde solo la sesión en curso (lo guardado antes se conserva) y al abrir queda en pausa (BOR-09).
- Al pausar o detener, si no se cumplió la meta del día, se muestra el mensaje "Aún te faltan h:mm". El mensaje desaparece al iniciar o reanudar un cronómetro, al guardar un cambio válido en la configuración (meta, minutos, agregar o eliminar), o al cumplir la meta. Entrar y volver sin guardar, o un valor rechazado, no lo cambia.
- El tiempo del mensaje es la meta diaria menos lo practicado hoy ya redondeado al minuto más cercano, igual que en la tarjeta "Hoy". El mensaje no aparece al abrir la app (aunque haya un cronómetro en pausa) y se oculta al empezar un día nuevo.
- Al empezar un día nuevo (a medianoche o al abrir la app otro día), la sesión se guarda en el día en que se hizo y el cronómetro se libera. El día nuevo empieza en cero.
- Solo registra el día actual. Los días pasados no se editan.

**Progreso, racha y comparación**
- El círculo semanal suma todo lo practicado en la semana.
- Colores por día y para el estimado semanal: verde 100 % o más, amarillo de 50 % a 99 %, rojo menos de 50 %. El estimado compara lo practicado contra lo esperado hasta ayer (solo días terminados).
- Racha: un día cuenta si su total llega a la meta diaria. La racha se rompe al terminar un día sin cumplir la meta. Un día de una semana que no existe (no se abrió la app) cuenta como no cumplido.
- Los porcentajes se redondean hacia abajo (99.6 % → 99 %) y el color usa ese mismo número.
- Comparación: total de la semana actual contra el total de la semana anterior. Si no hay semana anterior, muestra "Sin datos".
