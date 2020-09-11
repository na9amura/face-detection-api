import * as PIXI from 'pixi.js'
import image from './cat.jpeg'

const app = new PIXI.Application()
document.body.appendChild(app.view)

app.loader.add('cat', image).load((loader, resources) => {
  // const cat = PIXI.Sprite.from('./cat.jpegg', { crossOrigin: true })
  const cat = new PIXI.Sprite(resources.cat.texture)

  // Setup the position of the bunny
  cat.x = app.renderer.width / 2
  cat.y = app.renderer.height / 2

  // Rotate around the center
  cat.anchor.x = 0.5
  cat.anchor.y = 0.5

  // Add the bunny to the scene we are building
  app.stage.addChild(cat)

  // Listen for frame updates
  app.ticker.add(() => {
    // each frame we spin the bunny around a bit
    cat.rotation += 0.01
  })
})
