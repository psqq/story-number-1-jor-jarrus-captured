export default function popRandomElement<T>(a: T[]): T {
    const index = Math.floor(Math.random() * a.length);
    const element = a[index];
    a.splice(index, 1);
    return element;
}