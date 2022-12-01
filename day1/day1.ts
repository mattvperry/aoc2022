import { map, readInputLines, splitOnEvery, sumBy } from '../shared/utils';

const day1 = (lines: string[]): number[] => {
    const calories = map(
        splitOnEvery(lines, ""),
        xs => sumBy(xs, x => parseInt(x, 10))
    );

    return Array
        .from(calories)
        .sort((a, b) => a < b ? 1 : -1);
}

(async () => {
    const input = await readInputLines('day1');
    const [a, b, c] = day1(input);
    
    console.log(a);
    console.log(a + b + c);
})();
