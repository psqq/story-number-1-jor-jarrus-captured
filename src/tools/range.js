
/**
 * @param {number} a 
 * @param {number} b 
 * @param {number} inc 
 */
export default function* range(a = null, b = null, inc = null) {
    if (!a) {
        return;
    }
    if (!b) {
        b = a;
        a = 0;
    }
    if (!inc) {
        inc = 1;
    }
    if (a < b && inc < 0 || a > b && inc > 0) {
        throw "Infinity range!";
    }
    for (let i = a; i != b; i += inc) {
        yield i;
    }
}
