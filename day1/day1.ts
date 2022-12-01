import { map, readInputLines, splitOnEvery, sumBy } from '../shared/utils';

const parseInput = (lines: string[]): Iterable<number> => map(
    splitOnEvery(lines, ""),
    xs => sumBy(xs, x => parseInt(x, 10))
);

const day1 = (calories: Iterable<number>): number[] => Array
    .from(calories)
    .sort((a, b) => a < b ? 1 : -1);

(async () => {
    const input = await readInputLines('day1');
    const [a, b, c] = day1(parseInput(input));
    
    console.log(a);
    console.log(a + b + c);
})();
