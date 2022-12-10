import { readInputLines, splitAt, sumBy } from '../shared/utils';

type Op
    = { type: 'noop' }
    | { type: 'addx', x: number };

const parse = (line: string): Op => line === 'noop'
    ? { type: 'noop' }
    : { type: 'addx', x: parseInt(line.substring(5), 10) };

function* signals(ops: Op[]): IterableIterator<number> {
    let x = 1;
    for (const op of ops) {
        yield x;
        if (op.type == 'addx') {
            yield x;
            x += op.x;
        }
    }
}

const part1 = (ss: number[]): number =>
    sumBy([20, 60, 100, 140, 180, 220], x => x * ss[x - 1]);

function* part2(ss: number[]): IterableIterator<string> {
    let row: number[] = []
    do {
        [row, ss] = splitAt(ss, 40);
        yield row.map((s, i) => Math.abs(i - s) <= 1 ? '#' : '.').join('');
    } while (row.length > 0);
}

(async () => {
    const input = await readInputLines('day10');
    const ss = Array.from(signals(input.map(parse)));

    console.log(part1(ss));
    for (const row of part2(ss)) {
        console.log(row);
    }
})();
