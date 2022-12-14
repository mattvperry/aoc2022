import { readInputLines } from '../shared/utils';

type Coord = [number, number];
type CoordS = `${number}_${number}`;
type Grid = Set<CoordS>;

const toCoordS = ([x, y]: Coord): CoordS => `${x}_${y}`;

const parse = (lines: string[]): [Grid, number ] => {
    let max = 0;
    const grid: Grid = new Set<CoordS>();
    for (const line of lines) {
        const coords = line.split(' -> ').map(c => c.split(',').map(x => parseInt(x, 10)) as Coord);
        for (let i = 0; i < coords.length - 1; ++i) {
            const [x1, y1] = coords[i];
            const [x2, y2] = coords[i + 1];
            for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); ++x) {
                grid.add(toCoordS([x, y1]));
            }

            for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); ++y) {
                max = Math.max(max, y);
                grid.add(toCoordS([x1, y]));
            }
        }
    }

    return [grid, max];
};

const dropSand = (grid: Grid, [sandx, sandy]: Coord, stop: (c: Coord) => boolean, has: (c: Coord) => boolean): boolean => {
    while (true) {
        if (stop([sandx, sandy])) {
            return false;
        }

        const moves = ([[0, 1], [-1, 1], [1, 1]] as Coord[])
            .map(([dx, dy]) => [sandx + dx, sandy + dy] as Coord)
            .filter(sand => !has(sand));

        if (moves.length === 0) {
            grid.add(toCoordS([sandx, sandy]));
            return true;
        }

        [sandx, sandy] = moves[0];
    }
};

const day14 = (grid: Grid, stop: (c: Coord) => boolean, has: (c: Coord) => boolean): number => {
    let sand = 0;
    while (true) {
        const dropped = dropSand(grid, [500, 0], stop, has);
        if (!dropped) {
            return sand;
        }

        sand += 1;
    }
};

const part1 = (grid: Grid, max: number) => day14(
    grid,
    ([_, sandy]) => sandy === max,
    c => grid.has(toCoordS(c)),
);

const part2 = (grid: Grid, max: number) => day14(
    grid,
    _ => grid.has(toCoordS([500, 0])),
    ([x, y]) => y === max + 2 || grid.has(toCoordS([x, y])),
);

(async () => {
    const input = await readInputLines('day14');
    const [grid, max] = parse(input);

    console.log(part1(new Set<CoordS>(grid), max));
    console.log(part2(new Set<CoordS>(grid), max));
})();