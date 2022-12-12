import { map, readInputLines, splitOnEvery } from '../shared/utils';

type Worry = number;
type Monkey = {
    items: Worry[];
    inspected: number;
    op: (item: number) => number;
    test: number;
    ifTrue: number;
    ifFalse: number;
};

const parse = (group: string[]): Monkey => {
    const items = group[1].split(': ')[1].split(', ').map(i => parseInt(i, 10));
    const op = group[2].split('old ')[1].split(' ');
    const test = parseInt(group[3].split('by ')[1], 10);
    const ifTrue = parseInt(group[4].split('monkey ')[1], 10);
    const ifFalse = parseInt(group[5].split('monkey ')[1], 10);

    return {
        items,
        inspected: 0,
        op: old => op[0] === '+'
            ? old + (op[1] === 'old' ? old : parseInt(op[1], 10))
            : old * (op[1] === 'old' ? old : parseInt(op[1], 10)),
        test,
        ifTrue,
        ifFalse,
    }
};

const part1 = (item: number): number => Math.floor(item / 3);

const part2 = (item: number): number => item % 9699690;

const day11 = (monkeys: Monkey[], rounds: number, reduction: (i: number) => number): number => {
    for (let i = 0; i < rounds; ++i) {
        for (const monkey of monkeys) {
            for (const item of monkey.items) {
                const worry = reduction(monkey.op(item));
                const m = worry % monkey.test === 0
                    ? monkey.ifTrue
                    : monkey.ifFalse;
                monkeys[m].items.push(worry);
            }

            monkey.inspected += monkey.items.length;
            monkey.items = [];
        }
    }

    const [x, y] = monkeys.map(m => m.inspected).sort((a, b) => b - a);
    return x * y;
};

(async () => {
    const input = await readInputLines('day11');
    const monkeys = Array.from(splitOnEvery(input, ""));

    console.log(day11(monkeys.map(parse), 20, part1));
    console.log(day11(monkeys.map(parse), 10000, part2));
})();