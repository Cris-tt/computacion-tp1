class Caminante {

  constructor() {

    this.grosor = random(3, 5);
    this.colorLinea = random(0, 50);
    this.opacidad = random(150, 255);

    this.y = random(height * 0.3, height * 0.7);
    this.yBase = this.y;

    this.variacion = random(1000);

    this.puntos = [];

    this.generarRecorrido();
  }

generarRecorrido() {

  for (let x = 0; x < width; x += 2) {

    let forma = map(
      noise(this.variacion),
      0,
      1,
      -180,
      180
    );

    this.puntos.push({
      x: x,
      forma: forma
    });

    this.variacion += 0.01;
  }
}

 dibujarHalo() {


        stroke(this.colorLinea, 40);

    strokeWeight(this.grosor * grosorGlobal * 3);

    noFill();

     for (let i = 0; i < 2; i++) {
      let desplazamiento = -6 + i * 4;
    beginShape();

    for (let p of this.puntos) {

let vibracion =
  sin(frameCount * 0.03 + p.x * 0.01)
  * vibracionGlobal;

vertex(
  p.x,
  this.yBase +
  p.forma * deformacionGlobal +
  vibracion + desplazamiento);
    }

    endShape();
   }
  }

  dibujarLinea(){
    stroke(this.colorLinea, this.opacidad);

    strokeWeight(
      this.grosor * grosorGlobal
    );

    noFill();

    beginShape();

    for (let p of this.puntos) {

let vibracion =
  sin(frameCount * 0.03 + p.x * 0.01)
  * vibracionGlobal;

vertex(
  p.x,
  this.yBase +
  p.forma * deformacionGlobal +
  vibracion);
    }

    endShape();
  }
}