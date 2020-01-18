import * as c from "./components";
import { make } from "./tools";

export function createPlayer() {
    return [
        make(c.Player, c => {
        }),
        make(c.Type, c => {
            c.typeName = 'player';
        }),
        make(c.Position, c => {
            c.x = 0;
            c.y = 0;
        }),
        make(c.MoveDirection, c => {
            c.erase();
        }),
        make(c.Glyph, c => {
            c.fgColor = 'white';
            c.bgColor = 'black';
            c.symbol = '@';
            c.zLevel = 1000;
        }),
        make(c.Stats, c => {
            Object.assign(c.healthPoints, {
                current: 100,
                base: 100,
                perLevel: 10,
            });
        })
    ];
}
