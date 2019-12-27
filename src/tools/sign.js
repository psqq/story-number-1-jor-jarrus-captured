
/**
 * @param {number} x 
 */
export default function sign(x) {
    if (x < 0) {
        return -1;
    }
    if (x < 0) {
        return 1;
    }
    if (x == 0) {
        return 0;
    }
    throw "Omg wtf!?";
}
