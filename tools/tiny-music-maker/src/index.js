/* eslint object-property-newline:0 */
// import Sequence from '../../../libs/tiny-music'
// import Sequence from './tiny-music'
const pow = Math.pow
const middleC = 440 * pow(pow(2, 1 / 12), -9)
const numRegex = /(\d+)/
const octaveOffset = 4
const offsets = {
  'A': 9, 'A#': 10, 'Ab': 8,
  'B': 11, 'B#': 0, 'Bb': 10,
  'C': 0, 'C#': 1, 'Cb': 11,
  'D': 2, 'D#': 3, 'Db': 1,
  'E': 4, 'E#': 5, 'Eb': 3,
  'F': 5, 'F#': 6, 'Fb': 4,
  'G': 7, 'G#': 8, 'Gb': 6
}

const durations = { w: 4, h: 2, q: 1, e: 0.5, s: 0.25 }

class Note {
  static getFrequency (noteName) {
    const [note, octave] = noteName.split(numRegex)
    const distance = offsets[note]
    const octaveDiff = (octave || octaveOffset) - octaveOffset
    const frequency = middleC * pow(pow(2, 1 / 12), distance)
    return frequency * pow(2, octaveDiff)
  }

  /**
   * Gets duration as number
   * @param {string} duration - whole, quarter, half, eighth, sixteenth
   */
  static getDuration (duration) {
    return duration.toLowerCase().split('').reduce((total, curr) => {
      // you were remaking getDuration
    })
  }

  /**
   * Creates a Note
   * @param {string} stringNote - A.q
   */
  constructor (stringNote) {
    const [freq, duration] = stringNote.split('.')

    this.frequency = Note.getFrequency(freq)
    this.duration = Note.getDuration(duration)
  }
}

const note = new Note('A2.q')
console.log(note)

class Sequence {
  constructor (ac, tempo, arr) {
    this.audioContext = new AudioContext()
    this.createFxNodes()
    this.connectFxNodes()

    this.tempo = tempo
    this.loop = true
    this.smoothing = 0
    this.staccato = 0
    this.notes = arr.slice()
  }

  createFilter (freq) {
    const filter = this.audioContext.createBiquadFilter()
    filter.type = 'peaking'
    filter.frequency.value = freq
    return filter
  }

  createFxNodes () {
    this.gain = this.audioContext.createGain()
    this.bass = this.createFilter(100)
    this.mid = this.createFilter(1000)
    this.treble = this.createFilter(2500)
  }

  connectFxNodes () {
    this.gain.connect(this.bass)
    this.bass.connect(this.mid)
    this.mid.connect(this.treble)
    this.treble.connect(this.audioContext.destination)
  }
}

const sequence = new Sequence(null, 120, ['- e'])

window.Note = Note
window.Sequence = Sequence
