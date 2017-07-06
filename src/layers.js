import Entity from './entity'

/**
 * @typedef {Entity[]} Layer
 */

/**
 * @type {Layer[]}
 */
const layers = [
  [], // background
  [], // world
  [], // enemies
  [], // hero
  [], // enemy projectiles
  [], // hero projectiles
  [], // foreground
  [], // in-game UI
  [], // in-game text
  [] //  in-menu UI
]

export default layers

export const layer = {
  BACKGROUND: 0,
  WORLD: 1,
  ENEMIES: 2,
  HERO: 3,
  ENEMY_PROJECTILES: 4,
  HERO_PROJECTILES: 5,
  FOREGROUND: 6,
  UI_IN_GAME: 7,
  TEXT_IN_GAME: 8,
  UI_IN_MENU: 9
}
