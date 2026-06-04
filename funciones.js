function elegirBandasActivas() {
    let cantidad = floor(random(1, 3)); // 1 o 2

    // Mezcla el arreglo y toma las primeras
    bandasActivas = shuffle([...bandas]).slice(0, cantidad);
}


// ─── Líneas fijas ────────────────────────────────────────────────────────────

function dibujarLineasFijas(cantidad = 6) {

  let paso = 3; // resolución horizontal (px entre puntos)

  for (let i = 0; i < cantidad; i++) {

    // Mismos parámetros que Caminante
    let grosor     = random(3, 6);
    let colorLinea = random(50, 100);
    let opacidad   = random(70, 2550);     
    let banda    = random(bandasActivas);
    let subBanda = random(subBandas);

    // Elige aleatoriamente si esta línea está "agrupada" o "dispersa"
    let agrupada = random() > 0.4;

    let amplitud  = agrupada ? random(8, 15)   : random(30, 70);
    let frecuencia = agrupada ? random(0.04, 0.06) : random(0.01, 0.05);

    let fase1 = random(TWO_PI);
    let fase2 = random(TWO_PI);
    let fase3 = random(TWO_PI);

    let yOriginal = random(height * 0.1, height * 0.9);
    let yBase     = agrupada ? banda + subBanda : yOriginal;

    // ── Dibujar ──────────────────────────────────────────────────────────────

    stroke(colorLinea, opacidad);
    strokeWeight(grosor);
    noFill();

    beginShape();

    for (let x = 0; x <= width; x += paso) {

      let y =
        yBase +

        sin(x * frecuencia + fase1)
        * amplitud +

        sin(x * frecuencia * 2.3 + fase2)
        * amplitud * 0.4 +

        sin(x * frecuencia * 4.1 + fase3)
        * amplitud * 0.2;

      vertex(x, y);
    }

    endShape();
  }
}
