import Katalyst from './katalyst'

function makeFrame (x, y) {
  return new Katalyst.Rect(x, y, 12, 18)
}

const idleFrames = [
  makeFrame(156, 18),
  makeFrame(180, 18),
  makeFrame(168, 18),
  makeFrame(132, 18)
]

const runFrames = [
  makeFrame(36, 18),
  makeFrame(100, 0),
  makeFrame(52, 0),
  makeFrame(40, 0),
  makeFrame(4, 0),
  makeFrame(16, 0),
  makeFrame(28, 0),
  makeFrame(76, 0),
  makeFrame(124, 0),
  makeFrame(112, 0)
]

const IDLE = 0
const RUN = 1

const animations = [idleFrames, runFrames]

const FRICTION = 7 // 4
const GRAVITY = 10
const JUMP_ACCELERATION = 20 // 30
const X_ACCELERATION = 2 // 5

class Hero extends Katalyst.Entity {
  constructor () {
    const scale = 3
    const hero = new Katalyst.Sprite(animations, { x: 0, y: 0 }, { x: scale, y: scale })
    super(
      10, 10,
      [0, 0, 12, 18],
      [hero],
      0)

    this.hero = hero
    this.jumped = false
    this.scale = scale
    this.xa = 0
    this.ya = 0
  }

  /**
   * hero update
   * @param {number} frameCount
   * @param {TinyCanvas} canvas
   */
  update (frameCount, canvas) {
    const k = Katalyst.Controls()
    const ground = canvas.height - (this.hitbox[3] * this.scale)
    const rightBound = canvas.width - (this.hitbox[2] * this.scale)

    if (k.right) {
      if (!k.shift) {
        this.flipped = false
      }

      if (!this.jumped) {
        this.xa += X_ACCELERATION
      } else {
        this.xa += X_ACCELERATION / 2
      }
    }

    if (k.left) {
      if (!k.shift) {
        this.flipped = true
      }

      if (!this.jumped) {
        this.xa -= X_ACCELERATION
      } else {
        this.xa -= X_ACCELERATION / 2
      }
    }

    if (k.up && !this.jumped) {
      this.jumped = true
      this.ya -= JUMP_ACCELERATION
    }

    // Handle horizontal friction
    const xDiff = 0 - this.xa
    if (Math.abs(xDiff) >= 2) {
      this.xa += (xDiff / FRICTION)
    } else {
      this.xa = 0
    }

    // Handle vertical gravity
    const gDiff = GRAVITY - this.ya
    if (Math.abs(gDiff) >= 2) {
      this.ya += gDiff / GRAVITY
    } else {
      this.ya = GRAVITY
    }

    // clamp speed
    if (this.xa >= 15) {
      this.xa = 15
    }
    if (this.xa <= -15) {
      this.xa = -15
    }

    // Handle acceleration
    this.x += this.xa
    this.y += this.ya

    if (this.xa) {
      this.hero.currentFrameset = RUN
    } else {
      this.hero.currentFrameset = IDLE
    }

    // clamp to screen
    if (this.y <= 0) {
      this.y = 0
    }
    if (this.y >= ground) {
      this.y = ground
      this.ya = 0
      this.jumped = false
    }
    if (this.x <= 0) {
      this.x = 0
      this.xa = 0
    }
    if (this.x >= rightBound) {
      this.x = rightBound
      this.xa = 0
    }
  }
}

export default new Hero()
