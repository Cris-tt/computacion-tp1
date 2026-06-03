class Caminante {

  constructor() {
    this.grosor = random(3, 5);
    this.colorLinea = random(50, 100);
    this.opacidad = random(70, 255);

    this.estado = "onda-alta";

    // valores inicales para movimiento
    this.x = 0;
    this.y = random(height * 0.3, height * 0.7);
    this.vel = 2.5;

    // Para dibujar la línea, guardamos la posición anterior.
    this.xAnterior = this.x
    this.yAnterior = this.y


    //amplitud y frecuencia para variar la forma de la onda
    this.amplitud = 100;
    this.frecuencia = 0.05;

    this.amplitudAlta = random(80, 150);
    this.frecuenciaAlta = random(0.02, 0.08);

    this.amplitudBaja = random(10, 50);
    this.frecuenciaBaja = random(0.005, 0.02);

    // Fases de las ondas
    this.fase1 = random(TWO_PI);
    this.fase2 = random(TWO_PI);
    this.fase3 = random(TWO_PI);


    // Offsets
    this.offsetAmp = random(1000);
    this.offsetFreq = random(1000);


    // Variables para curva-circular
    this.cx = this.x;          // centro del círculo
    this.cy = this.y;
    this.radio = random(40, 120);
    this.angulo = random(TWO_PI);
    this.velAngular = random(0.02, 0.06) * (random() > 0.5 ? 1 : -1); // sentido aleatorio


    //linea de base para onda
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
      this.radio += random(1, 2);   // espiral hacia afuera
    }


  }
  mover() {

    this.x += this.vel;


    this.offsetAmp += 0.003;
    this.offsetFreq += 0.003;

    let ampActual =
      this.amplitud *
      map(noise(this.offsetAmp), 0, 1, 0.8, 1.2);

    let freqActual =
      this.frecuencia *
      map(noise(this.offsetFreq), 0, 1, 0.8, 1.2);

    this.y =
      this.yBase +

      sin(this.x * freqActual + this.fase1)
      * ampActual +

      sin(this.x * freqActual * 2.3 + this.fase2)
      * ampActual * 0.4 +

      sin(this.x * freqActual * 4.1 + this.fase3)
      * ampActual * 0.2;

  }

}
