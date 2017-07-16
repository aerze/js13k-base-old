import TinyCanvas from './canvas'
import layers from './layers'

export default class Engine {
  /**
   * @param {TinyCanvas} canvas
   * @param {WebGLTexture} texture
   */
  constructor (canvas, texture) {
    this.canvas = canvas
    this.texture = texture
    this.layers = layers

    this.frameCount = 0

    this.loop = this.loop.bind(this)
    this.update = this.update.bind(this)
    this.draw = this.draw.bind(this)
  }

  loop () {
    // console.log('loop')
    requestAnimationFrame(this.loop)
    this.update()
    this.canvas.cls()
    this.draw()
    this.canvas.flush()
    this.frameCount++
  }

  update () {
    // check game for start new game trigger

    // check for pause trigger

    // update all entities
    for (let i = 0; i < this.layers.length; i++) {
      for (let j = 0; j < this.layers[i].length; j++) {
        this.layers[i][j].update()
      }
    }
  }

  draw () {
    // console.log(this.layers)
    for (let i = 0; i < this.layers.length; i++) {
      for (let j = 0; j < this.layers[i].length; j++) {
        console.log(this.layers[i][j])
        this.layers[i][j].draw(this.frameCount, this.canvas, this.texture)
      }
    }
  }
}
