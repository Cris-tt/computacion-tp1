class Caminante {

  constructor() {
    this.grosor = random(3, 5);
    this.colorLinea = random(50, 100);
    this.opacidad = random(70, 255);
    this.variacionAngular = 0;
    this.estado = "curva-circular";  

    this.amplitud = 100;
    this.frecuencia = 0.05;

    this.x = 0;
    this.y = random(height * 0.2, height * 0.8);
    this.dir = radians(random(360));
    this.vel = 2.5;

    this.xAnterior = this.x
    this.yAnterior = this.y

    this.variacion = random(1000);
    this.yBase = this.y;

  }

  dibujar() {
    stroke(this.colorLinea, this.opacidad)

    strokeWeight(this.grosor);

    line(this.xAnterior, this.yAnterior, this.x, this.y);

    this.xAnterior = this.x;
    this.yAnterior = this.y;
  }

  actualizar() {

    //estados 
    if (this.estado === "onda-alta") {

    //  this.variacionAngular = radians(45);
      this.amplitud = 100;
      this.frecuencia = 0.04;
      this.mover();

    } else if (this.estado === "onda-baja") {

    //  this.variacionAngular = radians(15);
      this.amplitud = 30;
      this.frecuencia = 0.01;
      this.mover();

    } else if (this.estado === "curva-circular") {

      //  this.variacionAngular = radians(90);
      // this.amplitud = 50;
      // this.frecuencia = 0.05;
      // this.mover();

      this.dir += 0.08;

      this.x += 2;
      this.y += 8 * sin(this.dir);

    }


  }
  mover() {
    
    this.x += this.vel;

    this.y = this.yBase + this.amplitud * sin(this.frecuencia * this.x + this.variacion);
  

    // this.dir += this.frecuencia * this.x + this.variacionAngular
    //transformación de polares a cartesianas
    //  this.x = this.vel * cos( this.dir );
    //  this.y = this.vel * sin( this.dir );

    // this.x = this.x + this.vel;
    // this.y = this.y + this.dy;
    

  /*
    this.x += 0.5;
    this.y += random(-3, 3);

    this.x += 2;
    */

    // this.y = this.yBase + map(noise(this.variacionAngular), 0, 1, -150, 150);

    // this.variacionAngular += 0.01;
  }

}
