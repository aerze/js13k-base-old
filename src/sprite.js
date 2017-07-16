import Point from './point'
import Rect from './rect'

/**
 * @typedef {Rect[]} Frameset
 */

export default class Sprite {
  /**
   * @param {Frameset[]} framesets
   * @param {Point} origin
   * @param {Point} scale
   */
  constructor (framesets = [[]], origin = new Point(), scale = new Point(1, 1)) {
    this.framesets = framesets
    this.origin = origin
    this.scale = scale
    this.rotation = 0

    this.currentFrame = 0
    this.currentFrameset = 0
  }
}
