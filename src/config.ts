import Victor = require("victor");

const sotryMessage = `
Orc pirates attacked a ship with people and captured them.
Not everyone survived, but those who survived were captured.
The hero of the game was one of the captured. His name is Jor Jarrus.
The captured were imprisoned and sent one at a time to the local dungeons 
to clear them from the goblins living there and guarding many valuable things. 
The orcs themselves only reliably guarded the exit from the cave, so that the 
victims had only one way out - to move deep into the caves.
`.split(/\s+/).join(' ');

const purposeMsg = `Purpose: to save the crew of the ship.`;

const menuScreenMsg = `${sotryMessage}\n\n${purposeMsg}`;

const mapSize = { x: 40, y: 30 };
const mapOffset = { x: 0, y: 1 };

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
    menuScreenMsg,
    mainCssFile: '/assets/style.css',
    directionByKey,
    eps: 1e-5,
    map: {
        offset: mapOffset,
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
    gameSceneBars: {
        top: {
            x: 0,
            y: 0,
        },
        bottom: {
            x: 0,
            y: 1 + mapSize.y,
        }
    },
    rotjsDisplayOptions: {
        width: mapSize.x,
        height: mapSize.y + 2,
        fontSize: 16,
        forceSquareRatio: true,
        fontFamily: 'Typori',
    },
};

export default config;
