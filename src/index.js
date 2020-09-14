import * as PIXI from "pixi.js";
import image from "./cat.jpeg";
import { PixelateFilter } from "@pixi/filter-pixelate";

const app = new PIXI.Application();
document.body.appendChild(app.view);

// app.loader.add('cat', image).load((loader, resources) => {
//   // const cat = PIXI.Sprite.from('./cat.jpegg', { crossOrigin: true })
//   const cat = new PIXI.Sprite(resources.cat.texture)

//   // Setup the position of the bunny
//   cat.x = app.renderer.width / 2
//   cat.y = app.renderer.height / 2

//   // Rotate around the center
//   cat.anchor.x = 0.5
//   cat.anchor.y = 0.5

//   // Add the bunny to the scene we are building
//   app.stage.addChild(cat)

//   // Listen for frame updates
//   app.ticker.add(() => {
//     // each frame we spin the bunny around a bit
//     cat.rotation += 0.01
//   })
// })

const detectFace = async (element) => {
  const detector = new FaceDetector();
  const faces = await detector.detect(element);
  console.log({ faces });
  faces.forEach(({ boundingBox, landmarks }) => {
    const { width, height, x, y } = boundingBox;
    mask(element, 1, { width, height, x, y });
  });
};

const mask = (element, offset, { width, height, x, y }) => {
  const texture = PIXI.Texture.from(element);
  const sprite = new PIXI.Sprite(texture);
  sprite.texture = texture;
  sprite.width = width;
  sprite.height = height;
  sprite.position = { x: x + width / 2, y: y + height / 2 };
  sprite.filters = [new PixelateFilter((16 * offset) >> 0)];

  app.stage.addChild(sprite);
  return sprite;
};

const video = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const video = document.getElementById("video");
  video.srcObject = stream;

  setInterval(() => detectFace(video), 3 * 1000);
};

video();
