import * as c from "./components";
import { make } from "./tools";

export function createPlayer() {
    return [
        make(c.Position, c => {
            c.x = 0;
            c.y = 0;
        }),
        make(c.Glyph, c => {
            c.fgColor = 'white';
            c.bgColor = 'black';
            c.symbol = '@';
            c.zLevel = 1000;
        }),
    ];
}
