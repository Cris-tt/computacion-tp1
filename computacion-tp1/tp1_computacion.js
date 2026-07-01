let caminantes = [];


let grosorGlobal = 1;
let vibracionGlobal = 8;
let deformacionGlobal = 1;
let imagenes = [];
let imagenActual;


//sonido


let mic;
let audioIniciado = false;


// amplitud
let amp = 0;
let intensidad = 0;


// frecuencia
let pitch;
const model_url =
  "https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/";


let frec = 0;
let notaMidi = 0;


// gestores
let gestorAmp;
let gestorFrec;


let AMP_MIN = 0.001;
let AMP_MAX = 0.18; // Lo subí un poquito para que la voz normal no sature


let NOTA_MIN = 48;
let NOTA_MAX = 60;


// calibracion del reinicio
let umbralImpacto = 2.4;
let tiempoUltimoReinicio = 0;   // Guarda el tiempo para el cooldown
let cooldownReinicio = 500;    // Tiempo de espera mínimo (0.5 segundos) para que no se reinicie mil veces seguidas


// duración del efecto de amplitud por aplauso
let tiempoUltimoGolpe = 0;
let duracionEfectoGolpe = 4500; // ms que el efecto se mantiene activo antes de empezar a volver a la normalidad




function preload() {


  for (let i = 1; i <= 5; i++) {


    imagenes.push(
      loadImage("data/imagen" + i + ".png")
    );


  }


}




function setup() {


  createCanvas(1000, 500);


  mic = new p5.AudioIn();


  gestorAmp = new GestorSenial(
    AMP_MIN,
    AMP_MAX
  );


  gestorFrec = new GestorSenial(
    NOTA_MIN,
    NOTA_MAX
  );
  imagenActual = random(imagenes);
  generarObra();
}


function draw() {


  fill(0);
  textSize(30);




  if (!audioIniciado) {


    background(239, 237, 233);



    textAlign(CENTER, CENTER);
    textSize(30);


    text(
      "Click para activar el microfono",
      width / 2,
      height / 2
    );


    return;
  }


  amp = mic.getLevel();


  gestorAmp.actualizar(
    amp
  );


  intensidad =
    gestorAmp.filtrada;


  if (gestorAmp.derivada > umbralImpacto && millis() - tiempoUltimoReinicio > cooldownReinicio) {
    golpeDeAmplitud();
    tiempoUltimoReinicio = millis(); // Guarda el momento del reinicio
  }




  if (intensidad > 0.15) {


    let nuevoGrosor = map(
      notaMidi,
      47,
      64,
      1.3,   // antes 1.4
      0.5
    );

    nuevoGrosor = constrain(
      nuevoGrosor,
      0.5,
      1.3    // antes 1.4
    );


    grosorGlobal = lerp(
      grosorGlobal,
      nuevoGrosor,
      0.5
    );
  }


  grosorGlobal = constrain(
    grosorGlobal,
    0.5,
    1.3    // antes 1.4
  );


  deformacionGlobal = map(
    intensidad ** 2,
    0,
    1,
    0.7,
    1.5
  );


  deformacionGlobal = constrain(
    deformacionGlobal,
    0.3,
    1.3
  );




  background(239, 237, 233);
  tint(255, 190);
  image(imagenActual, 0, 0, width, height);


  // Si ya pasó el tiempo que el efecto debe durar, todas las líneas
  // vuelven al estado de reposo (que ahora fluctúa con ruido, no es
  // un valor fijo). La transición sigue siendo gradual gracias a
  // actualizarAmplitud, no es un corte brusco.
  if (millis() - tiempoUltimoGolpe > duracionEfectoGolpe) {
    for (let c of caminantes) {
      c.enReposo = true;
    }
  }


  for (let c of caminantes) {


    c.actualizarAmplitud();
    c.dibujarHalo();
    c.dibujarLinea();

  }


}


function generarObra() {


  caminantes = [];


  let cantidad = int(random(25, 35));


  // Dos centros aleatorios: uno en la mitad superior del lienzo,
  // otro en la mitad inferior. Cambian cada vez que se genera la obra.
  let centroSuperior = random(height * 0.25, height * 0.40);
  let centroInferior = random(height * 0.60, height * 0.75);


  // Repartimos la cantidad total entre los dos grupos (mitad y mitad,
  // con algo de variación para que no sea siempre exactamente parejo).
  let cantidadSuperior = int(cantidad / 2);
  let cantidadInferior = cantidad - cantidadSuperior;


  for (let i = 0; i < cantidadSuperior; i++) {


    caminantes.push(
      new Caminante(centroSuperior)
    );
  }


  for (let i = 0; i < cantidadInferior; i++) {


    caminantes.push(
      new Caminante(centroInferior)
    );
  }
}


