
/**
 * Compiles shader from source
 * @param {WebGLRenderingContext} gl
 * @param {string} source
 * @param {number} type
 */
function CompileShader (gl, source, type) {
  var shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader
}

/**
 * Creates a program using 2 shaders
 * @param {WebGLRenderingContext} gl
 * @param {string} vsSource - vertex shader
 * @param {string} fsSource - fragment shader
 */
function CreateShaderProgram (gl, vsSource, fsSource) {
  const program = gl.createProgram()
  const vShader = CompileShader(gl, vsSource, 35633)
  const fShader = CompileShader(gl, fsSource, 35632)
  gl.attachShader(program, vShader)
  gl.attachShader(program, fShader)
  gl.linkProgram(program)
  return program
}

/**
 * Creates WebGLBuffer
 * @param {WebGLRenderingContext} gl
 * @param {number} bufferType
 * @param {number} size
 * @param {number} usage
 */
function CreateBuffer (gl, bufferType, size, usage) {
  var buffer = gl.createBuffer()
  gl.bindBuffer(bufferType, buffer)
  gl.bufferData(bufferType, size, usage)
  return buffer
}

/**
 * Creates a texture render-able by TinyCanvas.img()
 * @param {WebGLRenderingContext} gl
 * @param {ImageBitmap | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement} image
 * @param {number} width
 * @param {number} height
 */
export function CreateTexture (gl, image, width, height) {
  var texture = gl.createTexture()
  gl.bindTexture(3553, texture)
  gl.texParameteri(3553, 10242, 33071)
  gl.texParameteri(3553, 10243, 33071)
  gl.texParameteri(3553, 10240, 9728)
  gl.texParameteri(3553, 10241, 9728)
  gl.texImage2D(3553, 0, 6408, 6408, 5121, image)
  gl.bindTexture(3553, null)
  texture.width = width
  texture.height = height
  return texture
}

export default class TinyCanvas {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor (canvas) {
    const gl = canvas.getContext('webgl')
    this.VERTEX_SIZE = (4 * 2) + (4 * 2) + (4)
    this.MAX_BATCH = 10922 // floor((2 ^ 16) / 6)
    this.VERTICES_PER_QUAD = 6
    const VERTEX_DATA_SIZE = this.VERTEX_SIZE * this.MAX_BATCH * 4
    const INDEX_DATA_SIZE = this.MAX_BATCH * (2 * this.VERTICES_PER_QUAD)
    const shader = CreateShaderProgram(gl, `
      precision lowp float;
      attribute vec2 a, b;
      attribute vec4 c;
      varying vec2 d;
      varying vec4 e;
      uniform mat4 m;
      uniform vec2 r;
      void main(){
        gl_Position=m*vec4(a,1.0,1.0);
        d=b;
        e=c;
      }`, `
      precision lowp float;
      varying vec2 d;
      varying vec4 e;
      uniform sampler2D f;
      void main(){
        gl_FragColor=texture2D(f,d)*e;
      }`
    )

    this.vertexData = new ArrayBuffer(VERTEX_DATA_SIZE)
    this.vPositionData = new Float32Array(this.vertexData)
    this.vColorData = new Uint32Array(this.vertexData)
    let vIndexData = new Uint16Array(INDEX_DATA_SIZE)
    const IBO = CreateBuffer(gl, 34963, vIndexData.byteLength, 35044)
    const VBO = CreateBuffer(gl, 34962, this.vertexData.byteLength, 35048)
    this.count = 0
    this.matrix = new Float32Array([1, 0, 0, 1, 0, 0])
    this.stack = new Float32Array(100)
    this.stackp = 0
    this.currentTexture = null
    let locA
    let locB
    let locC
    let indexA
    let indexB

