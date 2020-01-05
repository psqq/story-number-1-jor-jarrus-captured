
/**
 * @param {number} a 
 * @param {number} b 
 */
export default function* randint(a = 0, b = null) {
    if (b == null) {
        b = a;
        a = 0;
    }
    return Math.floor(a + Math.random() * (b - a + 1));
}
