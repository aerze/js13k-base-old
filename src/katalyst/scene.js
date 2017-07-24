import TinyCanvas from './tinyCanvas'
import Group from './group'

/**
 * @memberof Katalyst
 */
class Scene {
  /**
   * Collection of groups
   */
  constructor () {
    this.groups = {}
  }

  /**
   * Creates and adds a new group to the scene
   * @param {string} groupName
   */
  addGroup (groupName) {
    return this.groups[groupName] = new Group(groupName)
  }

  /**
   * Calls update() on all groups in the scene
   * @param {number} frameCount
   * @param {TinyCanvas} canvas
   */
  update (frameCount, canvas) {
    for (const name in this.groups) {
      this.groups[name].update(frameCount, canvas)
    }
  }

  /**
   * Calls draw() on all groups in the scene
   * @param {number} frameCount
   * @param {TinyCanvas} canvas
   * @param {WebGLTexture} texture
   */
  draw (frameCount, canvas, texture) {
    for (const name in this.groups) {
      this.groups[name].draw(frameCount, canvas, texture)
    }
  }
}

export default Scene
