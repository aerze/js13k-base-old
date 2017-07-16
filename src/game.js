// import TinyCanvas, { CreateTexture } from './canvas'
import TinyCanvas, { CreateTexture } from '../libs/tiny-canvas'
import Engine from './engine'

export default class Game {
  /**
   *
   * @param {HTMLCanvasElement} tinyCanvas
   * @param {string} spriteSource
   */
  constructor (canvas, spriteSource, ready) {
    console.log(canvas)
    this.tinyCanvas = new TinyCanvas(canvas)
    this.spritesheet = new Image()
    this.spritesheet.src = spriteSource
    this.spritesheet.onload = this.onload.bind(this)
    this.spritesheetTexture = null
    this.ready = ready
  }

  onload () {
    const { tinyCanvas, spritesheet } = this
    this.spritesheetTexture = CreateTexture(tinyCanvas.g, spritesheet, spritesheet.width, spritesheet.height)
    this.tinyCanvas.bkg(0.133, 0.125, 0.204)
    this.engine = new Engine(this.tinyCanvas, this.spritesheetTexture)
    this.engine.loop()
    this.ready(this)
  }
}