    gl.blendFunc(770, 771)
    gl.enable(3042)
    gl.useProgram(shader)
    gl.bindBuffer(34963, IBO)
    for (indexA = indexB = 0; indexA < this.MAX_BATCH * this.VERTICES_PER_QUAD; indexA += this.VERTICES_PER_QUAD, indexB += 4) {
      vIndexData[indexA + 0] = indexB
      vIndexData[indexA + 1] = indexB + 1
      vIndexData[indexA + 2] = indexB + 2
      vIndexData[indexA + 3] = indexB + 0
      vIndexData[indexA + 4] = indexB + 3
      vIndexData[indexA + 5] = indexB + 1
    }

    gl.bufferSubData(34963, 0, vIndexData)
    gl.bindBuffer(34962, VBO)
    locA = gl.getAttribLocation(shader, 'a')
    locB = gl.getAttribLocation(shader, 'b')
    locC = gl.getAttribLocation(shader, 'c')
    gl.enableVertexAttribArray(locA)
    gl.vertexAttribPointer(locA, 2, 5126, 0, this.VERTEX_SIZE, 0)
    gl.enableVertexAttribArray(locB)
    gl.vertexAttribPointer(locB, 2, 5126, 0, this.VERTEX_SIZE, 8)
    gl.enableVertexAttribArray(locC)
    gl.vertexAttribPointer(locC, 4, 5121, 1, this.VERTEX_SIZE, 16)
    gl.uniformMatrix4fv(gl.getUniformLocation(shader, 'm'), 0,
      new Float32Array([
        2 / canvas.width, 0, 0, 0,
        0, -2 / canvas.height, 0, 0,
        0, 0, 1, 1, -1, 1, 0, 0
      ])
    )
    gl.activeTexture(33984)

    this.gl = gl
    this.canvas = canvas
    this.width = canvas.width
    this.height = canvas.height
    this.color = 0xFFFFFFFF
    this.background = this.background.bind(this)
    this.clear = this.clear.bind(this)
    this.translate = this.translate.bind(this)
    this.scale = this.scale.bind(this)
    this.rotate = this.rotate.bind(this)
    this.push = this.push.bind(this)
    this.pop = this.pop.bind(this)
    this.image = this.image.bind(this)
    this.flush = this.flush.bind(this)
  }

  /**
   * Sets the background color. Maps to glClearColor.
   * It requires normalized to 1.0 values
   * @param {number} red
   * @param {number} green
   * @param {number} blue
   * @param {number} alpha
   */
  background (red, green, blue, alpha = 1) {
    this.gl.clearColor(red, green, blue, alpha)
  }

  /**
   * Clear the current frame buffer
   */
  clear () {
    this.gl.clear(16384)
  }

  /**
   * Applies translate transformation to current matrix
   * @param {number} x
   * @param {number} y
   */
  translate (x, y) {
    const { matrix } = this
    matrix[4] = matrix[0] * x + matrix[2] * y + matrix[4]
    matrix[5] = matrix[1] * x + matrix[3] * y + matrix[5]
  }

  /**
   * Applies scale transformation to current matrix
   * @param {number} x
   * @param {number} y
   */
  scale (x, y) {
    const { matrix } = this
    matrix[0] = matrix[0] * x
    matrix[1] = matrix[1] * x
    matrix[2] = matrix[2] * y
    matrix[3] = matrix[3] * y
  }

  /**
   * Applies rotation transformation to current matrix
   * @param {number} r - radians
   */
  rotate (radians) {
    const { matrix } = this
    const a = matrix[0]
    const b = matrix[1]
    const c = matrix[2]
    const d = matrix[3]
    const sr = Math.sin(radians)
    const cr = Math.cos(radians)

    matrix[0] = a * cr + c * sr
    matrix[1] = b * cr + d * sr
    matrix[2] = a * -sr + c * cr
    matrix[3] = b * -sr + d * cr
  }

  /**
   * Pushes the current matrix into the matrix stack
   */
  push () {
    const { stack, matrix } = this
    let { stackp } = this
    stack[stackp + 0] = matrix[0]
    stack[stackp + 1] = matrix[1]
    stack[stackp + 2] = matrix[2]
    stack[stackp + 3] = matrix[3]
    stack[stackp + 4] = matrix[4]
    stack[stackp + 5] = matrix[5]
    stackp += 6
  }

