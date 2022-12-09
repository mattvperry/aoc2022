import { readInputLines } from '../shared/utils';

type Dir = 'R' | 'L' | 'U' | 'D';
type Move = [Dir, number];
type Knot = { x: number, y: number, next: Knot | null };

const delta: Record<Dir, [number, number]> = {
    R: [1, 0],
    L: [-1, 0],
    U: [0, 1],
    D: [0, -1],
};

const parse = (line: string): Move => [line[0] as Dir, parseInt(line.substring(2), 10)];

const createRope = (length: number): Knot => {
    const head: Knot = { x: 0, y: 0, next: null };
    let tail = head;
    for (let i = 1; i < length; ++i) {
        tail.next = { x: 0, y: 0, next: null };
        tail = tail.next;
    }

    return head;
};

const move = (knot: Knot, [dx, dy]: [number, number]): void => {
    knot.x += dx;
    knot.y += dy;
};

const day9 = (moves: Move[], size: number): number => {
    const visited = new Set<string>(['0_0']);
    const head = createRope(size);

    for (const [dir, count] of moves) {
        for (let i = 0; i < count; ++i) {
            move(head, delta[dir]);

            let [prev, curr] = [head, head.next];
            while (curr !== null) {
                const [dx, dy] = [prev.x - curr.x, prev.y - curr.y];
                move(curr, [
                    Math.abs(dx) > 1 ? Math.sign(dx) : 0,
                    Math.abs(dy) > 1 ? Math.sign(dy) : 0
                ]);

                [prev, curr] = [curr, curr.next];
            }

            visited.add(`${prev.x}_${prev.y}`);
        }
    }

    return visited.size;
};

(async () => {
    const input = await readInputLines('day9');
    const moves = input.map(parse);

    console.log(day9(moves, 2));
    console.log(day9(moves, 10));
})();
