

function setup() {
  createCanvas(1200, 700);
  background(239, 237, 233);

  bandas = [
    height * 0.15,
    height * 0.30,
    height * 0.45,
    height * 0.65
  ];
  bandasActivas = shuffle([...bandas]).slice(0, 2);



  for (let i = 0; i < random(20, 25); i++) {

    caminantes.push(
      new Caminante()
    );
  }
  c = new Caminante;

}


function draw() {
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