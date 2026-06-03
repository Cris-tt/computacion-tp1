class Caminante {

  constructor() {
    this.grosor = random(3, 5);
    this.colorLinea = random(50, 100);
    this.opacidad = random(70, 255);
    this.estado = "curva-circular";  

    //amplitud y frecuencia para variar la forma de la onda
    this.amplitud = 100;
    this.frecuencia = 0.05;

    this.amplitudAlta = random(80, 150);
    this.frecuenciaAlta = random(0.02, 0.08);

    this.amplitudBaja = random(10, 50);
    this.frecuenciaBaja = random(0.005, 0.02);


    this.x = 0;
    this.y = random(height * 0.2, height * 0.8);
    this.vel = 2.5;

    // Variables para curva-circular
    this.cx = this.x;          // centro del círculo
    this.cy = this.y;
    this.radio = random(40, 120);
    this.angulo = random(TWO_PI);
    this.velAngular = random(0.02, 0.06) * (random() > 0.5 ? 1 : -1); // sentido aleatorio


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

      this.amplitud = this.amplitudAlta;
      this.frecuencia = this.frecuenciaAlta;
      this.mover();
      this.cx = this.x;
      this.cy = this.y;

    } else if (this.estado === "onda-baja") {

      this.amplitud = this.amplitudBaja;
      this.frecuencia = this.frecuenciaBaja;
      this.mover();
      this.cx = this.x;
      this.cy = this.y; 

    } else if (this.estado === "curva-circular") {

      this.angulo += this.velAngular;

      this.x = this.cx + this.radio * cos(this.angulo);
      this.y = this.cy + this.radio * sin(this.angulo);
      this.radio += random(1, 3);   // espiral hacia afuera
    }


  }
  mover() {
    
    this.x += this.vel;
    this.y = this.yBase + this.amplitud * sin(this.frecuencia * this.x + this.variacion);
  
  }

}
