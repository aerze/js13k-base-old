/*
 * TinyCanvas module (https://github.com/bitnenfer/tiny-canvas)
 * Developed by Felipe Alfonso -> https://twitter.com/bitnenfer/
 *
 *  ----------------------------------------------------------------------
 *
 *             DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                     Version 2, December 2004
 *
 *  Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>
 *
 *  Everyone is permitted to copy and distribute verbatim or modified
 *  copies of this license document, and changing it is allowed as long
 *  as the name is changed.
 *
 *             DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *    TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 *   0. You just DO WHAT THE FUCK YOU WANT TO.
 *
 *  ----------------------------------------------------------------------
 *
 */

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
function CreateTexture (gl, image, width, height) {
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

/**
 * TinyCanvas Constructor
 * @class
 * @constructor
 * @param {HTMLCanvasElement} canvas
 */
function TinyCanvas (canvas) {
  /** @type {WebGLRenderingContext} */
  const gl = canvas.getContext('webgl')
  const VERTEX_SIZE = (4 * 2) + (4 * 2) + (4)
  const MAX_BATCH = 10922 // floor((2 ^ 16) / 6)
  // const MAX_STACK = 100
  // const MAT_SIZE = 6
  const VERTICES_PER_QUAD = 6
  // const MAT_STACK_SIZE = MAX_STACK * MAT_SIZE
  const VERTEX_DATA_SIZE = VERTEX_SIZE * MAX_BATCH * 4
  const INDEX_DATA_SIZE = MAX_BATCH * (2 * VERTICES_PER_QUAD)
  const width = canvas.width
  const height = canvas.height
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
    }`)

  const glBufferSubData = gl.bufferSubData.bind(gl)
  const glDrawElements = gl.drawElements.bind(gl)
  const glBindTexture = gl.bindTexture.bind(gl)
  const glClear = gl.clear.bind(gl)
  const glClearColor = gl.clearColor.bind(gl)
  const vertexData = new ArrayBuffer(VERTEX_DATA_SIZE)
  const vPositionData = new Float32Array(vertexData)
  const vColorData = new Uint32Array(vertexData)
  let vIndexData = new Uint16Array(INDEX_DATA_SIZE)
  const IBO = CreateBuffer(gl, 34963, vIndexData.byteLength, 35044)
  const VBO = CreateBuffer(gl, 34962, vertexData.byteLength, 35048)
  let count = 0
  const mat = new Float32Array([1, 0, 0, 1, 0, 0])
  const stack = new Float32Array(100)
  let stackp = 0
  const cos = Math.cos
  const sin = Math.sin
  let currentTexture = null
  let locA
  let locB
  let locC
  let indexA
  let indexB

  gl.blendFunc(770, 771)
  gl.enable(3042)
  gl.useProgram(shader)
  gl.bindBuffer(34963, IBO)
  for (indexA = indexB = 0; indexA < MAX_BATCH * VERTICES_PER_QUAD; indexA += VERTICES_PER_QUAD, indexB += 4) {
    vIndexData[indexA + 0] = indexB
    vIndexData[indexA + 1] = indexB + 1
    vIndexData[indexA + 2] = indexB + 2
    vIndexData[indexA + 3] = indexB + 0
    vIndexData[indexA + 4] = indexB + 3
    vIndexData[indexA + 5] = indexB + 1
  }

  glBufferSubData(34963, 0, vIndexData)
  gl.bindBuffer(34962, VBO)
  locA = gl.getAttribLocation(shader, 'a')
  locB = gl.getAttribLocation(shader, 'b')
  locC = gl.getAttribLocation(shader, 'c')
  gl.enableVertexAttribArray(locA)
  gl.vertexAttribPointer(locA, 2, 5126, 0, VERTEX_SIZE, 0)
  gl.enableVertexAttribArray(locB)
  gl.vertexAttribPointer(locB, 2, 5126, 0, VERTEX_SIZE, 8)
  gl.enableVertexAttribArray(locC)
  gl.vertexAttribPointer(locC, 4, 5121, 1, VERTEX_SIZE, 16)
  gl.uniformMatrix4fv(gl.getUniformLocation(shader, 'm'), 0,
    new Float32Array([
      2 / width, 0, 0, 0,
      0, -2 / height, 0, 0,
      0, 0, 1, 1, -1, 1, 0, 0
    ])
  )
  gl.activeTexture(33984)
  const renderer = {
    /**
     * Reference to the WebGL Context used by the renderer
     * @type {WebGLRenderingContext}
     */
    g: gl,

    /**
     * Reference to the HTML Canvas Element used by the renderer
     * @type {HTMLCanvasElement}
     */
    c: canvas,

    /**
     * Integer number representing the current tint color on the canvas. It's represented like ARGB (ex: 0xFF FF FF FF)
     * @type {number}
     */
    col: 0xFFFFFFFF,

    /**
     *  Sets the background color. Maps to glClearColor. It requires normalized to 1.0 values
     * @param {number} r - red
     * @param {number} g - green
     * @param {number} b - blue
     */
    bkg (r, g, b) {
      glClearColor(r, g, b, 1)
    },

    /**
     * Clear the current frame buffer
     */
    cls () {
      glClear(16384)
    },

    /**
     * Applies translate transformation to current matrix
     * @param {number} x
     * @param {number} y
     */
    trans (x, y) {
      mat[4] = mat[0] * x + mat[2] * y + mat[4]
      mat[5] = mat[1] * x + mat[3] * y + mat[5]
    },

    /**
     * Applies scale transformation to current matrix
     * @param {number} x
     * @param {number} y
     */
    scale (x, y) {
      mat[0] = mat[0] * x
      mat[1] = mat[1] * x
      mat[2] = mat[2] * y
      mat[3] = mat[3] * y
    },

    /**
     * Applies rotation transformation to current matrix
     * @param {number} r - radians
     */
    rot (r) {
      const a = mat[0]
      const b = mat[1]
      const c = mat[2]
      const d = mat[3]
      const sr = sin(r)
      const cr = cos(r)

      mat[0] = a * cr + c * sr
      mat[1] = b * cr + d * sr
      mat[2] = a * -sr + c * cr
      mat[3] = b * -sr + d * cr
    },

    /**
     * Pushes the current matrix into the matrix stack
     */
    push () {
      stack[stackp + 0] = mat[0]
      stack[stackp + 1] = mat[1]
      stack[stackp + 2] = mat[2]
      stack[stackp + 3] = mat[3]
      stack[stackp + 4] = mat[4]
      stack[stackp + 5] = mat[5]
      stackp += 6
    },

    /**
     * Pops the matrix stack into the current matrix
     */
    pop () {
      stackp -= 6
      mat[0] = stack[stackp + 0]
      mat[1] = stack[stackp + 1]
      mat[2] = stack[stackp + 2]
      mat[3] = stack[stackp + 3]
      mat[4] = stack[stackp + 4]
      mat[5] = stack[stackp + 5]
    },

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
    img (texture, x, y, w, h, u0, v0, u1, v1) {
      const x0 = x
      const y0 = y
      const x1 = x + w
      const y1 = y + h
      const x2 = x
      const y2 = y + h
      const x3 = x + w
      const y3 = y
      const a = mat[0]
      const b = mat[1]
      const c = mat[2]
      const d = mat[3]
      const e = mat[4]
      const f = mat[5]
      let offset = 0
      const argb = renderer.col

      if (texture !== currentTexture ||
        count + 1 >= MAX_BATCH) {
        glBufferSubData(34962, 0, vertexData)
        glDrawElements(4, count * VERTICES_PER_QUAD, 5123, 0)
        count = 0
        if (currentTexture !== texture) {
          currentTexture = texture
          glBindTexture(3553, currentTexture)
        }
      }

      offset = count * VERTEX_SIZE
      // Vertex Order
      // Vertex Position | UV | ARGB
      // Vertex 1
      vPositionData[offset++] = x0 * a + y0 * c + e
      vPositionData[offset++] = x0 * b + y0 * d + f
      vPositionData[offset++] = u0
      vPositionData[offset++] = v0
      vColorData[offset++] = argb

      // Vertex 2
      vPositionData[offset++] = x1 * a + y1 * c + e
      vPositionData[offset++] = x1 * b + y1 * d + f
      vPositionData[offset++] = u1
      vPositionData[offset++] = v1
      vColorData[offset++] = argb

      // Vertex 3
      vPositionData[offset++] = x2 * a + y2 * c + e
      vPositionData[offset++] = x2 * b + y2 * d + f
      vPositionData[offset++] = u0
      vPositionData[offset++] = v1
      vColorData[offset++] = argb

      // Vertex 4
      vPositionData[offset++] = x3 * a + y3 * c + e
      vPositionData[offset++] = x3 * b + y3 * d + f
      vPositionData[offset++] = u1
      vPositionData[offset++] = v0
      vColorData[offset++] = argb

      if (++count >= MAX_BATCH) {
        glBufferSubData(34962, 0, vertexData)
        glDrawElements(4, count * VERTICES_PER_QUAD, 5123, 0)
        count = 0
      }
    },

    /**
     * Pushes the current batch information to the GPU for rendering
     */
    flush () {
      if (count === 0) return
      glBufferSubData(34962, 0, vPositionData.subarray(0, count * VERTEX_SIZE))
      glDrawElements(4, count * VERTICES_PER_QUAD, 5123, 0)
      count = 0
    }
  }
  return renderer
}

export { CreateTexture }
export default TinyCanvas
