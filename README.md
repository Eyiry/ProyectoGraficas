# ProyectoGraficas
Repositorio para el proyecto final de gráficas computacionales

Juego de Ritmo(similar a beat saber con mecánicas más simples)

Requerimentos Funcionales

  -Música atractiva, libre de regalías.
  -Capacidad de guardar los beatmaps en un formato fácil de editar. 
  -Mostrar las notas en la pantalla.
  -El jugador puede interactuar con las notas en la pantalla y el juego debe indicar si la interacción fue con el timing correcto y dar una puntuación basándose en este, 
  -Mostrar la puntuación total al final de cada canción. 
  -Compatibilidad con un teclado.
  -Mostrar la puntuación más alta de cada jugador. 

Plan de trabajo
  -Conseguir Música que siga la licencia  creative commons 4.0 o similar. (Óscar)
  -Conseguir o hacer assets para el juego. (Leonardo)
   -Sistema para crear los modelos de cada nota en un tiempo adecuado, con tiempo suficiente para que el jugador pueda reaccionar a las notas y ganar puntos. (Leonardo)
      *Cada nota debe desaparecer una vez que haya sido activada o si el jugador no logró acertar la nota a tiempo. 
      *En caso de fallar el jugador perderá su multiplicador de puntos.  
  -Sistema que utilice la generación de notas basándose en un un archivo con las características de cada nota. (Leonardo)
  -Sistema para guardar puntuaciones. (Óscar)
  -Crear escenario donde van a aparecer las notas (Óscar y Leonardo)
  -Agregar al movimiento de las notas post processing de bloom como se muestra en el ejemplo: https://threejs.org/examples/webgl_postprocessing_afterimage.html (Leonardo)
  -Agregar al escenario post processing como se muestra en los ejemplos
    *https://threejs.org/examples/webgl_postprocessing_rgb_halftone.html
    *https://threejs.org/examples/webgl_postprocessing_unreal_bloom_selective.html
