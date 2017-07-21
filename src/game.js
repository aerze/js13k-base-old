import TinyCanvas from './tinyCanvas'
import Scene from './scene'

export default class Game {
  /**
   * @param {TinyCanvas} canvas
   * @param {WebGLTexture} texture
   */
  constructor (canvas, texture) {
    this.canvas = canvas
    this.texture = texture
    this.scenes = {}
    this.activeScene = null

    this.frameCount = 0

    this.loop = this.loop.bind(this)
  }

  /**
   * Creates and returns a new scene
   * @param {string} name - scene key
   * @returns {Scene}
   */
  addScene (name) {
    const scene = new Scene(name)
    if (!this.activeScene) this.activeScene = scene
    return this.scenes[name] = scene
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
    this.activeScene &&
    this.activeScene.update(this.frameCount)
  }

  draw () {
    this.activeScene &&
    this.activeScene.draw(this.frameCount, this.canvas, this.texture)
  }
}
