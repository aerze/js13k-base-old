import Entity from './entity'

export default class Group {
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
   */
  update (frameCount) {
    for (const id in this.list) {
      this.list[id].update(frameCount)
    }
  }

  /**
   * Calls draw() on every entity in the group
   * @param {number} frameCount
   * @param {object} canvas
   * @param {WebGLTexture} texture
   */
  draw (frameCount, canvas, texture) {
    for (const id in this.list) {
      this.list[id].draw(frameCount, canvas, texture)
    }
  }
}
