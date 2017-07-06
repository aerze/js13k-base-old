import Engine from './engine'
import TinyCanvas, { CreateTexture } from './canvas'

export default class Game {
  /**
   *
   * @param {HTMLCanvasElement} tinyCanvas
   * @param {string} spriteSource
   */
  constructor (canvas, spriteSource) {
    console.log(canvas)
    this.tinyCanvas = new TinyCanvas(canvas)
    this.spritesheet = new Image()
    this.spritesheet.src = spriteSource
    this.spritesheet.onload = this.onload.bind(this)
    this.spritesheetTexture = null
  }

  onload () {
    const { tinyCanvas, spritesheet } = this
    this.spritesheetTexture = CreateTexture(tinyCanvas.gl, spritesheet, spritesheet.width, spritesheet.height)
    this.tinyCanvas.background(0.133, 0.125, 0.204)
    this.engine = new Engine(this.tinyCanvas, this.spritesheetTexture)
    this.engine.loop()
  }
}
