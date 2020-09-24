import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as PIXI from 'pixi.js';
import { PixelateFilter } from '@pixi/filter-pixelate';

const app = new PIXI.Application();
document.body.appendChild(app.view);

const detectFace = async (detector, element) => {
  const faces = await detector.detect(element);
  if (!faces) return {};
  if (!faces[0]) return {};

  const boundingBox = faces[0].boundingBox;
  return boundingBox;
};

const createSprite = (element, offset, width, height, x, y) => {
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

let sprite;

const filter = async (element, detector) => {
  const { width, height, x, y } = await detectFace(detector, element);
  sprite = createSprite(element, 1, width, height, x, y);

  setInterval(async () => {
    const { width, height, x, y } = await detectFace(detector, element);
    if (!x || !y) return;

    if (!sprite) {
      console.log('create sprite:', { x, y });
      sprite = createSprite(element, 1, width, height, x, y);
      return;
    }

    console.log('update sprite:', { sprite, x, y });
    sprite.width = width;
    sprite.height = height;
    sprite.position = { x: x + width / 2, y: y + height / 2 };
  }, 1000);
};

const enableVideos = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const video = document.getElementById('video');
  video.srcObject = stream;
  return video;
};

const run = async () => {
  const element = await enableVideos();

  const detector = new FaceDetector({
    fastMode: true,
    maxDetectedFaces: 1,
  });
  element.addEventListener('play', () => filter(element, detector));
};

run();
