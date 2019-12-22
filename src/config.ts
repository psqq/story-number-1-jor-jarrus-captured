import Victor = require("victor");

const mapSize = { x: 30, y: 30 };

const directionByKey: { [key: string]: Victor } = {
    'KeyH': new Victor(-1, 0),
    'KeyL': new Victor(1, 0),
    'KeyK': new Victor(0, -1),
    'KeyJ': new Victor(0, 1),
    'KeyY': new Victor(-1, -1),
    'KeyU': new Victor(1, -1),
    'KeyB': new Victor(-1, 1),
    'KeyN': new Victor(1, 1),
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

const config = {
    mainCssFile: '/assets/style.css',
    directionByKey,
    eps: 1e-5,
    map: {
        size: mapSize,
        cellSize: 1,
        fgColor: 'grey',
        bgColor: 'black',
        floor: {
            symbol: '.',
            fgColor: 'grey',
            bgColor: 'black',
        },
        wall: {
            symbol: '#',
            fgColor: 'grey',
            bgColor: 'black',
        },
    },
    rotjsDisplayOptions: {
        width: mapSize.x,
        height: mapSize.y + 1,
        fontSize: 16,
        forceSquareRatio: true,
        fontFamily: 'Typori',
    },
};

export default config;
