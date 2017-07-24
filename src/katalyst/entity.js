import TinyCanvas from './tinyCanvas'
import Sprite from './sprite'

/**
 * Base renderable game object
 * @memberof Katalyst
 */
class Entity {
  /**
   * Base renderable game object
   * @param {number} x
   * @param {number} y
   * @param {Array<number>} hitbox
   * @param {Array<Sprite>} spriteStack
   * @param {number} type
   */
  constructor (x = 0, y = 0, hitbox, spriteStack, type) {
    this.x = x
    this.y = y
    this.r = 0
    this.xv = 0
    this.yv = 0
    this.hitbox = hitbox
    this.spriteStack = spriteStack
    this.type = type
    this.flipped = false
  }

  /**
   * Run entity update logic
   * @param {number} frameCount
   * @param {TinyCanvas} canvas
   */
  update (frameCount, canvas) {

  }

  /**
   * Draw entity to a canvas
   * @param {number} frameCount
   * @param {TinyCanvas} canvas
   * @param {WebGLTexture} texture
   */
  draw (frameCount, canvas, texture) {
    this.spriteStack.forEach((sprite) => {
      canvas.push()

      canvas.trans(
        this.x + (sprite.origin.x),
        this.y + (sprite.origin.y)
      )

      canvas.rot(sprite.rotation)

      canvas.col = sprite.color

      if (sprite.scale.x || sprite.scale.y) {
        canvas.scale(sprite.scale.x, sprite.scale.y)
      }

      const currentFramesetLength = sprite.framesets[sprite.currentFrameset].length
      const frameCheck = sprite.currentFrame > currentFramesetLength - 1

      if (frameCheck) sprite.currentFrame = 0

      const frame = sprite.framesets[sprite.currentFrameset][sprite.currentFrame]

      if (frameCount % 4 === 0) {
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
        this.flipped ? x2 : x1,
        y1,
        this.flipped ? x1 : x2,
        y2
      )

      canvas.col = 0xFFFFFFFF
      canvas.pop()
    })
  }
}

export default Entity
