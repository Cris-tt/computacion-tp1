let caminantes = [];
let bandas = [];
let subBandas = [
  -40, 20, 0, 20, 40
];
let bandasActivas = [];


class Caminante {

  constructor() {
    this.grosor = random(3, 6);
    this.colorLinea = random(50, 100);
    this.opacidad = random(70, 255);

    this.estado = "onda-alta";

    // valores inicales para movimiento
    this.x = 0;
    this.y = random(height * 0.1, height * 0.9);
    this.vel = 1.8;

    // Para dibujar la línea, guardamos la posición anterior.
    this.xAnterior = this.x
    this.yAnterior = this.y

    // Parámetros para las ondas
    this.amplitudAlta = random(60, 75);
    this.frecuenciaAlta = random(0.01, 0.05);

    this.amplitudBaja = random(10, 50);
    this.frecuenciaBaja =
      0.04 + random(-0.002, 0.002);


    // Valores actuales
    this.amplitudActual = this.amplitudAlta;
    this.frecuenciaActual = this.frecuenciaAlta;

    // Valores objetivo
    this.amplitudObjetivo = this.amplitudAlta;
    this.frecuenciaObjetivo = this.frecuenciaAlta;


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


    //ejes para agrupar caminantes
    this.banda = random(bandas);
    this.subBandas = random(subBandas);

    let bandasElegidas = shuffle([...bandasActivas]);
    this.banda1 = bandasElegidas[0];
    this.banda2 = bandasElegidas[1];

    // Guarda la posición original
    this.yOriginal = this.y;

  }

  dibujar() {
    stroke(this.colorLinea, this.opacidad)
    strokeWeight(this.grosor);

    line(this.xAnterior, this.yAnterior, this.x, this.y);

    this.xAnterior = this.x;
    this.yAnterior = this.y;
  }


  actualizar() {

    if (this.estado === "onda-alta") {

      this.amplitudObjetivo = this.amplitudAlta;
      this.frecuenciaObjetivo = this.frecuenciaAlta;
      this.dividirEnBandas();

    }
    else if (this.estado === "onda-baja") {

      this.amplitudObjetivo = this.amplitudBaja;
      this.frecuenciaObjetivo = this.frecuenciaBaja;
      this.dividirEnBandas();
    }


    if (this.estado === "onda-alta" || this.estado === "onda-baja") {

      this.amplitudActual =
        lerp(
          this.amplitudActual,
          this.amplitudObjetivo,
          0.03
        );

      this.frecuenciaActual =
        lerp(
          this.frecuenciaActual,
          this.frecuenciaObjetivo,
          0.03
        );

      this.mover();
    }


  }



  mover() {

    this.x += this.vel;


    this.offsetAmp += 0.003;
    this.offsetFreq += 0.003;

    let ampActual =
      this.amplitudActual *
      map(noise(this.offsetAmp), 0, 1, 0.8, 1.2);

    let freqActual =
      this.frecuenciaActual *
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



  dividirEnBandas() {
    if (
      (this.x > 0 && this.x < 200)
    ) {

      this.yBase = lerp(
        this.yBase,
        this.banda,
        0.03
      );

      this.amplitudObjetivo = random(8, 15);

    }
    else if (this.x > 200 && this.x < 400) {


      let objetivo =
        this.banda +
        this.subBandas;
      if (this.x < 400) {
        objetivo = this.banda1;
      } else {
        objetivo = this.banda2;
      }

      this.yBase = lerp(
        this.yBase,
        objetivo,
        0.005
      );

    } else if (
      this.x > 600 &&
      this.x < 800
    ) {

      this.yBase = lerp(
        this.yBase,
        this.banda,
        0.05
      );

    } else {

      this.yBase = lerp(
        this.yBase,
        this.yOriginal,
        0.01
      );

    }

  }

}


//   iniciarCurvaCircular() {

//     let dx = this.x - this.xAnterior;
//     let dy = this.y - this.yAnterior;

//     let dir = atan2(dy, dx);

//     this.radio = random(100, 120);

//     let lado = random() > 0.5 ? 1 : -1;

//     this.cx =
//       this.x +
//       cos(dir + lado * HALF_PI) * this.radio;

//     this.cy =
//       this.y +
//       sin(dir + lado * HALF_PI) * this.radio;

//     this.angulo = atan2(
//       this.y - this.cy,
//       this.x - this.cx
//     );

//     this.velAngular =
//       random(0.02, 0.06) * lado;
//   }


// else if (this.estado === "curva-circular") {

//   this.angulo += this.velAngular;

//   this.x = this.cx + this.radio * cos(this.angulo);
//   this.y = this.cy + this.radio * sin(this.angulo);

//   this.radio += random(1, 2);
// }