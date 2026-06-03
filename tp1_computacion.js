let caminantes = [];

function setup() {
  createCanvas(1200 , 700);
  background(239, 237, 233);

  for (let i = 0; i < random(20,25); i++) {

    caminantes.push(
      new Caminante()
      );
  }
  c= new Caminante;
}


function draw() {
  for(let c of caminantes) {

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
    }else {

      c.estado = "onda-alta";

    }

  }

}