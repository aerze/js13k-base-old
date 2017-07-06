import TinyCanvas, { CreateTexture } from './canvas'
import Sprite from './sprite'

export default class Entity {
  /**
   * Base renderable object
   * @param {number} layer
   * @param {number} x
   * @param {number} y
   * @param {number[]} hitbox
   * @param {Sprite[]} spriteStack
   * @param {function|null} updateFunction
   * @param {number} type
   */
  constructor (layer, x = 0, y = 0, hitbox, spriteStack, update = null, type) {
    this.layer = layer
    this.x = x
    this.y = y
    this.r = 0
    this.xv = 0
    this.yv = 0
    this.hitbox = hitbox
    this.spriteStack = spriteStack
    this.update = update
  }

  delete () {

  }

  update () {

  }

  /**
   * Draw entity to a canvas
   * @param {} canvas
   * @param {WebGLTexture} texture
   */
  draw (canvas, texture) {
    this.spriteStack.forEach((sprite) => {
      canvas.push()

      canvas.trans(
        this.x + (sprite.origin.x),
        this.y + (sprite.origin.y)
      )

      canvas.rot(sprite.rotation)

      if (sprite.color) {
        canvas.col = sprite.color
      }

      if (sprite.scale.x || sprite.scale.y) {
        canvas.scale(sprite.scale.x, sprite.scale.y)
      }

      const currentFramesetLength = sprite.frameset[sprite.currentFrameset].length
      const frameCheck = sprite.currentFrame > currentFramesetLength - 1

      if (frameCheck) sprite.currentFrame = 0

      const frame = sprite.framesets[sprite.currentFrameset][sprite.currentFrame]

      if (frameCheck % 4 === 0) {
        if (frameCheck) sprite.currentFrame = 0
        else sprite.currentFrame++
      }

      var x1 = frame.x / texture.width
      var x2 = (frame.x + frame.width) / texture.width
      var y1 = frame.y / texture.height
      var y2 = (frame.y + frame.height) / texture.height

      canvas.img(
        texture,
        0, 0,
        frame.width,
        frame.height,
        sprite.flipped ? x2 : x1,
        y1,
        sprite.flipped ? x1 : x2,
        y2
      )

      canvas.col = 0xFFFFFFFF
      canvas.pop()
    })
  }
}
