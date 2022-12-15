import { readInputLines, splitAt, sumBy } from '../shared/utils';

type Coord = [number, number];
type Range = [number, number];

const parse = (line: string): [Coord, Coord] => {
    const pieces = line.split(' ');
    const nums = [2, 3, 8, 9].map(i => parseInt(pieces[i].split('=')[1], 10));
    return splitAt(nums, 2) as [Coord, Coord];
};

const coverage = (data: [Coord, Coord][], row: number): Range[] => {
    let ranges: Range[] = [];
    for (const [[sx, sy], [bx, by]] of data) {
        const size = Math.abs(sx - bx) + Math.abs(sy - by) - Math.abs(sy - row);
        if (size >= 0) {
            ranges.push([sx - size, sx + size]);
        }
    }

    return ranges;
};

function merge(ranges: Range[]): Range[] {
    const [first, ...rest] = ranges.sort(([a], [b]) => a - b);
    const stack = [first];
    for (const [currStart, currEnd] of rest) {
        const [topStart, topEnd] = stack[0];
        if (currStart <= topEnd) {
            stack[0] = [topStart, Math.max(currEnd, topEnd)];
        } else {
            stack.unshift([currStart, currEnd]);
        }
    }

    return stack.reverse();
};

const find = (data: [Coord, Coord][]): Coord => {
    for (let r = 0; r <= 4000000; ++r) {
        const ranges = merge(coverage(data, r));
        if (ranges.length === 2) {
            return [ranges[0][1] + 1, r];
        }
    }
    return [0, 0];
};

const part1 = (data: [Coord, Coord][]): number => {
    const ranges = merge(coverage(data, 2000000));
    return sumBy(ranges, ([s, e]) => e - s);
};

const part2 = (data: [Coord, Coord][]): number => {
    const [dx, dy] = find(data);
    return dx * 4000000 + dy;
};

(async () => {
    const input = await readInputLines('day15');
    const data = input.map(parse);

    console.log(part1(data));
    console.log(part2(data));
})();