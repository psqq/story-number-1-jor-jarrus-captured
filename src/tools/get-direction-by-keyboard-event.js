import config from "../config";
import Victor from "victor";

/**
 * @param {KeyboardEvent} event
 * @returns {Victor}
 */
export default function getDirectionByKeyboardEvent(event) {
    return config.directionByKeyCode[event.code];
}
