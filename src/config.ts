import Victor = require("victor");

const enSotryMessage = `
Orc pirates attacked a ship with people and captured them.
Not everyone survived, but those who survived were captured.
The hero of the game was one of the captured. His name is Jor Jarrus.
The captured were imprisoned and sent one at a time to the local dungeons 
to clear them from the goblins living there and guarding many valuable things. 
The orcs themselves only reliably guarded the exit from the cave, so that the 
victims had only one way out - to move deep into the caves.
`;

const ruSotryMessage = `
Пираты орки напали на корабль с людьми и захватили их. 
Выжили не все, а тех кто выжил захватили в плен. 
Герой игры был одним из захваченных в плен. Его имя Джор Джаррус. 
Захваченных посадили в тюрьму и по одному отправляли в 
местные подземелья для расчистки их от гоблинов, живущих 
там и охраняющих множество ценных вещей. Сами орки только 
надежно охраняли выход из пещеры, чтобы у жертв был только 
один выход – продвигаться в глубь пещер.
`;

const enPurposeMsg = `Purpose: to save the crew of the ship.`;

const ruPurposeMsg = `Цель: спасти экипаж корабля.`;

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

const gameSceneTopBar = {
    x: 0,
    y: 0,
    viewX: 0,
    viewY: 0,
    height: 2,
};

const gameSceneBottomBar = {
    x: 0,
    y: gameSceneTopBar.height + mapSize.y,
    viewX: 0,
    viewY: gameSceneTopBar.height + mapSize.y + 1,
    height: 2,
};

const gameSceneBars = {
    top: gameSceneTopBar,
    bottom: gameSceneBottomBar,
};

const config = {
    messages: {
        enSotryMessage,
        ruSotryMessage,
        enPurposeMsg,
        ruPurposeMsg,
    },
    mainCssFile: '/assets/style.css',
    directionByKey,
    eps: 1e-5,
    map: {
        offset: mapOffset,
        size: mapSize,
        cellSize: 1,
        fgColor: 'white',
        bgColor: 'black',
        memorizedColor: {
            fgColor: '#111',
            bgColor: 'black',
        },
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
    gameSceneBars,
    rotjsDisplayOptions: {
        width: mapSize.x,
        height: mapSize.y + gameSceneBars.bottom.height + gameSceneBars.top.height,
        fontSize: 16,
        forceSquareRatio: true,
        fontFamily: 'Typori',
    },
};

export default config;
