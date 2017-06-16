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

function update (pad, gp) {
  if (gp) {
    const y = gp.axes[1] << 0
    const x = gp.axes[0] << 0
    _set(pad, BUTTONS.UP, gp.axes[1] = y < 0)
    _set(pad, BUTTONS.DOWN, gp.axes[1] = y > 0)
    _set(pad, BUTTONS.LEFT, gp.axes[0] = x < 0)
    _set(pad, BUTTONS.RIGHT, gp.axes[0] = x > 0)
    _set(pad, BUTTONS.START, gp.buttons[8].value > 0)
    _set(pad, BUTTONS.SELECT, gp.buttons[9].value > 0)
    _set(pad, BUTTONS.A, gp.buttons[1].value > 0)
    _set(pad, BUTTONS.B, gp.buttons[2].value > 0)
  }
}

function _set (pad, k, bool) {
  if (pad.isDown[k] !== pad.prevDown[k]) pad.prevDown[k] = pad.isDown[k]
  pad.isDown[k] = bool
}

const Pad = {
  isDown: {},
  prevDown: {},
  justPressed (key) {
    return this.isDown[key] && !this.prevDown[key]
  },
  justReleased (key) {
    return !this.isDown[key] && this.prevDown[key]
  }
}

const TinyPad = [
  Object.create(Pad),
  Object.create(Pad),
  Object.create(Pad),
  Object.create(Pad)
]

TinyPad.update = function () {
  const gps = navigator.getGamepads()
  this.forEach(function (pad, i) {
    update(pad, gps[i])
  })
}

export { BUTTONS }
export default TinyPad
