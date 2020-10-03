import 'core-js/stable'
import 'regenerator-runtime/runtime'

import * as PIXI from 'pixi.js'
import { PixelateFilter } from '@pixi/filter-pixelate'

const size = { width: 640, height: 480 }
const app = new PIXI.Application({ transparent: true, ...size })
const player = document.getElementById('player')
player.appendChild(app.view)

const detectFace = async (detector, element) => {
  const faces = await detector.detect(element)
  if (!faces) return {}
  if (!faces[0]) return {}

  const boundingBox = faces[0].boundingBox
  return boundingBox
}

const createMaskGraphic = (x, y, width, height) => {
  // Make ellipse mask around face. Texture cannot frame by ellipse or circle?
  // https://pixijs.download/dev/docs/PIXI.Sprite.html#mask
  const graphics = new PIXI.Graphics()
  graphics.beginFill(0xffffff, 1)
  graphics.drawEllipse(x + width / 2, y + height / 2, width / 2, height / 2)
  graphics.endFill()
  // app.stage.addChild(graphics)

  return graphics
}

const createSprite = (element, offset, width, height, x, y) => {
  console.log({ x, y, height, width })
  // Make framed texture from whole element
  // https://pixijs.download/dev/docs/PIXI.Texture.html#constructor
  // const baseTexture = PIXI.Texture.from(element)
  // const texture = new PIXI.Texture(
  //   baseTexture,
  //   new PIXI.Ellipse(x, y, width, height)
  // )
  const texture = PIXI.Texture.from(element)
  const sprite = new PIXI.Sprite(texture)
  sprite.filters = [new PixelateFilter((16 * offset) >> 0)]

  sprite.mask = createMaskGraphic(x, y, width, height)
  app.stage.addChild(sprite)

  return [sprite, texture]
}

let sprite
let texture

const filter = async (element, detector) => {
  const { width, height, x, y } = await detectFace(detector, element)
  if (x || y) {
    const [s, t] = createSprite(element, 1, width, height, x, y)
    sprite = s
    texture = t
  }

  setInterval(async () => {
    const { width, height, x, y } = await detectFace(detector, element)
    if (!x || !y) return

    if (!sprite || !texture) {
      console.log('create sprite:', { x, y })
      const [s, t] = createSprite(element, 1, width, height, x, y)
      sprite = s
      texture = t
      return
    }

    console.log('update sprite:', sprite, { x, y, width, height })
    sprite.mask = createMaskGraphic(x, y, width, height)
  }, 1000)
}

const enableVideos = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true })
  const video = document.getElementById('video')
  video.srcObject = stream
  return video
}

const run = async () => {
  const element = await enableVideos()

  const detector = new FaceDetector({
    fastMode: true,
    maxDetectedFaces: 1,
  })
  element.addEventListener('play', () => filter(element, detector))
}

run()
