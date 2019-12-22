
export default function textToOneLineString(text: string) {
    return text.split(/\s+/).join(' ').trim();
}
