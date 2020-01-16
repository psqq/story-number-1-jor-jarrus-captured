import config from "./config.js";
import Victor from "victor";

/**
 * @param {T} obj
 * @param {(obj: T) => any} cb
 * @returns {T}
 * @template T
 */
export function doWith(obj, cb) {
    cb(obj);
    return obj;
}

/**
 * @param {new (...arg: any) => T} Class
 * @param {(obj: T) => any} cb
 * @template T
 */
export function make(Class, cb) {
    let obj = new Class();
    return doWith(obj, cb);
}

/**
 * @param {KeyboardEvent} event
 * @returns {Victor}
 */
export function getDirectionByKeyboardEvent(event) {
    return config.directionByKeyCode[event.code];
}
