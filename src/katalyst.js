import TinyCanvas, { CreateTexture } from './tinyCanvas'
import Game from './game'
import Entity from './entity'
import Sprite from './sprite'
import Rect from './rect'

/**
 * Micro game framework
 * @param {HTMLCanvasElement} canvas
 * @param {string} spriteSource
 * @param {function(Game)} ready
 */
function Katalyst (canvas, spriteSource, ready) {
  const tinyCanvas = new TinyCanvas(canvas)
  const spritesheet = new Image()
  spritesheet.src = spriteSource
  spritesheet.onload = () => {
    const texture = CreateTexture(tinyCanvas.g, spritesheet, spritesheet.width, spritesheet.height)
    tinyCanvas.bkg(0.133, 0.125, 0.204)
    const engine = new Game(tinyCanvas, texture)
    ready(engine)
    console.log('loop:start')
    engine.loop()
  }
}

Katalyst.Game = Game
Katalyst.Entity = Entity
Katalyst.Sprite = Sprite
Katalyst.Rect = Rect

export default Katalyst
