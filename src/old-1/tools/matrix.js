import range from "./range";

/**
 * @param {number} d1Size 
 * @param {number} d2Size 
 * @param {T} value 
 * @returns {T[][]}
 * @template T
 */
export default function matrix(d1Size, d2Size, value = null) {
    let result = [];
    for (let d1 of range(d1Size)) {
        result[d1] = [];
        for (let d2 of range(d2Size)) {
            result[d1][d2] = value;
        }
    }
    return result;
}
