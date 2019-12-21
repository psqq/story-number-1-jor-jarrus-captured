
export default function* range(a: number = null, b: number = null, inc: number = null) {
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
