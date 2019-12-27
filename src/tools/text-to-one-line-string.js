
/**
 * @param {string} text 
 */
export default function textToOneLineString(text) {
    return text.split(/\s+/).join(' ').trim();
}
