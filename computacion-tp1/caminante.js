class Caminante {


  constructor(centroY) {


    this.grosor = random(3, 5);
    this.colorLinea = random(0, 50);
    this.opacidad = random(150, 255);


    // Distribución gaussiana: la mayoría de las líneas caen cerca del centro
    // del grupo, y se van dispersando hacia los bordes (efecto "explosión").
    // La desviación estándar (15) controla cuán amplia es esa dispersión:
    // más bajo = líneas más juntas entre sí dentro del carril.
    let yGenerada = randomGaussian(centroY, 15);

    // Estado de reposo: mientras es true, amplitudObjetivo fluctúa solo
    // (en vez de quedar fija en 1), para que cada vuelta a la calma sea distinta.
    this.enReposo = true;
    this.semillaReposo = random(1000);


    // Evitamos que la dispersión empuje la línea fuera de la zona general
    // donde pueden vivir los caminantes (igual que el rango original).
    yGenerada = constrain(
      yGenerada,
      height * 0.1,
      height * 0.9
    );


    this.y = yGenerada;
    this.yBase = this.y;


    // Multiplicador individual de amplitud. En 1 = comportamiento normal.
    // Un aplauso puede elevarlo drásticamente para esta línea en particular.
    this.amplitudPropia = 1;


    // Hacia dónde "quiere" ir la amplitud. amplitudPropia se acerca a este
    // valor gradualmente cada frame (ver actualizarAmplitud), en vez de
    // saltar de golpe. Así logramos la transición suave de ida y de vuelta.
    this.amplitudObjetivo = 1;


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


  // Acerca gradualmente amplitudPropia hacia amplitudObjetivo.
  // Se llama una vez por frame, antes de dibujar.
  actualizarAmplitud() {

    if (this.enReposo) {

      this.semillaReposo += 0.003;

      this.amplitudObjetivo = map(
        noise(this.semillaReposo),
        0, 1,
        0.85, 1.15
      );
    }

    this.amplitudPropia = lerp(
      this.amplitudPropia,
      this.amplitudObjetivo,
      0.12   // antes: 0.05
    );
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


        let margenFuera = 5;


        let limiteArriba = -(this.yBase + margenFuera);
        let limiteAbajo = (height - this.yBase) + margenFuera;


        let desplazamientoY = constrain(
          p.forma * deformacionGlobal * this.amplitudPropia +
          vibracion + desplazamiento,
          limiteArriba,
          limiteAbajo
        );


        vertex(
          p.x,
          this.yBase + desplazamientoY);
      }


      endShape();
    }
  }


  dibujarLinea() {
    stroke(this.colorLinea, this.opacidad);


    strokeWeight(
      this.grosor * grosorGlobal
    );


    strokeJoin(ROUND);
    strokeCap(ROUND);


    noFill();


    beginShape();


    let coords = [];


    for (let p of this.puntos) {


      let vibracion =
        sin(frameCount * 0.03 + p.x * 0.01)
        * vibracionGlobal;


      let margenFuera = 5;


      let limiteArriba = -(this.yBase + margenFuera);
      let limiteAbajo = (height - this.yBase) + margenFuera;


      let desplazamientoY = constrain(
        p.forma * deformacionGlobal * this.amplitudPropia +
        vibracion,
        limiteArriba,
        limiteAbajo
      );


      coords.push({
        x: p.x,
        y: this.yBase + desplazamientoY
      });
    }


    // curveVertex necesita un punto de control extra
    // al principio y al final para dibujar hasta los bordes
    curveVertex(coords[0].x, coords[0].y);

    for (let c of coords) {
      curveVertex(c.x, c.y);
    }

    curveVertex(
      coords[coords.length - 1].x,
      coords[coords.length - 1].y
    );


    endShape();
  }
}
