const BUTTONS = {
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4,
  START: 5,
  SELECT: 6,
  A: 7,
  B: 8
}

class SimplePad {
  constructor () {
    this.isDown = {}
    this.prevDown = {}
  }

  update (gp) {
    if (gp) {
      const y = gp.axes[1] << 0
      const x = gp.axes[0] << 0
      this._set(BUTTONS.UP, gp.axes[1] = y < 0)
      this._set(BUTTONS.DOWN, gp.axes[1] = y > 0)
      this._set(BUTTONS.LEFT, gp.axes[0] = x < 0)
      this._set(BUTTONS.RIGHT, gp.axes[0] = x > 0)
      this._set(BUTTONS.START, gp.buttons[8].value > 0)
      this._set(BUTTONS.SELECT, gp.buttons[9].value > 0)
      this._set(BUTTONS.A, gp.buttons[1].value > 0)
      this._set(BUTTONS.B, gp.buttons[2].value > 0)
    }
  }

  _set (k, bool) {
    if (this.isDown[k] !== this.prevDown[k]) this.prevDown[k] = this.isDown[k]
    this.isDown[k] = bool
  }

  justPressed (key) {
    return this.isDown[key] && !this.prevDown[key]
  }

  justReleased (key) {
    return !this.isDown[key] && this.prevDown[key]
  }
}

class TinyPad {
  constructor () {
    this[0] = new SimplePad()
    // this[1] = new SimplePad()
    // this[2] = new SimplePad()
    // this[3] = new SimplePad()
  }

  /**
   * Updates the SimplePads
   * Should be called every game loop update
   */
  update () {
    const gps = navigator.getGamepads()
    this[0].update(gps[0])
    // this[1].update(gps[1])
    // this[2].update(gps[2])
    // this[3].update(gps[3])
  }
}

export { BUTTONS }
export default TinyPad
