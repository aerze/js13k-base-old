import TinyCanvas from './tinyCanvas'
import Entity from './entity'

/**
 * @memberof Katalyst
 */
class Group {
  /**
   * A collection of Entities
   * @param {string} name
   */
  constructor (name) {
    this.name = `group:${name}`
    this.counter = 0
    this.list = {}
  }

  /**
   * add entity to render list
   * @param {Entity} entity
   */
  addEntity (entity) {
    this.list[this.counter] = entity
    entity.groupName = this.groupName
    entity.groupId = this.counter
    this.counter++
  }

  /**
   * Calls update() on every entity in the group
   * @param {number} frameCount
   * @param {TinyCanvas} canvas
   */
  update (frameCount, canvas) {
    for (const id in this.list) {
      this.list[id].update(frameCount, canvas)
    }
  }

  /**
   * Calls draw() on every entity in the group
   * @param {number} frameCount
   * @param {TinyCanvas} canvas
   * @param {WebGLTexture} texture
   */
  draw (frameCount, canvas, texture) {
    for (const id in this.list) {
      this.list[id].draw(frameCount, canvas, texture)
    }
  }
}

export default Group
