import { intersect, readInputLines, reduce } from '../shared/utils';

type Coord = [number, number];
type CoordS = `${number}_${number}`;
type Shape = Coord[];
type Grid = Set<CoordS>;
type State = {
    grid: Grid,
    height: number,
    rocks: number,
    jets: string[],
};

const shapes = ['-', '+', 'L', '|', '*'] as const;

const toCoordS = ([x, y]: Coord): CoordS => `${x}_${y}`;

const top = (cs: Coord[]): number => reduce(cs, 0, (acc, [_, y]) => acc > y ? acc : y);

const spawn = (height: number, shape: typeof shapes[number]): Shape => {
    const bot = height + 4;
    switch (shape) {
        case '-':
            return [[2, bot], [3, bot], [4, bot], [5, bot]];
        case '+':
            return [[3, bot + 2], [2, bot + 1], [3, bot + 1], [4, bot + 1], [3, bot]];
        case 'L':
            return [[4, bot + 2], [4, bot + 1], [2, bot], [3, bot], [4, bot]];
        case '|':
            return [[2, bot + 3], [2, bot + 2], [2, bot + 1], [2, bot]];
        case '*':
            return [[2, bot + 1], [3, bot + 1], [2, bot], [3, bot]];
    }
};

const settle = ({ grid, height, rocks, jets: [jet, ...jets] }: State): State => {
    let shape = spawn(height, shapes[rocks % 5]);
    while (true) {
        // try move with jet
        const dx = jet === '<' ? -1 : 1;
        let ghost: Shape = shape.map(([x, y]) => [x + dx, y] as Coord);
        shape = ghost.every(([x, y]) => !grid.has(toCoordS([x, y])) && x >= 0 && x < 7) ? ghost : shape;
        [jet, ...jets] = [...jets, jet];

        // try move down
        ghost = shape.map(([x, y]) => [x, y - 1]);
        // continue if not blocked
        if (ghost.every(c => !grid.has(toCoordS(c)))) {
            shape = ghost;
            continue;
        }

        // return new state when blocked
        return {
            grid: new Set<CoordS>([...grid, ...shape.map(toCoordS)]),
            height: Math.max(height, top(shape)),
            rocks: rocks + 1,
            jets: [jet, ...jets],
        };
    }
};

const print = ({ grid, height }: Pick<State, 'grid' | 'height'>, cs: Shape = []): void => {
    for (let y = height + 7; y > 0; --y) {
        const row = [0, 1, 2, 3, 4, 5, 6].map(x => {
            const coordS = toCoordS([x, y]);
            return grid.has(coordS)
                ? '#'
                : cs.map(toCoordS).includes(coordS)
                ? '@'
                : '.';
        });
        console.log(`${y.toString().padStart(4, ' ')}: |${row.join('')}|`);
    }
    console.log('   0: +-------+');
    console.log('\n');
};

const part1 = (jets: string): number => {
    let state = {
        grid: new Set<CoordS>([0, 1, 2, 3, 4, 5, 6].map(x => toCoordS([x, 0]))),
        height: 0,
        rocks: 0,
        jets: jets.split(''),
    };

    state = settle(state);
    while (true) {
        if (intersect(state.grid, new Set<CoordS>([0, 1, 2, 3, 4, 5, 6].map(x => toCoordS([x, state.height])))).size === 7) {
            break;
        }
        state = settle(state);
    }

    return state.height;
};

(async () => {
    const [input] = await readInputLines('day17');

    console.log(part1(input));
})();