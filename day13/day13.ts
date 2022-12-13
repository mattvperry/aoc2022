import { map, readInputLines, splitOnEvery } from '../shared/utils';

type Packet = (number | Packet)[];

const parse = (lines: string[]): Iterable<[Packet, Packet]> => {
    const pairs = splitOnEvery(lines, '');
    return map(pairs, ([left, right]) => [JSON.parse(left) as Packet, JSON.parse(right) as Packet]);
};

const ordered = ([l, ...left]: Packet, [r, ...right]: Packet): -1 | 0 | 1 => {
    if (l === undefined && r === undefined) {
        return 0;
    }

    if (l === undefined) {
        return -1;
    }

    if (r === undefined) {
        return 1;
    }

    if (Array.isArray(l) && Array.isArray(r)) {
        const ord = ordered(l, r);
        return ord === 0 ? ordered(left, right) : ord;
    }

    if (typeof l === 'number' && typeof r === 'number') {
        if (l < r) {
            return -1;
        } 
        
        if (r < l) {
            return 1;
        } 
        
        if (l === r) {
            return ordered(left, right);
        }
    }

    if (typeof l === 'number' && Array.isArray(r)) {
        return ordered([[l], ...left], [r, ...right]);
    } 
    
    if (Array.isArray(l) && typeof r === 'number') {
        return ordered([l, ...left], [[r], ...right]);
    }

    throw Error('IMPOSSIBLE');
};

const part1 = (pairs: [Packet, Packet][]): number => {
    let sum = 0;
    for (let i = 0; i < pairs.length; ++i) {
        if (ordered(...pairs[i]) === -1) {
            sum += i + 1;
        }
    }

    return sum;
};

const part2 = (packets: Packet[]): number => {
    const sorted = packets.sort(ordered);

    let prod = 1;
    for (let i = 0; i < sorted.length; ++i) {
        const json = JSON.stringify(sorted[i]);
        if (json === '[[2]]' || json === '[[6]]') {
            prod *= i + 1;
        }
    }

    return prod;
};

(async () => {
    const input = await readInputLines('day13');
    const pairs = Array.from(parse(input));

    console.log(part1(pairs));
    console.log(part2([[[2]], [[6]], ...pairs.flat()]));
})();