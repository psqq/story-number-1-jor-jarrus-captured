export default function getRandomElement<T>(a: T[]): T {
    return a[Math.floor(Math.random() * a.length)];
}