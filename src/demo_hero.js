import Katalyst from './katalyst'
import keys from './controls'

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
    const k = keys()

    if (k.right) this.x += 4
    if (k.left) this.x -= 4
    if (k.up) this.y -= 4
    if (k.down) this.y += 4
  }
}

export default new Hero()
