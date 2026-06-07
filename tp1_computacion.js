// ─── tp1_computacion.js ───────────────────────────────────────────────────────

const THRESH_VOL  = 0.013;
const MIN_DUR_MS  = 380;
const SHORT_MS    = 260;
const anchoGestor = 200;

let mic;
let analizador;
let gestorVol;
let gestorPitch;

let micActivo    = false;
let haysonido    = false;
let sonandoDesde = 0;
let pendiente    = null;
let pitchSmooth  = 220;


// ── Setup ─────────────────────────────────────────────────────────────────────

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
  background(237, 233, 223);

  // Grano de papel sutil
  for (let i = 0; i < 4000; i++) {
    stroke(155, 143, 122, random(8, 18));
    strokeWeight(1);
    point(random(width), random(height));
  }

  bandas = [height * 0.20, height * 0.38, height * 0.58, height * 0.76];
  elegirBandasActivas();
  dibujarLineasFijas(7);

  gestorVol   = new GestorSenial(0, 1);
  gestorPitch = new GestorSenial(80, 1100);

  // Arrancar el micrófono directamente, sin botón.
  // userStartAudio() requiere al menos un click en la página;
  // lo resolvemos escuchando el primer click del usuario sobre el canvas.
  let canvas = document.querySelector('canvas');
  canvas.addEventListener('click', _iniciarMic, { once: true });
  document.body.addEventListener('click', _iniciarMic, { once: true });
  _iniciarMic(); // intento inmediato (funciona si el navegador lo permite)
}

function _iniciarMic() {
  if (micActivo) return;
  userStartAudio();
  mic = new p5.AudioIn();
  mic.start(() => {
    analizador = new p5.FFT(0.35, 2048);
    analizador.setInput(mic);
    micActivo = true;
  }, (err) => {
    console.error('Mic error:', err);
  });
}


// ── Estimación de pitch ───────────────────────────────────────────────────────

function estimarPitch(waveform, sr) {
  const N = floor(waveform.length / 2);
  let bestD = Infinity, bestTau = -1;
  for (let tau = 20; tau < N; tau += 2) {
    let d = 0;
    for (let j = 0; j < N; j += 3) {
      let dif = waveform[j] - waveform[j + tau];
      d += dif * dif;
    }
    if (d < bestD) { bestD = d; bestTau = tau; }
    if (d < 0.04) break;
  }
  return bestTau > 0 ? sr / bestTau : 220;
}


// ── Procesar audio ────────────────────────────────────────────────────────────

function procesarAudio() {
  if (!micActivo || !analizador) return;

  let waveform = analizador.waveform();

  let sumSq = 0;
  for (let i = 0; i < waveform.length; i++) sumSq += waveform[i] * waveform[i];
  let rms = sqrt(sumSq / waveform.length);

  gestorVol.actualizar(rms);

  let ahora  = millis();
  let fuerte = rms > THRESH_VOL;

  if (fuerte) {

    if (!haysonido) {
      haysonido    = true;
      sonandoDesde = ahora;

      let sr     = getAudioContext().sampleRate;
      let p      = constrain(estimarPitch(waveform, sr), 80, 1100);
      pitchSmooth = pitchSmooth * 0.7 + p * 0.3;
      gestorPitch.actualizar(pitchSmooth);

      let grosor = map(pitchSmooth, 80, 1100, 7.0, 1.2);
      pendiente  = new Caminante(grosor);

    } else {
      let dur = ahora - sonandoDesde;

      if (dur > MIN_DUR_MS && pendiente && !caminantes.includes(pendiente)) {
        if (caminantes.filter(c => c.vivo).length < MAX_LINEAS) {
          caminantes.push(pendiente);
        }
        pendiente = null;
      }

      let sr = getAudioContext().sampleRate;
      let p  = constrain(estimarPitch(waveform, sr), 80, 1100);
      pitchSmooth = pitchSmooth * 0.88 + p * 0.12;
      gestorPitch.actualizar(pitchSmooth);
    }

  } else {

    if (haysonido) {
      let dur = ahora - sonandoDesde;
      if (dur < SHORT_MS) {
        let target = caminantes.find(c => c.vivo && !c.fading);
        if (target) target.kill();
      }
      haysonido = false;
      pendiente = null;
    }
  }
}


// ── Draw ──────────────────────────────────────────────────────────────────────

function draw() {
  procesarAudio();
  for (let c of caminantes) c.actualizar();
  caminantes = caminantes.filter(c => c.vivo);
}


// ── Resize ────────────────────────────────────────────────────────────────────

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
