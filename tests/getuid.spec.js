import { expect } from 'chai';
import getuid from '../src/tools/getuid';

describe('getuid', () => {
    it('ids must to be unique', () => {
        const id1 = getuid();
        const id2 = getuid();
        expect(id1 == id2).eq(false);
    });
    it('ids must to be unique 100', () => {
        const values = new Set();
        for (let i = 0; i < 100; i++) {
            values.add(getuid());
        }
        expect([...values.values()].length).eq(100);
    });
});
