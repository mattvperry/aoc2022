import { readInputLines, splitAt, splitOn } from '../shared/utils';

type Move = {
    count: number,
    fromIdx: number,
    toIdx: number,
};

type Stack = string[];

const parseMove = (move: string): Move => {
    const [_, count, __, from, ___ , to] = move.split(' ');
    return { 
        count: parseInt(count, 10),
        fromIdx: parseInt(from, 10) - 1,
        toIdx: parseInt(to, 10) - 1
    };
};

const parseStacks = (s: string[]): Stack[] => {
    const stacks = Array<string[]>(9);
    for (let i = 0; i < 8; ++i) {
        for (let j = 1; j < 34; j += 4) {
            if (s[i][j] === ' ') {
                continue;
            }

            stacks[(j - 1) / 4] = [...(stacks[(j - 1) / 4] ?? []), s[i][j]];
        }
    }
    return stacks;
};

const part1 = (stacks: Stack[], { count, fromIdx, toIdx }: Move): Stack[] => {
    const [temp, rest] = splitAt(stacks[fromIdx], count);
    return stacks.map((s, i) => i === toIdx ? [...temp.reverse(), ...s] : i === fromIdx ? rest : s);
};

const part2 = (stacks: Stack[], { count, fromIdx, toIdx }: Move): Stack[] => {
    const [temp, rest] = splitAt(stacks[fromIdx], count);
    return stacks.map((s, i) => i === toIdx ? [...temp, ...s] : i === fromIdx ? rest : s);
};

const day5 = (stacks: Stack[], moves: Move[]): [string, string] => {
    let p1 = stacks;
    let p2 = stacks
    for (const move of moves) {
        p1 = part1(p1, move);
        p2 = part2(p2, move);
    }

    return [
        p1.map(s => s[0]).join(''),
        p2.map(s => s[0]).join(''),
    ];
};

(async () => {
    const input = await readInputLines('day5');
    const [s, m] = splitOn(input, "");
    const stacks = parseStacks(s);
    const moves = m.map(parseMove);

    console.log(...day5(stacks, moves));
})();
