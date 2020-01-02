import Victor from 'victor';
import range from './range';

/**
 * @param {Victor} position 
 */
export default function* around(position) {
    const dx = [0, 0, 1, 1, 1, -1, -1, -1];
    const dy = [1, -1, 0, 1, -1, 0, 1, -1];
    for(let i of range(8)) {
        yield new Victor(dx[i], dy[i]).add(position);
    }
}
