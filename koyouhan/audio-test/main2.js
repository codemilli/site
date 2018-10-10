/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
/*

  Music is by The XX
  @see http://thexx.info

  This is best viewed in Chrome since there is a bug in Safari
  when using getByteFrequencyData with MediaElementAudioSource

  @see https://goo.gl/6WLx1

*/

// Config

const NUM_PARTICLES = 150;
const NUM_BANDS = 128;
const SMOOTHING = 0.5;
const MP3_PATH = 'Geomancy.mp3';

const SCALE = {MIN: 5.0,  MAX: 80.0};
const SPEED = {MIN: 0.2,   MAX: 1.0};
const ALPHA = {MIN: 0.8,   MAX: 0.9};
const SPIN  = {MIN: 0.001, MAX: 0.005};
const SIZE  = {MIN: 0.5,   MAX: 1.25};

const COLORS = [
  '#69D2E7',
  '#1B676B',
  '#BEF202',
  '#EBE54D',
  '#00CDAC',
  '#1693A5',
  '#F9D423',
  '#FF4E50',
  '#E7204E',
  '#0CCABA',
  '#FF006F'
];

// Audio Analyser

class AudioAnalyser {
  static initClass() {

    this.AudioContext = self.AudioContext || self.webkitAudioContext;
    this.enabled = (this.AudioContext != null);
  }

  constructor( audio, numBands, smoothing ) {

    // construct audio object
    if (audio == null) { audio = new Audio(); }
    this.audio = audio;
    if (numBands == null) { numBands = 256; }
    this.numBands = numBands;
    if (smoothing == null) { smoothing = 0.3; }
    this.smoothing = smoothing;
    if (typeof this.audio === 'string') {
      const src = this.audio;
      this.audio = new Audio();
      this.audio.crossOrigin = "anonymous";
      this.audio.controls = true;
      this.audio.src = src;
    }

    // setup audio context and nodes
    this.context = new AudioAnalyser.AudioContext();

    // createScriptProcessor so we can hook onto updates
    this.jsNode = this.context.createScriptProcessor(2048, 1, 1);

    // smoothed analyser with n bins for frequency-domain analysis
    this.analyser = this.context.createAnalyser();
    this.analyser.smoothingTimeConstant = this.smoothing;
    this.analyser.fftSize = this.numBands * 2;

    // persistant bands array
    this.bands = new Uint8Array(this.analyser.frequencyBinCount);

    // circumvent http://crbug.com/112368
    this.audio.addEventListener('canplay', () => {

      // media source
      this.source = this.context.createMediaElementSource(this.audio);

      // wire up nodes

      this.source.connect(this.analyser);
      this.analyser.connect(this.jsNode);

      this.jsNode.connect(this.context.destination);
      this.source.connect(this.context.destination);

      // update each time the JavaScriptNode is called
      return this.jsNode.onaudioprocess = () => {

        // retreive the data from the first channel
        this.analyser.getByteFrequencyData(this.bands);

        // fire callback
        if (!this.audio.paused) { return (typeof this.onUpdate === 'function' ? this.onUpdate(this.bands) : undefined); }
      };
    });
  }

  start() {

    return this.audio.play();
  }

  stop() {

    return this.audio.pause();
  }
}
AudioAnalyser.initClass();

// Particle

class Particle {

  constructor( x, y ) {

    if (x == null) { x = 0; }
    this.x = x;
    if (y == null) { y = 0; }
    this.y = y;
    this.reset();
  }

  reset() {

    this.level = 1 + floor(random(4));
    this.scale = random(SCALE.MIN, SCALE.MAX);
    this.alpha = random(ALPHA.MIN, ALPHA.MAX);
    this.speed = random(SPEED.MIN, SPEED.MAX);
    this.color = random(COLORS);
    this.size = random(SIZE.MIN, SIZE.MAX);
    this.spin = random(SPIN.MAX, SPIN.MAX);
    this.band = floor(random(NUM_BANDS));

    if (random() < 0.5) { this.spin = -this.spin; }

    this.smoothedScale = 0.0;
    this.smoothedAlpha = 0.0;
    this.decayScale = 0.0;
    this.decayAlpha = 0.0;
    this.rotation = random(TWO_PI);
    return this.energy = 0.0;
  }

  move() {

    this.rotation += this.spin;
    return this.y -= this.speed * this.level;
  }

  draw( ctx ) {

    const power = exp(this.energy);
    const scale = this.scale * power;
    const alpha = this.alpha * this.energy * 1.5;

    this.decayScale = max(this.decayScale, scale);
    this.decayAlpha = max(this.decayAlpha, alpha);

    this.smoothedScale += ( this.decayScale - this.smoothedScale ) * 0.3;
    this.smoothedAlpha += ( this.decayAlpha - this.smoothedAlpha ) * 0.3;

    this.decayScale *= 0.985;
    this.decayAlpha *= 0.975;

    ctx.save();
    ctx.beginPath();
    ctx.translate(this.x + (cos( this.rotation * this.speed ) * 250), this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.smoothedScale * this.level, this.smoothedScale * this.level);
    ctx.moveTo(this.size * 0.5, 0);
    ctx.lineTo(this.size * -0.5, 0);
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.globalAlpha = this.smoothedAlpha / this.level;
    ctx.strokeStyle = this.color;
    ctx.stroke();
    return ctx.restore();
  }
}

// Sketch

Sketch.create({

  particles: [],

  setup() {

    // generate some particles
    let particle, warning;
    for (let i = 0, end = NUM_PARTICLES-1; i <= end; i++) {

      const x = random(this.width);
      const y = random(this.height * 2);

      particle = new Particle(x, y);
      particle.energy = random(particle.band / 256);

      this.particles.push(particle);
    }

    if (AudioAnalyser.enabled) {

      try {

        // setup the audio analyser
        const analyser = new AudioAnalyser(MP3_PATH, NUM_BANDS, SMOOTHING);

        // update particles based on fft transformed audio frequencies
        analyser.onUpdate = bands => { return (() => {
          const result = [];
          for (particle of Array.from(this.particles)) {             result.push(particle.energy = bands[ particle.band ] / 256);
          }
          return result;
        })(); };

        // start as soon as the audio is buffered
        analyser.start();

        // show audio controls
        document.body.appendChild(analyser.audio);

        const intro = document.getElementById('intro');
        intro.style.display = 'none';

        // bug in Safari 6 when using getByteFrequencyData with MediaElementAudioSource
        // @see https://goo.gl/6WLx1
        if (/Safari/.test( navigator.userAgent ) && !/Chrome/.test( navigator.userAgent )) {

          warning = document.getElementById('warning2');
          return warning.style.display = 'block';
        }

      } catch (error) {}

    } else {

      // Web Audio API not detected
      warning = document.getElementById('warning1');
      return warning.style.display = 'block';
    }
  },

  draw() {

    this.globalCompositeOperation = 'lighter';

    return (() => {
      const result = [];
      for (let particle of Array.from(this.particles)) {

        // recycle particles
        if (particle.y < (-particle.size * particle.level * particle.scale * 2)) {

          particle.reset();
          particle.x = random(this.width);
          particle.y = this.height + (particle.size * particle.scale * particle.level);
        }

        particle.move();
        result.push(particle.draw(this));
      }
      return result;
    })();
  }
});