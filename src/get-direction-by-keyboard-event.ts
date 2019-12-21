import config from "./config";
import Victor = require("victor");

export default function getDirectionByKeyboardEvent(event: KeyboardEvent): Victor {
    return config.directionByKey[event.code];
}
