/**
 * @param {T[]} a 
 * @returns {T}
 * @template T
 */
export default function popRandomElement(a) {
    if (!a.length) {
        throw "No elements!";
    }
    const index = Math.floor(Math.random() * a.length);
    const element = a[index];
    a.splice(index, 1);
    return element;
}