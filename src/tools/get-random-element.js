/**
 * @param {T[]} a 
 * @returns {T}
 * @template T
 */
export default function getRandomElement(a) {
    if (!a.length) {
        throw "No elements!";
    }
    return a[Math.floor(Math.random() * a.length)];
}
