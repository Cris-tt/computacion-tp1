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
    reiniciarObra();
    tiempoUltimoReinicio = millis(); // Guarda el momento del reinicio
  }


  if (intensidad > 0.15) {

    let nuevoGrosor = map(
      notaMidi,
      47,
      64,
      2.5,
      0.5
    );

    nuevoGrosor = constrain(
      nuevoGrosor,
      0.5,
      2.5
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
    2.5
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
  tint (255, 190);
  image(imagenActual, 0, 0, width, height);

  for (let c of caminantes) {

    c.dibujarHalo();
    c.dibujarLinea();
    
  }

}

function generarObra() {

  caminantes = [];

  let cantidad = int(random(25, 35));

  for (let i = 0; i < cantidad; i++) {

    caminantes.push(
      new Caminante()
    );
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