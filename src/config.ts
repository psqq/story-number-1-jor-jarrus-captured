
const mapSize = { x: 30, y: 30 };

const config = {
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
        height: mapSize.y,
        fontSize: 16,
        forceSquareRatio: true,
    },
};

export default config;
