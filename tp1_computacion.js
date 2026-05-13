let caminantes = [];

function setup() {
  createCanvas(1000, 500);
  background(200);

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
