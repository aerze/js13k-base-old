import Point from './point'
import Rect from './rect'

/**
 * @typedef {Rect[]} Frameset
 */

export default class Sprite {
  /**
   * @param {Point} origin
   * @param {Point} scale
   * @param {Frameset[]} framesets
   */
  constructor (origin, scale, framesets) {
    this.origin = origin || new Point()
    this.scale = scale || new Point()
    this.framesets = framesets || [[ new Rect() ]]

    this.currentFrame = 0
    this.currentFrameset = 0
  }
}
