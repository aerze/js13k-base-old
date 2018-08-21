import { createShaderProgram } from './utils'

class Point {
  constructor (x = 1, y = 1) {
    this.x = x
    this.y = y
  }
}

export class Entity {
  constructor (x, y, w, h) {
    this.pos = new Point(x, y)
    this.dim = new Point(w, h)
    this.scale = new Point(1, 1)
    this.origin = new Point(0, 0)
    this.radians = 0
  }

  draw (core) {
    core.add()
    core.translate(this.pos)
    core.rotate(this.angle)
    core.scale(this.scale)
    core.draw()
  }
}

const vert = `#version 300 es
  in vec2 a_pos;
  uniform mat3 u_mat;
  void main() {
    gl_Position = vec4((u_mat * vec3(a_pos, 1)).xy, 0, 1);
  }`

const frag = `#version 300 es
  precision mediump float;
  uniform vec4 u_col;
  out vec4 outColor;
  void main() {
    outColor = u_col;
  }`

export default class Core {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor (canvas, systems = []) {
    const gl = this.gl = canvas.getContext('webgl2')
    const program = this.program = createShaderProgram(gl, vert, frag)
    this.systems = systems
    this.posLoc = gl.getAttribLocation(program, 'a_pos')
    this.colLoc = gl.getUniformLocation(program, 'u_col')
    this.matLoc = gl.getUniformLocation(program, 'u_mat')

    this.positions = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positions)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30]),
      gl.DYNAMIC_DRAW
    )

    this.vao = gl['createVertexArray']()
    gl['bindVertexArray'](this.vao)
    gl.enableVertexAttribArray(this.posLoc)
    gl.vertexAttribPointer(this.posLoc, 2, gl.FLOAT, false, 0, 0)

    systems.forEach(system => system.init && system.init())

    this.angle = 0
    this.scale = [1, 1]
    this.trans = [0, 0]

    this.lastLoop = 0
    this.pause = false

    this.loop = this.loop.bind(this)
    requestAnimationFrame(this.loop)
  }

  /**
   * @param {number} now ms
   */
  loop (now) {
    const { canvas, gl, program } = this
    const delta = (now || 0) - this.lastLoop
    this.lastLoop = now

    this.resize(canvas)

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(program)
    gl['bindVertexArray'](this.vao)

    this.update(delta)
    this.render(delta)

    gl.drawArrays(gl.TRIANGLES, 0, 18)
    if (!this.pause) requestAnimationFrame(this.loop)
  }

  update () {
    this.systems.forEach(system => system.update && system.update())
  }

  render () {
    this.systems.forEach(system => system.render && system.render())
  }

  /**
   * Make the drawing buffer match the size of the stretched canvas
   * @param {HTMLCanvasElement} canvas
   */
  resize (canvas) {
    // css pixels to real pixels
    // const ratio = window.devicePixelRatio || 1
    const ratio = 1
    const { clientWidth, clientHeight, width, height } = canvas
    const displayWidth = Math.floor(clientWidth * ratio)
    const displayHeight = Math.floor(clientHeight * ratio)

    if (width !== displayWidth || height !== displayHeight) {
      canvas.width = clientWidth
      canvas.height = clientHeight
    }
  }
}
