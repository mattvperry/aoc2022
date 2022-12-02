import { map, readInputLines, reduce } from '../shared/utils';

type Move = 'R' | 'P' | 'S';
type Plan = 'X' | 'Y' | 'Z';

const points: Record<Move, number> = {
    R: 1,
    P: 2,
    S: 3
};

const outcome = {
    "R_R": 3,
    "R_P": 6,
    "R_S": 0,
    "P_R": 0,
    "P_P": 3,
    "P_S": 6,
    "S_R": 6,
    "S_P": 0,
    "S_S": 3,
}

const parse = (line: string): [Move, Plan] => line
    .replace('A', 'R')
    .replace('B', 'P')
    .replace('C', 'S')
    .split(' ') as [Move, Plan];

const score = (a: Move, b: Move): number => outcome[`${a}_${b}`] + points[b];

const part1: Record<Plan, Move> = {
    X: 'R',
    Y: 'P',
    Z: 'S',
};

const part2: Record<string, Move> = {
    "R_X": "S",
    "R_Y": "R",
    "R_Z": "P",
    "P_X": "R",
    "P_Y": "P",
    "P_Z": "S",
    "S_X": "P",
    "S_Y": "S",
    "S_Z": "R",
};

const day2 = (input: Iterable<[Move, Plan]>): [number, number] => {
    const scores = map(input, ([m, p]) => [
        score(m, part1[p]),
        score(m, part2[`${m}_${p}`])
    ]);

    return reduce(scores, [0, 0], ([acc1, acc2], [curr1, curr2]) => [acc1 + curr1, acc2 + curr2]);
}

(async () => {
    const input = await readInputLines('day2');
    const turns = map(input, parse);
    const [p1, p2] = day2(turns);

    console.log(p1, p2);
})();
