import { countBy, readInputLines } from '../shared/utils';

type Range = [number, number];

const parse = (line: string): [Range, Range] => line
    .split(',')
    .map(r => r
        .split('-')
        .map(n => parseInt(n, 10))) as [Range, Range];

const part1 = ([[startA, endA], [startB, endB]]: [Range, Range]): boolean => {
    return (startA <= startB && endA >= endB)
        || (startB <= startA && endB >= endA)
};

const part2 = ([[startA, endA], [startB, endB]]: [Range, Range]): boolean => {
    return (startA <= startB && endA >= startB)
        || (startB <= startA && endB >= startA);
};

const day4 = (pairs: [Range, Range][]): [number, number] => [
    countBy(pairs, part1),
    countBy(pairs, part2),
];

(async () => {
    const input = await readInputLines('day4');
    const pairs = input.map(parse);
    const [p1, p2] = day4(pairs);

    console.log(p1);
    console.log(p2);
})();
