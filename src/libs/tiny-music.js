/*
 * TinyMusic module (https://github.com/kevincennis/TinyMusic)
 * Developed by Kevin Ennis -> https://twitter.com/kevincennis/
 *
 * ----------------------------------------------------------------------
 *  The MIT License (MIT)
 *
 *  Copyright (c) 2014 Kevin Ennis
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 *
 * ----------------------------------------------------------------------
 *
 */

const pow = Math.pow
const enharmonics = 'B#-C|C#-Db|D|D#-Eb|E-Fb|E#-F|F#-Gb|G|G#-Ab|A|A#-Bb|B-Cb'
const middleC = 440 * pow(pow(2, 1 / 12), -9)
const numeric = /^[0-9.]+$/
const octaveOffset = 4
const space = /\s+/
const num = /(\d+)/
const offsets = {}

// populate the offset lookup (note distance from C, in semitones)
enharmonics.split('|').forEach((val, i) => {
  val.split('-').forEach((note) => {
    offsets[note] = i
  })
})

/**
 * Converts a note name (e.g. 'A4') to a frequency (e.g. 440.00)
 * @param {string} name - note name
 */
function getNoteFrequency (name) {
  const couple = name.split(num)
  const distance = offsets[couple[0]]
  const octaveDiff = (couple[1] || octaveOffset) - octaveOffset
  const freq = middleC * pow(pow(2, 1 / 12), distance)
  return freq * pow(2, octaveDiff)
}

/**
 * Convert a duration string (e.g. 'q') to a number (e.g. 1)
 * also accepts numeric strings (e.g '0.125')
 * and compound durations (e.g. 'es' for dotted-eight or eighth plus sixteenth)
 * @param {string} symbol duration symbol
 */
function getNoteDuration (symbol) {
  return numeric.test(symbol)
    ? parseFloat(symbol)
    : symbol.toLowerCase().split('').reduce((prev, curr) => {
      return prev +
        (curr === 'w' ? 4
          : curr === 'h' ? 2
            : curr === 'q' ? 1
              : curr === 'e' ? 0.5
                : curr === 's' ? 0.25 : 0
        )
    }, 0)
}

/*
 * new Note ('A4 q') === 440Hz, quarter note
 * new Note ('- e') === 0Hz (basically a rest), eighth note
 * new Note ('A4 es') === 440Hz, dotted eighth note (eighth + sixteenth)
 * new Note ('A4 0.0125') === 440Hz, 32nd note (or any arbitrary
 * divisor/multiple of 1 beat)
 */

/**
 * Creates a new Note instance from a string
 * @constructor
 * @param {string} str - note string
 */
function Note (str) {
  var couple = str.split(space)
  // frequency, in Hz
  this.frequency = getNoteFrequency(couple[0]) || 0
  // duration, as a ratio of 1 beat (quarter note = 1, half note = 0.5, etc.)
  this.duration = getNoteDuration(couple[1]) || 0
}

/**
 * Create a new Sequence
 * @constructor
 * @param {AudioContext} ac - WebAPI Audio Context
 * @param {number} tempo
 * @param {string[]} arr - array of notes
 */
function Sequence (ac, tempo, arr) {
  this.ac = ac || new AudioContext()
  this.createFxNodes()
  this.tempo = tempo || 120
  this.loop = true
  this.smoothing = 0
  this.staccato = 0
  this.notes = []
  this.push.apply(this, arr || [])
}

// create gain and EQ nodes, then connect 'em
Sequence.prototype.createFxNodes = function () {
  const eq = [['bass', 100], ['mid', 1000], ['treble', 2500]]
  let prev = this.gain = this.ac.createGain()

  eq.forEach((config, filter) => {
    filter = this[config[0]] = this.ac.createBiquadFilter()
    filter.type = 'peaking'
    filter.frequency.value = config[1]
    prev.connect(prev = filter)
  })

  prev.connect(this.ac.destination)

  return this
}

// accepts Note instances or strings (e.g. 'A4 e')
Sequence.prototype.push = function () {
  Array.prototype.forEach.call(arguments, function (note) {
    this.notes.push(note instanceof Note ? note : new Note(note))
  }.bind(this))
  return this
}

// create a custom waveform as opposed to "sawtooth", "triangle", etc
Sequence.prototype.createCustomWave = function (real, imag) {
  // Allow user to specify only one array and dupe it for imag.
  if (!imag) imag = real

  // Wave type must be custom to apply period wave.
  this.waveType = 'custom'

  // Reset customWave
  this.customWave = [new Float32Array(real), new Float32Array(imag)]
}

// recreate the oscillator node (happens on every play)
Sequence.prototype.createOscillator = function () {
  this.stop()
  this.osc = this.ac.createOscillator()

  // customWave should be an array of Float32Arrays. The more elements in
  // each Float32Array, the dirtier (saw-like) the wave is
  if (this.customWave) {
    this.osc.setPeriodicWave(
      this.ac.createPeriodicWave.apply(this.ac, this.customWave)
    )
  } else {
    this.osc.type = this.waveType || 'square'
  }

  this.osc.connect(this.gain)
  return this
}

// schedules this.notes[ index ] to play at the given time
// returns an AudioContext timestamp of when the note will *end*
Sequence.prototype.scheduleNote = function (index, when) {
  const duration = 60 / this.tempo * this.notes[index].duration
  const cutoff = duration * (1 - (this.staccato || 0))

  this.setFrequency(this.notes[index].frequency, when)

  if (this.smoothing && this.notes[index].frequency) {
    this.slide(index, when, cutoff)
  }

  this.setFrequency(0, when + cutoff)
  return when + duration
}

// get the next note
Sequence.prototype.getNextNote = function (index) {
  return this.notes[index < this.notes.length - 1 ? index + 1 : 0]
}

// how long do we wait before beginning the slide? (in seconds)
Sequence.prototype.getSlideStartDelay = function (duration) {
  return duration - Math.min(duration, 60 / this.tempo * this.smoothing)
}

// slide the note at <index> into the next note at the given time,
// and apply staccato effect if needed
Sequence.prototype.slide = function (index, when, cutoff) {
  const next = this.getNextNote(index)
  const start = this.getSlideStartDelay(cutoff)
  this.setFrequency(this.notes[index].frequency, when + start)
  this.rampFrequency(next.frequency, when + cutoff)
  return this
}

// set frequency at time
Sequence.prototype.setFrequency = function (freq, when) {
  this.osc.frequency.setValueAtTime(freq, when)
  return this
}

// ramp to frequency at time
Sequence.prototype.rampFrequency = function (freq, when) {
  this.osc.frequency.linearRampToValueAtTime(freq, when)
  return this
}

// run through all notes in the sequence and schedule them
Sequence.prototype.play = function (when) {
  when = typeof when === 'number' ? when : this.ac.currentTime

  this.createOscillator()
  this.osc.start(when)

  this.notes.forEach(function (note, i) {
    when = this.scheduleNote(i, when)
  }.bind(this))

  this.osc.stop(when)
  this.osc.onended = this.loop ? this.play.bind(this, when) : null

  return this
}

// stop playback, null out the oscillator, cancel parameter automation
Sequence.prototype.stop = function () {
  if (this.osc) {
    this.osc.onended = null
    this.osc.disconnect()
    this.osc = null
  }
  return this
}

export { Note }
export default Sequence
