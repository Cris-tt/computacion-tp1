class  Caminante {

  constructor () {
    this.grosor = random(3, 5);
    this.colorLinea = random(50, 100);
    this.opacidad = random (70, 255);

    this.x = 0;
    this.y = random(height * 0.3, height * 0.7);

    this.xAnterior = this.x
    this.yAnterior = this.y


    this.variacion = random(1000);
    this.yBase = this.y;
  }

  dibujar () {
    stroke (this.colorLinea , this.opacidad)
    strokeWeight(this.grosor);
    line(this.xAnterior, this.yAnterior, this.x, this.y);
    this.xAnterior = this.x;
    this.yAnterior = this.y;

   

  }

  actualizar () {
    this.x += 0,5;
    this.y += random (-3, 3);

    this.x += 2;

    this.y = this.yBase +map(noise(this.variacion), 0, 1, -150, 150);

      this.variacion += 0.01;

  }
}
