import range from "./range";

export default function matrix<T>(d1Size: number, d2Size: number, value?: T): T[][] {
    let result = [];
    for(let d1 of range(d1Size)) {
        result[d1] = [];
        for (let d2 of range(d2Size)) {
            result[d1][d2] = value;
        }
    }
    return result;
}
