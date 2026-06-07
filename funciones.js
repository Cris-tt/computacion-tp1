// ─── Bandas activas ───────────────────────────────────────────────────────────

function elegirBandasActivas() {
  let cantidad = floor(random(1, 3)); // 1 o 2
  bandasActivas = shuffle([...bandas]).slice(0, cantidad);
}


// ─── Líneas fijas (fondo inicial) ────────────────────────────────────────────
// Se llaman UNA sola vez en setup(), se pintan directo sobre el canvas
// y no vuelven a dibujarse. No se generan automáticamente durante el loop.

function dibujarLineasFijas(cantidad = 7) {

  let paso = 3; // resolución horizontal (px entre puntos)

  for (let i = 0; i < cantidad; i++) {

    let grosor     = random(1.5, 5);
    let colorLinea = random(15, 85);
    let opacidad   = random(50, 180);

    let banda    = random(bandasActivas);
    let subBanda = random(subBandas);

    let agrupada   = random() > 0.4;
    let amplitud   = agrupada ? random(8, 18)    : random(22, 55);
    let frecuencia = agrupada ? random(0.015, 0.04) : random(0.007, 0.022);

    let fase1 = random(TWO_PI);
    let fase2 = random(TWO_PI);
    let fase3 = random(TWO_PI);

    let yBase = agrupada
      ? banda + subBanda
      : random(height * 0.1, height * 0.9);

    // ── Dibujar ──────────────────────────────────────────────────────────────
    stroke(colorLinea, opacidad);
    strokeWeight(grosor);
    noFill();

    beginShape();
    for (let x = 0; x <= width; x += paso) {
      let y =
        yBase +
        sin(x * frecuencia + fase1) * amplitud +
        sin(x * frecuencia * 2.3 + fase2) * amplitud * 0.4 +
        sin(x * frecuencia * 4.1 + fase3) * amplitud * 0.2;
      vertex(x, y);
    }
    endShape();
  }
}