  /**
   * Pops the matrix stack into the current matrix
   */
  pop () {
    const { stack, matrix } = this
    let { stackp } = this
    stackp -= 6
    matrix[0] = stack[stackp + 0]
    matrix[1] = stack[stackp + 1]
    matrix[2] = stack[stackp + 2]
    matrix[3] = stack[stackp + 3]
    matrix[4] = stack[stackp + 4]
    matrix[5] = stack[stackp + 5]
  }

  /**
   * Batches texture rendering properties.
   * NOTE: If you are not drawing a tile of a texture then you can set u0 = 0, v0 = 0, u1 = 1 and v1 = 1
   * @param {WebGLTexture} texture
   * @param {number} x
   * @param {number} y
   * @param {number} w - width
   * @param {number} h - height
   * @param {number} u0
   * @param {number} v0
   * @param {number} u1
   * @param {number} v1
   */
  image (texture, x, y, w, h, u0, v0, u1, v1) {
    const { matrix } = this
    const x0 = x
    const y0 = y
    const x1 = x + w
    const y1 = y + h
    const x2 = x
    const y2 = y + h
    const x3 = x + w
    const y3 = y
    const a = matrix[0]
    const b = matrix[1]
    const c = matrix[2]
    const d = matrix[3]
    const e = matrix[4]
    const f = matrix[5]
    let offset = 0
    const argb = this.color

    if (texture !== this.currentTexture || this.count + 1 >= this.MAX_BATCH) {
      this.gl.bufferSubData(34962, 0, this.vertexData)
      this.gl.drawElements(4, this.count * this.VERTICES_PER_QUAD, 5123, 0)
      this.count = 0
      if (this.currentTexture !== texture) {
        this.currentTexture = texture
        this.gl.bindTexture(3553, this.currentTexture)
      }
    }

    offset = this.count * this.VERTEX_SIZE
    // Vertex Order
    // Vertex Position | UV | ARGB
    // Vertex 1
    this.vPositionData[offset++] = x0 * a + y0 * c + e
    this.vPositionData[offset++] = x0 * b + y0 * d + f
    this.vPositionData[offset++] = u0
    this.vPositionData[offset++] = v0
    this.vColorData[offset++] = argb

    // Vertex 2
    this.vPositionData[offset++] = x1 * a + y1 * c + e
    this.vPositionData[offset++] = x1 * b + y1 * d + f
    this.vPositionData[offset++] = u1
    this.vPositionData[offset++] = v1
    this.vColorData[offset++] = argb

    // Vertex 3
    this.vPositionData[offset++] = x2 * a + y2 * c + e
    this.vPositionData[offset++] = x2 * b + y2 * d + f
    this.vPositionData[offset++] = u0
    this.vPositionData[offset++] = v1
    this.vColorData[offset++] = argb

    // Vertex 4
    this.vPositionData[offset++] = x3 * a + y3 * c + e
    this.vPositionData[offset++] = x3 * b + y3 * d + f
    this.vPositionData[offset++] = u1
    this.vPositionData[offset++] = v0
    this.vColorData[offset++] = argb

    if (++this.count >= this.MAX_BATCH) {
      this.gl.bufferSubData(34962, 0, this.vertexData)
      this.gl.drawElements(4, this.count * this.VERTICES_PER_QUAD, 5123, 0)
      this.count = 0
    }
  }

  /**
   * Pushes the current batch information to the GPU for rendering
   */
  flush () {
    if (this.count === 0) return
    this.gl.bufferSubData(34962, 0, this.vPositionData.subarray(0, this.count * this.VERTEX_SIZE))
    this.gl.drawElements(4, this.count * this.VERTICES_PER_QUAD, 5123, 0)
    this.count = 0
  }
}
