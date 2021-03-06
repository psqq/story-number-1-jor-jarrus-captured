import Victor from 'victor';

/** @type {{[key: string]: Victor}} */
const directionByKeyCode = {
  'Period': new Victor(0, 0),
  'KeyH': new Victor(-1, 0),
  'KeyL': new Victor(1, 0),
  'KeyK': new Victor(0, -1),
  'KeyJ': new Victor(0, 1),
  'KeyY': new Victor(-1, -1),
  'KeyU': new Victor(1, -1),
  'KeyB': new Victor(-1, 1),
  'KeyN': new Victor(1, 1),
  'Numpad5': new Victor(0, 0),
  'Numpad4': new Victor(-1, 0),
  'Numpad6': new Victor(1, 0),
  'Numpad8': new Victor(0, -1),
  'Numpad2': new Victor(0, 1),
  'Numpad7': new Victor(-1, -1),
  'Numpad9': new Victor(1, -1),
  'Numpad1': new Victor(-1, 1),
  'Numpad3': new Victor(1, 1),
  'ArrowLeft': new Victor(-1, 0),
  'ArrowRight': new Victor(1, 0),
  'ArrowUp': new Victor(0, -1),
  'ArrowDown': new Victor(0, 1),
};

const defaultSize = {
  width: 20,
  height: 20,
};

export default {
  directionByKeyCode,
  defaultSize,
};
