import { intersect, readInputLines, splitAt, splitEvery, sumBy } from '../shared/utils';

const prio = (char: string): number =>
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(char) + 1;

const part1 = (input: string[]): number => {
    const sacks = input.map(
        i => splitAt(i, i.length / 2).map(c => new Set<string>(c))
    );

    return sumBy(sacks, ([a, b]) => {
        const [x] = intersect(a, b);
        return prio(x);
    });
};

const part2 = (input: string[]): number => {
    const sacks = input.map(s => new Set<string>(s));

    return sumBy(splitEvery(sacks, 3), ([a, b, c]) => {
        const [x] = intersect(intersect(a, b), c);
        return prio(x);
    });
};

(async () => {
    const input = await readInputLines('day3');

    console.log(part1(input));
    console.log(part2(input));
})();
