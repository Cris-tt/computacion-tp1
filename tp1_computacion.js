//Microfono
let mic;

//amplitud
let amp;

function setup() {
  createCanvas(1200, 700);
  background(239, 237, 233);

  bandas = [
    height * 0.15,
    height * 0.30,
    height * 0.45,
    height * 0.65
  ];


  elegirBandasActivas(); //funcion que le da un carril por el que pasar a las lineas


  for (let i = 0; i < random(20, 25); i++) {

    caminantes.push(
      new Caminante()
    );
  }
  c = new Caminante;

  // Líneas fijas (se dibujan una sola vez sobre el fondo)
  dibujarLineasFijas(8); // ajustá la cantidad a gusto

  mic = new p5.AudioIn(); // se cominca con la entrada de audio del microfono
  mic.start(); // se inicia el flujo de audio desde el microfono
}


function draw() {

  amp = mic.getLevel(); // se obtiene el nivel de amplitud del audio


  for (let c of caminantes) {

    c.actualizar();
    c.dibujar();

  }
}
function mousePressed() {

  for (let c of caminantes) {

    if (c.estado === "onda-alta") {

      c.estado = "onda-baja";

      // } else if (c.estado === "onda-baja") {

      //   c.estado = "curva-circular";
      //     c.iniciarCurvaCircular();

      // } 
    } else {

      c.estado = "onda-alta";

    }

  }

}