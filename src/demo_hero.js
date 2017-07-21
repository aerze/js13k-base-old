import Katalyst from './katalyst'

const idleFrames = [
  new Katalyst.Rect(156, 18, 12, 18),
  new Katalyst.Rect(180, 18, 12, 18),
  new Katalyst.Rect(168, 18, 12, 18),
  new Katalyst.Rect(132, 18, 12, 18)
]

const animations = [idleFrames]
const hitbox = [0, 0, 12, 18]
const heroSprite = new Katalyst.Sprite(animations, { x: 0, y: 0 }, { x: 3, y: 3 })

class Hero extends Katalyst.Entity {
  constructor () {
    super(10, 10, hitbox, [heroSprite], 0)
  }

  update (frameCount) {
    const k = Katalyst.Controls()
    const speed = 4

    if (k.right) {
      this.flipped = false
      this.x += speed
    }

    if (k.left) {
      this.flipped = true
      this.x -= speed
    }

    if (k.up) this.y -= speed

    if (k.down) this.y += speed
  }
}

export default new Hero()
