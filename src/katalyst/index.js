import TinyCanvas from './tinyCanvas'
import Controls from './controls'
import Entity from './entity'
import Game from './game'
import Group from './group'
import Point from './point'
import Rect from './rect'
import Scene from './scene'
import Sprite from './sprite'
import Utils from './utils'

/**
 * Micro game framework
 * @namespace
 * @param {HTMLCanvasElement} canvas
 * @param {string} spriteSource
 * @param {function(Game)} ready
 */
function Katalyst (canvas, spriteSource, ready) {
  const tinyCanvas = new TinyCanvas(canvas)
  const spritesheet = new Image()
  spritesheet.src = spriteSource
  spritesheet.onload = () => {
    const texture = TinyCanvas.CreateTexture(tinyCanvas.g, spritesheet, spritesheet.width, spritesheet.height)
    tinyCanvas.bkg(0.133, 0.125, 0.204)
    const engine = new Game(tinyCanvas, texture)
    ready(engine)
    engine.loop()
  }
}

Katalyst.TinyCanvas = TinyCanvas
Katalyst.Controls = Controls
Katalyst.Entity = Entity
Katalyst.Game = Game
Katalyst.Group = Group
Katalyst.Point = Point
Katalyst.Rect = Rect
Katalyst.Scene = Scene
Katalyst.Sprite = Sprite
Katalyst.Utils = Utils

export default Katalyst