function golpeDeAmplitud() {


  // Guardamos el momento del golpe: durante los próximos
  // duracionEfectoGolpe ms el efecto se mantiene, y después
  // todo vuelve gradualmente al reposo (ver draw()).
  tiempoUltimoGolpe = millis();


  // Antes de aplicar el nuevo golpe, hacemos que todas las líneas vuelvan
  // al estado de reposo, para que los efectos de aplausos anteriores no se acumulen.
  for (let c of caminantes) {
    c.enReposo = true;
  }


  // Porcentaje del total de líneas que se ven afectadas por cada aplauso.
  let porcentajeAfectado = 0.3;


  let cantidadAfectada = ceil(
    caminantes.length * porcentajeAfectado
  );


  // Ordenamos por posición vertical (yBase) para que "cercanas entre sí"
  // tenga sentido espacial: un grupo va a ser un bloque contiguo en esta lista.
  let ordenados = [...caminantes].sort(
    (a, b) => a.yBase - b.yBase
  );


  let cantidadGrupos = int(random(2, 4)); // 2 a 3 grupos


  // Repartimos la cantidad afectada entre los grupos (al menos 1 línea por grupo).
  let restante = cantidadAfectada;
  let tamanios = [];
  for (let g = 0; g < cantidadGrupos; g++) {
    let gruposQueFaltan = cantidadGrupos - g;
    let maxParaEsteGrupo = restante - (gruposQueFaltan - 1);
    let tamanio = (g === cantidadGrupos - 1)
      ? restante
      : int(random(1, max(2, maxParaEsteGrupo)));
    tamanio = constrain(tamanio, 1, restante);
    tamanios.push(tamanio);
    restante -= tamanio;
  }


  // Vamos marcando qué posiciones del array ordenado ya quedaron ocupadas,
  // para que los grupos no se superpongan entre sí.
  let ocupado = new Array(ordenados.length).fill(false);


  for (let tamanio of tamanios) {


    // Buscamos un punto de inicio al azar que tenga lugar para el bloque completo.
    let intentos = 0;
    let inicio = -1;


    while (intentos < 30) {


      let candidato = int(
        random(0, ordenados.length - tamanio + 1)
      );


      let libre = true;
      for (let k = 0; k < tamanio; k++) {
        if (ocupado[candidato + k]) {
          libre = false;
          break;
        }
      }


      if (libre) {
        inicio = candidato;
        break;
      }


      intentos++;
    }


    if (inicio === -1) continue; // no encontramos lugar, saltamos este grupo


    for (let k = 0; k < tamanio; k++) {


      ocupado[inicio + k] = true;


      let c = ordenados[inicio + k];


      // Amplitud objetivo drástica e individual para esta línea.
      // amplitudPropia se acerca a este valor gradualmente (ver actualizarAmplitud).
      // Se apaga el reposo mientras dure el golpe.
      c.enReposo = false;
      c.amplitudObjetivo = random(1.6, 2.2);   // antes: random(2.5, 4)
    }
  }
}


function reiniciarObra() {


  grosorGlobal = 1;


  deformacionGlobal = 1;


  vibracionGlobal = 8;


  imagenActual = random(imagenes);


  generarObra();


}


function keyPressed() {


  // Se mantiene el reinicio manual con la tecla R por las dudas
  if (key == 'r' || key == 'R') {


    reiniciarObra();


  }


}




async function iniciarAudio() {


  if (audioIniciado) return;


  await userStartAudio();


  mic.start(() => {


    audioIniciado = true;


    startPitch();


  });


}




function mousePressed() {


  iniciarAudio();


}


function touchStarted() {


  iniciarAudio();


  return false;


}


function startPitch() {


  pitch = ml5.pitchDetection(
    model_url,
    getAudioContext(),
    mic.stream,
    modelLoaded
  );


}


function modelLoaded() {


  getPitch();


}


function getPitch() {


  pitch.getPitch(function (err, frequency) {


    if (frequency &&
      intensidad > 0.15) {


      frec = frequency;


      notaMidi = freqToMidi(
        frequency
      );


    }


    gestorFrec.actualizar(
      notaMidi
    );


    getPitch();


  });


}