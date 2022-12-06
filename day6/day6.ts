import { entries, frequency, readInputLines, splitAt } from '../shared/utils';

const findStart = (input: string, size: number): number => {
    const [first] = splitAt(input, size);
    let seen = new Map<string, number>(entries(frequency(first)));

    for (let i = size; i < input.length; ++i) {
        if (seen.size === size) {
            return i;
        }

        const temp = seen.get(input[i - size]);
        if (temp === 1) {
            seen.delete(input[i - size]);
        } else {
            seen.set(input[i - size], (temp ?? 0) - 1);
        }

        seen.set(input[i], (seen.get(input[i]) ?? 0) + 1);
    }

    return -1;
};

(async () => {
    const [input] = await readInputLines('day6');

    console.log(findStart(input, 4));
    console.log(findStart(input, 14));
})();
